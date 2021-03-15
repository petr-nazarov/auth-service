import DataBaseRepository from './DataBaseRepository';
import UserModal from '../../models/UserModel';

export default class UserRepository extends DataBaseRepository {
  constructor() {
    const referenceModel = UserModal;
    const allowedFieldsToFilter: string[] = [];
    super(referenceModel, allowedFieldsToFilter);
  }
}
