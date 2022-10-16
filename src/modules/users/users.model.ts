import { model, Schema, Document } from 'mongoose';
interface UserType {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  imgurl?: string;
}
const userSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    imgUrl: { type: String },
    projects: [
      {
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
        },
        tasks: [
          {
            name: {
              type: String,
              required: true,
            },
            description: {
              type: String,
            },
            isChecked: {
              type: Boolean,
              default: false,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true, autoIndex: true, optimisticConcurrency: true },
);

const UserModel = model<UserType & Document>('users', userSchema);
export default UserModel;
