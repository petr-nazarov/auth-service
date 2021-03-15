import * as Router from 'koa-router';
import { ParameterizedContext } from 'koa';
export interface CTX extends ParameterizedContext<any, Router.IRouterParamContext<any, {}>> {
  mountPath: string;
  __sentry_transaction: any;
}
