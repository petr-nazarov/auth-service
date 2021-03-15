export default class InternalError extends Error {
  code = 500;
  name = 'Internal Error';
  details: any = null;
}
