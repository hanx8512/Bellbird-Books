# Bellbird Books Inventory and Pickup Management System

## Project Charter

| Field | Detail |
| --- | --- |
| Project title | Bellbird Books Inventory and Pickup Management System (BB-IMS) |
| Team | Group T23 |
| Team members | 杨世垣, 刘汉, 李宁杰 |
| Unit | ISYS3001 Managing Software Development |
| Assessment | A3 group project |
| Project sponsor / product owner | Roz, owner of Bellbird Books |
| Prepared by | Group T23 |
| Version | 1.0 |
| Status | Baseline for A3 delivery |

## Background and problem statement

Bellbird Books is an independent bookshop that still relies on paper stock
lists and handwritten customer requests. Roz cannot see the current stock
without walking to the shelves. Priya and the front-desk team lose special
orders when a shift ends because requests are written on loose notes. Deniz
tracks second-hand books on paper receipts, so condition, purchase cost and
shelf location are difficult to reconcile with the new-book catalogue.

The team will build a small web application that gives the store one shared view
of new and used stock, customer requests and pickup reservations.

## Business need or justification

The store needs a low-cost system that answers three operational questions:

1. What do we hold in each store section?
2. Which customer is waiting for a title we do not currently hold?
3. Which physical used copy is available, reserved or sold?

Without a shared record, staff repeat manual checks, customer requests are lost
at shift change, and used-book stock cannot be reconciled. A small web
application with a local SQLite database provides a practical demonstration
without adding payment, hardware or cloud-service costs.

## Project objectives

- Deliver a working web application for new-book and used-book inventory.
- Let staff filter stock by store section and safely handle an empty section.
- Record special orders with customer details and an initial `PENDING` state.
- Support click-and-collect reservations with an atomic stock hold.
- Import a supplier CSV and report titles at or below their low-stock threshold.
- Provide automated tests, a clean-checkout start and a tagged release.
- Produce the A3 report, test evidence, acceptance record and presentation.

## Scope and out-of-scope items

### In scope

| Area | Included |
| --- | --- |
| Inventory | New-book catalogue, ISBN, title, author, category, section, quantity and low-stock threshold |
| Used books | One record per physical copy, condition, purchase cost, price, shelf and sale status |
| Search | Case-insensitive partial title and author search, plus ISBN search |
| Orders | Special orders, customer name and phone, initial `PENDING` state |
| Pickup | Click-and-collect reservation, atomic stock hold and cancellation release |
| Suppliers | CSV import for an existing or new ISBN and low-stock reporting |
| Engineering | Node 24 web app, SQLite persistence, automated tests, CI and release notes |
| Assessment | Project charter, backlog, sprint records, test plan, report, acceptance form, lessons learned, peer evaluation and presentation |

### Out of scope

- Online card payment and PCI compliance.
- SMS gateway integration.
- Barcode-scanner hardware drivers.
- High-resolution cover-image storage.
- Multi-store stock transfers and logistics.
- Xero or MYOB accounting integration.
- Customer accounts and public internet deployment.

Any change to this boundary is recorded in `03_Change_Log.md` before work
starts.

## Key stakeholders

| Stakeholder | Interest | Engagement |
| --- | --- | --- |
| Roz, store owner | Remote stock visibility and reorder decisions | Product owner; accepts the release |
| Priya and front-desk staff | Customer requests and pickup workflow | Requirements and usability feedback |
| Deniz, used-book lead | Condition, cost and shelf tracking per copy | Used-book requirements and acceptance |
| Lecturer / tutor | Assessment evidence and academic integrity | Approval, review and formal acceptance |
| Group T23 | Delivery, learning and individual contribution | Sprint planning, reviews and retrospective |

## Project roles and responsibilities

| Member | Primary role | Responsibilities | Cross-review |
| --- | --- | --- | --- |
| 杨世垣 | Project manager, Sprint 1; backend and inventory lead | Backlog priority, sprint planning, new-book catalogue, section inventory, data model | Reviews US-BB-03 and US-BB-09 |
| 刘汉 | Project manager, Sprint 2; full-stack and order-flow lead | Storefront, special orders, reservation state machine, search, acceptance criteria | Reviews US-BB-01, US-BB-04 and US-BB-10 |
| 李宁杰 | Project manager, Sprint 3; QA and configuration lead | CI, used-book copies, sale lock, supplier import, low stock, test evidence, release, clean checkout | Reviews US-BB-02, US-BB-07 and US-BB-08 |

The project manager role rotates by sprint. Each member facilitates one sprint
planning, review and retrospective. The role does not remove delivery
responsibility from the other members.

## Proposed methodology

The team uses a lightweight Scrum process:

- A product backlog with epics, user stories, acceptance criteria, story
  points and priority.
- Three one-week sprints with a sprint goal, selected backlog items and a
  sprint backlog.
- Two 15-minute stand-ups each week.
- A sprint review and retrospective at the end of each sprint.
- A pull request for every story, with one non-author approval and a green CI
  run before merge.
- A short, documented change-control path for scope or tooling changes.

The working agreement is recorded in Jira and in the sprint meeting memos.

## Timeline

The delivery window is three sprints after the approved extension date. The
exact calendar dates are recorded in Jira and the sprint memos.

| Sprint | Main outcome | Planned points |
| --- | --- | --- |
| Sprint 1 | Catalogue, section inventory and used-book record | 15 |
| Sprint 2 | Used-book sale lock, special orders, reservations and supplier import | 16 |
| Sprint 3 | Search, release candidate, regression, clean checkout and handover | 13 |

The original September milestone dates in the A2 planning document are
superseded. The change is recorded as CR-03.

## Deliverables

- Project charter.
- Product backlog and three sprint backlogs in Jira.
- Sprint planning, stand-up, review and retrospective memos.
- Working web application and GitHub repository.
- Test plan, test cases, traceability matrix, actual results and defect log.
- Configuration management plan, change log and procurement RFP.
- Final project report with formal acceptance.
- Lessons learned document.
- Ten-minute presentation and five-minute question-and-answer preparation.
- Individual peer evaluation form.

## Success criteria

- Every core story meets its acceptance criteria.
- An unknown or empty section returns an empty list with HTTP 200.
- Inventory cannot become negative after a reservation.
- A used copy can be sold only once and other copies remain unaffected.
- A special order starts in `PENDING` and records customer name and phone.
- The reservation state machine rejects invalid transitions.
- Supplier import adds stock and reports low-stock titles.
- `npm test` passes and CI is green.
- A clean checkout starts with `npm start` and passes the health check without
  an install step.
- The product owner or assessor records formal acceptance.
- The report, presentation and peer evaluation are submitted on time.

## Assumptions and constraints

- Three part-time developers; planning assumption is about two focused hours
  per person per day.
- Zero budget; only free and open-source tools.
- Node.js 24 is available in the teaching lab.
- SQLite is suitable for a single-store demonstration.
- No external database, payment provider or SMS service is required.
- The application will be demonstrated locally, not deployed to the public
  internet.
- Report prose is written by the team; AI tools follow the A3 Level 2 rules.

## Initial risks

| ID | Risk | Likelihood | Impact | Response |
| --- | --- | --- | --- | --- |
| RK-01 | New-book quantity and used-copy identity are confused | Medium | High | Separate tables and separate API paths; tests for each model |
| RK-02 | Special orders and reservations are confused, causing oversell | Medium | Medium | Separate order types; reservations hold stock, special orders do not |
| RK-03 | Assessment workload causes uneven progress | Medium | Medium | Cross-review, small stories and weekly board review |
| RK-04 | Payment or SMS scope expands and delays the release | Low | High | Keep the out-of-scope list visible and use change control |
| RK-05 | Teaching-lab deployment fails because of external dependencies | Low | High | Zero-dependency runtime and clean-checkout test |
| RK-06 | A story is marked done without test evidence | Medium | High | Definition of Done and traceability matrix |

## Required tools and resources

| Tool | Use | Cost |
| --- | --- | --- |
| GitHub Free and GitHub Actions | Repository, pull requests, CI and release | $0 |
| Node.js 24 | Runtime, HTTP server, SQLite and test runner | $0 |
| SQLite via `node:sqlite` | Local persistence | $0 |
| Jira or GitHub Projects | Backlog, sprint board and reporting | $0 |
| Visual Studio Code | Development | $0 |
| Browser | Demonstration and compatibility check | $0 |

## Approval

| Role | Name | Approval |
| --- | --- | --- |
| Project sponsor / product owner | Roz / lecturer or tutor | __________________ |
| Project manager | 杨世垣 | __________________ |
| Team member | 刘汉 | __________________ |
| Team member | 李宁杰 | __________________ |
| Date | | __________________ |
