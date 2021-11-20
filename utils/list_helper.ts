import { groupBy, map, mapValues, maxBy, pipe, prop, reduce, toPairs } from 'remeda';

import { Blog } from '../types/blog';

const dummy = (_blogs: Blog[]) => 1;

const totalLikes = (blogs: Blog[]) => reduce(blogs, (sum, blog) => sum + blog.likes, 0);
const favoriteBlog = (blogs: Blog[]) => maxBy(blogs, prop('likes'));

const mostBlogs = (blogs: Blog[]) =>
  pipe(
    blogs,
    groupBy(prop('author')),
    mapValues(prop('length')),
    toPairs,
    map(([author, len]) => ({
      author,
      blogs: len,
    })),
    maxBy(prop('blogs')),
  );

const mostLikes = (blogs: Blog[]) =>
  pipe(
    blogs,
    groupBy(prop('author')),
    mapValues(totalLikes),
    toPairs,
    map(([author, likes]) => ({
      author,
      likes,
    })),
    maxBy(prop('likes')),
  );

export default {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
