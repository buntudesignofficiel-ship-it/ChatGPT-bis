(function(){
  'use strict';

  var VIDEO_SRC='AdobeStock_412765024.MOV';

  function startIntro(){
    if(document.getElementById('aa-video-intro')) return;
    document.body.classList.add('intro-lock');

    var wrap=document.createElement('div');
    wrap.id='aa-video-intro';
    wrap.setAttribute('aria-label','Ouverture de l’invitation');
    wrap.style.cssText='position:fixed;inset:0;width:100vw;height:100vh;height:100dvh;z-index:2147483647;background:#fff;overflow:hidden;opacity:1;transition:opacity .9s ease;';

    var video=document.createElement('video');
    video.muted=true; video.defaultMuted=true; video.autoplay=true; video.playsInline=true;
    video.setAttribute('muted',''); video.setAttribute('autoplay',''); video.setAttribute('playsinline',''); video.setAttribute('webkit-playsinline','');
    video.preload='auto'; video.src=VIDEO_SRC;
    video.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center center;background:#fff;';

    var announcement=document.createElement('div');
    announcement.style.cssText='position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:28px;color:#2b241e;opacity:0;transform:translateY(10px);transition:opacity 1s ease,transform 1s ease;pointer-events:none;text-shadow:0 1px 10px rgba(255,255,255,.85);';
    announcement.innerHTML='<div style="font:italic 18px Georgia,serif;letter-spacing:.04em;margin-bottom:18px">Nous avons une belle nouvelle à vous annoncer</div><div style="font:32px Georgia,serif;line-height:1.15;margin-bottom:14px">Antonio <span style="font-style:italic">&amp;</span> Axelle</div><div style="font:15px Georgia,serif;letter-spacing:.28em">26 · 09 · 2026</div>';

    var white=document.createElement('div');
    white.style.cssText='position:absolute;inset:0;z-index:3;background:#fff;opacity:0;transition:opacity 1s ease;pointer-events:none;';

    var fallback=document.createElement('button');
    fallback.type='button'; fallback.textContent='Ouvrir l’invitation';
    fallback.style.cssText='display:none;position:absolute;left:50%;bottom:9vh;transform:translateX(-50%);z-index:4;padding:.7rem 1rem;border:1px solid #d7c6ad;border-radius:999px;background:rgba(255,255,255,.92);color:#5f4b35;font:16px Georgia,serif;';

    wrap.appendChild(video); wrap.appendChild(announcement); wrap.appendChild(white); wrap.appendChild(fallback); document.body.appendChild(wrap);

    var finished=false, sequenceStarted=false;
    function finish(){
      if(finished) return; finished=true;
      wrap.style.opacity='0'; document.body.classList.remove('intro-lock');
      setTimeout(function(){ if(wrap.parentNode) wrap.parentNode.removeChild(wrap); },950);
    }
    function showAnnouncement(){
      if(sequenceStarted) return; sequenceStarted=true;
      announcement.style.opacity='1'; announcement.style.transform='translateY(0)';
      setTimeout(function(){ white.style.opacity='1'; },1900);
      setTimeout(finish,3000);
    }

    video.addEventListener('ended',showAnnouncement);
    video.addEventListener('error',function(){ fallback.style.display='block'; });
    fallback.addEventListener('click',function(){ fallback.style.display='none'; var p=video.play(); if(p&&typeof p.catch==='function') p.catch(showAnnouncement); });
    var playPromise=video.play();
    if(playPromise&&typeof playPromise.catch==='function') playPromise.catch(function(){ fallback.style.display='block'; });
    setTimeout(function(){ if(!finished && video.paused && video.currentTime<0.15) fallback.style.display='block'; },1200);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',startIntro); else startIntro();
})();
