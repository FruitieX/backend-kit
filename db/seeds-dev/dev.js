const fixtureFactory = require('fixture-factory');

// 'foobar'
const dummyPassword = '$2a$10$jqtfUwulMw6xqGUA.IsjkuAooNkAjPT3FJ9rRiUoSTsUpNTD8McxC';

fixtureFactory.register('user', {
  email: 'internet.email',
  description: 'lorem.sentences',
  scope: 'user',
});

exports.seed = knex => (
  knex('users')
    // Generate one test admin user
    .insert({
      ...fixtureFactory.generateOne('user'),

      email: 'foo@bar.com',
      scope: 'admin',
    }, 'id')
    .then(ids => ids[0]) // Return first (only) user id

    // Set admin user password to 'foobar'
    .then(ownerId => knex('secrets').insert({
      ownerId,
      password: dummyPassword,
    }))

    // Generate several test users (no password = login disabled)
    .then(() => knex.batchInsert('users', fixtureFactory.generate('user', 10)))
);
