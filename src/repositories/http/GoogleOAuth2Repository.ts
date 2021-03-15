import { google } from 'googleapis';
import axios from 'axios';
import ExternalAPIError from '../../errors/ExternalAPIError';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_API_CLIENT_ID,
  process.env.GOOGLE_API_CLIENT_SECRET,
  /*
   * This is where Google will redirect the user after they
   * give permission to your application
   */
  'http://localhost:8080/auth/google/redirect'
);

export default class GoogleOAuth2Repository {
  getGoogleAuthURL() {
    /*
     * Generate a url that asks permissions to the user's email and profile
     */
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ];

    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: scopes, // If you only need one scope you can pass it as string
    });
  }
  async getUserInfo(code: string) {
    const { tokens } = await oauth2Client.getToken(code);
    try {
      const googleUser = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokens.id_token}`,
          },
        }
      );

      return googleUser.data;
    } catch (error) {
      throw new ExternalAPIError(error);
    }
  }
}
