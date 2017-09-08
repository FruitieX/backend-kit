import Glue from 'glue';
import Routes from 'hapi-routes-relative';
import Hoek from 'hoek';
import { join } from 'path';

import config from './utils/config';
import { validateJwt } from './utils/auth';
import { goodOptions } from './utils/log';

// Always use UTC timezone
process.env.TZ = 'UTC';

// Glue is a hapi.js server wrapper
export default Glue.compose({
  server: {
    // Only affects verbosity of logging to console
    debug: process.env.NODE_ENV === 'test' ? false : { request: ['error'] },
  },
  connections: [
    {
      labels: ['web'],
      host: config.server.host,
      port: config.server.port,
      routes: {
        cors: true,
      },
    },
  ],
  registrations: [
    {
      plugin: 'hapi-auth-jwt2',
    },
    {
      plugin: 'hapi-qs',
    },
    {
      plugin: {
        register: 'good',
        options: goodOptions,
      },
    },
  ],
}).then(server => {
  server.auth.strategy('jwt', 'jwt', {
    key: config.auth.secret,
    validateFunc: validateJwt,
    verifyOptions: { algorithms: config.auth.algorithms },
  });

  // Uncomment to require authentication by default in all routes
  // server.auth.default('jwt');

  // Register routes once auth strategy is set up
  return new Promise(resolve => {
    server.register(
      {
        register: Routes,
        options: { dir: join(__dirname, 'routes') },
      },
      err => {
        Hoek.assert(!err, err);
        resolve(server);
      },
    );
  });
});
