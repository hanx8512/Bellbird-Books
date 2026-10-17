# Branch protection setup

Use these settings on the GitHub repository so the Scrum review rules are
visible in the tool, not only in the report.

## Branches

- `main`: production-ready releases only.
- `develop`: integration branch for completed sprint work.
- `feature/US-BB-xx-short-name`: one branch per user story.

## Protection rules for `main` and `develop`

1. Open GitHub repository settings.
2. Select Branches, then Add branch protection rule.
3. Set the branch name pattern to `main` and repeat for `develop`.
4. Require a pull request before merging.
5. Require one approval.
6. Dismiss stale approvals when new commits are pushed.
7. Require status checks to pass before merging.
8. Select the `test` job from the CI workflow.
9. Require branches to be up to date before merging.
10. Do not allow the author to approve their own pull request.

## Evidence to capture

- Screenshot of the protection rule.
- One merged pull request with a non-author approval.
- One CI run with a green test job.
- One failed CI run or review comment that led to a fix, if available.

## Local fallback

If the GitHub plan or teaching account does not allow branch protection,
capture the settings page and explain the limitation in the report. Keep the
same review rule in the pull request template and meeting records.
