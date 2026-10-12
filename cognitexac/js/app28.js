/* ===== CognitExAc v39 =====
 Reemplaza a js/app26.js (panel viejo v35). Conserva solo:
  A) re-dibujar la pantalla cuando llega la sesión
  B) pantalla de cumpleaños
 y además:
  C) los botones viejos de escuelas del panel de admin abren el panel nuevo (app25)
  D) la contraseña guardada nunca se escribe en el campo visible */
/* ============================================================
   CognitExAc v35 — correcciones consolidadas
   A) Punto 5: las pantallas ya no se dibujan vacías si CU llega tarde
   B) Cumpleaños a prueba de errores
   C) Escuelas: una sola clave por escuela, contador real desde 0,
      y TODAS las cuentas de una escuela dada de alta nacen Premium
   D) Alta de cuentas (única y masiva) con formulario real
   ============================================================ */
!function () {
  "use strict";
  var $ = function (i) { return document.getElementById(i); };
  function N(msg, color) {
    try { if (typeof notify === "function") return notify(msg, color); } catch (e) {}
    try { console.log(msg); } catch (e) {}
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function users() { try { return window.USERS || {}; } catch (e) { return {}; } }
  function saveU(ids) { try { return saveUsers(users(), ids); } catch (e) { return null; } }
  function keyOf(s) { return String(s || "").trim().toLowerCase().replace(/\s+/g, " "); }

  /* ---------- A) Re-dibujar la pantalla actual cuando llega la sesión ---------- */
  var SCREEN_FN = {
    "sc-cumple-v2": "showCumpleScreen",
    "sc-stats-v2": "showStatsScreen",
    "sc-perfil-v2": "showPerfilScreen",
    "sc-battle-v2": "showBattleScreen",
    "sc-lobby-v2": "showMyLobby",
    "sc-excelencia-v2": "showExcelenciaScreen",
    "sc-cogniclass-v2": "showCogniClassScreen",
    "sc-certificado-v2": "showCertificadoScreen",
    "sc-tienda": "showTienda",
    "sc-admin": "showAdmin"
  };
  window.cxRefreshCurrentScreen = function () {
    var el = document.querySelector(".sc.act,.scf.act");
    var fn = el && SCREEN_FN[el.id];
    if (fn && typeof window[fn] === "function") { try { window[fn](); } catch (e) {} }
  };
  var _lastUid = null;
  setInterval(function () {
    var uid = (window.CU && CU.id) || null;
    if (uid !== _lastUid) {
      _lastUid = uid;
      if (uid) setTimeout(window.cxRefreshCurrentScreen, 250);
    }
  }, 700);

  /* Placeholder mientras no hay sesión, en lugar de pantalla en blanco */
  function waiting(el) {
    if (!el) return;
    el.innerHTML = '<div style="padding:26px 0;text-align:center;color:var(--text2);font-size:.85rem">⏳ Cargando tu sesión…</div>';
  }

  /* ---------- B) Cumpleaños ---------- */
  var MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  window.renderCumpleScreen = function () {
    var wrap = $("cumpleWrap");
    if (!wrap) return;
    var me = window.CU || null;
    if (!me) { waiting(wrap); return; }
    wrap.innerHTML = '<div style="padding:20px 0;text-align:center;color:var(--text2);font-size:.85rem">🎂 Cargando cumpleaños…</div>';

    function paint(all) {
      try {
        var hoy = new Date(), mesHoy = hoy.getMonth() + 1, diaHoy = hoy.getDate();
        var list = Object.keys(all || {}).map(function (uid) {
          var u = all[uid];
          if (!u || !u.birthdate || u.isAdmin) return null;
          var p = String(u.birthdate).split("-");
          if (p.length < 3) return null;
          var m = parseInt(p[1], 10), d = parseInt(p[2], 10), y = parseInt(p[0], 10);
          if (!m || !d) return null;
          return { uid: uid, name: u.name || "Alumno", m: m, d: d, year: y };
        }).filter(Boolean);

        var hoyList = list.filter(function (x) { return x.m === mesHoy && x.d === diaHoy; });
        var mesList = list.filter(function (x) { return x.m === mesHoy; }).sort(function (a, b) { return a.d - b.d; });
        var m1 = (mesHoy % 12) + 1, m2 = ((mesHoy + 1) % 12) + 1;
        var prox = list.filter(function (x) { return x.m === m1 || x.m === m2; })
                       .sort(function (a, b) { return a.m - b.m || a.d - b.d; });

        var h = "";
        if (!me.birthdate && !me.isAdmin) {
          h += '<div style="background:rgba(201,168,76,.08);border:1px dashed var(--gold);border-radius:12px;padding:14px;margin-bottom:14px;text-align:center;cursor:pointer" onclick="(window.showDOBModal||function(){})()"><div style="font-size:1.5rem">🎂</div><div style="font-size:.86rem;color:var(--gold);margin-top:4px">Registra tu cumpleaños para que te feliciten</div></div>';
        }
        if (hoyList.length) {
          h += '<div style="background:linear-gradient(135deg,rgba(201,168,76,.18),rgba(249,115,22,.1));border:2px solid var(--gold);border-radius:14px;padding:16px;margin-bottom:16px;text-align:center"><div style="font-size:2.2rem">🎂🎉</div><div style="font-weight:800;color:var(--gold);margin:8px 0;font-size:1rem">¡Hoy cumplen años!</div>' +
            hoyList.map(function (x) {
              var e = hoy.getFullYear() - x.year;
              return '<div style="font-size:.95rem;font-weight:700;color:var(--text);padding:4px 0">🎊 ' + esc(x.name) + (e > 0 ? " · " + e + " años" : "") + "</div>";
            }).join("") + '<div style="font-size:.76rem;color:var(--text2);margin-top:8px">Mándales un mensaje en el chat 💌</div></div>';
        }
        h += '<div style="font-size:.9rem;font-weight:800;color:var(--text);margin-bottom:10px">📅 ' + MESES[mesHoy - 1] + "</div>";
        if (mesList.length) {
          mesList.forEach(function (x) {
            var es = x.d === diaHoy, e = hoy.getFullYear() - x.year;
            h += '<div style="display:flex;align-items:center;gap:12px;padding:11px 12px;background:var(--card);border:1px solid ' + (es ? "var(--gold)" : "var(--border)") + ';border-radius:11px;margin-bottom:8px"><span style="font-size:1.4rem">' + (es ? "🎂" : "🎈") + '</span><div style="flex:1"><div style="font-size:.88rem;font-weight:700;color:var(--text)">' + esc(x.name) + '</div><div style="font-size:.72rem;color:var(--text2)">' + MESES[x.m - 1] + " " + x.d + (es ? " · ¡HOY! 🎉" : "") + (e > 0 ? " · " + e + " años" : "") + "</div></div></div>";
          });
        } else {
          h += '<div style="color:var(--text2);font-size:.83rem;padding:10px 0">Sin cumpleaños registrados este mes.</div>';
        }
        h += '<div style="font-size:.9rem;font-weight:800;color:var(--text);margin:18px 0 10px">📆 Próximamente</div>';
        if (prox.length) {
          prox.forEach(function (x) {
            var e = hoy.getFullYear() - x.year;
            h += '<div style="display:flex;align-items:center;gap:12px;padding:10px 12px;background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:11px;margin-bottom:7px"><span style="font-size:1.2rem">🎈</span><div><div style="font-size:.86rem;color:var(--text2)">' + esc(x.name) + '</div><div style="font-size:.72rem;color:rgba(150,160,180,.7)">' + MESES[x.m - 1] + " " + x.d + (e > 0 ? " · " + e + " años" : "") + "</div></div></div>";
          });
        } else {
          h += '<div style="color:var(--text2);font-size:.83rem;padding:4px 0 10px">Nadie cumple en los próximos dos meses.</div>';
        }
        if (!list.length) {
          h += '<div style="margin-top:14px;padding:14px;border:1px dashed var(--border);border-radius:12px;color:var(--text2);font-size:.8rem;text-align:center">Todavía nadie ha registrado su fecha de nacimiento. En cuanto los alumnos la registren, aparecerán aquí.</div>';
        }
        wrap.innerHTML = h;
      } catch (err) {
        wrap.innerHTML = '<div style="padding:18px;border:1px solid var(--border);border-radius:12px;color:var(--text2);font-size:.83rem">No se pudo mostrar la lista de cumpleaños. Vuelve a entrar a la sección.</div>';
        try { console.warn("cumple", err); } catch (e) {}
      }
    }

    var done = false;
    function once(d) { if (!done) { done = true; paint(d); } }
    try {
      if (window.DB) {
        DB.ref("cog_users").once("value",
          function (snap) { try { once(snap.val() || users()); } catch (e) { once(users()); } },
          function () { once(users()); });
        setTimeout(function () { once(users()); }, 4000);
      } else once(users());
    } catch (e) { once(users()); }
  };
  window.showCumpleScreen = function () {
    try { setNewNav(!0); } catch (e) {}
    try { show("sc-cumple-v2"); } catch (e) {}
    window.renderCumpleScreen();
  };


  /* ---------- C) Botones viejos -> panel nuevo ---------- */
  function abrirNuevo(){ if (typeof window.cxOpenSchoolPanel === "function") return window.cxOpenSchoolPanel(); N("Abre el panel 🏫 Escuelas y cupos", "#F59E0B"); }
  window.cxSchoolAddUser = abrirNuevo;
  window.cxSchoolBulk = abrirNuevo;
  window.cxAltaModal = abrirNuevo;

  /* ---------- D) Campo de contraseña protegido ----------
     Los reintentos de acceso, el "recordarme" y el cifrado h1: escriben la contraseña
     (o su cifrado) en el campo para que doLogin la lea. Aquí ese valor se guarda
     en memoria: el código lo sigue leyendo, pero en pantalla el campo queda vacío. */
  function protegerCampo() {
    var el = $("liP");
    if (!el || el.__cx39) return;
    var desc = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
    if (!desc || !desc.get || !desc.set) return;
    var oculto = null, limpiar = null;
    el.__cx39 = true;
    Object.defineProperty(el, "value", {
      configurable: true,
      get: function () { return oculto != null ? oculto : desc.get.call(el); },
      set: function (v) {
        v = v == null ? "" : String(v);
        desc.set.call(el, "");
        oculto = v === "" ? null : v;
        clearTimeout(limpiar);
        if (oculto != null) limpiar = setTimeout(function () { oculto = null; }, 15000);
      }
    });
    el.addEventListener("input", function () { oculto = null; });
    el.addEventListener("focus", function () { if (oculto != null) { oculto = null; desc.set.call(el, ""); } });
  }
  protegerCampo();
  setInterval(protegerCampo, 1000);
  setInterval(function () { try { if (window.CU) { var el = $("liP"); if (el && el.__cx39) el.value = ""; } } catch (e) {} }, 2000);

  console.log("✅ CognitExAc v39 · panel único de escuelas, cumpleaños y campo de contraseña protegido");
}();
