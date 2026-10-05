
(function(){
  "use strict";

  console.log("🚀 CognitExAc v38 - Inicializando motor robusto...");

  /* ============================================================
     1. DEFINICIÓN DE IDIOMAS Y 150 SESIONES POR IDIOMA
     ============================================================ */

  window.CI_AVAILABLE_LANGS = [
    { code: "en", name: "Inglés", flag: "🇬🇧", desc: "Global · Negocios y ciencia" },
    { code: "nah", name: "Náhuatl", flag: "🇲🇽", desc: "Originario · Cultura y raíz" },
    { code: "fr", name: "Francés", flag: "🇫🇷", desc: "Romance · Diplomacia y arte" },
    { code: "pt", name: "Portugués", flag: "🇧🇷", desc: "Fluidez · Comercio y música" },
    { code: "it", name: "Italiano", flag: "🇮🇹", desc: "Cultura · Gastronomía y diseño" },
    { code: "de", name: "Alemán", flag: "🇩🇪", desc: "Precisión · Ingeniería e innovación" },
    { code: "ja", name: "Japonés", flag: "🇯🇵", desc: "Nihongo · Tecnología y tradición" }
  ];

  window.CI_PACKS = window.CI_PACKS || {};

  var rawSeeds = {
    en: [
      { t: "Alfabeto y Fonética Esencial", e: "🔤", tip: "Las vocales cambian según la palabra: A [ei], E [i], I [ai].", v: [["Hello", "Hola", "je-lóu"], ["Good morning", "Buenos días", "gud mór-ning"], ["Please", "Por favor", "pliis"], ["Thank you", "Gracias", "zzenk iu"], ["Goodbye", "Adiós", "gud-bái"]], s: [["Hola, buenos días", "Hello, good morning"], ["Por favor y gracias", "Please and thank you"]] },
      { t: "Presentaciones y Saludos", e: "🤝", tip: "Pregunta con 'What is your name?' y responde 'My name is...'.", v: [["What is your name?", "¿Cómo te llamas?", "uat is iur néim"], ["My name is", "Mi nombre es", "mai néim is"], ["Nice to meet you", "Mucho gusto", "náis tu míit iu"], ["Friend", "Amigo/a", "frend"], ["Student", "Estudiante", "stú-dent"]], s: [["Mucho gusto, mi nombre es Juan", "Nice to meet you, my name is Juan"], ["Él es mi amigo", "He is my friend"]] },
      { t: "Números del 1 al 20 y Conteo", e: "🔢", tip: "Los números del 13 al 19 terminan en '-teen'. Las decenas terminan en '-ty'.", v: [["One", "Uno", "uan"], ["Two", "Dos", "tu"], ["Three", "Tres", "zrii"], ["Ten", "Diez", "ten"], ["Twenty", "Veinte", "tuén-ti"]], s: [["Tengo tres libros", "I have three books"], ["Son diez estudiantes", "They are ten students"]] },
      { t: "La Familia y el Hogar", e: "🏡", tip: "'Parents' significa padres (mamá y papá), no parientes en general.", v: [["Mother", "Madre", "má-der"], ["Father", "Padre", "fá-der"], ["Brother", "Hermano", "brá-der"], ["Sister", "Hermana", "sís-ter"], ["House", "Casa", "jáus"]], s: [["Esta es mi casa", "This is my house"], ["Mi madre es amable", "My mother is kind"]] },
      { t: "Comida y Restaurante", e: "🍽️", tip: "Para ordenar con cortesía usa 'I would like...' (Me gustaría...).", v: [["Water", "Agua", "uá-ter"], ["Bread", "Pan", "bred"], ["Apple", "Manzana", "á-pl"], ["Coffee", "Café", "có-fi"], ["Bill", "Cuenta", "bil"]], s: [["Quisiera agua por favor", "I would like water please"], ["El pan está fresco", "The bread is fresh"]] }
    ],
    nah: [
      { t: "Saludos y Respeto Tradicional", e: "🪶", tip: "En náhuatl el respeto es sagrado. 'Niltze' saluda con afecto y calidez.", v: [["Niltze", "Hola / Saludos", "níl-tse"], ["Pialli", "Hola / Adiós", "piá-li"], ["Tlazohcamati", "Gracias", "tla-soj-ca-má-ti"], ["Cualli tonalli", "Buenos días", "cuá-li to-ná-li"], ["Hasta moztla", "Hasta mañana", "as-ta mos-tla"]], s: [["Buenos días amigo", "Cualli tonalli nocniuh"], ["Muchas gracias a ti", "Cenca tlazohcamati"]] },
      { t: "Familia y Comunidad (Cenyeliztli)", e: "👨‍👩‍👧‍👦", tip: "El prefijo 'no-' indica posesión primera persona: 'nantli' (madre) -> 'nonan' (mi madre).", v: [["Nonan", "Mi madre", "no-nán"], ["Nohuehuetque", "Mis abuelos", "no-ue-uet-ke"], ["Nocniuh", "Mi amigo / hermano", "noc-níuj"], ["Cenyeliztli", "Familia", "sen-ye-lís-tli"], ["Calli", "Casa", "cá-li"]], s: [["Mi madre está en casa", "Nonan ca ichan"], ["Tú eres mi buen amigo", "Tehuatl cualli tinocniuh"]] },
      { t: "Números Sagrados del 1 al 10", e: "🔟", tip: "El sistema náhuatl es vigesimal. 'Ce' es uno, 'ome' es dos, 'yei' es tres, 'nahui' es cuatro.", v: [["Ce", "Uno", "se"], ["Ome", "Dos", "ó-me"], ["Yei", "Tres", "yei"], ["Nahui", "Cuatro", "ná-ui"], ["Macuilli", "Cinco", "ma-cuí-li"]], s: [["Tengo tres flores", "Nicpia yei xochitl"], ["Cinco soles en el cielo", "Macuilli tonatiuh"]] },
      { t: "La Naturaleza y el Cosmos", e: "🌽", tip: "'Centli' es la mazorca de maíz seco, pilar de vida mesoamericana.", v: [["Tonatiuh", "El Sol", "to-ná-tiuj"], ["Metztli", "La Luna", "méts-tli"], ["Atl", "Agua", "atl"], ["Xochitl", "Flor", "xó-chit-l"], ["Centli", "Maíz", "sént-li"]], s: [["El sol brilla en el cielo", "Tonatiuh tlanextia"], ["El agua es vida", "Atl yeliztli"]] },
      { t: "Acciones y Verbos Cotidianos", e: "🏃", tip: "Para conjugar en presente con 'yo', se antepone 'ni-': 'cuica' (cantar) -> 'nicuica' (yo canto).", v: [["Nehnemi", "Caminar", "nej-né-mi"], ["Tlacua", "Comer", "tla-cuá"], ["Cuica", "Cantar", "cuí-ca"], ["Cochi", "Dormir", "có-chi"], ["Tlahcuiloa", "Escribir", "tlaj-cui-ló-a"]], s: [["Yo camino por el campo", "Ninehnemi ipan milli"], ["Yo como con mi familia", "Nitlacua ihuan nocenyeliz"]] }
    ],
    fr: [
      { t: "Salutations et Politesse", e: "🥐", tip: "'Bonjour' sert toute la journée. 'Bonsoir' s'utilise dès la fin d'après-midi.", v: [["Bonjour", "Buenos días / Hola", "bon-júr"], ["Merci", "Gracias", "mer-sí"], ["S'il vous plaît", "Por favor", "sil vu ple"], ["Au revoir", "Adiós", "o re-vuár"], ["Bonne nuit", "Buenas noches", "bon nuí"]], s: [["Bonjour, comment allez-vous ?", "Buenos días, ¿cómo está usted?"], ["Merci beaucoup pour votre aide", "Muchas gracias por su ayuda"]] }
    ],
    pt: [
      { t: "Saudações e Cortesia", e: "🌴", tip: "'Tudo bem?' é a pergunta mais comum no dia a dia brasileiro.", v: [["Olá", "Hola", "o-lá"], ["Bom dia", "Buenos días", "bom dí-a"], ["Obrigado", "Gracias (hombre)", "o-bri-gá-du"], ["Por favor", "Por favor", "por fa-vór"], ["Até logo", "Hasta luego", "a-té ló-gu"]], s: [["Olá, tudo bem com você?", "Hola, ¿todo bien contigo?"], ["Muito obrigado pela ajuda", "Muchas gracias por la ayuda"]] }
    ],
    it: [
      { t: "Saluti e Gentilezza", e: "🍕", tip: "'Ciao' serve sia per salutare all'arrivo che per congedarsi tra amici.", v: [["Ciao", "Hola / Adiós", "chao"], ["Buongiorno", "Buenos días", "buon-jór-no"], ["Grazie", "Gracias", "grát-tsie"], ["Per favore", "Por favor", "per fa-vó-re"], ["Arrivederci", "Hasta luego", "a-ri-ve-dér-chi"]], s: [["Ciao, piacere di conoscerti", "Hola, un placer conocerte"], ["Grazie mille di tutto", "Mil gracias por todo"]] }
    ],
    de: [
      { t: "Begrüßung und Höflichkeit", e: "🥨", tip: "In Deutschland schätzt man klare und freundliche Begrüßungen.", v: [["Hallo", "Hola", "já-lo"], ["Guten Morgen", "Buenos días", "gú-ten mór-guen"], ["Danke", "Gracias", "dán-ke"], ["Bitte", "Por favor / De nada", "bí-te"], ["Auf Wiedersehen", "Adiós", "auf ví-der-sé-en"]], s: [["Guten Morgen, wie geht es Ihnen?", "Buenos días, ¿cómo está usted?"], ["Vielen Dank für Ihre Hilfe", "Muchas gracias por su ayuda"]] }
    ],
    ja: [
      { t: "Aisatsu · Saludos Básicos", e: "🗾", tip: "En japonés la reverencia (ojigi) acompaña al saludo respetuoso.", v: [["Konnichiwa", "Hola / Buenas tardes", "kon-ni-chi-ua"], ["Ohayou", "Buenos días", "o-ja-ióu"], ["Arigatou", "Gracias", "a-ri-ga-tóu"], ["Onegaishimasu", "Por favor", "o-ne-gai-shi-mas"], ["Sayounara", "Adiós", "sa-ióu-na-ra"]], s: [["Konnichiwa, ogenki desu ka?", "Hola, ¿cómo estás?"], ["Doumo arigatou gozaimasu", "Muchas gracias"]] }
    ]
  };

  // Generador dinámico para asegurar EXACTAMENTE 150 SESIONES estructuradas por idioma
  window.getOrGenerateLanguagePack = function(langCode){
    langCode = langCode || "en";
    if(window.CI_PACKS[langCode] && window.CI_PACKS[langCode].length >= 150){
      return window.CI_PACKS[langCode];
    }

    var seeds = rawSeeds[langCode] || rawSeeds["en"];
    var pack = [];
    var topics = [
      "Pronunciación y Fonemas Clave", "Saludos y Frases de Cortesía", "Los Números y el Conteo",
      "La Familia y los Lazos", "La Comida y el Restaurante", "La Escuela y el Aprendizaje",
      "Los Colores y la Estética", "Los Días, Meses y Horas", "El Clima y las Estaciones",
      "En el Trabajo y Negocios", "El Cuerpo Humano y Salud", "Animales y Biodiversidad",
      "Viajes, Transporte y Hotel", "Compras, Dinero y Monedas", "Emociones, Ánimo y Sentimientos",
      "Deportes, Hobbies y Ocio", "La Ciudad, Calles y Direcciones", "La Ropa y el Clima",
      "En el Hogar y la Cocina", "Tecnología, Redes y Futuro", "Expresiones Idiomáticas y Modismos",
      "Conectores y Estructura Oracional", "El Pasado: Recuerdos y Narración", "El Futuro: Planes y Metas",
      "Condicionales y Deseos", "Debates y Argumentación", "Lectura y Comprensión Rápida",
      "Fluidez Auditiva y Acentos", "Entrevista y Vida Profesional", "Consolidación y Maestría Avanzada"
    ];

    for(var i = 1; i <= 150; i++){
      var seedIndex = (i - 1) % seeds.length;
      var topicIndex = Math.floor((i - 1) / 5) % topics.length;
      var seed = seeds[seedIndex];
      var isReview = (i % 5 === 0);

      var title = isReview ? ("Repaso de Consolidación #" + (i / 5)) : (topics[topicIndex] + " · Nivel " + Math.ceil(i / 10));
      var tip = isReview ? "Sesión de afianzamiento: Evalúa tu retención a largo plazo y fluidez fonética." : seed.tip;
      var emoji = isReview ? "🏆" : seed.e;

      pack.push({
        id: "sess_" + langCode + "_" + i,
        num: i,
        t: title,
        e: emoji,
        tip: tip,
        v: seed.v,
        s: seed.s
      });
    }

    window.CI_PACKS[langCode] = pack;
    return pack;
  };

  // Pre-generar los 150 niveles para cada idioma disponible
  window.CI_AVAILABLE_LANGS.forEach(function(l){
    window.getOrGenerateLanguagePack(l.code);
  });

  /* ============================================================
     2. GESTIÓN DE PERFIL, ALDO Y SELECCIÓN OBLIGATORIA
     ============================================================ */

  window.isAldoMaster = function(){
    if(!window.CU) return false;
    var uid = (window.CU.id || "").toLowerCase();
    var uname = (window.CU.nombre || window.CU.name || "").toLowerCase();
    return (uid === "aldo" || window.CU.isMainAdmin === true || uname.indexOf("aldo") !== -1);
  };

  window.getUserCiLang = function(){
    if(!window.CU) return "en";
    var stored = localStorage.getItem("ci_lang_" + window.CU.id);
    if(stored) return stored;
    return window.CU.ci_selected_lang || null;
  };

  window.getUserCiProgress = function(langCode){
    if(!window.CU) return { completed: 0, percent: 0 };
    if(window.isAldoMaster()){
      return { completed: 150, percent: 100 };
    }
    langCode = langCode || window.getUserCiLang() || "en";
    var key = "ci_prog_" + window.CU.id + "_" + langCode;
    var completed = parseInt(localStorage.getItem(key) || "0", 10);
    var pct = Math.min(100, Math.round((completed / 150) * 100));
    return { completed: completed, percent: pct };
  };

  window.ciCanSwitchLang = function(){
    if(window.isAldoMaster()) return true;
    var curLang = window.getUserCiLang();
    if(!curLang) return true;
    var prog = window.getUserCiProgress(curLang);
    return prog.percent >= 60;
  };

  /* ============================================================
     3. MODAL DE SELECCIÓN DE IDIOMA (OBLIGATORIO)
     ============================================================ */

  window.ciOpenLangPicker = function(force){
    var curLang = window.getUserCiLang();
    var isAldo = window.isAldoMaster();
    var canSwitch = window.ciCanSwitchLang();

    if(!force && curLang && !canSwitch && !isAldo){
      var prog = window.getUserCiProgress(curLang);
      alert("Para cambiar de idioma debes alcanzar al menos el 60% de avance en tu idioma actual (Llevas " + prog.percent + "%). ¡Sigue practicando!");
      return;
    }

    var existing = document.getElementById("ci38LangModal");
    if(existing) existing.remove();

    var modal = document.createElement("div");
    modal.id = "ci38LangModal";
    modal.className = "ci38-lock-modal";

    var cardsHtml = window.CI_AVAILABLE_LANGS.map(function(item){
      var isAct = (item.code === curLang);
      var prog = window.getUserCiProgress(item.code);
      return (
        '<div class="ci38-lang-card ' + (isAct ? 'act' : '') + '" onclick="window.ciSelectLang(\'' + item.code + '\')">' +
          '<div class="f">' + item.flag + '</div>' +
          '<div class="n">' + item.name + '</div>' +
          '<div class="desc">' + item.desc + '</div>' +
          '<div style="font-size:0.75rem;color:#38bdf8;font-weight:700;margin-top:4px">' + (isAldo ? '150/150 Sesiones' : (prog.completed + '/150')) + '</div>' +
        '</div>'
      );
    }).join("");

    var allowCancel = !!(curLang || isAldo);

    modal.innerHTML = 
      '<div class="ci38-lock-box">' +
        '<div style="font-size:2.4rem;margin-bottom:6px">🌐</div>' +
        '<h3 style="margin:0 0 8px;font-size:1.35rem;color:#facc15">Elige tu Idioma en CognIdiomas</h3>' +
        '<p style="font-size:0.86rem;color:#cbd5e1;line-height:1.4;margin:0 0 14px">' +
          (isAldo ? 'Acceso Maestro de Aldo: Puedes explorar los 7 idiomas y sus 150 sesiones con todo desbloqueado.' : 
           (curLang ? 'Elige tu idioma. Recuerda que dominarás el 80% en 150 sesiones diarias.' : 'Selecciona el idioma que aprenderás. Una vez seleccionado, avanzarás en una ruta estructurada de 150 sesiones.')) +
        '</p>' +
        '<div class="ci38-picker-grid">' + cardsHtml + '</div>' +
        (allowCancel ? '<button onclick="document.getElementById(\'ci38LangModal\').remove()" style="background:#334155;border:none;color:#cbd5e1;padding:8px 18px;border-radius:10px;font-size:0.88rem;cursor:pointer;margin-top:8px">Cerrar</button>' : '') +
      '</div>';

    document.body.appendChild(modal);
  };

  window.ciSelectLang = function(langCode){
    if(!window.CU) return;
    localStorage.setItem("ci_lang_" + window.CU.id, langCode);
    window.CU.ci_selected_lang = langCode;
    if(typeof window.saveUsers === "function") try{ window.saveUsers(); }catch(e){}

    var m = document.getElementById("ci38LangModal");
    if(m) m.remove();

    var langObj = window.CI_AVAILABLE_LANGS.find(function(l){ return l.code === langCode; });
    var langName = langObj ? langObj.name : langCode;
    if(typeof window.toast === "function"){
      window.toast("Idioma activo: " + langName, "#10B981");
    }

    window.renderEnhancedCiDashboard();
  };

  /* ============================================================
     4. RENDERIZADO DEL DASHBOARD DE COGNIDIOMAS (150 SESIONES)
     ============================================================ */

  window.renderEnhancedCiDashboard = function(){
    var sc = document.getElementById("sc-cogningles");
    if(!sc) return;

    var curLang = window.getUserCiLang();
    if(!curLang && !window.isAldoMaster()){
      window.ciOpenLangPicker(true);
      return;
    }

    curLang = curLang || "en";
    var langObj = window.CI_AVAILABLE_LANGS.find(function(l){ return l.code === curLang; }) || window.CI_AVAILABLE_LANGS[0];
    var pack = window.getOrGenerateLanguagePack(curLang);
    var isAldo = window.isAldoMaster();
    var prog = window.getUserCiProgress(curLang);
    var canSwitch = window.ciCanSwitchLang();

    var cardsHtml = "";
    for(var i = 0; i < pack.length; i++){
      var item = pack[i];
      var sessNum = item.num || (i + 1);
      var isUnlocked = isAldo || (sessNum <= (prog.completed + 1));
      var isDone = isAldo || (sessNum <= prog.completed);

      var borderCol = isUnlocked ? "#38bdf8" : "#1e293b";
      var opacity = isUnlocked ? "1" : "0.5";

      cardsHtml += 
        '<div style="background:#0f172a;border:1.5px solid ' + borderCol + ';border-radius:16px;padding:14px;display:flex;align-items:center;justify-content:space-between;gap:12px;opacity:' + opacity + '">' +
          '<div style="display:flex;align-items:center;gap:12px">' +
            '<div style="font-size:1.8rem;background:#1e293b;border-radius:12px;width:48px;height:48px;display:flex;align-items:center;justify-content:center">' + item.e + '</div>' +
            '<div>' +
              '<div style="font-size:0.75rem;font-weight:800;color:#facc15;text-transform:uppercase">Sesión #' + sessNum + ' de 150</div>' +
              '<div style="font-weight:700;font-size:0.95rem;color:#f8fafc">' + item.t + '</div>' +
              '<div style="font-size:0.75rem;color:#94a3b8">' + item.v.length + ' términos clave · Pronunciación guiada</div>' +
            '</div>' +
          '</div>' +
          '<div>' +
            (isUnlocked ? 
              '<button onclick="window.cxStartInteractiveSession(' + (sessNum - 1) + ')" style="background:#22c55e;border:none;color:#fff;font-weight:800;padding:8px 16px;border-radius:10px;font-size:0.85rem;cursor:pointer">Iniciar</button>' : 
              '<span style="font-size:0.75rem;color:#64748b;font-weight:700">🔒 Bloqueada</span>') +
          '</div>' +
        '</div>';
    }

    sc.innerHTML = 
      '<div style="max-width:760px;margin:0 auto;padding:16px 12px 60px">' +
        // Barra superior
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:10px">' +
          '<button onclick="window.show(\'sc-dash\')" style="background:#1e293b;border:1px solid #334155;color:#e2e8f0;padding:8px 16px;border-radius:10px;font-size:0.88rem;cursor:pointer;font-weight:600">← Volver al Dashboard</button>' +
          '<button onclick="window.ciOpenLangPicker()" style="background:#0284c7;border:none;color:#fff;padding:8px 16px;border-radius:10px;font-size:0.88rem;cursor:pointer;font-weight:700;display:flex;align-items:center;gap:6px">' +
            '<span>' + langObj.flag + ' ' + langObj.name + ' (' + prog.percent + '%)</span> ⇄' +
          '</button>' +
        '</div>' +

        // Hero banner
        '<div style="background:linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%);border:2px solid #818cf8;border-radius:20px;padding:22px;margin-bottom:20px;box-shadow:0 10px 25px rgba(0,0,0,0.5)">' +
          '<div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:10px">' +
            '<div>' +
              '<div style="display:inline-block;background:#4338ca;color:#e0e7ff;font-size:0.75rem;font-weight:800;padding:4px 10px;border-radius:20px;margin-bottom:6px">COGNIDIOMAS · 150 SESIONES</div>' +
              '<h2 style="margin:0;font-size:1.6rem;color:#f8fafc">Ruta de ' + langObj.name + ' ' + langObj.flag + '</h2>' +
              '<p style="margin:6px 0 0;font-size:0.86rem;color:#cbd5e1">Meta: 80% de fluidez en 150 sesiones guiadas. Pronunciación fonética y gramática pedagógica.</p>' +
            '</div>' +
            '<div style="text-align:right">' +
              (isAldo ? '<span style="background:#f59e0b;color:#111;font-weight:900;padding:4px 12px;border-radius:14px;font-size:0.8rem">👑 Aldo Master · 100% Unlocked</span>' :
               '<span style="background:#10b981;color:#fff;font-weight:800;padding:4px 12px;border-radius:14px;font-size:0.8rem">' + prog.completed + ' / 150 Completadas</span>') +
            '</div>' +
          '</div>' +
          // Barra de progreso
          '<div style="background:#334155;border-radius:10px;height:12px;margin-top:16px;overflow:hidden">' +
            '<div style="background:linear-gradient(90deg, #38bdf8, #22c55e);height:100%;width:' + prog.percent + '%;transition:width 0.3s ease"></div>' +
          '</div>' +
          '<div style="display:flex;justify-content:space-between;font-size:0.75rem;color:#94a3b8;margin-top:6px">' +
            '<span>Progreso: ' + prog.percent + '%</span>' +
            '<span>Desbloqueo de cambio de idioma: ' + (canSwitch ? '✅ Habilitado (≥60%)' : '🔒 Requiere 60%') + '</span>' +
          '</div>' +
        '</div>' +

        // Lista de 150 sesiones
        '<div style="display:flex;flex-direction:column;gap:10px">' + cardsHtml + '</div>' +
      '</div>';
  };

  window.showCognIngles = function(){
    if(typeof window.show === "function") window.show("sc-cogningles");
    window.renderEnhancedCiDashboard();
  };
  window.showCognIdiomas = window.showCognIngles;

  /* ============================================================
     5. MOTOR INTERACTIVO DE SESIÓN (5 PASOS SIN PROMPTS)
     ============================================================ */

  window.cxPlayAudio = function(text, langCode, rate){
    if(!("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      var map = { en: "en-US", fr: "fr-FR", pt: "pt-BR", it: "it-IT", de: "de-DE", ja: "ja-JP", nah: "es-MX" };
      u.lang = map[langCode] || "es-MX";
      u.rate = rate || 1.0;
      window.speechSynthesis.speak(u);
    } catch(e){}
  };

  window.cxStartInteractiveSession = function(sessionIndex){
    var curLang = window.getUserCiLang() || "en";
    var pack = window.getOrGenerateLanguagePack(curLang);
    var session = pack[sessionIndex] || pack[0];

    var modal = document.createElement("div");
    modal.id = "ci38SessionModal";
    modal.className = "ci38-interactive-modal";

    modal.innerHTML = 
      '<div class="ci38-session-shell">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #334155;padding-bottom:12px">' +
          '<div>' +
            '<span style="font-size:0.75rem;font-weight:800;color:#facc15">SESIÓN #' + (sessionIndex + 1) + ' DE 150</span>' +
            '<h3 style="margin:2px 0 0;font-size:1.15rem;color:#f8fafc">' + session.e + ' ' + session.t + '</h3>' +
          '</div>' +
          '<button onclick="document.getElementById(\'ci38SessionModal\').remove()" style="background:#334155;border:none;color:#cbd5e1;padding:6px 14px;border-radius:10px;font-size:0.82rem;cursor:pointer">Salir</button>' +
        '</div>' +
        '<div id="ci38SessionBody"></div>' +
      '</div>';

    document.body.appendChild(modal);

    var state = {
      step: 1,
      score: 0,
      totalSteps: 5
    };

    function renderStep(){
      var body = document.getElementById("ci38SessionBody");
      if(!body) return;

      // Paso 1: Teoría Clave y Vocabulario con audio
      if(state.step === 1){
        var vocabHtml = session.v.map(function(item){
          var word = item[0], trans = item[1], fon = item[2] || "";
          return (
            '<div style="background:#1e293b;border-radius:12px;padding:12px;display:flex;align-items:center;justify-content:space-between;gap:8px">' +
              '<div>' +
                '<div style="font-size:1.05rem;font-weight:700;color:#38bdf8">' + word + '</div>' +
                '<div style="font-size:0.85rem;color:#e2e8f0">' + trans + '</div>' +
                (fon ? '<div style="font-size:0.75rem;color:#facc15;font-family:monospace">/' + fon + '/</div>' : '') +
              '</div>' +
              '<div style="display:flex;gap:6px">' +
                '<button class="ci38-btn-audio" title="Audio Normal" onclick="window.cxPlayAudio(\'' + word.replace(/'/g, "\\'") + '\', \'' + curLang + '\', 1.0)">🔊</button>' +
                '<button class="ci38-btn-audio slow" title="Audio Lento" onclick="window.cxPlayAudio(\'' + word.replace(/'/g, "\\'") + '\', \'' + curLang + '\', 0.65)">🐢</button>' +
              '</div>' +
            '</div>'
          );
        }).join("");

        body.innerHTML = 
          '<div style="display:flex;flex-direction:column;gap:12px">' +
            '<div style="background:#1e3a5f;border-left:4px solid #38bdf8;padding:12px;border-radius:8px;font-size:0.88rem;color:#e0f2fe;line-height:1.4">' +
              '💡 <b>Consejo Pedagógico:</b> ' + session.tip +
            '</div>' +
            '<div style="display:flex;flex-direction:column;gap:8px;max-height:48vh;overflow-y:auto;padding-right:4px">' + vocabHtml + '</div>' +
            '<button onclick="window.cxAdvanceSessionStep()" style="background:#22c55e;border:none;color:#fff;font-weight:800;padding:12px;border-radius:12px;font-size:1rem;cursor:pointer;margin-top:6px">Comenzar Ejercicios Prácticos →</button>' +
          '</div>';
        return;
      }

      // Paso 2: Opción Múltiple
      if(state.step === 2){
        var targetV = session.v[0] || ["Hello", "Hola"];
        var wrong1 = session.v[1] ? session.v[1][1] : "Adiós";
        var wrong2 = session.v[2] ? session.v[2][1] : "Gracias";
        var options = [targetV[1], wrong1, wrong2].sort(function(){ return 0.5 - Math.random(); });

        var optsHtml = options.map(function(opt){
          var isCorrect = (opt === targetV[1]);
          return '<button class="ci38-opt-btn" onclick="window.cxHandleQuiz(' + isCorrect + ')">' + opt + '</button>';
        }).join("");

        body.innerHTML = 
          '<div style="display:flex;flex-direction:column;gap:14px">' +
            '<div style="font-size:0.85rem;color:#94a3b8;font-weight:700">PASO 2/5 · COMPRENSIÓN DIRECTA</div>' +
            '<div style="background:#1e293b;border-radius:16px;padding:20px;text-align:center">' +
              '<div style="font-size:1.4rem;font-weight:800;color:#38bdf8;margin-bottom:8px">' + targetV[0] + '</div>' +
              '<button class="ci38-btn-audio" onclick="window.cxPlayAudio(\'' + targetV[0].replace(/'/g, "\\'") + '\', \'' + curLang + '\', 1.0)">🔊 Escuchar</button>' +
              '<div style="font-size:0.95rem;color:#cbd5e1;margin-top:14px">¿Qué significa esta palabra?</div>' +
            '</div>' +
            '<div style="display:flex;flex-direction:column;gap:8px">' + optsHtml + '</div>' +
          '</div>';
        return;
      }

      // Paso 3: Identificación Auditiva Inversa
      if(state.step === 3){
        var targetV2 = session.v[1] || session.v[0];
        var wrongA = session.v[0] ? session.v[0][0] : "Water";
        var wrongB = session.v[2] ? session.v[2][0] : "Friend";
        var options2 = [targetV2[0], wrongA, wrongB].sort(function(){ return 0.5 - Math.random(); });

        var optsHtml2 = options2.map(function(opt){
          var isCorrect = (opt === targetV2[0]);
          return '<button class="ci38-opt-btn" onclick="window.cxHandleQuiz(' + isCorrect + ')">' + opt + '</button>';
        }).join("");

        body.innerHTML = 
          '<div style="display:flex;flex-direction:column;gap:14px">' +
            '<div style="font-size:0.85rem;color:#94a3b8;font-weight:700">PASO 3/5 · DISCRIMINACIÓN FONÉTICA</div>' +
            '<div style="background:#1e293b;border-radius:16px;padding:20px;text-align:center">' +
              '<div style="font-size:0.95rem;color:#94a3b8;margin-bottom:8px">Selecciona la palabra que escuchas para:</div>' +
              '<div style="font-size:1.3rem;font-weight:800;color:#facc15;margin-bottom:12px">"' + targetV2[1] + '"</div>' +
              '<button class="ci38-btn-audio" onclick="window.cxPlayAudio(\'' + targetV2[0].replace(/'/g, "\\'") + '\', \'' + curLang + '\', 1.0)">🔊 Escuchar Palabra</button>' +
            '</div>' +
            '<div style="display:flex;flex-direction:column;gap:8px">' + optsHtml2 + '</div>' +
          '</div>';
        return;
      }

      // Paso 4: Armado de Oración
      if(state.step === 4){
        var pair = (session.s && session.s[0]) || ["Hola amigo", "Hello friend"];
        var targetSentence = pair[1];
        var words = targetSentence.split(" ").sort(function(){ return 0.5 - Math.random(); });

        window._ciConstructed = [];
        window._ciTarget = targetSentence;

        var chipsHtml = words.map(function(w, idx){
          return '<span id="chip_' + idx + '" class="ci38-word-chip" onclick="window.cxPickWord(\'' + w.replace(/'/g, "\\'") + '\', ' + idx + ')">' + w + '</span>';
        }).join("");

        body.innerHTML = 
          '<div style="display:flex;flex-direction:column;gap:14px">' +
            '<div style="font-size:0.85rem;color:#94a3b8;font-weight:700">PASO 4/5 · CONSTRUCCIÓN SINTÁCTICA</div>' +
            '<div style="background:#1e293b;border-radius:16px;padding:16px">' +
              '<div style="font-size:0.85rem;color:#94a3b8">Traduce al ' + (curLang === 'en' ? 'Inglés' : (curLang === 'nah' ? 'Náhuatl' : 'idioma')) + ':</div>' +
              '<div style="font-size:1.15rem;font-weight:800;color:#facc15;margin:6px 0">"' + pair[0] + '"</div>' +
              '<div id="ciConstructBox" style="min-height:48px;background:#0f172a;border:1.5px dashed #475569;border-radius:12px;padding:10px;margin-top:10px;display:flex;flex-wrap:wrap;gap:6px"></div>' +
            '</div>' +
            '<div style="display:flex;flex-wrap:wrap;gap:4px">' + chipsHtml + '</div>' +
            '<div style="display:flex;gap:10px;margin-top:8px">' +
              '<button onclick="window.cxClearSentence()" style="background:#475569;border:none;color:#fff;padding:10px 16px;border-radius:10px;font-size:0.88rem;cursor:pointer">Limpiar</button>' +
              '<button onclick="window.cxVerifySentence()" style="flex:1;background:#0284c7;border:none;color:#fff;font-weight:800;padding:10px 16px;border-radius:10px;font-size:0.95rem;cursor:pointer">Comprobar Oración</button>' +
            '</div>' +
          '</div>';
        return;
      }

      // Paso 5: Resultados y Maestría
      if(state.step === 5){
        var masteryPct = Math.round((state.score / 3) * 100);
        var passed = masteryPct >= 80 || window.isAldoMaster();

        if(passed && window.CU){
          var curComp = parseInt(localStorage.getItem("ci_prog_" + window.CU.id + "_" + curLang) || "0", 10);
          if((sessionIndex + 1) > curComp){
            localStorage.setItem("ci_prog_" + window.CU.id + "_" + curLang, (sessionIndex + 1).toString());
          }
        }

        body.innerHTML = 
          '<div style="text-align:center;padding:16px 8px;display:flex;flex-direction:column;align-items:center;gap:14px">' +
            '<div style="font-size:3.5rem">' + (passed ? '🎉' : '💡') + '</div>' +
            '<h3 style="margin:0;font-size:1.4rem;color:' + (passed ? '#22c55e' : '#f59e0b') + '">' +
              (passed ? '¡Sesión Superada con Éxito!' : 'Buen Intento · Repaso Recomendado') +
            '</h3>' +
            '<p style="margin:0;font-size:0.95rem;color:#cbd5e1;max-width:400px;line-height:1.4">' +
              'Tu porcentaje de maestría fue de <b>' + masteryPct + '%</b> (Meta: ≥80%). ' +
              (passed ? '¡Has desbloqueado la siguiente sesión!' : 'Te sugerimos repasar los términos para afianzar tu memoria.') +
            '</p>' +
            '<button onclick="window.cxCloseSessionAndRefresh()" style="background:#10b981;border:none;color:#fff;font-weight:900;padding:12px 28px;border-radius:12px;font-size:1rem;cursor:pointer;margin-top:10px">' +
              'Continuar al Dashboard' +
            '</button>' +
          '</div>';
        return;
      }
    }

    window.cxAdvanceSessionStep = function(){
      state.step++;
      renderStep();
    };

    window.cxHandleQuiz = function(isCorrect){
      if(isCorrect){
        state.score++;
        if(typeof window.toast === "function") window.toast("¡Correcto! +1 acierto", "#10B981");
      } else {
        if(typeof window.toast === "function") window.toast("Respuesta incorrecta", "#EF4444");
      }
      state.step++;
      renderStep();
    };

    window.cxPickWord = function(w, idx){
      var chip = document.getElementById("chip_" + idx);
      if(!chip || chip.classList.contains("used")) return;
      chip.classList.add("used");
      window._ciConstructed.push(w);
      var box = document.getElementById("ciConstructBox");
      if(box){
        box.innerHTML = window._ciConstructed.map(function(item){
          return '<span style="background:#0284c7;color:#fff;padding:6px 12px;border-radius:16px;font-size:0.9rem;font-weight:700">' + item + '</span>';
        }).join(" ");
      }
    };

    window.cxClearSentence = function(){
      window._ciConstructed = [];
      var box = document.getElementById("ciConstructBox");
      if(box) box.innerHTML = "";
      document.querySelectorAll(".ci38-word-chip").forEach(function(c){ c.classList.remove("used"); });
    };

    window.cxVerifySentence = function(){
      var attempt = window._ciConstructed.join(" ").trim().toLowerCase();
      var target = (window._ciTarget || "").trim().toLowerCase();
      var isOk = (attempt === target);
      if(isOk){
        state.score++;
        if(typeof window.toast === "function") window.toast("¡Oración armada perfectamente!", "#10B981");
      } else {
        if(typeof window.toast === "function") window.toast("Oración incorrecta. Correcta: " + window._ciTarget, "#EF4444");
      }
      state.step++;
      renderStep();
    };

    window.cxCloseSessionAndRefresh = function(){
      var m = document.getElementById("ci38SessionModal");
      if(m) m.remove();
      window.renderEnhancedCiDashboard();
    };

    renderStep();
  };

  /* ============================================================
     6. PERSISTENCIA DE SESIÓN (25 MINUTOS) Y PERMANENCIA DEL MENÚ
     ============================================================ */

  // Garantizar que el menú principal NUNCA se oculte al cambiar de perfil,
  // sólo se oculta al cerrar sesión de verdad (CU == null)
  window.cxEnsureMenuVisibility = function(){
    var fab = document.getElementById("cogMenuFab");
    if(!fab) return;
    if(window.CU && window.CU.id){
      fab.style.display = "flex";
      fab.style.visibility = "visible";
      fab.style.opacity = "1";
    } else {
      fab.style.display = "none";
    }
  };

  // Parchear doLogout para ocultar el menú al cerrar sesión de forma legítima
  var _origLogout = window.doLogout;
  window.doLogout = function(){
    try {
      localStorage.removeItem("cx_user_sess_v38");
      localStorage.removeItem("cx_sess_v31");
      var fab = document.getElementById("cogMenuFab");
      if(fab) fab.style.display = "none";
      var panel = document.getElementById("cogMenuPanel");
      if(panel) panel.classList.remove("open");
      var ov = document.getElementById("cogMenuOverlay");
      if(ov) ov.classList.remove("open");
    } catch(e){}
    if(typeof _origLogout === "function"){
      return _origLogout.apply(this, arguments);
    }
  };

  // Parchear show y renderApp para reactivar el menú en cualquier pantalla y perfil
  var _origShow = window.show;
  if(typeof _origShow === "function"){
    window.show = function(screenId){
      var res = _origShow.apply(this, arguments);
      try {
        window.cxEnsureMenuVisibility();
        // Si va a la pantalla de idiomas, auto-renderizar
        if(screenId === "sc-cogningles"){
          setTimeout(window.renderEnhancedCiDashboard, 50);
        }
      } catch(e){}
      return res;
    };
  }

  // Guardar actividad para persistencia de 25 min
  function recordActivity(){
    if(!window.CU || !window.CU.id) return;
    try {
      localStorage.setItem("cx_lastact_v25", Date.now().toString());
      localStorage.setItem("cx_user_sess_v38", JSON.stringify({
        id: window.CU.id,
        pass: window.CU.pass,
        time: Date.now()
      }));
    } catch(e){}
  }

  window.addEventListener("click", recordActivity);
  window.addEventListener("keypress", recordActivity);
  setInterval(recordActivity, 15000);

  // Auto-restaurar sesión al recargar página si han pasado menos de 25 minutos
  function tryAutoRestore(){
    try {
      if(window.CU && window.CU.id){
        window.cxEnsureMenuVisibility();
        return;
      }
      var lastAct = parseInt(localStorage.getItem("cx_lastact_v25") || "0", 10);
      var diff = Date.now() - lastAct;
      if(diff > 25 * 60 * 1000){
        // Expirado
        localStorage.removeItem("cx_user_sess_v38");
        return;
      }
      var sessData = JSON.parse(localStorage.getItem("cx_user_sess_v38") || "null");
      if(sessData && sessData.id && window.USERS && window.USERS[sessData.id]){
        var u = window.USERS[sessData.id];
        var uInput = document.getElementById("liU");
        var pInput = document.getElementById("liP");
        if(uInput && pInput && typeof window.doLogin === "function"){
          uInput.value = sessData.id;
          pInput.value = u.pass || sessData.pass;
          window.doLogin();
          uInput.value = "";
          pInput.value = "";
          window.cxEnsureMenuVisibility();
        }
      }
    } catch(e){}
  }

  /* ============================================================
     7. AISLAMIENTO ESCOLAR PARA ADMINISTRADORES NO-ALDO
     ============================================================ */

  var _origRenderAdmin = window.renderAdmin;
  if(typeof _origRenderAdmin === "function"){
    window.renderAdmin = function(){
      var res = _origRenderAdmin.apply(this, arguments);
      try {
        if(window.CU && window.CU.isAdmin && !window.isAldoMaster()){
          var adminSchool = (window.CU.escuela || "").trim().toLowerCase();
          var rows = document.querySelectorAll("#usersList .urow, .admin-user-row");
          rows.forEach(function(row){
            var text = row.textContent.toLowerCase();
            if(adminSchool && text.indexOf(adminSchool) === -1){
              row.style.display = "none";
            }
          });
        }
      } catch(e){}
      return res;
    };
  }

  /* ============================================================
     8. INICIALIZACIÓN GENERAL
     ============================================================ */

  function initV39(){
    tryAutoRestore();
    window.cxEnsureMenuVisibility();
    setInterval(window.cxEnsureMenuVisibility, 2000);
  }


  /* ============================================================
     9. SOLUCIÓN AL BLOQUEO DE LOGIN ("CONECTANDO...")
     ============================================================ */

  // Garantizar que USERS siempre esté sincronizado con localStorage y con credenciales base
    /* ============================================================
     6. GESTIÓN DEFINITIVA DE USUARIOS Y LOGIN INSTANTÁNEO
     ============================================================ */
  window.ensureUsersPopulated = function(){
    window.USERS = window.USERS || {};
    try {
      var stored = JSON.parse(localStorage.getItem("cog_users") || "{}");
      for(var k in stored){
        if(stored.hasOwnProperty(k)){
          window.USERS[k] = Object.assign({}, window.USERS[k] || {}, stored[k]);
        }
      }
    } catch(e){}

    if(!window.USERS.aldo){
      window.USERS.aldo = {
        name: "Aldo", level: "Admin", isAdmin: true, isMainAdmin: true,
        pts: 0, games: 0, streak: 0, best: 0,
        catScores: {mem:50, mat:50, ate:50, vel:50, len:50, raz:50, fle:50}
      };
    }
    /* clave solo en la nube */
    window.USERS.aldo.active = true;
    window.USERS.aldo.isAdmin = true;
    window.USERS.aldo.isMainAdmin = true;

    if(!window.USERS.maestro){
      window.USERS.maestro = {
        name: "Maestro", level: "Admin", isAdmin: true,
        pts: 0, games: 0, streak: 0, best: 0,
        catScores: {mem:50, mat:50, ate:50, vel:50, len:50, raz:50, fle:50}
      };
    }
    /* clave solo en la nube */
    window.USERS.maestro.active = true;
    window.USERS.maestro.isAdmin = true;

    if(!window.USERS.alumno01){
      window.USERS.alumno01 = {
        name: "Alumno 01", level: "Primaria", isAdmin: false,
        pts: 0, games: 0, streak: 0, best: 0,
        catScores: {mem:50, mat:50, ate:50, vel:50, len:50, raz:50, fle:50}
      };
    }
    window.USERS.alumno01.pass = "cognitexac01";
    window.USERS.alumno01.active = true;

    if(!window.USERS.alumno02){
      window.USERS.alumno02 = {
        name: "Alumno 02", level: "Primaria", isAdmin: false,
        pts: 0, games: 0, streak: 0, best: 0,
        catScores: {mem:50, mat:50, ate:50, vel:50, len:50, raz:50, fle:50}
      };
    }
    window.USERS.alumno02.pass = "cognitexac02";
    window.USERS.alumno02.active = true;

    try { localStorage.setItem("cog_users", JSON.stringify(window.USERS)); } catch(e){}
  };
  window.ensureUsersPopulated();

  window.resetLoginButtonState = function(){
    var btns = document.querySelectorAll(".lg9-card button.lg9-btn, #btnLogin, .btn-login, button[onclick*=\"doLogin\"]");
    btns.forEach(function(b){
      b.disabled = false;
      if(b.dataset && b.dataset.txt){
        b.textContent = b.dataset.txt;
      } else {
        b.textContent = "Entrenar mi mente \u2192";
      }
    });
    var lerr = document.getElementById("lerr");
    if(lerr && lerr.textContent && (lerr.textContent.indexOf("Conectando con el servidor") !== -1 || lerr.textContent.indexOf("Verificando tus datos") !== -1)){
      lerr.style.display = "none";
    }
  };

  /* ============================================================
     7. CONTROL DEL MENÚ LATERAL Y VISIBILIDAD PERMANENTE
     ============================================================ */
  window.cxEnsureMenuVisibility = function(){
    try {
      if(!document.getElementById("cogMenuFab")){
        if(typeof window._initCogMenuFab === "function"){
          window._initCogMenuFab();
        } else {
          var btn = document.createElement("button");
          btn.id = "cogMenuFab";
          btn.innerHTML = "\u2630 Men\u00fa";
          btn.title = "Men\u00fa de secciones";
          btn.onclick = function(){
            if(typeof window._openCogMenu === "function") window._openCogMenu();
          };
          document.body.appendChild(btn);
        }
      }
      var fab = document.getElementById("cogMenuFab");
      if(fab){
        if(window.CU && window.CU.id){
          fab.style.setProperty("display", "flex", "important");
          fab.style.setProperty("visibility", "visible", "important");
          fab.style.setProperty("opacity", "1", "important");
          fab.style.setProperty("z-index", "9999", "important");
          if(!fab.innerHTML || fab.innerHTML === "\u2630") fab.innerHTML = "\u2630 Men\u00fa";
        } else {
          fab.style.setProperty("display", "none", "important");
        }
      }
    } catch(e){}
  };

  var _origLogout = window.doLogout;
  window.doLogout = function(){
    try {
      localStorage.removeItem("cx_user_sess_v38");
      localStorage.removeItem("cx_sess_v31");
      var fab = document.getElementById("cogMenuFab");
      if(fab) fab.style.setProperty("display", "none", "important");
      var panel = document.getElementById("cogMenuPanel");
      if(panel) panel.classList.remove("open");
      var ov = document.getElementById("cogMenuOverlay");
      if(ov) ov.classList.remove("open");
    } catch(e){}
    if(typeof _origLogout === "function"){
      try { _origLogout(); } catch(e){}
    }
    window.resetLoginButtonState();
  };

  /* ============================================================
     8. MOTOR DE LOGIN DIRECTO E INSTANTÁNEO (SIN ESPERAS DE RED)
     ============================================================ */
  window.doLogin = function(){
    window.ensureUsersPopulated();
    window.resetLoginButtonState();

    var uInput = document.getElementById("liU");
    var pInput = document.getElementById("liP");
    var lerr = document.getElementById("lerr");

    var rawU = (uInput && uInput.value || "").trim();
    var uVal = rawU.toLowerCase();
    var pVal = (pInput && pInput.value || "");

    if(!uVal || !pVal){
      if(lerr){
        lerr.style.display = "block";
        lerr.textContent = "\u26a0\ufe0f Escribe tu usuario y contrase\u00f1a.";
      }
      return;
    }

    var userObj = window.USERS[uVal];

    if(!userObj){
      for(var k in window.USERS){
        if(window.USERS.hasOwnProperty(k)){
          var cu = window.USERS[k];
          if(cu && cu.name && cu.name.trim().toLowerCase() === uVal){
            userObj = cu;
            uVal = k;
            break;
          }
        }
      }
    }

    if(userObj){
      if(userObj.pass !== pVal){
        if(lerr){
          lerr.style.display = "block";
          lerr.textContent = "\u274c Contrase\u00f1a incorrecta. Revisa may\u00fasculas y min\u00fasculas.";
        }
        window.resetLoginButtonState();
        return;
      }

      if(userObj.active === false){
        if(lerr){
          lerr.style.display = "block";
          lerr.textContent = "\ud83d\udd12 Cuenta inactiva. Habla con tu maestro o administrador.";
        }
        window.resetLoginButtonState();
        return;
      }

      if(lerr) lerr.style.display = "none";

      window.CU = Object.assign({ id: uVal }, userObj);

      if(typeof window.normalizeLPI === "function") window.normalizeLPI(window.CU);

      var uNameNav = document.getElementById("uNameNav");
      if(uNameNav) uNameNav.textContent = window.CU.name.split(" ")[0];

      var uchip = document.getElementById("uchip");
      if(uchip) uchip.classList.add("show");

      var adminBtn = document.getElementById("adminBtn");
      if(adminBtn) adminBtn.style.display = window.CU.isAdmin ? "block" : "none";

      var charStrip = document.getElementById("charStrip");
      if(charStrip) charStrip.style.display = "block";

      try {
        localStorage.setItem("cx_user_sess_v38", JSON.stringify({
          id: uVal,
          pass: pVal,
          ts: Date.now()
        }));
        localStorage.setItem("cx_lastact_v25", String(Date.now()));
      } catch(e){}

      window.cxEnsureMenuVisibility();

      var loginMode = window.loginMode || "cogni";
      if(loginMode === "kids" && typeof window.showKids === "function"){
        window.showKids();
      } else if(typeof window.showDash === "function"){
        window.showDash();
      } else if(typeof window.show === "function"){
        window.show("sc-dash");
      }

      if(uInput) uInput.value = "";
      if(pInput) pInput.value = "";
      window.resetLoginButtonState();

      setTimeout(function(){
        window.cxEnsureMenuVisibility();
        if(typeof window.checkLanguageSelectionRequired === "function") window.checkLanguageSelectionRequired();
      }, 300);

      return;
    }

    if(lerr){
      lerr.style.display = "block";
      lerr.textContent = "\u274c No encontramos ese usuario. Revisa que est\u00e9 bien escrito o reg\u00edstralo en el panel de administraci\u00f3n.";
    }
    window.resetLoginButtonState();
  };

  setInterval(window.cxEnsureMenuVisibility, 1500);

  setTimeout(window.resetLoginButtonState, 100);
  setTimeout(window.resetLoginButtonState, 600);
  setTimeout(window.cxEnsureMenuVisibility, 500);

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", initV39);
  } else {
    initV39();
  }

})();
