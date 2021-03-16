import * as queryString from 'query-string';

import axios from 'axios';
// import ExternalAPIError from '../../errors/ExternalAPIError';

export default class GoogleOAuth2Repository {
  getFacebookAuthURL() {
    const stringifiedParams = queryString.stringify({
      client_id: process.env.FACEBOOK_API_CLIENT_ID,
      redirect_uri: 'http://localhost:8080/auth/facebook/redirect',
      scope: ['email'].join(','), // comma seperated string
      response_type: 'code',
      auth_type: 'rerequest',
      display: 'popup',
    });
    const facebookLoginUrl = `https://www.facebook.com/v4.0/dialog/oauth?${stringifiedParams}`;
    return facebookLoginUrl;
  }
  async getAccessTokenFromCode(code: string) {
    const { data } = await axios({
      url: 'https://graph.facebook.com/v4.0/oauth/access_token',
      method: 'get',
      params: {
        client_id: process.env.FACEBOOK_API_CLIENT_ID,
        client_secret: process.env.FACEBOOK_API_CLIENT_SECRET,
        redirect_uri: 'http://localhost:8080/auth/facebook/redirect',
        code,
      },
    });
    return data.access_token;
  }
  async getFacebookUserData(access_token: string) {
    const { data } = await axios({
      url: 'https://graph.facebook.com/me',
      method: 'get',
      params: {
        fields: ['id', 'email', 'first_name', 'last_name'].join(','),
        access_token: access_token,
      },
    });
    return data;
  }
}
