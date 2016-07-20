var imgix = require('imgix.js');
var WebFont = require('webfontloader');

var dom = require('./dom');

///////////
// load //
/////////

document.addEventListener('DOMContentLoaded', function () {

  WebFont.load({
    google: {
      families: ['Source+Sans+Pro:400,600']
    }
  });

  dom.findAll('a[href*=mov]').forEach(function (video) {
    video.insertAdjacentHTML('afterend', '<video autoplay src="' + video.href + '"></video>');
  });

  dom.findAll('.background').forEach(function (paragraphEl) {
    var imageEl = paragraphEl.children[0];
    paragraphEl.parentNode.replaceChild(imageEl, paragraphEl);
    console.log(imageEl.parentNode.style.backgroundColor);
  });

  imgix.fluid({
    onChangeParamOverride: function (h, w, params, el) {
      return {
        q: 90,
        w: el.width,
        h: el.height,
        fit: 'crop',
        blend: '949494',
        bm: 'multiply'
      }
    }
  });

});
