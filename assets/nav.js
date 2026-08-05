// Freedom Green Energy — Universal Navigation
// Injected synchronously at the top of <body> on every page.
// No defer — script tag must appear as the first child of <body>.
(function () {
  'use strict';

  var NAV_HTML =
    // ── Announcement bar ──────────────────────────────────────────────────────
    '<div class="topbar">' +
      '<span>&#9889; In-stock parts dispatched same day (order before 2pm)</span>' +
      '<span class="topbar-divider">|</span>' +
      '<span>Call us: <a href="tel:03337000275">0333 700 0275</a></span>' +
      '<span class="topbar-divider">|</span>' +
      '<span>Froling Authorised UK Distributor since 2012</span>' +
    '</div>' +

    // ── Desktop navigation ────────────────────────────────────────────────────
    '<nav>' +
      '<div class="nav-inner">' +

        '<a class="logo" href="index.html">' +
          '<img class="logo-img" src="assets/img/logo.png" width="224" height="138" ' +
               'alt="Freedom Green Energy &#8212; Renewable Energy Technologies" />' +
        '</a>' +

        '<ul class="nav-links">' +
          '<li class="nav-item"><a href="about.html" data-page="about.html">About</a></li>' +

          '<li class="nav-item nav-has-dropdown">' +
            '<a href="#" class="has-arrow">Products</a>' +
            '<div class="dropdown mega-products">' +

              '<div class="dd-col">' +
                '<span class="dd-heading">Froling Biomass Boilers</span>' +
                '<a href="pellet-boilers.html" class="dd-item" data-page="pellet-boilers.html">Pellet Boilers</a>' +
                '<a href="wood-chip-boilers.html" class="dd-item" data-page="wood-chip-boilers.html">Wood Chip Boilers</a>' +
                '<a href="log-boilers.html" class="dd-item" data-page="log-boilers.html">Log Boilers</a>' +
                '<a href="sp-dual-boilers.html" class="dd-item" data-page="sp-dual-boilers.html">SP Dual Boilers</a>' +
                '<a href="residential-boilers.html" class="dd-item" data-page="residential-boilers.html">Residential Boilers <span class="dd-badge dd-badge-green">Residential</span></a>' +
                '<a href="industrial-boilers.html" class="dd-item" data-page="industrial-boilers.html">Industrial Boilers <span class="dd-badge dd-badge-amber">Industrial</span></a>' +
                '<a href="product-brochures.html" class="dd-item" data-page="product-brochures.html">Product Brochures</a>' +
              '</div>' +

              '<div class="dd-col">' +
                '<span class="dd-heading">Biomass Spare Parts</span>' +
                '<a href="spare-parts.html" class="dd-item" data-page="spare-parts.html">All Spare Parts</a>' +
                '<a href="spare-parts-froling.html" class="dd-item" data-page="spare-parts-froling.html">Froling</a>' +
                '<a href="spare-parts-herz.html" class="dd-item" data-page="spare-parts-herz.html">Herz</a>' +
                '<a href="spare-parts-binda.html" class="dd-item" data-page="spare-parts-binda.html">Binda</a>' +
                '<a href="spare-parts-other.html" class="dd-item" data-page="spare-parts-other.html">Other Brands</a>' +
                '<div class="dd-divider"></div>' +
                '<span class="dd-heading">Pyrolysis CHP</span>' +
                '<a href="pyrolysis-chp.html" class="dd-item" data-page="pyrolysis-chp.html">About Pyrolysis CHP</a>' +
                '<a href="https://www.froeling.com/en/chp" class="dd-item" target="_blank" rel="noopener">Froling CHP <span class="dd-ext">&#8599;</span></a>' +
              '</div>' +

              '<div class="dd-col">' +
                '<span class="dd-heading">Solar PV</span>' +
                '<a href="smart-solar.html" class="dd-item" data-page="smart-solar.html">Smart Solar</a>' +
                '<a href="https://www.swatten.com" class="dd-item" target="_blank" rel="noopener">Swatten <span class="dd-ext">&#8599;</span></a>' +
                '<a href="#" class="dd-item">Inverters &amp; Batteries <span class="dd-ext">&#8599;</span></a>' +
                '<div class="dd-divider"></div>' +
                '<span class="dd-heading">Hot Water Heat Pumps</span>' +
                '<a href="heat-pumps.html" class="dd-item" data-page="heat-pumps.html">View Range</a>' +
              '</div>' +

            '</div>' +
          '</li>' +

          '<li class="nav-item"><a href="installer-services.html" data-page="installer-services.html">Installer Services</a></li>' +
          '<li class="nav-item"><a href="contact.html" data-page="contact.html">Contact Us</a></li>' +
        '</ul>' +

        '<div class="nav-actions">' +
          '<button class="icon-btn" aria-label="Search">' +
            '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>' +
          '</button>' +
          '<a href="spare-parts.html" class="btn-nav" data-page="spare-parts.html">Order Parts</a>' +
          '<button class="icon-btn mobile-toggle" id="mobileToggle" aria-label="Open menu" aria-expanded="false">' +
            '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>' +
          '</button>' +
        '</div>' +

      '</div>' +
    '</nav>' +

    // ── Mobile menu overlay ───────────────────────────────────────────────────
    '<div class="mobile-menu" id="mobileMenu" role="dialog" aria-label="Navigation menu">' +
      '<div class="mobile-menu-header">' +
        '<a class="logo" href="index.html">' +
          '<img class="logo-img" src="assets/img/logo.png" width="224" height="138" ' +
               'alt="Freedom Green Energy &#8212; Renewable Energy Technologies" />' +
        '</a>' +
        '<button class="icon-btn" id="mobileClose" aria-label="Close menu">' +
          '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</button>' +
      '</div>' +
      '<nav class="mobile-links">' +
        '<a href="about.html" data-page="about.html">About</a>' +
        '<span class="mobile-group-label">Products</span>' +
        '<span class="mobile-section-label">Froling Biomass Boilers</span>' +
        '<a href="pellet-boilers.html" class="mobile-sub" data-page="pellet-boilers.html">Pellet Boilers</a>' +
        '<a href="wood-chip-boilers.html" class="mobile-sub" data-page="wood-chip-boilers.html">Wood Chip Boilers</a>' +
        '<a href="log-boilers.html" class="mobile-sub" data-page="log-boilers.html">Log Boilers</a>' +
        '<a href="sp-dual-boilers.html" class="mobile-sub" data-page="sp-dual-boilers.html">SP Dual Boilers</a>' +
        '<a href="residential-boilers.html" class="mobile-sub" data-page="residential-boilers.html">Residential Boilers</a>' +
        '<a href="industrial-boilers.html" class="mobile-sub" data-page="industrial-boilers.html">Industrial Boilers</a>' +
        '<span class="mobile-section-label">Biomass Spare Parts</span>' +
        '<a href="spare-parts.html" class="mobile-sub" data-page="spare-parts.html">All Spare Parts</a>' +
        '<a href="spare-parts-froling.html" class="mobile-sub" data-page="spare-parts-froling.html">Froling Parts</a>' +
        '<a href="spare-parts-herz.html" class="mobile-sub" data-page="spare-parts-herz.html">Herz Parts</a>' +
        '<span class="mobile-section-label">Solar PV</span>' +
        '<a href="smart-solar.html" class="mobile-sub" data-page="smart-solar.html">Smart Solar</a>' +
        '<span class="mobile-section-label">Hot Water Heat Pumps</span>' +
        '<a href="heat-pumps.html" class="mobile-sub" data-page="heat-pumps.html">View Range</a>' +
        '<a href="installer-services.html" data-page="installer-services.html">Installer Services</a>' +
        '<a href="contact.html" data-page="contact.html">Contact Us</a>' +
        '<a href="spare-parts.html" class="mobile-cta">Order Parts &#8594;</a>' +
      '</nav>' +
    '</div>';

  // ── Inject at top of body ───────────────────────────────────────────────────
  document.body.insertAdjacentHTML('afterbegin', NAV_HTML);

  // ── Mobile menu toggle ──────────────────────────────────────────────────────
  var toggle = document.getElementById('mobileToggle');
  var menu   = document.getElementById('mobileMenu');
  var close  = document.getElementById('mobileClose');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      menu.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
    });
  }
  if (close && menu) {
    close.addEventListener('click', function () {
      menu.classList.remove('open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  }

  // ── Active nav state ────────────────────────────────────────────────────────
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-page]').forEach(function (el) {
    if (el.dataset.page === path) {
      // Highlight nav-item ancestor
      var li = el.closest('.nav-item');
      if (li) li.classList.add('active');
      // Highlight mobile link itself
      if (el.tagName === 'A') el.style.color = 'var(--green-main)';
    }
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

})();
