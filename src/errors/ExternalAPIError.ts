import InternalError from './InternalError';
export default class ExternalAPIError extends InternalError {
  name = 'ExternalAPIError';
  code = 503;

  constructor(error: any) {
    super(error.message);
    const data = error.response && error.response.data ? error.response.data : null;
    this.details = {
      data,
      config: error.config || null,
      stack: error.stack || null,
    };
  }
}
