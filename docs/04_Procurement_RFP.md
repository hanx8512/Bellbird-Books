# Procurement RFP and Tool Evaluation

## Purpose

Bellbird Books needs a low-cost tool set for a three-person student team to
build and demonstrate BB-IMS. This document records the requirements, the
options considered, the evaluation and the selected tools.

## Requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| PR-01 | Source control, pull requests and CI | Must |
| PR-02 | A web runtime available in the teaching lab | Must |
| PR-03 | Local relational persistence without a paid service | Must |
| PR-04 | Automated testing | Must |
| PR-05 | Backlog and sprint tracking | Must |
| PR-06 | Zero or near-zero cost | Must |
| PR-07 | Simple clean-checkout setup | Must |
| PR-08 | No payment, SMS or hardware integration | Must |

## Options considered

| Option | Source control and CI | Runtime | Database | Test runner | Estimated cost |
| --- | --- | --- | --- | --- | --- |
| A: GitHub Free + Node 24 built-ins | GitHub Free and Actions | Node 24 | `node:sqlite` | `node:test` | $0 |
| B: GitHub Free + Express + Jest | GitHub Free and Actions | Node + Express | SQLite package | Jest | $0, more dependencies |
| C: Paid cloud platform | Vendor service | Vendor runtime | Vendor database | Vendor test tool | Recurring cost |

## Evaluation

| Criterion | Weight | Option A | Option B | Option C |
| --- | --- | --- | --- | --- |
| Requirement coverage | 30% | 5 | 5 | 4 |
| Clean-checkout reliability | 25% | 5 | 3 | 3 |
| Cost | 20% | 5 | 5 | 1 |
| Learning value | 15% | 4 | 4 | 3 |
| Operational simplicity | 10% | 5 | 3 | 2 |
| Weighted score | 100% | 4.85 | 4.05 | 2.95 |

Scores use a five-point scale. The weighted score is a team decision aid, not a
financial return calculation.

## Recommendation

Select Option A: GitHub Free, Node.js 24 built-in `http`, `node:sqlite` and
`node:test`. It meets the requirements, removes third-party runtime
dependencies and gives the team a repeatable clean-checkout demonstration.

## Cost summary

| Item | Cost |
| --- | --- |
| GitHub Free and Actions | $0 |
| Node.js 24 | $0 |
| SQLite via `node:sqlite` | $0 |
| Jira Free or GitHub Projects | $0 |
| Browser and editor | $0 |
| **Total** | **$0** |

## Procurement risks

| Risk | Response |
| --- | --- |
| Teaching lab has an older Node version | Check `node --version` before the demo; document the minimum version |
| GitHub Actions minutes are limited | Keep the CI job short; run the full suite locally |
| Free plan changes | Export the backlog and repository bundle before submission |
| Vendor lock-in | The application uses standard Node modules and a local SQLite file |

## Approval

| Role | Name | Decision | Date |
| --- | --- | --- | --- |
| Project manager | 杨世垣 | Approve Option A | |
| QA / configuration lead | 李宁杰 | Approve Option A | |
| Team member | 刘汉 | Approve Option A | |
