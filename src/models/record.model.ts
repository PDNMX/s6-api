import { Schema, model } from 'mongoose';

const RecordSchema = new Schema({
  ocid: { type: String, required: true }
});

export const projection = {
  ocid: 1
};

const RecordModel = model('Record', RecordSchema);

export default RecordModel;
