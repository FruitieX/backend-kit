import knex from '../utils/db';

export const dbGetUsers = () => (
  knex('users')
    .select('id', 'email')
);

export const dbGetUser = id => (
  knex('users')
    .first('id', 'email', 'description', 'image')
    .where({ id })
);

export const dbUpdateUser = (id, fields) => (
  knex('users')
    .update({ ...fields })
    .where({ id })
);

export const dbDelUser = id => (
  knex('users')
    .where({ id })
    .del()
);
