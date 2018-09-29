import test from 'tape';

import runRules from '../../../../src/validations/html/runRules';

test('openTag row', async(t) => {
  t.plan(1);
  await runRules([
    {
      openTag({row}) {
        t.equal(row, 2);
      },

      * done() {
      },
    },
  ], '\n\n<div>');
  t.end();
});

test('openTag column', async(t) => {
  t.plan(1);
  await runRules([
    {
      openTag({column}) {
        t.equal(column, 1);
      },

      * done() {
      },
    },
  ], '\n <div>');
  t.end();
});

test('openTag name', async(t) => {
  t.plan(1);
  await runRules([
    {
      openTag(_, {name}) {
        t.equal(name, 'div');
      },

      * done() {
      },
    },
  ], '<div>');
  t.end();
});

test('openTag skips void tag', async(t) => {
  await runRules([
    {
      openTag(location, tag) {
        t.fail(
          `location: ${JSON.stringify(location)} tag: ${JSON.stringify(tag)}`);
      },

      * done() {
      },
    },
  ], '<img>');
  t.end();
});

test('openTag skips self-closing non-void tag', async(t) => {
  await runRules([
    {
      openTag(location, tag) {
        t.fail(
          `location: ${JSON.stringify(location)} tag: ${JSON.stringify(tag)}`);
      },

      * done() {
      },
    },
  ], '<div/>');
  t.end();
});

test('closeTag row', async(t) => {
  t.plan(1);
  await runRules([
    {
      closeTag({row}) {
        t.equal(row, 2);
      },

      * done() {
      },
    },
  ], '\n\n</div>');
  t.end();
});

test('closeTag column', async(t) => {
  t.plan(1);
  await runRules([
    {
      closeTag({column}) {
        t.equal(column, 1);
      },

      * done() {
      },
    },
  ], '\n </div>');
  t.end();
});

test('closeTag name', async(t) => {
  t.plan(1);
  await runRules([
    {
      closeTag(_, name) {
        t.equal(name, 'div');
      },

      * done() {
      },
    },
  ], '</div>');
  t.end();
});

test('event sequence', async(t) => {
  const events = [];
  // Use Array.from to consume the errors.
  Array.from(await runRules([
    {
      openTag(_, {name}) {
        events.push(`<${name}>`);
      },

      closeTag(_, name) {
        events.push(`</${name}>`);
      },

      done() {
        events.push(null);
        return [];
      },
    },
  ], ' <div> <p> </p> </div> '));
  t.deepEqual(events, ['<div>', '<p>', '</p>', '</div>', null]);
  t.end();
});

test('chains errors', async(t) => {
  const errors = Array.from(await runRules([
    {
      * done() {
        yield 2;
      },
    }, {
      * done() {
        yield 1;
      },
    },
  ], ''));
  // To avoid dependence on iteration order.
  errors.sort();
  t.deepEqual(errors, [1, 2]);
  t.end();
});
