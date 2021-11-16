require('dotenv').config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();

type Blog = {
  title: string;
  author: string;
  url: string;
  likes: number;
};

const blogSchema = new mongoose.Schema<Blog>({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = mongoose.model('Blog', blogSchema);

const mongoUrl = process.env.MONGODB_URI;
mongoose.connect(mongoUrl ?? '');

app.use(cors());
app.use(express.json());

app.get('/api/blogs', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body);

  blog.save().then((result) => {
    response.status(201).json(result);
  });
});

const PORT = process.env.PORT ?? 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
