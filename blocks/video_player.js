const dom = require('../browser/dom');

function VideoPlayer () {
  if (!(this instanceof VideoPlayer)) return new VideoPlayer();

  this.mainEl = dom.find('main');
  this.previewEls = dom.findAll('.project__preview');
}

VideoPlayer.prototype.playNearestVideo = function () {
  let offsets = [];
  let midY = window.scrollY + (window.innerHeight / 2);
  let midContent = parseFloat(window.getComputedStyle(this.previewEls[0]).height) / 2;

  this.previewEls.forEach((el, index) => {
    let elTop = Math.abs(el.parentNode.parentNode.getBoundingClientRect().top); // must back up to timeline el
    let distance = Math.abs(midY - (window.scrollY + elTop + midContent));

    offsets.push({
      distance: distance,
      index: index
    });
  });

  let closestIndex = offsets.sort((a, b) => a.distance - b.distance)[0].index;

  // focus current project and play

  dom.classList(this.previewEls[closestIndex]).add('project__preview--focused');

  let videoEl = dom.find('video', this.previewEls[closestIndex]);
  if (videoEl && videoEl.paused) videoEl.play();

  // pause other videos

  let previewEls = this.previewEls.slice(); // copy array
  previewEls.splice(closestIndex, 1);

  previewEls.forEach((previewEl) => {
    dom.classList(previewEl).remove('project__preview--focused');

    let videoEl = dom.find('video', previewEl);
    if (videoEl) videoEl.pause();
  });
}

module.exports = VideoPlayer;
