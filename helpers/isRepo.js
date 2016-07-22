module.exports = function (string, options) {
  if (!string || typeof string !== 'string') return;

  return (/github/i.test(string))
    ? options.fn(this)
    : options.inverse(this);
};
