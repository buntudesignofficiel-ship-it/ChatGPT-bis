(function(){
  'use strict';

  var SUPABASE_URL='https://zthqpyqejwaqxzzqlcgl.supabase.co';
  var SUPABASE_KEY='sb_publishable_haEwhpgQwLdN30iCxPk8Tw_hALbITcU';
  var refreshTimer=null;

  function headers(){
    return {
      'apikey':SUPABASE_KEY,
      'Authorization':'Bearer '+SUPABASE_KEY,
      'Content-Type':'application/json'
    };
  }

  function setCounter(total){
    var el=document.getElementById('confirmed-counter');
    if(!el)return;
    total=Number(total)||0;
    if(total>0){
      el.hidden=false;
      el.textContent=total===1
        ? '🤍 1 personne a déjà confirmé sa présence'
        : '🤍 '+total+' personnes ont déjà confirmé leur présence';
    }else{
      el.hidden=true;
      el.textContent='';
    }
  }

  async function refreshPublicCounter(){
    try{
      var res=await fetch(SUPABASE_URL+'/rest/v1/rpc/confirmed_guest_count',{
        method:'POST',
        headers:headers(),
        cache:'no-store',
        body:'{}'
      });
      if(!res.ok)throw new Error('Supabase RPC '+res.status+' '+(await res.text()));
      var total=await res.json();
      setCounter(total);
    }catch(err){
      console.warn('Compteur RSVP public non actualisé:',err);
    }
  }

  function scheduleRefresh(){
    clearTimeout(refreshTimer);
    refreshTimer=setTimeout(refreshPublicCounter,350);
  }

  function boot(){
    refreshPublicCounter();
    setTimeout(refreshPublicCounter,1200);
    window.addEventListener('focus',scheduleRefresh);
    document.addEventListener('visibilitychange',function(){if(!document.hidden)scheduleRefresh();});

    var root=document.getElementById('root')||document.body;
    if('MutationObserver' in window&&root){
      new MutationObserver(function(){
        if(document.querySelector('.confirm-card')){
          setTimeout(refreshPublicCounter,600);
          setTimeout(refreshPublicCounter,1800);
        }
      }).observe(root,{childList:true,subtree:true});
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
