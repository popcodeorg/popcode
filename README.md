# Learnpad #

Learnpad is a simple HTML/CSS/JavaScript editing environment for use in the
classroom. It's a lot like JSBin or JSFiddle, but with a strong emphasis on
novice users.

### Project status ###

Learnpad is currently somewhere between a proof of concept and a work in
progress.

## Features ##

* Edit HTML, CSS, and JavaScript in the browser; in-browser preview updates as
  you type.
* Get immediate, comprehensive, easy-to-understand feedback about problems in
  your code.
* That's it, so far.

### About validation ###

The validation system is the main point of this project. Most syntax checkers,
linters, and style enforcers tend to provide feedback using language that is
geared toward experienced coders, not beginners. Thus, providing a translation
of error messages into plain English for students is the overriding concern of
this project.

Learnpad tends toward strict enforcement of lint and code style, even when
enforced style decisions are arbitrary, under the philosophy that giving
students one right way to do it eliminates ambiguity and aids the learning
process.

### Feature roadmap ###

Here are some things that will need to be built before Learnpad is anywhere
near an MVP:

- [ ] Finish JavaScript validations, including integration of `jscs` for code style
      enforcement
- [ ] Write HTML and CSS validations.
- [ ] If there are any validation errors, the preview should be replaced by an
      error list. Clicking an error should highlight that line in the code.
- [ ] Should be able to easily drop in popular CSS and JavaScript libraries.
- [ ] `console.log` in JavaScript should probably do something useful.
- [ ] Ability to save your work, switch between saved projects (local storage
      at the very least, realistically some sort of server-side persistence)
- [ ] Clearly indicate what each of the three editors is for.

Some more stuff that would be good:

- [ ] Toggle which editors are visible
- [ ] Save version history, ability to roll back to previous versions
- [ ] Display preview scaled down to 50% so the whole viewport is visible (this
      is either an awesome or a terrible idea)
- [ ] Pop out preview into its own full browser window
- [ ] GitHub export

## Technical details ##

Learnpad uses **React** to manage view state, **Ace** as the code editor, and
**Browserify** to package the client-side application.

Right now, it includes **htmllint**, **csslint**, **jshint**, and **jscs** for
style checking, although as of now it only actually uses jshint.

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

That'll pull down the dependencies. Then, in one shell session, run:

```bash
$ npm start
```

In another shell session, run:

```bash
$ npm run watch
```

Now you'll have a static server, accessible at `http://localhost:8080`. The
second command will live-update your JavaScript bundle as you edit it.

## License ##

Learnpad is distributed under the MIT license. See the attached LICENSE file
for all the sordid details.

## Contact ##

Feel free to email me at mat.a.brown@gmail.com if you have any questions.
