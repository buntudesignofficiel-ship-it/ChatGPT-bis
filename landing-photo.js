(function(){
  'use strict';

  function ensurePhoto(){
    var hero=document.querySelector('.hero');
    if(!hero||document.querySelector('.aa-landing-photo'))return;

    var section=document.createElement('section');
    section.className='aa-landing-photo';
    section.setAttribute('aria-label','Une date à retenir — Antonio et Axelle');

    var img=document.createElement('img');
    img.src='apercu-mariage-whatsapp-1200x630.jpg';
    img.alt='Une date à retenir — Antonio et Axelle — 26 septembre 2026';
    img.width=1200;
    img.height=630;
    img.decoding='async';
    img.fetchPriority='high';

    section.appendChild(img);
    hero.parentNode.insertBefore(section,hero);
  }

  function boot(){
    ensurePhoto();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
