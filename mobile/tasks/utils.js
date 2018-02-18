module.exports = {
  abort(msg) {
    module.exports.log(msg);
    process.exit(1);
  },
  log(msg) {
    console.log(msg); // eslint-disable-line no-console
  },
};
