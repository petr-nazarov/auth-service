// imports
import * as Router from 'koa-router';
import { CTX } from './interfaces/KoaInterfaces';
import HealthCheckController from './controllers/http/HealthCheckController';
import AuthenticationController from './controllers/http/AuthenticationController';
const router = new Router();

// controllers constructors
const healthCheckController = new HealthCheckController();
const authenticationController = new AuthenticationController();
// routes
router.get('/health', async (ctx: CTX) => healthCheckController.index(ctx));
router.get('/auth/google/redirect', async (ctx: CTX) => authenticationController.googleAuthRedirected(ctx));
router.get('/auth/google', async (ctx: CTX) => authenticationController.googleAuth(ctx));
export default router;
