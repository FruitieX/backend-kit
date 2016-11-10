const knex = require('./src/db').knexlocal;
const prompt = require('prompt');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const schema = {
  properties: {
    email: {
      required: true,
    },
    password: {
      required: true,
      hidden: true,
    },
  }
};

console.log('Enter credentials of new admin user:');
prompt.start();

prompt.get(schema, function(err, result) {
  if (err) {
    process.exit(1);
  }

  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    bcrypt.hash(result.password, salt, (err, hash) => {
      if (err) {
        console.log(err);
        process.exit(1);
      } else {
        knex('Admin').insert({
          email: result.email,
          password: hash,
        }).then(() => {
          console.log('Successfully created new admin user.');
          process.exit(0);
        });
      }
    });
  });
});
