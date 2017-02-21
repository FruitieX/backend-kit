# Pepperoni Backend

This is a sample Node.js backend for the Pepperoni app kit.

# Setup guide

## Install project dependencies
```
yarn
```

## Install PostgreSQL

Look up instructions for your specific OS/distribution.

## Initialize DB
```
$ psql --user postgres
  CREATE DATABASE pepperoni;
  <C-d>

yarn db:migrate
```

## Insert seed data
```
# Run either of these

# Production environment
yarn db:seed

# Development environment, additionally inserts admin account with credentials: foo@bar.com:foobar
yarn db:seed-dev
```

## Register admin user (production environments)
```
# Get URL from e.g. Heroku dashboard
$ DATABASE_URL=postgres://user:pass@hostname/dbname node register_admin.js
```

## Set secret used for generating JWT tokens (production environments)
```
# Backend will refuse to run if NODE_ENV=production and this is not set:
$ export SECRET=[secret-string]
```

In Heroku, you can:
```
heroku config:set SECRET=[secret-string]
```

Recommendation for generating `[secret-string]`:
```
$ node
> require('crypto').randomBytes(32).toString('hex')
'790f9dd8653ba650cc7925a8d89e16eff533e8549dd65d071ddf6ea80ce1ab0a'
```

## Run backend
```
yarn start
```

Backend is now listening on port 3888 (or `$PORT` if set)

## Run backend in development, watching for changes
```
yarn watch
```

