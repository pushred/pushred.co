const dom = require('../browser/dom');

function VideoPlayer () {
  if (!(this instanceof VideoPlayer)) return new VideoPlayer();
  this.previewEls = dom.findAll('.project__preview');
}

VideoPlayer.prototype.playNearestVideo = function () {
  let offsets = [];
  let midY = (window.scrollY + window.innerHeight) / 2;

  this.previewEls.forEach((el, index) => {
    let distance = Math.abs(midY - el.parentNode.parentNode.offsetTop); // must back up to timeline el

    offsets.push({
      distance: distance,
      index: index
    });
  });

  let closestIndex = offsets.sort((a, b) => a.distance - b.distance)[0].index - 1;
  let videoEl = dom.find('video', this.previewEls[closestIndex]);

  dom.classList(this.previewEls[closestIndex]).add('project__preview--focused');
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
