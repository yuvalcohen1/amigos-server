import { Document, model, ObjectId, Schema } from "mongoose";

interface IUser extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  encryptedPassword: string;
  birthday: Date;
  profileImg: string;
  isAdmin: 0 | 1;
}

const UserSchema = new Schema<IUser>({
  firstName: { type: String, required: true, minlength: 2, trim: true },
  lastName: { type: String, required: true, minlength: 2, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  encryptedPassword: { type: String, required: true },
  birthday: { type: Date, required: true },
  profileImg: { type: String, required: true },
  isAdmin: { type: Number, required: true, trim: true },
});

export const User = model<IUser>("User", UserSchema);
