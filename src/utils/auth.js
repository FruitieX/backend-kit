import Boom from 'boom';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import config from './config';
import knex from './db';

const bearerRegex = /(Bearer\s+)*(.*)/i;

// Check that a decoded JWT contains all required fields
export const validateJwt = (decoded, request, callback) => {
  const invalidToken = !decoded.id || !decoded.email || !decoded.scope;

  if (invalidToken) {
    callback(new Error('JWT is missing some fields and not valid! Please log out and in again.'), false);
  } else {
    callback(null, true);
  }
};

// Hapi pre handler which fetches all fields from JWT
export const bindUserData = (request, reply) => {
  const authHeader = request.headers.authorization;

  // strip "Bearer" word from header if present
  const token = authHeader.match(bearerRegex)[2];
  const decoded = jwt.decode(token);

  reply(decoded);
};

// Hapi route config which makes sure user has authenticated with `scope`
export const getAuthWithScope = scope => ({
  auth: { strategy: 'jwt', scope: ['admin', scope] },
  pre: [{ method: bindUserData, assign: 'user' }],
});

export const comparePasswords = (passwordAttempt, user) => (
  new Promise((resolve, reject) => (
    bcrypt.compare(passwordAttempt, user.password, (err, isValid) => {
      if (!err && isValid) {
        resolve(user);
      } else {
        reject('Incorrect password attempt');
      }
    })
  ))
);

// Verify credentials for user
export const verifyCredentials = ({ payload: { email, password } }, reply) => (
  knex('users')
    .first()
    .where({ email })
    .then((user) => {
      if (!user) {
        Promise.reject(`User with email ${email} not found in database`);
      }

      return comparePasswords(password, user);
    })
    .then(reply)
    .catch(() => {
      reply(Boom.unauthorized('Incorrect email or password!'));
    })
);

// Hapi route config which performs user authentication
export const doAuth = ({
  validate: {
    payload: {
      email: Joi.string().required(),
      password: Joi.string().required(),
    },
    failAction: (request, reply) => {
      reply(Boom.unauthorized('Incorrect email or password!'));
    },
  },
  pre: [
    { method: verifyCredentials, assign: 'user' },
  ],
});

// Create a new JWT for user with `email` and `scope`
export const createToken = (id, email, scope) => ({
  token: jwt.sign({ id, email, scope }, config.auth.secret, {
    algorithm: config.auth.options.algorithms[0],
  }),
});

// Return promise which resolves to hash of given password
export const hashPassword = password => (
  new Promise((resolve, reject) => {
    bcrypt.genSalt(config.auth.saltRounds, (saltErr, salt) => {
      if (saltErr) {
        reject(saltErr);
      }
      bcrypt.hash(password, salt, (hashErr, hash) => {
        if (hashErr) {
          reject(hashErr);
        } else {
          resolve(hash);
        }
      });
    });
  })
);
