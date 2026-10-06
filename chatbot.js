/* ================================================================
   ToonCakes — customer help chatbot  (chatbot.js)
   A simple FAQ assistant: no server, no AI service, no cost.
   It matches the customer's words to the answers below, and also
   looks up cake / dessert / class prices from the Menu Manager data.
   Anything it can't answer is handed over to WhatsApp.

   To add or change an answer: edit the TOPICS list below.
     keys    → words/phrases that point to this answer (English + Tanglish)
     answer  → what the bot replies (HTML allowed)
     links   → buttons shown under the answer
================================================================ */
(function () {
  'use strict';

  var PHONE_DISPLAY = '+91 86106 36589';
  var PHONE_TEL     = '+918610636589';
  var WA_NUMBER     = '918610636589';
  var MAP_LINK      = 'https://maps.app.goo.gl/f6VFzLmLkMPtKJqx5';
  var INSTAGRAM     = 'https://www.instagram.com/tooncakestrichy/';

  function wa(text) { return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text || 'Hi ToonCakes!'); }

  // ── Knowledge base ────────────────────────────────────────────
  var TOPICS = [
    { id: 'eggless',
      keys: ['egg', 'eggless', 'egg less', 'mutta', 'muttai', 'veg', 'vegetarian', 'pure veg', 'contain egg', 'has egg'],
      answer: 'Yes! 🥚🚫 <b>Every</b> ToonCakes cake and dessert is <b>100% eggless</b> and pure veg. We use high-quality egg substitutes, so the cakes come out moist and fluffy. Perfect for vegetarian families!' },

    { id: 'price',
      keys: ['price', 'prices', 'cost', 'rate', 'rates', 'how much', 'evlo', 'evvalavu', 'evalavu', 'evvlo', 'vilai', 'rupees', 'rs', 'fee', 'fees', 'amount', 'cheap', 'budget', 'per kg', 'menu', 'price list'],
      answer: 'Our cakes start from <b>₹649/kg</b> 🎂<br>• Birthday cakes: ₹649 – ₹799/kg<br>• Kids theme cakes: ₹999 – ₹1,199/kg<br>• Fondant & special cakes: ₹949 – ₹1,299/kg<br>• Wedding cakes: from ₹1,499/kg<br><br>Desserts start from ₹60 (cookies). Tell me a cake name (e.g. <i>"red velvet price"</i>) and I\'ll give the exact price!',
      links: [{ label: '🎂 Cake menu', href: 'cakes.html' }, { label: '🍫 Desserts', href: 'desserts.html' }] },

    { id: 'size',
      keys: ['size', 'sizes', 'kg', 'half kg', 'weight', 'minimum', 'smallest', 'small cake', 'serving', 'servings', 'how many people', 'people', 'members', 'gram', 'grams', '500g', 'pound'],
      answer: 'Our minimum order is <b>0.5 kg</b> (serves about 4–6 people).<br>Sizes available: 0.5 kg, 1 kg, 1.5 kg, 2 kg, 2.5 kg, 3 kg and above.<br><br>Rough guide: <b>1 kg ≈ 8–10 people</b>, 2 kg ≈ 16–20 people.' },

    { id: 'order',
      keys: ['order', 'how to order', 'place order', 'book', 'booking', 'buy', 'purchase', 'want a cake', 'need a cake', 'eppadi order'],
      answer: 'Ordering is easy 😊<br>1️⃣ Pick a cake from our menu and tap <b>Order Now</b><br>2️⃣ Fill in size, date, message on cake and delivery location<br>3️⃣ Pay online — your order is confirmed!<br><br>Or just message us on WhatsApp with what you need.',
      links: [{ label: '🎂 Choose a cake', href: 'cakes.html' }, { label: '💬 Order on WhatsApp', href: wa('Hi ToonCakes! I want to order a cake.') }] },

    { id: 'advance',
      keys: ['advance', 'how early', 'how many days', 'before', 'prior', 'same day', 'today', 'tonight', 'urgent', 'tomorrow', 'last minute', 'immediately', 'inniki', 'innaikku', 'naalaiku', 'naalaikku', 'quick'],
      answer: '⏰ Please order at least <b>24–48 hours</b> ahead for regular cakes. <b>Order by 8 PM</b> for next-day delivery.<br>• Custom / wedding cakes: 3–5 days ahead<br>• Festivals (Diwali, Christmas…): 1 week ahead<br><br>Need a cake <b>today</b>? Please call us and we\'ll check whether we can make it.',
      links: [{ label: '📞 Call ' + PHONE_DISPLAY, href: 'tel:' + PHONE_TEL }] },

    { id: 'delivery',
      keys: ['deliver', 'delivery', 'home delivery', 'door', 'doorstep', 'ship', 'courier', 'send', 'area', 'areas', 'srirangam', 'thillai nagar', 'kk nagar', 'anna nagar', 'woraiyur', 'palakarai', 'ariyamangalam', 'cantonment', 'delivery charge', 'delivery charges', 'km'],
      answer: '🚚 We deliver across <b>Tiruchirappalli</b>: Srirangam, Thillai Nagar, KK Nagar, Anna Nagar, Woraiyur, Palakarai, Ariyamangalam and more.<br><br><b>Delivery charges</b><br>• Within 7 km: <b>FREE</b> 🎉<br>• 7–10 km: ₹50<br>• 10–15 km: ₹80<br>• 15–20 km: ₹120<br>• 20–25 km: ₹150<br>• Over 25 km: message us on WhatsApp<br><br>The exact charge is calculated when you pin your location on the order page.',
      links: [{ label: '🎂 Order now', href: 'cakes.html' }] },

    { id: 'pickup',
      keys: ['pickup', 'pick up', 'self pickup', 'collect', 'takeaway', 'take away', 'come and get', 'visit'],
      answer: '🏪 Yes, <b>self pickup</b> is available, with no delivery charge! Choose "Self Pickup" on the order page. We are a homemade cloud kitchen in Trichy, so please order in advance and we\'ll have it ready.',
      links: [{ label: '📍 Get directions', href: MAP_LINK }] },

    { id: 'location',
      keys: ['where', 'location', 'address', 'located', 'enga', 'engae', 'irukeenga', 'map', 'direction', 'directions', 'shop', 'store', 'near me', 'branch'],
      answer: '📍 We are a homemade cloud kitchen in <b>Tiruchirappalli (Trichy)</b>, Tamil Nadu. Tap below for directions on Google Maps.',
      links: [{ label: '📍 Open in Google Maps', href: MAP_LINK }] },

    { id: 'timing',
      keys: ['timing', 'timings', 'time', 'open', 'opening', 'close', 'closing', 'hours', 'working hours', 'sunday', 'holiday', 'neram', 'eppo', 'when are you'],
      answer: '🕘 We are open <b>every day, 9 AM – 9 PM</b> (Sundays too!).' },

    { id: 'payment',
      keys: ['pay', 'payment', 'upi', 'gpay', 'google pay', 'phonepe', 'paytm', 'cash', 'cod', 'cash on delivery', 'bank', 'card', 'advance payment', 'online payment'],
      answer: '💳 We accept <b>UPI</b> (GPay, PhonePe, Paytm), bank transfer, and cash on delivery in select areas.<br>For custom / wedding cakes, a <b>50% advance</b> is needed at booking.' },

    { id: 'custom',
      keys: ['custom', 'customise', 'customize', 'customized', 'design', 'own design', 'photo cake', 'photo', 'theme', 'character', 'personalised', 'personalized', 'name on cake', 'message on cake', 'fondant', 'tier', 'tiered', 'cartoon'],
      answer: '🎨 Yes, we make <b>custom cakes</b>: themes, cartoon characters, fondant designs, tiered cakes, names & messages. Use our cake designer to tell us your idea and get a quote, or send a reference photo on WhatsApp.',
      links: [{ label: '🎨 Design your cake', href: 'customize.html' }, { label: '💬 Send photo on WhatsApp', href: wa('Hi ToonCakes! I need a custom cake. Here is my reference design:') }] },

    { id: 'occasion',
      keys: ['birthday', 'wedding', 'anniversary', 'kids', 'baby', 'half saree', 'puberty', 'engagement', 'valentine', 'christmas', 'diwali', 'party'],
      answer: '🎉 We have cakes for every occasion: birthdays, kids\' themes, anniversaries, weddings, half saree / puberty functions and more!',
      links: [{ label: '🎂 Browse cakes', href: 'cakes.html' }, { label: '🎨 Custom cake', href: 'customize.html' }] },

    { id: 'bulk',
      keys: ['bulk', 'bulk order', 'corporate', 'office', 'event', 'function', 'wholesale', 'large order', 'return gift', 'school', 'college', 'many cakes', 'catering'],
      answer: '📦 Yes, we take <b>bulk orders</b> for offices, events, functions, schools and return gifts. Send us your requirement and we\'ll give you the best price.',
      links: [{ label: '📦 Bulk order form', href: 'bulk-order.html' }, { label: '💬 Chat on WhatsApp', href: wa('Hi ToonCakes! I need a bulk order for an event.') }] },

    { id: 'classes',
      keys: ['class', 'classes', 'course', 'courses', 'learn', 'learning', 'workshop', 'training', 'teach', 'baking class', 'certificate', 'kathukka', 'students'],
      answer: '👩‍🍳 We run <b>eggless baking classes</b> in Trichy and online, from <b>free</b> beginner sessions to full courses (cake decoration, one-day workshop, and a cake business course). Most paid courses include a certificate.',
      links: [{ label: '👩‍🍳 See all classes', href: 'classes.html' }] },

    { id: 'recipes',
      keys: ['recipe', 'recipes', 'pdf', 'ebook', 'e-book', 'free recipe'],
      answer: '📖 We have <b>eggless recipe PDFs</b>, both free and premium, and you don\'t need to join a class. We send the PDF straight to your WhatsApp (9 AM–9 PM).',
      links: [{ label: '📖 Get recipes', href: 'recipes.html' }] },

    { id: 'review',
      keys: ['review', 'reviews', 'feedback', 'rating', 'coupon', 'discount', 'offer', 'offers', 'promo', 'code'],
      answer: '⭐ Loved your cake? Leave us a review and we\'ll thank you with a <b>10% discount coupon</b> on your next order!',
      links: [{ label: '⭐ Write a review', href: 'review.html' }] },

    { id: 'account',
      keys: ['account', 'login', 'log in', 'sign in', 'signup', 'sign up', 'register', 'my order', 'my orders', 'track', 'tracking', 'order status', 'status', 'where is my order'],
      answer: '👤 Log in to <b>My Account</b> to see your orders and their status. For anything urgent about an order, call or WhatsApp us.',
      links: [{ label: '👤 My Account', href: 'user-dashboard.html' }, { label: '📞 Call us', href: 'tel:' + PHONE_TEL }] },

    { id: 'fresh',
      keys: ['fresh', 'preservative', 'preservatives', 'ingredients', 'homemade', 'quality', 'hygiene', 'healthy', 'shelf life', 'how long', 'fridge', 'refrigerate', 'keep'],
      answer: '🌿 Every cake is <b>baked fresh for your order</b>, with no preservatives. Cream cakes are best eaten within 24 hours; keep them refrigerated and take them out 15–20 minutes before cutting.' },

    { id: 'cancel',
      keys: ['!cancel', '!cancellation', '!refund', 'change order', 'modify', 'reschedule', 'complaint', 'problem', 'issue', 'damaged', 'wrong'],
      answer: 'Sorry to hear that 🙏 For cancellations, changes or any issue with an order, please contact us directly so we can sort it out quickly.',
      links: [{ label: '💬 WhatsApp us', href: wa('Hi ToonCakes! I need help with my order.') }, { label: '📞 Call us', href: 'tel:' + PHONE_TEL }] },

    { id: 'contact',
      keys: ['contact', 'phone', 'number', 'mobile', 'call', 'whatsapp', 'email', 'mail', 'talk', 'human', 'person', 'staff', 'owner', 'instagram', 'insta'],
      answer: '📞 Phone / WhatsApp: <b>' + PHONE_DISPLAY + '</b><br>✉️ tooncakestrichy@gmail.com<br>📸 Instagram: @tooncakestrichy',
      links: [{ label: '📞 Call', href: 'tel:' + PHONE_TEL }, { label: '💬 WhatsApp', href: wa() }, { label: '📸 Instagram', href: INSTAGRAM }] }
  ];

  var QUICK = [
    { label: '💰 Prices',        ask: 'price' },
    { label: '🚚 Delivery',      ask: 'delivery' },
    { label: '🕘 Timings',       ask: 'timings' },
    { label: '🛒 How to order',  ask: 'how to order' },
    { label: '🥚 Eggless?',      ask: 'is it eggless' },
    { label: '🎨 Custom cake',   ask: 'custom cake' },
    { label: '👩‍🍳 Classes',       ask: 'classes' }
  ];

  var GREETING = /^(hi+|hello+|hey+|hii+|helo|vanakkam|good (morning|afternoon|evening)|namaste|yo)\b/;
  var THANKS   = /\b(thanks?|thank you|thx|tq|ty|nandri|super|great|ok(ay)?|cool|nice)\b/;
  var BYE      = /\b(bye|goodbye|see you|tata)\b/;

  // ── Text helpers ──────────────────────────────────────────────
  var STOP = ' a an the is are am do does did can could i you we me my your our it its of in on for to and or with at by from be have has what which this that cake cakes please pls tell know about any some want need give ';

  function norm(s) {
    return ' ' + String(s || '').toLowerCase()
      .replace(/₹/g, ' rs ')
      .replace(/[^a-z0-9஀-௿\s]/g, ' ')
      .replace(/\s+/g, ' ').trim() + ' ';
  }
  // Plural → singular, so "classes"/"class", "brownies"/"brownie", "timings"/"timing" match
  function stem(w) {
    if (w.length <= 3 || /ss$/.test(w)) return w;
    if (/(sses|ches|shes|xes)$/.test(w)) return w.slice(0, -2);
    return w.replace(/s$/, '');
  }
  function words(s) {
    return norm(s).trim().split(' ').filter(function (w) { return w && STOP.indexOf(' ' + w + ' ') === -1; });
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }

  // Score a topic: phrases score 2, single words 1 (also matches simple plurals).
  // A key starting with "!" is a strong word worth 3 (e.g. "!refund" beats "my order").
  function scoreTopic(text, stems, topic) {
    var score = 0;
    topic.keys.forEach(function (k) {
      var bonus = k.charAt(0) === '!' ? 2 : 0;
      if (bonus) k = k.slice(1);
      if (k.indexOf(' ') !== -1) { if (text.indexOf(' ' + k + ' ') !== -1) score += 2 + bonus; }
      else if (text.indexOf(' ' + k + ' ') !== -1 || stems[stem(k)]) score += 1 + bonus;
    });
    return score;
  }

  // ── Menu lookup (prices from the Menu Manager / seed data) ──
  function readList(key) {
    try {
      var v = JSON.parse(localStorage.getItem(key) || 'null');
      if (Array.isArray(v) && v.length) return v;
    } catch (e) {}
    return (window.TC_SEED && window.TC_SEED[key]) || [];
  }
  function menuItems() {
    var out = [];
    [['tc_menu_cakes', 'cake', 'cakes.html'], ['tc_menu_desserts', 'dessert', 'desserts.html'], ['tc_menu_classes', 'class', 'classes.html']]
      .forEach(function (src) {
        readList(src[0]).forEach(function (it) {
          if (!it || it.active === false || !it.name) return;
          out.push({ name: it.name, price: it.price, desc: it.desc || '', category: it.category || (src[1] === 'class' ? 'class course workshop' : ''), duration: it.duration, kind: src[1], page: src[2] });
        });
      });
    return out;
  }
  function priceText(it) {
    if (it.kind === 'cake')  return 'from <b>₹' + Number(it.price).toLocaleString('en-IN') + '/kg</b>';
    if (it.kind === 'class') return (Number(it.price) === 0 ? '<b>FREE</b>' : '<b>₹' + Number(it.price).toLocaleString('en-IN') + '</b>') + (it.duration ? ' · ' + esc(it.duration) : '');
    return '<b>' + esc(it.price) + '</b>';
  }
  var GENERIC = ' classic special cake fresh new style course full live demo day the with and shape eggless baking ';
  function findItems(q) {
    var qs = {};
    words(q).forEach(function (w) { qs[stem(w)] = true; });
    var scored = [];
    menuItems().forEach(function (it) {
      var catWords  = words(it.category).map(stem);
      // Words that just repeat the category ("Classic Chocolate Birthday" → birthday) count as a category hit, not a name hit
      var nameWords = words(it.name.replace(/[—–-]/g, ' ')).filter(function (w) {
        return GENERIC.indexOf(' ' + w + ' ') === -1 && catWords.indexOf(stem(w)) === -1;
      });
      var hit = 0;
      nameWords.forEach(function (w) { if (qs[stem(w)]) hit++; });
      var catHit = catWords.some(function (w) { return qs[w]; });
      var score = (hit ? hit * 10 + (hit === nameWords.length ? 5 : 0) : 0) + (catHit ? 12 : 0);
      if (score) scored.push({ it: it, score: score, named: hit > 0 });
    });
    scored.sort(function (a, b) { return b.score - a.score; });
    if (!scored.length) return { items: [], named: false };
    var best = scored[0].score;
    return {
      items: scored.filter(function (s) { return s.score >= best - 5; }).slice(0, 5).map(function (s) { return s.it; }),
      named: scored[0].named   // matched an actual item name, not just a category
    };
  }

  // Extra Q&A the owner added in Index Manager → FAQ (same browser only)
  function adminFaq(q) {
    var list;
    try { list = JSON.parse(localStorage.getItem('tc_faq') || 'null'); } catch (e) {}
    if (!Array.isArray(list)) return null;
    var qs = {};
    words(q).forEach(function (w) { qs[stem(w)] = true; });
    var best = null, bestScore = 1;
    list.forEach(function (f) {
      var hit = 0;
      words(f.q).forEach(function (w) { if (qs[stem(w)]) hit++; });
      if (hit > bestScore) { best = f; bestScore = hit; }
    });
    return best;
  }

  // ── Brain ─────────────────────────────────────────────────────
  function reply(q) {
    var text = norm(q);
    var stems = {};
    words(q).forEach(function (w) { stems[stem(w)] = true; });
    var plain = text.trim();

    if (!plain) return { html: 'Please type your question 🙂' };
    if (GREETING.test(plain) && plain.split(' ').length <= 3)
      return { html: 'Hi there! 👋 How can I help you today?', chips: true };
    if (BYE.test(plain))
      return { html: 'Bye! 🎂 Have a sweet day. Message us anytime!' };

    var ranked = TOPICS.map(function (t) { return { t: t, s: scoreTopic(text, stems, t) }; })
      .filter(function (x) { return x.s > 0; })
      .sort(function (a, b) { return b.s - a.s; });
    var found = findItems(q), items = found.items;
    var askingPrice = ranked.some(function (x) { return x.t.id === 'price'; });

    // Product mentioned → show its price ("red velvet price", "is red velvet eggless", "brownie", "classes fees")
    var showItems = items.length && (found.named
      ? (askingPrice || !ranked.length || ranked[0].t.id === 'occasion' || ranked[0].s <= 1)
      : (askingPrice || !ranked.length));
    if (showItems) {
      var html = (items.length === 1 ? 'Here you go 😊' : 'Here\'s what I found 😊') + '<br>' +
        items.map(function (it) {
          return '• <b>' + esc(it.name) + '</b>: ' + priceText(it);
        }).join('<br>');
      if (items.some(function (it) { return it.kind !== 'class'; })) html += '<br><br><small>All 100% eggless 🥚🚫</small>';
      var pages = {};
      items.forEach(function (it) { pages[it.page] = true; });
      var links = Object.keys(pages).map(function (p) {
        return { label: p === 'cakes.html' ? '🎂 Order a cake' : p === 'desserts.html' ? '🍫 See desserts' : '👩‍🍳 See classes', href: p };
      });
      return { html: html, links: links };
    }

    if (ranked.length) {
      var top = ranked[0].t;
      var res = { html: top.answer, links: top.links };
      // A second clearly-matched topic (e.g. "delivery timings and price") → answer both
      if (ranked[1] && (ranked[1].s === ranked[0].s || text.indexOf(' and ') !== -1 || (ranked[1].s >= 2 && ranked[1].s >= ranked[0].s - 1))) {
        res.html += '<hr>' + ranked[1].t.answer;
        res.links = (top.links || []).concat(ranked[1].t.links || []);
      }
      return res;
    }

    var f = adminFaq(q);
    if (f) return { html: esc(f.q) + '<br>' + f.a };

    if (THANKS.test(plain)) return { html: 'You\'re welcome! 😊 Anything else I can help with?' };

    return {
      html: 'Sorry, I\'m not sure about that 🙈 Our team will be happy to help on WhatsApp. Tap below and your question will be sent to them.',
      links: [{ label: '💬 Ask on WhatsApp', href: wa('Hi ToonCakes! ' + q) }, { label: '📞 Call us', href: 'tel:' + PHONE_TEL }],
      chips: true
    };
  }

  // ── UI ────────────────────────────────────────────────────────
  var STORE = 'tc_chat_history';
  var history = [];
  try { history = JSON.parse(sessionStorage.getItem(STORE) || '[]') || []; } catch (e) { history = []; }
  function save() { try { sessionStorage.setItem(STORE, JSON.stringify(history.slice(-40))); } catch (e) {} }

  function addStyles() {
    var css =
      '.tcb-btn{position:fixed;right:30px;bottom:104px;z-index:9998;width:60px;height:60px;border-radius:50%;border:none;cursor:pointer;' +
        'background:linear-gradient(135deg,#E8356D,#B5174C);color:#fff;font-size:28px;box-shadow:0 8px 28px rgba(232,53,109,.45);' +
        'display:flex;align-items:center;justify-content:center;transition:transform .2s;}' +
      '.tcb-btn:hover{transform:scale(1.1);}' +
      '.tcb-tip{position:fixed;right:100px;bottom:116px;z-index:9998;background:#fff;color:#2C1019;font:500 13px Poppins,sans-serif;' +
        'padding:9px 14px;border-radius:14px 14px 4px 14px;box-shadow:0 6px 24px rgba(0,0,0,.15);cursor:pointer;animation:tcbIn .3s ease;}' +
      '.tcb-panel{position:fixed;right:30px;bottom:104px;z-index:10000;width:370px;height:min(560px,calc(100vh - 140px));background:#FFF9F5;' +
        'border-radius:20px;box-shadow:0 18px 60px rgba(44,16,25,.3);display:none;flex-direction:column;overflow:hidden;font-family:Poppins,sans-serif;animation:tcbIn .25s ease;}' +
      '.tcb-panel.open{display:flex;}' +
      '@keyframes tcbIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}' +
      '.tcb-head{background:linear-gradient(135deg,#E8356D,#B5174C);color:#fff;padding:14px 16px;display:flex;align-items:center;gap:12px;}' +
      '.tcb-ava{width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;}' +
      '.tcb-title{font-family:"Playfair Display",serif;font-weight:700;font-size:16px;line-height:1.2;}' +
      '.tcb-sub{font-size:11.5px;opacity:.85;}' +
      '.tcb-x{margin-left:auto;background:rgba(255,255,255,.18);border:none;color:#fff;width:32px;height:32px;border-radius:50%;font-size:16px;cursor:pointer;}' +
      '.tcb-body{flex:1;overflow-y:auto;padding:16px 14px;display:flex;flex-direction:column;gap:10px;}' +
      '.tcb-msg{max-width:85%;padding:10px 14px;border-radius:16px;font-size:13.5px;line-height:1.55;word-wrap:break-word;}' +
      '.tcb-bot{background:#fff;color:#2C1019;border-bottom-left-radius:4px;align-self:flex-start;box-shadow:0 2px 8px rgba(44,16,25,.06);}' +
      '.tcb-bot hr{border:none;border-top:1px dashed #F3C6D5;margin:10px 0;}' +
      '.tcb-bot small{color:#7A5060;}' +
      '.tcb-user{background:#E8356D;color:#fff;border-bottom-right-radius:4px;align-self:flex-end;}' +
      '.tcb-links{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;}' +
      '.tcb-links a{display:inline-block;padding:6px 12px;border-radius:50px;background:#FDE7EF;color:#B5174C;font-size:12.5px;font-weight:600;text-decoration:none;}' +
      '.tcb-links a:hover{background:#E8356D;color:#fff;}' +
      '.tcb-chips{display:flex;flex-wrap:wrap;gap:6px;align-self:flex-start;}' +
      '.tcb-chips button{border:1.5px solid #E8356D;background:#fff;color:#E8356D;border-radius:50px;padding:6px 12px;font:600 12.5px Poppins,sans-serif;cursor:pointer;}' +
      '.tcb-chips button:hover{background:#E8356D;color:#fff;}' +
      '.tcb-typing{align-self:flex-start;background:#fff;padding:12px 16px;border-radius:16px;border-bottom-left-radius:4px;}' +
      '.tcb-typing span{display:inline-block;width:7px;height:7px;margin:0 2px;border-radius:50%;background:#E8356D;opacity:.4;animation:tcbDot 1s infinite;}' +
      '.tcb-typing span:nth-child(2){animation-delay:.15s}.tcb-typing span:nth-child(3){animation-delay:.3s}' +
      '@keyframes tcbDot{0%,100%{opacity:.3;transform:none}50%{opacity:1;transform:translateY(-3px)}}' +
      '.tcb-form{display:flex;gap:8px;padding:10px 12px;background:#fff;border-top:1px solid #F7EDE5;}' +
      '.tcb-form input{flex:1;min-width:0;border:2px solid #F7EDE5;border-radius:50px;padding:10px 16px;font:14px Poppins,sans-serif;outline:none;background:#FFF9F5;}' +
      '.tcb-form input:focus{border-color:#E8356D;}' +
      '.tcb-form button{width:44px;height:44px;flex-shrink:0;border:none;border-radius:50%;background:#E8356D;color:#fff;font-size:18px;cursor:pointer;}' +
      '.tcb-foot{text-align:center;font-size:10.5px;color:#9A7A86;padding:0 0 8px;background:#fff;}' +
      '@media(max-width:480px){' +
        '.tcb-panel{right:8px;left:8px;bottom:8px;width:auto;height:calc(100% - 16px);max-height:none;}' +
        '.tcb-btn{right:20px;bottom:96px;width:54px;height:54px;font-size:25px;}' +
        '.tcb-tip{right:84px;bottom:104px;}' +
      '}';
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);
  }

  var panel, body, input, btn;

  function scrollDown() { body.scrollTop = body.scrollHeight; }

  function renderMsg(m) {
    var el = document.createElement('div');
    el.className = 'tcb-msg ' + (m.from === 'user' ? 'tcb-user' : 'tcb-bot');
    if (m.from === 'user') el.textContent = m.text;
    else {
      el.innerHTML = m.html;
      if (m.links && m.links.length) {
        var box = document.createElement('div');
        box.className = 'tcb-links';
        m.links.forEach(function (l) {
          var a = document.createElement('a');
          a.href = l.href;
          a.textContent = l.label;
          if (/^https?:/.test(l.href)) { a.target = '_blank'; a.rel = 'noopener'; }
          box.appendChild(a);
        });
        el.appendChild(box);
      }
    }
    body.appendChild(el);
  }

  function renderChips() {
    var old = body.querySelector('.tcb-chips');
    if (old) old.remove();
    var box = document.createElement('div');
    box.className = 'tcb-chips';
    QUICK.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = c.label;
      b.addEventListener('click', function () { ask(c.ask, c.label.replace(/^\S+\s/, '')); });
      box.appendChild(b);
    });
    body.appendChild(box);
  }

  function push(m) { history.push(m); save(); renderMsg(m); }

  function ask(q, shown) {
    q = String(q || '').trim();
    if (!q) return;
    var chips = body.querySelector('.tcb-chips');
    if (chips) chips.remove();
    push({ from: 'user', text: shown || q });
    var typing = document.createElement('div');
    typing.className = 'tcb-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    body.appendChild(typing);
    scrollDown();
    setTimeout(function () {
      typing.remove();
      var r = reply(q);
      push({ from: 'bot', html: r.html, links: r.links });
      if (r.chips) renderChips();
      scrollDown();
    }, 450 + Math.min(600, q.length * 12));
  }

  // Home page doesn't load the menu data; fetch it once so price lookups work everywhere
  function ensureMenuData() {
    if (window.TC_SEED || localStorage.getItem('tc_menu_cakes')) return;
    var s = document.createElement('script');
    s.src = 'seed-data.js';
    document.body.appendChild(s);
  }

  function open() {
    try { ensureMenuData(); } catch (e) {}
    var tip = document.querySelector('.tcb-tip');
    if (tip) tip.remove();
    panel.classList.add('open');
    btn.style.display = 'none';
    if (!history.length) {
      push({ from: 'bot', html: 'Hi! 👋 I\'m the <b>ToonCakes assistant</b>.<br>Ask me about prices, delivery, timings, custom cakes, classes… or tap a topic below.' });
      renderChips();
    }
    scrollDown();
    if (window.innerWidth > 480) input.focus();
  }
  function close() {
    panel.classList.remove('open');
    btn.style.display = '';
  }

  function build() {
    addStyles();

    btn = document.createElement('button');
    btn.className = 'tcb-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Chat with ToonCakes assistant');
    btn.title = 'Ask us anything';
    btn.textContent = '🧁';
    btn.addEventListener('click', open);

    panel = document.createElement('div');
    panel.className = 'tcb-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'ToonCakes chat assistant');
    panel.innerHTML =
      '<div class="tcb-head">' +
        '<div class="tcb-ava">🧁</div>' +
        '<div><div class="tcb-title">ToonCakes Assistant</div><div class="tcb-sub">● Online · instant answers</div></div>' +
        '<button type="button" class="tcb-x" aria-label="Close chat">✕</button>' +
      '</div>' +
      '<div class="tcb-body" aria-live="polite"></div>' +
      '<form class="tcb-form" autocomplete="off">' +
        '<input type="text" placeholder="Type your question…" aria-label="Your question" maxlength="300" />' +
        '<button type="submit" aria-label="Send">➤</button>' +
      '</form>' +
      '<div class="tcb-foot">Automatic answers · for anything else, WhatsApp ' + PHONE_DISPLAY + '</div>';

    body  = panel.querySelector('.tcb-body');
    input = panel.querySelector('input');
    panel.querySelector('.tcb-x').addEventListener('click', close);
    panel.querySelector('form').addEventListener('submit', function (e) {
      e.preventDefault();
      var q = input.value;
      input.value = '';
      ask(q);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('open')) close();
    });

    document.body.appendChild(btn);
    document.body.appendChild(panel);

    history.forEach(renderMsg);
    if (history.length) renderChips();

    // One friendly nudge per visit
    var nudged = false;
    try { nudged = !!sessionStorage.getItem('tc_chat_nudged'); } catch (e) {}
    if (!nudged && !history.length) {
      setTimeout(function () {
        if (panel.classList.contains('open')) return;
        var tip = document.createElement('div');
        tip.className = 'tcb-tip';
        tip.textContent = 'Hi! Have a question? Ask me 🎂';
        tip.addEventListener('click', open);
        document.body.appendChild(tip);
        try { sessionStorage.setItem('tc_chat_nudged', '1'); } catch (e) {}
        setTimeout(function () { if (tip.parentNode) tip.remove(); }, 8000);
      }, 5000);
    }
  }

  // Exposed for testing in the browser console: TCChat.reply('red velvet price')
  window.TCChat = { reply: reply, open: open };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
