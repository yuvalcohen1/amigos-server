import { Document, model, ObjectId, Schema } from "mongoose";

interface IPost extends Document {
  _id: string;
  userId: string;
  content: string;
  attachedPhoto?: string;
}

const PostSchema = new Schema<IPost>({
  userId: { type: String, required: true, ref: "User" },
  content: { type: String, required: true },
  attachedPhoto: { type: String },
});

export const Post = model<IPost>("Post", PostSchema);
