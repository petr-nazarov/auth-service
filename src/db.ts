require('dotenv').config();
import * as mongoose from 'mongoose';

const srv = Boolean(process.env.DB_SRV);

let connectionUrl = '';
if (srv === true) {
  connectionUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
} else {
  connectionUrl = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin&retryWrites=true&w=majority`;
}

console.log('connectionUrl', connectionUrl);

mongoose.connect(connectionUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set('useCreateIndex', true);

const db = mongoose.connection;

export default db;
