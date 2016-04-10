<?php
/**
 * _msp Theme Customizer.
 *
 * @package _msp
 */

/**
 * Add postMessage support for site title and description for the Theme Customizer.
 *
 * @param WP_Customize_Manager $wp_customize Theme Customizer object.
 */
function _msp_customize_register( $wp_customize ) {
   $wp_customize->get_setting( 'blogname' )->transport = 'postMessage';
   $wp_customize->get_setting( 'blogdescription' )->transport = 'postMessage';
   $wp_customize->get_setting( 'header_textcolor' )->transport = 'postMessage';


}

add_action( 'customize_register', '_msp_customize_register' );

/**
 * Binds JS handlers to make Theme Customizer preview reload changes asynchronously.
 */
function _msp_customize_preview_js() {
   $meta = json_decode( MSP_META );

   wp_enqueue_script(
      $meta->scripts->customizer->name,
      get_template_directory_uri() . '/' . $meta->scripts->customizer->path,
      $meta->scripts->customizer->parents,
      $meta->scripts->customizer->version ?? MSP_SCRIPT_VERSION,
      TRUE
   );
}

add_action( 'customize_preview_init', '_msp_customize_preview_js' );

