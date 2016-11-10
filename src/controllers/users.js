import Boom from 'boom';

import { resizeImage } from '../utils/image';
import { createToken } from '../utils/auth';
import { dbGetUsers, dbGetUser, dbDelUser, dbUpdateUser } from '../models/users';

export const getUsers = (request, reply) => dbGetUsers().then(reply);
export const getUser = (request, reply) => dbGetUser(request.params.userId).then(reply);
export const delUser = (request, reply) => dbDelUser(request.params.userId).then(reply);

export const updateUser = async (request, reply) => {
  if (request.pre.user.id !== request.params.userId) {
    return reply(Boom.unauthorized('Can only update own userId!'));
  }

  const fields = {
    email: request.payload.email,
    description: request.payload.description,
    image: request.payload.image,
  };

  if (fields.image) {
    const buf = Buffer.from(fields.image, 'base64');
    await resizeImage(buf).then(resized => (fields.image = resized));
  }

  return dbUpdateUser(request.params.userId, fields).then(reply);
};

export const authUser = (request, reply) => reply(createToken(request.pre.user.email, 'user'));
