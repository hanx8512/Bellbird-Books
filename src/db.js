import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

export const DEFAULT_DB_PATH = "data/bbims.db";

const SCHEMA = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  isbn TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  section TEXT NOT NULL,
  price REAL NOT NULL DEFAULT 0 CHECK (price >= 0),
  quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  low_stock_threshold INTEGER NOT NULL DEFAULT 3 CHECK (low_stock_threshold >= 0),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS used_book_copies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  book_id INTEGER,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('POOR', 'GOOD', 'MINT')),
  cost REAL NOT NULL DEFAULT 0 CHECK (cost >= 0),
  price REAL NOT NULL DEFAULT 0 CHECK (price >= 0),
  shelf TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'AVAILABLE'
    CHECK (status IN ('AVAILABLE', 'RESERVED', 'SOLD')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (book_id) REFERENCES books(id)
);

CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL CHECK (type IN ('SPECIAL_ORDER', 'RESERVATION')),
  customer_id INTEGER NOT NULL,
  status TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  due_at TEXT,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  book_id INTEGER,
  used_copy_id INTEGER,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books(id),
  FOREIGN KEY (used_copy_id) REFERENCES used_book_copies(id)
);

CREATE TABLE IF NOT EXISTS suppliers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  contact TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS inventory_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  book_id INTEGER,
  used_copy_id INTEGER,
  type TEXT NOT NULL,
  quantity_delta INTEGER NOT NULL DEFAULT 0,
  note TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (book_id) REFERENCES books(id),
  FOREIGN KEY (used_copy_id) REFERENCES used_book_copies(id)
);

CREATE INDEX IF NOT EXISTS idx_books_section ON books(section);
CREATE INDEX IF NOT EXISTS idx_books_isbn ON books(isbn);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_type ON orders(type);
`;

export function createDb(dbPath = process.env.DB_PATH || DEFAULT_DB_PATH) {
  if (dbPath !== ":memory:") {
    const directory = path.dirname(path.resolve(dbPath));
    fs.mkdirSync(directory, { recursive: true });
  }

  const db = new DatabaseSync(dbPath);
  db.exec("PRAGMA foreign_keys = ON;");
  db.exec(SCHEMA);
  return db;
}

function insertBook(db, book) {
  db.prepare(
    `INSERT INTO books
      (isbn, title, author, category, section, price, quantity, low_stock_threshold)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    book.isbn,
    book.title,
    book.author,
    book.category,
    book.section,
    book.price,
    book.quantity,
    book.lowStockThreshold
  );
}

export function seed(db) {
  const existing = db.prepare("SELECT COUNT(*) AS count FROM books").get();
  if (Number(existing.count) > 0) {
    return false;
  }

  const books = [
    {
      isbn: "9780143127741",
      title: "The Wright Brothers",
      author: "David McCullough",
      category: "History",
      section: "History",
      price: 24.99,
      quantity: 6,
      lowStockThreshold: 2
    },
    {
      isbn: "9780735211292",
      title: "Atomic Habits",
      author: "James Clear",
      category: "Self-help",
      section: "Lifestyle",
      price: 32.0,
      quantity: 3,
      lowStockThreshold: 2
    },
    {
      isbn: "9780141988511",
      title: "The Four",
      author: "Scott Galloway",
      category: "Business",
      section: "Business",
      price: 22.5,
      quantity: 1,
      lowStockThreshold: 2
    },
    {
      isbn: "9780241988268",
      title: "The Thursday Murder Club",
      author: "Richard Osman",
      category: "Fiction",
      section: "Fiction",
      price: 19.99,
      quantity: 8,
      lowStockThreshold: 3
    },
    {
      isbn: "9781529113396",
      title: "The Book Thief",
      author: "Markus Zusak",
      category: "Fiction",
      section: "Fiction",
      price: 18.99,
      quantity: 2,
      lowStockThreshold: 3
    },
    {
      isbn: "9780141365377",
      title: "The Little Prince",
      author: "Antoine de Saint-Exupery",
      category: "Children",
      section: "Children",
      price: 14.99,
      quantity: 5,
      lowStockThreshold: 2
    },
    {
      isbn: "9780553380163",
      title: "A Brief History of Time",
      author: "Stephen Hawking",
      category: "Science",
      section: "Science",
      price: 21.99,
      quantity: 0,
      lowStockThreshold: 2
    },
    {
      isbn: "9780008272371",
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      category: "Fantasy",
      section: "Fiction",
      price: 17.99,
      quantity: 4,
      lowStockThreshold: 2
    }
  ];

  for (const book of books) {
    insertBook(db, book);
  }

  const usedCopies = [
    {
      title: "The Thursday Murder Club",
      author: "Richard Osman",
      condition: "GOOD",
      cost: 6.0,
      price: 12.0,
      shelf: "F-02"
    },
    {
      title: "The Book Thief",
      author: "Markus Zusak",
      condition: "MINT",
      cost: 8.0,
      price: 15.0,
      shelf: "F-04"
    },
    {
      title: "A Brief History of Time",
      author: "Stephen Hawking",
      condition: "POOR",
      cost: 4.0,
      price: 9.0,
      shelf: "S-01"
    },
    {
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      condition: "GOOD",
      cost: 7.0,
      price: 13.0,
      shelf: "F-07"
    }
  ];

  const insertUsed = db.prepare(
    `INSERT INTO used_book_copies
      (title, author, condition, cost, price, shelf, status)
     VALUES (?, ?, ?, ?, ?, ?, 'AVAILABLE')`
  );
  for (const copy of usedCopies) {
    insertUsed.run(
      copy.title,
      copy.author,
      copy.condition,
      copy.cost,
      copy.price,
      copy.shelf
    );
  }

  db.prepare("INSERT OR IGNORE INTO suppliers (name, contact) VALUES (?, ?)").run(
    "Kangaroo Distribution",
    "orders@kangaroo.example"
  );
  db.prepare("INSERT OR IGNORE INTO suppliers (name, contact) VALUES (?, ?)").run(
    "Local Reads Wholesale",
    "hello@localreads.example"
  );

  return true;
}

export function resetDatabase(db) {
  db.exec(`
    DELETE FROM inventory_transactions;
    DELETE FROM order_items;
    DELETE FROM orders;
    DELETE FROM customers;
    DELETE FROM used_book_copies;
    DELETE FROM books;
    DELETE FROM suppliers;
  `);
}
