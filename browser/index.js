var dom = require('./dom');
var VideoPlayer = require('../blocks/video_player');

///////////
// load //
/////////

var logoEl;
var mainEl;
var detailsEls;

document.addEventListener('DOMContentLoaded', () => {
  logoEl = dom.find('.header__logo');
  mainEl = dom.find('main');
  detailsEls = dom.findAll('.project__details');

  dom.classList(logoEl).add('header__logo--loading');
  dom.classList(mainEl).add('main--loading');

  dom.findAll('.project__expand').forEach((el) => {
    el.on('click', (event) => {
      event.preventDefault();

      var detailsEl = dom.find(event.target.getAttribute('href'));

      if (detailsEl) {
        dom.classList(el).add('project__expand--expanded');
        dom.classList(detailsEl).remove('project__details--collapsed');
      }
    });
  });
});

window.addEventListener('load', () => {
  dom.classList(logoEl).remove('header__logo--loading');

  measureDetails();

  detailsEls.forEach((el) => {
    dom.classList(el).add('project__details--collapsed');
  });

  dom.classList(mainEl).remove('main--loading');

  const player = VideoPlayer();
  player.playNearestVideo();

  window.addEventListener('scroll', () => {
    player.playNearestVideo();
  });

  window.addEventListener('resize', () => {
    measureDetails();
    player.playNearestVideo();
  });

  dom.classList(mainEl).add('main--loaded');
});

function measureDetails () {
  detailsEls.forEach((el) => {
    el.style.height = el.clientHeight.toString() + 'px';
  });
}
