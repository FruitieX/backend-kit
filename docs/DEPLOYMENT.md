# Deployment

Make sure you have performed the [setup](/docs/SETUP.md) steps first including setting all
environment variables as required.

## Build for production (optional)

If you just with to do a production build, run:
```
$ yarn build
```

The output will be placed into `dist/`

## Run in production mode

Run the backend in production mode.

This steps automatically builds the app, then runs it.
```
$ yarn start
```

## Deploy

### [Heroku](https://www.heroku.com)

The included [Procfile](/Procfile) does a `db:migrate` followed by `start`.

Create a new Heroku app and provision a Postgres database for it:
```
heroku create [app-name]
heroku addons:create hobby-postgresql:hobby-dev
heroku pg:wait
```

You will have to manually run the seed data if it is needed:
```
# Get URL from e.g. Heroku dashboard
DATABASE_URL=postgres://user:pass@hostname/dbname yarn db:seed
```
