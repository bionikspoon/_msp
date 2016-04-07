<?php
/**
 * _msp functions and definitions.
 *
 * @link    https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package _msp
 */


define( 'MSP_SCRIPT_VERSION', '20160406' );

if ( !class_exists( 'Timber' ) ) {
   add_action( 'admin_notices', function () {
      echo '<div class="error"><p>Timber not activated. Make sure you activate the plugin in <a href="' . esc_url( admin_url( 'plugins.php#timber' ) ) . '">' . esc_url( admin_url( 'plugins.php' ) ) . '</a></p></div>';
   } );

   return;
}

if ( !isset($content_width) ) $content_width = 640;

class MSPSite extends TimberSite {

   function __construct() {
      /*
      * Make theme available for translation.
      * Translations can be filed in the /languages/ directory.
      * If you're building a theme based on _msp, use a find and replace
      * to change '_msp' to the name of your theme in all the template files.
      */
      load_theme_textdomain( '_msp', get_template_directory() . '/languages' );

      // Add default posts and comments RSS feed links to head.
      add_theme_support( 'automatic-feed-links' );

      /*
       * Let WordPress manage the document title.
       * By adding theme support, we declare that this theme does not use a
       * hard-coded <title> tag in the document head, and expect WordPress to
       * provide it for us.
       */
      add_theme_support( 'title-tag' );

      /*
       * Enable support for Post Thumbnails on posts and pages.
       *
       * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
       */
      add_theme_support( 'post-thumbnails' );
      add_image_size( 'summary-image', 300, 9998 );
      add_image_size( 'detail-image', 750, 9999 );
      add_image_size( 'portfolio-image-item', 300, 9999 );
      add_image_size( 'portfolio-image-entry', 300, 9997 );


      // This theme uses wp_nav_menu()
      register_nav_menus( [
         'primary' => esc_html__( 'Primary Menu', '_msp' ),
         'social'  => esc_html__( 'Social Links Menu', '_msp' ),
      ] );


      /*
       * Switch default core markup for search form, comment form, and comments
       * to output valid HTML5.
       */
      add_theme_support( 'html5', [
         'search-form',
         'comment-form',
         'comment-list',
         'gallery',
         'caption',
      ] );

      /*
       * Enable support for Post Formats.
       * See https://developer.wordpress.org/themes/functionality/post-formats/
       */
      // TODO support this
      add_theme_support( 'post-formats'/*, [
         'aside',
         'image',
         'video',
         'quote',
         'link',
      ]*/ );

      add_theme_support( 'menus' );
      add_filter( 'timber_context', [ $this, 'add_to_context' ] );
      add_filter( 'get_twig', [ $this, 'add_to_twig' ] );
      parent::__construct();
   }

   function add_to_context( $context ) {
      $context[ 'menu' ] = new TimberMenu( 'primary' );
      $context[ 'social' ] = new TimberMenu( 'social' );
      $context[ 'footer_bg' ] = new TimberImage( 305 );

      $context[ 'site' ] = $this;

      return $context;
   }

   function add_to_twig( $twig ) {
      /* this is where you can add your own fuctions to twig */
      $twig->addFilter( 'tax_links', new Twig_SimpleFilter( 'tax_links', 'tax_links' ) );
      $twig->addFilter( 'after_more', new Twig_SimpleFilter( 'after_more', 'after_more' ) );
      $twig->addFilter( 'categorized', new Twig_SimpleFilter( 'categorized', 'categorized' ) );

      return $twig;
   }

}

function tax_links( $taxes ) {
   $convert_to_link = function ( $tax ) {
      return sprintf( '<a href=%s rel="%s tag">%s</a>', $tax->link, $tax->taxonomy, $tax->name );
   };

   return array_map( $convert_to_link, $taxes );
}

function after_more( $post_content ) {
   $result = explode( '<!--more--></p>', $post_content );

   return array_key_exists( 1, $result ) ? $result [ 1 ] : '';
}

function categorized( $categories ) {
   $result = array_filter( $categories, function ( $category ) {
      return $category->name !== 'Uncategorized';
   } );

   return $result;
}

new MSPSite();


/**
 * Enqueue scripts and styles.
 */
function _msp_scripts() {
   wp_enqueue_style( '_msp-style', get_stylesheet_uri() );


   wp_enqueue_script( '_msp.manifest', get_template_directory_uri() . '/js/manifest.js', [ ], MSP_SCRIPT_VERSION, TRUE );
   wp_enqueue_script( '_msp.vendor', get_template_directory_uri() . '/js/vendor.js', [ '_msp.manifest' ], MSP_SCRIPT_VERSION, TRUE );

   wp_enqueue_script( '_msp.main', get_template_directory_uri() . '/js/main.js', [ 'jquery-masonry', '_msp.vendor' ], MSP_SCRIPT_VERSION, TRUE );

   if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
      wp_enqueue_script( 'comment-reply' );
   }
}

add_action( 'wp_enqueue_scripts', '_msp_scripts' );

/**
 * Implement the Custom Header feature.
 */
//require get_template_directory() . '/inc/custom-header.php';
/**
 * Implement the Custom Header feature.
 */
//require get_template_directory() . '/inc/custom-background.php';

/**
 * Custom template tags for this theme.
 */
//require get_template_directory() . '/inc/template-tags.php';

/**
 * Custom functions that act independently of the theme templates.
 */
//require get_template_directory() . '/inc/extras.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Load Jetpack compatibility file.
 */
require get_template_directory() . '/inc/jetpack.php';

/**
 * Load advanced custom fields setup.
 */
require get_template_directory() . '/inc/advanced-custom-fields.php';

/**
 * Include composer.
 */
require_once(__DIR__ . '/vendor/autoload.php');
