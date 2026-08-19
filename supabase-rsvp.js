(function () {
  'use strict';

  var SUPABASE_URL = 'https://zthqpyqejwaqxzzqlcgl.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_haEwhpgQwLdN30iCxPk8Tw_hALbITcU';
  var LOCAL_KEY = 'aa-wedding-2026-supabase-rsvp';
  var ADMIN_SESSION_KEY = 'aa-wedding-2026-admin-session';

  function apiHeaders(token, prefer) {
    var headers = {
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + (token || SUPABASE_KEY),
      'Content-Type': 'application/json'
    };
    if (prefer) headers.Prefer = prefer;
    return headers;
  }

  function safeText(select) {
    if (!select || !select.selectedOptions || !select.selectedOptions.length) return null;
    return select.selectedOptions[0].textContent.trim();
  }

  function makeNumericId() {
    var base = Date.now() * 1000;
    var rnd = Math.floor(Math.random() * 900) + 100;
    return base + rnd;
  }

  function currentFormData() {
    var card = document.querySelector('.rsvp-card');
    if (!card) return null;

    var nameInput = document.getElementById('rsvp-name');
    var noteInput = document.getElementById('rsvp-note');
    var toggleButtons = card.querySelectorAll('.attend-toggle button');
    var attending = true;
    if (toggleButtons.length >= 2) attending = toggleButtons[0].classList.contains('selected');

    var guests = [];
    if (attending) {
      card.querySelectorAll('.guest-row').forEach(function (row) {
        var firstNameInput = row.querySelector('[data-role="guest-name"]');
        var firstName = firstNameInput ? firstNameInput.value.trim() : '';
        if (!firstName) return;
        var formula = row.querySelector('[data-role="guest-formula"]');
        var starter = row.querySelector('[data-role="guest-entree"]');
        var main = row.querySelector('[data-role="guest-plat"]');
        var dessert = row.querySelector('[data-role="guest-dessert"]');
        var drink = row.querySelector('[data-role="guest-boisson"]');
        guests.push({
          first_name: firstName,
          formula: safeText(formula),
          starter: safeText(starter),
          main_course: safeText(main),
          dessert: safeText(dessert),
          drink: safeText(drink)
        });
      });
    }

    return {
      name: nameInput ? nameInput.value.trim() : '',
      attending: attending,
      guests: guests,
      note: noteInput ? noteInput.value.trim() : ''
    };
  }

  async function insertRows(data) {
    var guestId = makeNumericId();
    var guestPayload = {
      id: guestId,
      name: data.name,
      email: null,
      attendance: data.attending ? 'yes' : 'no',
      guests_count: data.attending ? data.guests.length : 0,
      dietary: data.note || null,
      message: null
    };

    var guestRes = await fetch(SUPABASE_URL + '/rest/v1/guest', {
      method: 'POST',
      headers: apiHeaders(null, 'return=minimal'),
      body: JSON.stringify(guestPayload)
    });
    if (!guestRes.ok) throw new Error('guest ' + guestRes.status + ' ' + (await guestRes.text()));

    if (data.attending && data.guests.length) {
      var menuPayload = data.guests.map(function (g) {
        return {
          guest_id: guestId,
          first_name: g.first_name,
          formula: g.formula,
          starter: g.starter,
          main_course: g.main_course,
          dessert: g.dessert,
          drink: g.drink
        };
      });
      var menuRes = await fetch(SUPABASE_URL + '/rest/v1/guest_menu', {
        method: 'POST',
        headers: apiHeaders(null, 'return=minimal'),
        body: JSON.stringify(menuPayload)
      });
      if (!menuRes.ok) throw new Error('guest_menu ' + menuRes.status + ' ' + (await menuRes.text()));
    }

    return guestId;
  }

  function showConfirmation(data) {
    var slot = document.getElementById('rsvp-form-slot');
    if (!slot) return;
    slot.innerHTML = '';
    var card = document.createElement('div');
    card.className = 'confirm-card';
    var title = document.createElement('h3');
    title.textContent = data.attending ? 'Merci, ' + data.name + ' 🤍' : 'Merci pour votre réponse';
    var text = document.createElement('p');
    text.textContent = data.attending
      ? 'Votre présence et vos choix de menu ont bien été enregistrés. À très bientôt !'
      : 'Votre réponse a bien été enregistrée. Merci de nous avoir prévenus.';
    card.appendChild(title);
    card.appendChild(text);
    slot.appendChild(card);
  }

  function restoreConfirmation() {
    try {
      var raw = localStorage.getItem(LOCAL_KEY);
      if (!raw) return;
      var saved = JSON.parse(raw);
      if (saved && saved.name) showConfirmation(saved);
    } catch (e) {}
  }

  function injectAdminStyles() {
    if (document.getElementById('supabase-admin-style')) return;
    var style = document.createElement('style');
    style.id = 'supabase-admin-style';
    style.textContent =
      '.sb-admin{margin:22px auto 0;max-width:980px;text-align:left;font-family:Georgia,serif;color:#171412}' +
      '.sb-admin-card{border:1px solid #d9d1c4;background:#fffdf9;padding:22px}' +
      '.sb-admin h3{margin:0 0 16px;font-size:22px;font-weight:400}' +
      '.sb-admin-login{display:grid;gap:10px;max-width:430px}' +
      '.sb-admin input{box-sizing:border-box;width:100%;padding:11px 12px;border:1px solid #cfc5b8;background:#fff;font:inherit}' +
      '.sb-admin button{padding:10px 16px;border:1px solid #171412;background:#171412;color:#fff;font:inherit;cursor:pointer}' +
      '.sb-admin button.secondary{background:#fff;color:#171412}' +
      '.sb-admin button:disabled{opacity:.55;cursor:default}' +
      '.sb-admin-error{color:#9b2c2c;margin:4px 0 0}' +
      '.sb-admin-toolbar{display:flex;gap:10px;flex-wrap:wrap;align-items:center;justify-content:space-between;margin-bottom:16px}' +
      '.sb-admin-actions{display:flex;gap:8px;flex-wrap:wrap}' +
      '.sb-admin-summary{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:10px;margin:0 0 18px}' +
      '.sb-admin-stat{border:1px solid #ded6cb;padding:14px;background:#fff}' +
      '.sb-admin-stat strong{display:block;font-size:24px;font-weight:400;margin-bottom:4px}' +
      '.sb-admin-list{display:grid;gap:12px}' +
      '.sb-admin-response{border:1px solid #ded6cb;padding:15px;background:#fff}' +
      '.sb-admin-response-head{display:flex;gap:10px;justify-content:space-between;align-items:flex-start;flex-wrap:wrap}' +
      '.sb-admin-response h4{margin:0;font-size:18px;font-weight:400}' +
      '.sb-admin-badge{display:inline-block;padding:3px 8px;border:1px solid #bdb3a7;font-size:12px}' +
      '.sb-admin-meta{margin:7px 0;color:#776f66;font-size:13px}' +
      '.sb-admin-menu{margin:10px 0 0;padding:10px 0 0;border-top:1px solid #eee6dc}' +
      '.sb-admin-menu-item{margin:0 0 7px;line-height:1.45}' +
      '.sb-admin-note{margin:10px 0 0;padding:10px;background:#f8f4ee}' +
      '.sb-admin-loading{padding:14px 0;color:#776f66}' +
      '@media(max-width:640px){.sb-admin-card{padding:15px}.sb-admin-response-head{display:block}.sb-admin-badge{margin-top:6px}}';
    document.head.appendChild(style);
  }

  function loadStoredSession() {
    try {
      var raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function saveSession(session) {
    try { sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session)); } catch (e) {}
  }

  function clearSession() {
    try { sessionStorage.removeItem(ADMIN_SESSION_KEY); } catch (e) {}
  }

  async function signIn(email, password) {
    var res = await fetch(SUPABASE_URL + '/auth/v1/token?grant_type=password', {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: email, password: password })
    });
    var payload = await res.json().catch(function () { return {}; });
    if (!res.ok || !payload.access_token) {
      throw new Error(payload.error_description || payload.msg || 'Connexion impossible.');
    }
    payload.expires_at = Math.floor(Date.now() / 1000) + (payload.expires_in || 3600);
    saveSession(payload);
    return payload;
  }

  async function refreshSession(session) {
    if (!session || !session.refresh_token) throw new Error('Session expirée.');
    var res = await fetch(SUPABASE_URL + '/auth/v1/token?grant_type=refresh_token', {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refresh_token: session.refresh_token })
    });
    var payload = await res.json().catch(function () { return {}; });
    if (!res.ok || !payload.access_token) throw new Error('Session expirée.');
    payload.expires_at = Math.floor(Date.now() / 1000) + (payload.expires_in || 3600);
    saveSession(payload);
    return payload;
  }

  async function validSession() {
    var session = loadStoredSession();
    if (!session || !session.access_token) return null;
    var now = Math.floor(Date.now() / 1000);
    if (!session.expires_at || session.expires_at > now + 45) return session;
    try { return await refreshSession(session); }
    catch (e) { clearSession(); return null; }
  }

  async function fetchAdminRows(token) {
    var query = '/rest/v1/guest?select=id,created_at,name,email,attendance,guests_count,dietary,message,guest_menu(id,first_name,formula,starter,main_course,dessert,drink)&order=created_at.desc';
    var res = await fetch(SUPABASE_URL + query, {
      headers: apiHeaders(token)
    });
    if (!res.ok) {
      var text = await res.text();
      throw new Error('Lecture refusée (' + res.status + '). ' + text);
    }
    return res.json();
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch];
    });
  }

  function formatDate(value) {
    if (!value) return '';
    try {
      return new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'medium', timeStyle: 'short'
      }).format(new Date(value));
    } catch (e) { return value; }
  }

  function renderAdminRows(panel, rows) {
    var attending = rows.filter(function (r) { return r.attendance === 'yes'; });
    var absent = rows.filter(function (r) { return r.attendance !== 'yes'; });
    var totalPeople = attending.reduce(function (sum, r) { return sum + (Number(r.guests_count) || 0); }, 0);
    var menuRows = rows.reduce(function (sum, r) { return sum + ((r.guest_menu || []).length); }, 0);

    var html = '<div class="sb-admin-card">' +
      '<div class="sb-admin-toolbar"><h3>Espace mariés</h3><div class="sb-admin-actions">' +
      '<button type="button" class="secondary" data-sb-admin-refresh>Actualiser</button>' +
      '<button type="button" class="secondary" data-sb-admin-logout>Se déconnecter</button>' +
      '</div></div>' +
      '<div class="sb-admin-summary">' +
      '<div class="sb-admin-stat"><strong>' + attending.length + '</strong>réponse(s) présente(s)</div>' +
      '<div class="sb-admin-stat"><strong>' + absent.length + '</strong>réponse(s) absente(s)</div>' +
      '<div class="sb-admin-stat"><strong>' + totalPeople + '</strong>convive(s) attendu(s)</div>' +
      '<div class="sb-admin-stat"><strong>' + menuRows + '</strong>menu(s) renseigné(s)</div>' +
      '</div><div class="sb-admin-list">';

    if (!rows.length) html += '<p>Aucune réponse pour le moment.</p>';

    rows.forEach(function (r) {
      var present = r.attendance === 'yes';
      html += '<article class="sb-admin-response">' +
        '<div class="sb-admin-response-head"><h4>' + escapeHtml(r.name || 'Sans nom') + '</h4>' +
        '<span class="sb-admin-badge">' + (present ? 'Présent' : 'Absent') + '</span></div>' +
        '<div class="sb-admin-meta">' + escapeHtml(formatDate(r.created_at)) +
        (present ? ' · ' + (Number(r.guests_count) || 0) + ' convive(s)' : '') + '</div>';

      if (present && r.guest_menu && r.guest_menu.length) {
        html += '<div class="sb-admin-menu">';
        r.guest_menu.forEach(function (m) {
          var details = [m.formula, m.starter, m.main_course, m.dessert, m.drink].filter(Boolean);
          html += '<p class="sb-admin-menu-item"><strong>' + escapeHtml(m.first_name || 'Convive') + '</strong>' +
            (details.length ? ' — ' + escapeHtml(details.join(' · ')) : '') + '</p>';
        });
        html += '</div>';
      }

      if (r.dietary) html += '<div class="sb-admin-note"><strong>Allergies / régime / petit mot :</strong><br>' + escapeHtml(r.dietary) + '</div>';
      if (r.message) html += '<div class="sb-admin-note">' + escapeHtml(r.message) + '</div>';
      html += '</article>';
    });

    html += '</div></div>';
    panel.innerHTML = html;

    var refresh = panel.querySelector('[data-sb-admin-refresh]');
    if (refresh) refresh.addEventListener('click', function () { openAdminPanel(panel, true); });
    var logout = panel.querySelector('[data-sb-admin-logout]');
    if (logout) logout.addEventListener('click', function () {
      clearSession();
      renderAdminLogin(panel);
    });
  }

  function renderAdminLogin(panel, message) {
    panel.hidden = false;
    panel.innerHTML = '<div class="sb-admin sb-admin-card"><h3>Espace mariés</h3>' +
      '<div class="sb-admin-login">' +
      '<input type="email" autocomplete="username" placeholder="Adresse e-mail" data-sb-admin-email>' +
      '<input type="password" autocomplete="current-password" placeholder="Mot de passe" data-sb-admin-password>' +
      '<button type="button" data-sb-admin-login>Se connecter</button>' +
      '<p class="sb-admin-error" data-sb-admin-error' + (message ? '' : ' hidden') + '>' + escapeHtml(message || '') + '</p>' +
      '</div></div>';

    var button = panel.querySelector('[data-sb-admin-login]');
    var email = panel.querySelector('[data-sb-admin-email]');
    var password = panel.querySelector('[data-sb-admin-password]');
    var error = panel.querySelector('[data-sb-admin-error]');

    function doLogin() {
      var e = email.value.trim();
      var p = password.value;
      if (!e || !p) {
        error.textContent = 'Indiquez votre e-mail et votre mot de passe.';
        error.hidden = false;
        return;
      }
      button.disabled = true;
      button.textContent = 'Connexion…';
      error.hidden = true;
      signIn(e, p).then(function () {
        openAdminPanel(panel, true);
      }).catch(function (err) {
        button.disabled = false;
        button.textContent = 'Se connecter';
        error.textContent = err.message || 'Connexion impossible.';
        error.hidden = false;
      });
    }

    button.addEventListener('click', doLogin);
    password.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') doLogin();
    });
  }

  async function openAdminPanel(panel, forceReload) {
    panel.hidden = false;
    if (!forceReload && panel.dataset.sbOpen === '1') {
      panel.hidden = true;
      panel.dataset.sbOpen = '0';
      return;
    }
    panel.dataset.sbOpen = '1';
    panel.innerHTML = '<div class="sb-admin sb-admin-card"><div class="sb-admin-loading">Chargement de l’espace mariés…</div></div>';

    var session = await validSession();
    if (!session) {
      renderAdminLogin(panel);
      return;
    }

    try {
      var rows = await fetchAdminRows(session.access_token);
      renderAdminRows(panel, rows);
    } catch (err) {
      if (/401|JWT|expired/i.test(err.message || '')) {
        clearSession();
        renderAdminLogin(panel, 'Votre session a expiré. Reconnectez-vous.');
      } else {
        panel.innerHTML = '<div class="sb-admin sb-admin-card"><h3>Espace mariés</h3><p class="sb-admin-error">Impossible de charger les réponses. Vérifiez les autorisations Supabase.</p></div>';
        console.error('Supabase admin error:', err);
      }
    }
  }

  function installAdminPanel() {
    injectAdminStyles();
    var adminToggle = document.getElementById('admin-toggle');
    var adminPanel = document.getElementById('admin-panel');
    if (!adminToggle || !adminPanel || adminToggle.dataset.sbReady === '1') return;

    adminToggle.dataset.sbReady = '1';
    adminToggle.style.display = '';
    adminToggle.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      openAdminPanel(adminPanel, false);
    }, true);
  }

  document.addEventListener('click', function (event) {
    var button = event.target.closest && event.target.closest('.submit-btn');
    if (!button) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    var data = currentFormData();
    var errorMsg = document.querySelector('.rsvp-card .error-msg');
    if (!data || !data.name) {
      if (errorMsg) {
        errorMsg.textContent = 'Merci d’indiquer votre nom.';
        errorMsg.hidden = false;
      }
      return;
    }
    if (data.attending && data.guests.length === 0) {
      if (errorMsg) {
        errorMsg.textContent = 'Merci d’indiquer au moins un convive et son menu.';
        errorMsg.hidden = false;
      }
      return;
    }

    if (errorMsg) errorMsg.hidden = true;
    button.disabled = true;
    var oldText = button.textContent;
    button.textContent = 'Envoi en cours…';

    insertRows(data).then(function (guestId) {
      data.supabase_id = guestId;
      data.saved_at = new Date().toISOString();
      try { localStorage.setItem(LOCAL_KEY, JSON.stringify(data)); } catch (e) {}
      showConfirmation(data);
    }).catch(function (err) {
      console.error('Supabase RSVP error:', err);
      button.disabled = false;
      button.textContent = oldText;
      if (errorMsg) {
        errorMsg.textContent = 'Une erreur est survenue pendant l’enregistrement. Merci de réessayer.';
        errorMsg.hidden = false;
      }
    });
  }, true);

  window.addEventListener('load', function () {
    setTimeout(function () {
      restoreConfirmation();
      installAdminPanel();
    }, 120);
  });
})();
