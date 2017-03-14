const fixtureFactory = require('fixture-factory');

// 'foobar'
const dummyPassword = '$2a$10$jqtfUwulMw6xqGUA.IsjkuAooNkAjPT3FJ9rRiUoSTsUpNTD8McxC';

fixtureFactory.register('user', {
  email: 'internet.email',
  password: dummyPassword,
  description: 'lorem.sentences',
  scope: 'user',
});

// Generate one test admin user
const testUser = {
  ...fixtureFactory.generateOne('user'),

  email: 'foo@bar.com',
  scope: 'admin',
};

exports.seed = knex => (
  knex('users')
    .insert(testUser)
    .then(() => knex.batchInsert('users', fixtureFactory.generate('user', 10)))
);
