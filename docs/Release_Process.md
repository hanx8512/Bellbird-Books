# Release process

BB-IMS uses semantic versioning and a short release checklist.

## Version rules

- `0.0.x`: repository or documentation changes with no user-facing behaviour.
- `0.x.0`: a sprint demo with new user-facing behaviour.
- `1.0.0`: only after the product owner accepts the full agreed scope.

## Release steps

1. Merge the approved story branches into `develop`.
2. Run `npm test` on a clean checkout.
3. Update `CHANGELOG.md` with the release date and changes.
4. Create a pull request from `develop` to `main`.
5. Require one non-author approval and a green CI run.
6. Merge to `main`.
7. Create an annotated tag, for example `git tag -a v0.2.0 -m "BB-IMS v0.2.0"`.
8. Push the tag with `git push origin v0.2.0`.
9. Create a GitHub Release with the changelog summary and test evidence link.
10. Record the release date, tag and evidence location in `docs/09_Release_Checklist.md`.

## Rollback

If the release fails the health check, redeploy the previous tag and record the
incident in `docs/08_Defect_Log.csv`. Do not rewrite the release tag after it
has been shared.
