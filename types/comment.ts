import { Document, ObjectId } from 'mongoose';

export interface Comment {
  text: string;
}

export interface CommentDB extends Comment, Document {
  user: ObjectId;
  blog: ObjectId;
}
