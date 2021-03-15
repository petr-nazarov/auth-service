import DataBaseRepository from './DataBaseRepository';
import AuthenticationTokenModel from '../../models/AuthenticationTokenModel';

export default class AuthenticationTokenRepository extends DataBaseRepository {
  constructor() {
    const referenceModel = AuthenticationTokenModel;
    const allowedFieldsToFilter = ['user'];
    super(referenceModel, allowedFieldsToFilter);
  }
}
