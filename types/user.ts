import { Document, ObjectId } from 'mongoose';

export interface User {
  username: string;
  email: string;
  password: string;
}

export interface UserDB extends User, Document {
  blogs: ObjectId[];
}
