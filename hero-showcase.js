(function(){
  'use strict';

  function getVariant(){
    try {
      var v = new URLSearchParams(window.location.search).get('hero');
      if(v === 'cinematic' || v === 'minimal' || v === 'elegant') return v;
    } catch(e) {}
    return 'minimal';
  }

  function startWhenIntroEnds(section){
    var started = false;
    function start(){
      if(started) return;
      started = true;
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){ section.classList.add('is-animating'); });
      });
    }

    function check(){
      if(!document.getElementById('aa-video-intro')) start();
    }

    check();
    if(started) return;

    var observer = new MutationObserver(function(){
      if(!document.getElementById('aa-video-intro')){
        observer.disconnect();
        setTimeout(start, 120);
      }
    });
    observer.observe(document.body, {childList:true});

    /* Safety fallback if the intro is skipped or altered. */
    setTimeout(start, 15000);
  }

  function mountHero(){
    if(document.querySelector('.hero-showcase')) return;
    var existingHero = document.querySelector('.hero');
    if(!existingHero) return;

    var section = document.createElement('section');
    section.className = 'hero-showcase';
    section.setAttribute('data-variant', getVariant());
    section.setAttribute('aria-label', 'Une date à retenir — Antonio et Axelle');

    var frame = document.createElement('div');
    frame.className = 'hero-showcase__frame';

    var img = document.createElement('img');
    img.className = 'hero-showcase__img';
    img.src = 'apercu-mariage-whatsapp-1200x630.jpg';
    img.alt = 'Une date à retenir — Antonio et Axelle — 26 septembre 2026';
    img.width = 1200;
    img.height = 630;
    img.decoding = 'async';
    img.fetchPriority = 'high';

    frame.appendChild(img);
    section.appendChild(frame);
    existingHero.parentNode.insertBefore(section, existingHero);

    startWhenIntroEnds(section);
  }

  if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountHero, {once:true});
  } else {
    mountHero();
  }
})();
