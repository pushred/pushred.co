var parameterize = require('parameterize');

module.exports = function (name, className) {
  var symbolName = parameterize(name);

  className = (typeof className === 'string')
    ? `${className} ${className}--${symbolName}`
    : '';

  return `
    <svg class="${className}">
      <use xlink:href="/files/bundle.svg#${symbolName}">
    </svg>
    <span>${name}</span>`;
}
