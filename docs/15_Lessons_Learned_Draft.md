# Lessons Learned

## 1. Project information

| Field | Detail |
| --- | --- |
| Project title | Bellbird Books Inventory and Pickup Management System |
| Project duration | Three one-week sprints after the approved extension |
| Project team | Group T23: 杨世垣, 刘汉, 李宁杰 |
| Date of discussion | 2026-10-19 |
| Participants | Team and, where available, lecturer/tutor or product owner |

## 2. Discussion preparation

The team reviewed the Jira board, Git history, automated test output, the
defect log, browser checks and the acceptance rehearsal. The review compared
planned and actual scope, schedule, quality, teamwork and communication.

## 3. Lessons learned

| Lesson | Impact and root cause | Evidence and recommendation | Action taken |
| --- | --- | --- | --- |
| Planning: the original ten-story plan assumed more time than the team had after the A2 window. | The team had to reduce scope and rebaseline dates because the plan was written before the implementation schedule was confirmed. | CR-01, CR-03 and the Jira backlog. Confirm capacity and calendar dates before committing to a backlog. | Reduced to eight core stories and two stretch stories. |
| Technical: removing third-party runtime packages made the clean checkout more reliable. | The demo can start with Node 24 and no install step. Express and Jest added network and native-build risk. | CR-02, `npm test` and the clean-checkout record. Prefer the smallest tool set that meets the requirement. | Replaced Express and Jest with Node built-ins. |
| Testing: a boundary test found that quantity zero was converted to one. | A special order or reservation could be created with an unintended quantity because the API treated zero as missing. | DEF-01 and TC-13. Test zero, negative, missing and boundary values explicitly. | Added positive-integer validation and a regression test. |
| Teamwork: the PM rotation improved visibility of blockers across roles. | Each member understood the whole board, not only their own story. Responsibility had previously been tied to a fixed role. | PM rotation and sprint memos. Rotate facilitation even when technical roles stay fixed. | Recorded the rotation in the project charter and Jira. |
| Documentation: evidence captured during the sprint was easier to use than evidence reconstructed at the end. | Late capture creates gaps and uncertainty. The report could link directly to tests, pull requests and release records. | Evidence index and traceability matrix. Update the index at every sprint review. | Created a single evidence index for submission. |
| Scope: a stretch story without a scheduled job can look incomplete if it is not labelled. | The release has a clear known limitation because the team did not finish the expiry automation. | TC-23 and the release checklist. Mark stretch items and known limitations explicitly. | Recorded US-BB-08 as a known limitation. |

## 4. Summary

| Field | Detail |
| --- | --- |
| Overall takeaway | A smaller, tested release with current evidence is stronger than a larger release with unfinished stories. |
| How these lessons may improve future projects | Confirm capacity before planning, prefer a simple tool chain, test boundaries, keep evidence current and label incomplete work honestly. |
| Remaining follow-up actions | Schedule the expiry job, add authentication if the app is exposed beyond a local demo, and add SMS notification only if the client approves the scope. |
