/* ================================================================
   ToonCakes — shared navigation extras  (site-nav.js)
   Loaded by every customer page. Adds, in one place:
     • 📞 Call button (tap-to-call) in the desktop menu, ☰ mobile menu and footer
     • 👤 My Account / 🔑 Login link in the ☰ mobile menu
     • a small contact strip on pages that have no footer
   Change the phone number below and it updates everywhere.
================================================================ */
(function () {
  'use strict';

  var PHONE_DISPLAY = '+91 86106 36589';
  var PHONE_TEL     = '+918610636589';
  var WHATSAPP      = 'https://wa.me/918610636589';
  var MAP_LINK      = 'https://maps.app.goo.gl/f6VFzLmLkMPtKJqx5';

  function loggedInUser() {
    try {
      var s = JSON.parse(localStorage.getItem('tc_user_session') || 'null');
      return (s && Date.now() < s.exp) ? s : null;
    } catch (e) { return null; }
  }

  function addStyles() {
    var css =
      '.mobile-nav{max-height:calc(100vh - 80px);overflow-y:auto;}' +
      '.nav-call{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:50px;' +
        'border:1.5px solid var(--pink,#E8356D);color:var(--pink,#E8356D)!important;font-weight:600;white-space:nowrap;}' +
      '.nav-call:hover{background:var(--pink,#E8356D);color:#fff!important;}' +
      '.mobile-nav a.mnav-call{color:var(--pink,#E8356D);font-weight:700;}' +
      '.mobile-nav a.mnav-account{font-weight:600;}' +
      '.footer-call{color:inherit;text-decoration:underline;}' +
      '.tc-contact-strip{background:#2C1019;color:#fff;padding:22px 16px;text-align:center;font-family:Poppins,sans-serif;}' +
      '.tc-contact-strip .tcs-title{font-family:"Playfair Display",serif;font-size:18px;font-weight:700;margin-bottom:12px;}' +
      '.tc-contact-strip .tcs-row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;}' +
      '.tc-contact-strip a{display:inline-flex;align-items:center;gap:6px;padding:10px 18px;border-radius:50px;' +
        'font-size:14px;font-weight:600;text-decoration:none;color:#fff;}' +
      '.tc-contact-strip .tcs-call{background:#E8356D;}' +
      '.tc-contact-strip .tcs-wa{background:#25D366;}' +
      '.tc-contact-strip .tcs-map{background:rgba(255,255,255,0.12);}' +
      '.tc-contact-strip .tcs-hours{font-size:12px;opacity:.75;margin-top:12px;}' +
      '@media(max-width:1100px){.nav-links li.nav-call-li{display:none;}}';
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);
  }

  // Desktop menu: 📞 Call next to the WhatsApp button
  function addDesktopCall() {
    var ul = document.querySelector('.nav-links');
    if (!ul || ul.querySelector('a[href^="tel:"]')) return;
    var li = document.createElement('li');
    li.className = 'nav-call-li';
    li.innerHTML = '<a class="nav-call" href="tel:' + PHONE_TEL + '">📞 Call</a>';
    var wa = ul.querySelector('.nav-cta');
    ul.insertBefore(li, wa ? wa.closest('li') : null);
  }

  // ☰ Mobile menu: 📞 Call us + 👤 My Account (above the WhatsApp button, which stays last)
  function addMobileLinks() {
    var nav = document.getElementById('mobileNav');
    if (!nav) return;
    var waLink = nav.querySelector('a[href*="wa.me"]');
    var before = waLink || null;

    if (!nav.querySelector('a[href^="tel:"]')) {
      var call = document.createElement('a');
      call.href = 'tel:' + PHONE_TEL;
      call.className = 'mnav-call';
      call.textContent = '📞 Call Us — ' + PHONE_DISPLAY;
      nav.insertBefore(call, before);
    }
    if (!nav.querySelector('a[href*="user-login"],a[href*="user-dashboard"]')) {
      var user = loggedInUser();
      var acc = document.createElement('a');
      acc.className = 'mnav-account';
      if (user) {
        acc.href = 'user-dashboard.html';
        acc.textContent = '👤 My Account' + (user.name ? ' (' + String(user.name).split(' ')[0] + ')' : '');
      } else {
        acc.href = 'user-login.html?return=' + encodeURIComponent((location.pathname.split('/').pop() || 'index.html'));
        acc.textContent = '🔑 Login / My Account';
      }
      nav.insertBefore(acc, before);
    }
  }

  // Footer: make the phone number tappable, or add a contact strip if the page has no footer
  function addFooterCall() {
    var footer = document.querySelector('footer');
    if (footer) {
      if (footer.querySelector('a[href^="tel:"]')) return;
      // Find the phone number written as plain text (any footer layout) and make it tappable
      var walker = document.createTreeWalker(footer, NodeFilter.SHOW_TEXT, null);
      var node;
      while ((node = walker.nextNode())) {
        if (node.parentNode.closest('a')) continue;
        var m = node.nodeValue.match(/(\+91[\s-]?)?86106\s?36589/);
        if (!m) continue;
        var a = document.createElement('a');
        a.className = 'footer-call';
        a.href = 'tel:' + PHONE_TEL;
        a.textContent = '📞 ' + PHONE_DISPLAY + ' — tap to call';
        var after = node.splitText(m.index);
        after.nodeValue = after.nodeValue.slice(m[0].length);
        node.parentNode.insertBefore(a, after);
        return;
      }
      // Footer without a phone number: add a call link at its end
      var p = document.createElement('p');
      p.style.cssText = 'text-align:center;margin:12px 0 0;';
      p.innerHTML = '<a class="footer-call" href="tel:' + PHONE_TEL + '">📞 Call us: ' + PHONE_DISPLAY + '</a>';
      footer.appendChild(p);
      return;
    }
    var strip = document.createElement('div');
    strip.className = 'tc-contact-strip';
    strip.id = 'contact';
    strip.innerHTML =
      '<div class="tcs-title">Questions? We\'re happy to help 🎂</div>' +
      '<div class="tcs-row">' +
        '<a class="tcs-call" href="tel:' + PHONE_TEL + '">📞 Call ' + PHONE_DISPLAY + '</a>' +
        '<a class="tcs-wa" href="' + WHATSAPP + '" target="_blank" rel="noopener">💬 WhatsApp</a>' +
        '<a class="tcs-map" href="' + MAP_LINK + '" target="_blank" rel="noopener">📍 Find us</a>' +
      '</div>' +
      '<div class="tcs-hours">Open every day · 9 AM – 9 PM · Tiruchirappalli</div>';
    document.body.appendChild(strip);
  }

  function init() {
    addStyles();
    addDesktopCall();
    addMobileLinks();
    addFooterCall();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
