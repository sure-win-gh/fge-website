// Freedom Green Energy — Shopify Cart
// Uses Storefront API 2024-01 Cart mutations. No external SDK required.
(function () {
  'use strict';

  var DOMAIN = 'fgebiomass.myshopify.com';
  var TOKEN  = '53b21bb7b9ed4682c33954b8f2baf661';
  var CART_ID_KEY = 'fge_cart_id';

  var cart = null; // holds latest cart object from Shopify

  // ── GraphQL helper ──────────────────────────────────────────────────────────
  function gql(query, variables) {
    return fetch('https://' + DOMAIN + '/api/2024-01/graphql.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': TOKEN
      },
      body: JSON.stringify({ query: query, variables: variables || {} })
    }).then(function (r) { return r.json(); });
  }

  // ── Cart fragment ───────────────────────────────────────────────────────────
  var CART_FRAGMENT = '\
    id\
    checkoutUrl\
    lines(first: 100) {\
      edges {\
        node {\
          id\
          quantity\
          merchandise {\
            ... on ProductVariant {\
              id\
              title\
              price { amount currencyCode }\
              product { title handle }\
              image { url altText }\
            }\
          }\
        }\
      }\
    }\
    cost {\
      subtotalAmount { amount currencyCode }\
    }\
  ';

  // ── Mutations ───────────────────────────────────────────────────────────────
  function cartCreate(variantId, qty) {
    return gql(
      'mutation cartCreate($input: CartInput!) {\
         cartCreate(input: $input) {\
           cart { ' + CART_FRAGMENT + ' }\
           userErrors { field message }\
         }\
       }',
      { input: { lines: [{ merchandiseId: variantId, quantity: qty }] } }
    ).then(function (d) { return d.data.cartCreate.cart; });
  }

  function cartLinesAdd(cartId, variantId, qty) {
    return gql(
      'mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {\
         cartLinesAdd(cartId: $cartId, lines: $lines) {\
           cart { ' + CART_FRAGMENT + ' }\
           userErrors { field message }\
         }\
       }',
      { cartId: cartId, lines: [{ merchandiseId: variantId, quantity: qty }] }
    ).then(function (d) { return d.data.cartLinesAdd.cart; });
  }

  function cartLinesUpdate(cartId, lineId, qty) {
    return gql(
      'mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {\
         cartLinesUpdate(cartId: $cartId, lines: $lines) {\
           cart { ' + CART_FRAGMENT + ' }\
           userErrors { field message }\
         }\
       }',
      { cartId: cartId, lines: [{ id: lineId, quantity: qty }] }
    ).then(function (d) { return d.data.cartLinesUpdate.cart; });
  }

  function cartLinesRemove(cartId, lineId) {
    return gql(
      'mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {\
         cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {\
           cart { ' + CART_FRAGMENT + ' }\
           userErrors { field message }\
         }\
       }',
      { cartId: cartId, lineIds: [lineId] }
    ).then(function (d) { return d.data.cartLinesRemove.cart; });
  }

  function cartFetch(cartId) {
    return gql(
      'query cartQuery($id: ID!) { cart(id: $id) { ' + CART_FRAGMENT + ' } }',
      { id: cartId }
    ).then(function (d) { return d.data.cart; });
  }

  // ── DOM injection ───────────────────────────────────────────────────────────
  function injectDrawer() {
    document.body.insertAdjacentHTML('beforeend',
      '<div id="cartOverlay" class="drawer-overlay"></div>' +
      '<aside id="cartDrawer" class="drawer" role="dialog" aria-modal="true" aria-label="Shopping cart">' +
        '<div class="drawer-header">' +
          '<h2 class="drawer-title">Your Cart</h2>' +
          '<button class="icon-btn" id="cartClose" aria-label="Close cart">' +
            '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
          '</button>' +
        '</div>' +
        '<div id="cartItems" class="drawer-items"></div>' +
        '<div id="cartFooter" class="drawer-footer">' +
          '<div class="drawer-subtotal"><span>Subtotal</span><strong id="cartSubtotal"></strong></div>' +
          '<p class="drawer-tax-note">Taxes and shipping calculated at checkout</p>' +
          '<a id="cartCheckoutBtn" href="#" class="btn-drawer-primary" target="_blank" rel="noopener">Proceed to Checkout →</a>' +
        '</div>' +
      '</aside>'
    );

    document.getElementById('cartClose').addEventListener('click', closeCart);
    document.getElementById('cartOverlay').addEventListener('click', closeCart);
  }

  function injectNavIcon() {
    var actions = document.querySelector('.nav-actions');
    if (!actions || document.getElementById('cartNavBtn')) return;

    var btn = document.createElement('button');
    btn.id = 'cartNavBtn';
    btn.className = 'icon-btn shop-nav-btn';
    btn.setAttribute('aria-label', 'Open cart');
    btn.innerHTML =
      '<span class="nav-icon-wrap">' +
        '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">' +
          '<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>' +
          '<line x1="3" y1="6" x2="21" y2="6"/>' +
          '<path d="M16 10a4 4 0 01-8 0"/>' +
        '</svg>' +
        '<span class="cart-badge nav-badge" id="cartBadge" aria-live="polite" style="display:none">0</span>' +
      '</span>';

    var btnNav = actions.querySelector('.btn-nav');
    btnNav ? actions.insertBefore(btn, btnNav) : actions.appendChild(btn);
    btn.addEventListener('click', openCart);
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  function renderCart() {
    var itemsEl  = document.getElementById('cartItems');
    var footerEl = document.getElementById('cartFooter');
    var badge    = document.getElementById('cartBadge');
    if (!itemsEl) return;

    var lines = cart && cart.lines ? cart.lines.edges.map(function (e) { return e.node; }) : [];
    var totalQty = lines.reduce(function (s, l) { return s + l.quantity; }, 0);

    // Badge
    if (badge) {
      badge.textContent = totalQty;
      badge.style.display = totalQty > 0 ? 'flex' : 'none';
    }

    if (!lines.length) {
      itemsEl.innerHTML =
        '<div class="drawer-empty">' +
          '<svg width="44" height="44" fill="none" stroke="currentColor" stroke-width="1.4" viewBox="0 0 24 24">' +
            '<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>' +
            '<line x1="3" y1="6" x2="21" y2="6"/>' +
            '<path d="M16 10a4 4 0 01-8 0"/>' +
          '</svg>' +
          '<p>Your cart is empty</p>' +
          '<a href="spare-parts.html" class="btn-drawer-secondary" onclick="closeCart&&closeCart()">Browse Parts</a>' +
        '</div>';
      if (footerEl) footerEl.style.display = 'none';
      return;
    }

    itemsEl.innerHTML = lines.map(function (line) {
      var v    = line.merchandise;
      var price = parseFloat(v.price.amount);
      var lineTotal = (price * line.quantity).toFixed(2);
      var imgHtml = v.image
        ? '<img src="' + v.image.url.split('?')[0] + '?width=80&format=webp" alt="' + (v.image.altText || v.product.title).replace(/"/g, '&quot;') + '">'
        : '<div class="cart-item-img-ph"></div>';
      var variantLabel = (v.title && v.title !== 'Default Title')
        ? '<span class="cart-item-variant">' + v.title + '</span>' : '';
      return (
        '<div class="cart-item" data-line-id="' + line.id + '">' +
          '<div class="cart-item-img">' + imgHtml + '</div>' +
          '<div class="cart-item-info">' +
            '<p class="cart-item-title">' + v.product.title + '</p>' +
            variantLabel +
            '<div class="cart-item-row">' +
              '<div class="qty-control">' +
                '<button class="qty-btn" data-action="dec" data-line-id="' + line.id + '" data-qty="' + line.quantity + '">−</button>' +
                '<span class="qty-val">' + line.quantity + '</span>' +
                '<button class="qty-btn" data-action="inc" data-line-id="' + line.id + '" data-qty="' + line.quantity + '">+</button>' +
              '</div>' +
              '<span class="cart-item-price">£' + lineTotal + '</span>' +
              '<button class="cart-item-remove" data-line-id="' + line.id + '" aria-label="Remove item">' +
                '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
              '</button>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    var subtotal = parseFloat(cart.cost.subtotalAmount.amount).toFixed(2);
    document.getElementById('cartSubtotal').textContent = '£' + subtotal;
    document.getElementById('cartCheckoutBtn').href = cart.checkoutUrl;
    if (footerEl) footerEl.style.display = 'block';

    // Events
    itemsEl.querySelectorAll('.qty-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var lineId = this.dataset.lineId;
        var qty    = parseInt(this.dataset.qty, 10);
        var newQty = this.dataset.action === 'inc' ? qty + 1 : qty - 1;
        if (newQty < 1) { doRemove(lineId); } else { doUpdate(lineId, newQty); }
      });
    });
    itemsEl.querySelectorAll('.cart-item-remove').forEach(function (btn) {
      btn.addEventListener('click', function () { doRemove(this.dataset.lineId); });
    });
  }

  function setLoading(on) {
    var drawer = document.getElementById('cartDrawer');
    if (drawer) drawer.classList.toggle('drawer-loading', on);
  }

  function doUpdate(lineId, qty) {
    setLoading(true);
    cartLinesUpdate(cart.id, lineId, qty)
      .then(function (c) { cart = c; renderCart(); })
      .catch(function () {})
      .then(function () { setLoading(false); });
  }

  function doRemove(lineId) {
    setLoading(true);
    cartLinesRemove(cart.id, lineId)
      .then(function (c) { cart = c; renderCart(); })
      .catch(function () {})
      .then(function () { setLoading(false); });
  }

  // ── Open / Close ────────────────────────────────────────────────────────────
  function openCart() {
    if (window.FGEQuote) window.FGEQuote.closeQuote();
    var drawer  = document.getElementById('cartDrawer');
    var overlay = document.getElementById('cartOverlay');
    if (drawer)  drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    var drawer  = document.getElementById('cartDrawer');
    var overlay = document.getElementById('cartOverlay');
    if (drawer)  drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ── Public addToCart ─────────────────────────────────────────────────────────
  function addToCart(variantId, qty, btn) {
    if (btn) { btn.disabled = true; btn.textContent = 'Adding…'; }
    var storedId = localStorage.getItem(CART_ID_KEY);
    var promise;
    if (storedId) {
      promise = cartLinesAdd(storedId, variantId, qty || 1)
        .catch(function () { return cartCreate(variantId, qty || 1); });
    } else {
      promise = cartCreate(variantId, qty || 1);
    }
    promise
      .then(function (c) {
        cart = c;
        localStorage.setItem(CART_ID_KEY, cart.id);
        renderCart();
        openCart();
      })
      .catch(function (e) { console.error('FGECart error', e); })
      .then(function () {
        if (btn) { btn.disabled = false; btn.textContent = 'Add to Cart'; }
      });
  }

  // ── Init ────────────────────────────────────────────────────────────────────
  function init() {
    injectDrawer();
    injectNavIcon();
    renderCart();

    var storedId = localStorage.getItem(CART_ID_KEY);
    if (storedId) {
      cartFetch(storedId)
        .then(function (c) { if (c) { cart = c; renderCart(); } })
        .catch(function () { localStorage.removeItem(CART_ID_KEY); });
    }
  }

  window.FGECart = { addToCart: addToCart, openCart: openCart, closeCart: closeCart };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
