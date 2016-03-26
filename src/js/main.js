require('./navigation');
require('./skip-link-focus-fix');
const Masonry = require('masonry-layout');
const imagesLoaded = require('imagesloaded');

(() => {
  const masonryOptions = {
    itemSelector: 'article._msp-portfolio__card',
    percentPosition: true,
  };

  document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('._msp-portfolio');
    const masonry = new Masonry(container, masonryOptions);
    imagesLoaded(container, masonry.layout);
  });
})();
