# Popcode #

Popcode is a simple HTML/CSS/JavaScript editing environment for use in the
classroom. It's a lot like JSBin or JSFiddle, but with a strong emphasis on
novice users.

### Project status ###

Popcode is alpha software.

### Try it out ###

You can try out Popcode at
[`https://popcode.org`](https://popcode.org).

Try doing something wrong. The main emphasis of this project is giving feedback on code problems that novice users can understand.

## Features ##

* Edit HTML, CSS, and JavaScript in the browser; in-browser preview updates as
  you type.
* Get immediate, comprehensive, easy-to-understand feedback about problems in
  your code.
* Errors can't be ignored. If there are any errors in the code, the live
  preview is replaced by an error list.
* JavaScript runtime errors are also reported in human-friendly language, with
  annotations in the source code pointing out the source of the problem.
* All is work automatically saved in local storage.
* Pop out preview of web page in its own window.
* Export to GitHub gist.

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

Check out the [Trello board](https://trello.com/b/ONaFg6wh/popcode).

## Technical details ##

Popcode uses [**React**](https://facebook.github.io/react/) to render views,
[**Redux**](http://redux.js.org/) to manage application state,
[**Ace**](https://ace.c9.io/) as the code editor,
[**Browserify**](http://browserify.org/) to package the client-side
application, and [Babel](https://babeljs.io/) to compile ES2015+JSX into ES5.

Right now, it includes **slowparse**, **htmllint**, **css**, **PrettyCSS**,
and **jshint** for error checking.

The Ace editor has a built-in system for error checking, but it's really hard
to extend, so I've disabled it. Right now the editor just synchronously runs
the validations whenever the code changes. It would be reasonably easy to move
this into a web worker, although I think a hand-rolled web worker would still
be much easier than trying to integrate with Ace's web worker framework.

## Contributing ##

Yes please. I don't think there's any way I'm going to make this a viable
product on my own. Pull requests are most welcome.

It's worth noting that I am pretty new to a lot of the technologies used in
this project, so feel free to use a pull request to set me straight.

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

## License ##

Popcode is distributed under the MIT license. See the attached LICENSE file
for all the sordid details.

## Contributors ##

* [Mat Brown](https://github.com/outoftime) (maintainer)
* [Alejandro AR](https://github.com/kinduff)
* [Katie Conneally](http://www.katieconneally.com/) created the name Popcode

## Contact ##

Feel free to email me at mat.a.brown@gmail.com if you have any questions.
