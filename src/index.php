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

get_template_part('timber');

$templates = [ 'index.twig' ];
if ( is_home() ) {
   array_unshift( $templates, 'home.twig' );
}
$context = Timber::get_context();
$context[ 'pagination' ] = Timber::get_pagination();
Timber::render( $templates, $context );
