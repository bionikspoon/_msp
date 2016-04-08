<?php
/**
 *
 * @link    https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package _msp
 */
if ( !class_exists( 'Timber' ) ) {
   echo 'Timber not activated. Make sure you activate the plugin in <a href="' . admin_url( 'plugins.php#timber', $scheme ) . '">' . esc_url( admin_url( 'plugins.php' ) ) . '</a>';

   return;
}

