import knex from 'knex';
// import pg from 'pg';

import config from './config';

// Use ssl by default
// pg.defaults.ssl = true;

export default knex(config.db);

/**
 * Builds SQL query with given filter object.
 * Returns rows matching all given fields (default), or any given field.
 *
 * Sample usage:
 *
 * knex('users')
 *   .where(likeFilter({
 *     name: 'foo',
 *     email: '@bar.com'
 *   }))
 */
export const likeFilter = (filters, anyField = false) => (origQuery) => {
  let q = origQuery;

  Object.keys(filters).forEach((key, index) => {
    if (!index) {
      // first field with .whereRaw()
      q = q.whereRaw(`LOWER(${key}) LIKE '%' || LOWER(?) || '%'`, filters[key]);
    } else if (anyField) {
      // if anyField true, additional fields use .orWhereRaw() (any field must match)
      q = q.orWhereRaw(`LOWER(${key}) LIKE '%' || LOWER(?) || '%'`, filters[key]);
    } else {
      // by default additional fields use .andWhereRaw() (all fields must match)
      q = q.andWhereRaw(`LOWER(${key}) LIKE '%' || LOWER(?) || '%'`, filters[key]);
    }
  });

  return q;
};
