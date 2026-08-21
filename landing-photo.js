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
    sizePhoto();
  }

  function viewportHeight(){
    if(window.visualViewport&&window.visualViewport.height)return window.visualViewport.height;
    return window.innerHeight||document.documentElement.clientHeight||852;
  }

  function sizePhoto(){
    var hero=document.querySelector('.hero');
    var photo=document.querySelector('.aa-landing-photo');
    if(!hero||!photo)return;

    if(window.matchMedia('(max-width: 700px)').matches){
      /* Ne touche pas au bloc beige : on mesure sa hauteur réelle puis on donne à la photo l'espace restant. */
      var vh=viewportHeight();
      var heroH=hero.getBoundingClientRect().height;
      var remaining=Math.round(vh-heroH);
      photo.style.height=Math.max(220,remaining)+'px';
    }else{
      photo.style.height='clamp(300px,42vw,520px)';
    }
  }

  function boot(){
    ensurePhoto();
    sizePhoto();
    setTimeout(sizePhoto,120);
    setTimeout(sizePhoto,500);
    window.addEventListener('resize',sizePhoto,{passive:true});
    if(window.visualViewport)window.visualViewport.addEventListener('resize',sizePhoto,{passive:true});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
