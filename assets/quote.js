// Freedom Green Energy — Quote System
// Stores quote items in localStorage. Submits via EmailJS (no backend required).
//
// ── EMAILJS SETUP ──────────────────────────────────────────────────────────────
// 1. Create a free account at https://www.emailjs.com
// 2. Add an Email Service (Gmail, Outlook, SMTP — whatever you use)
// 3. Create an Email Template with these variables:
//      {{from_name}}   — customer name
//      {{company}}     — company name (optional)
//      {{reply_to}}    — customer email
//      {{phone}}       — customer phone
//      {{quote_items}} — formatted list of quoted parts
//      {{message}}     — customer message / part numbers
// 4. Fill in the three constants below and remove the placeholder comments.
// ───────────────────────────────────────────────────────────────────────────────
(function () {
  'use strict';

  var EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // from Account > API Keys
  var EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // from Email Services
  var EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // from Email Templates
  // Shared with assets/forms.js so every enquiry form uses the same keys.
  // shortcut: installers.html keeps its own copy of these three keys; fold it in when that page joins the shared header.
  window.FGE_EMAILJS = { publicKey: EMAILJS_PUBLIC_KEY, serviceId: EMAILJS_SERVICE_ID, templateId: EMAILJS_TEMPLATE_ID };

  var QUOTE_KEY = 'fge_quote';

  // ── State ───────────────────────────────────────────────────────────────────
  var quote = [];
  try { quote = JSON.parse(localStorage.getItem(QUOTE_KEY) || '[]'); } catch (e) { quote = []; }

  function saveQuote() {
    try { localStorage.setItem(QUOTE_KEY, JSON.stringify(quote)); } catch (e) {}
  }

  function itemIndex(variantId) {
    for (var i = 0; i < quote.length; i++) {
      if (quote[i].variantId === variantId) return i;
    }
    return -1;
  }

  function isInQuote(variantId) { return itemIndex(variantId) !== -1; }

  // ── Add / Update / Remove ───────────────────────────────────────────────────
  // item shape: { variantId, productId, title, variantTitle, price, handle, imgUrl }
  function addToQuote(item) {
    var idx = itemIndex(item.variantId);
    if (idx === -1) {
      quote.push({ variantId: item.variantId, productId: item.productId,
                   title: item.title, variantTitle: item.variantTitle,
                   price: item.price, handle: item.handle,
                   imgUrl: item.imgUrl, qty: 1 });
    } else {
      quote[idx].qty++;
    }
    saveQuote();
    syncBadges();
    syncQuoteButtons(item.variantId, true);
    renderQuote();
    openQuote();
  }

  function removeFromQuote(variantId) {
    quote = quote.filter(function (i) { return i.variantId !== variantId; });
    saveQuote();
    syncBadges();
    syncQuoteButtons(variantId, false);
    renderQuote();
  }

  function updateQty(variantId, qty) {
    var idx = itemIndex(variantId);
    if (idx === -1) return;
    if (qty < 1) { removeFromQuote(variantId); return; }
    quote[idx].qty = qty;
    saveQuote();
    renderQuote();
  }

  // ── Badge ───────────────────────────────────────────────────────────────────
  function syncBadges() {
    var total = quote.reduce(function (s, i) { return s + i.qty; }, 0);
    var badge = document.getElementById('quoteBadge');
    if (badge) {
      badge.textContent = total;
      badge.style.display = total > 0 ? 'flex' : 'none';
    }
  }

  // ── Quote button state (toggle "in quote" appearance) ───────────────────────
  function syncQuoteButtons(variantId, inQuote) {
    document.querySelectorAll('[data-quote-variant="' + variantId + '"]').forEach(function (btn) {
      btn.textContent = inQuote ? '✓ In Quote' : 'Add to Quote';
      btn.classList.toggle('in-quote', inQuote);
    });
  }

  // ── Drawer injection ────────────────────────────────────────────────────────
  function injectDrawer() {
    document.body.insertAdjacentHTML('beforeend',
      '<div id="quoteOverlay" class="drawer-overlay"></div>' +
      '<aside id="quoteDrawer" class="drawer" role="dialog" aria-modal="true" aria-label="Quote list">' +

        // ── List view ──
        '<div id="quoteListView">' +
          '<div class="drawer-header">' +
            '<h2 class="drawer-title">Your Quote</h2>' +
            '<button class="icon-btn" id="quoteClose" aria-label="Close quote">' +
              '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
            '</button>' +
          '</div>' +
          '<div id="quoteItems" class="drawer-items"></div>' +
          '<div id="quoteFooter" class="drawer-footer">' +
            '<button class="btn-drawer-secondary" id="openQuoteFormBtn">Request Quote →</button>' +
          '</div>' +
        '</div>' +

        // ── Form view ──
        '<div id="quoteFormView" style="display:none;flex-direction:column;height:100%;">' +
          '<div class="drawer-header">' +
            '<button class="icon-btn" id="backToListBtn" aria-label="Back to quote">' +
              '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>' +
            '</button>' +
            '<h2 class="drawer-title">Request a Quote</h2>' +
            '<button class="icon-btn" id="quoteFormClose" aria-label="Close">' +
              '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
            '</button>' +
          '</div>' +
          '<div class="drawer-items" style="padding:24px 20px;overflow-y:auto;">' +
            '<form id="quoteForm" class="quote-form">' +
              '<label class="quote-label">Your Name <span class="req">*</span>' +
                '<input type="text" name="from_name" required autocomplete="name" />' +
              '</label>' +
              '<label class="quote-label">Company' +
                '<input type="text" name="company" autocomplete="organization" />' +
              '</label>' +
              '<label class="quote-label">Email <span class="req">*</span>' +
                '<input type="email" name="reply_to" required autocomplete="email" />' +
              '</label>' +
              '<label class="quote-label">Phone <span class="req">*</span>' +
                '<input type="tel" name="phone" required autocomplete="tel" />' +
              '</label>' +
              '<label class="quote-label">Additional Details' +
                '<textarea name="message" rows="3" placeholder="Boiler model, serial number, or any other requirements…"></textarea>' +
              '</label>' +
              '<div id="quoteFormStatus"></div>' +
              '<button type="submit" class="btn-drawer-secondary" id="quoteSubmitBtn">Send Quote Request</button>' +
            '</form>' +
          '</div>' +
        '</div>' +

      '</aside>'
    );

    document.getElementById('quoteClose').addEventListener('click', closeQuote);
    document.getElementById('quoteOverlay').addEventListener('click', closeQuote);
    document.getElementById('quoteFormClose').addEventListener('click', closeQuote);
    document.getElementById('openQuoteFormBtn').addEventListener('click', showFormView);
    document.getElementById('backToListBtn').addEventListener('click', showListView);
    document.getElementById('quoteForm').addEventListener('submit', submitQuote);
  }

  function showFormView() {
    document.getElementById('quoteListView').style.display = 'none';
    document.getElementById('quoteFormView').style.display = 'flex';
  }
  function showListView() {
    document.getElementById('quoteFormView').style.display = 'none';
    document.getElementById('quoteListView').style.display = 'block';
  }

  function injectNavIcon() {
    var actions = document.querySelector('.nav-actions');
    if (!actions || document.getElementById('quoteNavBtn')) return;

    var btn = document.createElement('button');
    btn.id = 'quoteNavBtn';
    btn.className = 'icon-btn shop-nav-btn';
    btn.setAttribute('aria-label', 'Open quote list');
    btn.innerHTML =
      '<span class="nav-icon-wrap">' +
        '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">' +
          '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>' +
          '<polyline points="14 2 14 8 20 8"/>' +
          '<line x1="16" y1="13" x2="8" y2="13"/>' +
          '<line x1="16" y1="17" x2="8" y2="17"/>' +
        '</svg>' +
        '<span class="quote-badge nav-badge" id="quoteBadge" aria-live="polite" style="display:none">0</span>' +
      '</span>';

    // Insert before cart icon (which sits before btn-nav)
    var cartBtn = document.getElementById('cartNavBtn');
    var btnNav  = actions.querySelector('.btn-nav');
    if (cartBtn) {
      actions.insertBefore(btn, cartBtn);
    } else if (btnNav) {
      actions.insertBefore(btn, btnNav);
    } else {
      actions.appendChild(btn);
    }
    btn.addEventListener('click', openQuote);
  }

  // ── Render quote list ───────────────────────────────────────────────────────
  function renderQuote() {
    var itemsEl  = document.getElementById('quoteItems');
    var footerEl = document.getElementById('quoteFooter');
    if (!itemsEl) return;

    if (!quote.length) {
      itemsEl.innerHTML =
        '<div class="drawer-empty">' +
          '<svg width="44" height="44" fill="none" stroke="currentColor" stroke-width="1.4" viewBox="0 0 24 24">' +
            '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>' +
            '<polyline points="14 2 14 8 20 8"/>' +
            '<line x1="16" y1="13" x2="8" y2="13"/>' +
            '<line x1="16" y1="17" x2="8" y2="17"/>' +
          '</svg>' +
          '<p>No items in your quote</p>' +
        '</div>';
      if (footerEl) footerEl.style.display = 'none';
      return;
    }

    itemsEl.innerHTML = quote.map(function (item) {
      var imgHtml = item.imgUrl
        ? '<img src="' + item.imgUrl.split('?')[0] + '?width=80&format=webp" alt="' + item.title.replace(/"/g, '&quot;') + '">'
        : '<div class="cart-item-img-ph"></div>';
      var variantLabel = (item.variantTitle && item.variantTitle !== 'Default Title')
        ? '<span class="cart-item-variant">' + item.variantTitle + '</span>' : '';
      var priceHtml = item.price > 0
        ? '<span class="cart-item-price">£' + item.price.toFixed(2) + ' ea</span>'
        : '<span class="cart-item-price muted-price">Price on request</span>';
      return (
        '<div class="cart-item" data-variant-id="' + item.variantId + '">' +
          '<div class="cart-item-img">' + imgHtml + '</div>' +
          '<div class="cart-item-info">' +
            '<p class="cart-item-title">' + item.title + '</p>' +
            variantLabel +
            '<div class="cart-item-row">' +
              '<div class="qty-control">' +
                '<button class="qty-btn" data-action="dec" data-variant-id="' + item.variantId + '" data-qty="' + item.qty + '">−</button>' +
                '<span class="qty-val">' + item.qty + '</span>' +
                '<button class="qty-btn" data-action="inc" data-variant-id="' + item.variantId + '" data-qty="' + item.qty + '">+</button>' +
              '</div>' +
              priceHtml +
              '<button class="cart-item-remove" data-variant-id="' + item.variantId + '" aria-label="Remove item">' +
                '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
              '</button>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    if (footerEl) footerEl.style.display = 'block';

    itemsEl.querySelectorAll('.qty-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var vid = this.dataset.variantId;
        var qty = parseInt(this.dataset.qty, 10);
        updateQty(vid, this.dataset.action === 'inc' ? qty + 1 : qty - 1);
      });
    });
    itemsEl.querySelectorAll('.cart-item-remove').forEach(function (btn) {
      btn.addEventListener('click', function () { removeFromQuote(this.dataset.variantId); });
    });
  }

  // ── EmailJS submission ──────────────────────────────────────────────────────
  function submitQuote(e) {
    e.preventDefault();
    var form      = e.target;
    var submitBtn = document.getElementById('quoteSubmitBtn');
    var statusEl  = document.getElementById('quoteFormStatus');

    submitBtn.disabled   = true;
    submitBtn.textContent = 'Sending…';
    statusEl.textContent = '';
    statusEl.className   = '';

    var itemList = quote.map(function (i) {
      var variant = (i.variantTitle && i.variantTitle !== 'Default Title') ? ' (' + i.variantTitle + ')' : '';
      var price   = i.price > 0 ? ' @ £' + i.price.toFixed(2) : ' (price on request)';
      return '• ' + i.title + variant + ' × ' + i.qty + price;
    }).join('\n');

    var params = {
      from_name:   form.from_name.value,
      company:     form.company.value || 'Not provided',
      reply_to:    form.reply_to.value,
      phone:       form.phone.value,
      quote_items: itemList,
      message:     form.message.value || 'No additional message.'
    };

    // Until real EmailJS keys are set (or if the library didn't load), hand the quote to the visitor's
    // email app instead of failing. The list stays, since we can't know they pressed Send.
    if (typeof emailjs === 'undefined' || /^YOUR_/.test(EMAILJS_PUBLIC_KEY)) {
      var body = 'Quote request\n\n' + itemList +
        '\n\nName: ' + params.from_name + '\nCompany: ' + params.company +
        '\nEmail: ' + params.reply_to + '\nPhone: ' + params.phone + '\n\n' + params.message;
      window.location.href = 'mailto:info@freedomgreen.co.uk?subject=' + encodeURIComponent('Quote request from ' + params.from_name) +
        '&body=' + encodeURIComponent(body);
      statusEl.textContent = 'Your email app should now be open with the quote filled in. Press Send to finish, or call 0333 700 0275.';
      statusEl.className   = 'quote-status-ok';
      submitBtn.disabled   = false;
      submitBtn.textContent = 'Send Quote Request';
      return;
    }

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params, EMAILJS_PUBLIC_KEY)
      .then(function () {
        statusEl.textContent = 'Quote sent! We\'ll be in touch within one business day.';
        statusEl.className   = 'quote-status-ok';
        form.reset();
        quote = [];
        saveQuote();
        syncBadges();
        renderQuote();
        // All quote buttons back to default
        document.querySelectorAll('[data-quote-variant]').forEach(function (btn) {
          btn.textContent = 'Add to Quote';
          btn.classList.remove('in-quote');
        });
        setTimeout(function () {
          showListView();
          statusEl.textContent = '';
        }, 3000);
      })
      .catch(function () {
        statusEl.textContent = 'Something went wrong. Please call 0333 700 0275 or email info@freedomgreen.co.uk.';
        statusEl.className   = 'quote-status-error';
      })
      .then(function () {
        submitBtn.disabled    = false;
        submitBtn.textContent = 'Send Quote Request';
      });
  }

  // ── Open / Close ────────────────────────────────────────────────────────────
  function openQuote() {
    if (window.FGECart) window.FGECart.closeCart();
    var drawer  = document.getElementById('quoteDrawer');
    var overlay = document.getElementById('quoteOverlay');
    if (drawer)  drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeQuote() {
    var drawer  = document.getElementById('quoteDrawer');
    var overlay = document.getElementById('quoteOverlay');
    if (drawer)  drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(showListView, 300);
  }

  // ── Init ────────────────────────────────────────────────────────────────────
  function init() {
    injectDrawer();
    injectNavIcon();
    syncBadges();
    renderQuote();
    // Restore in-quote button state
    quote.forEach(function (item) { syncQuoteButtons(item.variantId, true); });
  }

  window.FGEQuote = {
    addToQuote: addToQuote,
    openQuote:  openQuote,
    closeQuote: closeQuote,
    isInQuote:  isInQuote
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
