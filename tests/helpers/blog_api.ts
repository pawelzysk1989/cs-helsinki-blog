import BlogModel from '../../models/blog';

const getAll = async () => {
  const blogs = await BlogModel.find({});
  return blogs.map((blog) => ({
    ...blog.toJSON(),
    user: String(blog.user),
  }));
};

export default {
  getAll,
};
