# Popcode #

[Popcode](https://popcode.org) is a simple HTML/CSS/JavaScript editing
environment for use in the classroom. It's a lot like [JSBin](http://jsbin.com),
[JSFiddle](https://jsfiddle.net), or [CodePen](https://codepen.io), but it focuses on
giving specific, immediate, human-friendly feedback when the code contains errors.

[![](https://cl.ly/1W1e1h3w073u/popscreens.png)](https://popcode.org)

### Project status ###

[![Build Status](https://travis-ci.org/popcodeorg/popcode.svg?branch=master)](https://travis-ci.org/popcodeorg/popcode) [![Dependency Status](https://david-dm.org/popcodeorg/popcode.svg)](https://david-dm.org/popcodeorg/popcode) ![License](https://img.shields.io/github/license/popcodeorg/popcode.svg)

Popcode is the official first semester editing environment for the [ScriptEd
program](https://scripted.org) in the 2016–2017 school year.

### Try it out ###

You can try out Popcode at
[`https://popcode.org`](https://popcode.org).

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Features](#features)
  - [About validation](#about-validation)
  - [Feature roadmap](#feature-roadmap)
- [Technical details](#technical-details)
  - [Architecture Overview](#architecture-overview)
- [Contributing](#contributing)
  - [Running locally](#running-locally)
  - [Debug Mode](#debug-mode)
  - [Developer Reference](#developer-reference)
- [License](#license)
- [Contributors](#contributors)
- [Thanks to](#thanks-to)
- [Contact](#contact)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Features ##

* Edit HTML, CSS, and JavaScript in the browser; in-browser preview updates as
  you type.
* Get immediate, comprehensive, easy-to-understand feedback about problems in
  your code.
* Errors can't be ignored. If there are any errors in the code, the live
  preview is replaced by an error list.
* JavaScript runtime errors are also reported in human-friendly language, with
  annotations in the source code pointing out the source of the problem.
* One-click login using GitHub account; all work is saved remotely to
  [Firebase](https://firebase.google.com/) when logged in.
* Pop out preview of web page in its own window.
* Export to GitHub gist.
* Import starter code from a GitHub gist.

### About validation ###

The validation system is the main point of this project. Most syntax checkers,
linters, and style enforcers tend to provide feedback using language that is
geared toward experienced coders, not beginners. Thus, providing a translation
of error messages into plain English for students is the overriding concern of
this project.

Popcode tends toward strict enforcement of lint and code style, even when
enforced style decisions are arbitrary, under the philosophy that giving
students one right way to do it eliminates ambiguity and aids the learning
process.

### Feature roadmap ###

Check out the [Project Board](https://github.com/popcodeorg/popcode/projects/3).

## Technical details ##

Popcode uses [**React**](https://facebook.github.io/react/) to render views,
[**Redux**](http://redux.js.org/) to manage application state,
[**Ace**](https://ace.c9.io/) as the code editor,
[**Webpack**](https://webpack.github.io/) to package the client-side
application, and [**Babel**](https://babeljs.io/) to compile ES2016+JSX into ES5.

Popcode detects code errors using
[slowparse](https://github.com/mozilla/slowparse),
[htmllint](https://github.com/htmllint/htmllint),
[HTML Inspector](https://github.com/philipwalton/html-inspector),
[Rework CSS](https://github.com/reworkcss/css),
[PrettyCSS](https://github.com/fidian/PrettyCSS),
[stylelint](https://github.com/stylelint/stylelint),
[jshint](https://github.com/jshint/jshint), and [esprima](http://esprima.org/).

### Architecture Overview ###

The architecture of Popcode’s code base is best understood through the
lifecycle of a user interaction:

* User interactions are first captured by handlers in React
  [components](https://github.com/popcodeorg/popcode/tree/master/src/components).
* These components propagate the event to the view controller, the [`Workspace`
  component](https://github.com/popcodeorg/popcode/blob/master/src/components/Workspace.jsx).
* The `Workspace` dispatches one or more Redux
  [actions](https://github.com/popcodeorg/popcode/tree/master/src/actions).
* Dispatched actions are consumed by the
  [reducers](https://github.com/popcodeorg/popcode/tree/master/src/reducers),
  which update the
  [store](https://github.com/popcodeorg/popcode/blob/master/src/store.js).
* Action creators also perform other business logic, such as initiating
  [validation](https://github.com/popcodeorg/popcode/tree/master/src/validations)
  of project code and persisting changes to
  [persistent storage](https://github.com/popcodeorg/popcode/blob/master/src/persistors).
* When the action lifecycle is complete, the `Workspace` receives updated
  props from the store and propagates them to its descendants.

## Contributing ##

Yes please! There are a [ton of
ways](https://github.com/popcodeorg/popcode/issues)
Popcode could be made better. Pull requests, bug reports, feature suggestions
are all very very welcome.

When you’re first getting started, I recommend picking a [good first issue
](https://github.com/popcodeorg/popcode/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) so you can get your feet wet and make sure you can run a development environment smoothly.

Everyone is welcome to submit pull requests that implement a new feature or fix
a bug that you’re particularly passionate about. But if you just want to help
out and you’re looking for ideas, I recommend checking out the [help wanted
label](https://github.com/popcodeorg/popcode/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)
and the [ScriptEd Program Managers’ Roadmap](https://github.com/popcodeorg/popcode/projects/3),
which lists the features and enhancements that the ScriptEd PMs have identified
as most beneficial based on observation of hundreds of student users and
feedback from dozens of instructors.

### Running locally ###

Pretty easy. Just check out the code. You’ll need [Yarn](https://yarnpkg.com/),
which is the cool new NPM. It’s [easy to
install](https://yarnpkg.com/en/docs/install).

Once you’ve got it just run:

```bash
$ yarn
```

That'll pull down the dependencies. Then run:

```bash
$ yarn run dev
```

This will start a local static server, and open it in your browser. The first
pageload will be rather slow as it compiles the bundle; after you change files,
assets are recompiled incrementally and your browser automatically reloads.

When you're done, lint and make sure tests pass before opening a pull request:

```bash
$ yarn test
```

### Debug Mode ###

By default, Popcode’s JavaScript code  is compiled to ES5 to support a wide
array of older browsers. This can make it difficult to debug errors, however,
as the compiled code in the debugger can look quite different from the original
source code.

To improve the situation, you can use **debug mode**, which configures Babel to
compile the JavaScript to target only the latest version of Chrome, which
supports most modern ES features.

### Developer Reference ###

Popcode endeavors to use up-to-date technologies and code conventions to make
development as pleasant as possible. Below are links to reference documentation
on the major tools:

* [React](https://facebook.github.io/react/docs/react-component.html) for
  constructing the user interface
* [Redux](http://redux.js.org/) for managing application state
* [cssnext](http://cssnext.io/features/) gives us cutting-edge CSS features
* [Block Element Modifier](https://en.bem.info/methodology/naming-convention/)
  provides a convention for organizing DOM classes
* [Webpack](https://webpack.github.io/docs/configuration.html) builds the
  JavaScript
* [Tape](https://github.com/substack/tape) provides the test harness

## License ##

Popcode is distributed under the MIT license. See the attached LICENSE file
for all the sordid details.

## Contributors ##

* [Mat Brown](https://github.com/outoftime) (maintainer)
* [Alejandro AR](https://github.com/kinduff)
* [Vaibhav Verma](https://github.com/v)
* [Alex Pelan](https://github.com/alexpelan)
* [Carol Chau](https://github.com/carolchau)
* [Jesse Wang](https://github.com/jwang1919)
* [Eric Lewis](http://www.ericandrewlewis.com/)
* [Razzi Abuissa](https://razzi.abuissa.net/)
* [Jeremy Schrader](http://www.pattern-factory.com/)
* [Leo McLay](https://github.com/leo-alexander)
* [Frederic Brodbeck](http://www.freder.io/)
* [Ben Yelsey](https://github.com/inlinestyle)
* [Aaron Greenberg](https://github.com/ajgreenb)
* [Peter Jablonski](https://github.com/pwjablonski)
* [Ten-Young Guh](https://github.com/tenyoung795)
* [Ilona Brand](https://github.com/ibrand)
* [Kaylee Knowles](https://github.com/kaylee42)
* [Felicia Wong](https://github.com/quixotically)
* [Tim Miller](https://github.com/gangstertim)
* [Bruno Garcia](http://twitter.com/b_garcia)
* [Cory Etzkorn](http://www.coryetzkorn.com/)
* [Nick Volpe](https://github.com/iamnickvolpe)
* [Craig Iturbe](https://github.com/citurbe)
* [Wylie Conlon](http://wylie.su/)
* [Gary Pang](http://www.codewritingcow.com/)
* [Alessia Bellisario](http://aless.co/)
* [Roan Kattouw](https://github.com/catrope)
* [Katie Conneally](http://www.katieconneally.com/) created the name Popcode
* Logo design, "Pop" concept, and branding elements by the team at
  [Red Peak](http://redpeakgroup.com): Andrew Haug, Aya Kawabata, Jieun Lee,
  Achu Fones, Iwona Waluk, Stewart Devlin, and Katie Conneally
* User interface designed by [Ariel Liu](https://github.com/charstarstars),
  [Ian Jones](https://github.com/ianmclaury), [Meghan
  Knoll](https://github.com/megknoll), and [Simon
  Lesser](https://twitter.com/simonlesser).

## Thanks to ##

These companies generously offer Popcode access to paid tiers of their
excellent services, free of charge:

<table><tbody><tr>
<td>
<a href="https://browserstack.com">
<img alt="BrowserStack"
src="https://cloud.githubusercontent.com/assets/14214/19059103/23ffe174-89ab-11e6-8de3-482780488df5.png">
</a>
</td>
<td>
<a href="https://bugsnag.com">
<img alt="Bugsnag"
src="https://cloud.githubusercontent.com/assets/14214/19059115/428a80f4-89ab-11e6-8d05-d8d0795266fd.png">
</a>
</td>
</tr>
</tbody>
</table>

## Contact ##

Feel free to email me at [mat.a.brown@gmail.com](mailto:mat.a.brown@gmail.com) if you have any questions.

You can find our Slack team, including our #dev channel, [here](https://slack.popcode.org). 
