(function () {
  'use strict';

  var SUPABASE_URL = 'https://zthqpyqejwaqxzzqlcgl.supabase.co';
  var SUPABASE_KEY = 'sb_publishable_haEwhpgQwLdN30iCxPk8Tw_hALbITcU';
  var LOCAL_KEY = 'aa-wedding-2026-supabase-rsvp';

  function apiHeaders() {
    return {
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    };
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
      headers: apiHeaders(),
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
        headers: apiHeaders(),
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
      var adminToggle = document.getElementById('admin-toggle');
      if (adminToggle) adminToggle.style.display = 'none';
    }, 120);
  });
})();
