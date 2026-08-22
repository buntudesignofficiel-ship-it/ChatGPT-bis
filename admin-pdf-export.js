(function(){
  'use strict';

  var SUPABASE_URL='https://zthqpyqejwaqxzzqlcgl.supabase.co';
  var SUPABASE_KEY='sb_publishable_haEwhpgQwLdN30iCxPk8Tw_hALbITcU';
  var ADMIN_SESSION_KEY='aa-wedding-2026-admin-session';

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});
  }

  function loadSession(){
    try{return JSON.parse(sessionStorage.getItem(ADMIN_SESSION_KEY)||'null');}catch(e){return null;}
  }

  function headers(token){
    return {
      'apikey':SUPABASE_KEY,
      'Authorization':'Bearer '+token,
      'Content-Type':'application/json'
    };
  }

  async function fetchRows(token){
    var q='/rest/v1/guest?select=id,created_at,name,attendance,guests_count,dietary,message,guest_menu(first_name,formula,starter,main_course,dessert,drink)&order=created_at.asc';
    var r=await fetch(SUPABASE_URL+q,{headers:headers(token),cache:'no-store'});
    if(!r.ok)throw new Error('Lecture Supabase refusée ('+r.status+').');
    return r.json();
  }

  function fmtDate(v){
    if(!v)return '';
    try{return new Intl.DateTimeFormat('fr-FR',{dateStyle:'short',timeStyle:'short'}).format(new Date(v));}
    catch(e){return v;}
  }

  function makePrintableHtml(rows){
    var attending=rows.filter(function(r){return r.attendance==='yes';});
    var absent=rows.filter(function(r){return r.attendance!=='yes';});
    var totalPeople=attending.reduce(function(s,r){return s+(Number(r.guests_count)||0);},0);
    var generated=new Intl.DateTimeFormat('fr-FR',{dateStyle:'long',timeStyle:'short'}).format(new Date());

    var sections='';
    attending.forEach(function(r){
      var menus=(r.guest_menu||[]).map(function(m){
        var d=[];
        if(m.formula)d.push(m.formula);
        if(m.starter)d.push('Entrée : '+m.starter);
        if(m.main_course)d.push('Plat : '+m.main_course);
        if(m.dessert)d.push('Dessert : '+m.dessert);
        if(m.drink)d.push('Boisson : '+m.drink);
        return '<div class="menu"><strong>'+esc(m.first_name||'Convive')+'</strong>'+(d.length?'<br>'+esc(d.join(' · ')):'')+'</div>';
      }).join('');

      sections += '<section class="guest">'+
        '<div class="guest-head"><h2>'+esc(r.name||'Sans nom')+'</h2><span>Présent · '+(Number(r.guests_count)||0)+' convive(s)</span></div>'+
        '<div class="date">Réponse : '+esc(fmtDate(r.created_at))+'</div>'+
        (menus?'<div class="menus">'+menus+'</div>':'<p class="muted">Aucun menu renseigné.</p>')+
        (r.dietary?'<div class="note"><strong>Allergies / régime / petit mot :</strong><br>'+esc(r.dietary)+'</div>':'')+
        (r.message?'<div class="note">'+esc(r.message)+'</div>':'')+
      '</section>';
    });

    if(absent.length){
      sections += '<section class="absent"><h2>Absents</h2><ul>'+
        absent.map(function(r){return '<li>'+esc(r.name||'Sans nom')+' — '+esc(fmtDate(r.created_at))+'</li>';}).join('')+
        '</ul></section>';
    }

    return '<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
      '<title>Liste RSVP — Antonio & Axelle</title><style>'+ 
      '@page{size:A4;margin:14mm}*{box-sizing:border-box}body{font-family:Arial,Helvetica,sans-serif;color:#28231f;margin:0;background:#fff;font-size:11.5pt;line-height:1.42}'+
      'header{border-bottom:2px solid #b48a52;padding-bottom:12px;margin-bottom:18px}h1{font-family:Georgia,serif;font-weight:400;font-size:25pt;margin:0;color:#8e6b3e}header p{margin:5px 0 0;color:#665d54}.summary{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin:0 0 18px}.stat{border:1px solid #d9c9b3;padding:10px;text-align:center}.stat strong{display:block;font-family:Georgia,serif;font-size:20pt;font-weight:400;color:#8e6b3e}.guest{break-inside:avoid;border:1px solid #ded6cb;padding:13px;margin:0 0 12px}.guest-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.guest h2,.absent h2{font-family:Georgia,serif;font-weight:400;margin:0;font-size:16pt}.guest-head span{font-size:9.5pt;color:#6e655d}.date,.muted{font-size:9pt;color:#7a7168;margin-top:4px}.menus{margin-top:10px;border-top:1px solid #eee5d9;padding-top:8px}.menu{margin:0 0 8px}.note{background:#faf6ef;border-left:3px solid #c5a26e;padding:8px 10px;margin-top:8px}.absent{margin-top:20px;border-top:1px solid #d9c9b3;padding-top:12px}.absent ul{padding-left:18px}.footer{margin-top:18px;color:#81786f;font-size:8.5pt;text-align:center}@media print{.guest{page-break-inside:avoid}}'+
      '</style></head><body><header><h1>Antonio &amp; Axelle — Liste des réponses</h1><p>Mariage du 26 septembre 2026 · Document destiné au restaurant</p></header>'+ 
      '<div class="summary"><div class="stat"><strong>'+attending.length+'</strong>réponses présentes</div><div class="stat"><strong>'+totalPeople+'</strong>convives attendus</div><div class="stat"><strong>'+absent.length+'</strong>réponses absentes</div></div>'+sections+
      '<div class="footer">Généré le '+esc(generated)+'</div></body></html>';
  }

  async function exportPdf(button){
    var session=loadSession();
    if(!session||!session.access_token){alert('Reconnectez-vous à l’espace mariés avant l’export PDF.');return;}
    var old=button.textContent;
    button.disabled=true;
    button.textContent='Préparation…';
    try{
      var rows=await fetchRows(session.access_token);
      var w=window.open('','_blank');
      if(!w){alert('Autorisez les fenêtres pop-up pour générer le PDF.');return;}
      w.document.open();
      w.document.write(makePrintableHtml(rows));
      w.document.close();
      w.focus();
      setTimeout(function(){w.print();},350);
    }catch(err){
      console.error('Export PDF RSVP:',err);
      alert('Impossible de préparer le PDF. Rechargez la page puis réessayez.');
    }finally{
      button.disabled=false;
      button.textContent=old;
    }
  }

  function install(){
    var panel=document.getElementById('admin-panel');
    if(!panel)return;
    var toolbar=panel.querySelector('.sb-admin-actions');
    if(!toolbar||toolbar.querySelector('[data-sb-export-pdf]'))return;
    var b=document.createElement('button');
    b.type='button';
    b.className='secondary';
    b.setAttribute('data-sb-export-pdf','');
    b.textContent='Télécharger en PDF';
    b.addEventListener('click',function(){exportPdf(b);});
    toolbar.insertBefore(b,toolbar.firstChild);
  }

  var obs=new MutationObserver(function(){install();});
  function boot(){
    var panel=document.getElementById('admin-panel');
    if(panel)obs.observe(panel,{childList:true,subtree:true});
    install();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
