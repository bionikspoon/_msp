<?php
/**
 * Implementation of the Custom Background feature.
 *
 *
 * @package _msp
 */

/**
 * Set up the WordPress core custom background feature.
 *
 * @uses _msp_header_style()
 */
function _msp_custom_background_setup() {
   // Add theme support for Custom Background
   $background_args = [
      'default-color'          => 'ffffff',
      'default-image'          => '',
      'default-repeat'         => '',
      'default-position-x'     => '',
      'wp-head-callback'       => '_msp_background_style',
      'admin-head-callback'    => '',
      'admin-preview-callback' => '',
   ];
   add_theme_support( 'custom-background', $background_args );
   /*add_theme_support( 'custom-background', apply_filters( '_msp_custom_background_args', [
      'default-color' => 'ffffff',
      'default-image' => '',
   ] ) );*/

}

add_action( 'after_setup_theme', '_msp_custom_background_setup' );

if ( !function_exists( '_msp_background_style' ) ) :
   /**
    * Styles the header image and text displayed on the blog.
    *
    * @see _msp_custom_header_setup().
    */
   function _msp_background_style() {
   }
endif;
