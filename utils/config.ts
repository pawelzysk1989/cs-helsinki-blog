require('dotenv').config();

const {
  PORT,
  NODE_ENV,
  AUTH_AUDIENCE,
  AUTH_ISSUER_URL,
  DEV_MONGODB_URI,
  TEST_MONGODB_URI,
} = process.env;

if (!PORT) {
  throw Error('PORT is missing');
}

if (!DEV_MONGODB_URI) {
  throw Error('DEV_MONGODB_URI is missing');
}

if (!TEST_MONGODB_URI) {
  throw Error('TEST_MONGODB_URI is missing');
}

if (!NODE_ENV) {
  throw Error('NODE_ENV is missing');
}

if (!AUTH_AUDIENCE) {
  throw Error('AUTH_AUDIENCE is missing');
}

if (!AUTH_ISSUER_URL) {
  throw Error('AUTH_ISSUER_URL is missing');
}

export default {
  MONGODB_URI: NODE_ENV === 'test' ? TEST_MONGODB_URI : DEV_MONGODB_URI,
  PORT,
  NODE_ENV,
  AUTH_AUDIENCE,
  AUTH_ISSUER_URL,
};
