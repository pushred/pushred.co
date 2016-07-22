module.exports = function (string, options) {
  if (!string || typeof string !== 'string') return;

  return (/mp4/i.test(string))
    ? options.fn(this)
    : options.inverse(this);
};
