export const abort = msg => {
  log(msg);
  process.exit(1);
};

export const log = msg => {
  console.log(msg); // eslint-disable-line no-console
};
