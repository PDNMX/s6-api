import { model } from 'mongoose';
import database from '../config/database';

const mongoose = database.getDatabase();

const RecordSchema = new mongoose.Schema({
  ocid: { type: String, required: true }
});

export const group = {
  $group: {
    _id: '$ocid',
    data: { $first: '$$ROOT' },
    record_package: { $push: '$$ROOT' }
  }
};

const RecordModel = model('Record', RecordSchema);

export default RecordModel;
