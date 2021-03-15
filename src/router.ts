// imports
import * as Router from 'koa-router';
import { CTX } from './interfaces/KoaInterfaces';
import HealthCheckController from './controllers/http/HealthCheckController';
const router = new Router();

// controllers constructors
const healthCheckController = new HealthCheckController();
// routes
router.get('/health', async (ctx: CTX) => healthCheckController.index(ctx));

export default router;
