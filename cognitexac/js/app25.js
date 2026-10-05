
/* ===== cxFixV41: sesiones verificadas por Firebase + Admin de Escuela + cupos + cuentas maestras ===== */
(function(){
  if(window.__cxV41) return; window.__cxV41 = true;
  var MAESTRAS = ["aldo","excelsioracademy"];
  var SES = null, LAST = {}, listenRef = null;
  function N(m,c){ try{ window.notify ? notify(m,c||"#10B981") : alert(m); }catch(e){} }
  function db(){ return window.DB || (window.firebase && firebase.apps && firebase.apps.length ? firebase.database() : null); }
  function uid(){ try{ var u=firebase.auth().currentUser; return u?u.uid:null; }catch(e){ return null; } }
  function esperarAuth(ms){ return new Promise(function(res){ var t0=Date.now();(function w(){ if(uid()&&db()) return res(true); if(Date.now()-t0>ms) return res(false); setTimeout(w,250); })(); }); }
  function conTiempo(p,ms){ return Promise.race([p,new Promise(function(_,r){setTimeout(function(){r(new Error("timeout"))},ms)})]); }
  function keyOk(s){ return !!s && !/[.#$\[\]\/]/.test(s); }
  function esSuper(u){ return !!(u && u.isAdmin===true && u.role!=="schooladmin"); }
  function esAdminEsc(u){ return !!(u && u.role==="schooladmin" && u.escuela); }
  function esMaestra(k){ return MAESTRAS.indexOf(k)>=0; }
  function guardarLocal(){ try{ localStorage.setItem("cog_users", JSON.stringify(window.USERS||{})); }catch(e){} }
  function marcar(obj){ Object.keys(obj||{}).forEach(function(k){ LAST[k]=JSON.stringify(obj[k]); }); }
  window.cxNormUser = function(s){ return String(s||"").trim().toLowerCase().replace(/\s+/g,""); };

  /* 1) saveUsers: solo sube cuentas que cambiaron; nunca reemplaza el nodo completo */
  window.saveUsers = function(e,a){
    window.USERS = e; try{ USERS = e; }catch(x){}
    guardarLocal();
    var d=db(); if(!d) return null;
    var ids;
    if(a){ ids = Array.isArray(a)?a:[a]; }
    else {
      ids = Object.keys(e).filter(function(k){ return JSON.stringify(e[k])!==LAST[k]; });
      Object.keys(LAST).forEach(function(k){ if(!Object.prototype.hasOwnProperty.call(e,k)) ids.push(k); });
    }
    ids = ids.filter(function(k){ return !(esMaestra(k) && !Object.prototype.hasOwnProperty.call(e,k)); });
    if(!ids.length) return null;
    var o={}; ids.forEach(function(k){ o[k]=Object.prototype.hasOwnProperty.call(e,k)?e[k]:null; });
    var cambioPass = SES && o[SES.u] && o[SES.u].pass && o[SES.u].pass!==SES.p;
    return d.ref("cog_users").update(o).then(function(){
      ids.forEach(function(k){ if(o[k]===null) delete LAST[k]; else LAST[k]=JSON.stringify(o[k]); });
      window.cxSyncStatus="nube";
      if(cambioPass){ abrirSesion(SES.u,o[SES.u].pass); }
    }).catch(function(err){
      if(ids.length>1) ids.forEach(function(k){ var one={}; one[k]=o[k]; d.ref("cog_users").update(one).then(function(){ if(o[k]===null) delete LAST[k]; else LAST[k]=JSON.stringify(o[k]); }).catch(function(){}); });
      throw err;
    });
  };

  /* 2) Sesión verificada por el servidor (Firebase compara la contraseña) */
  function abrirSesion(u,p){
    var d=db(), id=uid(); if(!d||!id) return Promise.reject(new Error("sin-nube"));
    return conTiempo(d.ref("cx_sessions/"+id).set({u:u,p:p}),6000).then(function(){ SES={u:u,p:p}; return true; });
  }
  function cerrarSesion(){
    var d=db(), id=uid();
    if(listenRef){ try{ listenRef.off(); }catch(e){} listenRef=null; }
    if(SES && d && id){ try{ d.ref("cx_sessions/"+id).remove(); }catch(e){} }
    SES=null; ocultarBotones();
  }
  function escuchar(me){
    var d=db(); if(!d||!me) return;
    if(listenRef){ try{ listenRef.off(); }catch(e){} }
    listenRef = esSuper(me) ? d.ref("cog_users") : d.ref("cog_users").orderByChild("escuela").equalTo(me.escuela||null);
    listenRef.on("value",function(snap){
      var v=snap.val()||{};
      window.cxSyncStatus="nube";
      if(!esSuper(me)){
        Object.keys(USERS).forEach(function(k){ if(SES && k!==SES.u && (USERS[k]||{}).escuela!==me.escuela) delete USERS[k]; });
      }
      Object.keys(v).forEach(function(k){ USERS[k]=v[k]; });
      marcar(v); guardarLocal();
    },function(){ window.cxSyncStatus="local"; });
  }

  /* 3) Bloqueo por intentos fallidos (5 intentos = 5 minutos) */
  function bloqueo(){ try{ return JSON.parse(localStorage.getItem("cx_lock_v41")||"{}"); }catch(e){ return {}; } }
  function fallo(){ var b=bloqueo(); b.n=(b.n||0)+1; if(b.n>=5){ b.until=Date.now()+5*60000; b.n=0; } localStorage.setItem("cx_lock_v41",JSON.stringify(b)); }

  /* 4) doLogin: valida primero en la nube y luego sigue el login de siempre */
  var origLogin = window.doLogin, ocupado=false;
  window.doLogin = function(){
    var self=this, args=arguments;
    if(ocupado) return;
    var uEl=document.getElementById("liU"), pEl=document.getElementById("liP");
    var u=window.cxNormUser(uEl&&uEl.value), p=(pEl&&pEl.value)||"";
    if(uEl && u) uEl.value=u;
    var b=bloqueo();
    if(b.until && Date.now()<b.until){ var er=document.getElementById("lerr"); if(er){ er.style.display="block"; er.textContent="🔒 Demasiados intentos. Espera "+Math.ceil((b.until-Date.now())/60000)+" min."; } return; }
    if(!u||!p) return origLogin.apply(self,args);
    ocupado=true;
    esperarAuth(4000).then(function(ok){
      if(!ok) throw new Error("sin-nube");
      return abrirSesion(u,p);
    }).then(function(){
      return conTiempo(db().ref("cog_users/"+u).once("value"),6000).then(function(s){
        var r=s.val(); if(r){ USERS[u]=r; LAST[u]=JSON.stringify(r); guardarLocal(); }
      });
    }).catch(function(){})
    .then(function(){
      ocupado=false;
      try{ origLogin.apply(self,args); }catch(e){ console.error(e); }
      setTimeout(function(){ if(window.CU){ localStorage.removeItem("cx_lock_v41"); despuesLogin(); } else fallo(); },400);
    });
  };
  function despuesLogin(){
    if(!window.CU || !SES) return;
    var me=USERS[SES.u]; if(!me) return;
    escuchar(me); ponerBotones(me);
  }
  setInterval(function(){ if(SES && !window.CU) cerrarSesion(); },1000);

  /* 5) Cuentas maestras imborrables también en la interfaz */
  ["deleteUser","toggleUser"].forEach(function(fn){
    var o=window[fn]; if(typeof o!=="function") return;
    window[fn]=function(k){ if(esMaestra(k)) return N("❌ Esta cuenta maestra no se puede borrar ni desactivar.","#EF4444"); return o.apply(this,arguments); };
  });

  /* ===== UI ===== */
  var css=document.createElement("style");
  css.textContent=".cx41b{position:fixed;left:14px;bottom:84px;z-index:99990;border:0;border-radius:999px;padding:10px 16px;font:700 14px system-ui;color:#fff;background:linear-gradient(135deg,#0ea5e9,#6366f1);box-shadow:0 6px 18px rgba(0,0,0,.3);cursor:pointer}"+
  ".cx41o{position:fixed;inset:0;z-index:99995;background:rgba(0,0,0,.55);display:flex;align-items:flex-start;justify-content:center;overflow:auto;padding:24px 10px}"+
  ".cx41m{background:#0f172a;color:#e2e8f0;border-radius:16px;max-width:720px;width:100%;padding:18px;font:14px system-ui;box-shadow:0 20px 50px rgba(0,0,0,.5)}"+
  ".cx41m h3{margin:14px 0 8px;font-size:16px;color:#7dd3fc}.cx41m input,.cx41m select,.cx41m textarea{width:100%;box-sizing:border-box;margin:4px 0;padding:9px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#e2e8f0;font:14px system-ui}"+
  ".cx41m button{border:0;border-radius:8px;padding:9px 14px;margin:4px 4px 4px 0;font:700 13px system-ui;cursor:pointer;background:#0ea5e9;color:#fff}.cx41m .sec{background:#334155}"+
  ".cx41g{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.cx41k{background:#1e293b;border-radius:10px;padding:10px;text-align:center}.cx41k b{display:block;font-size:22px;color:#fff}"+
  ".cx41t{width:100%;border-collapse:collapse;font-size:13px}.cx41t td,.cx41t th{border-bottom:1px solid #1e293b;padding:5px;text-align:left}.cx41r{display:grid;grid-template-columns:1fr 1fr;gap:6px}";
  document.head.appendChild(css);
  function ocultarBotones(){ ["cx41esc","cx41sup"].forEach(function(i){ var b=document.getElementById(i); if(b) b.remove(); }); cerrarModal(); }
  function ponerBotones(me){
    ocultarBotones();
    var b=document.createElement("button"); b.className="cx41b";
    if(esAdminEsc(me)){ b.id="cx41esc"; b.textContent="🏫 Mi escuela"; b.onclick=panelEscuela; }
    else if(esSuper(me)){ b.id="cx41sup"; b.textContent="🏫 Escuelas y cupos"; b.onclick=panelSuper; }
    else return;
    document.body.appendChild(b);
  }
  function cerrarModal(){ var o=document.getElementById("cx41o"); if(o) o.remove(); }
  function modal(html){
    cerrarModal();
    var o=document.createElement("div"); o.id="cx41o"; o.className="cx41o";
    o.innerHTML='<div class="cx41m">'+html+'<div style="text-align:right;margin-top:12px"><button class="sec" id="cx41x">Cerrar</button></div></div>';
    o.addEventListener("click",function(ev){ if(ev.target===o) cerrarModal(); });
    document.body.appendChild(o);
    document.getElementById("cx41x").onclick=cerrarModal;
  }
  function esc(s){ return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];}); }
  function $(i){ return document.getElementById(i); }
  function leer(path){ return conTiempo(db().ref(path).once("value"),6000).then(function(s){ return s.val(); }); }
  var NIVELES=["Kinder","Primaria","Secundaria","Preparatoria","Universidad"];
  var SECCIONES=["","Primeros Pasos","Zona Kids"];

  function crearEnEscuela(me,datos){
    var e=me.escuela, d=db();
    var u=window.cxNormUser(datos.user);
    if(!u||!datos.pass||!datos.name) return Promise.reject(new Error("Faltan usuario, contraseña o nombre"));
    if(!keyOk(u)) return Promise.reject(new Error("El usuario no puede llevar . # $ [ ] /"));
    return Promise.all([leer("school_counts/"+e),leer("school_quotas/"+e)]).then(function(r){
      var n=r[0]||0, q=r[1]||0;
      if(!q) throw new Error("Tu escuela aún no tiene cupo asignado");
      if(n>=q) throw new Error("Cupo lleno ("+n+"/"+q+")");
      var rec={pass:String(datos.pass),name:String(datos.name),level:datos.nivel||"Primaria",nivel:datos.nivel||"Primaria",
        escuela:e,active:true,pts:0,games:0,streak:0,best:0,isAdmin:false,isMainAdmin:false,
        catScores:{mem:50,mat:50,ate:50,vel:50,len:50,raz:50,fle:50},weekPts:0,monthPts:0,friends:[],friendRequests:[],
        createdAt:Date.now(),gradeStarted:Date.now(),createdBy:SES.u};
      if(datos.edad) rec.edad=parseInt(datos.edad,10)||null;
      if(datos.carrera && rec.nivel==="Universidad") rec.carrera=String(datos.carrera);
      if(datos.seccion) rec.seccion=datos.seccion;
      var up={}; up["cog_users/"+u]=rec; up["school_counts/"+e]=n+1; up["school_last/"+e]=u;
      return conTiempo(d.ref().update(up),8000).then(function(){ USERS[u]=rec; LAST[u]=JSON.stringify(rec); guardarLocal(); return u; })
        .catch(function(err){
          if(/timeout/.test(err.message)) throw new Error("Sin conexión con la nube; no se creó");
          throw new Error("Firebase lo rechazó: el usuario ya existe o se llenó el cupo");
        });
    });
  }

  function panelEscuela(){
    var me=USERS[SES.u]; var e=me.escuela;
    modal('<h2 style="margin:0">🏫 '+esc(e)+'</h2><div id="cx41q" class="cx41g" style="margin-top:10px"><div class="cx41k">Cargando…</div></div>'+
      '<h3>➕ Crear cuenta</h3><div class="cx41r"><input id="cx41u" placeholder="Usuario"><input id="cx41p" placeholder="Contraseña"></div>'+
      '<input id="cx41n" placeholder="Nombre completo"><div class="cx41r"><select id="cx41lv">'+NIVELES.map(function(n){return '<option>'+n+'</option>';}).join("")+'</select>'+
      '<input id="cx41ed" type="number" min="2" max="99" placeholder="Edad"></div><div class="cx41r"><input id="cx41ca" placeholder="Carrera (solo Universidad)">'+
      '<select id="cx41se">'+SECCIONES.map(function(s){return '<option value="'+s+'">'+(s||"Sección especial: ninguna")+'</option>';}).join("")+'</select></div>'+
      '<button id="cx41c1">Crear cuenta</button>'+
      '<h3>📋 Alta masiva</h3><div style="font-size:12px;opacity:.8">Una cuenta por línea: usuario, contraseña, nombre, nivel, edad, carrera, sección (los 3 primeros son obligatorios)</div>'+
      '<textarea id="cx41bk" rows="5" placeholder="ana01, clave123, Ana López, Primaria, 8"></textarea><button id="cx41c2">Crear todas</button><div id="cx41bl" style="font-size:12px"></div>'+
      '<h3>📊 Mis cuentas por categoría</h3><div id="cx41cat"></div><h3>👥 Alumnos</h3><div id="cx41ls" style="max-height:280px;overflow:auto"></div>');
    function refrescar(){
      Promise.all([leer("school_counts/"+e),leer("school_quotas/"+e)]).then(function(r){
        var n=r[0]||0,q=r[1]||0;
        if($("cx41q")) $("cx41q").innerHTML='<div class="cx41k">Cupo total<b>'+q+'</b></div><div class="cx41k">Creadas<b>'+n+'</b></div><div class="cx41k">Disponibles<b>'+Math.max(0,q-n)+'</b></div>';
      }).catch(function(){ if($("cx41q")) $("cx41q").innerHTML='<div class="cx41k">Sin conexión con la nube</div>'; });
      var lista=Object.keys(USERS).filter(function(k){ var x=USERS[k]; return x && x.escuela===e && x.role!=="schooladmin"; }).sort();
      var cat={}; lista.forEach(function(k){ var x=USERS[k]; [x.nivel||x.level||"Sin nivel", x.seccion, x.carrera?("Carrera: "+x.carrera):null, x.edad?(x.edad+" años"):null].forEach(function(c){ if(c) cat[c]=(cat[c]||0)+1; }); });
      if($("cx41cat")) $("cx41cat").innerHTML=Object.keys(cat).length?Object.keys(cat).map(function(c){return '<span style="display:inline-block;background:#1e293b;border-radius:999px;padding:4px 10px;margin:3px">'+esc(c)+': <b>'+cat[c]+'</b></span>';}).join(""):"Aún no hay cuentas.";
      if($("cx41ls")) $("cx41ls").innerHTML='<table class="cx41t"><tr><th>Usuario</th><th>Nombre</th><th>Nivel</th><th>Edad</th><th>Sección</th></tr>'+lista.map(function(k){var x=USERS[k];return '<tr><td>'+esc(k)+'</td><td>'+esc(x.name)+'</td><td>'+esc(x.nivel||x.level)+'</td><td>'+esc(x.edad||"")+'</td><td>'+esc(x.seccion||"")+'</td></tr>';}).join("")+'</table>';
    }
    refrescar();
    $("cx41c1").onclick=function(){
      var b=this; b.disabled=true;
      crearEnEscuela(me,{user:$("cx41u").value,pass:$("cx41p").value.trim(),name:$("cx41n").value.trim(),nivel:$("cx41lv").value,edad:$("cx41ed").value,carrera:$("cx41ca").value.trim(),seccion:$("cx41se").value})
      .then(function(u){ N("☁️ Cuenta creada y sincronizada: "+u); ["cx41u","cx41p","cx41n","cx41ed","cx41ca"].forEach(function(i){$(i).value="";}); refrescar(); })
      .catch(function(err){ N("❌ "+err.message,"#EF4444"); }).then(function(){ b.disabled=false; });
    };
    $("cx41c2").onclick=function(){
      var b=this, filas=$("cx41bk").value.split(/\n/).map(function(l){return l.split(",").map(function(x){return x.trim();});}).filter(function(f){return f[0];});
      if(!filas.length) return;
      b.disabled=true; var ok=0, fallas=[];
      filas.reduce(function(pr,f){ return pr.then(function(){
        var nv=NIVELES.filter(function(n){return n.toLowerCase()===(f[3]||"").toLowerCase();})[0]||"Primaria";
        var sc=SECCIONES.filter(function(s){return s && s.toLowerCase()===(f[6]||"").toLowerCase();})[0]||"";
        return crearEnEscuela(me,{user:f[0],pass:f[1],name:f[2],nivel:nv,edad:f[4],carrera:f[5],seccion:sc}).then(function(){ok++;},function(err){fallas.push(f[0]+": "+err.message);});
      }); },Promise.resolve()).then(function(){
        b.disabled=false; $("cx41bl").innerHTML="✅ Creadas: "+ok+(fallas.length?"<br>❌ "+fallas.map(esc).join("<br>❌ "):"");
        N("Alta masiva: "+ok+" creadas"+(fallas.length?", "+fallas.length+" con error":""), fallas.length?"#F59E0B":"#10B981"); refrescar();
      });
    };
  }

  function panelSuper(){
    var soyMaestra=esMaestra(SES.u), otra=SES.u==="aldo"?"excelsioracademy":"aldo";
    modal('<h2 style="margin:0">🏫 Escuelas, cupos y administradores</h2>'+
      '<h3>Asignar / cambiar cupo</h3><div class="cx41r"><input id="cx41se1" placeholder="Nombre exacto de la escuela"><select id="cx41qq"><option>200</option><option>250</option><option>650</option><option>900</option><option value="otro">Otro…</option></select></div>'+
      '<input id="cx41qo" type="number" min="1" placeholder="Cupo personalizado" style="display:none"><button id="cx41sq">Guardar cupo</button>'+
      '<h3>Crear administrador de escuela</h3><div class="cx41r"><input id="cx41au" placeholder="Usuario del admin"><input id="cx41ap" placeholder="Contraseña"></div><div class="cx41r"><input id="cx41an" placeholder="Nombre"><input id="cx41ae" placeholder="Escuela (nombre exacto)"></div><button id="cx41ca">Crear admin de escuela</button>'+
      '<h3>Escuelas</h3><div id="cx41sl">Cargando…</div>'+
      (soyMaestra?'<h3>🔑 Seguridad de cuentas maestras</h3><div style="font-size:12px;opacity:.8">Mínimo 10 caracteres. Solo Aldo y Excelsior Academy pueden cambiar estas claves.</div>'+
      '<div class="cx41r"><input id="cx41np" type="password" placeholder="Mi nueva contraseña"><button id="cx41cp" style="margin:4px 0">Cambiar la mía</button></div>'+
      '<div class="cx41r"><input id="cx41op" type="password" placeholder="Nueva contraseña para '+otra+'"><button id="cx41rp" style="margin:4px 0">Restablecer la de '+otra+'</button></div>':''));
    $("cx41qq").onchange=function(){ $("cx41qo").style.display=this.value==="otro"?"block":"none"; };
    function listar(){
      Promise.all([leer("school_quotas"),leer("school_counts")]).then(function(r){
        var q=r[0]||{},c=r[1]||{},todas={};
        Object.keys(q).forEach(function(k){todas[k]=1;});
        Object.keys(USERS).forEach(function(k){ var e=(USERS[k]||{}).escuela; if(e) todas[e]=1; });
        var admins={}; Object.keys(USERS).forEach(function(k){ var x=USERS[k]; if(x&&x.role==="schooladmin") (admins[x.escuela]=admins[x.escuela]||[]).push(k); });
        $("cx41sl").innerHTML='<table class="cx41t"><tr><th>Escuela</th><th>Alumnos</th><th>Cupo</th><th>Contador</th><th>Admins</th></tr>'+Object.keys(todas).sort().map(function(e){
          var al=Object.keys(USERS).filter(function(k){return (USERS[k]||{}).escuela===e && USERS[k].role!=="schooladmin";}).length;
          return '<tr><td>'+esc(e)+'</td><td>'+al+'</td><td>'+(q[e]||"—")+'</td><td>'+(c[e]==null?"—":c[e])+'</td><td>'+esc((admins[e]||[]).join(", "))+'</td></tr>';}).join("")+'</table>';
      }).catch(function(){ $("cx41sl").textContent="Sin conexión con la nube."; });
    }
    listar();
    $("cx41sq").onclick=function(){
      var e=$("cx41se1").value.trim(), v=$("cx41qq").value==="otro"?parseInt($("cx41qo").value,10):parseInt($("cx41qq").value,10);
      if(!keyOk(e)) return N("⚠️ Escribe la escuela (sin . # $ [ ] /)","#F59E0B");
      if(!(v>0)) return N("⚠️ Cupo inválido","#F59E0B");
      var actuales=Object.keys(USERS).filter(function(k){return (USERS[k]||{}).escuela===e && USERS[k].role!=="schooladmin";}).length;
      leer("school_counts/"+e).then(function(n){
        var up={}; up["school_quotas/"+e]=v; if(n==null) up["school_counts/"+e]=actuales;
        up["cx_schools/"+e]={name:e,on:true};
        return db().ref().update(up);
      }).then(function(){
        try{ var s=JSON.parse(localStorage.getItem("cx_schools")||"{}"); if(!s[e]){ s[e]={name:e,on:true}; localStorage.setItem("cx_schools",JSON.stringify(s)); } }catch(x){}
        N("✅ Cupo de "+e+": "+v); listar();
      }).catch(function(){ N("❌ No se guardó (¿reglas nuevas pegadas y sesión activa?)","#EF4444"); });
    };
    $("cx41ca").onclick=function(){
      var u=window.cxNormUser($("cx41au").value), p=$("cx41ap").value.trim(), n=$("cx41an").value.trim(), e=$("cx41ae").value.trim();
      if(!u||!p||!n||!e) return N("⚠️ Llena los 4 campos","#F59E0B");
      if(!keyOk(u)||!keyOk(e)) return N("⚠️ Usuario y escuela no pueden llevar . # $ [ ] /","#F59E0B");
      if(USERS[u]||esMaestra(u)) return N("❌ Ese usuario ya existe","#EF4444");
      var rec={pass:p,name:n,level:"Admin",escuela:e,role:"schooladmin",active:true,isAdmin:false,isMainAdmin:false,pts:0,games:0,streak:0,best:0,
        catScores:{mem:50,mat:50,ate:50,vel:50,len:50,raz:50,fle:50},weekPts:0,monthPts:0,friends:[],friendRequests:[],createdAt:Date.now(),createdBy:SES.u};
      db().ref("cog_users/"+u).set(rec).then(function(){ USERS[u]=rec; LAST[u]=JSON.stringify(rec); guardarLocal(); N("✅ Admin de "+e+" creado: "+u); listar(); })
        .catch(function(){ N("❌ Firebase no lo permitió (¿ya existe ese usuario?)","#EF4444"); });
    };
    if(!soyMaestra) return;
    function cambiar(cuenta,np,propia){
      if(!np||np.length<10) return N("⚠️ Mínimo 10 caracteres","#F59E0B");
      db().ref("cog_users/"+cuenta+"/pass").set(np).then(function(){
        if(USERS[cuenta]){ USERS[cuenta].pass=np; LAST[cuenta]=JSON.stringify(USERS[cuenta]); guardarLocal(); }
        return propia?abrirSesion(cuenta,np):true;
      }).then(function(){ $("cx41np").value=""; $("cx41op").value=""; N("🔑 Contraseña de "+cuenta+" actualizada."); })
        .catch(function(){ N("❌ No se pudo cambiar","#EF4444"); });
    }
    $("cx41cp").onclick=function(){ cambiar(SES.u,$("cx41np").value,true); };
    $("cx41rp").onclick=function(){ if(confirm("¿Restablecer la contraseña de "+otra+"?")) cambiar(otra,$("cx41op").value,false); };
  }
})();
