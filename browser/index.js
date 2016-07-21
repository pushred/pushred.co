var dom = require('./dom');
var VideoPlayer = require('../blocks/video_player');

///////////
// load //
/////////

var logoEl;

document.addEventListener('DOMContentLoaded', () => {
  logoEl = dom.find('.header__logo');
  dom.classList(logoEl).add('header__logo--loading');

  dom.findAll('.project__expand').forEach((el) => {
    el.on('click', (event) => {
      event.preventDefault();

      var detailsEl = dom.find(event.target.getAttribute('href'));
      if (!detailsEl) return;

      dom.classList(detailsEl).add('project__details--open');
      dom.classList(el).add('project__expand--expanded');
    });
  });
});

window.addEventListener('load', () => {
  dom.classList(logoEl).remove('header__logo--loading');

  const player = VideoPlayer();
  player.playNearestVideo();

  window.addEventListener('scroll', () => {
    player.playNearestVideo();
  });
});
