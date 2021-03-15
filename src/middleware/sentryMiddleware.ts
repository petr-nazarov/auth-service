import InternalError from '../errors/InternalError';
import * as Sentry from '@sentry/node';
import { extractTraceparentData, stripUrlQueryAndFragment } from '@sentry/tracing';
import { CTX } from 'src/interfaces/KoaInterfaces';

const env = process.env.ENV || 'local';
const buildVersion = process.env.BUILD_VERSION || '0';

// TODO paste DNS
const dsn = '';
Sentry.init({
  dsn,
  environment: env,
  release: buildVersion,
  tracesSampleRate: 1.0,
  debug: false,
});

export function SentryCapture(error: InternalError, ctx: CTX | null = null) {
  if (env != 'local' && process.env.NODE_ENV !== 'test') {
    Sentry.withScope(function (scope) {
      if (ctx && ctx.request) {
        scope.addEventProcessor(function (event) {
          return Sentry.Handlers.parseRequest(event, ctx.request);
        });
      }
      Sentry.captureException(error);
    });
  }
}

export const tracingMiddleWare = async (ctx: CTX, next: Function) => {
  if (ctx && ctx.url && ctx.request && env != 'local' && process.env.NODE_ENV !== 'test') {
    const reqMethod = (ctx.method || '').toUpperCase();
    const reqUrl = ctx.url && stripUrlQueryAndFragment(ctx.url);

    // connect to trace of upstream app
    let traceparentData;
    if (ctx.request.get('sentry-trace')) {
      traceparentData = extractTraceparentData(ctx.request.get('sentry-trace'));
    }

    const transaction = Sentry.startTransaction({
      name: `${reqMethod} ${reqUrl}`,
      op: 'http.server',
      ...traceparentData,
    });

    ctx.__sentry_transaction = transaction;

    await next();

    // if using koa router, a nicer way to capture transaction using the matched route
    if (ctx._matchedRoute) {
      const mountPath = ctx.mountPath || '';
      transaction.setName(`${reqMethod} ${mountPath}${ctx._matchedRoute}`);
    }
    transaction.setHttpStatus(ctx.status);
    transaction.finish();
  } else {
    await next();
  }
};
