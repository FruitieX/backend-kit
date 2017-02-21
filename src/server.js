import Glue from 'glue';
import Routes from 'hapi-routes';
import Hoek from 'hoek';

import config from './utils/config';
import { validateJwt } from './utils/auth';
import { goodOptions } from './utils/log';

// Uncomment if you want UTC as timezone
// process.env.TZ = 'UTC';

export default Glue.compose({
  server: {
    // Only affects verbosity of logging to console
    debug: process.env.NODE_ENV === 'test' ? false : { request: ['error'] },
  },
  connections: [{
    labels: ['web'],
    host: config.server.host,
    port: config.server.port,
    routes: {
      cors: true,
    },
  }],
  registrations: [{
    plugin: 'hapi-auth-jwt2',
  }, {
    plugin: {
      register: 'good',
      options: goodOptions,
    },
  }],
})
.then((server) => {
  server.auth.strategy('jwt', 'jwt', {
    key: config.auth.secret,
    validateFunc: validateJwt,
    verifyOptions: { algorithms: config.auth.algorithms },
  });

  // Uncomment to require authentication by default in all routes
  // server.auth.default('jwt');

  // Register routes once auth strategy is set up
  return new Promise((resolve) => {
    server.register({
      register: Routes,
      options: { dir: 'src/routes' },
    }, (err) => {
      Hoek.assert(!err, err);
      resolve(server);
    });
  });
});
