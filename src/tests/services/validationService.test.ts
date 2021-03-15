import { IsString, Length } from 'class-validator';
import validate from '../../services/validationService';
import ValidationError from '../../errors/ValidationError';
class Schema {
  @IsString()
  @Length(15, 50)
  str: string;

  constructor({ str }: { str: string }) {
    this.str = str;
  }
}

test('validationService validate()', async () => {
  const validationObject = new Schema({ str: 'too small' });
  try {
    await validate(validationObject);
  } catch (err) {
    expect(err).toBeInstanceOf(ValidationError);
  }
});
