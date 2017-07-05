const simpleFixtures = require('simple-fixtures');
const faker = require('faker/locale/en');

const userFields = {
  email: faker.internet.email,
  description: faker.lorem.sentences,
  scope: 'user',
};

exports.seed = knex => (
  // Generate several test users (no password = login disabled)
  knex.batchInsert('users', simpleFixtures.generateFixtures(userFields, 10))
);
