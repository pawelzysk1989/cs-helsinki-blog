require('dotenv').config();

const { PORT, SECRET } = process.env;
const MONGODB_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

if (!SECRET) {
  throw Error('SECRET in env is missing');
}
if (!PORT) {
  throw Error('PORT in env is missing');
}

if (!MONGODB_URI) {
  throw Error('MONGODB_URI in env is missing');
}

export default {
  MONGODB_URI,
  PORT,
  SECRET,
};
