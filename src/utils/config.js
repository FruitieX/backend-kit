import dotenv from 'dotenv';

const env = process.env;

if (!env.NODE_ENV || env.NODE_ENV === 'development') {
  dotenv.config({ silent: true });
}

const requiredEnvironmentVariables = ['DATABASE_URL', 'SECRET'];

if (
  env.NODE_ENV &&
  (env.NODE_ENV !== 'development' && env.NODE_ENV !== 'test')
) {
  requiredEnvironmentVariables.forEach(key => {
    if (!env[key]) {
      /* eslint-disable no-console */
      console.log(`Warning: Environment variable ${key} not set.`);
      /* eslint-enable no-console */

      throw new Error('Quitting.');
    }
  });
}

const config = {
  server: {
    host: env.HOST || '0.0.0.0',
    port: env.PORT || 3888,
  },
  db: {
    // Common config for all db environments
    debug: false, // Toggle db debugging
    client: 'pg',
    connection: env.DATABASE_URL || {
      host: '127.0.0.1',
      user: 'postgres',
      password: '',
      database: 'backendkit',
      ssl: false,
    },
    pool: {
      min: 1,
      max: 1,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: 'migrations',
    },
  },
  auth: {
    secret: env.SECRET || 'really_secret_key',
    saltRounds: 10,
    options: {
      algorithms: ['HS256'],
      expiresIn: '24h',
    },
  },
};

export default {
  ...config,
  db: {
    // Developer's local machine
    development: {
      ...config.db,

      seeds: {
        directory: 'seeds-dev',
      },
    },

    // Production environment
    production: {
      ...config.db,

      seeds: {
        directory: 'seeds-prod',
      },
    },
  },
};
