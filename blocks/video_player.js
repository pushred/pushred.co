const dom = require('../browser/dom');

function VideoPlayer () {
  if (!(this instanceof VideoPlayer)) return new VideoPlayer();

  this.previewEls = dom.findAll('.project__preview');
}

VideoPlayer.prototype.playNearestVideo = function () {
  if (window.matchMedia('(max-width: 736px)').matches) {
    pauseVideos(this.previewEls);
    return; // disable for inline videos (iPhone)
  }

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

  var isTop = window.scrollY === 0;
  var isBottom = (window.scrollY + window.innerHeight) === document.scrollingElement.scrollHeight;

  if (isTop) {
    var closestIndex = 0;
  } else if (isBottom) {
    var closestIndex = this.previewEls.length - 1;
  } else {
    var closestIndex = offsets.sort((a, b) => a.distance - b.distance)[0].index;
  }

  // focus current project and play

  dom.classList(this.previewEls[closestIndex]).add('project__preview--focused');

  let videoEl = dom.find('video', this.previewEls[closestIndex]);
  if (videoEl && videoEl.paused) videoEl.play();

  // pause other videos

  let previewEls = this.previewEls.slice(); // copy array
  previewEls.splice(closestIndex, 1);

  pauseVideos(previewEls);
}

module.exports = VideoPlayer;

function pauseVideos (previewEls) {
  previewEls.forEach((previewEl) => {
    dom.classList(previewEl).remove('project__preview--focused');

    let videoEl = dom.find('video', previewEl);
    if (videoEl) videoEl.pause();
  });
}
