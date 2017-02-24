#!/usr/bin/env node

/* eslint-disable no-console */

import Hoek from 'hoek';
import compose from './server';

compose
  .then((server) => {
      // Start the server
    server.start((err) => {
      Hoek.assert(!err, err);
      console.log('Server running at:', server.info.uri);
    });
  })
  .catch((err) => {
    console.error('Error while starting server:', err);
  });
