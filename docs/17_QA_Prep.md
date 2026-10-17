# Presentation Q&A preparation

## Likely questions

### Why did you reduce the scope from ten stories to eight?

The original plan assumed more implementation time than remained after the A2
window. We kept the eight stories needed for the core store workflow and
labelled the remaining two as stretch. CR-01 records the reason, impact and
approval.

### Why did you use Node built-ins instead of Express and Jest?

Node 24 provides the HTTP server, SQLite driver and test runner we need. Using
them removes native package builds and network dependencies, which makes the
clean-checkout test reliable. CR-02 records the trade-off.

### How did you estimate story points?

We compared each story with a simple reference story, considered uncertainty,
data-model work and test effort, and reviewed the total against the team's
available capacity. The backlog records 42 points across three sprints.

### How do you know an empty section does not crash?

TC-02 calls `/api/books?section=NoSuchSection` and asserts HTTP 200 with `[]`.
The browser also shows an empty-state message. The test is in the automated
suite and in the traceability matrix.

### How do you prevent two staff members from selling the same used copy?

The sale update includes `WHERE id = ? AND status = 'AVAILABLE'`. The first
request changes the status to `SOLD`; the second request finds no available row
and returns HTTP 409. TC-09 and TC-10 cover this.

### How do special orders differ from reservations?

A special order records a customer request for a title the store does not
hold. It starts in `PENDING` and does not hold current stock. A reservation
holds an in-stock copy atomically and releases it if the order is cancelled.

### What is the most important defect you found?

DEF-01: quantity zero was accepted and converted to one. We added a
positive-integer validator and a regression test. The full suite passes after
the fix.

### What is still incomplete?

US-BB-08 scheduled expiry is a stretch item. v0.2.0 records the 14-day due date
and releases stock on cancellation, but does not run a scheduled job.

### What did each member contribute?

Use the actual contribution record and peer evaluation. Do not invent work.
The project charter records the planned roles; the report should record the
actual work and use a colour legend for individual contributions.

### Why is the application local-only?

The assessment scope excludes payments, customer accounts and public
deployment. A local SQLite database keeps the demonstration simple and
repeatable. Authentication and HTTPS would be required before public use.

## Demo failure fallback

If the browser fails during the presentation, show the saved API responses and
test output. Explain that the same automated tests run in CI. Do not spend more
than 30 seconds troubleshooting in front of the audience.
