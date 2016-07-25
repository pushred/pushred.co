module.exports = function (string, pattern, value) {
  if (typeof string === 'undefined' || typeof pattern !== 'string' || typeof value !== 'string') return;

  return (string).toString().replace(pattern, value);
};
