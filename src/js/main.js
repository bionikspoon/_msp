require('./navigation');
require('./skip-link-focus-fix');
const Masonry = require('masonry-layout');
const imagesLoaded = require('imagesloaded');

(() => {
  const masonryOptions = {
    itemSelector: 'article.portfolio-card',
    percentPosition: true,
  };
  const container = document.querySelector('.portfolio-entries');
  const masonry = new Masonry(container, masonryOptions);
  masonry.layout();
  imagesLoaded(container, masonry.layout);
})();
