// imports
import * as Router from 'koa-router';
import { CTX } from './interfaces/KoaInterfaces';
import HealthCheckController from './controllers/http/HealthCheckController';
import AuthenticationController from './controllers/http/AuthenticationController';
import UserController from './controllers/http/UserController';
const router = new Router();

// controllers constructors
const healthCheckController = new HealthCheckController();
const authenticationController = new AuthenticationController();
const userController = new UserController();
// routes
router.get('/health', async (ctx: CTX) => healthCheckController.index(ctx));

router.get('/auth/google/redirect', async (ctx: CTX) => authenticationController.googleAuthRedirected(ctx));
router.get('/auth/google', async (ctx: CTX) => authenticationController.googleAuth(ctx));

router.get('/auth/facebook/redirect', async (ctx: CTX) => authenticationController.facebookAuthRedirected(ctx));
router.get('/auth/facebook', async (ctx: CTX) => authenticationController.facebookAuth(ctx));

router.post('/auth/refresh', async (ctx: CTX) => authenticationController.refreshToken(ctx));
router.get('/user', async (ctx: CTX) => userController.getUserInfo(ctx));
router.post('/user', async (ctx: CTX) => userController.updateUserAddress(ctx));

export default router;
