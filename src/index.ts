require('dotenv').config();

import * as Koa from 'koa';

import * as logger from 'koa-logger';
import * as json from 'koa-json';
import * as bodyParser from 'koa-bodyparser';
import router from './router';
import errorMiddleware from './middleware/ErrorMiddleware';
import { CTX } from './interfaces/KoaInterfaces';

const app = new Koa();
app.use(async (ctx: CTX, next) => errorMiddleware(ctx, next));
app.use(json());
app.use(logger());
app.use(bodyParser());
app.use(router.routes());

const port = process.env.PORT || 80;

// Listen
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
