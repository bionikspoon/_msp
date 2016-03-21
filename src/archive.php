<?php
/**
 * The template for displaying archive pages.
 *
 * @link    https://codex.wordpress.org/Template_Hierarchy
 *
 * @package _msp
 */
$templates = [ 'archive.twig', 'index.twig' ];
if ( is_category() ) {
   array_unshift( $templates, 'archive-' . get_query_var( 'cat' ) . '.twig' );
} else if ( is_post_type_archive() ) {
   array_unshift( $templates, 'archive-' . get_post_type() . '.twig' );
}
Timber::render( 'index.twig', Timber::get_context() );
