(function(){
  'use strict';

  var MAIRIE_PHOTO='https://www.communes.com/images/orig/nord-pas-de-calais/nord/croix_59170/croix_319897.jpg';
  var MAP_MAIRIE='https://www.google.com/maps/search/?api=1&query=Mairie%20de%20Croix%2C%20187%20rue%20Jean%20Jaur%C3%A8s%2C%2059170%20Croix';

  function icon(type){
    var paths={
      home:'<path d="M5 12l7-6 7 6v8H5z"/><path d="M9 20v-5h6v5"/>',
      mairie:'<path d="M4 20h16"/><path d="M6 20V9h12v11"/><path d="M8 9V6h8v3"/><path d="M10 6V4h4v2"/><path d="M9 13h2v3H9zM13 13h2v3h-2z"/>',
      camera:'<path d="M4 8h4l1.5-2h5L16 8h4v11H4z"/><circle cx="12" cy="13.5" r="3.2"/>',
      toast:'<path d="M7 4h5l-1 7c-.2 1.6-1.2 2.5-2.5 2.5S6.2 12.6 6 11z"/><path d="M9 13.5V20M6.5 20h5"/><path d="M14 5h4l-.7 5c-.2 1.4-1 2.2-2.1 2.2-.8 0-1.4-.4-1.8-1"/><path d="M15.2 12.2V20M13 20h4.5"/>',
      heart:'<path d="M12 20S4 15.3 4 9.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 8 3.5C20 15.3 12 20 12 20z"/>',
      suit:'<path d="M8 4l4 3 4-3 2 3v13H6V7z"/><path d="M10 7l2 4 2-4M12 11v9"/>',
      dress:'<path d="M10 4h4l1 5 4 10H5L9 9z"/><path d="M9 9h6"/>'
    };
    return '<svg viewBox="0 0 24 24" aria-hidden="true">'+(paths[type]||paths.heart)+'</svg>';
  }

  function addCountdown(){
    var hero=document.querySelector('.hero');
    if(!hero||hero.querySelector('.aa-countdown')) return;
    var date=hero.querySelector('.date');
    if(!date) return;
    var wrap=document.createElement('div');
    wrap.className='aa-countdown-wrap';
    wrap.innerHTML='<div class="aa-countdown">'+
      '<div class="aa-countdown-box"><strong data-aa-days>0</strong><span>jours</span></div>'+ 
      '<div class="aa-countdown-box"><strong data-aa-hours>0</strong><span>heures</span></div>'+ 
      '<div class="aa-countdown-box"><strong data-aa-minutes>0</strong><span>minutes</span></div>'+ 
      '<div class="aa-countdown-box"><strong data-aa-seconds>0</strong><span>secondes</span></div>'+ 
      '</div><p class="aa-countdown-caption">Jusqu’au grand jour</p>';
    date.insertAdjacentElement('afterend',wrap);
    var target=new Date('2026-09-26T10:30:00+02:00').getTime();
    function tick(){
      var delta=Math.max(0,target-Date.now());
      var d=Math.floor(delta/86400000); delta%=86400000;
      var h=Math.floor(delta/3600000); delta%=3600000;
      var m=Math.floor(delta/60000); var s=Math.floor((delta%60000)/1000);
      wrap.querySelector('[data-aa-days]').textContent=d;
      wrap.querySelector('[data-aa-hours]').textContent=String(h).padStart(2,'0');
      wrap.querySelector('[data-aa-minutes]').textContent=String(m).padStart(2,'0');
      wrap.querySelector('[data-aa-seconds]').textContent=String(s).padStart(2,'0');
    }
    tick(); setInterval(tick,1000);
  }

  function polishHero(){
    document.title='Antonio & Axelle — 26.09.2026';
    var eyebrow=document.querySelector('.hero .eyebrow');
    if(eyebrow) eyebrow.innerHTML='Nous avons une belle nouvelle à vous annoncer :<strong>Nous Nous Marrions</strong>';
    var names=document.querySelector('.hero .names');
    if(names) names.innerHTML='<span>Antonio</span><span class="amp">&amp;</span><span>Axelle</span>';
    var bookEyebrow=document.querySelector('.book-page-eyebrow');
    if(bookEyebrow) bookEyebrow.textContent='Nous avons une belle nouvelle à vous annoncer : Nous Nous Marrions';
    var bookNames=document.querySelector('.book-page-names');
    if(bookNames) bookNames.innerHTML='Antonio &amp; Axelle';
    var sign=document.querySelector('.signoff > p');
    if(sign) sign.textContent='Antonio VIEIRA et Axelle MIGUEL';
  }

  function addEventIcons(){
    var steps=document.querySelectorAll('.travel-step');
    if(!steps.length) return;
    var types=['home','mairie','camera','toast','heart'];
    steps.forEach(function(step,i){
      if(step.querySelector('.aa-event-icon')) return;
      var el=document.createElement('span'); el.className='aa-event-icon'; el.innerHTML=icon(types[i]||'heart');
      step.insertBefore(el,step.firstChild);
    });
    document.querySelectorAll('.travel-step .loc-link').forEach(function(a){a.title='Ouvrir ce lieu dans Google Maps';});
  }

  function addMairieSection(){
    if(document.querySelector('.aa-mairie')) return;
    var timeline=document.querySelector('.travel-map-timeline');
    var dress=document.querySelector('.dresscode');
    if(!timeline||!dress) return;
    var section=document.createElement('section');
    section.className='aa-mairie';
    section.setAttribute('data-reveal','');
    section.innerHTML='<h2>Mairie de Croix</h2>'+ 
      '<img class="aa-mairie-photo" src="'+MAIRIE_PHOTO+'" alt="Hôtel de Ville de Croix" loading="lazy">'+
      '<p>La cérémonie civile aura lieu à la Mairie de Croix, 187 rue Jean Jaurès, 59170 Croix.</p>'+ 
      '<a class="aa-map-button" href="'+MAP_MAIRIE+'" target="_blank" rel="noopener noreferrer">⌖ Voir sur Maps</a>';
    dress.parentNode.insertBefore(section,dress);
  }

  function polishDressCode(){
    var section=document.querySelector('.dresscode');
    if(!section||section.querySelector('.aa-dress-grid')) return;
    var heading=section.querySelector('h2');
    var grid=document.createElement('div');
    grid.className='aa-dress-grid';
    grid.innerHTML='<div class="aa-dress-card"><div class="aa-dress-icon">'+icon('suit')+'</div><strong>Homme</strong><div class="aa-colors"><span class="aa-color aa-color-white" title="Blanc"></span><span class="aa-color aa-color-black" title="Noir"></span></div><p>Blanc et noir</p></div>'+ 
      '<div class="aa-dress-card"><div class="aa-dress-icon">'+icon('dress')+'</div><strong>Femme</strong><div class="aa-colors"><span class="aa-color aa-color-offwhite" title="Blanc cassé"></span></div><p>Blanc cassé</p></div>';
    if(heading) heading.insertAdjacentElement('afterend',grid); else section.prepend(grid);
    var paras=Array.from(section.querySelectorAll('p')).filter(function(p){return !p.closest('.aa-dress-card');});
    paras.forEach(function(p,i){if(i===0){p.className+=' aa-dress-copy';p.textContent='Pour cette journée, nous serions ravis de vous voir dans ces tons.';}else{p.remove();}});
  }

  function apply(){
    polishHero(); addCountdown(); addEventIcons(); addMairieSection(); polishDressCode();
  }

  window.addEventListener('load',function(){setTimeout(apply,180);setTimeout(apply,800);});
  var obs=new MutationObserver(function(){if(document.querySelector('.hero')) apply();});
  obs.observe(document.documentElement,{childList:true,subtree:true});
})();
