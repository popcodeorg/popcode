/* eslint-disable import/no-extraneous-dependencies */
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
// import replace from '@rollup/plugin-replace';
import reactSvg from 'rollup-plugin-react-svg';
import {string} from 'rollup-plugin-string';
/* eslint-enable import/no-extraneous-dependencies */

export default {
  input: 'src/application.js',
  inlineDynamicImports: true,
  output: {
    file: 'build/main.js',
    format: 'iife',
  },
  plugins: [
    resolve({
      extensions: ['.mjs', '.js', '.json', '.node', '.jsx'],
      browser: true,
    }),
    commonjs({
      include: [
        'node_modules/**',
        'node_modules/**/*',
        'node_modules',
        /node_modules/u,
        // LOCAL COMMONJS FILES
        './locales/index.js',
        './src/config.js',
        './src/services/inlineStylePrefixer/prefixData.gen.js',
      ],
    }),
    babel(),
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
