# Architecture

## Directory structure

```
bin
├── register_admin.js   # Helper script for registering admin users
└── wipe_db.js          # Helper script for wiping the database

db
├── migrations          # Database initial schema + migrations
├── seeds-dev           # Seed data (development environments)
├── seeds-prod          # Seed data (production environments)
└── knexfile.js         # knex.js (database) configuration

dist
└── ...                 # Contains built app ready for distribution

src
├── __mocks__           # Jest mock files
├── handlers            # Handlers (more below)
├── models              # Database models (more below)
├── routes              # Routes (more below)
├── utils
│   ├── auth.js         # Authentication helpers
│   ├── config.js       # App main config
│   ├── db.js           # Database setup
│   ├── image.js        # Image manipulation utils
│   └── log.js          # Logger configuration
├── backend-kit.js      # Entry point of app
└── server.js           # Server config

Procfile                # Heroku configuration
```

## Routes

Route files specify what your REST API will look like to the outside world. Here you will connect
the REST endpoints with matching handlers, perform basic input validation and perform basic
checks that the user has sufficient rights to access the endpoint.

### Array of route configs
Each route file contains an array of routes that it wants to configure, for example:

```
// src/routes/example.js

// Import your handlers here (more about handlers below)
import { exampleHandler, handlerWithId } from '../handlers/example';

const myRoutes = [
  // Example API endpoint route config
  {
    method: 'GET',
    path: '/example',
    handler: exampleHandler,
  },

  // Example with path params and user authentication check
  {
    method: 'GET',
    path: '/example/{myId}',
    config: getAuthWithScope('user'),
    handler: handlerWithId,
  },
  ...
];
```

Additionally, the route file must export the routes array in a specific way so `hapi-routes` finds
it:

```
...
export default myRoutes;

// Here we register the routes
export const routes = server => server.route(myRoutes);
```

### config parameter

Each route config can additionally contain a `config` parameter, which can be used to perform
input validation and check user authentication.

#### Input validation

To make the example API endpoint above require a valid `email` and an optional `year` which if
supplied, must be in the range 1900-2017, make the following changes:

```
const exampleValidationConfig = {
  validate: {
    payload: {
      email: Joi.string().email().required(),
      year: Joi.number().integer().min(1900).max(2017),
    },
  },
};

const myRoutes = [
  // Example API endpoint route config
  {
    method: 'GET',
    path: '/example',
    config: exampleValidationConfig,
    handler: exampleHandler,
  },
  ...
];
```

See the [Joi API Reference](https://github.com/hapijs/joi/blob/master/API.md) for more info on
input validation.

#### User authentication

Let's say we want to make the example API endpoint require that a user is authenticated with scope
`user`. We have to make the following changes:

```
...
import { getAuthWithScope } from '../utils/auth';

const myRoutes = [
  // Example API endpoint route config
  {
    method: 'GET',
    path: '/example',
    config: getAuthWithScope('user'),
    handler: exampleHandler,
  },
  ...
];
```

#### Doing both input validation and user authentication

Notice how previously we've been doing only **either** input validation **or** user authentication?

There's a way to do both, by merging the configs:

```
...
import { merge } from 'lodash';
import { getAuthWithScope } from '../utils/auth';

const exampleValidationConfig = { ... };

const myRoutes = [
  // Example API endpoint route config
  {
    method: 'GET',
    path: '/example',
    config: merge({}, exampleValidationConfig, getAuthWithScope('user')),
    handler: exampleHandler,
  },
  ...
];
```

NOTE: Make sure to use an empty object as first argument to `merge({}, ...`, so that you do not
mutate your other config variables!

NOTE 2: ES6 object spread `config: {...exampleValidationConfig, ...getAuthWithScope('user'), ...}`
would also work in many cases, but as it won't recursively merge objects, you may end up with only
parts of the input configs.

## Handlers

Handlers decide what a REST API endpoint actually does, by receiving the parameters of the
request, doing some computations on these and returning a result.

### Received request parameters include:

```
request.params:
  Path parameters (in our /example/{myId} route there would be a request.params.myId)

request.payload:
  POST data payload

request.pre.user:
  Authenticated user data (if using getAuthWithScope())

request.headers:
  The raw request headers
```

[(More info about the request object)](https://hapijs.com/api#request-object)

### Handler implementation

A handler can be very simple, let's make one that just returns the text 'Hello, world!':

```
// src/handlers/example.js

export const exampleHandler = (request, reply) => reply('Hello, world!');
```

Let's make another that makes use of the `/example/{myId}` endpoint and fetches an item from the
database based on the supplied ID:

```
// src/handlers/example.js

// Import your models here (more about models below)
import { dbGetItem } from '../models/example';

...
export const handlerWithId = (request, reply) => dbGetItem(request.params.myId).then(reply);
```

Or do some more complex stuff:

```
// src/handlers/example.js

...
export const complexHandler = (request, reply) => {
  if (request.pre && request.pre.user) {
    // Authenticated
    console.log(request.pre.user);

    const userId = request.pre.user.id;

    if (userId < 10) {
      return reply(`<pre>Yay! User ID is below 10</pre>`);
    }

    return reply(`<pre>User ID is ${userId}</pre>`);
  }

  return reply(`<pre>User ID <b>unauthenticated!</b></pre>`);
};
```

## Models

Database models allow your handler to access and modify db contents. Let's start by implementing
the `dbGetItem` function from the example above.

```
// src/models/example.js

import knex from '../utils/db';

export const dbGetItem = (id) => (
  knex('tableName')
    .first()
    .where({ id })
);
```

That's it! This will fetch the first item from the table `tableName` with `tableName.id` matching
`id`. See `src/models/users.js` for more simple DB query examples. Have a look at
[knex.js documentation](http://knexjs.org/) for documentation on more complex DB queries.
