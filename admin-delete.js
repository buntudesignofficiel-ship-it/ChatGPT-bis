(function () {
  'use strict';

  var SUPABASE_URL = 'https://zthqpyqejwaqxzzqlcgl.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_haEwhpgQwLdN30iCxPk8Tw_hALbITcU';
  var ADMIN_SESSION_KEY = 'aa-wedding-2026-admin-session';

  function getSession() {
    try {
      var raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function headers(token) {
    return {
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    };
  }

  async function fetchRows(token) {
    var res = await fetch(SUPABASE_URL + '/rest/v1/guest?select=id,name&order=created_at.desc', {
      headers: headers(token)
    });
    if (!res.ok) throw new Error('Impossible de charger les identifiants des réponses.');
    return res.json();
  }

  async function deleteGuest(token, id) {
    var res = await fetch(SUPABASE_URL + '/rest/v1/guest?id=eq.' + encodeURIComponent(id), {
      method: 'DELETE',
      headers: headers(token)
    });
    if (!res.ok) {
      var txt = await res.text();
      throw new Error('Suppression refusée (' + res.status + '). ' + txt);
    }
  }

  function injectStyle() {
    if (document.getElementById('sb-admin-delete-style')) return;
    var style = document.createElement('style');
    style.id = 'sb-admin-delete-style';
    style.textContent =
      '.sb-admin-delete-wrap{margin-top:12px;padding-top:12px;border-top:1px solid #eee6dc;text-align:right}' +
      '.sb-admin-delete{background:#fff!important;color:#8f2f2f!important;border:1px solid #c98f8f!important;padding:8px 12px!important;font-size:13px!important}' +
      '.sb-admin-delete:hover{background:#fff6f6!important}' +
      '.sb-admin-delete:disabled{opacity:.55!important}';
    document.head.appendChild(style);
  }

  async function decorateAdmin() {
    var panel = document.getElementById('admin-panel');
    if (!panel || panel.hidden) return;
    var articles = Array.prototype.slice.call(panel.querySelectorAll('.sb-admin-response'));
    if (!articles.length) return;
    var session = getSession();
    if (!session || !session.access_token) return;

    injectStyle();

    var rows;
    try {
      rows = await fetchRows(session.access_token);
    } catch (e) {
      console.error(e);
      return;
    }

    articles.forEach(function (article, index) {
      if (article.querySelector('[data-sb-admin-delete]')) return;
      var row = rows[index];
      if (!row) return;

      var wrap = document.createElement('div');
      wrap.className = 'sb-admin-delete-wrap';
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sb-admin-delete';
      btn.setAttribute('data-sb-admin-delete', String(row.id));
      btn.textContent = 'Supprimer cette réponse';
      btn.addEventListener('click', async function () {
        var label = row.name || 'cette personne';
        if (!window.confirm('Supprimer définitivement la réponse de ' + label + ' ?')) return;
        btn.disabled = true;
        var previous = btn.textContent;
        btn.textContent = 'Suppression…';
        try {
          await deleteGuest(session.access_token, row.id);
          var refresh = panel.querySelector('[data-sb-admin-refresh]');
          if (refresh) refresh.click();
          else article.remove();
        } catch (err) {
          btn.disabled = false;
          btn.textContent = previous;
          window.alert('La suppression a échoué. Vérifiez l’autorisation de suppression dans Supabase.');
          console.error(err);
        }
      });
      wrap.appendChild(btn);
      article.appendChild(wrap);
    });
  }

  var timer = null;
  var observer = new MutationObserver(function () {
    clearTimeout(timer);
    timer = setTimeout(decorateAdmin, 80);
  });

  window.addEventListener('load', function () {
    var panel = document.getElementById('admin-panel');
    if (!panel) return;
    observer.observe(panel, { childList: true, subtree: true });
    decorateAdmin();
  });
})();
