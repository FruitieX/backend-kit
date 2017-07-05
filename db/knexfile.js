import config from '../src/utils/config';

const COMMON_ENV = {
  ...config.db,

  // Use a single connection to execute migrations.
  pool: {
    min: 1,
    max: 1,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: 'migrations',
  },
};

// Feel free to create any number of other environments.
// The ones below are a best attempt at sensible defaults.
module.exports = {
  // Developer's local machine
  development: {
    ...COMMON_ENV,

    seeds: {
      directory: 'seeds-dev',
    },
  },

  // Production environment
  production: {
    ...COMMON_ENV,

    seeds: {
      directory: 'seeds-prod',
    },
  },
};
