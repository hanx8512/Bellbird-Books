# Release Checklist

## Release identity

| Field | Value |
| --- | --- |
| Release | v0.2.0 |
| Release date | 2026-10-19 |
| Commit | [git rev-parse --short HEAD] |
| Release owner | 李宁杰 |
| Approver | 杨世垣 |

## Before release

- [ ] All core stories meet their acceptance criteria.
- [ ] `npm test` passes with zero failures.
- [ ] CI is green on `develop` and `main`.
- [ ] Every story has a non-author review.
- [ ] No `.env`, local database or secret is tracked.
- [ ] `CHANGELOG.md` describes the release.
- [ ] README quick-start instructions match the current code.
- [ ] Known limitations are recorded.

## Release candidate verification

- [ ] Clone or copy the repository to a clean directory.
- [ ] Confirm `node --version` is 24 or later.
- [ ] Run `npm test`.
- [ ] Run `npm start`.
- [ ] Request `/api/health` and confirm HTTP 200.
- [ ] Complete one special order and one reservation in the browser.
- [ ] Confirm the empty-section response returns `[]`.
- [ ] Save command output and screenshots.

## Tag and publish

- [ ] Merge `develop` into `main` through a pull request.
- [ ] Create tag `v0.2.0`.
- [ ] Push the tag.
- [ ] Create a GitHub Release with the changelog summary.
- [ ] Record the release URL in the evidence index.

## Known limitations

- US-BB-08 scheduled auto-release is a stretch item. v0.2.0 records the
  14-day due date and releases stock on cancellation, but does not run a
  scheduled expiry job.
- The application has no authentication and is intended for a local
  demonstration only.

## Sign-off

| Role | Name | Decision | Date |
| --- | --- | --- | --- |
| Release owner | 李宁杰 | Ready / Not ready | |
| Project manager | 杨世垣 | Approved / Rejected | |
