const env = process.env;

if (!env.NODE_ENV || env.NODE_ENV === 'development') {
  require('dotenv').config({ silent: true });
}

const requiredEnvironmentVariables = [
  'DATABASE_URL',
  'SECRET',
];

if (env.NODE_ENV && (env.NODE_ENV !== 'development' && env.NODE_ENV !== 'test')) {
  requiredEnvironmentVariables.forEach((key) => {
    if (!env[key]) {
      console.log(`Warning: Environment variable ${key} not set.`);
      throw new Error('Quitting.');
    }
  });
}

module.exports = Object.freeze({
  server: {
    host: env.HOST || '0.0.0.0',
    port: env.PORT || 3888,
  },
  db: {
    client: 'pg',
    connection: env.DATABASE_URL || {
      host: '127.0.0.1',
      user: 'postgres',
      password: '',
      database: 'pepperoni',
      ssl: false,
    },
  },
  auth: {
    secret: env.SECRET || 'really_secret_key',
    saltRounds: 10,
    options: {
      algorithm: 'HS256',
      expiresIn: '24h',
    },
  },
});
