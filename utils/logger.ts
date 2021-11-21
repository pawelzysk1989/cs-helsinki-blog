const info = (...params: any[]) => {
  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.log(...params);
  }
};

const error = (...params: any[]) => {
  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.error(...params);
  }
};

export default {
  info,
  error,
};
