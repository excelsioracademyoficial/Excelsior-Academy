/* ===== CognitExAc v37 · Monedas unificadas + límite diario =====
   Todas las formas de dar o gastar CogniCoins terminan en el mismo lugar
   (coins_<usuario>). Aquí se revisa cada cambio:
   - Gastar: siempre se permite y se sube a la nube.
   - Ganar: máximo 80 por juego al día y 600 en total al día.
   - Se guarda en la cuenta: coins, cd (día) y cdn (ganadas hoy).
   Las reglas de Firebase revisan lo mismo del lado del servidor. */
(function(){
  if(window.__cxV37) return; window.__cxV37=true;
  var MAX_DIA=600, MAX_JUEGO=80;
  var S=Storage.prototype, oSet=S.setItem, oGet=S.getItem;
  function me(){ return (window.CU&&CU.id)||""; }
  function rec(){ try{ return window.USERS&&USERS[me()]; }catch(e){ return null; } }
  function libre(){ var r=rec(); return !me() || (window.CU&&CU.isAdmin) || (r&&r.role==="schooladmin"); }
  function hoy(){ return Math.floor((Date.now()-6*3600e3)/864e5); } /* día de CDMX */
  function num(v){ v=parseInt(v,10); return isNaN(v)?0:v; }
  function N(m,c){ try{ window.notify&&notify(m,c||"#F59E0B"); }catch(e){} }
  var subir=null;
  function guardar(){ clearTimeout(subir); subir=setTimeout(function(){ try{ window.saveUsers&&saveUsers(USERS,me()); }catch(e){} },300); }
  function dia(r){ var d=hoy(); if(r.cd!==d){ r.cd=d; r.cdn=0; } r.cdn=num(r.cdn); return r; }
  function juegoKey(){ var g=window.currentGame; return g&&g.id?("cx_gday_"+me()+"_"+hoy()+"_"+g.id):null; }

  S.setItem=function(k,v){
    if(this!==window.localStorage || libre() || k!=="coins_"+me()) return oSet.apply(this,arguments);
    var viejo=num(oGet.call(this,k)), nuevo=Math.max(0,num(v)), r=rec();
    if(!r) return oSet.call(this,k,String(nuevo));
    if(nuevo<=viejo || nuevo===num(r.coins)){           /* gasto o bajada desde la nube */
      oSet.call(this,k,String(nuevo));
      if(num(r.coins)!==nuevo){ r.coins=nuevo; guardar(); }
      return;
    }
    dia(r);
    var quiere=nuevo-viejo, puede=Math.max(0,MAX_DIA-r.cdn);
    var jk=juegoKey(), enJuego=jk?num(oGet.call(this,jk)):0;
    if(jk) puede=Math.min(puede,Math.max(0,MAX_JUEGO-enJuego));
    var da=Math.min(quiere,puede);
    if(da<quiere) N(da>0?"🪙 Solo +"+da+": llegaste al límite de hoy":"🪙 Ya llegaste al límite de CogniCoins de hoy en este juego. ¡Prueba otro!","#F59E0B");
    if(jk&&da>0) oSet.call(this,jk,String(enJuego+da));
    r.cdn+=da; r.coins=viejo+da;
    oSet.call(this,k,String(r.coins));
    guardar();
  };

  /* Antes de subir mi cuenta, las monedas siempre son las que ya revisamos */
  function envolver(){
    var o=window.saveUsers; if(typeof o!=="function"||o.__v37) return;
    var w=function(U,a){
      try{ var r=U&&U[me()]; if(r && !libre()){ var loc=num(oGet.call(localStorage,"coins_"+me())); if(num(r.coins)>loc){ r.coins=loc; } if(r.cd==null){ r.cd=hoy(); r.cdn=num(r.cdn); } } }catch(e){}
      return o.apply(this,arguments);
    };
    w.__v37=1; window.saveUsers=w;
  }
  envolver(); setInterval(envolver,2000);

  /* Una sola forma de dar monedas */
  window.addCoins=function(n){ n=num(n); if(!window.CU||n<=0) return; var a=num(oGet.call(localStorage,"coins_"+me())); localStorage.setItem("coins_"+me(),String(a+n)); var g=num(oGet.call(localStorage,"coins_"+me()))-a; if(g>0) N("+"+g+" 🪙 CogniCoins"); };
  window.cxAddCoins33=function(n){ n=num(n); var a=num(oGet.call(localStorage,"coins_"+me())); localStorage.setItem("coins_"+me(),String(Math.max(0,a+n))); };
})();
