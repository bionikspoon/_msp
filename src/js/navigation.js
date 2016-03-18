/**
 * File navigation.js.
 *
 * Handles toggling the navigation menu for small screens and enables TAB key
 * navigation support for dropdown menus.
 */
((function navigation() {
  const container = document.getElementById('site-navigation');
  if (!container) return;

  const button = container.getElementsByTagName('button')[ 0 ];
  if (typeof button === 'undefined') return;

  const menu = container.getElementsByTagName('ul')[ 0 ];

  // Hide menu toggle button if menu is empty and return early.
  if (typeof menu === 'undefined') {
    button.style.display = 'none';
    return;
  }

  menu.setAttribute('aria-expanded', 'false');
  if (menu.className.indexOf('nav-menu') === -1) {
    menu.className += ' nav-menu';
  }

  button.onclick = function handleOnclick() {
    if (container.className.indexOf('toggled') !== -1) {
      container.className = container.className.replace(' toggled', '');
      button.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-expanded', 'false');
    }
    else {
      container.className += ' toggled';
      button.setAttribute('aria-expanded', 'true');
      menu.setAttribute('aria-expanded', 'true');
    }
  };

  // Get all the link elements within the menu.
  const links = menu.getElementsByTagName('a');
  const subMenus = menu.getElementsByTagName('ul');

  // Set menu items with submenus to aria-haspopup="true".
  for (let i = 0, len = subMenus.length; i < len; i++) {
    subMenus[ i ].parentNode.setAttribute('aria-haspopup', 'true');
  }

  // Each time a menu link is focused or blurred, toggle focus.
  for (let i = 0, len = links.length; i < len; i++) {
    links[ i ].addEventListener('focus', toggleFocus, true);
    links[ i ].addEventListener('blur', toggleFocus, true);
  }

  /**
   * Sets or removes .focus class on an element.
   */
  function toggleFocus() {
    let _this = this;

    // Move up through the ancestors of the current link until we hit .nav-menu.
    while (_this.className.indexOf('nav-menu') === -1) {
      // On li elements toggle the class .focus.
      if (_this.tagName.toLowerCase() === 'li') {
        if (_this.className.indexOf('focus') !== -1) {
          _this.className = _this.className.replace(' focus', '');
        }
        else {
          _this.className += ' focus';
        }
      }

      _this = _this.parentElement;
    }
  }
})());
