<?php
/**
 * The template for displaying archive pages.
 *
 * @link    https://codex.wordpress.org/Template_Hierarchy
 *
 * @package _msp
 */
$templates = [ sprintf( 'archive-%s.twig', get_post_type() ), 'archive.twig', 'index.twig' ];
if ( is_category() ) {
   array_unshift( $templates, sprintf( 'archive-%s.twig', get_query_var( 'cat' ) ) );
}
Timber::render( $templates, Timber::get_context() );
