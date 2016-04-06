/* global siteData */
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
  const SITE_TITLE = siteData.title;
  const SITE_DESCRIPTION = siteData.description;

  // Events
  function loadingComplete() {
    activateMasonry();
    activateMalarkey();
  }

  // Run masonry
  function activateMasonry() {
    const container = document.querySelector('._msp-portfolio__container');

    // Guard, no container
    if (!container) {return;}

    // more setup
    const header = document.querySelector('._msp-header');
    const footer = document.querySelector('._msp-footer');

    //noinspection XHTMLIncompatabilitiesJS
    const body = document.body;

    // Guard, no body, prevent xml xmhtml bugs
    if (!body) {return;}

    // bind to DOM
    const masonry = new Masonry(container, options.masonry);
    imagesLoaded(container, masonry.layout);
    masonry.on('layoutComplete', handleResize);
    window.addEventListener('resize', handleResize);

    // init
    setContainerMinHeight(container, getContainerMinHeight());

    /**
     * Set container min height when height changes.
     * @param {number} clientHeight
     */
    function handleResize(clientHeight = body.clientHeight) {
      // Guard, height did not change
      if (clientHeight === handleResize.height) {return;}

      // update static height
      handleResize.height = clientHeight;

      // update container
      setContainerMinHeight(container, getContainerMinHeight());
    }

    // initialize static height
    handleResize.height = body.clientHeight;

    /**
     * Set container min height.
     *
     * @param {Element} containerElement
     * @param {number} minHeight number
     */
    function setContainerMinHeight(containerElement, minHeight) {
      containerElement.style.minHeight = `${minHeight}px`; // eslint-disable-line no-param-reassign
    }

    /**
     * Get container minHeight.
     *
     * @param {Element} headerElement
     * @param {Element} footerElement
     * @param {Element} bodyElement
     * @returns {number}
     */
    function getContainerMinHeight(headerElement = header, footerElement = footer, bodyElement = body) {
      const windowHeight = bodyElement.clientHeight;
      const headerHeight = headerElement.offsetHeight;
      const footerHeight = footerElement.offsetHeight;

      return windowHeight - headerHeight - footerHeight;
    }
  }

  // Run malarkey
  function activateMalarkey() {
    // setup
    const pageTitleContainer = document.querySelector('._msp-header-title');

    // Guard
    if (!pageTitleContainer) {return;}

    // more setup
    const pageTitle = pageTitleContainer.querySelector('#_msp-page-title');
    const malarkeyHandle = getMalarkeyHandle(pageTitle, options.malarkey);

    // run malarkey
    malarkeyHandle
      .reset()
      .typePhrase(SITE_TITLE)
      .typePhrase(SITE_DESCRIPTION, 2000)
      .typeLegendTaunt();

    /**
     * Create malarkey handle with a few custom tasks.
     */
    function getMalarkeyHandle(el, opts) {
      // create handle
      const handle = malarkey(el, opts);

      handle.addClass = function addClass(name) {
        this.call(wrapper);
        return this;

        function wrapper() {
          pageTitleContainer.classList.add(name);
          this();
        }
      };

      handle.removeClass = function removeClass(name) {
        this.call(wrapper);
        return this;

        function wrapper() {
          pageTitleContainer.classList.remove(name);
          this();
        }
      };

      /**
       * Remove highlight and delete text;
       */
      handle.reset = function reset() {
        this.removeClass(HIGHLIGHT_CLASS).delete();
        return this;
      };

      /**
       *  Type phrase -> add highlight -> pause -> reset
       *
       * @param {string} phrase
       * @param {number} [hold]
       */
      handle.typePhrase = function typePhrase(phrase, hold) {
        this
          .type(phrase)
          .pause(500).addClass(HIGHLIGHT_CLASS)
          .pause(hold).reset();
        return this;
      };

      /**
       * Types "The man. The Myth. The legend" Sequence
       */
      handle.typeLegendTaunt = function typeLegendTaunt() {
        this
          .type('The Man')
          .pause(1000).delete(3, 0)
          .pause(750).type('Myth', 100)
          .pause(1000).delete(4, 0)
          .pause(750).type('Legend', 500)
          .pause(500).addClass(HIGHLIGHT_CLASS).addClass(HIGHLIGHT_CLASS_LEGEND)
          .pause(2000).delete()
          .pause(300).reset().removeClass(HIGHLIGHT_CLASS_LEGEND)
          .pause(500);
        return this;
      };

      return handle;
    }
  }
})();
