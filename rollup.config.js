/* eslint-disable import/no-extraneous-dependencies */
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import reactSvg from 'rollup-plugin-react-svg';
import {string} from 'rollup-plugin-string';
/* eslint-enable import/no-extraneous-dependencies */

export default {
  input: 'src/application.js',
  output: {
    file: 'dist/main.js',
    format: 'iife',
  },
  plugins: [
    // eslint-disable-next-line no-undef
    replace({'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)}),
    babel({
      exclude: [/node_modules/u, './src/config'],
    }),
    resolve({
      extensions: ['.mjs', '.js', '.json', '.node', '.jsx'],
    }),
    commonjs({
      include: [
        'node_modules/**',
        'node_modules/**/*',
        'node_modules',
        /node_modules/u,
      ],
      namedExports: {
        'parse5-sax-parser': ['SAXParser'],
        'lru-cache': ['LRU'],
        // '../config': ['config'],
      },
    }),
    json({preferConst: true}),
    string({
      include: [
        'src/**/*.html',
        'bower_components/**/*',
        'templates/**/*',
        'node_modules/jquery/dist/**/*',
        'node_modules/p5/lib/**/*',
      ],
    }),
    reactSvg({
      include: 'src/**/*.svg',
      svgo: {
        plugins: [
          {removeXMLNS: true},
          {removeViewBox: false},
          {removeAttrs: {active: true, attrs: 'svg:data-name'}},
        ],
      },
    }),
  ],
};
