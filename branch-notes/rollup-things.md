# Rollup v Webpack things
## Packages
Packages to install:
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

## Popcode prod build things
Production build is done through Gulp and the `yarn run preview` script.
Currently the Webpack build takes 13minutes to build on my Macbook Pro 2013


