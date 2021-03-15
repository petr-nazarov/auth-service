import * as mongoose from 'mongoose';

// ****** Set this ******* //
const ModelName = 'AuthenticationToken';
const collectionName = 'authentication_tokens';
// ****** ******* //

const Schema = new mongoose.Schema({
  token: {
    type: String,
    unique: true,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['access_token', 'refresh_token'],
  },
  startDate: {
    type: Date,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
});

const Model = mongoose.model(ModelName, Schema, collectionName);

export default Model;
