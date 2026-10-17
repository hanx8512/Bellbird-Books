# Bellbird Books Inventory and Pickup Management System

BB-IMS is a small web application for Bellbird Books. It replaces paper stock
lists and handwritten customer requests with one shared view of store inventory,
used-book copies, special orders and click-and-collect reservations.

Repository: https://github.com/hanx8512/Bellbird-Books

The project uses Node.js 24 built-in modules only. It has no npm runtime
dependencies, so a clean checkout starts without an install step.

## Quick start

Requirements: Node.js 24 or later.

```bash
npm start
```

Open <http://127.0.0.1:3000>. The first start creates `data/bbims.db` and loads
seed data. Delete that file to reset the demo database.

Run the automated tests:

```bash
npm test
```

The test suite uses an in-memory SQLite database and does not modify the demo
database.

## What the application does

- Lists new books by store section and returns an empty list for an unknown or
  empty section.
- Tracks each used-book copy separately by condition, cost, price, shelf and
  sale status.
- Creates special orders for titles the store does not hold. A special order
  starts in `PENDING` and records the customer name and phone number.
- Creates click-and-collect reservations, holds stock atomically and releases
  the hold if the order is cancelled.
- Imports a supplier CSV and lists titles at or below their low-stock threshold.
- Shows the current order state and only allows valid next states.

## Architecture

```text
Browser (HTML/CSS/JS)
        |
        | JSON over HTTP
        v
Node 24 http server  --->  node:sqlite database
        |
        +-- public/ static storefront
        +-- src/app.js API routes and validation
        +-- src/db.js schema and seed data
```

The application deliberately uses built-in `node:http`, `node:sqlite` and
`node:test` modules. This avoids native package builds and keeps the clean
checkout test reliable in a teaching lab.

## API

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Service health for CI and deployment checks |
| GET | `/api/summary` | Dashboard totals |
| GET | `/api/books?section=&q=` | Inventory search; unknown section returns `[]` |
| POST | `/api/books` | Create a new book title |
| GET | `/api/books/:id` | Read one book |
| GET | `/api/used-books` | List used-book copies, optionally by status |
| POST | `/api/used-books` | Create one used-book copy |
| POST | `/api/used-books/:id/sell` | Atomically mark one copy as sold |
| POST | `/api/special-orders` | Create a special order in `PENDING` |
| POST | `/api/reservations` | Reserve stock for click-and-collect |
| GET | `/api/orders` | List orders, optionally by status or type |
| GET | `/api/orders/:id` | Read one order and its items |
| PATCH | `/api/orders/:id/status` | Apply a valid state transition |
| POST | `/api/suppliers/import` | Import a supplier CSV |
| GET | `/api/inventory/low-stock` | List titles at or below threshold |

## Data model

| Table | Purpose |
| --- | --- |
| `books` | New-book catalogue and aggregate quantity by section |
| `used_book_copies` | One row per second-hand copy, including condition and shelf |
| `customers` | Customer name and phone for orders |
| `orders` | Special orders and reservations, including current status |
| `order_items` | Books or copies attached to an order |
| `suppliers` | Supplier contact records |
| `inventory_transactions` | Audit trail for stock holds, sales and imports |

## Clean-checkout verification

From a fresh clone:

```bash
node --version
npm test
npm start
```

In a second terminal:

```bash
curl http://127.0.0.1:3000/api/health
```

The expected response is:

```json
{"status":"ok","service":"bb-ims","version":"0.2.0"}
```

Record the command output and a browser screenshot in the A3 evidence folder.

## Team roles

| Member | Role | Main responsibility |
| --- | --- | --- |
| 杨世垣 | Project manager / backend and inventory lead | Sprint planning, new-book catalogue, section inventory |
| 刘汉 | Full-stack developer / order-flow lead | Storefront, special orders, click-and-collect state machine |
| 李宁杰 | QA / used-book and configuration lead | CI, used-book copies, supplier import, test evidence, release |

The PM role rotates by sprint: Sprint 1 杨世垣, Sprint 2 刘汉, Sprint 3
李宁杰. Record the rotation in Jira and the sprint meeting memos.

## A2 prototype files

The repository began as the A2 Bellbird Books prototype. `bookSearch.js` and
`src/routes/secondhand.js` are kept for traceability because they contain the
original US-BB-03 and US-BB-05 work. The A3 runtime uses `src/app.js`,
`src/db.js` and `test/api.test.js`.

The A3 API keeps two compatibility routes from the A2 prototype:

- `POST /api/secondhand` creates one used-book copy.
- `PATCH /api/secondhand/:id/sold` marks one copy sold.

New client code should use `/api/used-books` and
`/api/used-books/:id/sell`.

## A3 evidence map

| Rubric area | Evidence in this repository |
| --- | --- |
| Product backlog | `jira/backlog.csv`, story acceptance criteria and story points |
| SCRUM process | `jira/sprint_*.csv`, `jira/meeting_memos.md`, Git history and PR template |
| Test plan and results | `docs/05_Test_Plan.md`, `docs/06_Test_Cases.csv`, `docs/07_Traceability_Matrix.csv`, `npm test` output |
| Version and release | `CHANGELOG.md`, `docs/09_Release_Checklist.md`, Git tags `v0.1.0` and `v0.2.0` |
| Project report | `docs/10_Final_Report_Evidence_Pack.md` and the report outline |
| Presentation | `presentation/slides.md`, `docs/11_Presentation_Outline.md` |

## Out of scope

- Card payments and PCI compliance.
- SMS gateway integration.
- Barcode-scanner hardware drivers.
- Multi-store stock transfers.
- Accounting-system integration.

## Repository layout

```text
.
├── public/                 Browser UI
├── src/                    API, database schema and seed data
├── test/                   node:test API and static-file tests
├── jira/                   CSV imports and meeting memo templates
├── docs/                   A3 project documents and evidence
├── presentation/           Presentation outline and speaker notes
├── .github/workflows/      Continuous integration
├── server.js               HTTP entry point
├── package.json
└── CHANGELOG.md
```

## Handover notes

- The database is a local SQLite file. Back up `data/bbims.db` before resetting
  or migrating it.
- Change `PORT` or `DB_PATH` in the environment if the default ports or paths
  conflict with the teaching lab.
- The application has no authentication because the assessment scope excludes
  customer accounts and online payments. Do not expose it to the public
  internet without adding authentication and HTTPS.
