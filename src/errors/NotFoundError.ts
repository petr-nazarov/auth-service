import InternalError from './InternalError';
export default class NotFoundError extends InternalError {
  name = 'NotFoundError';
  code = 404;

  constructor(element: string, collection: string) {
    super(`Element ${element} is not found in the collection ${collection}`);
  }
}
