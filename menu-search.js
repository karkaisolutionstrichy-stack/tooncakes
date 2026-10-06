/* ================================================================
   ToonCakes — menu search + sticky category bar  (menu-search.js)
   Used by cakes.html and desserts.html.
   • Adds a search box above the category tabs
   • Keeps the search + tabs visible (sticky) while scrolling the menu
   • Searching looks across ALL categories (switches the tab to "All")
================================================================ */
(function () {
  'use strict';

  function setup() {
    var isCakes = !!document.getElementById('cakesGrid');
    var cfg = isCakes
      ? { grid: 'cakesGrid',    card: '.cake-card',    fn: 'filterCakes',    noun: 'cakes',    eg: 'chocolate, unicorn, red velvet…' }
      : { grid: 'dessertsGrid', card: '.dessert-card', fn: 'filterDesserts', noun: 'desserts', eg: 'brownie, tiramisu, jar…' };
    var grid = document.getElementById(cfg.grid);
    var tabs = document.querySelector('.filter-tabs');
    if (!grid || !tabs || typeof window[cfg.fn] !== 'function') return;

    // ── Styles ──
    var st = document.createElement('style');
    st.textContent =
      '.menu-tools{position:sticky;top:70px;z-index:40;background:var(--cream,#FFF9F5);padding:12px 0 10px;margin-bottom:24px;}' +
      '.category-strip .menu-tools{background:transparent;padding:0 0 10px;margin:0;position:static;}' +
      '.menu-search{position:relative;max-width:520px;margin:0 auto 12px;}' +
      '.menu-search input{width:100%;padding:12px 44px 12px 44px;border:2px solid var(--cream-dark,#F7EDE5);border-radius:50px;' +
        'font-family:Poppins,sans-serif;font-size:15px;background:#fff;outline:none;}' +
      '.menu-search input:focus{border-color:var(--pink,#E8356D);}' +
      '.menu-search .ms-icon{position:absolute;left:16px;top:50%;transform:translateY(-50%);font-size:16px;pointer-events:none;}' +
      '.menu-search .ms-clear{position:absolute;right:10px;top:50%;transform:translateY(-50%);border:none;background:#F3F4F6;' +
        'border-radius:50%;width:28px;height:28px;cursor:pointer;font-size:14px;display:none;}' +
      '.menu-tools .filter-tabs{margin-bottom:0;}' +
      '.menu-no-results{display:none;text-align:center;padding:40px 16px;color:var(--text-muted,#7A5060);}' +
      '.menu-no-results a{color:var(--pink,#E8356D);font-weight:700;}' +
      '@media(max-width:768px){' +
        '.menu-tools .filter-tabs,.category-strip .filter-tabs{flex-wrap:nowrap!important;justify-content:flex-start!important;overflow-x:auto;' +
          '-webkit-overflow-scrolling:touch;padding-bottom:4px;scrollbar-width:none;}' +
        '.menu-tools .filter-tab{white-space:nowrap;flex-shrink:0;}' +
      '}';
    document.head.appendChild(st);

    // ── Build search box; on cakes also wrap the tabs so the whole bar is sticky ──
    var tools = document.createElement('div');
    tools.className = 'menu-tools';
    tools.innerHTML =
      '<div class="menu-search">' +
        '<span class="ms-icon">🔍</span>' +
        '<input type="search" id="menuSearch" placeholder="Search ' + cfg.noun + ' — e.g. ' + cfg.eg + '" aria-label="Search ' + cfg.noun + '" autocomplete="off" />' +
        '<button type="button" class="ms-clear" aria-label="Clear search">✕</button>' +
      '</div>';
    tabs.parentNode.insertBefore(tools, tabs);
    tools.appendChild(tabs);

    var noRes = document.createElement('div');
    noRes.className = 'menu-no-results';
    grid.parentNode.insertBefore(noRes, grid.nextSibling);

    var input = tools.querySelector('input');
    var clear = tools.querySelector('.ms-clear');
    var origFilter = window[cfg.fn];

    function allTab() { return tabs.querySelector('.filter-tab'); }

    function applySearch() {
      var q = input.value.trim().toLowerCase();
      clear.style.display = q ? 'block' : 'none';
      var cards = grid.querySelectorAll(cfg.card);
      var shown = 0;
      cards.forEach(function (card) {
        if (q && card.style.display !== 'none') {
          var text = (card.textContent || '').toLowerCase();
          if (q.split(/\s+/).some(function (w) { return text.indexOf(w) === -1; })) card.style.display = 'none';
        }
        if (card.style.display !== 'none') shown++;
      });
      if (!shown) {
        noRes.innerHTML = q
          ? 'No ' + cfg.noun + ' match "<strong>' + q.replace(/[<>&"]/g, '') + '</strong>".<br>Try another word, or ' +
            '<a href="customize.html">design a custom cake</a> / <a href="https://wa.me/918610636589" target="_blank" rel="noopener">ask us on WhatsApp</a>.'
          : 'No ' + cfg.noun + ' in this category yet.';
        noRes.style.display = 'block';
      } else {
        noRes.style.display = 'none';
      }
    }

    // Category tabs still work; any search text is applied on top
    window[cfg.fn] = function (cat, btn) {
      origFilter(cat, btn);
      applySearch();
    };

    input.addEventListener('input', function () {
      origFilter('all', allTab());   // searching looks through every category
      applySearch();
    });
    clear.addEventListener('click', function () { input.value = ''; origFilter('all', allTab()); applySearch(); input.focus(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
  else setup();
})();
