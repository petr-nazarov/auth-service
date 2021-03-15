import InternalError from './InternalError';
export default class AuthenticationError extends InternalError {
  name = 'AuthenticationError';
  code = 401;
}
