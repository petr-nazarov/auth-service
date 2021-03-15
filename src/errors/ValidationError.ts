import InternalError from './InternalError';
export default class ValidationError extends InternalError {
  name = 'ValidationError';
  code = 400;
  details = null;

  constructor(errors: any) {
    super('ValidationError');
    this.details = errors;
  }
}
