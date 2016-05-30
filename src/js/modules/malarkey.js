/* global siteData */
const malarkey = require('malarkey');

const HIGHLIGHT_CLASS = 'title-highlight';
const HIGHLIGHT_CLASS_LEGEND = 'title-highlight-legend';
const SITE_TITLE = siteData.title;
const SITE_DESCRIPTION = siteData.description;
const OPTIONS = {
  typeSpeed: 50,
  deleteSpeed: 50,
  pauseDelay: 3000,
  loop: true,
  postfix: '',
};

// delay running malarkey
module.exports = function activateMalarkey() {
  setTimeout(_activateMalarkey, 5 * 1000);
};

//run malarkey
function _activateMalarkey() {
  // setup
  const pageTitleContainer = document.querySelector('._msp-header-title');

  // Guard
  if (!pageTitleContainer) {return;}

  // more setup
  const pageTitle = pageTitleContainer.querySelector('#_msp-page-title');
  const malarkeyHandle = getMalarkeyHandle(pageTitle, OPTIONS);

  // run malarkey
  malarkeyHandle
    .reset()
    .typePhrase(SITE_TITLE, 10 * 1000)
    .typePhrase(SITE_DESCRIPTION, 2 * 1000)
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
