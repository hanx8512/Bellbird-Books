const state = {
  books: [],
  used: [],
  orders: []
};

const statusLabels = {
  PENDING: "Pending",
  ORDERED: "Ordered",
  ARRIVED: "Arrived",
  READY: "Ready",
  NOTIFIED: "Notified",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  AVAILABLE: "Available",
  SOLD: "Sold",
  RESERVED: "Reserved"
};

const nextStatuses = {
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

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function money(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function badge(status) {
  const normalized = String(status || "").toUpperCase();
  const tone =
    normalized === "SOLD" || normalized === "CANCELLED"
      ? "danger"
      : normalized === "PENDING" ||
          normalized === "ORDERED" ||
          normalized === "ARRIVED" ||
          normalized === "READY" ||
          normalized === "NOTIFIED"
        ? "warn"
        : "";
  return `<span class="badge ${tone}">${escapeHtml(statusLabels[normalized] || normalized)}</span>`;
}

function toast(message, isError = false) {
  const element = $("#toast");
  element.textContent = message;
  element.style.background = isError ? "#7f2f29" : "#1d2927";
  element.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => element.classList.remove("show"), 3200);
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};
  if (!response.ok) {
    throw new Error(payload.error || `Request failed with ${response.status}`);
  }
  return payload;
}

function fillSelect(select, books) {
  const current = select.value;
  select.innerHTML = books
    .map(
      (book) =>
        `<option value="${book.id}">${escapeHtml(book.title)} · ${escapeHtml(book.section)} · ${book.quantity} in stock</option>`
    )
    .join("");
  if ([...select.options].some((option) => option.value === current)) {
    select.value = current;
  }
}

async function loadSummary() {
  const summary = await api("/api/summary");
  $("#summary-titles").textContent = summary.book_titles;
  $("#summary-copies").textContent = summary.new_copies;
  $("#summary-used").textContent = summary.used_copies_available;
  $("#summary-low").textContent = summary.low_stock_titles;
  $("#summary-orders").textContent = summary.open_orders;
}

async function loadBooks() {
  const query = encodeURIComponent($("#book-search").value.trim());
  const section = encodeURIComponent($("#section-filter").value.trim());
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (section) params.set("section", section);
  state.books = await api(`/api/books?${params.toString()}`);

  const sections = [...new Set(state.books.map((book) => book.section))].sort();
  const filter = $("#section-filter");
  const current = filter.value;
  filter.innerHTML =
    `<option value="">All sections</option>` +
    sections.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join("");
  filter.value = sections.includes(current) ? current : "";

  $("#books-body").innerHTML =
    state.books.length === 0
      ? `<tr><td colspan="7" class="empty">No books match this section or search.</td></tr>`
      : state.books
          .map((book) => {
            const low = Number(book.quantity) <= Number(book.low_stock_threshold);
            return `<tr>
              <td>${escapeHtml(book.title)}</td>
              <td>${escapeHtml(book.author)}</td>
              <td>${escapeHtml(book.section)}</td>
              <td>${escapeHtml(book.isbn)}</td>
              <td class="number">${book.quantity}</td>
              <td class="number">${money(book.price)}</td>
              <td>${low ? `<span class="badge warn">Low stock</span>` : `<span class="badge">In stock</span>`}</td>
            </tr>`;
          })
          .join("");

  $$(".book-select").forEach((select) => fillSelect(select, state.books));
}

async function loadUsed() {
  state.used = await api("/api/used-books");
  $("#used-body").innerHTML =
    state.used.length === 0
      ? `<tr><td colspan="8" class="empty">No used-book copies recorded.</td></tr>`
      : state.used
          .map(
            (copy) => `<tr>
              <td>${escapeHtml(copy.title)}</td>
              <td>${escapeHtml(copy.author)}</td>
              <td>${escapeHtml(copy.condition)}</td>
              <td>${escapeHtml(copy.shelf)}</td>
              <td class="number">${money(copy.cost)}</td>
              <td class="number">${money(copy.price)}</td>
              <td>${badge(copy.status)}</td>
              <td>${copy.status === "AVAILABLE" ? `<button class="secondary sell-button" data-id="${copy.id}" type="button">Mark sold</button>` : ""}</td>
            </tr>`
          )
          .join("");

  $$(".sell-button").forEach((button) => {
    button.addEventListener("click", async () => {
      try {
        await api(`/api/used-books/${button.dataset.id}/sell`, { method: "POST" });
        toast("Used copy marked as sold.");
        await Promise.all([loadUsed(), loadSummary()]);
      } catch (error) {
        toast(error.message, true);
      }
    });
  });
}

async function loadOrders() {
  state.orders = await api("/api/orders");
  $("#orders-body").innerHTML =
    state.orders.length === 0
      ? `<tr><td colspan="7" class="empty">No orders yet.</td></tr>`
      : state.orders
          .map((order) => {
            const allowed = nextStatuses[order.type]?.[order.status] || [];
            const action =
              allowed.length === 0
                ? `<span class="empty">Closed</span>`
                : `<select class="status-select" data-id="${order.id}">
                    ${allowed.map((status) => `<option value="${status}">${escapeHtml(statusLabels[status] || status)}</option>`).join("")}
                  </select>
                  <button class="secondary update-status" data-id="${order.id}" type="button">Update</button>`;
            return `<tr>
              <td>#${order.id}</td>
              <td>${order.type === "SPECIAL_ORDER" ? "Special order" : "Reservation"}</td>
              <td>${escapeHtml(order.customer_name)}<br /><small>${escapeHtml(order.customer_phone)}</small></td>
              <td>${badge(order.status)}</td>
              <td class="number">${order.item_count}</td>
              <td>${escapeHtml(order.created_at)}</td>
              <td class="action-cell">${action}</td>
            </tr>`;
          })
          .join("");

  $$(".update-status").forEach((button) => {
    button.addEventListener("click", async () => {
      const select = document.querySelector(`.status-select[data-id="${button.dataset.id}"]`);
      try {
        await api(`/api/orders/${button.dataset.id}/status`, {
          method: "PATCH",
          body: JSON.stringify({ status: select.value })
        });
        toast(`Order #${button.dataset.id} updated.`);
        await Promise.all([loadOrders(), loadBooks(), loadSummary()]);
      } catch (error) {
        toast(error.message, true);
      }
    });
  });
}

async function loadLowStock() {
  const rows = await api("/api/inventory/low-stock");
  $("#low-body").innerHTML =
    rows.length === 0
      ? `<tr><td colspan="4" class="empty">No titles are below their threshold.</td></tr>`
      : rows
          .map(
            (book) => `<tr>
              <td>${escapeHtml(book.title)}</td>
              <td>${escapeHtml(book.section)}</td>
              <td class="number">${book.quantity}</td>
              <td class="number">${book.low_stock_threshold}</td>
            </tr>`
          )
          .join("");
}

async function refreshAll() {
  await Promise.all([loadSummary(), loadBooks(), loadUsed(), loadOrders(), loadLowStock()]);
}

function formValues(form) {
  return Object.fromEntries(new FormData(form).entries());
}

$("#book-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const values = formValues(event.currentTarget);
    await api("/api/books", { method: "POST", body: JSON.stringify(values) });
    event.currentTarget.reset();
    toast("Book added.");
    await refreshAll();
  } catch (error) {
    toast(error.message, true);
  }
});

$("#used-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const values = formValues(event.currentTarget);
    await api("/api/used-books", { method: "POST", body: JSON.stringify(values) });
    event.currentTarget.reset();
    toast("Used-book copy added.");
    await Promise.all([loadUsed(), loadSummary()]);
  } catch (error) {
    toast(error.message, true);
  }
});

$("#special-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const values = formValues(event.currentTarget);
    await api("/api/special-orders", {
      method: "POST",
      body: JSON.stringify({
        customer: { name: values.name, phone: values.phone },
        items: [{ bookId: Number(values.bookId), quantity: Number(values.quantity) }],
        notes: values.notes
      })
    });
    event.currentTarget.reset();
    toast("Special order created.");
    await Promise.all([loadOrders(), loadSummary()]);
  } catch (error) {
    toast(error.message, true);
  }
});

$("#reservation-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const values = formValues(event.currentTarget);
    await api("/api/reservations", {
      method: "POST",
      body: JSON.stringify({
        customer: { name: values.name, phone: values.phone },
        bookId: Number(values.bookId),
        quantity: Number(values.quantity),
        notes: values.notes
      })
    });
    event.currentTarget.reset();
    toast("Reservation created.");
    await Promise.all([loadOrders(), loadBooks(), loadSummary()]);
  } catch (error) {
    toast(error.message, true);
  }
});

$("#supplier-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const values = formValues(event.currentTarget);
    const result = await api("/api/suppliers/import", {
      method: "POST",
      body: JSON.stringify(values)
    });
    toast(`Imported ${result.imported} supplier rows.`);
    await Promise.all([loadBooks(), loadLowStock(), loadSummary()]);
  } catch (error) {
    toast(error.message, true);
  }
});

$$(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    $$(".tab").forEach((item) => item.classList.remove("active"));
    $$(".panel").forEach((panel) => panel.classList.remove("active"));
    tab.classList.add("active");
    $(`#panel-${tab.dataset.tab}`).classList.add("active");
  });
});

let searchTimer;
$("#book-search").addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => loadBooks().catch((error) => toast(error.message, true)), 250);
});

$("#section-filter").addEventListener("change", () =>
  loadBooks().catch((error) => toast(error.message, true))
);

$("#refresh-books").addEventListener("click", () =>
  loadBooks().catch((error) => toast(error.message, true))
);
$("#refresh-used").addEventListener("click", () =>
  loadUsed().catch((error) => toast(error.message, true))
);
$("#refresh-orders").addEventListener("click", () =>
  loadOrders().catch((error) => toast(error.message, true))
);
$("#refresh-low").addEventListener("click", () =>
  loadLowStock().catch((error) => toast(error.message, true))
);

api("/api/health")
  .then(() => {
    const status = $("#status");
    status.classList.add("ok");
    status.innerHTML = `<span class="status-dot"></span><span>Service online</span>`;
  })
  .catch(() => {
    const status = $("#status");
    status.classList.add("error");
    status.innerHTML = `<span class="status-dot"></span><span>Service unavailable</span>`;
  });

refreshAll().catch((error) => toast(error.message, true));
