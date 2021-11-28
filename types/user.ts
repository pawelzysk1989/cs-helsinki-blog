import { Document, ObjectId } from 'mongoose';

export interface UserNotRegistered {
  username: string;
  name?: string;
  password: string;
}

export interface UserRegistered {
  username: string;
  name: string;
  passwordHash: string;
}

export interface UserDB extends UserRegistered, Document {
  blogs: ObjectId[];
}
