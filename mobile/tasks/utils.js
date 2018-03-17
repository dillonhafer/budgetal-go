module.exports = {
  abort(msg) {
    module.exports.log(msg);
    process.exit(1);
  },
  log(msg) {
    console.log(msg); // eslint-disable-line no-console
  },
  task(msg) {
    console.log('\x1b[32m--->\x1b[0m %s', msg); // eslint-disable-line no-console
  },
  info(msg) {
    console.log('     %s', msg); // eslint-disable-line no-console
  },
};
