exports.up = knex => (
  knex.schema
    .createTableIfNotExists('users', (table) => {
      table.increments('id').primary();
      table.text('email').notNullable().unique();
      table.text('password').notNullable();
      table.text('description');
      table.binary('image');
    })
);

exports.down = knex => (
  knex.schema
    .dropTableIfExists('users')
);
