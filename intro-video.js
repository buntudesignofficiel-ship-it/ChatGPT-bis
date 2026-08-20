(function(){
  'use strict';

  var VIDEO_SRC='AdobeStock_412765024.mp4';

  function startIntro(){
    if(document.getElementById('aa-video-intro')) return;

    var oldIntro=document.querySelector('.intro-overlay');
    if(oldIntro) oldIntro.style.setProperty('display','none','important');
    document.body.classList.add('intro-lock');

    var wrap=document.createElement('div');
    wrap.id='aa-video-intro';
    wrap.setAttribute('aria-label','Ouverture de l’invitation');
    wrap.style.cssText='position:fixed;inset:0;width:100vw;height:100vh;height:100dvh;z-index:2147483647;background:#fff;overflow:hidden;opacity:1;transition:opacity .8s ease;';

    var video=document.createElement('video');
    video.muted=true;
    video.defaultMuted=true;
    video.autoplay=true;
    video.playsInline=true;
    video.setAttribute('muted','');
    video.setAttribute('autoplay','');
    video.setAttribute('playsinline','');
    video.setAttribute('webkit-playsinline','');
    video.preload='auto';
    video.src=VIDEO_SRC;
    video.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center center;background:#fff;';

    var white=document.createElement('div');
    white.style.cssText='position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none;transition:opacity .75s ease;';

    var fallback=document.createElement('button');
    fallback.type='button';
    fallback.textContent='Ouvrir l’invitation';
    fallback.style.cssText='display:none;position:absolute;left:50%;bottom:9vh;transform:translateX(-50%);z-index:3;padding:.7rem 1rem;border:1px solid #d7c6ad;border-radius:999px;background:rgba(255,255,255,.92);color:#5f4b35;font:16px Georgia,serif;';

    wrap.appendChild(video);
    wrap.appendChild(white);
    wrap.appendChild(fallback);
    document.body.appendChild(wrap);

    var finished=false;
    function finish(){
      if(finished) return;
      finished=true;
      white.style.opacity='1';
      setTimeout(function(){
        wrap.style.opacity='0';
        document.body.classList.remove('intro-lock');
        setTimeout(function(){ if(wrap.parentNode) wrap.parentNode.removeChild(wrap); },850);
      },500);
    }

    video.addEventListener('timeupdate',function(){
      var t=video.currentTime||0;
      var d=isFinite(video.duration)?video.duration:3.4;
      if(t>=Math.max(2.55,d-0.7)) white.style.opacity='1';
    });
    video.addEventListener('ended',finish);
    video.addEventListener('error',function(){
      fallback.style.display='block';
    });

    fallback.addEventListener('click',function(){
      fallback.style.display='none';
      var p=video.play();
      if(p&&typeof p.catch==='function') p.catch(function(){ finish(); });
    });

    var playPromise=video.play();
    if(playPromise&&typeof playPromise.catch==='function'){
      playPromise.catch(function(){ fallback.style.display='block'; });
    }

    setTimeout(function(){
      if(!finished && video.paused && video.currentTime<0.15) fallback.style.display='block';
    },1200);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',startIntro);
  else startIntro();
})();
