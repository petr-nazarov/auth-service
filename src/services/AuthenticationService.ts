// import { log } from './logService';
import { isNil } from 'ramda';
import GoogleOAuth2Repository from '../repositories/http/GoogleOAuth2Repository';
import UserRepository from '../repositories/dataBase/UserRepository';
import AuthenticationTokenRepository from '../repositories/dataBase/AuthenticationTokenRepository';
import * as bcrypt from 'bcrypt';
// constructors
const googleOAuth2Repository = new GoogleOAuth2Repository();
const userRepository = new UserRepository();
const authenticationTokenRepository = new AuthenticationTokenRepository();

const saltRoundsForAccessToken = 10;
const saltRoundsForRefreshToken = 20;
const TokenLifetime = 1000 * 60 * 60 * 24 * 2;

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

const registerOrLoginUserAndProvideAuthenticationTokens = async (googleOAuth2Code: string) => {
  const googleUserData = await googleOAuth2Repository.getUserInfo(googleOAuth2Code);
  const dbUser = await createOrFindUser(googleUserData.email);
  const accessToken = generateTokenStr();
  const refreshToken = generateTokenStr();
  const encryptedAccessToken = await bcrypt.hash(accessToken, saltRoundsForAccessToken);
  const encryptedRefreshToken = await bcrypt.hash(refreshToken, saltRoundsForRefreshToken);

  await authenticationTokenRepository.create({
    token: encryptedAccessToken,
    type: 'access_token',
    startDate: new Date(),
    user: dbUser._id,
  });
  await authenticationTokenRepository.create({
    token: encryptedRefreshToken,
    type: 'refresh_token',
    startDate: new Date(),
    user: dbUser._id,
  });

  return {
    access_token: accessToken,
    refreshToken: refreshToken,
  };
};

export default {
  registerOrLoginUserAndProvideAuthenticationTokens,
};
