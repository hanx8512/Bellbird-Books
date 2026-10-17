# Jira import guide

Jira site: https://bellbird-t23.atlassian.net
Project: BB-IMS (key BBIMS)

The project already contains the ten stories in `backlog.csv`, three sprints,
story points and sprint assignments. This guide remains as a rebuild record.

The files in this folder are prepared for a CSV import. Jira Cloud field names
vary by project, so map the columns during the import wizard rather than
assuming the default names.

## Recommended import order

1. Create the Jira project and board.
2. Create the epics from `epics.csv`.
3. Import `backlog.csv` as issues.
4. Create Sprint 1, Sprint 2 and Sprint 3.
5. Map the `Sprint` column to the sprint field and move the matching issues.
6. Add the board columns: To Do, In Progress, In Review, Done.
7. Add a custom field for Reviewer if the project does not have one.

## Field mapping

| CSV column | Jira field |
| --- | --- |
| Issue Type | Issue Type |
| Summary | Summary |
| Description | Description |
| Acceptance Criteria | Acceptance Criteria custom field, or append to Description |
| Story Points | Story Points |
| Priority | Priority |
| Assignee | Assignee |
| Reviewer | Reviewer custom field, or a label |
| Sprint | Sprint |
| Labels | Labels |

## Evidence to capture

- Board screenshot with the three sprints.
- Backlog screenshot showing points and priority.
- One issue screenshot showing acceptance criteria and reviewer.
- Sprint report or velocity chart after each sprint.
