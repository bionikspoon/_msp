require('./navigation');
require('./skip-link-focus-fix');
const Masonry = require('masonry-layout');
const imagesLoaded = require('imagesloaded');

(() => {
  const masonryOptions = {
    itemSelector: 'article.portfolio-card',
    percentPosition: true,
  };

  document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.portfolio-entries');
    const masonry = new Masonry(container, masonryOptions);
    imagesLoaded(container, masonry.layout);
  });
})();
