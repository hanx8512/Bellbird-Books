# Sprint meeting memos

Replace bracketed fields with the actual date, attendees and decisions. Keep
the notes short enough to review in a stand-up, but specific enough to show
what changed and who owns the next action.

## Sprint 1 planning

- Date: [YYYY-MM-DD]
- Attendees: [杨世垣, 刘汉, 李宁杰]
- Sprint goal: Create a searchable catalogue and section inventory with safe empty-section behaviour.
- Selected stories: US-BB-01, US-BB-02, US-BB-03.
- Capacity: [X] hours; planned points: 15.
- Decisions:
  - Use Node 24 built-in modules to avoid native package installation.
  - Unknown section returns an empty list with HTTP 200.
  - Each used-book copy is a separate row.
- Risks:
  - [Risk and owner]
- Action items:
  - [Action, owner, due date]

## Sprint 1 stand-up

- Date: [YYYY-MM-DD]
- Progress since last stand-up: [What moved]
- Next 24 hours: [What will move]
- Blockers: [Blocker and owner]
- Board changes: [Issue keys moved]

## Sprint 1 review

- Date: [YYYY-MM-DD]
- Demonstrated: [Story and acceptance criterion]
- Feedback: [Stakeholder or team feedback]
- Accepted items: [Issue keys]
- Follow-up: [Defect or change request]

## Sprint 1 retrospective

- Date: [YYYY-MM-DD]
- What worked: [Observation]
- What did not work: [Observation]
- Root cause: [Cause]
- Action: [Action, owner, due date]

## Sprint 2 planning

- Date: [YYYY-MM-DD]
- Attendees: [杨世垣, 刘汉, 李宁杰]
- Sprint goal: Make customer requests and stock holds reliable enough for a store demonstration.
- Selected stories: US-BB-04, US-BB-06, US-BB-07, US-BB-09.
- Capacity: [X] hours; planned points: 16.
- Decisions:
  - Special orders start in PENDING and do not hold current stock.
  - Reservations hold stock atomically and release it on cancellation.
- Risks:
  - [Risk and owner]
- Action items:
  - [Action, owner, due date]

## Sprint 2 review

- Date: [YYYY-MM-DD]
- Demonstrated: [Story and acceptance criterion]
- Feedback: [Stakeholder or team feedback]
- Accepted items: [Issue keys]
- Follow-up: [Defect or change request]

## Sprint 2 retrospective

- Date: [YYYY-MM-DD]
- What worked: [Observation]
- What did not work: [Observation]
- Root cause: [Cause]
- Action: [Action, owner, due date]

## Sprint 3 planning

- Date: [YYYY-MM-DD]
- Attendees: [杨世垣, 刘汉, 李宁杰]
- Sprint goal: Prove the release works from a clean checkout and complete the handover evidence.
- Selected stories: US-BB-10, US-BB-05; stretch US-BB-08.
- Capacity: [X] hours; planned points: 13.
- Decisions:
  - v0.2.0 is the demonstration release.
  - US-BB-08 remains a stretch if the scheduled release job is not ready.
- Action items:
  - [Action, owner, due date]

## Sprint 3 review and retrospective

- Date: [YYYY-MM-DD]
- Demonstrated: [Release, test evidence, clean checkout]
- Accepted items: [Issue keys]
- Known limitations: [Incomplete stretch item or environment limitation]
- What worked: [Observation]
- What did not work: [Observation]
- Action: [Action, owner, due date]
