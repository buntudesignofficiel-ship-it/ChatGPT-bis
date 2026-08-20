(function(){
  'use strict';
  var originalMatchMedia = window.matchMedia;
  if (originalMatchMedia) {
    window.matchMedia = function(query){
      if (query === '(prefers-reduced-motion: reduce)') {
        return {
          matches: true,
          media: query,
          onchange: null,
          addListener: function(){},
          removeListener: function(){},
          addEventListener: function(){},
          removeEventListener: function(){},
          dispatchEvent: function(){ return false; }
        };
      }
      return originalMatchMedia.call(window, query);
    };
  }

  var oldIntro = document.querySelector('.intro-overlay');
  if (oldIntro) oldIntro.style.setProperty('display','none','important');
  var videoIntro = document.getElementById('aa-video-intro');
  if (videoIntro && videoIntro.parentNode) videoIntro.parentNode.removeChild(videoIntro);
  document.body.classList.remove('intro-lock');

  setTimeout(function(){
    if (originalMatchMedia) window.matchMedia = originalMatchMedia;
  }, 1200);
})();
