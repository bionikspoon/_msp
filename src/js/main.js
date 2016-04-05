require('./navigation');
require('./skip-link-focus-fix');
const Masonry = require('masonry-layout');
const imagesLoaded = require('imagesloaded');

(() => {
  const masonryOptions = {
    itemSelector: 'article._msp-portfolio--item',
    percentPosition: true,
  };

  document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('._msp-portfolio__container');
    const masonry = new Masonry(container, masonryOptions);
    imagesLoaded(container, masonry.layout);
    if (container) {
      const content = container.parentNode;
      content.className = content.className.replace('_msp-layout__content--flex', '');
    }
  });
})();
