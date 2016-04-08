<?php
/**
 * The template for displaying archive pages.
 *
 * @link    https://codex.wordpress.org/Template_Hierarchy
 *
 * @package _msp
 */

get_template_part( 'timber' );

$templates = [ 'archive-' . get_post_type() . '.twig', 'archive.twig' ];
if ( is_category() ) {
   array_unshift( $templates, 'archive-' . get_query_var( 'cat' ) . '.twig' );
}

$context = Timber::get_context();
$context[ 'pagination' ] = Timber::get_pagination();
Timber::render( $templates, $context, TWIG_CACHE_TIMEOUT );
