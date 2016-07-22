const dom = require('../browser/dom');

function VideoPlayer () {
  if (!(this instanceof VideoPlayer)) return new VideoPlayer();

  this.logoEl = logoEl = dom.find('.header__logo');
  this.mainEl = dom.find('main');
  this.previewEls = dom.findAll('.project__preview');

  this.previewEls.forEach((previewEl) => {
    let videoEl = dom.find('video', previewEl);
    var progressEl;
    var hasPlayed;

    if (!videoEl) return;

    videoEl.on('loadedmetadata', () => {
      previewEl.insertAdjacentHTML('afterbegin', '<div class="project__preview_progress">Loading</div>');
      progressEl = dom.find('.project__preview_progress', previewEl);
    });

    videoEl.on('canplaythrough', () => {
      if (progressEl.parentNode === previewEl) previewEl.removeChild(progressEl);
    });

    videoEl.on('progress', (event) => {
      if (videoEl.readyState === 0 || hasPlayed) return; // must have metadata and never played before

      let progress = videoEl.buffered.end(0);
      let total = videoEl.duration;

      if (progress === total) return;

      if (progressEl) progressEl.style.width = ((videoEl.buffered.end(0) / videoEl.duration) * 100).toString() + '%';
    });

    videoEl.on('playing', () => {
      hasPlayed = true;
      if (progressEl) dom.classList(progressEl).add('project__preview_progress--playing');
    });
  });
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

  previewEls.forEach((previewEl) => {
    dom.classList(previewEl).remove('project__preview--focused');

    let videoEl = dom.find('video', previewEl);
    if (videoEl) videoEl.pause();
  });
}

module.exports = VideoPlayer;
