# Rollup v Webpack things
## Packages
Packages to install(to start):
- @rollup/plugin-babel
- @rollup/plugin-commonjs
- @rollup/plugin-json
- @rollup/plugin-node-resolve
- rollup-plugin-react-svg
- rollup-plugin-string

So the yarn add command looks like:
```
  tools/yarn.py add rollup @rollup/plugin-commonjs @rollup/plugin-json @rollup/plugin-node-resolve rollup-plugin-react-svg rollup-plugin-string @rollup/plugin-babel
```

And the remove command looks like:
```
  tools/yarn.py remove rollup @rollup/plugin-commonjs @rollup/plugin-json @rollup/plugin-node-resolve @rollup-plugin-react-svg rollup-plugin-string @rollup/plugin-babel
```

Also will want:
- [Rollup bundle analyzer](https://yarnpkg.com/package/rollup-plugin-analyzer)
- [Webpack bundle analyzer](https://yarnpkg.com/package/webpack-bundle-analyzer)

## Build steps:
Build steps required are the following:
- Resolve Node modules
- Transpile CommonJS files to ES files
- Transpile ES files to browser compatible JS via Babel
- Transpile JSON, strings, SVGs, etc

## How Get it to work
- The Babel transpilation step needs to be moved AFTER the CommonJS transpilation step
- All local files that use CommonJS exports MUST be included in the Rollup config in `plugins.commonJS` include field

## Popcode prod build things
Production build is done through Gulp and the `yarn run preview` script.

### Webpack Build
- Webpack JS assets are about 11mb
- Webpack build takes 5 minutes

### Rollup build
- build took 2 minutes with no code splitting


## Things To Fix
- `locales/index` doesn't export anything, not sure what it does
- Rollup doesn't know how to code-split when you have an IIFE/ UMD output
  - this seems like a Rollup issue more than a plugin/ transpilation issue
