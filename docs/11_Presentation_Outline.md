# Ten-minute presentation outline

## Slide 1: Title

- BB-IMS: inventory and click-and-collect for Bellbird Books.
- Group T23; 杨世垣, 刘汉, 李宁杰.
- Date.

## Slide 2: Store problem

- Roz cannot see stock without walking the shelves.
- Priya loses special orders at shift change.
- Deniz cannot reconcile used copies with paper receipts.

## Slide 3: Product scope

- New-book catalogue and section inventory.
- Used-book copy record and sale lock.
- Special orders and click-and-collect reservations.
- Supplier import and low-stock list.

## Slide 4: Architecture

- Browser to Node 24 HTTP API to SQLite.
- Zero runtime dependencies.
- One repository for app, tests and documentation.

## Slide 5: Product backlog

- Eight core stories and two stretch stories.
- 42 story points across three sprints.
- Show the Jira board or backlog screenshot.

## Slide 6: Scrum process

- Sprint goals and PM rotation.
- Two stand-ups per week.
- Pull request, non-author review and CI gate.
- Show one sprint review or retrospective note.

## Slide 7: Demonstration

- Show the inventory section filter and empty-section response.
- Sell one used copy and show the second sale is rejected.
- Create a special order and show PENDING.
- Create a reservation and show the stock hold.

## Slide 8: Testing and quality

- Eleven automated tests; all pass.
- One P1 defect found and fixed with a regression test.
- Traceability from stories to test cases.
- Show the test output and defect log.

## Slide 9: Release and handover

- v0.2.0 tag and changelog.
- Clean checkout starts without npm install.
- Health check and README.
- Known limitation: scheduled expiry is stretch.

## Slide 10: Outcomes and lessons

- Core workflows are usable and tested.
- The smaller scope made the release achievable.
- Evidence should be captured during the sprint.
- Next work: expiry job, authentication and SMS.

## Demo script

1. Open the storefront and show the summary cards.
2. Filter Fiction and show the empty-section result.
3. Mark one used copy sold; try again and show the rejection.
4. Create a special order and show the PENDING status.
5. Reserve an in-stock book and show the quantity drop.
6. Open the supplier tab and show the low-stock list.

Keep the demo under three minutes. If the browser fails, use the API responses
and test output already captured in the evidence folder.

## Timing

| Segment | Minutes |
| --- | --- |
| Problem and scope | 2 |
| Architecture and backlog | 2 |
| Scrum process | 2 |
| Demo | 3 |
| Testing and release | 1 |
| Outcomes and lessons | 1 |
