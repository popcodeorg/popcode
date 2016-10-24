# Popcode #

[Popcode](https://popcode.org) is a simple HTML/CSS/JavaScript editing
environment for use in the classroom. It's a lot like [JSBin](http://http://jsbin.com), 
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

Check out the [Project Board](https://github.com/popcodeorg/popcode/projects/2).

## Technical details ##

Popcode uses [**React**](https://facebook.github.io/react/) to render views,
[**Redux**](http://redux.js.org/) to manage application state,
[**Ace**](https://ace.c9.io/) as the code editor,
[**Browserify**](http://browserify.org/) to package the client-side
application, and [Babel](https://babeljs.io/) to compile ES2016+JSX into ES5.

Popcode detects code errors using
[slowparse](https://github.com/mozilla/slowparse),
[htmllint](https://github.com/htmllint/htmllint),
[Rework CSS](https://github.com/reworkcss/css),
[PrettyCSS](https://github.com/fidian/PrettyCSS),
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

Yes please! There are a [ton of ways](https://trello.com/b/ONaFg6wh/popcode)
Popcode could be made better. Pull requests, bug reports, feature suggestions
are all very very welcome.

### Running locally ###

Pretty easy. Just check out the code, then run:

```bash
$ npm install
```

That'll pull down the dependencies. Then run:

```bash
$ gulp dev
```

This will start a local static server, and open it in your browser. The first
pageload will be rather slow as it compiles the bundle; after you change files,
assets are recompiled incrementally and your browser automatically reloads.

When you're done, lint and make sure tests pass before opening a pull request:

```bash
$ npm test
```

## License ##

Popcode is distributed under the MIT license. See the attached LICENSE file
for all the sordid details.

## Contributors ##

* [Mat Brown](https://github.com/outoftime) (maintainer)
* [Alejandro AR](https://github.com/kinduff)
* [Vaibhav Verma](https://github.com/v)
* [Alex Pelan](https://github.com/alexpelan)
* [Jesse Wang](https://github.com/jwang1919)
* [Katie Conneally](http://www.katieconneally.com/) created the name Popcode
* Logo design, "Pop" concept, and UI by the team at
  [http://redpeakgroup.com](Red Peak): Andrew Haug, Aya Kawabata, Jieun Lee,
  Achu Fones, Iwona Waluk, Stewart Devlin, and Katie Conneally

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
