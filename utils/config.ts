require('dotenv').config();

const { PORT, MONGODB_URI } = process.env;

export default {
  MONGODB_URI,
  PORT,
};
