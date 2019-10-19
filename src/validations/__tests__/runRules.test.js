import runRules from '../html/runRules';

describe('structural html validation', () => {
  test('openTag row', async () => {
    expect.assertions(1);
    await runRules(
      [
        {
          openTag({row}) {
            expect(row).toEqual(2);
          },
          *done() {},
        },
      ],
      '\n\n<div>',
    );
  });

  test('openTag column', async () => {
    expect.assertions(1);
    await runRules(
      [
        {
          openTag({column}) {
            expect(column).toEqual(1);
          },
          *done() {},
        },
      ],
      '\n <div>',
    );
  });
  test('openTag name', async () => {
    expect.assertions(1);
    await runRules(
      [
        {
          openTag(_, {name}) {
            expect(name).toEqual('div');
          },
          *done() {},
        },
      ],
      '<div>',
    );
  });

  test('openTag skips void tag', async () => {
    expect.assertions(0);
    await runRules(
      [
        {
          openTag(location, tag) {
            throw new Error(
              `location: ${JSON.stringify(location)} tag: ${JSON.stringify(
                tag,
              )}`,
            );
          },
          *done() {},
        },
      ],
      '<img>',
    );
  });

  test('openTag skips self-closing non-void tag', async () => {
    expect.assertions(0);
    await runRules(
      [
        {
          openTag(location, tag) {
            throw new Error(
              `location: ${JSON.stringify(location)} tag: ${JSON.stringify(
                tag,
              )}`,
            );
          },
          *done() {},
        },
      ],
      '<div/>',
    );
  });

  test('closeTag row', async () => {
    expect.assertions(1);
    await runRules(
      [
        {
          closeTag({row}) {
            expect(row).toEqual(2);
          },
          *done() {},
        },
      ],
      '\n\n</div>',
    );
  });

  test('closeTag column', async () => {
    expect.assertions(1);
    await runRules(
      [
        {
          closeTag({column}) {
            expect(column).toEqual(1);
          },
          *done() {},
        },
      ],
      '\n </div>',
    );
  });
  test('closeTag name', async () => {
    expect.assertions(1);
    await runRules(
      [
        {
          closeTag(_, name) {
            expect(name).toEqual('div');
          },
          *done() {},
        },
      ],
      '</div>',
    );
  });
  test('event sequence', async () => {
    const events = [];
    // Use Array.from to consume the errors.
    Array.from(
      await runRules(
        [
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
        ],
        ' <div> <p> </p> </div> ',
      ),
    );
    expect(events).toEqual(['<div>', '<p>', '</p>', '</div>', null]);
  });

  test('chains errors', async () => {
    const errors = Array.from(
      await runRules(
        [
          {
            *done() {
              yield 2;
            },
          },
          {
            *done() {
              yield 1;
            },
          },
        ],
        '',
      ),
    );
    // To avoid dependence on iteration order.
    errors.sort();
    expect(errors).toEqual([1, 2]);
  });
});
