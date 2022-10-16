import { Schema, Document, model } from 'mongoose';
const LoginLogSchema: Schema = new Schema(
  {
    login_date: { type: Date, required: true, default: Date.now },
    expires_in: { type: Date },
    logout_date: { type: Date },
    ip_address: { type: String },
    device_info: { type: String },
    browser_info: { type: String },
    platform_info: { type: String },
    is_active: { type: Boolean, required: true, default: true },
    token: { type: String, required: true },
    user_id: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
  },
  { timestamps: true, autoIndex: true, optimisticConcurrency: true },
);
const LoginLogModel = model<Document>('userloginlogs', LoginLogSchema);
export default LoginLogModel;
