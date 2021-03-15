import { validate as classValidate } from 'class-validator';
import ValidationError from '../errors/ValidationError';

const validate = async (requestData: Object) => {
  const errors = await classValidate(requestData);
  if (errors.length > 0) {
    throw new ValidationError(errors);
  }
  return;
};

export default validate;
