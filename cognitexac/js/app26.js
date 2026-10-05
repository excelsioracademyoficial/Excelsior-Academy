
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

  /* ---------- C) Escuelas ---------- */
  function readSchools() { try { return JSON.parse(localStorage.getItem("cx_schools") || "{}"); } catch (e) { return {}; } }
  function writeSchools(s) {
    localStorage.setItem("cx_schools", JSON.stringify(s));
    try { if (window.DB) DB.ref("cx_schools").set(s); } catch (e) {}
  }
  /* Une claves duplicadas (misma escuela escrita con mayúsculas/espacios distintos) */
  function normalizeSchools() {
    var raw = readSchools(), out = {}, changed = false;
    Object.keys(raw).forEach(function (k) {
      var nk = keyOf(raw[k] && raw[k].name ? raw[k].name : k);
      if (nk !== k) changed = true;
      if (!out[nk]) out[nk] = { name: (raw[k] && raw[k].name) || k, on: !(raw[k] && raw[k].on === false), premiumAll: !!(raw[k] && raw[k].premiumAll), created: (raw[k] && raw[k].created) || Date.now() };
      else {
        changed = true;
        out[nk].on = out[nk].on || !(raw[k] && raw[k].on === false);
        out[nk].premiumAll = out[nk].premiumAll || !!(raw[k] && raw[k].premiumAll);
      }
    });
    if (changed) writeSchools(out);
    return out;
  }
  window.cxSchools = readSchools;
  window.cxSchoolKey = keyOf;
  function schoolOf(uid) { var u = users()[uid]; return u ? keyOf(u.escuela) : ""; }
  function membersOf(k) {
    return Object.keys(users()).filter(function (uid) {
      var u = users()[uid];
      return u && !u.isAdmin && u.role !== "schooladmin" && schoolOf(uid) === k;
    });
  }
  window.cxSchoolMembers = membersOf;

  /* Alta de escuela: arranca en 0 cuentas y con Premium para todas sus cuentas */
  window.cxCreateSchool = function () {
    var inp = $("cx-newSchool");
    var name = ((inp && inp.value) || "").trim();
    if (!name) return N("Escribe el nombre de la escuela", "#F59E0B");
    var all = normalizeSchools(), k = keyOf(name);
    if (all[k]) return N("Esa escuela ya existe", "#F59E0B");
    all[k] = { name: name, on: true, premiumAll: true, created: Date.now() };
    writeSchools(all);
    try {
      if (window.DB) {
        var up = {};
        up["school_counts/" + k] = 0;
        up["cx_schools/" + k] = all[k];
        DB.ref().update(up);
      }
    } catch (e) {}
    if (inp) inp.value = "";
    N("🏫 Escuela dada de alta: " + name + " · 0 cuentas · todas sus cuentas serán 👑 Premium");
    try { window.cxRenderSchools && window.cxRenderSchools(); } catch (e) {}
    try { renderAdmin(); } catch (e) {}
  };

  /* Alta/baja de Premium para toda una escuela (también fija la regla para las futuras) */
  window.cxSchoolPlan = function (k, plan) {
    k = keyOf(k);
    var pre = plan === "premium";
    var all = normalizeSchools();
    if (all[k]) { all[k].premiumAll = pre; writeSchools(all); }
    var ids = membersOf(k);
    ids.forEach(function (uid) { users()[uid].isPremium = pre; });
    if (ids.length) saveU(ids);
    N((pre ? "👑 Premium" : "👤 Básico") + " para " + (ids.length) + " cuenta(s) de " + ((all[k] && all[k].name) || k));
    try { window.cxRenderSchools && window.cxRenderSchools(); } catch (e) {}
    try { renderAdmin(); } catch (e) {}
  };

  /* Nueva cuenta hereda el plan de su escuela */
  function newAccount(uid, name, pass, schoolName, level, extra) {
    var k = keyOf(schoolName);
    var all = normalizeSchools();
    var pre = all[k] ? all[k].premiumAll !== false : true;
    var u = {
      name: name || uid, pass: pass || "cognitexac",
      escuela: (all[k] && all[k].name) || schoolName || "",
      level: level || "Primaria 4",
      pts: 0, weekPts: 0, monthPts: 0, dayPts: 0, games: 0, best: 0, streak: 0,
      active: true, isPremium: pre, isAdmin: false, coins: 0, catScores: {}
    };
    ["mem", "mat", "ate", "vel", "len", "raz", "fle"].forEach(function (c) { u.catScores[c] = 50; });
    if (extra) Object.keys(extra).forEach(function (kk) { if (extra[kk] !== "" && extra[kk] != null) u[kk] = extra[kk]; });
    users()[uid] = u;
    return u;
  }
  window.cxNewAccount = newAccount;

  /* ---------- D) Formulario real de alta (única + masiva) ---------- */
  var NIVELES = ["Kinder", "Primaria 1", "Primaria 2", "Primaria 3", "Primaria 4", "Primaria 5", "Primaria 6", "Secundaria 1", "Secundaria 2", "Secundaria 3", "Preparatoria", "Universidad", "Adulto"];
  function closeAlta() { var o = $("cxAltaOv"); if (o) o.remove(); }
  window.cxCloseAlta = closeAlta;

  window.cxAltaModal = function (k) {
    k = keyOf(k);
    var all = normalizeSchools();
    var school = all[k] || { name: k, premiumAll: true };
    closeAlta();
    var ov = document.createElement("div");
    ov.id = "cxAltaOv";
    ov.style.cssText = "position:fixed;inset:0;z-index:2147483200;background:rgba(0,0,0,.85);overflow-y:auto;padding:18px;font-family:inherit";
    var opts = NIVELES.map(function (n) { return '<option value="' + n + '">' + n + "</option>"; }).join("");
    ov.innerHTML =
      '<div style="max-width:520px;margin:0 auto;background:var(--card,#151922);border:2px solid var(--gold,#C9A84C);border-radius:16px;padding:18px">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:6px">' +
      '<h3 style="color:var(--gold,#C9A84C);font-size:1.02rem;margin:0">🏫 ' + esc(school.name) + "</h3>" +
      '<button onclick="cxCloseAlta()" style="background:transparent;border:1px solid var(--border,#2A3142);color:var(--text2,#9AA4B2);border-radius:8px;padding:6px 10px;font-family:inherit;cursor:pointer">Cerrar</button></div>' +
      '<div style="font-size:.76rem;color:' + (school.premiumAll !== false ? "#4ADE80" : "var(--text2,#9AA4B2)") + ';margin-bottom:12px">' +
      (school.premiumAll !== false ? "👑 Esta escuela crea cuentas Premium automáticamente." : "👤 Esta escuela crea cuentas Básicas.") + "</div>" +

      '<div style="font-size:.86rem;font-weight:800;color:var(--text,#E6EAF2);margin:6px 0 8px">➕ Cuenta única</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:7px">' +
      '<input id="cxaU" placeholder="Usuario" style="padding:9px;background:var(--inp,#0E1420);color:var(--text,#E6EAF2);border:1px solid var(--border,#2A3142);border-radius:9px;font-family:inherit;font-size:.86rem">' +
      '<input id="cxaP" placeholder="Contraseña" style="padding:9px;background:var(--inp,#0E1420);color:var(--text,#E6EAF2);border:1px solid var(--border,#2A3142);border-radius:9px;font-family:inherit;font-size:.86rem">' +
      '<input id="cxaN" placeholder="Nombre completo" style="grid-column:1/-1;padding:9px;background:var(--inp,#0E1420);color:var(--text,#E6EAF2);border:1px solid var(--border,#2A3142);border-radius:9px;font-family:inherit;font-size:.86rem">' +
      '<select id="cxaL" style="padding:9px;background:var(--inp,#0E1420);color:var(--text,#E6EAF2);border:1px solid var(--border,#2A3142);border-radius:9px;font-family:inherit;font-size:.86rem">' + opts + "</select>" +
      '<input id="cxaE" type="number" min="3" max="99" placeholder="Edad" style="padding:9px;background:var(--inp,#0E1420);color:var(--text,#E6EAF2);border:1px solid var(--border,#2A3142);border-radius:9px;font-family:inherit;font-size:.86rem">' +
      '<input id="cxaB" type="date" style="grid-column:1/-1;padding:9px;background:var(--inp,#0E1420);color:var(--text,#E6EAF2);border:1px solid var(--border,#2A3142);border-radius:9px;font-family:inherit;font-size:.86rem" title="Fecha de nacimiento (opcional)">' +
      "</div>" +
      '<button onclick="cxAltaOne(\'' + k + '\')" style="width:100%;margin-top:9px;padding:11px;border:0;border-radius:10px;background:var(--gold,#C9A84C);color:#1a1a2e;font-weight:900;font-family:inherit;cursor:pointer">Crear cuenta</button>' +

      '<div style="height:1px;background:var(--border,#2A3142);margin:16px 0"></div>' +
      '<div style="font-size:.86rem;font-weight:800;color:var(--text,#E6EAF2);margin-bottom:6px">📦 Alta masiva</div>' +
      '<div style="font-size:.74rem;color:var(--text2,#9AA4B2);line-height:1.5;margin-bottom:7px">Una cuenta por línea:<br><code>usuario, contraseña, nombre, nivel, edad, aaaa-mm-dd</code><br>Los 3 primeros son obligatorios.</div>' +
      '<textarea id="cxaBulk" rows="6" placeholder="ana01, clave123, Ana López, Primaria 4, 9, 2016-05-12" style="width:100%;padding:9px;background:var(--inp,#0E1420);color:var(--text,#E6EAF2);border:1px solid var(--border,#2A3142);border-radius:9px;font-family:inherit;font-size:.84rem"></textarea>' +
      '<button onclick="cxAltaBulk(\'' + k + '\')" style="width:100%;margin-top:8px;padding:11px;border:0;border-radius:10px;background:#3B82F6;color:#fff;font-weight:900;font-family:inherit;cursor:pointer">Crear todas</button>' +
      '<div id="cxaOut" style="margin-top:10px;font-size:.8rem;color:var(--text2,#9AA4B2);line-height:1.5"></div>' +
      "</div>";
    document.body.appendChild(ov);
  };

  function normUid(v) {
    return String(v || "").trim().toLowerCase().replace(/\s+/g, "").replace(/[.#$\[\]\/]/g, "");
  }
  function out(html) { var o = $("cxaOut"); if (o) o.innerHTML = html; }

  window.cxAltaOne = function (k) {
    k = keyOf(k);
    var all = normalizeSchools(), school = all[k] || { name: k };
    var uid = normUid(($("cxaU") || {}).value);
    var pass = (($("cxaP") || {}).value || "").trim();
    var name = (($("cxaN") || {}).value || "").trim();
    var lvl = (($("cxaL") || {}).value || "Primaria 4");
    var edad = (($("cxaE") || {}).value || "").trim();
    var bd = (($("cxaB") || {}).value || "").trim();
    if (!uid || !pass || !name) return out('<span style="color:#F59E0B">⚠️ Usuario, contraseña y nombre son obligatorios.</span>');
    if (users()[uid]) return out('<span style="color:#F59E0B">⚠️ El usuario @' + esc(uid) + " ya existe.</span>");
    var u = newAccount(uid, name, pass, school.name, lvl, { edad: edad ? parseInt(edad, 10) : "", birthdate: bd });
    var p = saveU(uid);
    ["cxaU", "cxaP", "cxaN", "cxaE", "cxaB"].forEach(function (i) { if ($(i)) $(i).value = ""; });
    var tag = u.isPremium ? "👑 Premium" : "👤 Básico";
    if (p && p.then) {
      out("⏳ Guardando @" + esc(uid) + "…");
      p.then(function () { out('<span style="color:#4ADE80">✅ @' + esc(uid) + " creada y sincronizada · " + tag + "</span>"); })
       .catch(function () { out('<span style="color:#F59E0B">⚠️ @' + esc(uid) + " se creó en este dispositivo pero no llegó al servidor. Repite con mejor conexión.</span>"); });
    } else {
      out('<span style="color:#F59E0B">⚠️ @' + esc(uid) + " creada solo en este dispositivo (sin conexión). " + tag + "</span>");
    }
    try { window.cxRenderSchools && window.cxRenderSchools(); } catch (e) {}
    try { renderAdmin(); } catch (e) {}
  };

  window.cxAltaBulk = function (k) {
    k = keyOf(k);
    var all = normalizeSchools(), school = all[k] || { name: k };
    var txt = (($("cxaBulk") || {}).value || "").trim();
    if (!txt) return out('<span style="color:#F59E0B">⚠️ Pega al menos una línea.</span>');
    var ok = [], bad = [];
    txt.split(/\r?\n/).forEach(function (line, i) {
      line = line.trim();
      if (!line) return;
      var p = line.split(",").map(function (x) { return x.trim(); });
      var uid = normUid(p[0]), pass = p[1] || "", name = p[2] || "";
      if (!uid || !pass || !name) { bad.push("línea " + (i + 1) + ": faltan datos"); return; }
      if (users()[uid]) { bad.push("línea " + (i + 1) + ": @" + uid + " ya existe"); return; }
      newAccount(uid, name, pass, school.name, p[3] || "Primaria 4", {
        edad: p[4] ? parseInt(p[4], 10) : "",
        birthdate: /^\d{4}-\d{2}-\d{2}$/.test(p[5] || "") ? p[5] : ""
      });
      ok.push(uid);
    });
    if (!ok.length) return out('<span style="color:#F59E0B">⚠️ No se creó ninguna cuenta.<br>' + esc(bad.join(" · ")) + "</span>");
    var p = saveU(ok);
    var tail = bad.length ? '<br><span style="color:#F59E0B">Omitidas: ' + esc(bad.join(" · ")) + "</span>" : "";
    if (p && p.then) {
      out("⏳ Guardando " + ok.length + " cuentas…");
      p.then(function () { out('<span style="color:#4ADE80">✅ ' + ok.length + " cuenta(s) creadas y sincronizadas.</span>" + tail); })
       .catch(function () { out('<span style="color:#F59E0B">⚠️ Se crearon ' + ok.length + " cuenta(s) pero no se confirmó el envío al servidor.</span>" + tail); });
    } else {
      out('<span style="color:#F59E0B">⚠️ ' + ok.length + " cuenta(s) creadas solo en este dispositivo.</span>" + tail);
    }
    if ($("cxaBulk")) $("cxaBulk").value = "";
    try { window.cxRenderSchools && window.cxRenderSchools(); } catch (e) {}
    try { renderAdmin(); } catch (e) {}
  };

  /* Los botones antiguos del panel ahora abren el formulario nuevo */
  window.cxSchoolAddUser = function (k) { window.cxAltaModal(k); };
  window.cxSchoolBulk = function (k) { window.cxAltaModal(k); };

  /* Al entrar, aplica el plan de la escuela a la cuenta */
  function applySchoolPlan() {
    try {
      var u = window.CU;
      if (!u || u.isAdmin || !u.escuela) return;
      var all = readSchools(), k = keyOf(u.escuela);
      if (!all[k]) return;
      var pre = all[k].premiumAll !== false;
      if (!!u.isPremium !== pre) {
        u.isPremium = pre;
        if (users()[u.id]) { users()[u.id].isPremium = pre; saveU(u.id); }
      }
    } catch (e) {}
  }
  setInterval(applySchoolPlan, 3000);

  normalizeSchools();
  setInterval(normalizeSchools, 5000);
  console.log("✅ CognitExAc v35 · cumpleaños, escuelas Premium, contador en 0 y alta de cuentas unificada");
}();
