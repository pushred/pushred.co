/* global Node */
/* global NodeList */

var arrayify = require('arrayify');
var query = require('component-query');

// git.io/blingjs

Node.prototype.on = window.on = function (name, callback) {
  this.addEventListener(name, callback);
};

NodeList.prototype.on = NodeList.prototype.addEventListener = function (name, callback) {
  this.forEach(function (element) {
    element.on(name, callback);
  });
};

module.exports = {
  arrayify: arrayify,
  find: query
};

module.exports.findAll = function (selector, element) {
  element = element || document;
  return arrayify(query.all(selector, element));
};
