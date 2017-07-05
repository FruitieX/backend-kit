const fixtureFactory = require('fixture-factory');

fixtureFactory.register('user', {
  email: 'internet.email',
  description: 'lorem.sentences',
  scope: 'user',
});

exports.seed = knex => (
  // Generate several test users (no password = login disabled)
  knex.batchInsert('users', fixtureFactory.generate('user', 10))
);
