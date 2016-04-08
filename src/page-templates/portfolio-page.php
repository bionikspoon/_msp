<?php
/**
 * Template Name: Portfolio Page Template
 *
 * @package _msp
 */
$posts_per_page = get_option( 'jetpack_portfolio_posts_per_page', '10' );

$args = [
   'post_type'      => 'jetpack-portfolio',
   'posts_per_page' => $posts_per_page,
];
$context = Timber::get_context();
$context[ 'posts' ] = Timber::get_posts( $args );
$context[ 'pagination' ] = Timber::get_pagination();


Timber::render( 'archive-jetpack-portfolio.twig', $context, TWIG_CACHE_TIMEOUT );
