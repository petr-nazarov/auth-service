import { CTX } from '../../interfaces/KoaInterfaces';
import UserService from '../../services/UserService';
import AuthenticationError from '../../errors/AuthenticationError';
import validate from '../../services/validationService';
import { IsString } from 'class-validator';
// constructors

class SUpdateUserAddressRequest {
  @IsString()
  address: string;

  constructor(data: any) {
    this.address = data.address;
  }
}
export default class CatCheckController {
  async getUserInfo(ctx: CTX) {
    if (!ctx.auth || !ctx.auth.user || !ctx.auth.user._id) {
      throw new AuthenticationError('You are not logged in');
    }
    const data = await UserService.getUserInfo(ctx.auth.user._id);
    ctx.response.body = data;
  }

  async updateUserAddress(ctx: CTX) {
    if (!ctx.auth || !ctx.auth.user || !ctx.auth.user._id) {
      throw new AuthenticationError('You are not logged in');
    }
    const requestData: { address: string } = new SUpdateUserAddressRequest(ctx.request.body);
    await validate(requestData);
    const data = await UserService.updateUserAddress(ctx.auth.user._id, requestData.address);
    ctx.response.body = data;
  }
}
