# Changelog

All notable changes to BB-IMS are recorded here. The format follows semantic
versioning.

## [0.2.0] - Release candidate

### Added

- Supplier CSV import with ISBN upsert and low-stock reporting.
- Used-book copy tracking with condition, cost, shelf and atomic sale status.
- Special-order creation with customer details and an initial `PENDING` state.
- Click-and-collect reservation with atomic stock hold and release on
  cancellation.
- Automated API tests for inventory, used copies, orders, reservations,
  supplier import and static storefront.
- Project charter, configuration management plan, change log, procurement RFP,
  test plan, traceability matrix, release checklist and presentation outline.

### Changed

- Replaced the planned Express and Jest dependencies with Node 24 built-in
  `http`, `node:sqlite` and `node:test` modules. This removes native package
  builds from the clean-checkout path.
- Rebaselined the delivery scope from ten stories to eight core stories and two
  stretch stories.

## [0.1.0] - First internal demo

### Added

- New-book catalogue and section inventory view.
- Empty-section response returns an empty list.
- Used-book copy listing and sale action.
- Basic order list and status update flow.
- GitHub Actions test workflow.

## [0.0.1] - Repository baseline

### Added

- Initial repository structure.
- SQLite schema and seed data.
- Product backlog and sprint plan drafts.
