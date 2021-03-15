import { ifElse, isNil, pipe, curry, always, __ } from 'ramda';
import TypeError from '../errors/TypeError';

interface HealthCheckResponse {
  healthStatus: string;
  str: string;
}
const getStrValue = curry(
  ifElse(
    (str: string) => isNil(str),
    always('Empty string'),
    (str: string) => str
  )
);

const makeStatusObject = curry(
  (str: string): HealthCheckResponse => ({
    healthStatus: 'healthy',
    str,
  })
);

const notAnError = curry((str: string | null) => {
  if (str !== 'error') {
    return str;
  } else {
    throw new TypeError('`str` can not equal to `error`');
  }
});

export const getHealthStatus: (str: any) => HealthCheckResponse = pipe(notAnError, getStrValue, makeStatusObject);
