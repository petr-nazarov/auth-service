// import { log } from './logService';
import { isNil } from 'ramda';
import GoogleOAuth2Repository from '../repositories/http/GoogleOAuth2Repository';
import UserRepository from '../repositories/dataBase/UserRepository';
import AuthenticationTokenRepository from '../repositories/dataBase/AuthenticationTokenRepository';
// constructors
const googleOAuth2Repository = new GoogleOAuth2Repository();
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

const registerOrLoginUserAndProvideAuthenticationTokens = async (googleOAuth2Code: string) => {
  const googleUserData = await googleOAuth2Repository.getUserInfo(googleOAuth2Code);
  const dbUser = await createOrFindUser(googleUserData.email);

  const dbAccessToken = await authenticationTokenRepository.create({
    token: generateTokenStr(),
    type: 'access_token',
    startDate: new Date(),
    user: dbUser._id,
  });
  const dbRefreshToken = await authenticationTokenRepository.create({
    token: generateTokenStr(),
    type: 'refresh_token',
    startDate: new Date(),
    user: dbUser._id,
  });

  return {
    access_token: dbAccessToken.token,
    refreshToken: dbRefreshToken.token,
  };
};

export default {
  registerOrLoginUserAndProvideAuthenticationTokens,
};
