import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import reactSvg from 'rollup-plugin-react-svg';
import {string} from 'rollup-plugin-string';

export default {
  input: 'src/application.js',
  output: {
    file: 'dist/main.js',
    format: 'iife',
  },
  plugins: [
    babel({
      exclude: ['node_modules/brace/**/*'],
    }),
    resolve({extensions: ['.mjs', '.js', '.json', '.node', '.jsx']}),
    commonjs(),
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
