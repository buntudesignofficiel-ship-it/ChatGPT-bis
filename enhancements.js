(function(){
  'use strict';

  var MAIRIE_PHOTO='https://images.openai.com/static-rsc-4/iZI4Dh1JjI2XmCPJlTQN3M8MTUvhGbBI-vckePZPg5b0wh1uQ9-43Cn4sSDB-fP-rBpCd4oCHy1DQQQaLgpL_40Y4bZwkE_DJ-UTwh7Wqf3mreOyeXoqhUSSgOuCHHbSdCx7_cBxQLOl3_TObWYBmQYLHDBPDTtyDXo5vCnDUsIfvu5kam-rEr8aU-D6xdoC?purpose=fullsize';
  var PARC_PHOTO='https://www.roubaixxl.fr/wp-content/uploads/2018/05/barbieux-drone-19-sur-30-1024x576.jpg';
  var PALOMA_PHOTO='https://images.squarespace-cdn.com/content/v1/641483ad9f9f645613956d78/7a324399-432e-4f48-8c00-d9c5dca5d6ec/WhatsApp%2BImage%2B2023-03-27%2Bat%2B12.21.38.jpeg';

  var MAP_MAIRIE='https://www.google.com/maps/search/?api=1&query=Mairie%20de%20Croix%2C%20187%20rue%20Jean%20Jaur%C3%A8s%2C%2059170%20Croix';
  var MAP_PARC='https://www.google.com/maps/search/?api=1&query=Parc%20Barbieux%2C%20Roubaix';
  var MAP_PALOMA='https://www.google.com/maps/search/?api=1&query=Paloma%20Lille%2C%20Vieux%20Lille';

  function icon(type){
    var paths={home:'<path d="M5 12l7-6 7 6v8H5z"/><path d="M9 20v-5h6v5"/>',mairie:'<path d="M4 20h16"/><path d="M6 20V9h12v11"/><path d="M8 9V6h8v3"/><path d="M10 6V4h4v2"/><path d="M9 13h2v3H9zM13 13h2v3h-2z"/>',camera:'<path d="M4 8h4l1.5-2h5L16 8h4v11H4z"/><circle cx="12" cy="13.5" r="3.2"/>',toast:'<path d="M7 4h5l-1 7c-.2 1.6-1.2 2.5-2.5 2.5S6.2 12.6 6 11z"/><path d="M9 13.5V20M6.5 20h5"/><path d="M14 5h4l-.7 5c-.2 1.4-1 2.2-2.1 2.2-.8 0-1.4-.4-1.8-1"/><path d="M15.2 12.2V20M13 20h4.5"/>',heart:'<path d="M12 20S4 15.3 4 9.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 8 3.5C20 15.3 12 20 12 20z"/>',suit:'<path d="M8 4l4 3 4-3 2 3v13H6V7z"/><path d="M10 7l2 4 2-4M12 11v9"/>',dress:'<path d="M10 4h4l1 5 4 10H5L9 9z"/><path d="M9 9h6"/>'};
    return '<svg viewBox="0 0 24 24" aria-hidden="true">'+(paths[type]||paths.heart)+'</svg>';
  }

  function pad2(n){return n<10?'0'+n:String(n);}

  function addCountdown(){
    var hero=document.querySelector('.hero');
    if(!hero||hero.querySelector('.aa-countdown'))return;
    var date=hero.querySelector('.date');
    if(!date)return;
    var wrap=document.createElement('div');
    wrap.className='aa-countdown-wrap';
    wrap.innerHTML='<div class="aa-countdown"><div class="aa-countdown-box"><strong data-aa-days>0</strong><span>jours</span></div><div class="aa-countdown-box"><strong data-aa-hours>0</strong><span>heures</span></div><div class="aa-countdown-box"><strong data-aa-minutes>0</strong><span>minutes</span></div><div class="aa-countdown-box"><strong data-aa-seconds>0</strong><span>secondes</span></div></div><p class="aa-countdown-caption">Jusqu’au grand jour</p><div class="aa-countdown-heart" aria-hidden="true">'+icon('heart')+'</div>';
    if(date.parentNode)date.parentNode.insertBefore(wrap,date.nextSibling);
    var target=new Date('2026-09-26T10:30:00+02:00').getTime();
    function tick(){
      if(!document.documentElement.contains(wrap))return;
      var delta=Math.max(0,target-Date.now());
      var d=Math.floor(delta/86400000);delta%=86400000;
      var h=Math.floor(delta/3600000);delta%=3600000;
      var m=Math.floor(delta/60000),s=Math.floor((delta%60000)/1000);
      wrap.querySelector('[data-aa-days]').textContent=d;
      wrap.querySelector('[data-aa-hours]').textContent=pad2(h);
      wrap.querySelector('[data-aa-minutes]').textContent=pad2(m);
      wrap.querySelector('[data-aa-seconds]').textContent=pad2(s);
    }
    tick();setInterval(tick,1000);
  }

  function setHtmlIfChanged(el,html){if(el&&el.innerHTML!==html)el.innerHTML=html;}
  function setTextIfChanged(el,text){if(el&&el.textContent!==text)el.textContent=text;}

  function polishHero(){
    document.title='Antonio & Axelle — 26.09.2026';
    setHtmlIfChanged(document.querySelector('.hero .eyebrow'),'Nous avons une belle nouvelle à vous annoncer :<strong>Nous Nous Marrions</strong>');
    setHtmlIfChanged(document.querySelector('.hero .names'),'<span>Antonio</span><span class="amp">&amp;</span><span>Axelle</span>');
    setTextIfChanged(document.querySelector('.signoff > p'),'Antonio VIEIRA et Axelle MIGUEL');
  }

  function addEventIcons(){
    var steps=document.querySelectorAll('.travel-step');
    if(!steps.length)return;
    var types=['home','mairie','camera','toast','heart'];
    for(var i=0;i<steps.length;i++){
      var step=steps[i];
      if(!step.querySelector('.aa-event-icon')){
        var el=document.createElement('span');
        el.className='aa-event-icon';
        el.innerHTML=icon(types[i]||'heart');
        step.insertBefore(el,step.firstChild);
      }
    }
    var ceremony=steps[1];
    if(ceremony){
      var title=ceremony.querySelector('.ttl');
      if(title)title.textContent='Cérémonie civile';
      var mairieLink=ceremony.querySelector('.loc-link');
      if(mairieLink){
        mairieLink.href=MAP_MAIRIE;
        mairieLink.textContent='📍 Mairie de Croix';
        mairieLink.title='Ouvrir ce lieu dans Google Maps';
      }
    }
    if(steps[2])steps[2].classList.add('aa-parc-step');
    var links=document.querySelectorAll('.travel-step .loc-link');
    for(var j=0;j<links.length;j++)links[j].title='Ouvrir ce lieu dans Google Maps';
  }

  function addPlacesCarousel(){
    if(document.querySelector('.aa-places-carousel'))return;
    var dress=document.querySelector('.dresscode');
    if(!dress||!dress.parentNode)return;

    var old=document.querySelector('.aa-mairie');
    if(old&&old.parentNode)old.parentNode.removeChild(old);

    var section=document.createElement('section');
    section.className='aa-places-carousel is-visible';
    section.innerHTML='\
      <div class="aa-place-slides">\
        <article class="aa-place-slide is-active" data-aa-slide="0">\
          <h2>Mairie de Croix</h2>\
          <img src="'+MAIRIE_PHOTO+'" alt="Hôtel de Ville de Croix" loading="lazy">\
          <p>La cérémonie civile aura lieu à la Mairie de Croix, 187 rue Jean Jaurès, 59170 Croix.</p>\
          <a class="aa-map-button" href="'+MAP_MAIRIE+'" target="_blank" rel="noopener noreferrer">⌖ Voir sur Maps</a>\
        </article>\
        <article class="aa-place-slide" data-aa-slide="1">\
          <h2>Parc Barbieux</h2>\
          <img src="'+PARC_PHOTO+'" alt="Parc Barbieux" loading="lazy">\
          <p>On prendra de belles photos ensemble dans le parc.</p>\
          <a class="aa-map-button" href="'+MAP_PARC+'" target="_blank" rel="noopener noreferrer">⌖ Voir sur Maps</a>\
        </article>\
        <article class="aa-place-slide" data-aa-slide="2">\
          <h2>Paloma, Vieux Lille</h2>\
          <img src="'+PALOMA_PHOTO+'" alt="Paloma à Lille" loading="lazy">\
          <p>On partagera un bon moment convivial autour du repas de mariage.</p>\
          <a class="aa-map-button" href="'+MAP_PALOMA+'" target="_blank" rel="noopener noreferrer">⌖ Voir sur Maps</a>\
        </article>\
      </div>\
      <div class="aa-carousel-dots" aria-label="Choisir un lieu">\
        <button type="button" class="is-active" data-aa-dot="0" aria-label="Mairie de Croix"></button>\
        <button type="button" data-aa-dot="1" aria-label="Parc Barbieux"></button>\
        <button type="button" data-aa-dot="2" aria-label="Paloma"></button>\
      </div>';
    dress.parentNode.insertBefore(section,dress);

    var slides=section.querySelectorAll('.aa-place-slide');
    var dots=section.querySelectorAll('[data-aa-dot]');
    var current=0;
    var timer=null;
    function show(index){
      current=(index+slides.length)%slides.length;
      for(var i=0;i<slides.length;i++)slides[i].classList.toggle('is-active',i===current);
      for(var j=0;j<dots.length;j++)dots[j].classList.toggle('is-active',j===current);
    }
    function restart(){
      if(timer)clearInterval(timer);
      timer=setInterval(function(){show(current+1);},5000);
    }
    for(var d=0;d<dots.length;d++){
      (function(index){dots[index].addEventListener('click',function(){show(index);restart();});})(d);
    }
    restart();
  }

  function fixTimelineFocus(){
    var map=document.getElementById('travel-map');
    var steps=document.querySelectorAll('.travel-step');
    var waypointEls=document.querySelectorAll('.travel-waypoint');
    if(!map||!steps.length)return;

    var viewportH=window.innerHeight||document.documentElement.clientHeight;
    var mapRect=map.getBoundingClientRect();
    var visibleStart=viewportH*.88;
    var visibleEnd=viewportH*.18;
    var raw=(visibleStart-mapRect.top)/(mapRect.height+visibleStart-visibleEnd);
    var progress=Math.max(0,Math.min(1,raw));
    var exact=progress*(steps.length-1);
    var nearest=Math.round(exact);

    steps.forEach(function(step,index){
      step.style.removeProperty('transform');
      step.style.removeProperty('opacity');
      var distance=Math.abs(index-exact);
      var influence=Math.max(0,1-distance);
      var zoom=.96+influence*.12;
      var time=step.querySelector('.time');
      var title=step.querySelector('.ttl');
      var iconEl=step.querySelector('.aa-event-icon');
      if(time){time.style.transform='scale('+zoom.toFixed(3)+')';time.style.transformOrigin='left center';}
      if(title){title.style.transform='scale('+zoom.toFixed(3)+')';title.style.transformOrigin='left center';}
      if(iconEl){iconEl.style.transform='scale('+(.98+influence*.08).toFixed(3)+')';iconEl.style.transformOrigin='left center';}
      step.classList.toggle('is-focused',index===nearest&&distance<.34);
    });

    var fractions=[0,.25,.5,.75,1];
    for(var i=0;i<waypointEls.length;i++){
      var f=fractions[i]||0;
      var current=Math.abs(progress-f)<=.012;
      var passed=progress>f+.012;
      waypointEls[i].classList.toggle('is-current',current);
      waypointEls[i].classList.toggle('is-passed',passed);
    }
  }

  function polishDressCode(){
    var section=document.querySelector('.dresscode');
    if(!section||section.querySelector('.aa-dress-grid'))return;
    var heading=section.querySelector('h2');
    var grid=document.createElement('div');
    grid.className='aa-dress-grid';
    grid.innerHTML='<div class="aa-dress-card"><div class="aa-dress-icon">'+icon('suit')+'</div><strong>Homme</strong><div class="aa-colors"><span class="aa-color aa-color-white" title="Blanc"></span><span class="aa-color aa-color-black" title="Noir"></span></div><p>Blanc et noir</p></div><div class="aa-dress-card"><div class="aa-dress-icon">'+icon('dress')+'</div><strong>Femme</strong><div class="aa-colors"><span class="aa-color aa-color-offwhite" title="Blanc cassé"></span></div><p>Blanc cassé</p></div>';
    if(heading&&heading.parentNode)heading.parentNode.insertBefore(grid,heading.nextSibling);else section.insertBefore(grid,section.firstChild);
    var paras=section.querySelectorAll('p'),kept=false;
    for(var i=0;i<paras.length;i++){
      var p=paras[i],parent=p.parentNode,insideCard=false;
      while(parent&&parent!==section){
        if(parent.className&&String(parent.className).indexOf('aa-dress-card')!==-1){insideCard=true;break;}
        parent=parent.parentNode;
      }
      if(insideCard)continue;
      if(!kept){p.className=(p.className||'')+' aa-dress-copy';p.textContent='Pour cette journée, nous serions ravis de vous voir dans ces tons.';kept=true;}
      else if(p.parentNode)p.parentNode.removeChild(p);
    }
  }

  function apply(){
    if(!document.querySelector('.hero'))return false;
    polishHero();addCountdown();addEventIcons();addPlacesCarousel();polishDressCode();fixTimelineFocus();
    return true;
  }

  function boot(){
    var tries=0;
    function attempt(){tries++;if(apply()||tries>=12)return;setTimeout(attempt,250);}
    attempt();
    window.addEventListener('scroll',fixTimelineFocus,{passive:true});
    window.addEventListener('resize',fixTimelineFocus);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
