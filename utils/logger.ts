const info = (...params: any[]) => {
  // eslint-disable-next-line no-console
  console.log(...params);
};

const error = (...params: any[]) => {
  // eslint-disable-next-line no-console
  console.error(...params);
};

export default {
  info,
  error,
};
