

/* ============================================================
   COGNITEXAC v34 — LÓGICA DE ESTIMULACIÓN TEMPRANA + PSICOANÁLISIS
   ============================================================ */
(function(){
"use strict";

function docId(id){return document.getElementById(id);}
function uid(){return (window.CU && CU.id) || "guest";}
function esc(s){return String(s==null?"":s).replace(/[&<>'"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c];});}
function notif(m,c){try{window.notify?notify(m,c||"#10B981"):console.log(m);}catch(e){}}

/* --- SÍNTESIS DE AUDIO REAL-TIME (Web Audio API) --- */
var _audioCtx = null;
function getAudioCtx(){
  if(!_audioCtx){
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if(Ctx) _audioCtx = new Ctx();
  }
  if(_audioCtx && _audioCtx.state === "suspended") {
    _audioCtx.resume().catch(function(){});
  }
  return _audioCtx;
}

function playKidChime(type){
  try{
    var ctx = getAudioCtx();
    if(!ctx) return;
    var now = ctx.currentTime;
    if(type === "correct"){
      // Acorde triunfal alegre: C5 -> E5 -> G5
      [523.25, 659.25, 783.99].forEach(function(freq, idx){
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.28, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.48);
      });
    } else if(type === "retry"){
      // Tono suave amigable (sin sonar a error punitivo)
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.25);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if(type === "fanfare"){
      // Fanfarria de victoria
      [523.25, 659.25, 783.99, 1046.50].forEach(function(freq, idx){
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gain.gain.setValueAtTime(0.3, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.65);
      });
    }
  }catch(e){}
}

/* --- VOZ EN ESPAÑOL DE MÉXICO PARA INSTRUCCIÓN AUDIOVISUAL --- */
function speakKid(text){
  if(!text || !("speechSynthesis" in window)) return;
  try{
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = "es-MX";
    u.rate = 0.84; // ritmo pausado para niños pequeños
    u.pitch = 1.15; // tono cálido y alegre
    var voices = window.speechSynthesis.getVoices() || [];
    var mxVoice = voices.find(function(v){return v.lang && (v.lang.toLowerCase()==="es-mx" || v.lang.toLowerCase()==="es_mx");}) ||
                  voices.find(function(v){return v.lang && v.lang.toLowerCase().startsWith("es");});
    if(mxVoice) u.voice = mxVoice;
    window.speechSynthesis.speak(u);
  }catch(e){}
}

/* ============================================================
   1) MOTOR DE ZONA KIDS (MATERNAL–KÍNDER · SIN LEER · OÍR, VER, TOCAR)
   ============================================================ */
var KIDS_CATEGORIES = [
  {id:"colores", name:"Colores", icon:"🎨", bg:"linear-gradient(135deg,#FF5E62,#FF9966)", desc:"Rojo, azul, amarillo y más"},
  {id:"formas", name:"Formas", icon:"🔺", bg:"linear-gradient(135deg,#36D1DC,#5B86E5)", desc:"Círculos, triángulos, estrellas"},
  {id:"animales", name:"Animales", icon:"🐶", bg:"linear-gradient(135deg,#11998E,#38EF7D)", desc:"¿Quién hace este sonido?"},
  {id:"contar", name:"A Contar", icon:"🔢", bg:"linear-gradient(135deg,#F7971E,#FFD200)", desc:"Deditos y frutitas (1 al 10)"},
  {id:"tamanos", name:"Tamaños", icon:"📏", bg:"linear-gradient(135deg,#8E2DE2,#4A00E0)", desc:"Grande vs pequeño"},
  {id:"frutas", name:"Frutitas", icon:"🍎", bg:"linear-gradient(135deg,#EB3349,#F45C43)", desc:"Manzana, plátano, fresa"},
  {id:"transportes", name:"Transporte", icon:"🚗", bg:"linear-gradient(135deg,#00B4DB,#0083B0)", desc:"Carro, avión, tren y barco"},
  {id:"naturaleza", name:"Naturaleza", icon:"☀️", bg:"linear-gradient(135deg,#F2994A,#F2C94C)", desc:"Sol, lluvia, luna y flores"},
  {id:"cuerpo", name:"Caritas", icon:"👀", bg:"linear-gradient(135deg,#A18CD1,#FBC2EB)", desc:"Ojos, orejas y emociones"},
  {id:"musica", name:"Música", icon:"🎵", bg:"linear-gradient(135deg,#FA709A,#FEE140)", desc:"Tambor, trompeta y maracas"}
];

var KIDS_BANK = {
  colores: [
    {stim:"🔴", audio:"Toca el color rojo", opts:[{hex:"#EF4444"},{hex:"#3B82F6"},{hex:"#10B981"},{hex:"#F59E0B"}], c:0},
    {stim:"🔵", audio:"Toca el color azul", opts:[{hex:"#10B981"},{hex:"#3B82F6"},{hex:"#EF4444"},{hex:"#F59E0B"}], c:1},
    {stim:"🟡", audio:"Toca el color amarillo como el sol", opts:[{hex:"#3B82F6"},{hex:"#EF4444"},{hex:"#EAB308"},{hex:"#8B5CF6"}], c:2},
    {stim:"🟢", audio:"Toca el color verde como las hojitas", opts:[{hex:"#EF4444"},{hex:"#10B981"},{hex:"#3B82F6"},{hex:"#EC4899"}], c:1},
    {stim:"🟠", audio:"Toca el color naranja", opts:[{hex:"#F97316"},{hex:"#3B82F6"},{hex:"#10B981"},{hex:"#6B7280"}], c:0},
    {stim:"🟣", audio:"Toca el color morado", opts:[{hex:"#10B981"},{hex:"#8B5CF6"},{hex:"#EF4444"},{hex:"#EAB308"}], c:1},
    {stim:"🌸", audio:"Toca el color rosa", opts:[{hex:"#EC4899"},{hex:"#3B82F6"},{hex:"#F97316"},{hex:"#10B981"}], c:0},
    {stim:"⚪", audio:"Toca el color blanco", opts:[{hex:"#1F2937"},{hex:"#FFFFFF"},{hex:"#EF4444"},{hex:"#3B82F6"}], c:1}
  ],
  formas: [
    {stim:"👂", audio:"Toca el círculo redondo", opts:[{emo:"⭕"},{emo:"🔺"},{emo:"⬛"},{emo:"⭐"}], c:0},
    {stim:"👂", audio:"Toca el triángulo con tres piquitos", opts:[{emo:"⬛"},{emo:"🔺"},{emo:"⭕"},{emo:"❤️"}], c:1},
    {stim:"👂", audio:"Toca la estrella brillante", opts:[{emo:"⭕"},{emo:"🔺"},{emo:"⭐"},{emo:"⬛"}], c:2},
    {stim:"👂", audio:"Toca el corazón de amor", opts:[{emo:"❤️"},{emo:"⬛"},{emo:"🔺"},{emo:"⭕"}], c:0},
    {stim:"👂", audio:"Toca el cuadrado como una cajita", opts:[{emo:"🔺"},{emo:"⭕"},{emo:"⭐"},{emo:"⬛"}], c:3},
    {stim:"👂", audio:"Toca la luna en el cielo", opts:[{emo:"🌙"},{emo:"⭕"},{emo:"🔺"},{emo:"⬛"}], c:0}
  ],
  animales: [
    {stim:"👂", audio:"¿Quién dice ¡guau guau!?", opts:[{emo:"🐶"},{emo:"🐱"},{emo:"🐮"},{emo:"🐸"}], c:0},
    {stim:"👂", audio:"¿Quién dice ¡miau miau!?", opts:[{emo:"🐶"},{emo:"🐱"},{emo:"🐰"},{emo:"🦁"}], c:1},
    {stim:"👂", audio:"¿Quién dice ¡muuu!?", opts:[{emo:"🐷"},{emo:"🐮"},{emo:"🐑"},{emo:"🐴"}], c:1},
    {stim:"👂", audio:"¿Quién hace ¡cuac cuac! en el agua?", opts:[{emo:"🦆"},{emo:"🐔"},{emo:"🐶"},{emo:"🐱"}], c:0},
    {stim:"👂", audio:"¿Quién ruge muy fuerte: ¡grrr!?", opts:[{emo:"🐰"},{emo:"🦁"},{emo:"🐹"},{emo:"🐥"}], c:1},
    {stim:"👂", audio:"¿Quién salta y dice ¡croac croac!?", opts:[{emo:"🐸"},{emo:"🐶"},{emo:"🐱"},{emo:"🐮"}], c:0},
    {stim:"👂", audio:"¿Quién dice ¡pío pío!?", opts:[{emo:"🐥"},{emo:"🦆"},{emo:"🐸"},{emo:"🐷"}], c:0},
    {stim:"👂", audio:"¿Quién tiene trompa gigante y orejotas?", opts:[{emo:"🐘"},{emo:"🐭"},{emo:"🐱"},{emo:"🐰"}], c:0}
  ],
  contar: [
    {stim:"🍎", audio:"Toca cuántas manzanas hay: una manzana", opts:[{emo:"1️⃣"},{emo:"2️⃣"},{emo:"3️⃣"},{emo:"4️⃣"}], c:0},
    {stim:"⭐⭐", audio:"Cuenta las estrellas: una y dos", opts:[{emo:"1️⃣"},{emo:"2️⃣"},{emo:"3️⃣"},{emo:"4️⃣"}], c:1},
    {stim:"🎈🎈🎈", audio:"Cuenta los globos: uno, dos y tres", opts:[{emo:"2️⃣"},{emo:"3️⃣"},{emo:"4️⃣"},{emo:"5️⃣"}], c:1},
    {stim:"🍪🍪🍪🍪", audio:"Cuenta las galletitas: hay cuatro", opts:[{emo:"2️⃣"},{emo:"3️⃣"},{emo:"4️⃣"},{emo:"5️⃣"}], c:2},
    {stim:"🌸🌸🌸🌸🌸", audio:"Cuenta las florecitas: ¡son cinco!", opts:[{emo:"3️⃣"},{emo:"4️⃣"},{emo:"5️⃣"},{emo:"6️⃣"}], c:2}
  ],
  tamanos: [
    {stim:"👂", audio:"Toca el animal más grande", opts:[{emo:"🐭", size:2.2},{emo:"🐘", size:4.8}], c:1},
    {stim:"👂", audio:"Toca la fruta más chiquita", opts:[{emo:"🍉", size:4.6},{emo:"🍒", size:2.2}], c:1},
    {stim:"👂", audio:"Toca el osito más grande", opts:[{emo:"🧸", size:4.8},{emo:"🧸", size:2.2}], c:0},
    {stim:"👂", audio:"Toca el más alto", opts:[{emo:"🦒", size:4.8},{emo:"🐢", size:2.2}], c:0},
    {stim:"👂", audio:"Toca el más pequeñito", opts:[{emo:"🐜", size:2.2},{emo:"🦛", size:4.8}], c:0}
  ],
  frutas: [
    {stim:"👂", audio:"Toca la manzana roja", opts:[{emo:"🍎"},{emo:"🍌"},{emo:"🍇"},{emo:"🍊"}], c:0},
    {stim:"👂", audio:"Toca el plátano amarillo", opts:[{emo:"🍎"},{emo:"🍌"},{emo:"🍓"},{emo:"🍉"}], c:1},
    {stim:"👂", audio:"Toca las uvas moradas", opts:[{emo:"🍊"},{emo:"🍇"},{emo:"🍎"},{emo:"🍌"}], c:1},
    {stim:"👂", audio:"Toca la fresa deliciosa", opts:[{emo:"🍓"},{emo:"🍉"},{emo:"🥕"},{emo:"🍋"}], c:0},
    {stim:"👂", audio:"Toca la sandía verde por fuera y roja por dentro", opts:[{emo:"🍌"},{emo:"🍉"},{emo:"🍎"},{emo:"🍇"}], c:1}
  ],
  transportes: [
    {stim:"👂", audio:"Toca el carro que hace ¡bip bip!", opts:[{emo:"🚗"},{emo:"✈️"},{emo:"⛵"},{emo:"🚲"}], c:0},
    {stim:"👂", audio:"Toca el avión que vuela en las nubes", opts:[{emo:"🚗"},{emo:"✈️"},{emo:"🚂"},{emo:"⛵"}], c:1},
    {stim:"👂", audio:"Toca el tren que hace ¡chuu chuu!", opts:[{emo:"✈️"},{emo:"🚗"},{emo:"🚂"},{emo:"🚲"}], c:2},
    {stim:"👂", audio:"Toca el barco que nada en el mar", opts:[{emo:"⛵"},{emo:"🚗"},{emo:"✈️"},{emo:"🚂"}], c:0},
    {stim:"👂", audio:"Toca la bicicleta con dos ruedas", opts:[{emo:"🚂"},{emo:"🚲"},{emo:"🚗"},{emo:"⛵"}], c:1}
  ],
  naturaleza: [
    {stim:"👂", audio:"Toca el sol caliente del día", opts:[{emo:"☀️"},{emo:"🌧️"},{emo:"🌙"},{emo:"🌈"}], c:0},
    {stim:"👂", audio:"Toca la nube con gotas de lluvia", opts:[{emo:"☀️"},{emo:"🌧️"},{emo:"🌸"},{emo:"⭐"}], c:1},
    {stim:"👂", audio:"Toca el arcoíris de muchos colores", opts:[{emo:"🌙"},{emo:"☀️"},{emo:"🌈"},{emo:"🌧️"}], c:2},
    {stim:"👂", audio:"Toca la flor bonita del jardín", opts:[{emo:"🌸"},{emo:"⭐"},{emo:"🌧️"},{emo:"☀️"}], c:0}
  ],
  cuerpo: [
    {stim:"👂", audio:"Toca los ojitos para ver", opts:[{emo:"👀"},{emo:"👂"},{emo:"👃"},{emo:"👄"}], c:0},
    {stim:"👂", audio:"Toca las orejitas para escuchar", opts:[{emo:"👀"},{emo:"👂"},{emo:"👏"},{emo:"👄"}], c:1},
    {stim:"👂", audio:"Toca las manitas para aplaudir", opts:[{emo:"👃"},{emo:"👀"},{emo:"👏"},{emo:"👂"}], c:2},
    {stim:"👂", audio:"Toca la carita feliz y contenta", opts:[{emo:"😊"},{emo:"😢"},{emo:"😡"},{emo:"😴"}], c:0},
    {stim:"👂", audio:"Toca la carita triste con lagrimita", opts:[{emo:"😊"},{emo:"😢"},{emo:"🥳"},{emo:"😎"}], c:1}
  ],
  musica: [
    {stim:"👂", audio:"Toca el tambor que hace ¡pom pom!", opts:[{emo:"🥁"},{emo:"🎸"},{emo:"🎺"},{emo:"🔔"}], c:0},
    {stim:"👂", audio:"Toca la guitarra con cuerdas", opts:[{emo:"🥁"},{emo:"🎸"},{emo:"🔔"},{emo:"🎺"}], c:1},
    {stim:"👂", audio:"Toca la trompeta que hace ¡tururú!", opts:[{emo:"🔔"},{emo:"🥁"},{emo:"🎺"},{emo:"🎸"}], c:2},
    {stim:"👂", audio:"Toca la campana que hace ¡tán tán!", opts:[{emo:"🔔"},{emo:"🥁"},{emo:"🎸"},{emo:"🎺"}], c:0}
  ]
};

var _kidsCurrentArea = null;
var _kidsQList = [];
var _kidsIndex = 0;
var _kidsScore = 0;

function shuffleArr(arr){
  var a = arr.slice();
  for(var i=a.length-1; i>0; i--){
    var j = Math.floor(Math.random()*(i+1));
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

function openKidsArea(areaId){
  _kidsCurrentArea = areaId;
  var bank = KIDS_BANK[areaId] || KIDS_BANK.colores;
  _kidsQList = shuffleArr(bank).slice(0, 5); // 5 retos por sesión
  _kidsIndex = 0;
  _kidsScore = 0;
  docId("kids34Menu").style.display = "none";
  docId("kids34Play").style.display = "flex";
  renderKidQuestion();
}

function renderKidQuestion(){
  if(_kidsIndex >= _kidsQList.length){
    finishKidsGame();
    return;
  }
  var q = _kidsQList[_kidsIndex];
  // Barra de estrellas
  var starsHtml = "";
  for(var i=0; i<_kidsQList.length; i++){
    starsHtml += '<span style="color:' + (i < _kidsIndex ? '#FFD700' : 'rgba(255,255,255,.25)') + '">★</span>';
  }
  docId("kids34Stars").innerHTML = starsHtml;
  
  // Estímulo visual central
  docId("kids34Stimulus").textContent = q.stim || "👂";
  
  // Generar opciones barajadas preservando la respuesta correcta
  var indexedOpts = q.opts.map(function(opt, idx){ return {opt: opt, isCorrect: idx === q.c}; });
  indexedOpts = shuffleArr(indexedOpts);
  
  var optsHtml = "";
  indexedOpts.forEach(function(item, optIdx){
    if(item.opt.hex){
      optsHtml += '<button class="kids34-opt-btn" onclick="cxChooseKidOpt(' + item.isCorrect + ', this)">' +
                  '<div class="opt-color-circle" style="background:' + item.opt.hex + '"></div>' +
                  '</button>';
    } else {
      var sz = item.opt.size || 3.4;
      optsHtml += '<button class="kids34-opt-btn" onclick="cxChooseKidOpt(' + item.isCorrect + ', this)">' +
                  '<span class="opt-emoji" style="font-size:' + sz + 'rem">' + item.opt.emo + '</span>' +
                  '</button>';
    }
  });
  docId("kids34Opts").innerHTML = optsHtml;
  
  // Hablar automáticamente la instrucción
  setTimeout(function(){
    speakKid(q.audio);
  }, 250);
}

window.cxRepeatKidAudio = function(){
  if(_kidsQList && _kidsQList[_kidsIndex]){
    speakKid(_kidsQList[_kidsIndex].audio);
  }
};

window.cxChooseKidOpt = function(isCorrect, btnEl){
  var allBtns = document.querySelectorAll(".kids34-opt-btn");
  if(isCorrect){
    playKidChime("correct");
    allBtns.forEach(function(b){ b.disabled = true; });
    btnEl.classList.add("opt-correct");
    _kidsScore++;
    setTimeout(function(){
      _kidsIndex++;
      renderKidQuestion();
    }, 900);
  } else {
    playKidChime("retry");
    btnEl.classList.add("opt-wrong");
    btnEl.disabled = true;
    speakKid("¡Casi! Intenta con otro");
    setTimeout(function(){
      btnEl.classList.remove("opt-wrong");
    }, 500);
  }
};

function finishKidsGame(){
  playKidChime("fanfare");
  // Premiar con CogniCoins
  var reward = 25;
  try{
    if(window.cxAddCoins33) window.cxAddCoins33(reward);
    else if(window.addCoins) addCoins(reward);
  }catch(e){}
  
  docId("kids34ModalCoins").textContent = "+" + reward + " CogniCoins";
  docId("kids34Modal").classList.add("active");
}

window.cxCloseKidsCelebration = function(){
  docId("kids34Modal").classList.remove("active");
  docId("kids34Play").style.display = "none";
  docId("kids34Menu").style.display = "flex";
  // Actualizar monedas en pantalla
  var c = 0;
  try{ c = window.cxCoins33 ? window.cxCoins33() : (window.CU ? CU.coins||0 : 0); }catch(e){}
  docId("kids34Coins").textContent = c + " 🪙";
};

window.cxExitKidsPlay = function(){
  try{ if(window.speechSynthesis) window.speechSynthesis.cancel(); }catch(e){}
  docId("kids34Play").style.display = "none";
  docId("kids34Menu").style.display = "flex";
};

window.cxOpenKidsZone = function(){
  var scr = docId("sc-kids34");
  if(scr){
    scr.classList.add("active");
    docId("kids34Menu").style.display = "flex";
    docId("kids34Play").style.display = "none";
    var c = 0;
    try{ c = window.cxCoins33 ? window.cxCoins33() : (window.CU ? CU.coins||0 : 0); }catch(e){}
    docId("kids34Coins").textContent = c + " 🪙";
    speakKid("¡Bienvenido a la Zona Kids! Toca el juego que quieras jugar.");
  }
};

window.cxCloseKidsZone = function(){
  try{ if(window.speechSynthesis) window.speechSynthesis.cancel(); }catch(e){}
  var scr = docId("sc-kids34");
  if(scr) scr.classList.remove("active");
};

/* Enganchar botón de Kids del header y de login para abrir la nueva Zona Kids */
window.showKids = window.cxOpenKidsZone;
window.startPPA = function(area){
  window.cxOpenKidsZone();
  setTimeout(function(){ openKidsArea(area); }, 150);
};

/* Construir DOM de la Zona Kids 34 */
function setupKidsDOM(){
  if(docId("sc-kids34")) return;
  var div = document.createElement("div");
  div.id = "sc-kids34";
  div.className = "kids34-screen";
  
  var cardsHtml = KIDS_CATEGORIES.map(function(cat){
    return '<div class="kids34-card" onclick="cxStartKidsCat(&quot;' + cat.id + '&quot;)">' +
           '<div class="icon-box" style="background:' + cat.bg + '">' + cat.icon + '</div>' +
           '<div class="label">' + cat.name + '</div>' +
           '</div>';
  }).join("");
  
  div.innerHTML = 
    '<div class="kids34-top">' +
      '<button class="kids34-btn-back" onclick="cxCloseKidsZone()">← Volver</button>' +
      '<div class="kids34-coins-pill"><span id="kids34Coins">0 🪙</span></div>' +
    '</div>' +
    '<div id="kids34Menu" style="width:100%;display:flex;flex-direction:column;align-items:center">' +
      '<div class="kids34-hero">' +
        '<h1>🌟 Zona Kids 🌟</h1>' +
        '<p>Maternal y Preescolar · ¡Toca, escucha y diviértete!</p>' +
      '</div>' +
      '<div class="kids34-grid">' + cardsHtml + '</div>' +
    '</div>' +
    '<div id="kids34Play" class="kids34-play" style="display:none">' +
      '<div class="kids34-hud">' +
        '<button class="kids34-btn-back" onclick="cxExitKidsPlay()">← Salir</button>' +
        '<div id="kids34Stars" class="kids34-stars"></div>' +
      '</div>' +
      '<div class="kids34-prompt-box">' +
        '<div id="kids34Stimulus" class="kids34-stimulus">👂</div>' +
        '<button class="kids34-audio-btn" onclick="cxRepeatKidAudio()" aria-label="Repetir audio">🔊</button>' +
      '</div>' +
      '<div id="kids34Opts" class="kids34-options-grid"></div>' +
    '</div>' +
    '<div id="kids34Modal" class="kids34-modal">' +
      '<div class="kids34-modal-content">' +
        '<div style="font-size:4rem">🎉🥳⭐</div>' +
        '<h2 style="color:#FFD700;margin:12px 0 6px">¡Lo hiciste increíble!</h2>' +
        '<p style="color:rgba(255,255,255,.9);font-size:1.05rem;margin:0 0 14px">Completaste todas las actividades</p>' +
        '<div style="background:rgba(255,215,0,.15);border:1.5px solid #FFD700;border-radius:14px;padding:10px;font-size:1.3rem;font-weight:900;color:#FFD700" id="kids34ModalCoins">+25 CogniCoins</div>' +
        '<button class="kids34-modal-btn" onclick="cxCloseKidsCelebration()">¡Seguir jugando! 🚀</button>' +
      '</div>' +
    '</div>';
  
  document.body.appendChild(div);
}

window.cxStartKidsCat = function(catId){
  openKidsArea(catId);
};

/* ============================================================
   2) PSICOANÁLISIS COMPLETO (RESTAURACIÓN TOTAL DE ENCUESTA + EXTRAS)
   ============================================================ */
var PSICO_ESTADOS = [
  "Alegre / Optimista",
  "Tranquilo(a) / En paz",
  "Cansado(a) / Agotado(a)",
  "Estresado(a) / Con presión",
  "Preocupado(a) / Inseguro(a)",
  "Triste / Desmotivado(a)",
  "Enojado(a) / Frustrado(a)",
  "Confundido(a) / Desorientado(a)"
];

var PSICO_SUENO = [
  "Muy bien (duermo profundo y descanso)",
  "Bien (duermo normal)",
  "Regular (me despierto a veces)",
  "Mal (me cuesta mucho dormir)",
  "Insomnio / Pesadillas frecuentes"
];

var PSICO_COLORES = [
  "Azul", "Rojo", "Verde", "Amarillo", "Morado", "Rosa",
  "Naranja", "Negro", "Blanco", "Café", "Gris", "Turquesa"
];

var PSICO_SOCIAL = [
  "Muy bien (muchos amigos, líder o sociable)",
  "Bien (pocos amigos pero de confianza)",
  "Tranquilo (prefiero estar a solas a menudo)",
  "Tímido / Me cuesta iniciar plática",
  "Difícil / He tenido problemas o roces con compañeros"
];

var PSICO_PERSONA_CERCA = [
  "Mamá", "Papá", "Ambos padres", "Hermano(a)",
  "Abuelo(a)", "Tío(a)", "Mejor amigo(a)", "Maestro(a)",
  "Pareja", "Nadie en particular"
];

function optListHtml(arr, selVal){
  return '<option value="">Selecciona una opción...</option>' + arr.map(function(item){
    var isSel = (selVal === item);
    return '<option value="' + esc(item) + '"' + (isSel ? ' selected' : '') + '>' + esc(item) + '</option>';
  }).join("");
}

window.cxRenderFullPsicoForm = function(wrapEl){
  var prof = window._psicoProfile || {};
  try{
    if(!prof.age && window.CU){
      prof = JSON.parse(localStorage.getItem("psico_profile_" + CU.id) || "null") || {};
    }
  }catch(e){}
  
  var h = 
    '<div style="background:linear-gradient(135deg,rgba(139,92,246,.15),rgba(139,92,246,.04));border:1.5px solid rgba(139,92,246,.35);border-radius:18px;padding:22px 18px;margin-bottom:18px;text-align:center">' +
      '<div style="font-size:2.8rem;margin-bottom:6px">🧠</div>' +
      '<div style="font-size:1.15rem;font-weight:900;color:#C4B5FD;margin-bottom:6px">Ficha Psicoemocional y Proyectiva</div>' +
      '<div style="font-size:.8rem;color:var(--text2,rgba(255,255,255,.75));line-height:1.6;max-width:540px;margin:0 auto">' +
        'Esta encuesta exhaustiva alimenta la lectura grafológica y de dibujo infantil/juvenil de Excelsior Academy. Es 100% confidencial y personal.' +
      '</div>' +
    '</div>' +

    /* SECCIÓN 1: DATOS BÁSICOS */
    '<div class="psico34-sec">' +
      '<div class="psico34-sec-title"><span>1</span> Datos Básicos y Dominancia</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
        '<div>' +
          '<label class="psico34-label">¿Cuántos años tienes? *</label>' +
          '<input id="psicoAge" class="inp" type="number" min="4" max="99" placeholder="Ej: 14" value="' + esc(prof.age||"") + '">' +
        '</div>' +
        '<div>' +
          '<label class="psico34-label">Sexo *</label>' +
          '<select id="psicoSex" class="inp">' +
            '<option value="">Selecciona...</option>' +
            '<option value="masculino"' + (prof.sex==="masculino"?" selected":"") + '>Masculino</option>' +
            '<option value="femenino"' + (prof.sex==="femenino"?" selected":"") + '>Femenino</option>' +
            '<option value="prefiero no decir"' + (prof.sex==="prefiero no decir"?" selected":"") + '>Prefiero no decir</option>' +
          '</select>' +
        '</div>' +
      '</div>' +
      '<label class="psico34-label">Grado o nivel escolar</label>' +
      '<input id="psicoGrado" class="inp" placeholder="Ej: 2º de Secundaria, Primaria, Universidad..." value="' + esc(prof.grado||"") + '">' +
      '<label class="psico34-label">¿Con qué mano escribes y dibujas? (Dominancia hemisférica) *</label>' +
      '<select id="psicoMano" class="inp">' +
        '<option value="">Selecciona...</option>' +
        '<option value="derecha"' + (prof.mano==="derecha"||"Derecha"===prof.mano?" selected":"") + '>Mano derecha (Diestro)</option>' +
        '<option value="izquierda"' + (prof.mano==="izquierda"||"Izquierda"===prof.mano?" selected":"") + '>Mano izquierda (Zurdo)</option>' +
        '<option value="ambas"' + (prof.mano==="ambas"||"Ambas"===prof.mano?" selected":"") + '>Uso ambas manos (Ambidiestro)</option>' +
      '</select>' +
      '<label class="psico34-label">¿Con quién vives actualmente?</label>' +
      '<input id="psicoVive" class="inp" placeholder="Ej: Mamá, papá y mi hermana menor" value="' + esc(prof.vive||"") + '">' +
    '</div>' +

    /* SECCIÓN 2: ESTADO EMOCIONAL */
    '<div class="psico34-sec">' +
      '<div class="psico34-sec-title"><span>2</span> Estado Emocional y Bienestar</div>' +
      '<label class="psico34-label">¿Cómo te sientes hoy? *</label>' +
      '<select id="psicoMood" class="inp">' + optListHtml(PSICO_ESTADOS, prof.mood) + '</select>' +
      '<label class="psico34-label">Nivel de estrés autopercibido (1 = Muy tranquilo, 10 = Máximo estrés): <b id="psicoStressVal" style="color:#A78BFA">' + (prof.stress||5) + '</b></label>' +
      '<input id="psicoStress" class="inp" type="range" min="1" max="10" value="' + (prof.stress||5) + '" oninput="document.getElementById(&quot;psicoStressVal&quot;).textContent=this.value" style="padding:4px 0">' +
      '<label class="psico34-label">¿Cómo duermes normalmente?</label>' +
      '<select id="psicoSueno" class="inp">' + optListHtml(PSICO_SUENO, prof.sueno) + '</select>' +
      '<label class="psico34-label">¿Cuál es tu mayor miedo o preocupación actual?</label>' +
      '<input id="psicoMiedo" class="inp" placeholder="Ej: reprobar el examen, fallar a mis papás, equivocarme" value="' + esc(prof.miedo||"") + '">' +
      '<label class="psico34-label">¿Qué es lo que más te motiva o te hace feliz?</label>' +
      '<input id="psicoMotiva" class="inp" placeholder="Ej: mis dibujos, el deporte, pasar tiempo en familia" value="' + esc(prof.motiva||"") + '">' +
    '</div>' +

    /* SECCIÓN 3: PREFERENCIAS PROYECTIVAS */
    '<div class="psico34-sec">' +
      '<div class="psico34-sec-title"><span>3</span> Preferencias Proyectivas</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
        '<div>' +
          '<label class="psico34-label">Color favorito</label>' +
          '<select id="psicoColorFav" class="inp">' + optListHtml(PSICO_COLORES, prof.colorFav) + '</select>' +
        '</div>' +
        '<div>' +
          '<label class="psico34-label">Color que menos te gusta</label>' +
          '<select id="psicoColorNo" class="inp">' + optListHtml(PSICO_COLORES, prof.colorNo) + '</select>' +
        '</div>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
        '<div>' +
          '<label class="psico34-label">Número favorito</label>' +
          '<input id="psicoNum" class="inp" placeholder="Ej: 7" value="' + esc(prof.num||"") + '">' +
        '</div>' +
        '<div>' +
          '<label class="psico34-label">Animal que te representa</label>' +
          '<input id="psicoAnimal" class="inp" placeholder="Ej: Lobo, delfín, águila" value="' + esc(prof.animal||"") + '">' +
        '</div>' +
      '</div>' +
      '<label class="psico34-label">Descríbete a ti mismo(a) en 3 palabras</label>' +
      '<input id="psicoTres" class="inp" placeholder="Ej: Curioso, sensible, dedicado" value="' + esc(prof.tres||"") + '">' +
    '</div>' +

    /* SECCIÓN 4: ENTORNO Y ESCUELA */
    '<div class="psico34-sec">' +
      '<div class="psico34-sec-title"><span>4</span> Entorno Familiar y Escolar</div>' +
      '<label class="psico34-label">Persona más cercana a ti o de mayor confianza</label>' +
      '<select id="psicoCerca" class="inp">' + optListHtml(PSICO_PERSONA_CERCA, prof.cerca) + '</select>' +
      '<label class="psico34-label">¿Cómo te llevas con tus compañeros?</label>' +
      '<select id="psicoSocial" class="inp">' + optListHtml(PSICO_SOCIAL, prof.social) + '</select>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
        '<div>' +
          '<label class="psico34-label">Materia favorita</label>' +
          '<input id="psicoMatFav" class="inp" placeholder="Ej: Matemáticas, Arte" value="' + esc(prof.matFav||"") + '">' +
        '</div>' +
        '<div>' +
          '<label class="psico34-label">Materia más difícil</label>' +
          '<input id="psicoMatDif" class="inp" placeholder="Ej: Historia, Química" value="' + esc(prof.matDif||"") + '">' +
        '</div>' +
      '</div>' +
      '<label class="psico34-label">¿Ha ocurrido un cambio importante recientemente? (mudanza, pérdida, separación...)</label>' +
      '<textarea id="psicoCambio" class="inp" rows="2" placeholder="Opcional: detalles relevantes del contexto">' + esc(prof.cambio||"") + '</textarea>' +
    '</div>' +

    /* SECCIÓN 5: OBSERVACIÓN LIBRE OPCIONAL */
    '<div class="psico34-sec">' +
      '<div class="psico34-sec-title"><span>5</span> Observación Libre (Opcional)</div>' +
      '<label class="psico34-label">¿Deseas agregar algo más para el análisis?</label>' +
      '<textarea id="psicoLibre" class="inp" rows="3" placeholder="Ej: El alumno hizo el trazo tras un día pesado, le cuesta concentrarse en las tardes, dibujó a su familia pero no se dibujó a sí mismo...">' + esc(prof.libre||"") + '</textarea>' +
    '</div>' +

    '<button onclick="cxSaveFullPsico()" style="width:100%;padding:14px;border:none;border-radius:12px;background:linear-gradient(135deg,#7C3AED,#6D28D9);color:#fff;font-weight:900;font-size:1rem;cursor:pointer;box-shadow:0 6px 20px rgba(124,58,237,.35)">💾 Guardar Perfil y Continuar →</button>' +
    '<div style="font-size:.72rem;color:var(--text2,rgba(255,255,255,.6));text-align:center;margin-top:10px">Tus respuestas son estrictamente confidenciales y puedes editarlas cuando quieras.</div>';

  wrapEl.innerHTML = h;
};

window.cxSaveFullPsico = function(){
  var val = function(id){ var el = docId(id); return el ? (el.value||"").trim() : ""; };
  var age = parseInt(val("psicoAge")||"0", 10);
  var sex = val("psicoSex");
  var mano = val("psicoMano");
  var mood = val("psicoMood");
  
  if(!age || age < 4 || age > 99){
    notif("Por favor ingresa una edad válida (entre 4 y 99 años)", "#F59E0B");
    return;
  }
  if(!sex){
    notif("Selecciona tu sexo", "#F59E0B");
    return;
  }
  if(!mano){
    notif("Selecciona con qué mano escribes (dominancia)", "#F59E0B");
    return;
  }
  if(!mood){
    notif("Dinos cómo te sientes el día de hoy", "#F59E0B");
    return;
  }
  
  var profile = {
    age: age,
    sex: sex,
    grado: val("psicoGrado"),
    mano: mano,
    vive: val("psicoVive"),
    mood: mood,
    stress: parseInt(val("psicoStress")||"5", 10),
    sueno: val("psicoSueno"),
    miedo: val("psicoMiedo"),
    motiva: val("psicoMotiva"),
    colorFav: val("psicoColorFav"),
    colorNo: val("psicoColorNo"),
    num: val("psicoNum"),
    animal: val("psicoAnimal"),
    tres: val("psicoTres"),
    cerca: val("psicoCerca"),
    social: val("psicoSocial"),
    matFav: val("psicoMatFav"),
    matDif: val("psicoMatDif"),
    cambio: val("psicoCambio"),
    libre: val("psicoLibre"),
    ts: Date.now()
  };
  
  window._psicoProfile = profile;
  try{ localStorage.setItem("psico_profile_" + uid(), JSON.stringify(profile)); }catch(e){}
  try{ if(window.DB && window.CU) DB.ref("cog_users/" + CU.id + "/psicoProfile").set(profile); }catch(e){}
  
  notif("✅ Encuesta guardada con éxito. Listo para analizar tu dibujo o escritura.", "#10B981");
  var w = docId("psicoWrap");
  if(w && typeof _renderPsicoMain === "function") {
    _renderPsicoMain(w);
  }
};

/* Override de _renderPsicoProfileForm para que siempre use la encuesta completa */
window._renderPsicoProfileForm = window.cxRenderFullPsicoForm;

/* Modificar _renderPsicoMain para incluir tarjeta de resumen y botón de cambiar respuestas */
var _origPsicoMain = window._renderPsicoMain;
window._renderPsicoMain = function(wrapEl){
  if(typeof _origPsicoMain === "function"){
    _origPsicoMain(wrapEl);
  }
  // Inyectar el resumen del perfil al inicio
  var prof = window._psicoProfile || {};
  try{
    if(!prof.age && window.CU){
      prof = JSON.parse(localStorage.getItem("psico_profile_" + uid()) || "null") || {};
    }
  }catch(e){}
  
  if(prof.age && wrapEl && !wrapEl.querySelector(".psico34-summary-card")){
    var card = document.createElement("div");
    card.className = "psico34-summary-card";
    card.style.cssText = "background:linear-gradient(135deg,rgba(124,58,237,.12),rgba(124,58,237,.03));border:1px solid rgba(124,58,237,.35);border-radius:14px;padding:12px 16px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px";
    
    var manoTxt = prof.mano === "izquierda" ? "Zurdo" : (prof.mano === "ambas" ? "Ambidiestro" : "Diestro");
    card.innerHTML = 
      '<div>' +
        '<div style="font-size:.84rem;font-weight:900;color:#C4B5FD">👤 Perfil: ' + prof.age + ' años · ' + esc(prof.sex) + ' · ' + manoTxt + '</div>' +
        '<div style="font-size:.74rem;color:var(--text2,rgba(255,255,255,.7));margin-top:2px">Ánimo: ' + esc(prof.mood||"Normal") + ' · Estrés: ' + (prof.stress||5) + '/10' + (prof.libre ? ' · 📝 Con notas libres' : '') + '</div>' +
      '</div>' +
      '<button onclick="cxEditPsicoProfile()" style="background:rgba(124,58,237,.2);border:1px solid #A78BFA;border-radius:8px;padding:6px 12px;color:#C4B5FD;font-size:.75rem;font-weight:800;cursor:pointer">✏️ Editar Encuesta</button>';
    wrapEl.insertBefore(card, wrapEl.firstChild);
  }
};

window.cxEditPsicoProfile = function(){
  var w = docId("psicoWrap");
  if(w) window.cxRenderFullPsicoForm(w);
};

/* Enriquecer runPsicoAnalysis con todos los 21 datos de la encuesta */
var _origRunPsico = window.runPsicoAnalysis;
window.runPsicoAnalysis = function(){
  var prof = window._psicoProfile || {};
  try{
    if(!prof.age && window.CU){
      prof = JSON.parse(localStorage.getItem("psico_profile_" + uid()) || "null") || {};
    }
  }catch(e){}
  
  var ctxEl = docId("psicoContext");
  if(ctxEl && prof.age){
    var lines = [
      "[FICHA PSICOEMOCIONAL COMPLETA DEL ALUMNO]:",
      "- Edad: " + prof.age + " años, Sexo: " + prof.sex,
      "- Dominancia hemisférica: Escribe/dibuja con " + (prof.mano==="izquierda"?"mano IZQUIERDA (zurdo)":prof.mano==="ambas"?"AMBAS MANOS (ambidiestro)":"mano DERECHA (diestro)")
    ];
    if(prof.grado) lines.push("- Grado escolar: " + prof.grado);
    if(prof.vive) lines.push("- Vive con: " + prof.vive);
    lines.push("- Estado de ánimo hoy: " + prof.mood);
    lines.push("- Estrés autopercibido: " + (prof.stress||5) + "/10");
    if(prof.sueno) lines.push("- Calidad de sueño: " + prof.sueno);
    if(prof.miedo) lines.push("- Mayor miedo/preocupación: " + prof.miedo);
    if(prof.motiva) lines.push("- Mayor motivación: " + prof.motiva);
    if(prof.colorFav) lines.push("- Color preferido: " + prof.colorFav);
    if(prof.colorNo) lines.push("- Color que rechaza: " + prof.colorNo);
    if(prof.animal) lines.push("- Animal proyectivo: " + prof.animal);
    if(prof.tres) lines.push("- Autodefinición en 3 palabras: " + prof.tres);
    if(prof.escuela) lines.push("- Percepción escolar: " + prof.escuela);
    if(prof.amigos) lines.push("- Relación con pares: " + prof.amigos);
    if(prof.cambio) lines.push("- Cambios familiares recientes: " + prof.cambio);
    if(prof.hobby) lines.push("- Intereses/hobbies: " + prof.hobby);
    if(prof.libre) lines.push("- Observación personal libre: " + prof.libre);
    
    var extra = lines.join("\n");
    if(ctxEl.value && ctxEl.value.indexOf("[FICHA PSICOEMOCIONAL") === -1){
      ctxEl.value = extra + "\n\n" + ctxEl.value;
    } else if(!ctxEl.value){
      ctxEl.value = extra;
    }
  }
  if(typeof _origRunPsico === "function"){
    return _origRunPsico.apply(this, arguments);
  }
};

/* ============================================================
   4) VISOR DE CHATS ARCHIVADOS PARA EXCELENCIA
   ============================================================ */
window.cxShowArchivedChats = function(){
  var hist = [];
  try{ hist = JSON.parse(localStorage.getItem("exai_hist_" + uid()) || "[]"); }catch(e){}
  var curChat = [];
  try{ curChat = JSON.parse(localStorage.getItem("exai2_" + uid()) || "[]"); }catch(e){}
  
  var modal = document.createElement("div");
  modal.style.cssText = "position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.8);display:flex;align-items:center;justify-content:center;z-index:99999;padding:16px";
  
  var content = '<div style="background:var(--card,#1e1b2e);border:2px solid var(--border,#3b2d54);border-radius:20px;max-width:540px;width:100%;max-height:85vh;display:flex;flex-direction:column;box-shadow:0 12px 40px rgba(0,0,0,.6);overflow:hidden">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;padding:16px 20px;border-bottom:1px solid rgba(255,255,255,.1)">' +
      '<div style="font-weight:900;font-size:1rem;color:var(--gold,#C9A84C)">📜 Historial de Chats con ExcelencIA</div>' +
      '<button onclick="this.closest(&quot;div&quot;).parentElement.parentElement.remove()" style="background:none;border:none;color:#fff;font-size:1.3rem;cursor:pointer">✕</button>' +
    '</div>' +
    '<div style="padding:16px 20px;overflow-y:auto;flex:1">';
    
  if(!hist.length && !curChat.length){
    content += '<div style="text-align:center;padding:30px 0;color:var(--text2,rgba(255,255,255,.6))">No tienes chats guardados todavía. Cuando converses con ExcelencIA se conservarán aquí.</div>';
  } else {
    if(curChat.length){
      content += '<div style="margin-bottom:14px;background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.3);border-radius:12px;padding:12px">' +
        '<div style="font-size:.78rem;font-weight:800;color:var(--gold,#C9A84C);margin-bottom:6px">💬 Conversación activa (' + curChat.length + ' mensajes)</div>' +
        '<div style="font-size:.75rem;color:var(--text2,rgba(255,255,255,.8));line-height:1.4">' + esc(curChat[curChat.length-1].text || curChat[curChat.length-1].m || "Conversación en curso").substring(0, 120) + '...</div>' +
        '</div>';
    }
    if(hist.length){
      content += '<div style="font-size:.8rem;font-weight:800;color:#A78BFA;margin:12px 0 8px">Chats anteriores archivados:</div>';
      hist.slice().reverse().forEach(function(item, idx){
        var d = item.ts ? new Date(item.ts).toLocaleDateString("es-MX", {day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}) : "Fecha anterior";
        content += '<div style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:10px 12px;margin-bottom:8px">' +
          '<div style="font-size:.72rem;color:var(--text2,rgba(255,255,255,.5));margin-bottom:4px">🕒 ' + d + '</div>' +
          '<div style="font-size:.76rem;color:#fff;line-height:1.4">' + esc(item.q || item.preview || "Consulta escolar").substring(0, 160) + '</div>' +
          '</div>';
      });
    }
  }
  content += '</div>' +
    '<div style="padding:12px 20px;border-top:1px solid rgba(255,255,255,.1);text-align:right">' +
      '<button onclick="this.parentElement.parentElement.parentElement.remove()" style="background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:#fff;border-radius:8px;padding:8px 16px;cursor:pointer;font-weight:700">Cerrar</button>' +
    '</div></div>';
    
  modal.innerHTML = content;
  document.body.appendChild(modal);
};

/* Inyectar botón de historial en la barra de chat de ExcelencIA */
function setupExaiHistoryBtn(){
  var bar = document.querySelector(".v32-chatbar");
  if(bar && !bar.querySelector(".v34-histbtn")){
    var btn = document.createElement("button");
    btn.className = "v32-newchat v34-histbtn";
    btn.innerHTML = "📜 Historial";
    btn.onclick = window.cxShowArchivedChats;
    bar.appendChild(btn);
  }
}

/* ============================================================
   5) INICIALIZACIÓN
   ============================================================ */
/* Aviso de almacenamiento del dispositivo (faltaba y rompia el arranque) */
function checkDeviceStorage(){
  try{
    var bytes=0;
    for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);bytes+=(k||"").length+((localStorage.getItem(k)||"").length);}
    window.cxStorageKB=Math.round(bytes/1024);
    if(bytes>4300000){
      ["cxExaiHist","cxExaiCache","cxMsgCache","cx24lead"].forEach(function(k){try{localStorage.removeItem(k);}catch(e){}});
      if(typeof notify==="function")notify("⚠️ El almacenamiento de este dispositivo está casi lleno. Limpiamos el historial de chats para que CognitExAc siga guardando tu avance.","#F59E0B");
    }
  }catch(e){}
  return true;
}
function initV34(){
  try{ setupKidsDOM(); }catch(e){ console.warn("setupKidsDOM:",e); }
  try{ checkDeviceStorage(); }catch(e){ console.warn("checkDeviceStorage:",e); }
  try{ setTimeout(setupExaiHistoryBtn,1200); }catch(e){}
}

if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", initV34);
} else {
  initV34();
}

})();

