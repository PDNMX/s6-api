import { Schema, model } from 'mongoose';
import database from '../config/database';
import config from '../config/env';

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

export const projection = {
  ocid: '$data.ocid',
  _id: 0,
  metadata: {
    date: '$data.date',
    institucion: config.API_S6_INSTITUCION
  },
  record: '$data'
  // record_package: {
  //   record: {
  //     releases: '$record_package'
  //   }
  // }
};

const RecordModel = model('Record', RecordSchema);

export default RecordModel;
