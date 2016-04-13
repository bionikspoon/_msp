<?php
/**
 * Jetpack Compatibility File.
 *
 * @link    https://jetpack.com/
 *
 * @package _msp
 */

/**
 * Jetpack setup function.
 *
 * See: https://jetpack.com/support/infinite-scroll/
 * See: https://jetpack.com/support/responsive-videos/
 */
function _msp_jetpack_setup() {
   // Add theme support for Infinite Scroll.
   // TODO support this
   /*add_theme_support( 'infinite-scroll', [
      'container' => 'main',
      'render'    => '_msp_infinite_scroll_render',
      'footer'    => 'page',
   ] );*/

   // Add theme support for Responsive Videos.
   // TODO support this
   //add_theme_support( 'jetpack-responsive-videos' );
   add_theme_support( 'jetpack-portfolio' );
}

add_action( 'after_setup_theme', '_msp_jetpack_setup' );

/**
 * Custom render function for Infinite Scroll.
 */
function _msp_infinite_scroll_render() {
   while ( have_posts() ) {
      the_post();
      if ( is_search() ) :
         get_template_part( 'template-parts/content', 'search' );
      else :
         get_template_part( 'template-parts/content', get_post_format() );
      endif;
   }
}

//add_filter( 'jetpack_sso_bypass_login_forward_wpcom', '__return_true' );
