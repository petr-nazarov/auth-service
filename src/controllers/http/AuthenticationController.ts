import { CTX } from '../../interfaces/KoaInterfaces';
import AuthenticationService from '../../services/AuthenticationService';
import GoogleOAuth2Repository from '../../repositories/http/GoogleOAuth2Repository';
import validate from '../../services/validationService';
import { IsString } from 'class-validator';
// constructors
const googleOAuth2Repository = new GoogleOAuth2Repository();
class SRefreshTokenRequest {
  @IsString()
  refresh_token: string;

  constructor(data: any) {
    this.refresh_token = data.refresh_token;
  }
}
export default class HealthCheckController {
  async googleAuth(ctx: CTX) {
    ctx.redirect(googleOAuth2Repository.getGoogleAuthURL());
  }

  async googleAuthRedirected(ctx: CTX) {
    const code = (ctx.request.query.code || '').toString();
    const data = await AuthenticationService.registerOrLoginUserAndProvideAuthenticationTokens(code);
    ctx.response.body = data;
  }

  async refreshToken(ctx: CTX) {
    const requestData = new SRefreshTokenRequest(ctx.request.body);
    await validate(requestData);
    console.log(requestData);
    const data = await AuthenticationService.refreshToken(requestData.refresh_token);
    return data;
  }
}
