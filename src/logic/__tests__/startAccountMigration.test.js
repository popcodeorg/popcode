import startAccountMigration from '../startAccountMigration';

describe('startAccountMigration', () => {
  test(
    'not dismissed during undo period, successful migration',
    async() => {
      await startAccountMigration.process();

  });
});
