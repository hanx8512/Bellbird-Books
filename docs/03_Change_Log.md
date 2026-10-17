# Change Log

## CR-01: Reduce the delivery scope from ten stories to eight core stories and two stretch stories

| Field | Detail |
| --- | --- |
| Date raised | 2026-10-17 |
| Raised by | 杨世垣 |
| Change type | Scope |
| Status | Approved for planning |
| Affected items | Product backlog, sprint plan, report scope, test plan |

### Reason

The team is starting the A3 implementation after the original A2 planning
window. The original ten-story plan assumed more implementation time than the
remaining schedule allows. A smaller core release gives the team enough time to
test, review and document the work instead of leaving several stories partially
finished.

### Impact

- Core stories: US-BB-01, US-BB-02, US-BB-03, US-BB-04, US-BB-06, US-BB-07,
  US-BB-09 and US-BB-10.
- Stretch stories: US-BB-05 and US-BB-08.
- Story points remain 42 in the backlog, but Sprint 3 marks the stretch items
  separately.
- The report must explain the scope decision and the incomplete stretch item.

### Decision

Approved by the current project manager and the three story owners. The change
is recorded in Jira and in the final report's scope and change-management
section.

## CR-02: Replace Express and Jest with Node 24 built-in modules

| Field | Detail |
| --- | --- |
| Date raised | 2026-10-17 |
| Raised by | 李宁杰 |
| Change type | Technical / configuration |
| Status | Approved |
| Affected items | `package.json`, server, tests, CI, README |

### Reason

The original plan used Express and Jest. Installing native or third-party
packages adds network and build risk in the teaching lab. Node 24 provides
`node:http`, `node:sqlite` and `node:test`, which cover the required behaviour
without runtime dependencies.

### Impact

- `npm start` runs without `npm install`.
- CI uses the built-in test runner.
- The README must state Node 24 as the only requirement.
- The report must explain the trade-off: fewer dependencies, but a narrower
  ecosystem and fewer framework conveniences.

### Decision

Approved. The clean-checkout test is the acceptance evidence for this change.

## CR-03: Rebaseline the milestone dates

| Field | Detail |
| --- | --- |
| Date raised | 2026-10-17 |
| Raised by | 杨世垣 |
| Change type | Schedule |
| Status | Approved for planning |
| Affected items | Project charter, Jira sprints, report timeline |

### Reason

The original M1-M5 dates were written during the A2 planning window and are now
in the past. The team has an approved extension but has not yet fixed the new
calendar dates in the planning document.

### Impact

- The project charter now uses three relative sprint windows.
- Jira records the actual sprint start and end dates.
- The report compares the original plan with the rebaselined plan.

### Decision

Approved. Replace relative dates with the extension date before submission.
