module.exports = (server, options) => (
  new Promise(resolve => (
    server.inject(options, res => resolve(res))
  ))
);
