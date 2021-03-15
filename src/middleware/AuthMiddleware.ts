const moment = require('moment').default || require('moment');

import UserRepository from '../repositories/DataBase/UserRepository';
import AuthenticationTokenRepository from '../repositories/DataBase/AuthenticationTokenRepository';
import AuthenticationError from '../errors/AuthenticationError';
import NotFoundError from '../errors/NotFoundError';
import { CTX } from '../interfaces/KoaInterfaces';
const userRepository = new UserRepository();
const authenticationTokenRepository = new AuthenticationTokenRepository();

export default async function (ctx: CTX, next: Function) {
  if (ctx.request.header.authorization) {
    const _token = ctx.request.header.authorization.replace('Bearer ', '');
    const token = await authenticationTokenRepository.findOneOrNull({ token: _token, type: 'access_token' });

    if (!token) {
      throw new AuthenticationError('Authentication Token Not Found');
    }

    const now = moment(new Date());
    const tokenDate = moment(token.startDate);

    if (now.diff(tokenDate) > 1000 * 60 * 60) {
      throw new AuthenticationError('Authentication Token expired');
    }

    const user = await userRepository.show(token.user);
    if (!user) {
      throw new NotFoundError(`user with id = ${token.user}`, 'database');
    }

    delete user._doc.password;

    ctx.auth = {
      token,
      user,
    };
  }

  await next();
}
