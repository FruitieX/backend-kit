import knex from 'knex';
// import pg from 'pg';

import config from './config';

// Use ssl by default
// pg.defaults.ssl = true;

export default knex(config.db);
