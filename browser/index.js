var dom = require('./dom');

///////////
// load //
/////////

var logoEl;

document.addEventListener('DOMContentLoaded', () => {
  logoEl = dom.find('.header__logo');
  dom.classList(logoEl).add('header__logo--loading');
});

window.addEventListener('load', () => {
  dom.classList(logoEl).remove('header__logo--loading');
});
