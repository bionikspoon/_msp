const Masonry = require( 'masonry-layout' );
const imagesLoaded = require( 'imagesloaded' );

const OPTIONS = {
  itemSelector: 'article._msp-portfolio--item',
  percentPosition: true,
};

// Run masonry
module.exports = function activateMasonry() {
  const container = document.querySelector( '._msp-portfolio__container' );

  // Guard, no container
  if ( !container ) {return;}

  // more setup
  const header = document.querySelector( '._msp-header' );
  const footer = document.querySelector( '._msp-footer' );

  //noinspection XHTMLIncompatabilitiesJS
  const body = document.body;

  // Guard, no body, prevent xml xhtml bugs
  if ( !body ) {return;}

  // bind to DOM
  const masonry = new Masonry( container, OPTIONS );
  imagesLoaded( container, masonry.layout );
  masonry.on( 'layoutComplete', handleResize );
  window.addEventListener( 'resize', handleResize );

  // init
  setContainerMinHeight( container, getContainerMinHeight() );

  /**
   * Set container min height when height changes.
   * @param {number} clientHeight
   */
  function handleResize( clientHeight = body.clientHeight ) {
    // Guard, height did not change
    if ( clientHeight === handleResize.height ) {return;}

    // update static height
    handleResize.height = clientHeight;

    // update container
    setContainerMinHeight( container, getContainerMinHeight() );
  }

  // initialize static height
  handleResize.height = body.clientHeight;

  /**
   * Set container min height.
   *
   * @param {Element} containerElement
   * @param {number} minHeight number
   */
  function setContainerMinHeight( containerElement, minHeight ) {
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
  function getContainerMinHeight( headerElement = header, footerElement = footer, bodyElement = body ) {
    const windowHeight = bodyElement.clientHeight;
    const headerHeight = headerElement.offsetHeight;
    const footerHeight = footerElement.offsetHeight;

    return windowHeight - headerHeight - footerHeight;
  }
};
