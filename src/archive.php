<?php
/**
 * The template for displaying archive pages.
 *
 * @link    https://codex.wordpress.org/Template_Hierarchy
 *
 * @package _msp
 */
$templates = [ 'archive-' . get_post_type() . '.twig', 'archive.twig' ];
if ( is_category() ) {
   array_unshift( $templates, 'archive-' . get_query_var( 'cat' ) . '.twig' );
}

Timber::render( $templates, Timber::get_context() );
