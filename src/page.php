<?php
/**
 * The template for displaying all pages.
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site may use a
 * different template.
 *
 * @link    https://codex.wordpress.org/Template_Hierarchy
 *
 * @package _msp
 */

get_template_part( 'timber' );

$context = Timber::get_context();
$post = new TimberPost();
$context[ 'post' ] = $post;
$template = [ 'page-' . $post->post_name . '.twig', 'page.twig' ];
Timber::render( $template, $context );
