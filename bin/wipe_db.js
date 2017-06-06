/* eslint-disable no-console */

import prompt from 'prompt';

import config from '../src/utils/config';
import knex from '../src/utils/db';

const schema = {
  properties: {
    confirmation: {
      required: true,
    },
  },
};

console.log('WARNING! This will wipe the database at:');
console.log(config.db);
console.log('Are you sure? (y/n)');
prompt.start();

prompt.get(schema, (err, result) => {
  if (err) {
    process.exit(1);
  }

  if (result.confirmation !== 'y') {
    console.log('Quitting.');
    process.exit(1);
  }

  knex.raw('DROP SCHEMA public CASCADE; CREATE SCHEMA public;')
  .then(() => {
    console.log('Successfully wiped database.');
    process.exit(0);
  });
});
