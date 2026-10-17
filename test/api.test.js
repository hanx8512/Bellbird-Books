import assert from "node:assert/strict";
import test from "node:test";
import { createApp } from "../src/app.js";

async function withApp(run) {
  const app = createApp({ dbPath: ":memory:", seedData: true });
  const address = await app.listen();
  const base = `http://127.0.0.1:${address.port}`;
  try {
    await run(base, app);
  } finally {
    await app.close();
  }
}

async function request(base, method, path, body) {
  const response = await fetch(`${base}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const text = await response.text();
  let payload = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }
  return { status: response.status, body: payload };
}

async function bookByIsbn(base, isbn) {
  const result = await request(base, "GET", `/api/books?q=${isbn}`);
  assert.equal(result.status, 200);
  assert.equal(result.body.length, 1);
  return result.body[0];
}

test("health and summary endpoints respond", async () => {
  await withApp(async (base) => {
    const health = await request(base, "GET", "/api/health");
    assert.equal(health.status, 200);
    assert.equal(health.body.status, "ok");

    const summary = await request(base, "GET", "/api/summary");
    assert.equal(summary.status, 200);
    assert.equal(summary.body.book_titles, 8);
    assert.ok(summary.body.low_stock_titles >= 3);
  });
});

test("unknown section returns an empty list, not an error", async () => {
  await withApp(async (base) => {
    const result = await request(base, "GET", "/api/books?section=NoSuchSection");
    assert.equal(result.status, 200);
    assert.deepEqual(result.body, []);
  });
});

test("search matches partial title and author text", async () => {
  await withApp(async (base) => {
    const title = await request(base, "GET", "/api/books?q=atomic");
    assert.equal(title.status, 200);
    assert.ok(title.body.some((book) => book.title === "Atomic Habits"));

    const author = await request(base, "GET", "/api/books?q=osman");
    assert.equal(author.status, 200);
    assert.ok(author.body.some((book) => book.title === "The Thursday Murder Club"));

    const missing = await request(base, "GET", "/api/books?q=zzzz-no-match");
    assert.equal(missing.status, 200);
    assert.deepEqual(missing.body, []);
  });
});

test("book creation validates input and rejects duplicate ISBNs", async () => {
  await withApp(async (base) => {
    const invalid = await request(base, "POST", "/api/books", {
      isbn: "9780000000009",
      title: "Invalid quantity",
      author: "Test Author",
      section: "Fiction",
      quantity: -1
    });
    assert.equal(invalid.status, 400);

    const created = await request(base, "POST", "/api/books", {
      isbn: "9780000000009",
      title: "A New Book",
      author: "Test Author",
      category: "Fiction",
      section: "New Arrivals",
      price: 25.5,
      quantity: 2,
      lowStockThreshold: 1
    });
    assert.equal(created.status, 201);
    assert.equal(created.body.quantity, 2);

    const duplicate = await request(base, "POST", "/api/books", {
      isbn: "9780000000009",
      title: "Duplicate",
      author: "Test Author",
      section: "New Arrivals"
    });
    assert.equal(duplicate.status, 409);
  });
});

test("used-book copy can be sold once without affecting another copy", async () => {
  await withApp(async (base) => {
    const before = await request(base, "GET", "/api/used-books?status=AVAILABLE");
    assert.equal(before.status, 200);
    assert.ok(before.body.length >= 2);
    const first = before.body[0];
    const second = before.body[1];

    const sold = await request(base, "POST", `/api/used-books/${first.id}/sell`);
    assert.equal(sold.status, 200);
    assert.equal(sold.body.status, "SOLD");

    const again = await request(base, "POST", `/api/used-books/${first.id}/sell`);
    assert.equal(again.status, 409);

    const secondCopy = await request(base, "GET", `/api/used-books?status=AVAILABLE`);
    assert.ok(secondCopy.body.some((copy) => copy.id === second.id));
  });
});

test("A2 second-hand API aliases remain compatible", async () => {
  await withApp(async (base) => {
    const created = await request(base, "POST", "/api/secondhand", {
      isbn: "9780000000016",
      title: "Legacy Copy",
      author: "Test Author",
      condition: "good",
      cost_price: 5,
      sell_price: 11,
      shelf_location: "L-01"
    });
    assert.equal(created.status, 201);
    assert.ok(created.body.id);

    const sold = await request(
      base,
      "PATCH",
      `/api/secondhand/${created.body.id}/sold`
    );
    assert.equal(sold.status, 200);
    assert.equal(sold.body.ok, true);

    const again = await request(
      base,
      "PATCH",
      `/api/secondhand/${created.body.id}/sold`
    );
    assert.equal(again.status, 400);
  });
});

test("special order starts as PENDING and follows the special-order state machine", async () => {
  await withApp(async (base) => {
    const book = await bookByIsbn(base, "9780553380163");
    const created = await request(base, "POST", "/api/special-orders", {
      customer: { name: "Priya Raman", phone: "0400 111 222" },
      items: [{ bookId: book.id, quantity: 1 }],
      notes: "Customer will collect after the next delivery"
    });
    assert.equal(created.status, 201);
    assert.equal(created.body.status, "PENDING");
    assert.equal(created.body.customer_name, "Priya Raman");
    assert.equal(created.body.items.length, 1);

    const invalid = await request(
      base,
      "PATCH",
      `/api/orders/${created.body.id}/status`,
      { status: "COMPLETED" }
    );
    assert.equal(invalid.status, 400);

    const ordered = await request(
      base,
      "PATCH",
      `/api/orders/${created.body.id}/status`,
      { status: "ORDERED" }
    );
    assert.equal(ordered.status, 200);
    assert.equal(ordered.body.status, "ORDERED");

    const arrived = await request(
      base,
      "PATCH",
      `/api/orders/${created.body.id}/status`,
      { status: "ARRIVED" }
    );
    assert.equal(arrived.status, 200);
    assert.equal(arrived.body.status, "ARRIVED");
  });
});

test("order quantity must be at least one", async () => {
  await withApp(async (base) => {
    const book = await bookByIsbn(base, "9780141988511");
    const special = await request(base, "POST", "/api/special-orders", {
      customer: { name: "Zero Quantity", phone: "0400 000 000" },
      items: [{ bookId: book.id, quantity: 0 }]
    });
    assert.equal(special.status, 400);

    const reservation = await request(base, "POST", "/api/reservations", {
      customer: { name: "Zero Quantity", phone: "0400 000 000" },
      bookId: book.id,
      quantity: 0
    });
    assert.equal(reservation.status, 400);
  });
});

test("reservation holds stock, prevents oversell and releases stock on cancellation", async () => {
  await withApp(async (base) => {
    const book = await bookByIsbn(base, "9780141988511");
    assert.equal(book.quantity, 1);

    const reserved = await request(base, "POST", "/api/reservations", {
      customer: { name: "Alex Lee", phone: "0400 333 444" },
      bookId: book.id,
      quantity: 1
    });
    assert.equal(reserved.status, 201);
    assert.equal(reserved.body.status, "PENDING");

    const afterHold = await request(base, "GET", `/api/books/${book.id}`);
    assert.equal(afterHold.body.quantity, 0);

    const oversell = await request(base, "POST", "/api/reservations", {
      customer: { name: "Sam Taylor", phone: "0400 555 666" },
      bookId: book.id,
      quantity: 1
    });
    assert.equal(oversell.status, 409);

    const cancelled = await request(
      base,
      "PATCH",
      `/api/orders/${reserved.body.id}/status`,
      { status: "CANCELLED" }
    );
    assert.equal(cancelled.status, 200);
    assert.equal(cancelled.body.status, "CANCELLED");

    const afterRelease = await request(base, "GET", `/api/books/${book.id}`);
    assert.equal(afterRelease.body.quantity, 1);
  });
});

test("supplier CSV import adds stock and reports low-stock titles", async () => {
  await withApp(async (base) => {
    const csv = [
      "isbn,title,author,category,section,price,quantity,low_stock_threshold",
      '9781760893330,"The Yield, A Novel",Tara June Winch,Fiction,Fiction,19.99,4,2',
      "9781922330093,The Labyrinth,Amanda Lohrey,Fiction,Fiction,22.99,1,2"
    ].join("\n");

    const imported = await request(base, "POST", "/api/suppliers/import", {
      supplierName: "Kangaroo Distribution",
      contact: "orders@kangaroo.example",
      csv
    });
    assert.equal(imported.status, 200);
    assert.equal(imported.body.imported, 2);
    assert.ok(imported.body.lowStock.some((row) => row.isbn === "9781922330093"));

    const newBook = await bookByIsbn(base, "9781760893330");
    assert.equal(newBook.title, "The Yield, A Novel");
    assert.equal(newBook.quantity, 4);
  });
});

test("static storefront is served", async () => {
  await withApp(async (base) => {
    const response = await fetch(`${base}/`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /Bellbird Books/);
    assert.match(html, /Inventory and click-and-collect/);
  });
});
