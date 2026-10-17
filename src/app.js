import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createDb, seed } from "./db.js";

const PUBLIC_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "public"
);

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const STATUS_TRANSITIONS = {
  SPECIAL_ORDER: {
    PENDING: ["ORDERED", "CANCELLED"],
    ORDERED: ["ARRIVED", "CANCELLED"],
    ARRIVED: ["NOTIFIED", "CANCELLED"],
    NOTIFIED: ["COMPLETED", "CANCELLED"],
    COMPLETED: [],
    CANCELLED: []
  },
  RESERVATION: {
    PENDING: ["READY", "CANCELLED"],
    READY: ["NOTIFIED", "CANCELLED"],
    NOTIFIED: ["COMPLETED", "CANCELLED"],
    COMPLETED: [],
    CANCELLED: []
  }
};

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store"
  });
  res.end(body);
}

function sendText(res, status, body, contentType = "text/plain; charset=utf-8") {
  res.writeHead(status, {
    "Content-Type": contentType,
    "Content-Length": Buffer.byteLength(body)
  });
  res.end(body);
}

async function readJson(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 1_000_000) {
      const error = new Error("Request body is too large");
      error.status = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  if (chunks.length === 0) {
    return {};
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    const error = new Error("Request body must be valid JSON");
    error.status = 400;
    throw error;
  }
}

function requiredString(value, field) {
  if (typeof value !== "string" || value.trim() === "") {
    const error = new Error(`${field} is required`);
    error.status = 400;
    throw error;
  }
  return value.trim();
}

function optionalString(value, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function nonNegativeNumber(value, field, fallback = 0) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    const error = new Error(`${field} must be a non-negative number`);
    error.status = 400;
    throw error;
  }
  return parsed;
}

function nonNegativeInteger(value, field, fallback = 0) {
  const parsed = nonNegativeNumber(value, field, fallback);
  if (!Number.isInteger(parsed)) {
    const error = new Error(`${field} must be a whole number`);
    error.status = 400;
    throw error;
  }
  return parsed;
}

function positiveInteger(value, field, fallback = 1) {
  const parsed = nonNegativeInteger(value, field, fallback);
  if (parsed < 1) {
    const error = new Error(`${field} must be at least 1`);
    error.status = 400;
    throw error;
  }
  return parsed;
}

function transaction(db, work) {
  db.exec("BEGIN IMMEDIATE");
  try {
    const result = work();
    db.exec("COMMIT");
    return result;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"') {
        if (text[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          quoted = false;
        }
      } else {
        field += character;
      }
      continue;
    }

    if (character === '"') {
      quoted = true;
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (character !== "\r") {
      field += character;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((cells) => cells.some((cell) => cell.trim() !== ""));
}

function parseSupplierCsv(text) {
  const rows = parseCsv(text);
  if (rows.length < 2) {
    const error = new Error("CSV must include a header and at least one book row");
    error.status = 400;
    throw error;
  }

  const headers = rows[0].map((header) => header.trim().toLowerCase());
  const requiredHeaders = ["isbn", "title", "author", "section"];
  for (const header of requiredHeaders) {
    if (!headers.includes(header)) {
      const error = new Error(`CSV header is missing ${header}`);
      error.status = 400;
      throw error;
    }
  }

  return rows.slice(1).map((cells, rowIndex) => {
    const record = {};
    headers.forEach((header, index) => {
      record[header] = (cells[index] ?? "").trim();
    });

    const quantity = nonNegativeInteger(
      record.quantity,
      `Row ${rowIndex + 2} quantity`,
      0
    );
    const price = nonNegativeNumber(record.price, `Row ${rowIndex + 2} price`, 0);
    const threshold = nonNegativeInteger(
      record.low_stock_threshold,
      `Row ${rowIndex + 2} low_stock_threshold`,
      3
    );

    return {
      isbn: requiredString(record.isbn, `Row ${rowIndex + 2} isbn`),
      title: requiredString(record.title, `Row ${rowIndex + 2} title`),
      author: requiredString(record.author, `Row ${rowIndex + 2} author`),
      category: optionalString(record.category, "General") || "General",
      section: requiredString(record.section, `Row ${rowIndex + 2} section`),
      price,
      quantity,
      lowStockThreshold: threshold
    };
  });
}

function getBook(db, id) {
  return db.prepare("SELECT * FROM books WHERE id = ?").get(id);
}

function getUsedCopy(db, id) {
  return db.prepare("SELECT * FROM used_book_copies WHERE id = ?").get(id);
}

function getOrder(db, id) {
  const order = db
    .prepare(
      `SELECT o.*, c.name AS customer_name, c.phone AS customer_phone
       FROM orders o
       JOIN customers c ON c.id = o.customer_id
       WHERE o.id = ?`
    )
    .get(id);
  if (!order) {
    return null;
  }

  const items = db
    .prepare(
      `SELECT oi.*, b.title AS book_title, b.isbn AS book_isbn,
              u.title AS used_title, u.shelf AS used_shelf
       FROM order_items oi
       LEFT JOIN books b ON b.id = oi.book_id
       LEFT JOIN used_book_copies u ON u.id = oi.used_copy_id
       WHERE oi.order_id = ?
       ORDER BY oi.id`
    )
    .all(id);

  return { ...order, items };
}

function getOrderStatuses(db, type) {
  if (type === "SPECIAL_ORDER") {
    return ["PENDING", "ORDERED", "ARRIVED", "NOTIFIED", "COMPLETED", "CANCELLED"];
  }
  return ["PENDING", "READY", "NOTIFIED", "COMPLETED", "CANCELLED"];
}

function listLowStock(db) {
  return db
    .prepare(
      `SELECT id, isbn, title, author, section, quantity, low_stock_threshold
       FROM books
       WHERE quantity <= low_stock_threshold
       ORDER BY quantity, title`
    )
    .all();
}

async function serveStatic(req, res, pathname) {
  const requested = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.resolve(PUBLIC_DIR, `.${requested}`);
  if (!filePath.startsWith(`${PUBLIC_DIR}${path.sep}`) && filePath !== PUBLIC_DIR) {
    sendText(res, 403, "Forbidden");
    return true;
  }

  try {
    const data = await fs.promises.readFile(filePath);
    const contentType = MIME_TYPES[path.extname(filePath)] || "application/octet-stream";
    res.writeHead(200, {
      "Content-Type": contentType,
      "Content-Length": data.length,
      "Cache-Control": "no-cache"
    });
    res.end(data);
    return true;
  } catch {
    return false;
  }
}

function createHandler(db) {
  return async function handle(req, res) {
    const url = new URL(req.url, "http://localhost");
    const pathname = decodeURIComponent(url.pathname);

    if (req.method === "GET" && pathname === "/api/health") {
      sendJson(res, 200, { status: "ok", service: "bb-ims", version: "0.2.0" });
      return;
    }

    if (req.method === "GET" && pathname === "/api/summary") {
      const bookSummary = db
        .prepare(
          `SELECT COUNT(*) AS book_titles, COALESCE(SUM(quantity), 0) AS new_copies
           FROM books`
        )
        .get();
      const usedSummary = db
        .prepare(
          `SELECT COUNT(*) AS used_copies_available
           FROM used_book_copies WHERE status = 'AVAILABLE'`
        )
        .get();
      const pending = db
        .prepare(
          `SELECT COUNT(*) AS open_orders
           FROM orders WHERE status NOT IN ('COMPLETED', 'CANCELLED')`
        )
        .get();
      const lowStock = db
        .prepare(
          `SELECT COUNT(*) AS low_stock_titles
           FROM books WHERE quantity <= low_stock_threshold`
        )
        .get();
      const special = db
        .prepare(
          `SELECT COUNT(*) AS pending_special_orders
           FROM orders WHERE type = 'SPECIAL_ORDER' AND status = 'PENDING'`
        )
        .get();

      sendJson(res, 200, {
        book_titles: Number(bookSummary.book_titles),
        new_copies: Number(bookSummary.new_copies),
        used_copies_available: Number(usedSummary.used_copies_available),
        open_orders: Number(pending.open_orders),
        low_stock_titles: Number(lowStock.low_stock_titles),
        pending_special_orders: Number(special.pending_special_orders)
      });
      return;
    }

    if (req.method === "GET" && pathname === "/api/books") {
      const section = (url.searchParams.get("section") || "").trim();
      const query = (url.searchParams.get("q") || "").trim();
      let sql =
        `SELECT id, isbn, title, author, category, section, price, quantity,
                low_stock_threshold, created_at
         FROM books WHERE 1 = 1`;
      const parameters = [];

      if (section !== "") {
        sql += " AND lower(section) = lower(?)";
        parameters.push(section);
      }
      if (query !== "") {
        sql +=
          " AND (lower(title) LIKE lower(?) OR lower(author) LIKE lower(?) OR isbn LIKE ?)";
        const pattern = `%${query}%`;
        parameters.push(pattern, pattern, pattern);
      }

      sql += " ORDER BY section, title";
      sendJson(res, 200, db.prepare(sql).all(...parameters));
      return;
    }

    if (req.method === "POST" && pathname === "/api/books") {
      const body = await readJson(req);
      const book = {
        isbn: requiredString(body.isbn, "isbn"),
        title: requiredString(body.title, "title"),
        author: requiredString(body.author, "author"),
        category: optionalString(body.category, "General") || "General",
        section: requiredString(body.section, "section"),
        price: nonNegativeNumber(body.price, "price", 0),
        quantity: nonNegativeInteger(body.quantity, "quantity", 0),
        lowStockThreshold: nonNegativeInteger(
          body.lowStockThreshold ?? body.low_stock_threshold,
          "lowStockThreshold",
          3
        )
      };

      try {
        const result = db
          .prepare(
            `INSERT INTO books
              (isbn, title, author, category, section, price, quantity, low_stock_threshold)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
          )
          .run(
            book.isbn,
            book.title,
            book.author,
            book.category,
            book.section,
            book.price,
            book.quantity,
            book.lowStockThreshold
          );
        const id = Number(result.lastInsertRowid);
        sendJson(res, 201, getBook(db, id));
      } catch (error) {
        if (String(error.message).includes("UNIQUE")) {
          sendJson(res, 409, { error: "A book with this ISBN already exists" });
          return;
        }
        throw error;
      }
      return;
    }

    const bookMatch = pathname.match(/^\/api\/books\/(\d+)$/);
    if (req.method === "GET" && bookMatch) {
      const book = getBook(db, Number(bookMatch[1]));
      if (!book) {
        sendJson(res, 404, { error: "Book not found" });
        return;
      }
      sendJson(res, 200, book);
      return;
    }

    if (req.method === "GET" && pathname === "/api/used-books") {
      const status = (url.searchParams.get("status") || "").trim().toUpperCase();
      const sql =
        status === ""
          ? "SELECT * FROM used_book_copies ORDER BY status, title, id"
          : "SELECT * FROM used_book_copies WHERE status = ? ORDER BY title, id";
      sendJson(res, 200, status === "" ? db.prepare(sql).all() : db.prepare(sql).all(status));
      return;
    }

    if (req.method === "POST" && pathname === "/api/used-books") {
      const body = await readJson(req);
      const condition = requiredString(body.condition, "condition").toUpperCase();
      if (!["POOR", "GOOD", "MINT"].includes(condition)) {
        sendJson(res, 400, { error: "condition must be POOR, GOOD or MINT" });
        return;
      }

      const result = db
        .prepare(
          `INSERT INTO used_book_copies
            (title, author, condition, cost, price, shelf, status)
           VALUES (?, ?, ?, ?, ?, ?, 'AVAILABLE')`
        )
        .run(
          requiredString(body.title, "title"),
          requiredString(body.author, "author"),
          condition,
          nonNegativeNumber(body.cost, "cost", 0),
          nonNegativeNumber(body.price, "price", 0),
          requiredString(body.shelf, "shelf")
        );
      sendJson(res, 201, getUsedCopy(db, Number(result.lastInsertRowid)));
      return;
    }

    const sellMatch = pathname.match(/^\/api\/used-books\/(\d+)\/sell$/);
    if (req.method === "POST" && sellMatch) {
      const id = Number(sellMatch[1]);
      const copy = getUsedCopy(db, id);
      if (!copy) {
        sendJson(res, 404, { error: "Used book copy not found" });
        return;
      }
      if (copy.status !== "AVAILABLE") {
        sendJson(res, 409, { error: `Copy is already ${copy.status}` });
        return;
      }

      const update = db
        .prepare(
          `UPDATE used_book_copies
           SET status = 'SOLD'
           WHERE id = ? AND status = 'AVAILABLE'`
        )
        .run(id);
      if (Number(update.changes) !== 1) {
        sendJson(res, 409, { error: "Copy was sold by another request" });
        return;
      }

      db.prepare(
        `INSERT INTO inventory_transactions
          (used_copy_id, type, quantity_delta, note)
         VALUES (?, 'USED_COPY_SOLD', -1, ?)`
      ).run(id, `Used copy ${id} sold`);

      sendJson(res, 200, getUsedCopy(db, id));
      return;
    }

    if (req.method === "POST" && pathname === "/api/special-orders") {
      const body = await readJson(req);
      const customer = {
        name: requiredString(body.customer?.name, "customer.name"),
        phone: requiredString(body.customer?.phone, "customer.phone")
      };
      const items = Array.isArray(body.items)
        ? body.items
        : body.bookId
          ? [{ bookId: body.bookId, quantity: body.quantity }]
          : [];
      if (items.length === 0) {
        sendJson(res, 400, { error: "At least one order item is required" });
        return;
      }

      const normalizedItems = items.map((item) => {
        const bookId = Number(item.bookId);
        if (!Number.isInteger(bookId) || !getBook(db, bookId)) {
          const error = new Error(`Book ${item.bookId} was not found`);
          error.status = 400;
          throw error;
        }
        return {
          bookId,
          quantity: positiveInteger(item.quantity, "item.quantity", 1)
        };
      });

      const orderId = transaction(db, () => {
        const customerId = Number(
          db
            .prepare("INSERT INTO customers (name, phone) VALUES (?, ?)")
            .run(customer.name, customer.phone).lastInsertRowid
        );
        const newOrderId = Number(
          db
            .prepare(
              `INSERT INTO orders
                (type, customer_id, status, notes, due_at)
               VALUES ('SPECIAL_ORDER', ?, 'PENDING', ?, NULL)`
            )
            .run(customerId, optionalString(body.notes)).lastInsertRowid
        );
        const insertItem = db.prepare(
          `INSERT INTO order_items (order_id, book_id, quantity)
           VALUES (?, ?, ?)`
        );
        for (const item of normalizedItems) {
          insertItem.run(newOrderId, item.bookId, item.quantity);
        }
        return newOrderId;
      });

      sendJson(res, 201, getOrder(db, orderId));
      return;
    }

    if (req.method === "POST" && pathname === "/api/reservations") {
      const body = await readJson(req);
      const customer = {
        name: requiredString(body.customer?.name, "customer.name"),
        phone: requiredString(body.customer?.phone, "customer.phone")
      };
      const bookId = Number(body.bookId);
      const quantity = positiveInteger(body.quantity, "quantity", 1);
      const book = Number.isInteger(bookId) ? getBook(db, bookId) : null;
      if (!book) {
        sendJson(res, 400, { error: "bookId must refer to an existing book" });
        return;
      }
      if (Number(book.quantity) < quantity) {
        sendJson(res, 409, {
          error: `Only ${book.quantity} copies are available for reservation`
        });
        return;
      }

      const orderId = transaction(db, () => {
        const decrement = db
          .prepare(
            `UPDATE books SET quantity = quantity - ?
             WHERE id = ? AND quantity >= ?`
          )
          .run(quantity, bookId, quantity);
        if (Number(decrement.changes) !== 1) {
          const error = new Error("Stock changed during reservation");
          error.status = 409;
          throw error;
        }

        const customerId = Number(
          db
            .prepare("INSERT INTO customers (name, phone) VALUES (?, ?)")
            .run(customer.name, customer.phone).lastInsertRowid
        );
        const newOrderId = Number(
          db
            .prepare(
              `INSERT INTO orders
                (type, customer_id, status, notes, due_at)
               VALUES ('RESERVATION', ?, 'PENDING', ?, datetime('now', '+14 days'))`
            )
            .run(customerId, optionalString(body.notes)).lastInsertRowid
        );
        db.prepare(
          `INSERT INTO order_items (order_id, book_id, quantity)
           VALUES (?, ?, ?)`
        ).run(newOrderId, bookId, quantity);
        db.prepare(
          `INSERT INTO inventory_transactions
            (book_id, type, quantity_delta, note)
           VALUES (?, 'RESERVATION_HOLD', ?, ?)`
        ).run(bookId, -quantity, `Order ${newOrderId} reserved stock`);
        return newOrderId;
      });

      sendJson(res, 201, getOrder(db, orderId));
      return;
    }

    if (req.method === "GET" && pathname === "/api/orders") {
      const status = (url.searchParams.get("status") || "").trim().toUpperCase();
      const type = (url.searchParams.get("type") || "").trim().toUpperCase();
      let sql =
        `SELECT o.*, c.name AS customer_name, c.phone AS customer_phone,
                (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) AS item_count
         FROM orders o
         JOIN customers c ON c.id = o.customer_id
         WHERE 1 = 1`;
      const parameters = [];
      if (status !== "") {
        sql += " AND o.status = ?";
        parameters.push(status);
      }
      if (type !== "") {
        sql += " AND o.type = ?";
        parameters.push(type);
      }
      sql += " ORDER BY o.created_at DESC, o.id DESC";
      sendJson(res, 200, db.prepare(sql).all(...parameters));
      return;
    }

    const orderMatch = pathname.match(/^\/api\/orders\/(\d+)$/);
    if (req.method === "GET" && orderMatch) {
      const order = getOrder(db, Number(orderMatch[1]));
      if (!order) {
        sendJson(res, 404, { error: "Order not found" });
        return;
      }
      sendJson(res, 200, order);
      return;
    }

    const statusMatch = pathname.match(/^\/api\/orders\/(\d+)\/status$/);
    if (req.method === "PATCH" && statusMatch) {
      const body = await readJson(req);
      const nextStatus = requiredString(body.status, "status").toUpperCase();
      const orderId = Number(statusMatch[1]);
      const order = getOrder(db, orderId);
      if (!order) {
        sendJson(res, 404, { error: "Order not found" });
        return;
      }
      const allowed = STATUS_TRANSITIONS[order.type]?.[order.status] ?? [];
      if (!allowed.includes(nextStatus)) {
        sendJson(res, 400, {
          error: `Cannot move ${order.type} from ${order.status} to ${nextStatus}`,
          allowed
        });
        return;
      }

      transaction(db, () => {
        if (
          order.type === "RESERVATION" &&
          nextStatus === "CANCELLED" &&
          !["COMPLETED", "CANCELLED"].includes(order.status)
        ) {
          const restore = db.prepare(
            "UPDATE books SET quantity = quantity + ? WHERE id = ?"
          );
          const log = db.prepare(
            `INSERT INTO inventory_transactions
              (book_id, type, quantity_delta, note)
             VALUES (?, 'RESERVATION_RELEASED', ?, ?)`
          );
          for (const item of order.items) {
            if (item.book_id) {
              restore.run(item.quantity, item.book_id);
              log.run(
                item.book_id,
                item.quantity,
                `Order ${order.id} cancelled and stock released`
              );
            }
          }
        }
        db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(
          nextStatus,
          orderId
        );
      });

      sendJson(res, 200, getOrder(db, orderId));
      return;
    }

    if (req.method === "GET" && pathname === "/api/inventory/low-stock") {
      sendJson(res, 200, listLowStock(db));
      return;
    }

    if (req.method === "POST" && pathname === "/api/suppliers/import") {
      const body = await readJson(req);
      const supplierName = requiredString(body.supplierName, "supplierName");
      const contact = optionalString(body.contact);
      const records = parseSupplierCsv(requiredString(body.csv, "csv"));

      const result = transaction(db, () => {
        db.prepare(
          `INSERT INTO suppliers (name, contact)
           VALUES (?, ?)
           ON CONFLICT(name) DO UPDATE SET contact = excluded.contact`
        ).run(supplierName, contact);
        const supplier = db
          .prepare("SELECT * FROM suppliers WHERE name = ?")
          .get(supplierName);

        let imported = 0;
        for (const record of records) {
          const existing = db
            .prepare("SELECT * FROM books WHERE isbn = ?")
            .get(record.isbn);
          if (existing) {
            const nextQuantity = Number(existing.quantity) + record.quantity;
            db.prepare(
              `UPDATE books
               SET quantity = ?, price = ?, section = ?, category = ?,
                   low_stock_threshold = ?
               WHERE id = ?`
            ).run(
              nextQuantity,
              record.price || existing.price,
              record.section || existing.section,
              record.category || existing.category,
              record.lowStockThreshold,
              existing.id
            );
            db.prepare(
              `INSERT INTO inventory_transactions
                (book_id, type, quantity_delta, note)
               VALUES (?, 'SUPPLIER_IMPORT', ?, ?)`
            ).run(
              existing.id,
              record.quantity,
              `Imported from ${supplierName}`
            );
          } else {
            const inserted = db
              .prepare(
                `INSERT INTO books
                  (isbn, title, author, category, section, price, quantity,
                   low_stock_threshold)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
              )
              .run(
                record.isbn,
                record.title,
                record.author,
                record.category,
                record.section,
                record.price,
                record.quantity,
                record.lowStockThreshold
              );
            db.prepare(
              `INSERT INTO inventory_transactions
                (book_id, type, quantity_delta, note)
               VALUES (?, 'SUPPLIER_IMPORT', ?, ?)`
            ).run(
              Number(inserted.lastInsertRowid),
              record.quantity,
              `Imported from ${supplierName}`
            );
          }
          imported += 1;
        }
        return { supplier, imported };
      });

      sendJson(res, 200, {
        supplier: result.supplier,
        imported: result.imported,
        lowStock: listLowStock(db)
      });
      return;
    }

    // Legacy A2 API aliases. The A3 UI and test suite use /api/used-books.
    if (req.method === "POST" && pathname === "/api/secondhand") {
      const body = await readJson(req);
      const condition = optionalString(body.condition, "GOOD").toUpperCase();
      if (!["POOR", "GOOD", "MINT"].includes(condition)) {
        sendJson(res, 400, { error: "condition must be POOR, GOOD or MINT" });
        return;
      }
      const result = db
        .prepare(
          `INSERT INTO used_book_copies
            (title, author, condition, cost, price, shelf, status)
           VALUES (?, ?, ?, ?, ?, ?, 'AVAILABLE')`
        )
        .run(
          requiredString(body.title, "title"),
          requiredString(body.author, "author"),
          condition,
          nonNegativeNumber(body.cost_price ?? body.cost, "cost_price", 0),
          nonNegativeNumber(body.sell_price ?? body.price, "sell_price", 0),
          requiredString(body.shelf_location ?? body.shelf, "shelf_location")
        );
      sendJson(res, 201, { id: Number(result.lastInsertRowid) });
      return;
    }

    const legacySellMatch = pathname.match(/^\/api\/secondhand\/(\d+)\/sold$/);
    if (req.method === "PATCH" && legacySellMatch) {
      const id = Number(legacySellMatch[1]);
      const copy = getUsedCopy(db, id);
      if (!copy || copy.status !== "AVAILABLE") {
        sendJson(res, 400, { msg: "该二手书不存在或已经售出" });
        return;
      }
      const update = db
        .prepare(
          `UPDATE used_book_copies
           SET status = 'SOLD'
           WHERE id = ? AND status = 'AVAILABLE'`
        )
        .run(id);
      if (Number(update.changes) !== 1) {
        sendJson(res, 400, { msg: "该二手书不存在或已经售出" });
        return;
      }
      db.prepare(
        `INSERT INTO inventory_transactions
          (used_copy_id, type, quantity_delta, note)
         VALUES (?, 'USED_COPY_SOLD', -1, ?)`
      ).run(id, `Legacy A2 sale endpoint marked copy ${id} sold`);
      sendJson(res, 200, { ok: true });
      return;
    }

    if (req.method === "GET" && pathname.startsWith("/api/")) {
      sendJson(res, 404, { error: "API route not found" });
      return;
    }

    if (req.method === "GET") {
      const served = await serveStatic(req, res, pathname);
      if (served) {
        return;
      }
    }

    sendJson(res, 404, { error: "Not found" });
  };
}

export function createApp({
  dbPath = process.env.DB_PATH || "data/bbims.db",
  seedData = true
} = {}) {
  const db = createDb(dbPath);
  if (seedData) {
    seed(db);
  }
  const handler = createHandler(db);
  const server = http.createServer((req, res) => {
    handler(req, res).catch((error) => {
      if (!res.headersSent) {
        sendJson(res, error.status || 500, {
          error: error.status ? error.message : "Internal server error"
        });
      } else {
        res.end();
      }
      if (!error.status) {
        console.error(error);
      }
    });
  });

  return {
    server,
    db,
    listen(port = 0) {
      return new Promise((resolve) => {
        server.listen(port, "127.0.0.1", () => {
          resolve(server.address());
        });
      });
    },
    close() {
      return new Promise((resolve) => {
        server.close(() => {
          try {
            db.close();
          } finally {
            resolve();
          }
        });
      });
    }
  };
}

export { getOrderStatuses };
