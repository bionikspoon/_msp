require('./navigation');
require('./skip-link-focus-fix');
const Masonry = require('masonry-layout');
const imagesLoaded = require('imagesloaded');
const malarkey = require('malarkey');

(() => {
  // Bind to DOM
  document.addEventListener('DOMContentLoaded', loadingComplete);

  // Setup
  const options = {
    masonry: {
      itemSelector: 'article._msp-portfolio--item',
      percentPosition: true,
    },
    malarkey: {
      typeSpeed: 50,
      deleteSpeed: 50,
      pauseDelay: 3000,
      loop: true,
      postfix: '',
    },
  };
  const HIGHLIGHT_CLASS = 'title-highlight';
  const HIGHLIGHT_CLASS_LEGEND = 'title-highlight-legend';

  // Events
  function loadingComplete() {
    activateMasonry();
    activateMalarkey();
  }

  // Run masonry
  function activateMasonry() {
    const container = document.querySelector('._msp-portfolio__container');
    const masonry = new Masonry(container, options.masonry);
    imagesLoaded(container, masonry.layout);
  }

  // Run malarkey
  function activateMalarkey() {
    const pageTitleContainer = document.querySelector('._msp-header-title');
    const pageTitle = pageTitleContainer.querySelector('#_msp-page-title');

    const malarkeyHandle = getMalarkeyHandle(pageTitle, options.malarkey);

    malarkeyHandle
      .reset()
      .typePhrase('Manu Phatak')
      .typePhrase('Full Stack Developer', 2000)
      .typeLegendTaunt();


    function addHighlight() {
      pageTitleContainer.classList.add(HIGHLIGHT_CLASS);
      this();
    }

    function addHighlightLegend() {
      pageTitleContainer.classList.add(HIGHLIGHT_CLASS);
      pageTitleContainer.classList.add(HIGHLIGHT_CLASS_LEGEND);
      this();
    }

    function removeHighlight() {
      pageTitleContainer.classList.remove(HIGHLIGHT_CLASS);
      this();
    }

    function removeHighlightLegend() {
      pageTitleContainer.classList.remove(HIGHLIGHT_CLASS_LEGEND);
      this();
    }

    function getMalarkeyHandle(el, opts) {
      const handle = malarkey(el, opts);
      handle.reset = function reset() {
        this.call(removeHighlight).delete();
        return this;
      };

      handle.typePhrase = function typePhrase(phrase, hold) {
        this
          .type(phrase)
          .pause(500).call(addHighlight)
          .pause(hold).reset();
        return this;
      };

      handle.typeLegendTaunt = function typeLegendTaunt() {
        this
          .type('The Man')
          .pause(1000).delete(3, 0)
          .pause(750).type('Myth', 100)
          .pause(1000).delete(4, 0)
          .pause(750).type('Legend', 500)
          .pause(500).call(addHighlightLegend)
          .pause(2000).delete()
          .pause(300).reset().call(removeHighlightLegend)
          .pause(500);
        return this;
      };

      return handle;
    }
  }
})();
