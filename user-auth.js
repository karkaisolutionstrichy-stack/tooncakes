'use strict';
/**
 * ToonCakes User Authentication Module
 * Include on any page that needs user auth features.
 *
 * Public API:
 *   TC_AUTH.getUser()              → session object or null
 *   TC_AUTH.isLoggedIn()           → boolean
 *   TC_AUTH.register(name, email, phone, pw) → {ok, msg, user}
 *   TC_AUTH.login(email, pw)       → {ok, msg, user}
 *   TC_AUTH.handleGoogleToken(r)   → called by Google GSI callback
 *   TC_AUTH.logout()
 *   TC_AUTH.requireLogin(msg, cb)  → shows gate overlay if not logged in
 *   TC_AUTH.redirectLogin(returnUrl)
 */
const TC_AUTH = (function () {

  /* ── Keys & config ── */
  const K_USERS   = 'tc_users';
  const K_SESSION = 'tc_user_session';
  const SESSION_TTL = 30 * 24 * 60 * 60 * 1000;  // 30 days

  /* ── Storage ── */
  const _getUsers = ()  => JSON.parse(localStorage.getItem(K_USERS)   || '[]');
  const _setUsers = (a) => localStorage.setItem(K_USERS, JSON.stringify(a));
  const _getSnap  = ()  => JSON.parse(localStorage.getItem(K_SESSION) || 'null');

  function isLoggedIn() {
    const s = _getSnap();
    if (!s) return false;
    if (Date.now() > s.exp) { localStorage.removeItem(K_SESSION); return false; }
    return true;
  }
  const getUser = () => isLoggedIn() ? _getSnap() : null;

  /* ── Password hash (djb2 – static-site only, no real crypto backend) ── */
  function _hash(str) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) h = (((h << 5) + h) ^ str.charCodeAt(i)) >>> 0;
    return h.toString(36);
  }

  /* ── Register ── */
  function register(name, email, phone, password, secQuestion, secAnswer, waOptIn) {
    if (!name || !email || !password)
      return { ok: false, msg: 'Name, email and password are required.' };
    if (password.length < 6)
      return { ok: false, msg: 'Password must be at least 6 characters.' };
    const users = _getUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase()))
      return { ok: false, msg: 'Email already registered. Please log in instead.' };
    const u = {
      id:            Date.now().toString(),
      name:          name.trim(),
      email:         email.toLowerCase().trim(),
      phone:         (phone || '').trim(),
      pwHash:        _hash(password),
      googleId:      null,
      avatar:        null,
      createdAt:     new Date().toISOString(),
      secQuestion:   secQuestion ? secQuestion.trim()  : null,
      secAnswerHash: secAnswer   ? _hash(secAnswer.toLowerCase().trim()) : null,
      waOptIn:       waOptIn === true,
    };
    users.push(u);
    _setUsers(users);
    _startSession(u);
    return { ok: true, user: u };
  }

  /* ── Login ── */
  function login(email, password) {
    const u = _getUsers().find(x => x.email.toLowerCase() === email.toLowerCase());
    if (!u)                       return { ok: false, msg: 'No account found for this email.' };
    if (_hash(password) !== u.pwHash) return { ok: false, msg: 'Incorrect password. Please try again.' };
    _startSession(u);
    return { ok: true, user: u };
  }

  /* ── Google Sign-In (GSI token callback) ── */
  function handleGoogleToken(response) {
    try {
      // Decode JWT payload (no sig-verify needed for client-side auth)
      const raw     = response.credential.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(raw));
      const users   = _getUsers();
      let u = users.find(x => x.googleId === payload.sub ||
                              x.email.toLowerCase() === payload.email.toLowerCase());
      if (u) {
        u.googleId = payload.sub;
        if (payload.picture) u.avatar = payload.picture;
        _setUsers(users);
      } else {
        u = {
          id:        Date.now().toString(),
          name:      payload.name || payload.email,
          email:     payload.email.toLowerCase(),
          phone:     '',
          pwHash:    null,
          googleId:  payload.sub,
          avatar:    payload.picture || null,
          createdAt: new Date().toISOString()
        };
        users.push(u);
        _setUsers(users);
      }
      _startSession(u);
      // If on the login page, redirect; otherwise refresh nav
      const pg = window.location.pathname.replace(/.*\//, '');
      if (pg === 'user-login.html' || pg === '') {
        const ret = new URLSearchParams(window.location.search).get('return') || 'index.html';
        window.location.href = decodeURIComponent(ret);
      } else {
        _updateNavBtn();
        const gate = document.getElementById('tcLoginGate');
        if (gate) gate.remove();
      }
    } catch (e) {
      console.error('Google sign-in error:', e);
      alert('Google sign-in failed. Please use email/password or try again.');
    }
  }

  /* ── Session ── */
  function _startSession(u) {
    localStorage.setItem(K_SESSION, JSON.stringify({
      userId: u.id,
      name:   u.name,
      email:  u.email,
      phone:  u.phone || '',
      avatar: u.avatar || null,
      exp:    Date.now() + SESSION_TTL
    }));
  }

  function logout() {
    localStorage.removeItem(K_SESSION);
    _updateNavBtn();
    if (document.body.dataset.authRequired === 'true') {
      window.location.href = 'index.html';
    } else {
      window.location.reload();
    }
  }

  /* ── Nav button ── */
  function _updateNavBtn() {
    const btn = document.getElementById('tcUserNavBtn');
    if (!btn) return;
    const u = getUser();
    if (u) {
      btn.innerHTML = u.avatar
        ? `<img src="${u.avatar}" style="width:22px;height:22px;border-radius:50%;margin-right:5px;vertical-align:middle;object-fit:cover;"/>${_esc(u.name.split(' ')[0])}`
        : `<span style="font-size:15px;">👤</span> ${_esc(u.name.split(' ')[0])}`;
      btn.onclick = _toggleDrop;
    } else {
      btn.innerHTML = '🔑 Login';
      btn.onclick = () => redirectLogin();
    }
  }

  function _toggleDrop(e) {
    if (e) e.stopPropagation();
    const existing = document.getElementById('tcUserDrop');
    if (existing) { existing.remove(); return; }
    const u = getUser(); if (!u) return;
    const btn  = document.getElementById('tcUserNavBtn');
    const rect = btn.getBoundingClientRect();
    const dd   = document.createElement('div');
    dd.id = 'tcUserDrop';
    dd.style.cssText = [
      `position:fixed;top:${rect.bottom + 5}px;right:${window.innerWidth - rect.right}px;`,
      `background:white;border-radius:14px;box-shadow:0 8px 40px rgba(0,0,0,0.2);`,
      `z-index:10000;min-width:200px;border:1.5px solid #f0e0f5;overflow:hidden;`
    ].join('');
    dd.innerHTML = `
      <div style="padding:14px 16px 10px;border-bottom:1px solid #f5f0fa;">
        <div style="font-weight:700;font-size:14px;color:#2D0B20;">${_esc(u.name)}</div>
        <div style="font-size:12px;color:#999;margin-top:2px;">${_esc(u.email)}</div>
        ${u.phone ? `<div style="font-size:12px;color:#bbb;">📞 ${_esc(u.phone)}</div>` : ''}
      </div>
      <div onclick="window.location.href='user-dashboard.html'"
           style="padding:11px 16px;cursor:pointer;font-size:13px;color:#333;transition:background 0.15s;"
           onmouseover="this.style.background='#fdf5ff'" onmouseout="this.style.background=''">
        🏠 My Dashboard
      </div>
      <div onclick="window.location.href='user-dashboard.html?tab=courses'"
           style="padding:11px 16px;cursor:pointer;font-size:13px;color:#333;transition:background 0.15s;"
           onmouseover="this.style.background='#fdf5ff'" onmouseout="this.style.background=''">
        📚 My Courses
      </div>
      <div onclick="window.location.href='user-dashboard.html?tab=orders'"
           style="padding:11px 16px;cursor:pointer;font-size:13px;color:#333;transition:background 0.15s;"
           onmouseover="this.style.background='#fdf5ff'" onmouseout="this.style.background=''">
        📦 My Orders
      </div>
      <div onclick="TC_AUTH.logout()"
           style="padding:11px 16px;cursor:pointer;font-size:13px;color:#dc2626;border-top:1px solid #f5f0fa;transition:background 0.15s;"
           onmouseover="this.style.background='#fff5f5'" onmouseout="this.style.background=''">
        🚪 Logout
      </div>`;
    document.body.appendChild(dd);
    setTimeout(() => {
      document.addEventListener('click', function _h(ev) {
        if (!dd.contains(ev.target) && ev.target.id !== 'tcUserNavBtn') {
          dd.remove();
          document.removeEventListener('click', _h);
        }
      });
    }, 30);
  }

  /* ── Login gate & redirect ── */
  function redirectLogin(returnUrl) {
    window.location.href = 'user-login.html?return=' + encodeURIComponent(returnUrl || window.location.href);
  }

  function requireLogin(msg, onSuccess) {
    if (isLoggedIn()) {
      if (onSuccess) onSuccess(getUser());
      return true;
    }
    _showGate(msg);
    return false;
  }

  function _showGate(msg) {
    const existing = document.getElementById('tcLoginGate');
    if (existing) existing.remove();
    const ret = encodeURIComponent(window.location.href);
    const el  = document.createElement('div');
    el.id     = 'tcLoginGate';
    el.style.cssText = [
      'position:fixed;inset:0;background:rgba(15,5,30,0.72);z-index:9990;',
      'display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(5px);'
    ].join('');
    el.innerHTML = `
      <div style="background:white;border-radius:22px;padding:36px 28px;max-width:380px;width:100%;
                  text-align:center;box-shadow:0 24px 80px rgba(0,0,0,0.35);">
        <div style="font-size:52px;margin-bottom:10px;">🔑</div>
        <h3 style="font-family:'Playfair Display',serif;font-size:22px;color:#6A1545;margin:0 0 10px;">
          Login Required
        </h3>
        <p style="font-size:14px;color:#555;line-height:1.65;margin-bottom:24px;">
          ${_esc(msg) || 'Please log in or create a free account to continue.'}
        </p>
        <a href="user-login.html?return=${ret}"
           style="display:block;background:linear-gradient(135deg,#E8356D,#6A1545);color:white;
                  padding:15px;border-radius:13px;font-weight:700;font-size:15px;
                  text-decoration:none;margin-bottom:10px;">
          🔑 Login / Sign Up — Free!
        </a>
        <button onclick="document.getElementById('tcLoginGate').remove()"
                style="background:none;border:none;color:#bbb;font-size:13px;
                       cursor:pointer;font-family:'Poppins',sans-serif;">
          ✕ Cancel
        </button>
      </div>`;
    document.body.appendChild(el);
    el.addEventListener('click', ev => { if (ev.target === el) el.remove(); });
  }

  function _esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
                          .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ── Auto-init nav on DOM ready ── */
  document.addEventListener('DOMContentLoaded', _updateNavBtn);

  /* ── Enrollment helpers ── */
  const K_ENROL = 'tc_enrollments';

  function saveEnrollment(data) {
    const u = getUser();
    if (!u) return null;
    const list = JSON.parse(localStorage.getItem(K_ENROL) || '[]');
    // No duplicates
    if (list.some(e => e.userEmail === u.email && e.type === data.type && e.itemId === data.itemId)) return null;
    const enr = Object.assign({
      id:        'ENR' + Date.now().toString().slice(-8),
      userEmail: u.email,
      userId:    u.userId,
      enrolledAt: new Date().toISOString(),
      status:    'active',
      progress:  0,
    }, data);
    list.push(enr);
    localStorage.setItem(K_ENROL, JSON.stringify(list));
    return enr;
  }

  function getEnrollments() {
    const u = getUser();
    if (!u) return [];
    return (JSON.parse(localStorage.getItem(K_ENROL) || '[]'))
      .filter(e => e.userEmail === u.email);
  }

  function isEnrolled(type, itemId) {
    const u = getUser();
    if (!u) return false;
    return (JSON.parse(localStorage.getItem(K_ENROL) || '[]'))
      .some(e => e.userEmail === u.email && e.type === type && e.itemId === itemId);
  }

  function updateEnrollmentProgress(enrollId, progress) {
    const list = JSON.parse(localStorage.getItem(K_ENROL) || '[]');
    const e = list.find(x => x.id === enrollId);
    if (e) { e.progress = Math.min(100, Math.max(0, progress)); localStorage.setItem(K_ENROL, JSON.stringify(list)); }
  }

  function getUserOrders() {
    const u = getUser();
    if (!u) return [];
    return (JSON.parse(localStorage.getItem('tc_orders') || '[]'))
      .filter(o => (o.userEmail && o.userEmail === u.email) ||
                   (!o.userEmail && o.phone && o.phone === u.phone));
  }

  /* ── Password Reset ── */
  const K_RESET = 'tc_reset_tokens';
  const K_PINS  = 'tc_reset_pins';

  function requestPasswordReset(email) {
    const u = _getUsers().find(x => x.email.toLowerCase() === email.toLowerCase());
    if (!u) return { ok: false, msg: 'No account found for this email.' };
    return {
      ok:          true,
      hasSecQ:     !!(u.secQuestion && u.secAnswerHash),
      secQuestion: u.secQuestion || null,
      isGoogle:    !!(u.googleId && !u.pwHash),
      name:        u.name,
      email:       u.email,
    };
  }

  function verifySecAnswer(email, answer) {
    const u = _getUsers().find(x => x.email.toLowerCase() === email.toLowerCase());
    if (!u || !u.secAnswerHash)
      return { ok: false, msg: 'Security question not set for this account.' };
    if (_hash(answer.toLowerCase().trim()) !== u.secAnswerHash)
      return { ok: false, msg: 'Incorrect answer. Please try again.' };
    return { ok: true, token: _issueResetToken(email) };
  }

  function storeResetPin(email, pin) {
    const list = JSON.parse(localStorage.getItem(K_PINS) || '[]')
      .filter(p => p.email !== email.toLowerCase());
    list.push({ email: email.toLowerCase(), pin: String(pin), exp: Date.now() + 10 * 60 * 1000 });
    localStorage.setItem(K_PINS, JSON.stringify(list));
  }

  function verifyEmailPin(email, pin) {
    const list = JSON.parse(localStorage.getItem(K_PINS) || '[]');
    const p = list.find(x => x.email === email.toLowerCase());
    if (!p)                           return { ok: false, msg: 'No PIN found. Please request a new one.' };
    if (Date.now() > p.exp)           return { ok: false, msg: 'PIN expired. Please request a new one.' };
    if (p.pin !== String(pin).trim()) return { ok: false, msg: 'Incorrect PIN. Please try again.' };
    localStorage.setItem(K_PINS, JSON.stringify(list.filter(x => x.email !== email.toLowerCase())));
    return { ok: true, token: _issueResetToken(email) };
  }

  function _issueResetToken(email) {
    const token = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    const list  = JSON.parse(localStorage.getItem(K_RESET) || '[]')
      .filter(t => t.email !== email.toLowerCase());
    list.push({ email: email.toLowerCase(), token, exp: Date.now() + 10 * 60 * 1000 });
    localStorage.setItem(K_RESET, JSON.stringify(list));
    return token;
  }

  function resetPassword(email, token, newPassword) {
    if (!newPassword || newPassword.length < 6)
      return { ok: false, msg: 'Password must be at least 6 characters.' };
    const list = JSON.parse(localStorage.getItem(K_RESET) || '[]');
    const t    = list.find(x => x.email === email.toLowerCase() && x.token === token);
    if (!t || Date.now() > t.exp)
      return { ok: false, msg: 'Reset session expired. Please start over.' };
    const users = _getUsers();
    const u = users.find(x => x.email.toLowerCase() === email.toLowerCase());
    if (!u) return { ok: false, msg: 'Account not found.' };
    u.pwHash = _hash(newPassword);
    _setUsers(users);
    localStorage.setItem(K_RESET, JSON.stringify(list.filter(x => x.token !== token)));
    return { ok: true };
  }

  /* ── Public API ── */
  return {
    getUser, isLoggedIn,
    register, login, handleGoogleToken, logout,
    requireLogin, redirectLogin,
    updateNavBtn: _updateNavBtn,
    saveEnrollment, getEnrollments, isEnrolled,
    updateEnrollmentProgress, getUserOrders,
    requestPasswordReset, verifySecAnswer,
    storeResetPin, verifyEmailPin, resetPassword,
  };

})();

/* Expose callback for Google GSI button */
window.handleGoogleToken = TC_AUTH.handleGoogleToken;
