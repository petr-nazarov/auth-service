import { CTX } from '../../interfaces/KoaInterfaces';
import { getHealthStatus } from '../../services/healthService';

export default class HealthCheckController {
  async index(ctx: CTX) {
    const str = ctx.request.query.str;
    ctx.response.body = getHealthStatus(str);
  }
}
