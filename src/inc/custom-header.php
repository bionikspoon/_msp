<?php
/**
 * Sample implementation of the Custom Header feature.
 *
 * You can add an optional custom header image to header.php like so ...
 *
 * <?php if ( get_header_image() ) : ?>
 * <a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home">
 * <img src="<?php header_image(); ?>" width="<?php echo esc_attr( get_custom_header()->width ); ?>" height="<?php echo
 * esc_attr( get_custom_header()->height ); ?>" alt="">
 * </a>
 * <?php endif; // End header image check. ?>
 *
 * @link    https://developer.wordpress.org/themes/functionality/custom-headers/
 *
 * @package _msp
 */

/**
 * Set up the WordPress core custom header feature.
 *
 * @uses _msp_header_style()
 */
function _msp_custom_header_setup() {
   // Add theme support for Custom Header
   $header_args = [
      'default-image'          => '',
      'width'                  => 1140,
      'height'                 => 263,
      'flex-width'             => TRUE,
      'flex-height'            => FALSE,
      'uploads'                => TRUE,
      'random-default'         => FALSE,
      'header-text'            => FALSE,
      'default-text-color'     => '',
      'wp-head-callback'       => '_msp_header_style',
      'admin-head-callback'    => '',
      'admin-preview-callback' => '',
   ];
   add_theme_support( 'custom-header', $header_args );

}

add_action( 'after_setup_theme', '_msp_custom_header_setup' );

if ( !function_exists( '_msp_header_style' ) ) :
   /**
    * Styles the header image and text displayed on the blog.
    *
    * @see _msp_custom_header_setup().
    */
   function _msp_header_style() {
      if ( get_header_image() ) : ?>
         <style type="text/css">
            ._msp-header {
               background-image: url(<?php header_image(); ?>);
            }
         </style>
      <?php endif;
   }
endif;
