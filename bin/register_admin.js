/* eslint-disable no-console */

import prompt from 'prompt';
import bcrypt from 'bcryptjs';

import config from '../src/utils/config';
import knex from '../src/utils/db';

const saltRounds = config.auth.saltRounds;
const schema = {
  properties: {
    email: {
      required: true,
    },
    password: {
      required: true,
      hidden: true,
    },
  },
};

console.log('Enter credentials of new admin user:');
prompt.start();

prompt.get(schema, (err, result) => {
  if (err) {
    process.exit(1);
  }

  bcrypt.genSalt(saltRounds, (saltErr, salt) => {
    if (saltErr) {
      console.log(saltErr);
      process.exit(1);
    }

    bcrypt.hash(result.password, salt, (hashErr, hash) => {
      if (hashErr) {
        console.log(hashErr);
        process.exit(1);
      } else {
        knex('users')
          .insert({
            email: result.email,
            password: hash,
            scope: 'admin',
          })
          .then(() => {
            console.log('Successfully created new admin user.');
            process.exit(0);
          });
      }
    });
  });
});
