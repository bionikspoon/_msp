<?php
/**
 * The main template file.
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 *
 * @link    https://codex.wordpress.org/Template_Hierarchy
 *
 * @package _msp
 */


if ( !class_exists( 'Timber' ) ) {
   echo 'Timber not activated. Make sure you activate the plugin in <a href="' . admin_url( 'plugins.php#timber', $scheme ) . '">' . esc_url( admin_url( 'plugins.php' ) ) . '</a>';

   return;
}
Timber::render( 'index.twig', Timber::get_context() );
