(function(){
  'use strict';
  var BUILD = '20260820-015';
  var loader = document.getElementById('loader');

  function setStatus(msg){ if(loader) loader.textContent = msg; }

  function fetchText(url){
    var busted = url + '?v=' + BUILD;
    return fetch(busted, {cache:'no-store'}).then(function(r){
      if(!r.ok) throw new Error(url + ' HTTP ' + r.status);
      return r.text();
    });
  }

  var parts = [];
  var chain = Promise.resolve();
  for(var i=1;i<=8;i++){
    (function(n){
      chain = chain.then(function(){
        setStatus('Chargement de l’invitation… ' + n + '/8');
        var name = 'parts/part-' + (n<10 ? '0'+n : n) + '.txt';
        return fetchText(name).then(function(txt){ parts.push(txt); });
      });
    })(i);
  }

  chain.then(function(){
    var html = parts.join('');

    html = html.replace(/(\.error-msg\s*\{[^}]*\})[\s\S]*?(?=\s*\[data-reveal\]\s*\{)/i, '$1\n\n');
    html = html.replace(/<template id="intro-template">[\s\S]*?<\/template>\s*/i, '');
    html = html.replace(/<div id="intro-mount"><\/div>\s*/i, '');
    html = html.replace(/\s*function initIntro\(\)\s*\{[\s\S]*?(?=\s*function renderApp\s*\()/i, '\n\n');
    html = html.replace(/\binitIntro\(\);/g, 'markIntroDismissed();');

    html = html.replace('</head>',
      '<link rel="stylesheet" href="enhancements.css?v=' + BUILD + '">' +
      '</head>');

    var bodyEnd = html.lastIndexOf('</body>');
    if(bodyEnd === -1) throw new Error('Balise </body> introuvable');

    var scripts =
      '<script src="supabase-rsvp.js?v=' + BUILD + '"></script>' +
      '<script src="admin-delete.js?v=' + BUILD + '"></script>' +
      '<script src="enhancements.js?v=' + BUILD + '"></script>' +
      '<script src="intro-video.js?v=' + BUILD + '"></script>';

    html = html.slice(0, bodyEnd) + scripts + html.slice(bodyEnd);

    document.open();
    document.write(html);
    document.close();
  }).catch(function(err){
    console.error('Invitation loader error:', err);
    document.body.innerHTML = '<div class="loading">Impossible de charger l’invitation.<br><small>' + String(err.message || err) + '</small><br><button onclick="location.reload()">Réessayer</button></div>';
  });
})();
