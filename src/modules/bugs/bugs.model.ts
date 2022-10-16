import { model, Schema, Document } from 'mongoose';
export interface Bugs {
  _id: string;
  error_message: string;
  error_stack: string;
  error_type: string;
  path: string;
  method: string;
  added_by: any;
  is_deleted: boolean;
  device: any;
  id: any;
  count: number;
}
const bugSchema: Schema = new Schema(
  {
    error_message: { type: String, required: true },
    error_stack: { type: String },
    error_type: { type: String },
    path: { type: String },
    method: { type: String },
    added_by: { type: Schema.Types.ObjectId, ref: 'users' },
    is_deleted: { type: Boolean, default: false },
    device: { type: Schema.Types.Mixed },
    ip: { type: Schema.Types.Mixed },
    count: { type: Number, default: 1 },
  },
  { timestamps: true, autoIndex: true, optimisticConcurrency: true },
);

const BugsModel = model<Bugs & Document>('bugs', bugSchema);

export default BugsModel;
