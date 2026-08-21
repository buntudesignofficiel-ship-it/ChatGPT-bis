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
    if(total>0){
      el.hidden=false;
      el.textContent='🤍 '+total+' personne'+(total>1?'s ont':' a')+' déjà confirmé sa présence';
    }else{
      el.hidden=true;
      el.textContent='';
    }
  }

  async function refreshPublicCounter(){
    try{
      var query='/rest/v1/guest?select=attendance,guests_count&attendance=eq.yes';
      var res=await fetch(SUPABASE_URL+query,{headers:headers(),cache:'no-store'});
      if(!res.ok)throw new Error('Supabase '+res.status+' '+(await res.text()));
      var rows=await res.json();
      var total=rows.reduce(function(sum,row){return sum+(Number(row.guests_count)||0);},0);
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
      new MutationObserver(function(mutations){
        for(var i=0;i<mutations.length;i++){
          if(document.querySelector('.confirm-card')){
            setTimeout(refreshPublicCounter,600);
            setTimeout(refreshPublicCounter,1800);
            break;
          }
        }
      }).observe(root,{childList:true,subtree:true});
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
