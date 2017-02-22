const config = require('./src/utils/config');

const COMMON_ENV = Object.assign({}, config.db, {
  // Use a single connection to execute migrations.
  pool: {
    min: 1,
    max: 1,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: 'db/migrations',
  },
});

// Feel free to create any number of other environments.
// The ones below are a best attempt at sensible defaults.
module.exports = {
  // Developer's local machine
  development: Object.assign({}, COMMON_ENV, {
    seeds: {
      directory: 'db/seeds-dev',
    },
  }),

  // Production environment
  production: Object.assign({}, COMMON_ENV, {
    seeds: {
      directory: 'db/seeds-prod',
    },
  }),
};
