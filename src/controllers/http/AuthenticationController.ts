import { CTX } from '../../interfaces/KoaInterfaces';
import AuthenticationService from '../../services/AuthenticationService';
import GoogleOAuth2Repository from '../../repositories/http/GoogleOAuth2Repository';

// constructors
const googleOAuth2Repository = new GoogleOAuth2Repository();

export default class HealthCheckController {
  async googleAuth(ctx: CTX) {
    ctx.redirect(googleOAuth2Repository.getGoogleAuthURL());
  }

  async googleAuthRedirected(ctx: CTX) {
    const code = (ctx.request.query.code || '').toString();
    const data = await AuthenticationService.registerOrLoginUserAndProvideAuthenticationTokens(code);
    ctx.response.body = data;
  }
}
