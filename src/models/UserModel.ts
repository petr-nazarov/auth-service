import * as mongoose from 'mongoose';
// ****** Set this ******* //
const ModelName = 'User';
const collectionName = 'users';
// ****** ******* //

const Schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    default: null,
  },
});

const Model = mongoose.model(ModelName, Schema, collectionName);

export default Model;
