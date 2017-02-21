const fixtureFactory = require('fixture-factory');

// 'foobar'
const dummyPassword = '$2a$10$jqtfUwulMw6xqGUA.IsjkuAooNkAjPT3FJ9rRiUoSTsUpNTD8McxC';

fixtureFactory.register('user', {
  email: 'internet.email',
  password: dummyPassword,
  description: 'lorem.sentences',
});

const testUser = Object.assign({}, fixtureFactory.generateOne('user'), { email: 'foo@bar.com' });

exports.seed = knex => {
  return knex('users')
    .insert(testUser)
    .then(() => {
      return knex.batchInsert('users', fixtureFactory.generate('user', 10));
    })
};
