# BB-IMS Test Plan

## Purpose

This plan defines how Group T23 will verify that the eight core BB-IMS stories
meet their acceptance criteria, and how the team will record evidence for the
A3 report and formal acceptance.

## Scope

In scope:

- New-book catalogue and section inventory.
- Used-book copy record, condition validation and single-copy sale lock.
- Special orders and initial `PENDING` state.
- Click-and-collect reservation, stock hold and cancellation release.
- Supplier CSV import and low-stock reporting.
- Search, health check, clean-checkout start and release evidence.

Out of scope:

- Payment, SMS, barcode hardware, multi-store transfers and public deployment.
- Load testing beyond a single-store demonstration.
- Security penetration testing.

## Test approach

| Level | Method | Tool | Owner |
| --- | --- | --- | --- |
| Unit and API integration | Automated tests against an in-memory SQLite database | `node:test` and `fetch` | 李宁杰 |
| System | End-to-end workflow through the browser | Chrome and Edge | 刘汉 / 李宁杰 |
| Compatibility | Desktop and mobile-width layout check | Browser responsive mode | 刘汉 |
| Usability | Representative user completes a booking or special-order task | Observation and short feedback form | 李宁杰 |
| Acceptance | Product owner or assessor checks the agreed criteria | Acceptance checklist and form | 杨世垣 |

## Test environment

| Item | Value |
| --- | --- |
| Runtime | Node.js 24.19.0 |
| Operating system | Windows 11 |
| Database | SQLite via `node:sqlite`; in-memory for automated tests |
| Browsers | Chrome and Edge, desktop and 390 px mobile width |
| Test command | `npm test` |
| Start command | `npm start` |
| Service URL | `http://127.0.0.1:3000` |

## Test data

- Eight seeded book titles across Fiction, History, Lifestyle, Business,
  Children and Science.
- Four seeded used-book copies with `POOR`, `GOOD` and `MINT` conditions.
- One seeded book with zero quantity (`A Brief History of Time`) for special
  order and oversell tests.
- Supplier CSV with one new ISBN and one existing ISBN.
- Customer test records use clearly fictional names and phone numbers.

## Entry criteria

- The application starts with `npm start`.
- Seed data loads into an empty database.
- The CI workflow is present.
- The story acceptance criteria are visible in Jira.

## Exit criteria

- All core story test cases have a recorded result.
- `npm test` passes with zero failures.
- No P0 or P1 defect remains open.
- An unknown section returns an empty list with HTTP 200.
- Inventory never becomes negative.
- A used copy cannot be sold twice.
- A special order starts in `PENDING`.
- A clean checkout starts without `npm install`.
- The product owner or assessor records an acceptance outcome.

## Defect severity

| Severity | Definition | Response |
| --- | --- | --- |
| P0 | Data loss, inventory corruption or the app cannot start | Stop release; fix and retest |
| P1 | Core workflow blocked or incorrect stock result | Fix before acceptance |
| P2 | Workflow possible with a confusing workaround | Fix in the current sprint if time allows |
| P3 | Cosmetic or documentation issue | Record and schedule |

## Results summary

The automated suite currently contains eleven tests and all eleven pass. One defect
was found during edge-case testing: a zero quantity was converted to one
instead of being rejected. The team added positive-integer validation, added a
regression test and retested the affected order paths. The defect is closed.

Manual browser, compatibility, usability and acceptance checks are recorded in
`06_Test_Cases.csv` and must be completed before submission.

## Traceability

`07_Traceability_Matrix.csv` maps each story to the test cases that cover it.
Every core story has at least two test cases. US-BB-05 and US-BB-08 are stretch
stories and are labelled separately.

## Risks

| Risk | Effect | Response |
| --- | --- | --- |
| Jira is not set up yet | Process evidence is missing | Import `jira/backlog.csv` and capture board screenshots before Sunday |
| Browser check is left to the last day | Layout defects cannot be fixed | Run Chrome and Edge checks on Saturday |
| Report prose is written before evidence is complete | Claims do not match the app | Write the report from the evidence pack, not from memory |
| Stretch story is treated as core | Release looks incomplete | Label US-BB-08 as a known limitation if the scheduled job is not ready |

## Evidence

- `npm test` output saved as text or screenshot.
- CI run link or screenshot.
- Test case results in `06_Test_Cases.csv`.
- Defect record in `08_Defect_Log.csv`.
- Browser screenshots for the main workflows.
- Clean-checkout command output.
- Jira board and sprint screenshots.
