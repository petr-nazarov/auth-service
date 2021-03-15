import InternalError from '../errors/InternalError';
import { SentryCapture } from './sentryMiddleware';
import { CTX } from '../interfaces/KoaInterfaces';
import { logError } from '../services/logService';

export function handleError(error: InternalError) {
  const errorBody = {
    name: error.name,
    message: error.message,
    details: error.details || null,
  };
  const code = error.code;
  return {
    code,
    errorBody,
  };
}

export default async function errorMiddleware(ctx: CTX, next: Function) {
  try {
    await next();
  } catch (error) {
    logError(error);
    SentryCapture(error, ctx);
    const { code, errorBody } = handleError(error);
    ctx.response.status = code;
    ctx.response.body = errorBody;
  }
}
