# Final Report Writing Worksheet

## How to use this worksheet

Write the final report in your own words. This worksheet gives each section its
word target, the evidence to cite and the analysis question to answer. Do not
paste the worksheet itself into the report.

Target length: 2,000 words for the main report, excluding the title page,
table of contents, reference list and appendices. Use Arial 12, 1.5 line
spacing and APA 7th edition.

## Source of truth

| Item | Value | Evidence |
| --- | --- | --- |
| Product | BB-IMS for Bellbird Books | `README.md`, `01_Project_Charter.md` |
| Scope | 8 core stories + 2 stretch stories | `jira/backlog.csv`, CR-01 |
| Technology | Node 24 built-in `http`, `node:sqlite`, `node:test` | `src/`, CR-02 |
| Automated tests | 11 tests, 11 passed | `submission/evidence/npm-test.txt` |
| Recorded test cases | 24; 22 passed, 2 not run | `06_Test_Cases.csv` |
| Defect | DEF-01: zero quantity converted to one; fixed and retested | `08_Defect_Log.csv` |
| Release | v0.2.0, clean checkout, health check passes | `09_Release_Checklist.md`, `submission/evidence/health-check.txt` |
| GitHub | `https://github.com/hanx8512/Bellbird-Books`, branch `codex/a3-release`, tag `v0.2.0` | GitHub repository |
| Jira Epic | `MSD426GXUST23-1`, `BB-IMS T23 - Bellbird Books inventory and pickup` | SCU Jira |
| Jira backlog | 10 stories in `MSD426GXUST23` | `scu-jira-backlog.png` |
| Sprint evidence | `MSD426GX Sprint 1` has 3 stories / 15 points; 7 stories / 33 points remain in the backlog | SCU Jira |
| Planned sprints | Three-sprint allocation is recorded in `jira/sprint_1.csv` to `sprint_3.csv` | Jira CSV files |

The report should not claim that all three sprints were executed in the SCU
shared space. The SCU space has Sprint 1 populated and the remaining stories in
the backlog. The three-sprint plan is the planning baseline recorded in the
CSV files.

## Word allocation

| Section | Words | Main owner |
| --- | --- | --- |
| 1. Executive summary | 150 | 杨世垣 |
| 2. Introduction | 200 | 杨世垣 |
| 3. Project description | 250 | 刘汉 |
| 4. Project execution | 350 | 杨世垣 |
| 5. Testing and quality assurance | 250 | 李宁杰 |
| 6. Deployment and demonstration setup | 120 | 李宁杰 |
| 7. Project outcomes | 130 | 刘汉 |
| 8. Formal acceptance | 100 | 杨世垣 |
| 9. Handover information | 100 | 李宁杰 |
| 10. Financial summary | 80 | 李宁杰 |
| 11. Project performance analysis | 150 | 杨世垣 / 李宁杰 |
| 12. Challenges and lessons learned | 100 | 李宁杰 |
| 13. Conclusion | 80 | 杨世垣 |

## Section worksheets

| Section | What to establish | Evidence to cite | Analysis question |
| --- | --- | --- | --- |
| 1. Executive summary | The store problem, the product, the outcome and the limitation | Charter, tests, release, SCU Jira | Why does this release matter to Bellbird Books? |
| 2. Introduction | Background, users, objectives, scope and constraints | `01_Project_Charter.md`, CR-01, CR-03 | Which problem is in scope and which is not? |
| 3. Project description | User stories, features, data model, tools and architecture | `jira/backlog.csv`, `README.md` | How does each core feature serve a store workflow? |
| 4. Project execution | Sprint planning, roles, PM rotation, reviews, PR/CI and scope changes | Jira screenshots, sprint CSV, meeting memos, Git history | What did the team actually control when the schedule changed? |
| 5. Testing and QA | Test strategy, cases, traceability, defect and manual checks | `05_Test_Plan.md`, `06_Test_Cases.csv`, `07_Traceability_Matrix.csv`, `08_Defect_Log.csv` | Which evidence proves the core rules work? |
| 6. Deployment and demo setup | Runtime, start command, database, demo flow and fallback | README, health-check evidence, `app-ui-desktop.png` | Can another person reproduce the demo? |
| 7. Project outcomes | Completed stories, release and incomplete stretch item | Jira, CHANGELOG, release checklist | How does the outcome compare with the original scope? |
| 8. Formal acceptance | Evidence reviewed, outcome and conditions | `14_Formal_Acceptance_Draft.md` | What exactly is accepted and by whom? |
| 9. Handover information | User guide, technical reference, repository and limitations | README, GitHub, release notes | What does the next maintainer need to know? |
| 10. Financial summary | Zero-dollar budget and resource constraints | `04_Procurement_RFP.md` | Which free resources made the project possible? |
| 11. Performance analysis | Scope, schedule, quality, teamwork and risk | Jira, tests, defect log, peer feedback | Which performance claim is supported by evidence? |
| 12. Challenges and lessons | Causes, actions, lessons and recommendations | `15_Lessons_Learned_Draft.md`, CR-01/02/03 | What should a future team do differently? |
| 13. Conclusion | Overall result, limitations and future work | Whole evidence pack | What is the honest final position? |

## Draft space

Use this area for notes before writing the prose. Do not copy the notes
directly without editing them into complete sentences.

### Executive summary notes

[Write 3-5 bullet points here.]

### Introduction notes

[Write the problem, users, scope and constraints here.]

### Project description notes

[Write the core stories, data model and architecture here.]

### Project execution notes

[Write the sprint plan, actual delivery, reviews and changes here.]

### Testing notes

[Write the test strategy, coverage, defect and remaining manual checks here.]

### Deployment notes

[Write the start command, database, demo flow and fallback here.]

### Outcomes notes

[Write completed and incomplete items here.]

### Acceptance notes

[Write the reviewer, evidence and outcome here.]

### Handover notes

[Write the user guide, technical reference and limitations here.]

### Financial notes

[Write the zero-dollar budget and resource limits here.]

### Performance notes

[Write the evidence-based performance evaluation here.]

### Lessons notes

[Write the challenge, cause, action and recommendation here.]

### Conclusion notes

[Write the final position and future work here.]

## Individual contribution legend

| Member | Colour | Main contribution |
| --- | --- | --- |
| 杨世垣 | [Choose a colour] | Project management, catalogue, section inventory |
| 刘汉 | [Choose a colour] | Storefront, special orders, reservations, search |
| 李宁杰 | [Choose a colour] | QA, CI, used books, supplier import, test evidence, release |

Use the colours consistently in the report and add a short legend near the
start of the project execution section.

## Final QA checklist

- [ ] The main report is close to 2,000 words.
- [ ] Every factual claim has a file, test result, screenshot or Jira record.
- [ ] The report states that US-BB-08 scheduled expiry is a known limitation.
- [ ] The report does not claim three executed sprints in the SCU space.
- [ ] The report uses the actual Jira Epic and story keys.
- [ ] The report includes the GenAI declaration.
- [ ] The report uses APA 7th edition consistently.
- [ ] The report uses Arial 12 and 1.5 line spacing.
- [ ] The formal acceptance form and peer evaluation are attached separately.
