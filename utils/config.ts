require('dotenv').config();

const { PORT, SECRET, NODE_ENV } = process.env;
const MONGODB_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

if (!SECRET) {
  throw Error('SECRET is missing');
}
if (!PORT) {
  throw Error('PORT is missing');
}

if (!MONGODB_URI) {
  throw Error('MONGODB_URI is missing');
}

if (!NODE_ENV) {
  throw Error('NODE_ENV is missing');
}

export default {
  MONGODB_URI,
  PORT,
  SECRET,
  NODE_ENV,
};
