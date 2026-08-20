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

    var style=document.createElement('style');
    style.textContent='@keyframes aaTwinkle{0%,100%{opacity:.08;transform:scale(.45) rotate(0deg)}45%{opacity:1;transform:scale(1.2) rotate(15deg)}70%{opacity:.35;transform:scale(.75) rotate(30deg)}}';
    wrap.appendChild(style);

    var video=document.createElement('video');
    video.muted=true; video.defaultMuted=true; video.autoplay=true; video.playsInline=true;
    video.setAttribute('muted',''); video.setAttribute('autoplay',''); video.setAttribute('playsinline',''); video.setAttribute('webkit-playsinline','');
    video.preload='auto'; video.src=VIDEO_SRC;
    video.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center center;background:#fff;';

    var white=document.createElement('div');
    white.style.cssText='position:absolute;inset:0;z-index:2;background:#fff;opacity:0;transition:opacity 1.25s ease;pointer-events:none;';

    var announcement=document.createElement('div');
    announcement.style.cssText='position:absolute;inset:0;z-index:3;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:28px;color:#2d2924;opacity:0;transform:translateY(8px);transition:opacity 1s ease,transform 1s ease;pointer-events:none;text-shadow:0 1px 12px rgba(255,255,255,.92);';
    announcement.innerHTML='<div style="font-family:Georgia,\'Times New Roman\',serif;font-size:11px;font-weight:400;letter-spacing:.34em;text-transform:uppercase;margin-bottom:16px;color:#6e675f">Une belle nouvelle</div><div style="font-family:Georgia,\'Times New Roman\',serif;font-size:34px;font-weight:700;font-style:italic;line-height:1.08;margin-bottom:14px;color:#221f1b">Antonio <span style="font-weight:600">&amp;</span> Axelle</div><div style="font-family:Georgia,\'Times New Roman\',serif;font-size:12px;font-weight:400;letter-spacing:.36em;color:#6e675f">26 · 09 · 2026</div>';

    var sparkles=document.createElement('div');
    sparkles.style.cssText='position:absolute;inset:0;z-index:4;opacity:0;transition:opacity .8s ease;pointer-events:none;';
    var pts=[['18%','30%','1.5s','0s'],['78%','25%','1.9s','.25s'],['25%','68%','1.7s','.55s'],['72%','72%','1.35s','.15s'],['50%','20%','2.1s','.7s'],['86%','52%','1.6s','.4s'],['12%','54%','1.8s','.8s']];
    for(var i=0;i<pts.length;i++){
      var s=document.createElement('span');
      s.textContent='✦';
      s.style.cssText='position:absolute;left:'+pts[i][0]+';top:'+pts[i][1]+';font-size:'+(i%2?14:18)+'px;color:#c9ae72;opacity:.08;animation:aaTwinkle '+pts[i][2]+' ease-in-out '+pts[i][3]+' infinite;';
      sparkles.appendChild(s);
    }

    var fallback=document.createElement('button');
    fallback.type='button'; fallback.textContent='Ouvrir l’invitation';
    fallback.style.cssText='display:none;position:absolute;left:50%;bottom:9vh;transform:translateX(-50%);z-index:5;padding:.7rem 1rem;border:1px solid #d7c6ad;border-radius:999px;background:rgba(255,255,255,.92);color:#5f4b35;font:16px Georgia,serif;';

    wrap.appendChild(video); wrap.appendChild(white); wrap.appendChild(announcement); wrap.appendChild(sparkles); wrap.appendChild(fallback); document.body.appendChild(wrap);

    var finished=false, sequenceStarted=false;
    function finish(){
      if(finished) return; finished=true;
      wrap.style.opacity='0'; document.body.classList.remove('intro-lock');
      setTimeout(function(){ if(wrap.parentNode) wrap.parentNode.removeChild(wrap); },950);
    }
    function beginLightAndAnnouncement(){
      if(sequenceStarted) return; sequenceStarted=true;
      white.style.opacity='.72';
      setTimeout(function(){
        announcement.style.opacity='1';
        announcement.style.transform='translateY(0)';
        sparkles.style.opacity='1';
      },380);
    }
    function completeSequence(){
      beginLightAndAnnouncement();
      white.style.opacity='1';
      setTimeout(function(){ sparkles.style.opacity='.9'; },250);
      setTimeout(finish,2600);
    }

    video.addEventListener('timeupdate',function(){
      var d=video.duration;
      if(isFinite(d) && d>0 && video.currentTime>=d*.72) beginLightAndAnnouncement();
    });
    video.addEventListener('ended',completeSequence);
    video.addEventListener('error',function(){ fallback.style.display='block'; });
    fallback.addEventListener('click',function(){ fallback.style.display='none'; var p=video.play(); if(p&&typeof p.catch==='function') p.catch(completeSequence); });
    var playPromise=video.play();
    if(playPromise&&typeof playPromise.catch==='function') playPromise.catch(function(){ fallback.style.display='block'; });
    setTimeout(function(){ if(!finished && video.paused && video.currentTime<0.15) fallback.style.display='block'; },1200);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',startIntro); else startIntro();
})();
