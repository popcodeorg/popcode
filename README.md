# Popcode

[Popcode](https://popcode.org) is a simple HTML/CSS/JavaScript editing
environment for use in the classroom. It's a lot like [JSBin](http://jsbin.com),
[JSFiddle](https://jsfiddle.net), or [CodePen](https://codepen.io), but it focuses on
giving specific, immediate, human-friendly feedback when the code contains errors.

[![](https://user-images.githubusercontent.com/11786205/47052459-6673a080-d176-11e8-9c1b-b433a2af7c72.jpg)](https://popcode.org)

### Project status

[![Build Status](https://travis-ci.org/popcodeorg/popcode.svg?branch=master)](https://travis-ci.org/popcodeorg/popcode) [![Dependency Status](https://david-dm.org/popcodeorg/popcode.svg)](https://david-dm.org/popcodeorg/popcode) ![License](https://img.shields.io/github/license/popcodeorg/popcode.svg)

Popcode is the official editing environment for the [Code Nation
Intro to Web Development program](https://codenation.org) in the 2019–2020 school year.

### Try it out

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

## Features

- Edit HTML, CSS, and JavaScript in the browser; in-browser preview updates as
  you type.
- Get immediate, comprehensive, easy-to-understand feedback about problems in
  your code.
- Errors can't be ignored. If there are any errors in the code, the live
  preview is replaced by an error list.
- JavaScript runtime errors are also reported in human-friendly language, with
  annotations in the source code pointing out the source of the problem.
- One-click login using GitHub account; all work is saved remotely to
  [Firebase](https://firebase.google.com/) when logged in.
- Pop out preview of web page in its own window.
- Export to GitHub gist.
- Import starter code from a GitHub gist.

### About validation

The validation system is the main point of this project. Most syntax checkers,
linters, and style enforcers tend to provide feedback using language that is
geared toward experienced coders, not beginners. Thus, providing a translation
of error messages into plain English for students is the overriding concern of
this project.

Popcode tends toward strict enforcement of lint and code style, even when
enforced style decisions are arbitrary, under the philosophy that giving
students one right way to do it eliminates ambiguity and aids the learning
process.

## Technical details

Popcode uses [**React**](https://facebook.github.io/react/) to render views,
[**Redux**](http://redux.js.org/) to manage application state,
[**Ace**](https://ace.c9.io/) as the code editor,
[**Webpack**](https://webpack.github.io/) to package the client-side
application, and [**Babel**](https://babeljs.io/) to compile modern JavaScript for compatibility with legacy browser versions.

Popcode detects mistakes in student code using
[slowparse](https://github.com/mozilla/slowparse),
[htmllint](https://github.com/htmllint/htmllint),
[HTML Inspector](https://github.com/philipwalton/html-inspector),
[Rework CSS](https://github.com/reworkcss/css),
[PrettyCSS](https://github.com/fidian/PrettyCSS),
[stylelint](https://github.com/stylelint/stylelint),
[jshint](https://github.com/jshint/jshint), and [esprima](http://esprima.org/).

## Contributing

Yes please! Pull requests, [bug
reports](https://github.com/popcodeorg/popcode/issues/new?template=bug_report.md),
and [feature
suggestions](https://github.com/popcodeorg/popcode/issues/new?template=feature_request.md)
are all very very welcome.
When you’re first getting started, I recommend picking a [good first issue
](https://github.com/popcodeorg/popcode/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) so you can get your feet wet and make sure you can run a development environment smoothly.

Everyone is welcome to submit a pull request that implements a new feature or
fixes a bug that you’re particularly passionate about. But if you just want
to help out and you’re looking for ideas, your best bet is to browse issues
with the [help wanted
label](https://github.com/popcodeorg/popcode/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22).

## Local development environment

Popcode comes with a batteries-included development environment built on
[`nodeenv`](https://github.com/ekalinin/nodeenv). You will need to have
[Python](https://www.python.org/downloads/) installed; any version 2.7+ will
work. To set up the environment, run:

```sh
$ tools/setup.py
```

This will install `node` and `yarn` in an isolated environment in the
`nodeenv` directory of the project root. It won’t interfere with any
system-wide installation of those tools.

Once setup is complete, to run a development server, run:

```sh
$ tools/yarn.py start
```

This will start a server on http://localhost:3000

To start Jest tests in watch mode, run:

```sh
$ tools/yarn.py autotest.jest
```

To start Karma tests in watch mode, run:

```sh
$ tools/yarn.py autotest.karma
```

Check the `"scripts"` section of [`package.json`](https://github.com/popcodeorg/popcode/blob/master/package.json) for other useful tools.

### Developing in VS Code

Popcode comes with a robust custom VS Code configuration, which is
automatically enabled by `tools/setup.py`. If you use VS Code, you can:

- Run the `Show Recommended Extensions` command to easily install extensions
  that improve the Popcode developer experience
- Start a server, run tests, and more by typing `task` into the Quick Open bar to autocomplete the task to run
- Debug either your development environment or a Jest test by typing `debug` into the Quick Open bar

### Using other editors

Popcode uses tools like [Prettier](https://prettier.io/docs/en/editors.html),
[ESLint](https://eslint.org/docs/user-guide/integrations#editors), and
[Stylelint](https://github.com/stylelint/stylelint/blob/master/docs/user-guide/complementary-tools.md#editor-plugins)
to automatically format code. We recomment setting up editor plugins to
auto-format on save; alternatively, you can run `tools/yarn.py lintfix` before
committing to format and autofix lint. Popcode’s official VS Code integration
(with recommended extensions installed) does this out of the box.

### Alternative development environments (advanced)

There is no requirement that you use the official development environment to
work on Popcode; you’ll mostly just need the right versions of Node and Yarn
installed on your machine (check the `"engines"` section of `package.json`
for the current versions).

### Developer Reference

Popcode endeavors to use up-to-date technologies and code conventions to make
development as pleasant as possible. Below are links to reference documentation
on the major tools:

- [React](https://reactjs.org/docs/introducing-jsx.html) for
  constructing the user interface
- [Redux](https://redux.js.org/introduction/core-concepts) for managing application state
- [postcss-preset-env](https://github.com/csstools/postcss-preset-env) gives us cutting-edge CSS features
- [Block Element Modifier](https://en.bem.info/methodology/naming-convention/)
  provides a convention for organizing DOM classes
- [Webpack](https://webpack.github.io/docs/configuration.html) builds the
  JavaScript
- [Jest](https://jestjs.io/) is the test framework
  - We are currently migrating legacy tests from [Tape](https://github.com/substack/tape) with [Karma](https://karma-runner.github.io/latest/index.html)

## License

Popcode is distributed under the MIT license. See the attached LICENSE file
for all the sordid details.

## Contributors

- [Mat Brown](https://github.com/outoftime) (maintainer)
- [Alejandro AR](https://github.com/kinduff)
- [Vaibhav Verma](https://github.com/v)
- [Alex Pelan](https://github.com/alexpelan)
- [Carol Chau](https://github.com/carolchau)
- [Jesse Wang](https://github.com/jwang1919)
- [Eric Lewis](http://www.ericandrewlewis.com/)
- [Razzi Abuissa](https://razzi.abuissa.net/)
- [Jeremy Schrader](http://www.pattern-factory.com/)
- [Leo McLay](https://github.com/leo-alexander)
- [Frederic Brodbeck](http://www.freder.io/)
- [Ben Yelsey](https://github.com/inlinestyle)
- [Aaron Greenberg](https://github.com/ajgreenb)
- [Peter Jablonski](https://github.com/pwjablonski)
- [Ten-Young Guh](https://github.com/tenyoung795)
- [Ilona Brand](https://github.com/ibrand)
- [Kaylee Knowles](https://github.com/kaylee42)
- [Felicia Wong](https://github.com/quixotically)
- [Tim Miller](https://github.com/gangstertim)
- [Bruno Garcia](http://twitter.com/b_garcia)
- [Cory Etzkorn](http://www.coryetzkorn.com/)
- [Nick Volpe](https://github.com/iamnickvolpe)
- [Craig Iturbe](https://github.com/citurbe)
- [Wylie Conlon](http://wylie.su/)
- [Gary Pang](http://www.codewritingcow.com/)
- [Alessia Bellisario](http://aless.co/)
- [Roan Kattouw](https://github.com/catrope)
- [Harpreet Singh](https://github.com/harry1064)
- [Limon Monte](https://limonte.github.io/)
- [Matthew Armstrong](https://github.com/raingerber)
- [Matt Garbis](http://www.mattgarbis.com/)
- [Ilya Gribov](https://github.com/igrib)
- [Chase Starr](http://www.twitter.com/captivechains)
- [Alec Merdler](https://github.com/alecmerdler)
- [Eric Snell](http://ericsnell.github.io/portfolio)
- [Omar De Leo](https://github.com/omardeleo)
- [David Shen](https://github.com/dshen6)
- [Maggie Walker](https://maggiewalker.github.io)
- [Joshua Ling](https://github.com/joshling1919)
- [Taimur Samee](https://github.com/TSamee)
- [Katie Conneally](http://www.katieconneally.com/) created the name Popcode
- Logo design, "Pop" concept, and branding elements by the team at
  [Red Peak](http://redpeakgroup.com): Andrew Haug, Aya Kawabata, Jieun Lee,
  Achu Fones, Iwona Waluk, Stewart Devlin, and Katie Conneally
- User interface designed by [Ariel Liu](https://github.com/charstarstars),
  [Ian Jones](https://github.com/ianmclaury), [Meghan
  Knoll](https://github.com/megknoll), and [Simon
  Lesser](https://twitter.com/simonlesser).

## Thanks to

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

## Contact

Feel free to email me at [mat.a.brown@gmail.com](mailto:mat.a.brown@gmail.com) if you have any questions.

You can find our Slack team, including our #dev channel, [here](https://slack.popcode.org).
