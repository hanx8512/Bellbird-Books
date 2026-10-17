# Configuration Management Plan

## Purpose

This plan defines how Group T23 identifies, versions, reviews and releases the
BB-IMS configuration items. It supports the A3 requirement to manage
configuration, change and procurement, and gives the assessor a clear audit
trail from a requirement to a release.

## Scope

The plan covers the application source code, database schema, tests, CI
workflow, Jira backlog and sprint records, project documents, presentation and
release artefacts. It does not cover the operating system or the teaching lab's
network configuration.

## Configuration items

| ID | Configuration item | Location | Owner |
| --- | --- | --- | --- |
| CI-01 | Application source | `src/`, `server.js` | 杨世垣 / 刘汉 |
| CI-02 | Browser interface | `public/` | 刘汉 |
| CI-03 | Database schema and seed data | `src/db.js`, `src/seed.js` | 李宁杰 |
| CI-04 | Automated tests | `test/` | 李宁杰 |
| CI-05 | CI workflow | `.github/workflows/ci.yml` | 李宁杰 |
| CI-06 | Product backlog and sprint records | `jira/` | 杨世垣 |
| CI-07 | Project documents | `docs/` | 李宁杰 |
| CI-08 | Release notes and changelog | `CHANGELOG.md`, GitHub Releases | 李宁杰 |

## Baseline

The configuration baseline for v0.2.0 is the commit tagged `v0.2.0` on
`main`. The baseline includes:

- the eight core stories in `jira/backlog.csv`;
- the schema in `src/db.js`;
- the automated test suite in `test/`;
- the CI workflow;
- the approved project charter and test plan;
- the release checklist and changelog.

Changes after the baseline require a change request and a new version.

## Version control

- `main` holds release-ready code.
- `develop` integrates completed sprint work.
- `feature/US-BB-xx-short-name` holds one story.
- Commit messages start with the story key, for example
  `US-BB-04: prevent duplicate used-copy sale`.
- Tags use semantic versioning: `v0.1.0` for the first internal demo and
  `v0.2.0` for the A3 release candidate.

## Review and approval

- Every feature branch uses a pull request.
- The author cannot approve their own pull request.
- One non-author reviewer checks the acceptance criteria and test evidence.
- CI must pass before merge.
- The project manager records the merge decision in the sprint review memo.

## Change control

1. Raise a change request in `03_Change_Log.md`.
2. State the reason, affected configuration items, impact on scope, schedule,
   quality and cost.
3. Get approval from the current project manager and the affected story owner.
4. Update the backlog and baseline if approved.
5. Record the decision and the new version.

## Configuration audit

At the end of each sprint, the QA lead checks:

- every merged story has a test result;
- the Jira board matches the merged branches;
- the changelog matches the release tag;
- no secret or local database file is committed;
- the clean-checkout instructions still work.

## Tools and records

- GitHub for source control, pull requests, CI and releases.
- Jira or GitHub Projects for backlog and sprint records.
- `docs/08_Defect_Log.csv` for defects and retest evidence.
- `docs/09_Release_Checklist.md` for release approval.
- `docs/13_Evidence_Index.md` for the assessor's evidence map.

## Roles

| Role | Responsibility |
| --- | --- |
| Configuration manager | 李宁杰 |
| Project manager | Rotates by sprint |
| Developers | Branch, test and review their own stories |
| Product owner / assessor | Reviews the release and records acceptance |
