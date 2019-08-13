# Test Plan

Automated testing is very useful, and Popcode strives to have complete code
coverage with automated tests (though as of this writing, the project is
woefully short of that ambition). That said, it’s next to impossible for
automated testing to provide complete confidence that a user-facing product is
working as expected.

For that reason, we also maintain a manual test plan. This test plan doesn’t
need to be run on every pull request, but for changes that have potentially
far-reaching impact, it’s worth going through. Feel free to pick and choose the
parts that seem relevant to your code changes.

### Basic functionality

- [Load the application](http://localhost:3000). Ensure that the environment
  loads without errors.
- Add some content to the HTML and make sure the preview renders correctly. Add
  some styles and make sure those are applied.
- Add some invalid CSS. Make sure that the appropriate error messages appear in
  the output column and as annotations in the source. Make sure that clicking
  the message in the error list focuses the cursor on the location in the
  source.
- Click the pop-out button. Ensure that a new tab opens with the rendered page.
- Minimize various editors by clicking the appropriate label. Maximize them by
  clicking the bar at the bottom of the editors column.
- Click the zoom in button. Ensure that the text in the editors gets bigger.
  Click it again and ensure that the text returns to normal size.

### Persistence

- Log out if you are logged in.
- Add some content to the HTML.
- Refresh the browser tab. Verify that your content is still there.
- Close the browser tab, then open Popcode in a new tab. Verify that your
  content is still there.
- Without closing the current tab, open another Popcode instance in a new tab.
  Verify that the environment contains a fresh project.

### Libraries

- Type some JavaScript that requires jQuery. Ensure that an error message
  appears suggesting you enable jQuery.
- Enable jQuery and ensure that the page now renders and behaves as expected.
  The menu should stay visible after you select jQuery.

### Snapshots

- Add some content to the page. Click **Snapshot**. Click the prompt to
  copy.
- Paste the URL from your clipboard into a new tab. Verify that the project
  contains the content that you exported.

### Gist import & project instructions

- Open [a gist import
  URL](http://localhost:3000/?gist=339c841617fb50c98420d9f37654039d) and ensure
  that the gist is imported into the environment
- Open [a gist with
  instructions](http://localhost:3000/?gist=911a82a17a280545858d2d8ecc557ef3).
  Verify that the instructions appear in the left pane of the environment.
- Click the dark gray bar to the right of the instructions. Ensure that the
  instructions are hidden.
- Click it again. Ensure that the instructions are visible.

### Login

- Open a fresh Popcode environment, and log in. Verify that current project is
  still a new, blank template.
- Open a fresh Popcode environment, and add something to the HTML. Then log in.
  Verify that the code you were just working on is still on screen.
- Open a second Popcode tab. Verify that you are are logged in, and looking at
  a fresh project.
- Modify the project, and then log out. Verify that you are logged out in both
  tabs, and both tabs still have the same project as before.
- Log back in. Create a new project. Verify that the code on screen is now the
  defaults.
- Click on “Load Project”, and verify that you can go back to the project you
  were working on before you clicked “New Project”

### Gist export

- Export a gist while logged out. Verify that the contents of the gist match
  what was in your Popcode environment.
- Export a gist while logged in. Verify that the gist is associated with your
  GitHub account, and that it contains a link to re-import the gist into
  Popcode.
