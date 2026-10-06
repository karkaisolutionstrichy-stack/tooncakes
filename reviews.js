/* ================================================================
   ToonCakes — Reviews Engine  (reviews.js)
   Shared by classes.html and recipes.html.
   All state lives in localStorage key "tc_reviews".
================================================================ */
(function (W) {
  'use strict';

  var KEY = 'tc_reviews';

  /* ────────────────────────────────────────────────────────────
     Storage primitives
  ──────────────────────────────────────────────────────────── */
  function _get()     { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  function _save(arr) { localStorage.setItem(KEY, JSON.stringify(arr)); }

  function _session() {
    try {
      var s = JSON.parse(localStorage.getItem('tc_user_session') || 'null');
      return (s && Date.now() < s.exp) ? s : null;
    } catch (e) { return null; }
  }

  /* ────────────────────────────────────────────────────────────
     Public query helpers
  ──────────────────────────────────────────────────────────── */
  W.tcItemReviews = function (type, itemId) {
    return _get().filter(function (r) { return r.type === type && r.itemId === itemId; });
  };

  W.tcRatingSummary = function (type, itemId) {
    var rs = W.tcItemReviews(type, itemId);
    if (!rs.length) return { avg: 0, count: 0, bd: [0, 0, 0, 0, 0] };
    var bd = [0, 0, 0, 0, 0], total = 0;
    rs.forEach(function (r) { total += r.rating; bd[r.rating - 1]++; });
    return { avg: +(total / rs.length).toFixed(1), count: rs.length, bd: bd };
  };

  W.tcMyEmail = function () {
    var s = _session(); return s ? s.email : null;
  };

  W.tcMyName = function () {
    var email = W.tcMyEmail();
    if (!email) return 'User';
    try {
      var users = JSON.parse(localStorage.getItem('tc_users') || '[]');
      var u = users.find(function (x) { return x.email === email; });
      return (u && u.name) ? u.name : 'User';
    } catch (e) { return 'User'; }
  };

  W.tcMyReview = function (type, itemId) {
    var email = W.tcMyEmail();
    if (!email) return null;
    return _get().find(function (r) {
      return r.type === type && r.itemId === itemId && r.userId === email;
    }) || null;
  };

  /* ────────────────────────────────────────────────────────────
     Write / update a review
  ──────────────────────────────────────────────────────────── */
  W.tcSubmitReview = function (type, itemId, rating, comment) {
    var email = W.tcMyEmail();
    if (!email) { alert('Please log in to leave a review.'); return false; }
    var name     = W.tcMyName();
    var initials = name.split(' ').filter(Boolean).map(function (w) { return w[0].toUpperCase(); }).join('').slice(0, 2) || 'U';
    var all = _get();
    var idx = all.findIndex(function (r) { return r.type === type && r.itemId === itemId && r.userId === email; });
    var rev = {
      id:           idx >= 0 ? all[idx].id : ('RV' + Date.now()),
      type:         type,
      itemId:       itemId,
      userId:       email,
      userName:     name,
      userInitials: initials,
      rating:       +rating,
      comment:      String(comment || '').trim(),
      date:         new Date().toISOString(),
      helpfulBy:    idx >= 0 ? (all[idx].helpfulBy    || []) : [],
      notHelpfulBy: idx >= 0 ? (all[idx].notHelpfulBy || []) : [],
    };
    if (idx >= 0) all[idx] = rev; else all.push(rev);
    _save(all);
    return true;
  };

  /* ────────────────────────────────────────────────────────────
     Helpful / report
  ──────────────────────────────────────────────────────────── */
  W.tcMarkHelpful = function (reviewId, helpful) {
    var email = W.tcMyEmail(); if (!email) return;
    var all = _get();
    var r   = all.find(function (x) { return x.id === reviewId; }); if (!r) return;
    r.helpfulBy    = r.helpfulBy    || [];
    r.notHelpfulBy = r.notHelpfulBy || [];
    if (helpful) {
      if (!r.helpfulBy.includes(email))    r.helpfulBy.push(email);
      r.notHelpfulBy = r.notHelpfulBy.filter(function (e) { return e !== email; });
    } else {
      if (!r.notHelpfulBy.includes(email)) r.notHelpfulBy.push(email);
      r.helpfulBy = r.helpfulBy.filter(function (e) { return e !== email; });
    }
    _save(all);
  };

  W.tcReportRev = function (reviewId) {
    var all = _get();
    var r   = all.find(function (x) { return x.id === reviewId; }); if (!r) return;
    r.reported = (r.reported || 0) + 1;
    _save(all);
    alert('Thank you — this review has been flagged for our team to review.');
  };

  /* ────────────────────────────────────────────────────────────
     UI helpers
  ──────────────────────────────────────────────────────────── */
  W.tcStarsHtml = function (rating, size, emptyColor) {
    var sz  = size       || 14;
    var off = emptyColor || '#D1D5DB';
    var h   = '';
    for (var i = 1; i <= 5; i++) {
      var full = i <= Math.round(rating);
      h += '<span style="color:' + (full ? '#F59E0B' : off) + ';font-size:' + sz + 'px;line-height:1;">' + (full ? '★' : '☆') + '</span>';
    }
    return h;
  };

  W.tcTimeAgo = function (dateStr) {
    var diff  = Date.now() - new Date(dateStr).getTime();
    var mins  = Math.floor(diff / 60000);
    var hours = Math.floor(diff / 3600000);
    var days  = Math.floor(diff / 86400000);
    var weeks = Math.floor(days / 7);
    var mons  = Math.floor(days / 30);
    if (mins  <  60) return mins  + ' min'   + (mins  !== 1 ? 's' : '') + ' ago';
    if (hours <  24) return hours + ' hour'  + (hours !== 1 ? 's' : '') + ' ago';
    if (days  <   7) return days  + ' day'   + (days  !== 1 ? 's' : '') + ' ago';
    if (weeks <   5) return weeks + ' week'  + (weeks !== 1 ? 's' : '') + ' ago';
    return                   mons + ' month' + (mons  !== 1 ? 's' : '') + ' ago';
  };

  /* safe ID: strip special chars so it works as element ID */
  W.tcSafeId = function (itemId) {
    return String(itemId).replace(/[^a-zA-Z0-9_]/g, '_');
  };

  /* ────────────────────────────────────────────────────────────
     Review list renderer (used for both initial render + filter)
  ──────────────────────────────────────────────────────────── */
  W.tcRenderRevList = function (reviews, type, itemId) {
    var email = W.tcMyEmail();
    if (!reviews.length) {
      return '<div style="text-align:center;padding:28px;color:#6B7280;font-size:14px;">No reviews match — try adjusting the filter.</div>';
    }
    var sorted = reviews.slice().sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
    return sorted.map(function (r, i) {
      var hCount = (r.helpfulBy    || []).length;
      var myUp   = !!(email && (r.helpfulBy    || []).includes(email));
      var myDn   = !!(email && (r.notHelpfulBy || []).includes(email));
      var border = i < sorted.length - 1 ? 'border-bottom:1.5px solid #F3F4F6;' : '';
      var safeRId = String(r.id).replace(/[^a-zA-Z0-9_]/g, '_');
      return (
        '<div style="padding:20px 0;' + border + '">' +
          '<div style="display:flex;align-items:flex-start;gap:12px;">' +
            '<div style="width:40px;height:40px;border-radius:50%;background:#1c1d1f;color:white;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;flex-shrink:0;">' + (r.userInitials || 'U') + '</div>' +
            '<div style="flex:1;">' +
              '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:5px;">' +
                '<span style="font-size:14px;font-weight:700;color:#111;">' + r.userName + '</span>' +
                '<span style="display:flex;gap:1px;">' + W.tcStarsHtml(r.rating, 13) + '</span>' +
                '<span style="font-size:12px;color:#9CA3AF;">' + W.tcTimeAgo(r.date) + '</span>' +
              '</div>' +
              (r.comment ? '<p style="font-size:14px;color:#374151;margin:0 0 10px;line-height:1.55;">' + r.comment.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</p>' : '') +
              '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">' +
                '<span style="font-size:12px;color:#6B7280;">Was this review helpful?</span>' +
                '<button onclick="tcMarkHelpful(\'' + r.id + '\',true);tcRefreshRevList(\'' + type + '\',\'' + itemId + '\')" ' +
                  'style="background:' + (myUp ? '#EDE9FE' : 'transparent') + ';border:1.5px solid #D1D5DB;border-radius:50px;width:34px;height:34px;cursor:pointer;font-size:14px;display:inline-flex;align-items:center;justify-content:center;" title="Helpful">👍</button>' +
                (hCount > 0 ? '<span style="font-size:12px;color:#6B7280;">' + hCount + '</span>' : '') +
                '<button onclick="tcMarkHelpful(\'' + r.id + '\',false);tcRefreshRevList(\'' + type + '\',\'' + itemId + '\')" ' +
                  'style="background:' + (myDn ? '#FEE2E2' : 'transparent') + ';border:1.5px solid #D1D5DB;border-radius:50px;width:34px;height:34px;cursor:pointer;font-size:14px;display:inline-flex;align-items:center;justify-content:center;" title="Not helpful">👎</button>' +
                '<button onclick="if(confirm(\'Report this review as inappropriate?\'))' +
                  '{tcReportRev(\'' + r.id + '\');this.textContent=\'Reported ✓\';this.disabled=true;this.style.color=\'#EF4444\';}" ' +
                  'style="background:transparent;border:none;font-size:12px;color:#9CA3AF;cursor:pointer;padding:0;text-decoration:underline;">Report</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');
  };

  /* ────────────────────────────────────────────────────────────
     Full section builder — returns complete HTML string
  ──────────────────────────────────────────────────────────── */
  W.tcBuildReviewSection = function (type, itemId, canReview) {
    var summary  = W.tcRatingSummary(type, itemId);
    var avg      = summary.avg;
    var count    = summary.count;
    var bd       = summary.bd;
    var reviews  = W.tcItemReviews(type, itemId);
    var myRev    = W.tcMyReview(type, itemId);
    var label    = type === 'class' ? 'Course Rating' : 'Recipe Rating';
    var safeId   = W.tcSafeId(itemId);
    var h        = '';

    h += '<div id="tcRevWrap_' + safeId + '" style="border-top:1.5px solid #E5E7EB;padding-top:28px;margin-top:4px;">';

    /* ── Write / edit review form ── */
    if (canReview) {
      var sel = myRev ? myRev.rating  : 0;
      var txt = myRev ? myRev.comment : '';
      var stars28 = [1,2,3,4,5].map(function (i) {
        return (
          '<span data-val="' + i + '" ' +
            'onmouseover="tcHoverStar(\'' + safeId + '\',' + i + ')" ' +
            'onmouseout="tcResetStar(\'' + safeId + '\')" ' +
            'onclick="tcPickStar(\'' + safeId + '\',' + i + ')" ' +
            'style="font-size:30px;color:' + (i <= sel ? '#F59E0B' : '#D1D5DB') + ';cursor:pointer;line-height:1;">★</span>'
        );
      }).join('');

      h += (
        '<div style="background:white;border-radius:12px;border:1.5px solid #E5E7EB;padding:24px;margin-bottom:28px;">' +
          '<h3 style="font-family:\'Playfair Display\',serif;font-size:17px;color:#111;margin:0 0 16px;">' +
            (myRev ? '✏️ Edit Your Review' : '✍️ Write a Review') +
          '</h3>' +
          '<div style="margin-bottom:12px;">' +
            '<div style="font-size:13px;font-weight:600;color:#374151;margin-bottom:8px;">Your Rating *</div>' +
            '<div id="tcSP_' + safeId + '" style="display:flex;gap:4px;" data-rating="' + sel + '">' + stars28 + '</div>' +
          '</div>' +
          '<textarea id="tcRT_' + safeId + '" rows="3" ' +
            'style="width:100%;border:1.5px solid #D1D5DB;border-radius:8px;padding:10px 14px;font-size:14px;font-family:inherit;resize:vertical;box-sizing:border-box;outline:none;margin-bottom:14px;" ' +
            'placeholder="Share what you liked, what you learned, tips for others…">' + txt + '</textarea>' +
          '<button onclick="tcDoSubmit(\'' + type + '\',\'' + itemId + '\',' + canReview + ')" ' +
            'style="background:#6A1545;color:white;border:none;border-radius:8px;padding:11px 24px;font-size:14px;font-weight:700;cursor:pointer;">' +
            (myRev ? '✅ Update Review' : '📤 Submit Review') +
          '</button>' +
        '</div>'
      );
    }

    /* ── Student Feedback summary ── */
    if (count > 0) {
      var pct = bd.map(function (n) { return Math.round(n / count * 100); });
      var bars = [5,4,3,2,1].map(function (star) {
        var p = pct[star - 1];
        return (
          '<div style="display:flex;align-items:center;gap:10px;">' +
            '<div style="flex:1;background:#F3F4F6;border-radius:4px;height:8px;overflow:hidden;">' +
              '<div style="height:100%;background:#F59E0B;width:' + p + '%;border-radius:4px;"></div>' +
            '</div>' +
            '<div style="display:flex;gap:1px;width:74px;">' + W.tcStarsHtml(star, 11) + '</div>' +
            '<span style="font-size:12px;color:#6B7280;min-width:30px;text-align:right;">' + p + '%</span>' +
          '</div>'
        );
      }).join('');

      h += (
        '<div style="background:white;border-radius:12px;border:1.5px solid #E5E7EB;padding:24px;margin-bottom:24px;">' +
          '<h3 style="font-family:\'Playfair Display\',serif;font-size:17px;color:#111;margin:0 0 20px;">⭐ Student Feedback</h3>' +
          '<div style="display:flex;gap:28px;align-items:center;flex-wrap:wrap;">' +
            '<div style="text-align:center;min-width:80px;">' +
              '<div style="font-size:52px;font-weight:800;color:#F59E0B;line-height:1;">' + avg + '</div>' +
              '<div style="margin:5px 0 4px;">' + W.tcStarsHtml(avg, 18) + '</div>' +
              '<div style="font-size:11px;font-weight:700;color:#F59E0B;text-transform:uppercase;letter-spacing:.5px;">' + label + '</div>' +
            '</div>' +
            '<div style="flex:1;min-width:200px;display:flex;flex-direction:column;gap:7px;">' + bars + '</div>' +
          '</div>' +
        '</div>'
      );

      /* ── Reviews list ── */
      var filterOpts = [
        '<option value="0">All ratings</option>',
        '<option value="5">★★★★★ 5 stars</option>',
        '<option value="4">★★★★☆ 4 stars</option>',
        '<option value="3">★★★☆☆ 3 stars</option>',
        '<option value="2">★★☆☆☆ 2 stars</option>',
        '<option value="1">★☆☆☆☆ 1 star</option>',
      ].join('');

      h += (
        '<div style="background:white;border-radius:12px;border:1.5px solid #E5E7EB;padding:24px;">' +
          '<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:18px;">' +
            '<h3 style="font-family:\'Playfair Display\',serif;font-size:17px;color:#111;margin:0;">Reviews <span style="color:#6B7280;font-size:14px;font-family:sans-serif;">(' + count + ')</span></h3>' +
            '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
              '<input id="tcSRev_' + safeId + '" type="text" placeholder="Search reviews…" ' +
                'oninput="tcFilterRev(\'' + type + '\',\'' + itemId + '\')" ' +
                'style="border:1.5px solid #D1D5DB;border-radius:6px;padding:7px 12px;font-size:13px;width:148px;outline:none;" />' +
              '<select id="tcFRev_' + safeId + '" onchange="tcFilterRev(\'' + type + '\',\'' + itemId + '\')" ' +
                'style="border:1.5px solid #D1D5DB;border-radius:6px;padding:7px 12px;font-size:13px;background:white;outline:none;">' +
                filterOpts +
              '</select>' +
            '</div>' +
          '</div>' +
          '<div id="tcRL_' + safeId + '">' + W.tcRenderRevList(reviews, type, itemId) + '</div>' +
        '</div>'
      );

    } else if (!canReview) {
      h += (
        '<div style="background:white;border-radius:12px;padding:36px;text-align:center;color:#6B7280;">' +
          '<div style="font-size:40px;margin-bottom:10px;">⭐</div>' +
          '<p style="font-size:14px;margin:0;">No reviews yet. Enrol and be the first to share your experience!</p>' +
        '</div>'
      );
    }

    h += '</div>';
    return h;
  };

  /* ────────────────────────────────────────────────────────────
     Interactive callbacks (invoked from inline onclick attrs)
  ──────────────────────────────────────────────────────────── */
  W.tcHoverStar = function (safeId, val) {
    var p = document.getElementById('tcSP_' + safeId); if (!p) return;
    p.querySelectorAll('span').forEach(function (s) {
      s.style.color = +s.dataset.val <= val ? '#F59E0B' : '#D1D5DB';
    });
  };

  W.tcResetStar = function (safeId) {
    var p = document.getElementById('tcSP_' + safeId); if (!p) return;
    var sel = +p.dataset.rating;
    p.querySelectorAll('span').forEach(function (s) {
      s.style.color = +s.dataset.val <= sel ? '#F59E0B' : '#D1D5DB';
    });
  };

  W.tcPickStar = function (safeId, val) {
    var p = document.getElementById('tcSP_' + safeId); if (!p) return;
    p.dataset.rating = val;
    W.tcResetStar(safeId);
  };

  W.tcDoSubmit = function (type, itemId, canReview) {
    var safeId  = W.tcSafeId(itemId);
    var picker  = document.getElementById('tcSP_' + safeId);
    var rating  = picker ? +picker.dataset.rating : 0;
    var comment = (document.getElementById('tcRT_' + safeId) || {}).value || '';
    if (!rating) { alert('Please select a star rating first.'); return; }
    if (W.tcSubmitReview(type, itemId, rating, comment)) {
      var wrap = document.getElementById('tcRevWrap_' + safeId);
      if (wrap) {
        var tmp = document.createElement('div');
        tmp.innerHTML = W.tcBuildReviewSection(type, itemId, canReview);
        wrap.replaceWith(tmp.firstElementChild);
      }
    }
  };

  W.tcRefreshRevList = function (type, itemId) {
    var safeId = W.tcSafeId(itemId);
    var el     = document.getElementById('tcRL_' + safeId);
    if (el) el.innerHTML = W.tcRenderRevList(W.tcItemReviews(type, itemId), type, itemId);
  };

  W.tcFilterRev = function (type, itemId) {
    var safeId  = W.tcSafeId(itemId);
    var qEl     = document.getElementById('tcSRev_' + safeId);
    var fEl     = document.getElementById('tcFRev_' + safeId);
    var query   = qEl  ? qEl.value.toLowerCase()  : '';
    var filter  = fEl  ? parseInt(fEl.value)       : 0;
    var reviews = W.tcItemReviews(type, itemId);
    if (filter > 0) reviews = reviews.filter(function (r) { return r.rating === filter; });
    if (query)      reviews = reviews.filter(function (r) {
      return (r.comment  || '').toLowerCase().includes(query) ||
             (r.userName || '').toLowerCase().includes(query);
    });
    var el = document.getElementById('tcRL_' + safeId);
    if (el) el.innerHTML = W.tcRenderRevList(reviews, type, itemId);
  };

}(window));
