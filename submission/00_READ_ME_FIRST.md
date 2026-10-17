# A3 submission handoff

## What is ready

- Working BB-IMS web application in `repo/`.
- Eleven automated tests, all passing.
- Project charter, configuration management plan, change log, procurement RFP,
  test plan summary, formal acceptance form, lessons learned and peer
  evaluation template.
- Test plan workbook with scenarios, cases, traceability and defect log.
- Ten-slide presentation with speaker notes.
- Jira backlog, sprint CSV files and meeting memo templates.
- Desktop and mobile-width UI screenshots.
- Local Git commit and tag `v0.2.0` on branch `codex/a3-release`.
- Live SCU Jira space `MSD426GXUST23` with the `BB-IMS T23` Epic and 10 stories.
  Epic: `https://scu-it.atlassian.net/browse/MSD426GXUST23-1`
  Backlog: `https://scu-it.atlassian.net/jira/software/c/projects/MSD426GXUST23/boards/2015/backlog`
  The first four stories are in `MSD426GX Sprint 1`; the remaining stories
  are in the backlog with points set.

## What you must still do

1. Push the branch to GitHub:

   ```bash
   cd "C:\Users\han\Documents\ChatGPT\New project\A3_BB-IMS\repo"
   git push -u origin codex/a3-release
   git push origin v0.2.0
   ```

2. Open a pull request from `codex/a3-release` to `develop` or `main` and
   merge it so the repository link shows the A3 code.

3. The SCU Jira space already has the Epic and 10 stories. Link the remaining
   stories to the Epic if your tutor requires every story under one Epic, and
   drag them into the sprint you want to use. Jira's bulk "add existing" picker
   switched to create-new mode during setup, so this last linking step was not
   completed automatically.

4. Run the browser check in Edge as well as Chrome and save the screenshot.

5. Write the final report prose from `docs/10_Final_Report_Evidence_Pack.md`
   and the DOCX scaffold. The A3 brief does not permit AI-generated report
   text, so the final prose must be written and checked by the team.

6. Complete the formal acceptance form with the assessor or product owner.

7. Fill the peer evaluation form individually. Do not ask another person to
   fill your ratings.

8. Rebuild the submission ZIP after the final edits:

   ```bash
   tar -a -c -f A3_T23_Submission.zip -C submission .
   ```

9. Upload all files and the GitHub link to Blackboard before 8:00 pm Shanghai
   on Monday 19 October 2026.

## Important limitation

US-BB-08 scheduled expiry is recorded as a stretch item. The release records
the 14-day due date and releases stock on cancellation, but it does not run a
scheduled expiry job. State this honestly in the report and presentation.
