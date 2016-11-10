import { getAuthWithScope, doAuthWithScope } from '../utils/auth';
import { getUsers, getUser, updateUser, delUser, authUser } from '../controllers/users';

const users = [
  // Get a list of all users
  { method: 'GET',
    path: '/users',
    config: getAuthWithScope('user'),
    handler: getUsers },

  // Get info about a specific user
  { method: 'GET',
    path: '/users/{userId}',
    config: getAuthWithScope('user'),
    handler: getUser },

  // Update user profile
  { method: 'POST',
    path: '/users/{userId}',
    config: doAuthWithScope('user'),
    handler: updateUser },

  // Delete a user, admin only
  { method: 'DELETE',
    path: '/users/{userId}',
    config: getAuthWithScope('admin'),
    handler: delUser },

  // Authenticate as user
  { method: 'POST',
    path: '/users/authenticate',
    config: doAuthWithScope('user'),
    handler: authUser },
];

export default users;

// Here we register the routes
export const routes = server => server.route(users);
