<?php
/**
 * The template for displaying search results pages.
 *
 * @link    https://developer.wordpress.org/themes/basics/template-hierarchy/#search-result
 *
 * @package _msp
 */


$templates = [ 'search.twig', 'archive.twig', 'index.twig' ];
$context = Timber::get_context();

$context[ 'title' ] = 'Search results for ' . get_search_query();
$context[ 'posts' ] = Timber::get_posts();

Timber::render( $templates, $context );
