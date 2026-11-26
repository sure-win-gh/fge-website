// Freedom Green Energy — enquiry forms (every <form action="#"> on the site)
// Sends through EmailJS once quote.js holds real keys (window.FGE_EMAILJS). Until then it hands the
// enquiry to the visitor's email app, addressed to us, so no lead is silently lost.
(function () {
  'use strict';

  var TO = 'info@freedomgreen.co.uk';
  var PHONE = '<a href="tel:03337000275">0333 700 0275</a>';
  var query = new URLSearchParams(location.search);

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function fieldLabel(form, el) {
    var l = el.id && form.querySelector('label[for="' + el.id + '"]');
    return (l ? l.textContent : el.name).replace(/\*/g, '').trim();
  }

  // One "Label: value" line per filled field, with the option text for selects.
  function summary(form) {
    return Array.prototype.filter.call(form.elements, function (el) {
      return el.name && el.type !== 'submit' && el.value.trim();
    }).map(function (el) {
      var v = el.tagName === 'SELECT' ? el.options[el.selectedIndex].text : el.value.trim();
      return fieldLabel(form, el) + ': ' + v;
    }).join('\n');
  }

  function emailjsReady() {
    var c = window.FGE_EMAILJS;
    return c && !/^YOUR_/.test(c.publicKey) && typeof window.emailjs !== 'undefined';
  }

  function done(form, html) {
    var box = document.createElement('div');
    box.className = 'form-done';
    box.setAttribute('role', 'status');
    box.tabIndex = -1;
    box.innerHTML = html;
    form.replaceWith(box);
    box.focus();
  }

  function init() { document.querySelectorAll('form[action="#"]').forEach(function (form) {
    // Prefill from the link that brought people here, e.g. contact.html?interest=woodchip
    query.forEach(function (v, k) {
      var el = form.elements[k];
      if (el && !el.value && (el.tagName !== 'SELECT' || el.querySelector('option[value="' + CSS.escape(v) + '"]'))) el.value = v;
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('[type="submit"]');
      var btnText = btn.textContent;
      var get = function (n) { return form.elements[n] ? form.elements[n].value.trim() : ''; };
      var first = get('first-name');
      var name = [first, get('last-name')].join(' ').trim() || 'Website visitor';
      var subject = 'Website enquiry: ' + (document.title.split('|')[0].trim());
      var body = summary(form) + '\n\nSent from ' + location.pathname.split('/').pop();
      var thanks = '<h3>Thanks' + (first ? ', ' + esc(first) : '') + '.</h3>';

      if (!emailjsReady()) {
        location.href = 'mailto:' + TO + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        done(form, thanks +
          '<p>Your email app should now be open with your enquiry filled in. Press <strong>Send</strong> to finish.</p>' +
          '<p>Nothing opened? Email <a href="mailto:' + TO + '">' + TO + '</a> or call ' + PHONE + ', Mon&ndash;Fri 8:30am&ndash;5:00pm.</p>');
        return;
      }

      btn.disabled = true;
      var slow = setTimeout(function () { btn.textContent = 'Sending…'; }, 300);
      var c = window.FGE_EMAILJS;
      window.emailjs.send(c.serviceId, c.templateId, {
        from_name: name,
        company: 'Not provided',
        reply_to: get('email'),
        phone: get('phone') || 'Not provided',
        quote_items: 'None (general enquiry)',
        message: subject + '\n\n' + body
      }, { publicKey: c.publicKey }).then(function () {
        clearTimeout(slow);
        done(form, thanks +
          '<p>Your enquiry is with our team and we&rsquo;ll reply to ' + esc(get('email')) + '.</p>' +
          '<p>Need us sooner? Call ' + PHONE + ', Mon&ndash;Fri 8:30am&ndash;5:00pm.</p>');
      }).catch(function () {
        clearTimeout(slow);
        btn.disabled = false;
        btn.textContent = btnText;
        var err = form.querySelector('.form-error') || btn.insertAdjacentElement('beforebegin', document.createElement('p'));
        err.className = 'form-error';
        err.setAttribute('role', 'alert');
        err.innerHTML = 'Sorry, that didn&rsquo;t send. Your details are still here; try again, or call ' + PHONE + '.';
      });
    });
  }); }

  // Loaded from nav.js before the page body is parsed, so wait for the forms to exist.
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
