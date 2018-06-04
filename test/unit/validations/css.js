import test from 'tape';

import css from '../../../src/validations/css';
import validationTest from '../../helpers/validationTest';
import testValidatorAcceptance from '../../helpers/testValidatorAcceptance';

test('valid flexbox', validationTest(
  `.flex-container {
     display: flex;
     flex-flow: nowrap column;
     align-content: flex-end;
     justify-content: flex-start;
     align-items: center;
   }
   .flex-item {
     flex: 1 0 auto;
     align-self: flex-end;
     order: 2;
   }`,
  css,
));

test('valid filter', validationTest(
  `img {
     filter: grayscale(100%);
  }`,
  css,
));

test('valid text-shadow declaration', validationTest(
  `p {
    text-shadow: rgba(0,0,0,0.1) 0 -5px, rgba(0,0,0,0.1) 0 -1px, \
     rgba(255,255,255,0.1) 1px 0, rgba(255,255,255,0.1) 0 1px, \
     rgba(0,0,0,0.1) -1px -1px, rgba(255,255,255,0.1) 1px 1px; 
  }`,
  css,
));

test('bogus flex value', validationTest(
  '.flex-item { flex: bogus; }',
  css,
  {reason: 'invalid-value', row: 0, payload: {error: 'bogus'}},
));

test('fails with bogus filter value', validationTest(
  'img { filter: whitescale(100%); }',
  css,
  {reason: 'invalid-value', row: 0, payload: {error: 'whitescale('}},
));

test('no opening curly brace', validationTest(
  `p
    display: block;`,
  css,
  {reason: 'block-expected', row: 0, payload: {error: 'p'}},
));

test('no closing curly brace', validationTest(
  `p {
     display: block;`,
  css,
  {reason: 'missing-closing-curly', row: 0},
));

test('bogus character in selector', validationTest(
  'p; div { display: block; }',
  css,
  {reason: 'invalid-token-in-selector', row: 0, payload: {token: ';'}},
));

test('invalid negative value', validationTest(
  'p { padding-left: -2px; }',
  css,
  {reason: 'invalid-negative-value', row: 0, payload: {error: '-2px'}},
));

test('invalid fractional value', validationTest(
  'p { z-index: 2.4; }',
  css,
  {reason: 'invalid-fractional-value', row: 0, payload: {error: '2.4'}},
));

test('missing semicolon at end of block', validationTest(
  `p {
    display: block
  }`,
  css,
  {reason: 'missing-semicolon', row: 1},
));

test('missing semicolon within block', validationTest(
  `
    p {
      margin: 10px
      padding: 5px;
    }
  `,
  css,
  {reason: 'missing-semicolon', row: 2},
));

test('extra tokens after value', validationTest(
  `
    p {
      padding: 5px 5px 5px 5px 5px;
    }
  `,
  css,
  {reason: 'extra-tokens-after-value', row: 2, payload: {token: '5px'}},
));

test('potentially missing semicolon before first line', validationTest(
  `button{border:20px solid b;
  }`,
  css,
  {reason: 'extra-tokens-after-value', row: 0, payload: {token: 'b'}},
));

test('extra token that is prefix of the beginning of the line', validationTest(
  `
    p {
      border: 20px solid b;
    }
  `,
  css,
  {reason: 'extra-tokens-after-value', row: 2, payload: {token: 'b'}},
));

test('thoroughly unparseable CSS', validationTest(
  '<a href="http;.facebook.com>',
  css,
  {reason: 'invalid-token', row: 0},
));

test('acceptance', testValidatorAcceptance(css, 'css'));
