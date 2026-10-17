# Final Report Evidence Pack

This pack is the writing aid for the 2,000-word group report. It gives each
section its evidence, key facts and owner. Write the prose in your own words.
Do not paste this file into the report without editing and referencing it.

## Suggested word allocation

| Section | Words | Owner |
| --- | --- | --- |
| Title page and table of contents | Not counted | 杨世垣 |
| Executive summary | 150 | 杨世垣 |
| Introduction | 200 | 杨世垣 |
| Project description | 250 | 刘汉 |
| Project execution | 400 | 杨世垣 |
| Testing and quality assurance | 250 | 李宁杰 |
| Deployment and demonstration setup | 120 | 李宁杰 |
| Project outcomes | 130 | 刘汉 |
| Formal acceptance and handover | 140 | 杨世垣 / 李宁杰 |
| Financial summary | 80 | 李宁杰 |
| Project performance analysis | 160 | 杨世垣 / 李宁杰 |
| Challenges and lessons learned | 120 | 李宁杰 |
| Conclusion | 80 | 杨世垣 |
| Appendices | Not counted | All |

Use the headings from the supplied Final Project Report template. Keep the
report close to 2,000 words; appendices and the reference list are separate.

## 1. Title page

- Project title: Bellbird Books Inventory and Pickup Management System
  (BB-IMS).
- Team: Group T23; 杨世垣, 刘汉, 李宁杰.
- Client or stakeholder: Roz, owner of Bellbird Books; lecturer/tutor as
  assessor.
- Date: [submission date].

## 2. Table of contents

List the 16 report sections and appendices with page numbers.

## 3. Executive summary

- Problem: paper stock lists, lost special orders and untracked used copies.
- Product: a local web application for section inventory, used copies,
  special orders and click-and-collect reservations.
- Outcome: eight core stories, eleven automated tests, a tagged release and a
  clean-checkout demonstration.
- Limitation: scheduled expiry for US-BB-08 is a stretch item and did not
  reach v0.2.0.

## 4. Introduction

- Bellbird Books is a single-store independent bookshop.
- Roz needs remote stock visibility by section.
- Priya needs a reliable special-order record across shift changes.
- Deniz needs one record per second-hand copy.
- Scope and exclusions are in `01_Project_Charter.md`.
- The team rebaselined the schedule because the A2 dates were already in the
  past; see CR-03.

## 5. Project description

- Product requirements are the ten user stories in `jira/backlog.csv`.
- Core stories: 01, 02, 03, 04, 06, 07, 09, 10.
- Stretch stories: 05 and 08.
- Architecture: browser, Node 24 HTTP server, SQLite, static storefront.
- Data model: `books`, `used_book_copies`, `customers`, `orders`,
  `order_items`, `suppliers`, `inventory_transactions`.
- The API and quick-start instructions are in `README.md`.

## 6. Project execution

- Three sprints with goals in `jira/sprint_1.csv` to `sprint_3.csv`.
- PM rotation: 杨世垣, 刘汉, 李宁杰.
- Jira board columns: To Do, In Progress, In Review, Done.
- Meeting records: `jira/meeting_memos.md`.
- Pull request and CI evidence: `.github/workflows/ci.yml` and GitHub history.
- Tooling change: CR-02 removed Express and Jest in favour of Node built-ins.
- Scope change: CR-01 moved to eight core stories and two stretch stories.

## 7. Testing and quality assurance

- Test plan: `05_Test_Plan.md`.
- Eleven automated tests cover inventory, search, used copies, special orders,
  reservations, supplier import, health and static serving.
- Test cases: `06_Test_Cases.csv`; traceability: `07_Traceability_Matrix.csv`.
- Defect DEF-01: zero quantity was converted to one; fixed with a positive
  integer validator and a regression test.
- Manual browser, compatibility and usability checks: TC-21 and TC-22.
- Known limitation: TC-23 scheduled expiry is not implemented.

## 8. Deployment or demonstration setup

- Requirements: Node.js 24 or later.
- Start: `npm start`.
- Tests: `npm test`.
- URL: `http://127.0.0.1:3000`.
- Database: `data/bbims.db`, created on first start.
- No npm install is required.
- Demonstrate the empty-section response, a used-copy sale, a special order
  and a reservation.

## 9. Project outcomes

- Completed core stories and their acceptance evidence.
- Release v0.2.0 with a changelog and tag.
- Incomplete stretch: US-BB-08 scheduled expiry.
- Comparison with the original scope: the product is smaller, but the core
  store workflows are complete and tested.

## 10. Formal acceptance

- Acceptance evidence: stories, test results, demo, known limitations.
- Outcome options: accepted, accepted with limitations, not accepted yet.
- The assessor or product owner completes `14_Formal_Acceptance_Draft.md`.
- Record any conditions or follow-up actions.

## 11. Handover information

- User guide: README quick start and the demo flow.
- Technical reference: API table, data model and `src/` structure.
- Repository link: https://github.com/hanx8512/Bellbird-Books.
- Known limitation: no authentication and no scheduled expiry job.
- Do not expose the demo database or local environment to the public internet.

## 12. Financial summary

- No formal project budget was used.
- GitHub Free, Node.js, SQLite and the editor are free.
- Estimated cost: $0.
- Resource limitation: three part-time students and a two-day recovery window.

## 13. Project performance analysis

- Scope: eight core stories delivered; two stretch items partly or not
  delivered.
- Schedule: original A2 dates were missed; CR-03 rebaselined the sprint dates.
- Quality: eleven automated tests pass; one P1 defect was found and fixed.
- Teamwork: cross-review and PM rotation; record actual peer feedback.
- Stakeholder satisfaction: record the acceptance review result.
- Risk: zero-dependency tooling reduced lab deployment risk.

## 14. Challenges and lessons learned

- The original plan assumed more implementation time than remained.
- A late start compressed testing and documentation.
- The zero-dependency choice simplified the clean checkout.
- Small, testable stories made the release possible.
- The team should keep evidence current during the sprint, not reconstruct it
  at the end.

## 15. Conclusion

- The core store workflows are demonstrated and tested.
- The release is suitable for a local demonstration.
- Future work: scheduled expiry, authentication, SMS notification and
  multi-store support.

## 16. Appendices

- Test plan, test cases, traceability and defect log.
- Jira board and sprint screenshots.
- CI run and release evidence.
- Formal acceptance form.
- Lessons learned.
- GitHub link and meeting notes.
- GenAI declaration.

## Evidence capture checklist

- [ ] Jira board and backlog screenshots.
- [ ] Sprint 1-3 screenshots or exports.
- [ ] GitHub pull request with review.
- [ ] CI green run.
- [ ] `npm test` output: 11 passed.
- [ ] Clean-checkout health check output.
- [ ] Browser screenshots for inventory, used books, orders and suppliers.
- [ ] Release tag and GitHub Release.
- [ ] Formal acceptance form.
- [ ] Peer evaluation forms.
