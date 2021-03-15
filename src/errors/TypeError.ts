import InternalError from './InternalError';
export default class TypeError extends InternalError {
  name = 'TypeError';
  code = 400;
}
