const activateMasonry = require('./modules/masonry');
const activateMalarkey = require('./modules/malarkey');

// Bind to DOM
document.addEventListener('DOMContentLoaded', () => {
  activateMasonry();
  activateMalarkey();
});

if (module.hot) {
  module.hot.accept(['./modules/masonry', './modules/malarkey'], () => location.reload());
}

