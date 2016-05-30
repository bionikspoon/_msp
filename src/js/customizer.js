/* global wp, jQuery */
/**
 * File customizer.js.
 *
 * Theme Customizer enhancements for a better user experience.
 *
 * Contains handlers to make Theme Customizer preview reload changes asynchronously.
 */

function customizer( $ ) {
  // Site title and description.
  wp.customize( 'blogname', value => {
    value.bind( to => {
      $( '.site-title a' ).text( to );
    } );
  } );
  wp.customize( 'blogdescription', value => {
    value.bind( to => {
      $( '.site-description' ).text( to );
    } );
  } );

  // Header text color.
  wp.customize( 'header_textcolor', value => {
    value.bind( to => {
      const $siteDescription = $( '.site-title a, .site-description' );

      if ( to === 'blank' ) {
        $siteDescription.css( {
          clip: 'rect(1px, 1px, 1px, 1px)',
          position: 'absolute',
        } );
      }
      else {
        $siteDescription.css( {
          clip: 'auto',
          position: 'relative',
        } );
        $siteDescription.css( {
          color: to,
        } );
      }
    } );
  } );
}

customizer( jQuery );
