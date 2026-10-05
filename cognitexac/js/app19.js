/* v37: referidos eliminados (ya no dan monedas) */
!(function () {
  "use strict";
  var e = "#C9A84C",
    t = window.CX_CHAR_ART || {},
    a = (location.origin + location.pathname).replace(/index\.html?$/, "");
  function r(e) {
    return document.getElementById(e);
  }
  function i(e) {
    return String(null == e ? "" : e).replace(/[&<>"']/g, function (e) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[e];
    });
  }
  function o(e, t, a) {
    var r = document.createElement(e);
    return (t && (r.style.cssText = t), null != a && (r.innerHTML = a), r);
  }
  function n(e, t) {
    try {
      notify(e, t || "#10B981");
    } catch (e) {}
  }
  var d = [
    {
      k: "excelencia",
      n: "Excelencia",
      r: "Directora de la Academia",
      c: "#F59E0B",
      price: 0,
      bio: "Te guía en tu ruta de entrenamiento y celebra tus logros.",
    },
    {
      k: "coco",
      n: "Coco",
      r: "Experto en Memoria",
      c: "#8B5CF6",
      price: 350,
      bio: "Te acompaña en los juegos de memoria y te da pistas de repaso.",
    },
    {
      k: "laProfe",
      n: "La Profe",
      r: "Maestra de Lenguaje",
      c: "#10B981",
      price: 350,
      bio: "Vocabulario, ortografía y comprensión: su especialidad.",
    },
    {
      k: "chispa",
      n: "Chispa",
      r: "Campeón de Matemáticas",
      c: "#EF4444",
      price: 400,
      bio: "Cálculo rápido, tablas y lógica numérica a toda velocidad.",
    },
    {
      k: "vale",
      n: "Vale",
      r: "Reina de la Atención",
      c: "#3B82F6",
      price: 400,
      bio: "Enfoque, vigilancia y control de impulsos.",
    },
    {
      k: "donRaro",
      n: "Don Raro",
      r: "Maestro del Razonamiento",
      c: "#F97316",
      price: 500,
      bio: "Acertijos, patrones y pensamiento lateral.",
    },
  ];
  function s(e, a, r) {
    var o = t[e];
    return o
      ? '<img src="' +
          o +
          '" alt="' +
          i(e) +
          '" width="' +
          a +
          '" height="' +
          a +
          '" style="width:' +
          a +
          "px;height:" +
          a +
          "px;object-fit:contain;border-radius:50%;background:rgba(255,255,255,.06)" +
          (r ? ";border:2px solid " + r : "") +
          '">'
      : '<span style="font-size:' + 0.6 * a + 'px">🧠</span>';
  }
  function c() {
    var e = r("charStrip");
    if (e && !e.dataset.v26) {
      var t = e.querySelector(".char-nav-row");
      if (t) {
        for (
          var a = t.querySelectorAll(".cnb"), o = 0;
          o < a.length && o < d.length;
          o++
        ) {
          var n = a[o],
            c = d[o];
          ((n.innerHTML =
            s(c.k, 26, c.c) +
            '<span style="margin-left:6px;vertical-align:middle">' +
            i(c.n) +
            "</span>"),
            (n.style.display = "inline-flex"),
            (n.style.alignItems = "center"),
            (n.style.gap = "2px"));
        }
        e.dataset.v26 = "1";
      }
    }
  }
  function l() {
    try {
      return JSON.parse(
        localStorage.getItem("cxChars_" + ((CU && CU.id) || "")) ||
          '["excelencia"]',
      );
    } catch (e) {
      return ["excelencia"];
    }
  }
  function p() {
    return (
      localStorage.getItem("cxCharEq_" + ((CU && CU.id) || "")) || "excelencia"
    );
  }
  function f() {
    if (CU) {
      var t = r("shopChars");
      if (!t) {
        var a = document.querySelector("#sc-tienda .sec-inner");
        if (!a) return;
        (t = o("div")).id = "shopChars";
        var c = r("shopV10");
        a.insertBefore(t, c || null);
      }
      var v = l(),
        x = p(),
        m =
          '<div style="margin:10px 0 18px"><div style="font-size:1rem;font-weight:900;color:' +
          e +
          ';margin-bottom:2px">🎭 Personajes de Excelsior Academy</div><div style="font-size:.74rem;color:var(--text2);margin-bottom:10px">Adóptalos con 🪙 CogniCoins. El personaje equipado te acompaña en el inicio y te anima al entrenar. Tus CogniCoins: <b style="color:' +
          e +
          '">' +
          u() +
          '</b></div><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px">';
      (d.forEach(function (e) {
        var t = v.indexOf(e.k) >= 0,
          a = x === e.k;
        m +=
          '<div style="background:var(--card);border:1.5px solid ' +
          (a ? e.c : "var(--border)") +
          ';border-radius:14px;padding:12px;text-align:center">' +
          s(e.k, 72, e.c) +
          '<div style="font-weight:900;font-size:.88rem;color:var(--text);margin-top:6px">' +
          i(e.n) +
          '</div><div style="font-size:.66rem;color:var(--text2);min-height:26px">' +
          i(e.r) +
          '</div><div style="font-size:.64rem;color:var(--text2);margin:4px 0 8px">' +
          i(e.bio) +
          '</div><button data-ck="' +
          e.k +
          '" class="cxCharBtn" style="width:100%;padding:8px;border-radius:9px;border:none;cursor:pointer;font-weight:800;font-size:.76rem;font-family:inherit;background:' +
          (a ? "rgba(255,255,255,.12)" : e.c) +
          ";color:" +
          (a ? "var(--text)" : "#fff") +
          '">' +
          (a
            ? "✓ Equipado"
            : t
              ? "Equipar"
              : 0 === e.price
                ? "🎁 Gratis"
                : "🪙 " + e.price) +
          "</button></div>";
      }),
        (m += "</div></div>"),
        (t.innerHTML = m),
        t.querySelectorAll(".cxCharBtn").forEach(function (e) {
          e.onclick = function () {
            var e,
              t = this.dataset.ck,
              a = null;
            for (e = 0; e < d.length; e++) d[e].k === t && (a = d[e]);
            var r,
              i = l();
            if (i.indexOf(t) < 0) {
              if (u() < a.price)
                return void n(
                  "Te faltan CogniCoins. Gana más entrenando.",
                  "#EF4444",
                );
              ((r = a.price),
                g(u() - r),
                i.push(t),
                (function (e) {
                  try {
                    localStorage.setItem("cxChars_" + CU.id, JSON.stringify(e));
                  } catch (e) {}
                })(i),
                n("🎉 ¡" + a.n + " se unió a tu equipo!", "#10B981"));
            }
            (localStorage.setItem("cxCharEq_" + CU.id, t), f());
            try {
              showCharacter(EA_CHARS[t], "welcome", 4e3);
            } catch (e) {}
          };
        }));
    }
  }
  if (
    ((window.cxCharImg = s),
    (function () {
      if ("function" == typeof window.showCharacter) {
        var e = window.showCharacter;
        window.showCharacter = function (t, a, r) {
          var i = e.apply(this, arguments);
          try {
            var o,
              n = null;
            for (o = 0; o < d.length; o++)
              t && t.name && d[o].n === t.name && (n = d[o].k);
            if (!n) return i;
            var c = document.querySelector(
              ".char-bubble,.character-box,#charBox,#characterBox",
            );
            if (!c) return i;
            var l = c.querySelector(".char-ico,.char-emoji");
            l &&
              !l.dataset.v26 &&
              ((l.innerHTML = s(n, 52)), (l.dataset.v26 = "1"));
          } catch (e) {}
          return i;
        };
      }
    })(),
    "function" == typeof window.renderShop)
  ) {
    var v = window.renderShop;
    window.renderShop = function () {
      var e = v.apply(this, arguments);
      try {
        f();
      } catch (e) {}
      return e;
    };
  }
  function u() {
    if (!CU) return 0;
    var e = parseInt(localStorage.getItem("coins_" + CU.id) || "0", 10) || 0,
      t = (USERS[CU.id] && parseInt(USERS[CU.id].coins || 0, 10)) || 0,
      a = Math.max(e, t);
    return (e !== a && localStorage.setItem("coins_" + CU.id, a), a);
  }
  function g(e) {
    if (
      CU &&
      ((e = Math.max(0, Math.round(e))),
      localStorage.setItem("coins_" + CU.id, e),
      USERS[CU.id])
    ) {
      USERS[CU.id].coins = e;
      try {
        saveUsers(USERS, CU.id);
      } catch (e) {}
    }
  }
  function x() {
    return a + "?ref=" + encodeURIComponent(CU ? CU.id : "");
  }
  function m(e) {
    var t = 0;
    return (
      Object.keys(USERS).forEach(function (a) {
        var r = USERS[a];
        r && r.refBy === e && r.refConfirmed && t++;
      }),
      t
    );
  }
  function b(e) {
    return;
    var t = USERS[e];
    if (t) {
      t.ref = t.ref || {};
      var a = m(e),
        r = "";
      if (
        (a >= 3 &&
          !t.ref.r3 &&
          ((t.ref.r3 = 1),
          (t.coins = (parseInt(t.coins || 0, 10) || 0) + 1e3),
          (r = "🏆 ¡3 amigos activados! +1000 CogniCoins")),
        a >= 5 &&
          !t.ref.r5 &&
          ((t.ref.r5 = 1),
          (t.boostUntil = Date.now() + 6048e5),
          (t.coins = (parseInt(t.coins || 0, 10) || 0) + 1500),
          (r =
            "🌟 ¡5 amigos activados! +1500 🪙 y Aura de Popularidad 7 días")),
        a >= 10 &&
          !t.ref.r10 &&
          ((t.ref.r10 = 1),
          (t.coins = (parseInt(t.coins || 0, 10) || 0) + 3e3),
          (t.petUnlocked = 1),
          (r = "🐉 ¡10 amigos! +3000 🪙 y Mascota Legendaria desbloqueada")),
        r)
      ) {
        try {
          saveUsers(USERS, e);
        } catch (e) {}
        CU &&
          CU.id === e &&
          (localStorage.setItem("coins_" + e, t.coins), n(r, "#F59E0B"));
      }
    }
  }
  function y(e) {
    return e && e.boostUntil && e.boostUntil > Date.now();
  }
  function h() {
    return (
      "🧠 Estoy entrenando mi mente en CognitExAc de Excelsior Academy: 110 juegos cognitivos, CognIdiomas y reporte para padres.\nEntra con mi enlace y te ayudo a empezar 👉 " +
      x()
    );
  }
  function S(e) {
    var t,
      a =
        "cxShare_" +
        CU.id +
        "_" +
        ((t = new Date()).getFullYear() +
          "-" +
          (t.getMonth() + 1) +
          "-" +
          t.getDate()),
      r = [];
    try {
      r = JSON.parse(localStorage.getItem(a) || "[]");
    } catch (e) {}
    if (r.indexOf(e) >= 0)
      n("Ya recibiste tu recompensa de hoy por esta acción 😉", "#F59E0B");
    else {
      (r.push(e), localStorage.setItem(a, JSON.stringify(r)));
      n("¡Gracias por compartir!", "#10B981");
      var o = USERS[CU.id];
      if (o) {
        o.shares = (parseInt(o.shares || 0, 10) || 0) + 1;
        try {
          saveUsers(USERS, CU.id);
        } catch (e) {}
      }
      w();
    }
  }
  function C() {
    if (!r("sc-refer")) {
      var e = o("div");
      ((e.className = "sc"),
        (e.id = "sc-refer"),
        (e.innerHTML =
          '<div class="sec-inner" style="max-width:680px"><div class="sec-hdr"><button class="back-btn" onclick="showDash()">← Volver</button><div><div class="sec-title">📱 Mi WhatsApp</div><div class="sec-sub">Vincula tu número para recuperar tu cuenta</div></div></div><div id="referWrap" style="padding-bottom:40px"></div></div>'),
        document.body.appendChild(e));
    }
  }
  function w() {
    if (CU) {
      C();
      var t = r("referWrap");
      if (t) {
        var a,
          d = USERS[CU.id] || {},
          c = x(),
          l = m(CU.id),
          f = ((a = CU.id),
          Object.keys(USERS).filter(function (e) {
            return USERS[e] && USERS[e].refBy === a;
          })).length,
          v = d.wa || "",
          g = !!d.waVerified,
          b = y(d) ? Math.ceil((d.boostUntil - Date.now()) / 864e5) : 0,
          E = "";
        ((E +=
            '<div style="background:var(--card);border:1px solid var(--border);border-radius:14px;padding:14px;margin-bottom:14px"><div style="font-size:.85rem;font-weight:800;color:var(--text);margin-bottom:4px">📱 Vincular mi WhatsApp</div><div style="font-size:.74rem;color:var(--text2);line-height:1.6;margin-bottom:10px">Vincula tu número y podrás escribirle a CognitExAc por WhatsApp para pedir <b>tu usuario, recuperar tu contraseña</b> o tus <b>estadísticas</b>. También sirve para el <b>panel de padres</b>.</div><div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><input id="cxWaIn" type="tel" inputmode="numeric" maxlength="10" placeholder="10 dígitos" value="' +
            i(v) +
            '" style="flex:1;min-width:140px;padding:10px;border-radius:9px;border:1.5px solid var(--border);background:rgba(255,255,255,.04);color:var(--text);font-family:inherit"><button id="cxWaSave" style="padding:10px 14px;border-radius:9px;border:none;background:' +
            e +
            ';color:#111;font-weight:900;cursor:pointer;font-family:inherit">Guardar</button></div><div style="font-size:.72rem;margin-top:8px;color:' +
            (g ? "#10B981" : "var(--text2)") +
            '">' +
            (v
              ? g
                ? "✅ Número verificado"
                : "⏳ Falta verificar: envía el código por WhatsApp"
              : "Sin número vinculado") +
            "</div>" +
            (v && !g
              ? '<button id="cxWaVerify" style="width:100%;margin-top:10px;padding:11px;border-radius:10px;border:none;background:#25D366;color:#062;font-weight:900;cursor:pointer;font-family:inherit">✅ Enviar código de verificación por WhatsApp</button>'
              : "") +
            '<div style="font-size:.68rem;color:var(--text2);margin-top:10px;line-height:1.6">Escribe a la Academia y pide: <b>MI USUARIO</b>, <b>MI CONTRASEÑA</b>, <b>MIS ESTADISTICAS</b> o <b>REPORTE HIJO</b>.</div></div>'),
          (E +=
            '<div style="background:var(--card);border:1px solid var(--border);border-radius:14px;padding:14px"><div style="font-size:.85rem;font-weight:800;color:var(--text);margin-bottom:8px">🎭 Tu personaje</div><div style="display:flex;align-items:center;gap:12px">' +
            s(p(), 56, e) +
            '<div style="font-size:.76rem;color:var(--text2)">Cambia o adopta personajes en la <b>Tienda</b>.</div></div><button onclick="showTienda()" style="width:100%;margin-top:10px;padding:10px;border-radius:10px;border:1.5px solid ' +
            e +
            ";background:transparent;color:" +
            e +
            ';font-weight:800;cursor:pointer;font-family:inherit">🛍️ Ir a la Tienda</button></div>'),
          CU.isAdmin &&
            (E += '<div id="aldoPanel" style="margin-top:16px"></div>'),
          (t.innerHTML = E),
          0);
        var R = r("cxWaIn");
        R &&
          R.addEventListener("input", function () {
            R.value = R.value.replace(/\D/g, "").slice(0, 10);
          });
        var k = r("cxWaSave");
        k &&
          (k.onclick = function () {
            var e = (R.value || "").replace(/\D/g, "");
            if (10 === e.length) {
              var t = USERS[CU.id];
              if (t) {
                t.wa !== e &&
                  ((t.wa = e),
                  (t.waVerified = !1),
                  (t.waCode = String(Math.floor(1e5 + 9e5 * Math.random()))));
                try {
                  saveUsers(USERS, CU.id);
                } catch (e) {}
                (n("📱 Número guardado. Ahora verifícalo.", "#10B981"), w());
              }
            } else n("El WhatsApp debe tener 10 dígitos", "#EF4444");
          });
        var A = r("cxWaVerify");
        (A &&
          (A.onclick = function () {
            var e = USERS[CU.id];
            if (!e.waCode) {
              e.waCode = String(Math.floor(1e5 + 9e5 * Math.random()));
              try {
                saveUsers(USERS, CU.id);
              } catch (e) {}
            }
            var t = "VINCULAR " + CU.id + " " + e.waCode;
            window.open(
              "https://wa.me/527351587667?text=" + encodeURIComponent(t),
              "_blank",
            );
          }),
          CU.isAdmin && U());
      }
    }
  }
  function U() {
    var t = r("aldoPanel");
    if (t && CU && CU.isAdmin) {
      var a = "";
      (Object.keys(USERS)
        .sort()
        .forEach(function (e) {
          var t = USERS[e];
          t &&
            !t.isAdmin &&
            (a +=
              '<div style="border-bottom:1px solid var(--border);padding:8px 0;font-size:.76rem"><b>' +
              i(t.name || e) +
              '</b> <span style="color:var(--text2)">@' +
              i(e) +
              "</span> · 🪙 " +
              (t.coins || 0) +
              (t.wa
                ? " · 📱 " +
                  i(t.wa) +
                  (t.waVerified ? " ✅" : " ⏳ código " + i(t.waCode || "—"))
                : "") +
              (y(t) ? " · 🌟" : "") +
              '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px"><button data-a="c100" data-u="' +
              i(e) +
              '" class="cxAdmBtn">+100 🪙</button><button data-a="c1000" data-u="' +
              i(e) +
              '" class="cxAdmBtn">+1000 🪙</button>' +
              '<button data-a="b3" data-u="' +
              i(e) +
              '" class="cxAdmBtn">🌟 3 días</button><button data-a="b7" data-u="' +
              i(e) +
              '" class="cxAdmBtn">🌟 7 días</button>' +
              (t.wa && !t.waVerified
                ? '<button data-a="wa" data-u="' +
                  i(e) +
                  '" class="cxAdmBtn">📱 Verificar WhatsApp</button>'
                : "") +
              "</div></div>");
        }),
        (t.innerHTML =
          '<div style="background:var(--card);border:1.5px solid ' +
          e +
          ';border-radius:14px;padding:14px"><div style="font-size:.9rem;font-weight:900;color:' +
          e +
          ';margin-bottom:8px">⚙️ Panel de Aldo · Recompensas</div><style>.cxAdmBtn{padding:6px 9px;border-radius:8px;border:1px solid var(--border);background:rgba(255,255,255,.06);color:var(--text);font-size:.68rem;font-weight:800;cursor:pointer;font-family:inherit}</style>' +
          (a ||
            '<div style="font-size:.76rem;color:var(--text2)">Aún no hay alumnos.</div>') +
          "</div>"),
        t.querySelectorAll(".cxAdmBtn").forEach(function (e) {
          e.onclick = function () {
            var e = this.dataset.a,
              t = this.dataset.u;
            if ("c100" === e) cxGrantCoins(t, 100);
            else if ("c1000" === e) cxGrantCoins(t, 1e3);
            else if ("conf" === e) cxConfirmRef(t);
            else if ("b3" === e) cxBoost(t, 3);
            else if ("b7" === e) cxBoost(t, 7);
            else if ("wa" === e) {
              USERS[t].waVerified = !0;
              try {
                saveUsers(USERS, t);
              } catch (e) {}
              n("📱 WhatsApp verificado", "#10B981");
            }
            U();
          };
        }));
    }
  }
  function E() {
    return;
    if (CU) {
      var e = localStorage.getItem("cxRefBy"),
        t = USERS[CU.id];
      if (t && e && e !== CU.id && !t.refBy && USERS[e]) {
        ((t.refBy = e), (t.refConfirmed = !!t.active));
        try {
          saveUsers(USERS, CU.id);
        } catch (e) {}
        t.refConfirmed && b(e);
      }
    }
  }
  function R() {
    var t = r("recBarWrap");
    if (t && !r("cxReferCard")) {
      var a = o("div");
      ((a.id = "cxReferCard"),
        (a.style.cssText =
          "background:linear-gradient(135deg,rgba(37,211,102,.14),rgba(201,168,76,.12));border:1.5px solid rgba(201,168,76,.5);border-radius:14px;padding:12px;margin-bottom:10px;display:flex;align-items:center;gap:12px"),
        (a.innerHTML =
          s(p(), 46, e) +
          '<div style="flex:1"><div style="font-weight:900;font-size:.86rem;color:' +
          e +
          '">📱 Vincula tu WhatsApp</div><div style="font-size:.72rem;color:var(--text2)">Recupera tu usuario o contraseña y conecta el panel de padres.</div></div><button onclick="showRefer()" style="padding:9px 12px;border-radius:10px;border:none;background:' +
          e +
          ';color:#111;font-weight:900;cursor:pointer;font-family:inherit;font-size:.74rem">Vincular</button>'),
        t.parentNode.insertBefore(a, t));
    }
  }
  if (
    ((window.getCoins = u),
    (window.addCoins = function (e) {
      !CU || e <= 0 || (g(u() + e), n("+" + e + " 🪙 CogniCoins", "#F59E0B"));
    }),
    (window.cxGrantCoins = function (e, t) {
      if (USERS[e]) {
        var a = parseInt(USERS[e].coins || 0, 10) || 0;
        USERS[e].coins = Math.max(0, a + t);
        try {
          saveUsers(USERS, e);
        } catch (e) {}
        (CU &&
          CU.id === e &&
          localStorage.setItem("coins_" + e, USERS[e].coins),
          n(
            (t >= 0 ? "+" : "") + t + " 🪙 para " + (USERS[e].name || e),
            "#F59E0B",
          ));
      }
    }),
    (function () {
      try {
        var e = location.search.match(/[?&]ref=([A-Za-z0-9_\-]{2,32})/);
        localStorage.removeItem("cxRefBy");
      } catch (e) {}
    })(),
    (window.cxConfirmRef = function () {}),
    (window.cxBoost = function (e, t) {
      if (USERS[e]) {
        USERS[e].boostUntil = Date.now() + 864e5 * t;
        try {
          saveUsers(USERS, e);
        } catch (e) {}
        (n(
          "🌟 Popularidad x2 por " + t + " días para " + (USERS[e].name || e),
          "#8B5CF6",
        ),
          U());
      }
    }),
    (window.cxBoostActive = y),
    (window.showRefer = function () {
      (C(), w());
      try {
        show("sc-refer");
      } catch (e) {}
    }),
    "function" == typeof window.showDash)
  ) {
    var k = window.showDash;
    window.showDash = function () {
      var e = k.apply(this, arguments);
      try {
        (c(), E(), R());
      } catch (e) {}
      return e;
    };
  }
  (setTimeout(function () {
    try {
      c();
    } catch (e) {}
  }, 1500),
    (function () {
      if ("function" == typeof window.doLogin) {
        var e = window.doLogin,
          t = window.__cxBaseLogin || e;
        ((window.doLogin = function () {
          var i = r("liU"),
            o = r("liP"),
            n = r("lerr"),
            d = ((i && i.value) || "").trim().toLowerCase(),
            s = (o && o.value) || "";
          if (!d || !s) return e();
          var c = "undefined" != typeof USERS ? USERS[d] : null;
          if (c && c.pass === s) return e();
          var l = document.querySelector(".lg9-card button.lg9-btn");
          (l &&
            ((l.disabled = !0),
            (l.dataset.txt = l.textContent),
            (l.textContent = "🔄 Conectando…")),
            a(
              n,
              "🔄 Conectando con el servidor… (puede tardar unos segundos en redes lentas)",
            ));
          var p = !1,
            f = Date.now();
          function v(e) {
            if (!p)
              if (
                ((p = !0),
                l &&
                  ((l.disabled = !1),
                  l.dataset.txt && (l.textContent = l.dataset.txt)),
                e)
              )
                (n && (n.style.display = "none"), t());
              else {
                var r = "undefined" != typeof USERS ? USERS[d] : null;
                if (r && r.pass === s)
                  return (n && (n.style.display = "none"), void t());
                navigator.onLine
                  ? a(
                      n,
                      r
                        ? "❌ La contraseña no coincide. Revisa mayúsculas y espacios, o pide ayuda al 735 158 7667."
                        : "❌ No encontramos ese usuario. Revisa que esté bien escrito o pide ayuda al 735 158 7667.",
                    )
                  : a(
                      n,
                      "📴 Sin internet. Conéctate y vuelve a intentar — tus datos sí son válidos si ya habías entrado antes.",
                    );
              }
          }
          function u() {
            try {
              window.DB &&
                DB.ref &&
                DB.ref("cog_users/" + d)
                  .once("value")
                  .then(function (e) {
                    var t = e && e.val();
                    if (t) {
                      USERS[d] = t;
                      try {
                        localStorage.setItem(
                          "cog_users",
                          JSON.stringify(USERS),
                        );
                      } catch (e) {}
                    }
                    t && t.pass === s && v(!0);
                  })
                  .catch(function () {});
            } catch (e) {}
          }
          u();
          var g = setInterval(function () {
            if (p) clearInterval(g);
            else {
              var e = "undefined" != typeof USERS ? USERS[d] : null;
              if (e && e.pass === s) return (clearInterval(g), void v(!0));
              (u(), Date.now() - f > 22e3 && (clearInterval(g), v(!1)));
            }
          }, 900);
        }),
          (window.__cxBaseLogin = t));
      }
      function a(e, t) {
        e && ((e.style.display = "block"), (e.textContent = t));
      }
    })(),
    setTimeout(function () {
      var e = setInterval(function () {
        if (window.CU) {
          clearInterval(e);
          try {
            (c(), E(), R());
          } catch (e) {}
        }
      }, 1200);
    }, 2e3));
})();
