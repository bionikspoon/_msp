/* global jQuery */
((function customizer($) {
  $(() => {
    const $container = $('.portfolio-entries');
    $container.masonry({
      itemSelector: 'article.portfolio-card',
      percentPosition: true,
    });
  });
})(jQuery));
