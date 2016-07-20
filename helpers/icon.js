var parameterize = require('parameterize');

module.exports = function (name, className) {
  var symbolName = parameterize(name);

  className = (typeof className === 'string')
    ? `${className} ${className}--${symbolName}`
    : '';

  return `
    <span>${name}</span>
    <svg class="${className}">
      <use xlink:href="/files/bundle.svg#${symbolName}">
    </svg>`;
}
