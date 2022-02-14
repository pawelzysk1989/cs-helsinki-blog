import { Document, ObjectId } from 'mongoose';

export interface Blog {
  title: string;
  author: string;
  url: string;
  likes: number;
}

export interface BlogDB extends Blog, Document {
  user: ObjectId;
  comments: ObjectId[];
}

export interface BlogResponse {
  id: string;
  title: string;
  author: string;
  url: string;
  likes: number;
}
