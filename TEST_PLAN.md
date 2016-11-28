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

* [Load the application](http://localhost:3000). Ensure that the environment
  loads without errors.
* Add some content to the HTML and make sure the preview renders correctly. Add
  some styles and make sure those are applied.
* Add some invalid CSS. Make sure that the appropriate error messages appear in
  the output column and as annotations in the source. Make sure that clicking
  the message in the error list focuses the cursor on the location in the
  source.
* Click the pop-out button. Ensure that a new tab opens with the rendered page.
* Minimize various editors and the output column by clicking the appropriate
  label. Maximize them by clicking the button in the left column.

### Libraries

* Type some JavaScript that requires jQuery. Ensure that an error message
  appears suggesting you enable jQuery. Enable jQuery and ensure that the page
  now renders and behaves as expected.

### Gist import

* Open [a gist import
  URL](http://localhost:3000/?gist=339c841617fb50c98420d9f37654039d) and ensure
  that the gist is imported into the environment

### Login

* Open a fresh Popcode environment, and log in. Verify that the project that
  appears is the last one you were working on while logged in.
* Open a fresh Popcode environment, and add something to the HTML. Then log in.
  Verify that the code you were just working on is still on screen.
* Log out, then log back in. Verify that after logging back in, the code on
  screen is as you left it.
* Create a new project. Verify that the code on screen is now the defaults.
* Click on “Load Project”, and verify that you can go back to the project you
  were working on before you clicked “New Project”

### Gist export

* Export a gist while logged out. Verify that the contents of the gist match
  what was in your Popcode environment.
* Export a gist while logged in. Verify that the gist is associated with your
  GitHub account, and that it contains a link to re-import the gist into
  Popcode.
