var dom = require('./dom');
var VideoPlayer = require('../blocks/video_player');
var unorphan = require('unorphan');

var player;

///////////
// load //
/////////

var logoEl;
var mainEl;
var detailsEls;

document.addEventListener('DOMContentLoaded', () => {

  // polyfill document.scrollingElement
  require('scrollingelement');

  // polyfill svg external use
  require('svg4everybody')();

  player = VideoPlayer();

  logoEl = dom.find('.header__logo');
  mainEl = dom.find('main');
  detailsEls = dom.findAll('.project__details');

  dom.classList(logoEl).add('header__logo--loading');
  dom.classList(mainEl).add('main--loading');

  unorphan('p, li');

  dom.findAll('.project__expand').forEach((el) => {
    el.on('click', (event) => {
      event.preventDefault();

      var detailsEl = dom.find(event.target.getAttribute('href'));

      if (detailsEl) {
        dom.classList(el).add('project__expand--expanded');
        dom.classList(detailsEl).remove('project__details--collapsed');
      }

      setTimeout(() => player.playNearestVideo(), 250); // wait for CSS animation
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
    let isCollapsed = dom.classList(el).contains('project__details--collapsed');

    // peek and measure
    el.style.opacity = '0';
    if (isCollapsed) dom.classList(el).remove('project__details--collapsed');
    el.style.height = 'auto';
    el.style.height = el.clientHeight.toString() + 'px';

    // restore

    if (isCollapsed) dom.classList(el).add('project__details--collapsed');
    el.style.opacity = '1';
  });
}
