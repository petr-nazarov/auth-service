// import { log } from './logService';
const moment = require('moment').default || require('moment');
import { isNil } from 'ramda';
import GoogleOAuth2Repository from '../repositories/http/GoogleOAuth2Repository';
import FacebookOAuth2Repository from '../repositories/http/FacebookOAuth2Repository';
import UserRepository from '../repositories/dataBase/UserRepository';
import AuthenticationTokenRepository from '../repositories/dataBase/AuthenticationTokenRepository';
import AuthenticationError from '../errors/AuthenticationError';
import NotFoundError from '../errors/NotFoundError';
// constructors
const googleOAuth2Repository = new GoogleOAuth2Repository();
const facebookOAuth2Repository = new FacebookOAuth2Repository();
const userRepository = new UserRepository();
const authenticationTokenRepository = new AuthenticationTokenRepository();

const generateTokenStr = (length = 121): string => {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-.';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const createOrFindUser = async (email: string): Promise<{ email: string; address: string | null; _id: string }> => {
  const dbUserData = await userRepository.findOneOrNull({ email: email });
  if (isNil(dbUserData)) {
    const newUser = userRepository.create({ email: email });
    return newUser;
  }
  return dbUserData;
};

const createTokenPair = async (userId: string) => {
  const dbAccessToken = await authenticationTokenRepository.create({
    token: generateTokenStr(),
    type: 'access_token',
    startDate: new Date(),
    user: userId,
  });
  const dbRefreshToken = await authenticationTokenRepository.create({
    token: generateTokenStr(),
    type: 'refresh_token',
    startDate: new Date(),
    user: userId,
  });

  return {
    access_token: dbAccessToken.token,
    refreshToken: dbRefreshToken.token,
  };
};

const registerOrLoginUserAndProvideAuthenticationTokensFromGoogle = async (googleOAuth2Code: string) => {
  const googleUserData = await googleOAuth2Repository.getUserInfo(googleOAuth2Code);
  const dbUser = await createOrFindUser(googleUserData.email);
  await createTokenPair(dbUser._id);
};
const registerOrLoginUserAndProvideAuthenticationTokensFromFacebook = async (facebookOAuth2Code: string) => {
  const accessToken = await facebookOAuth2Repository.getAccessTokenFromCode(facebookOAuth2Code);
  const facebookUser = await facebookOAuth2Repository.getFacebookUserData(accessToken);
  const dbUser = await createOrFindUser(facebookUser.email);
  return await createTokenPair(dbUser._id);
};

const refreshToken = async (refreshToken: string) => {
  const token = await authenticationTokenRepository.findOneOrNull({ token: refreshToken, type: 'refresh_token' });

  if (!token) {
    throw new AuthenticationError('Refresh Token Not Found');
  }
  const now = moment(new Date());
  const tokenDate = moment(token.startDate);

  if (now.diff(tokenDate) > 1000 * 60 * 60 * 24 * 7) {
    throw new AuthenticationError('Authentication Token expired');
  }

  const user = await userRepository.show(token.user);
  if (!user) {
    throw new NotFoundError(`user with id = ${token.user}`, 'database');
  }

  return await createTokenPair(user._id);
};

export default {
  registerOrLoginUserAndProvideAuthenticationTokensFromGoogle,
  registerOrLoginUserAndProvideAuthenticationTokensFromFacebook,
  refreshToken,
};
