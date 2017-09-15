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

    bcrypt.hash(result.password, salt, async (hashErr, hash) => {
      if (hashErr) {
        console.log(hashErr);
        process.exit(1);
      } else {
        await knex.transaction(async trx => {
          const user = await trx('users')
            .insert({
              email: result.email,
              scope: 'admin',
            })
            .returning('*')
            .then(results => results[0]); // return only first result

          await trx('secrets').insert({
            ownerId: user.id,
            password: hash,
          });
        });

        console.log('Successfully created new admin user.');
        process.exit(0);
      }
    });
  });
});
