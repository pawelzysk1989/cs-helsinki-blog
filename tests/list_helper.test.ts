import { Blog } from '../types/blog';
import listHelper from '../utils/list_helper';
import blogFixture from './fixtures/blog';

test('dummy returns one', () => {
  const blogs: Blog[] = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([]);
    expect(result).toBe(0);
  });

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(blogFixture.listWithOneBlog);
    expect(result).toBe(5);
  });

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(blogFixture.blogs);
    expect(result).toBe(36);
  });
});

describe('favourite blog', () => {
  test('of empty list is undefined', () => {
    const result = listHelper.favoriteBlog([]);
    expect(result).toBe(undefined);
  });

  test('when list has only one blog, equals of that', () => {
    const result = listHelper.favoriteBlog(blogFixture.listWithOneBlog);
    expect(result).toEqual(result);
  });

  test('of a bigger list is calculated right', () => {
    const result = listHelper.favoriteBlog(blogFixture.blogs);
    expect(result).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
    });
  });
});

describe('author of most blogs', () => {
  test('of empty list is undefined', () => {
    const result = listHelper.mostBlogs([]);
    expect(result).toBe(undefined);
  });

  test('of a bigger list is calculated right', () => {
    const result = listHelper.mostBlogs(blogFixture.blogs);
    expect(result).toEqual({
      author: 'Robert C. Martin',
      blogs: 3,
    });
  });
});

describe('author with most likes', () => {
  test('of empty list is undefined', () => {
    const result = listHelper.mostLikes([]);
    expect(result).toBe(undefined);
  });

  test('of a bigger list is calculated right', () => {
    const result = listHelper.mostLikes(blogFixture.blogs);
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17,
    });
  });
});
