<?php
/**
 *
 * @link    https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package _msp
 */

?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
   <meta charset="<?php bloginfo('charset'); ?>">
   <meta name="viewport" content="width=device-width, initial-scale=1">
   <link rel="profile" href="http://gmpg.org/xfn/11">
   <link rel="pingback" href="<?php bloginfo('pingback_url'); ?>">

   <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

<?php
$context = Timber::get_context();
$context['menu'] = new TimberMenu('primary');
$context['logo'] = new TimberImage(get_custom_header()->attachment_id);

?>


<div id="page" class="site">
   <a class="skip-link screen-reader-text" href="#content">
      <?php esc_html_e('Skip to content', '_msp'); ?>
   </a>

   <header id="masthead" class="site-header" role="banner">
      <?php Timber::render('_partials/navigation.twig', $context) ?>
   </header><!-- #masthead -->

   <div id="content" class="site-content">
