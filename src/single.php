<?php
/**
 * The template for displaying all single posts.
 *
 * @link    https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 *
 * @package _msp
 */

$context = Timber::get_context();
$post = Timber::query_post();
$context[ 'post' ] = $post;


if ( post_password_required( $post->ID ) ) {
   Timber::render( 'single-password.twig', $context );
} else {
   $template = [ 'single-' . $post->ID . '.twig', 'single-' . $post->post_type . '.twig', 'single.twig' ];
   Timber::render( $template, $context );
}
