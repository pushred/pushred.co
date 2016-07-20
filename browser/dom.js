/* global Node */
/* global NodeList */

const arrayify = require('arrayify');
const classList = require('dom-classlist');
const query = require('component-query');

// git.io/blingjs

Node.prototype.on = window.on = function (name, callback) {
  this.addEventListener(name, callback);
};

NodeList.prototype.on = NodeList.prototype.addEventListener = function (name, callback) {
  this.forEach((element) => {
    element.on(name, callback);
  });
};

module.exports = {
  arrayify: arrayify,
  classList: classList,
  find: query
};

module.exports.findAll = (selector, element) => {
  element = element || document;
  return arrayify(query.all(selector, element));
};
