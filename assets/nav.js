// Freedom Green Energy — Universal Navigation
// Injected synchronously at the top of <body> on every page.
// No defer — script tag must appear as the first child of <body>.
(function () {
  'use strict';

  // ── One link list: the desktop menu and the mobile menu are both built from it, so they can't drift apart ──
  var NAV = [
    { label: 'Products', groups: [
      { heading: 'Froling Biomass Boilers', links: [
        ['Pellet Boilers', 'pellet-boilers.html'],
        ['Wood Chip Boilers', 'wood-chip-boilers.html'],
        ['Log Boilers', 'log-boilers.html'],
        ['SP Dual Boilers', 'sp-dual-boilers.html'],
        ['Residential Boilers', 'residential-boilers.html'],
        ['Industrial Boilers', 'industrial-boilers.html']
      ] },
      { heading: 'Pyrolysis CHP', links: [
        ['About Pyrolysis CHP', 'pyrolysis-chp.html'],
        ['Froling CHP', 'https://www.froeling.com/en/chp']
      ] },
      { heading: 'Solar PV', links: [
        ['Smart Solar', 'smart-solar.html'],
        ['Swatten', 'https://www.swatten.com']
      ] },
      { heading: 'Hot Water Heat Pumps', links: [
        ['View Range', 'heat-pumps.html']
      ] }
    ] },
    { label: 'Spare parts', href: 'spare-parts.html', groups: [
      { heading: 'Biomass Spare Parts', links: [
        ['All Spare Parts', 'spare-parts.html'],
        ['Froling', 'spare-parts-froling.html'],
        ['Herz', 'spare-parts-herz.html'],
        ['Binda', 'spare-parts-binda.html'],
        ['Other Brands', 'spare-parts-other.html']
      ] }
    ] },
    { label: 'Installers', href: 'installers.html' },
    { label: 'About', href: 'about.html' },
    { label: 'Contact', href: 'contact.html' }
  ];

  var path = window.location.pathname.split('/').pop() || 'index.html';

  function isExternal(href) { return /^https?:/.test(href); }
  function isActive(item) {
    return item.href === path || (item.groups || []).some(function (g) {
      return g.links.some(function (l) { return l[1] === path; });
    });
  }
  function link(l, cls) {
    var href = l[1], ext = isExternal(href);
    return '<a href="' + href + '"' + (cls ? ' class="' + cls + '"' : '') +
      (href === path ? ' aria-current="page"' : '') +
      (ext ? ' target="_blank" rel="noopener"' : '') + '>' + l[0] +
      (ext ? ' <span class="dd-ext" aria-hidden="true">&#8599;</span>' : '') + '</a>';
  }

  function desktopItem(item, i) {
    var cls = 'nav-item' + (isActive(item) ? ' active' : '');
    if (item.href) return '<li class="' + cls + '">' + link([item.label, item.href]) + '</li>';
    return '<li class="' + cls + ' nav-has-dropdown">' +
      '<button type="button" class="nav-trigger" aria-expanded="false" aria-controls="dd-' + i + '">' + item.label + '</button>' +
      '<div class="dropdown mega-products" id="dd-' + i + '">' +
        item.groups.map(function (g) {
          return '<div class="dd-col"><span class="dd-heading">' + g.heading + '</span>' +
            g.links.map(function (l) { return link(l, 'dd-item'); }).join('') + '</div>';
        }).join('') +
      '</div></li>';
  }

  function mobileItem(item) {
    if (!item.groups) return link([item.label, item.href]);
    var headed = item.groups.length > 1;
    return '<details' + (isActive(item) ? ' open' : '') + '><summary>' + item.label + '</summary><div class="mobile-group">' +
      item.groups.map(function (g) {
        return (headed ? '<span class="mobile-group-heading">' + g.heading + '</span>' : '') +
          g.links.map(function (l) { return link(l); }).join('');
      }).join('') + '</div></details>';
  }

  var NAV_HTML =
    '<div class="topbar">Order by 2pm for same-day dispatch &middot; <a href="tel:03337000275">0333 700 0275</a></div>' +

    '<nav aria-label="Main">' +
      '<div class="nav-inner">' +
        '<a class="logo" href="index.html">' +
          '<img class="logo-img" src="assets/img/logo.png" width="224" height="138" ' +
               'alt="Freedom Green Energy &#8212; Renewable Energy Technologies" />' +
        '</a>' +
        '<ul class="nav-links">' + NAV.map(desktopItem).join('') + '</ul>' +
        '<div class="nav-actions">' +
          '<button class="icon-btn" id="searchToggle" aria-label="Search spare parts" aria-expanded="false" aria-controls="navSearch">' +
            '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>' +
          '</button>' +
          '<a href="spare-parts.html" class="btn-nav">Order parts</a>' +
          '<button class="icon-btn mobile-toggle" id="mobileToggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobileMenu">' +
            '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>' +
          '</button>' +
        '</div>' +
      '</div>' +
      // Parts search: a plain GET form, so spare-parts.html?q=… does the searching.
      '<form class="nav-search" id="navSearch" action="spare-parts.html" role="search" hidden>' +
        '<input type="search" name="q" placeholder="Search parts by name or number" aria-label="Search spare parts" required />' +
        '<button type="submit" class="btn-nav">Search</button>' +
      '</form>' +
    '</nav>' +

    '<div class="mobile-menu" id="mobileMenu" role="dialog" aria-modal="true" aria-label="Navigation menu">' +
      '<div class="mobile-menu-header">' +
        '<a class="logo" href="index.html">' +
          '<img class="logo-img" src="assets/img/logo.png" width="224" height="138" ' +
               'alt="Freedom Green Energy &#8212; Renewable Energy Technologies" />' +
        '</a>' +
        '<button class="icon-btn" id="mobileClose" aria-label="Close menu">' +
          '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</button>' +
      '</div>' +
      '<nav class="mobile-links" aria-label="Main">' + NAV.map(mobileItem).join('') + '</nav>' +
      '<div class="mobile-menu-footer"><a href="spare-parts.html" class="mobile-cta">Order parts &#8594;</a></div>' +
    '</div>';

  document.body.insertAdjacentHTML('afterbegin', NAV_HTML);

  // ── Products dropdown: click, tap, Enter or Space; closes on outside click, focus leaving it, or Esc ──
  function closeDropdowns(except) {
    document.querySelectorAll('.nav-has-dropdown.open').forEach(function (li) {
      if (li === except) return;
      li.classList.remove('open');
      li.querySelector('.nav-trigger').setAttribute('aria-expanded', 'false');
    });
  }
  document.querySelectorAll('.nav-has-dropdown').forEach(function (li) {
    var trigger = li.querySelector('.nav-trigger');
    trigger.addEventListener('click', function () {
      var open = li.classList.toggle('open');
      trigger.setAttribute('aria-expanded', String(open));
      closeDropdowns(li);
    });
    li.addEventListener('focusout', function (e) {
      if (!li.contains(e.relatedTarget)) closeDropdowns();
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-has-dropdown')) closeDropdowns();
  });

  // ── Mobile menu: a modal sheet; the page behind is inert while it's open ──
  var toggle = document.getElementById('mobileToggle');
  var menu   = document.getElementById('mobileMenu');
  var close  = document.getElementById('mobileClose');

  function setMenu(open) {
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.documentElement.style.overflow = open ? 'hidden' : '';
    Array.prototype.forEach.call(document.body.children, function (el) {
      if (el !== menu && el.tagName !== 'SCRIPT') el.inert = open;
    });
    (open ? close : toggle).focus();
  }
  toggle.addEventListener('click', function () { setMenu(true); });
  close.addEventListener('click', function () { setMenu(false); });

  // ── Search toggle ──
  var searchToggle = document.getElementById('searchToggle');
  var search = document.getElementById('navSearch');
  function setSearch(open) {
    search.hidden = !open;
    searchToggle.setAttribute('aria-expanded', String(open));
    (open ? search.elements.q : searchToggle).focus();
  }
  searchToggle.addEventListener('click', function () { setSearch(search.hidden); });

  // ── Esc closes the top layer: dropdown, search, mobile menu, cart or quote drawer ──
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!search.hidden) { setSearch(false); return; }
    var openLi = document.querySelector('.nav-has-dropdown.open');
    if (openLi) { closeDropdowns(); openLi.querySelector('.nav-trigger').focus(); return; }
    if (menu.classList.contains('open')) { setMenu(false); return; }
    if (window.FGECart && document.querySelector('#cartDrawer.open')) window.FGECart.closeCart();
    if (window.FGEQuote && document.querySelector('#quoteDrawer.open')) window.FGEQuote.closeQuote();
  });

  // ── Load shop scripts (cart, quote, EmailJS) on every page ──────────────────
  function loadScript(src) {
    if (document.querySelector('script[src="' + src + '"]')) return; // already loaded
    var s = document.createElement('script');
    s.src = src;
    document.head.appendChild(s);
  }
  loadScript('https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js');
  loadScript('assets/cart.js');
  loadScript('assets/quote.js');
  loadScript('assets/forms.js');

})();
