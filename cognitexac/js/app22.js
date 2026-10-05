
/* CognitExAc v33 · Calendario mexicano + temas de temporada · Frases 100% mexicanas (15/15/15 por personaje) · Tienda unificada y ampliada */
(function(){
"use strict";
function $(i){return document.getElementById(i);}
function uid(){return (window.CU&&CU.id)||"";}
function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
function notif(m,c){try{window.notify?notify(m,c||"#10B981"):console.log(m);}catch(e){}}
function getCoins33(){if(!window.CU)return 0;var a=parseInt(localStorage.getItem("coins_"+uid())||"0",10)||0;var b=(window.USERS&&USERS[uid()]&&parseInt(USERS[uid()].coins||0,10))||0;var m=Math.max(a,b);if(a!==m)localStorage.setItem("coins_"+uid(),m);return m;}
function addCoins33(n){if(!window.CU)return;var v=Math.max(0,getCoins33()+n);localStorage.setItem("coins_"+uid(),v);try{if(window.USERS&&USERS[uid()]){USERS[uid()].coins=v;window.saveUsers&&saveUsers(USERS,uid());}}catch(e){}}
window.cxCoins33=getCoins33;window.cxAddCoins33=addCoins33;

/* ============================================================
   1) CALENDARIO MEXICANO · TEMPORADAS Y CELEBRACIONES
   ============================================================ */
function D(y,m,d){return new Date(y,m-1,d,0,0,0,0);}
function semanaLV(y,m,d){
  var base=D(y,m,d),dow=base.getDay();
  var diffLun=(dow===0?-6:1-dow);
  var lun=new Date(base.getTime()+diffLun*864e5);
  var vie=new Date(lun.getTime()+4*864e5+86399000);
  return [lun,vie];
}
function tercerDomingo(y,m){var f=D(y,m,1),dow=f.getDay(),prim=1+((7-dow)%7);return D(y,m,prim+14);}

var FIESTAS=[
 {id:"reyes",nom:"Año Nuevo y Día de Reyes",emo:"👑",lema:"Los Reyes Magos llegaron a CognitExAc con regalos para tu mente.",
  col:{p:"#7C3AED",s:"#F59E0B",bg:"#140C2B"},deco:["👑","⭐","🐫","🎁","🌟"],
  tema:function(y){return semanaLV(y,1,6);},tienda:function(y){return [D(y,1,1),D(y,1,10)];}},
 {id:"bandera",nom:"Día de la Bandera",emo:"🇲🇽",lema:"Verde, blanco y rojo: orgullo que también se entrena.",
  col:{p:"#0E7C3A",s:"#C8102E",bg:"#07170F"},deco:["🇲🇽","🦅","🏵️","🎖️"],
  tema:function(y){return semanaLV(y,2,24);},tienda:function(y){return [D(y,2,18),D(y,2,28)];}},
 {id:"primavera",nom:"Inicio de la Primavera",emo:"🌸",lema:"Todo florece, también tus ideas.",
  col:{p:"#EC4899",s:"#22C55E",bg:"#16121B"},deco:["🌸","🌷","🦋","🌿","🐝"],
  tema:function(y){return semanaLV(y,3,21);},tienda:function(y){return [D(y,3,15),D(y,3,31)];}},
 {id:"aniversario",nom:"Aniversario de CognitExAc",emo:"🎉",lema:"14 de abril · El día en que Excelsior Academy encendió CognitExAc.",
  col:{p:"#C9A84C",s:"#7C3AED",bg:"#12101C"},deco:["🎉","🎂","🏆","✨","🎊","🥳"],gran:true,
  tema:function(y){return [D(y,4,8),new Date(D(y,4,20).getTime()+86399000)];},tienda:function(y){return [D(y,4,1),D(y,4,30)];},
  regalo:{coins:500,todos:true,msg:"🎂 ¡Feliz aniversario CognitExAc! Recibiste 500 CogniCoins de regalo."}},
 {id:"nino",nom:"Día del Niño",emo:"🧸",lema:"Hoy juegas tú: el cerebro más curioso del mundo.",
  col:{p:"#38BDF8",s:"#FACC15",bg:"#0B1725"},deco:["🧸","🎈","🍭","🪀","🎠"],
  tema:function(y){return semanaLV(y,4,30);},tienda:function(y){return [D(y,4,20),D(y,5,5)];},
  regalo:{coins:300,maxGrado:6,msg:"🎈 ¡Feliz Día del Niño! Te regalamos 300 CogniCoins."}},
 {id:"madres",nom:"Día de las Madres",emo:"💐",lema:"Detrás de cada mente brillante hay una mamá que creyó primero.",
  col:{p:"#F472B6",s:"#C9A84C",bg:"#1A1016"},deco:["💐","🌹","💖","🎀"],
  tema:function(y){return semanaLV(y,5,10);},tienda:function(y){return [D(y,5,5),D(y,5,15)];}},
 {id:"estudiante",nom:"Día del Estudiante",emo:"🎓",lema:"23 de mayo: va por ti, que le sigues dando al estudio.",
  col:{p:"#6366F1",s:"#22D3EE",bg:"#0C1024"},deco:["🎓","📚","✏️","🧠","🏅"],
  tema:function(y){return semanaLV(y,5,23);},tienda:function(y){return [D(y,5,18),D(y,5,30)];},
  regalo:{coins:300,minGrado:7,msg:"🎓 ¡Feliz Día del Estudiante! Te regalamos 300 CogniCoins."}},
 {id:"padres",nom:"Día del Padre",emo:"👔",lema:"Para el que enseña con el ejemplo (y con chistes malos).",
  col:{p:"#0EA5E9",s:"#94A3B8",bg:"#0A1420"},deco:["👔","🛠️","⚽","🎣"],
  tema:function(y){var t=tercerDomingo(y,6);return semanaLV(y,6,t.getDate());},tienda:function(y){return [D(y,6,10),D(y,6,25)];}},
 {id:"independencia",nom:"Mes de la Patria · Independencia de México",emo:"🇲🇽",lema:"¡Viva México! Del 1 al 16 de septiembre CognitExAc se viste de fiesta.",
  col:{p:"#0E7C3A",s:"#C8102E",bg:"#07170F"},deco:["🇲🇽","🌶️","🎺","🪅","🫓","🦅"],
  tema:function(y){return [D(y,9,1),new Date(D(y,9,16).getTime()+86399000)];},tienda:function(y){return [D(y,9,1),D(y,9,20)];}},
 {id:"sismos",nom:"Memoria y Prevención · 19 de septiembre",emo:"🕯️",lema:"Recordamos 1985 y 2017. Prepararse también es cuidar a los tuyos.",
  col:{p:"#94A3B8",s:"#F59E0B",bg:"#0B0F16"},deco:["🕯️","🧯","🎒","📻"],sobrio:true,
  tema:function(y){return [D(y,9,17),new Date(D(y,9,20).getTime()+86399000)];},tienda:function(y){return [D(y,9,17),D(y,9,21)];},
  tips:["Antes: ten a la mano una mochila de emergencia con agua, linterna, radio, copias de documentos y botiquín.",
        "Antes: acuerda con tu familia un punto de reunión y un contacto fuera de la ciudad.",
        "Durante: agáchate, cúbrete la cabeza y sujétate. Aléjate de ventanas, espejos y muebles altos.",
        "Durante: si estás en la escuela, sigue al maestro y ve al punto de reunión sin correr, sin gritar y sin empujar.",
        "Durante: si vas en la calle, aléjate de postes, cables, bardas y anuncios.",
        "Después: no uses elevadores, revisa que no haya fugas de gas y no enciendas cerillos.",
        "Después: usa mensajes de texto en vez de llamadas para no saturar la red.",
        "Siempre: revisa que las rutas de evacuación de tu casa y de tu escuela estén libres."]},
 {id:"muertos",nom:"Día de Muertos",emo:"💀",lema:"Ponemos ofrenda: pan, cempasúchil y mucha memoria.",
  col:{p:"#F97316",s:"#A855F7",bg:"#160E1C"},deco:["💀","🌼","🕯️","🍞","🎭","🦋"],
  tema:function(y){return semanaLV(y,11,2);},tienda:function(y){return [D(y,11,1),D(y,11,30)];}},
 {id:"navidad",nom:"Nochebuena y Navidad",emo:"🎄",lema:"Posadas, ponche y neuronas encendidas.",
  col:{p:"#16A34A",s:"#DC2626",bg:"#0A1510"},deco:["🎄","🎅","⛄","🔔","🕯️","🍬"],
  tema:function(y){return semanaLV(y,12,24);},tienda:function(y){return [D(y,12,1),D(y,12,31)];}},
 {id:"anonuevo",nom:"Año Nuevo",emo:"🎆",lema:"Nuevo año, nuevas metas y un LPI que sube.",
  col:{p:"#FACC15",s:"#38BDF8",bg:"#0C1020"},deco:["🎆","🥂","🎇","🕛"],
  tema:function(y){return [D(y,12,29),new Date(D(y,12,31).getTime()+86399000)];},tienda:function(y){return [D(y,12,26),D(y,12,31)];}},
 {id:"sanvalentin",nom:"Día del Amor y la Amistad",emo:"💌",lema:"Un cerebro amable también es un cerebro brillante.",
  col:{p:"#E11D48",s:"#F9A8D4",bg:"#1A0B12"},deco:["💌","💖","🌹","🤝","💝"],
  tema:function(y){return semanaLV(y,2,14);},tienda:function(y){return [D(y,2,7),D(y,2,16)];}},
 {id:"maestro",nom:"Día del Maestro",emo:"🍎",lema:"Gracias a quien enciende las ideas cada mañana.",
  col:{p:"#16A34A",s:"#C9A84C",bg:"#0B1510"},deco:["🍎","📚","✏️","🎓","🌻"],
  tema:function(y){return semanaLV(y,5,15);},tienda:function(y){return [D(y,5,11),D(y,5,19)];}},
 {id:"halloween",nom:"Halloween",emo:"🎃",lema:"Truco o reto: ¿qué tan rápido piensa tu mente?",
  col:{p:"#F97316",s:"#7C3AED",bg:"#120A16"},deco:["🎃","🦇","🕸️","👻","🍬"],
  tema:function(y){return [D(y,10,27),new Date(D(y,10,31).getTime()+86399000)];},tienda:function(y){return [D(y,10,20),D(y,10,31)];}},
 {id:"revolucion",nom:"Revolución Mexicana",emo:"🐎",lema:"20 de noviembre: la valentía también se entrena.",
  col:{p:"#B45309",s:"#15803D",bg:"#160F08"},deco:["🐎","🎖️","🇲🇽","📜","🌵"],
  tema:function(y){return semanaLV(y,11,20);},tienda:function(y){return [D(y,11,14),D(y,11,23)];}}
];
window.CX_FIESTAS=FIESTAS;

function enRango(now,r){return r&&now>=r[0].getTime()&&now<=r[1].getTime();}
function fiestaActiva(ts){
  var now=ts||Date.now(),y=new Date(now).getFullYear(),act=null;
  FIESTAS.forEach(function(f){var r=f.tema(y);if(!act&&enRango(now,[r[0],r[1]]))act=f;});
  return act;
}
function tiendaActiva(ts){
  var now=ts||Date.now(),y=new Date(now).getFullYear(),out=[];
  FIESTAS.forEach(function(f){var r=f.tienda(y);if(enRango(now,[r[0],new Date(r[1].getTime()+86399000)]))out.push(f.id);});
  return out;
}
window.cxFiestaHoy=fiestaActiva;
window.cxTiendaTemporada=tiendaActiva;

function aplicarTema(f){
  var st=$("cxFestStyle");
  if(!st){st=document.createElement("style");st.id="cxFestStyle";document.head.appendChild(st);}
  if(!f){st.textContent="";document.body.removeAttribute("data-fiesta");return;}
  document.body.setAttribute("data-fiesta",f.id);
  st.textContent=":root{--gold:"+f.col.p+";--gold-d:"+f.col.s+";}"+
    "body[data-fiesta]{background-image:radial-gradient(circle at 12% 0%,"+f.col.p+"1f,transparent 42%),radial-gradient(circle at 88% 8%,"+f.col.s+"1c,transparent 46%);}"+
    ".cx-fest-card{position:relative;overflow:hidden;border:1.5px solid "+f.col.p+"66;border-radius:16px;padding:14px 16px;margin:10px 0 14px;background:linear-gradient(135deg,"+f.col.p+"22,"+f.col.s+"10);}"+
    ".cx-fest-card h3{margin:0;font-size:1rem;font-weight:900;color:"+f.col.p+"}"+
    ".cx-fest-card p{margin:5px 0 0;font-size:.78rem;color:var(--text2);line-height:1.45}"+
    ".cx-fest-deco{font-size:1.15rem;letter-spacing:4px;margin-top:8px;opacity:.95}"+
    ".cx-fest-tips{margin-top:10px;display:grid;gap:6px}"+
    ".cx-fest-tip{font-size:.72rem;color:var(--text);background:rgba(255,255,255,.05);border-left:3px solid "+f.col.s+";border-radius:8px;padding:7px 9px;line-height:1.4}"+
    (f.gran?".cx-fest-card{animation:cxFestGlow 2.6s ease-in-out infinite}@keyframes cxFestGlow{0%,100%{box-shadow:0 0 0 0 "+f.col.p+"44}50%{box-shadow:0 0 26px 4px "+f.col.p+"33}}":"");
}

function bannerFiesta(){
  var f=fiestaActiva();
  aplicarTema(f);
  var host=document.querySelector("#sc-dash .sec-inner")||document.getElementById("sc-dash");
  if(!host)return;
  var old=$("cxFestBanner");
  if(!f){if(old)old.remove();return;}
  var html='<h3>'+f.emo+" "+esc(f.nom)+"</h3><p>"+esc(f.lema)+"</p>"+
    '<div class="cx-fest-deco">'+f.deco.join(" ")+"</div>";
  if(f.tips&&f.tips.length){
    html+='<div class="cx-fest-tips">'+f.tips.slice(0,4).map(function(t){return '<div class="cx-fest-tip">🛟 '+esc(t)+"</div>";}).join("")+
      '</div><button id="cxFestMasTips" style="margin-top:8px;width:100%;padding:8px;border:none;border-radius:9px;background:'+f.col.s+';color:#12161F;font-weight:800;font-size:.74rem;cursor:pointer;font-family:inherit">Ver todos los consejos ante un sismo</button>';
  }else{
    html+='<div style="margin-top:9px;font-size:.72rem;color:var(--text2)">🛍️ Objetos, mascotas y personajes exclusivos de esta temporada ya están en la Tienda.</div>';
  }
  if(f.gran){
    html+='<div style="margin-top:10px;display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:7px">'+
      ["🎁 Regalo de aniversario","🏆 Retos dobles de LPI","🎭 Personajes de gala","🎊 Tienda conmemorativa"].map(function(t){
        return '<div style="font-size:.68rem;font-weight:800;text-align:center;padding:8px 6px;border-radius:10px;background:rgba(255,255,255,.06);color:var(--text)">'+t+"</div>";}).join("")+"</div>";
  }
  if(!old){old=document.createElement("div");old.id="cxFestBanner";old.className="cx-fest-card";host.insertBefore(old,host.firstChild);}
  old.className="cx-fest-card";
  old.innerHTML=html;
  var b=$("cxFestMasTips");
  if(b)b.onclick=function(){
    var m=document.createElement("div");
    m.style.cssText="position:fixed;inset:0;z-index:9999;background:rgba(3,6,12,.86);display:flex;align-items:center;justify-content:center;padding:18px";
    m.innerHTML='<div style="max-width:440px;max-height:80vh;overflow:auto;background:var(--card);border:1.5px solid '+f.col.s+';border-radius:16px;padding:18px"><div style="font-weight:900;color:'+f.col.s+';margin-bottom:8px">🕯️ Qué hacer antes, durante y después de un sismo</div>'+
      f.tips.map(function(t){return '<div style="font-size:.76rem;color:var(--text);margin-bottom:7px;line-height:1.45">• '+esc(t)+"</div>";}).join("")+
      '<div style="font-size:.68rem;color:var(--text2);margin-top:6px">En caso de emergencia en México: 911 · Protección Civil local.</div>'+
      '<button style="margin-top:12px;width:100%;padding:10px;border:none;border-radius:10px;background:'+f.col.s+';color:#12161F;font-weight:800;cursor:pointer;font-family:inherit">Cerrar</button></div>';
    m.onclick=function(){m.remove();};
    document.body.appendChild(m);
  };
  regalosFiesta(f);
}

function regalosFiesta(f){
  if(!f||!f.regalo||!window.CU)return;
  var y=new Date().getFullYear(),k="cx_gift_"+f.id+"_"+y+"_"+uid();
  if(localStorage.getItem(k))return;
  var g=f.regalo,gl=(window.getGradeLevel?getGradeLevel(CU.level):4);
  if(!g.todos){
    if(g.maxGrado!=null&&gl>g.maxGrado)return;
    if(g.minGrado!=null&&gl<g.minGrado)return;
  }
  localStorage.setItem(k,"1");
  addCoins33(g.coins);
  setTimeout(function(){notif(g.msg,"#F59E0B");},1200);
}

setTimeout(bannerFiesta,800);
setInterval(bannerFiesta,60000);
window.cxRefreshFiesta=bannerFiesta;
})();



/* ============================================================
   2) FRASES 100% MEXICANAS · 15 consejos + 15 ánimos + 15 chistes por personaje
   ============================================================ */
var FR={
 excelencia:{
  consejo:[
   "Empieza por lo más pesado mientras traes pila. Lo fácil siempre alcanza para el final.",
   "Al cerrar el cuaderno, di en voz alta lo que recuerdas. Ahí es donde de veras se queda.",
   "Un tema diario le gana a diez temas la noche anterior al examen.",
   "Apunta la tarea el mismo día que te la dejan, no cuando ya te anda.",
   "Estudia 25 minutos y descansa 5. Tu cabeza rinde más a ratos que de un jalón.",
   "Si no le entendiste al maestro, pregunta en ese momento. La pena dura un minuto.",
   "Haz un repaso el domingo en la noche: llegas el lunes con ventaja.",
   "Prepara tus cosas desde la noche anterior y te ahorras la carrera de la mañana.",
   "Ponle fecha a tus metas. Lo que no tiene fecha se queda de pendiente eterno.",
   "Explícale el tema a alguien de tu casa. Si te entienden, ya lo dominas.",
   "Cuando acabes un trabajo, revísalo una vez más antes de entregar. Siempre sale algo.",
   "Duerme bien antes del examen: desvelarse te quita más de lo que te da.",
   "Escribe tus tres pendientes del día en un papel y táchalos. Se siente bien bonito.",
   "No estudies con la tele puesta. Tu cerebro no es de dos pantallas.",
   "Guarda tus apuntes por materia. Buscar hoja suelta es perder media hora."
  ],
  animo:[
   "Todavía no te sale… y ese 'todavía' es la palabra más importante de la frase.",
   "Nadie llega sabiendo. Se llega practicando, y tú ya andas en eso.",
   "El que pregunta pasa pena un minuto; el que no pregunta, todo el curso.",
   "Ayer no sabías esto y hoy ya lo estás intentando. Eso ya es avance.",
   "Échale ganas tantito más, que ya mero le agarras la onda.",
   "Tu esfuerzo de hoy se nota en tu calificación de la próxima semana.",
   "Equivocarte no te quita puntos como persona. Solo te da información.",
   "Vas más adelantado de lo que crees. Voltea a ver dónde empezaste.",
   "Aunque hoy te salga poquito, poquito diario se vuelve mucho.",
   "Aquí nadie te compara con nadie. Tu único rival es el tú de ayer.",
   "Si te cansaste, descansa; no te rindas. No es lo mismo.",
   "El que insiste, avanza. Y tú aquí sigues.",
   "No necesitas ser el más rápido, necesitas ser el que no se detiene.",
   "Un día flojo no borra una semana buena. Mañana le seguimos.",
   "Me caes bien porque le sigues intentando. Eso vale oro."
  ],
  chiste:[
   "¿Cómo se llama el mejor alumno del salón? El que le pregunta al maestro y no al chat.",
   "Mi maestra dijo que el examen sería pan comido. Y sí: me comí los nervios completos.",
   "Estudié tanto anoche que hoy hasta el perro me dictó la respuesta.",
   "Mi mamá dice que en la escuela se aprende todo… menos a acabar la tarea temprano.",
   "Llegué puntual a la escuela y hasta el timbre se sorprendió.",
   "Traje la tarea perfecta, pero la dejé en la casa perfecta.",
   "Mi lonchera pesa más que mi mochila y aun así me quejo de la escuela.",
   "El director dijo 'silencio absoluto' y hasta mi estómago le hizo caso… tantito.",
   "Mi promedio y yo tenemos una relación: nos vemos cada bimestre y nos decepcionamos.",
   "Me dijeron que estudiara con calma, y la calma se durmió primero.",
   "Fui el único que levantó la mano y también el único que se arrepintió.",
   "Mi cuaderno tiene margen, título, fecha… y ninguna respuesta.",
   "El honor a la bandera dura poquito, pero el sol del patio dura toda la semana.",
   "Le dije a mi papá que necesitaba una computadora para estudiar y me compró una libreta 'con teclado imaginario'.",
   "El recreo es la única materia en la que todos sacamos diez."
  ]},
 coco:{
  consejo:[
   "Para acordarte de algo, invéntale una imagen bien ridícula. Entre más ridícula, mejor se pega.",
   "Ponle apodo a lo que quieras recordar; al cerebro le encantan los apodos.",
   "Repasa a los 10 minutos, al día siguiente y a la semana. Así se queda de veras.",
   "Agrupa los números de tres en tres, como los teléfonos. La memoria trabaja por bloquecitos.",
   "Si no lo puedes contar sin ver el cuaderno, todavía no lo aprendiste.",
   "Estudia en un lugar y repasa en otro. El cambio ayuda a fijar.",
   "Haz tarjetitas: pregunta de un lado, respuesta del otro. Funciona bien bonito.",
   "Relaciona lo nuevo con algo que ya sepas. La memoria se agarra de lo conocido.",
   "Cuenta en voz alta lo que estudiaste, como si fueras el maestro.",
   "Escribe a mano lo importante. Teclear se olvida más rápido.",
   "Repasa antes de dormir; mientras duermes tu cerebro lo acomoda.",
   "Divide las listas largas en grupos de cinco. Enteras no entran.",
   "Usa la primera letra de cada palabra para armar una clave chistosa.",
   "Si se te olvidó, no te enojes: vuelve a verlo. Olvidar es parte de aprender.",
   "Camina mientras repasas. El movimiento ayuda a que se grabe."
  ],
  animo:[
   "Tu memoria sí sirve, nada más está esperando que la uses seguido.",
   "Lo que hoy se te olvida, mañana se te queda. Es cuestión de vueltas.",
   "Recordaste cosas sin darte cuenta. Eso ya es progreso.",
   "Un dato al día son 365 al año. Ahí la llevas.",
   "No tienes mala memoria, tienes memoria sin entrenar.",
   "Acordarte cuesta trabajo porque vale la pena.",
   "Cada repaso deja huella aunque no la sientas.",
   "Tu cabeza guarda más de lo que crees; hay que saber pedírselo.",
   "Hoy te acordaste de más cosas que ayer. Eso cuenta.",
   "Si te salió a la segunda, igual te salió.",
   "El olvido no es fracaso, es aviso de que toca repasar.",
   "Tu cerebro te está haciendo caso, dale chance.",
   "Poquito a poquito se llena el jarrito.",
   "Ya reconoces lo que antes ni te sonaba. Eso es avanzar.",
   "Sigue así y en un mes vas a presumir memoria."
  ],
  chiste:[
   "Apunté todo para no olvidarlo y ahora no sé dónde dejé el apunte.",
   "Mi mamá me pidió tres cosas del mandado y traje agua… y muchas ganas de disculparme.",
   "Tengo memoria de elefante: pesada, lenta y con hambre.",
   "Me acordé de la contraseña justo cuando ya la había cambiado.",
   "Entré a la cocina con un propósito y salí con un vaso de agua que no quería.",
   "Recuerdo perfecto la canción de los comerciales, pero no la fórmula del examen.",
   "Mi abuelita se acuerda de lo que hice en 2014 y yo no me acuerdo si ya comí.",
   "Fui por las llaves y regresé por las llaves… con las llaves en la mano.",
   "Me sé el cumpleaños de toda la familia, menos el mío cuando me lo preguntan de sorpresa.",
   "Dejé un recordatorio tan importante que hasta lo ignoré dos veces.",
   "Mi memoria es como la tiendita de la esquina: a veces hay, a veces no.",
   "Saludé a alguien que me saludó y todavía no sé quién era.",
   "Puse la alarma para estudiar y la apagué dormido, con talento.",
   "Guardé algo en un lugar seguro. Tan seguro que ni yo entro.",
   "Cuando por fin me acuerdo del dato, ya entregué el examen."
  ]},
 laProfe:{
  consejo:[
   "Antes de escribir, di la idea en voz alta. Lo que se dice claro, se escribe claro.",
   "Lee el texto dos veces: la primera para entender, la segunda para subrayar.",
   "Ponle tu propio título a cada párrafo. Así compruebas si entendiste.",
   "Escribe primero sin miedo y corrige después. Corregir es la mitad del trabajo.",
   "Palabra nueva que encuentres, palabra nueva que anotas en tu libreta.",
   "Léelo en voz alta: si no se entiende al oírlo, tampoco al leerlo.",
   "Usa punto y aparte. Un párrafo de diez renglones cansa a cualquiera.",
   "Revisa acentos y comas al final; ahí se ganan puntos regalados.",
   "Lee 15 minutos diarios de lo que te guste. Sí cuenta.",
   "Si escribes un resumen, que no sea copiar; que sea decirlo con tus palabras.",
   "Antes de entregar, pregúntate: ¿se entiende sin que yo lo explique?",
   "Cambia 'cosa' por la palabra exacta. Tu texto sube de nivel al instante.",
   "Cuando leas, imagina la escena. Lo que se imagina no se olvida.",
   "Haz una lista de las palabras que se te dificultan y practica una por semana.",
   "Escribe la conclusión al final, no al principio. Ahí ya sabes qué querías decir."
  ],
  animo:[
   "Tu letra, tus ideas y tu voz importan. Escríbelas.",
   "Un párrafo bien hecho ya es un logro del día.",
   "Leer despacio no es ir lento, es ir entendiendo.",
   "Escribir feo al primer intento es normal; nadie escribe bien de una.",
   "Tu vocabulario crece cada vez que preguntas qué significa algo.",
   "Cada libro que abres te deja algo, aunque no lo termines hoy.",
   "Te expresas mejor que hace un mes. Se nota.",
   "No hay pregunta tonta, hay curiosidad bien puesta.",
   "Si te costó leerlo, tu cerebro trabajó. Bien hecho.",
   "Escribir lo que sientes también es aprender.",
   "Sigue leyendo, que ahí se te van pegando las palabras.",
   "Tu forma de contar las cosas está mejorando bonito.",
   "Los errores de ortografía se corrigen; las ganas no se compran.",
   "Hoy leíste más que ayer. Eso es un triunfo.",
   "Vas muy bien, de verdad. Dale otra hojita."
  ],
  chiste:[
   "Le puse acento a mi tarea y ahora habla con tonito.",
   "El punto y coma me cae bien: nunca se decide, como yo en el recreo.",
   "Escribí 'aser' en mi tarea y mi maestra dibujó su carita triste.",
   "Le dije a mi cuaderno que se explicara solo y se quedó callado.",
   "Usé tantas comas que mi texto tuvo que descansar a medio renglón.",
   "Mi tarea tenía introducción, desarrollo y prisa.",
   "Le pregunté al diccionario por una palabra y me mandó a otras tres. Bien grosero.",
   "Escribí 'haber si paso' y sí, así pasé: rasposito.",
   "Mi resumen quedó más largo que el libro. Talento puro.",
   "Puse 'etcétera' cinco veces para que pareciera que sabía más.",
   "El corrector del celular escribe mejor español que yo y eso me duele.",
   "Mi caligrafía es tan artística que ni yo la leo.",
   "Me dijeron que redactara con claridad y escribí con lápiz muy clarito.",
   "Empecé mi ensayo con 'desde tiempos inmemoriales' y ya no supe cómo bajarme de ahí.",
   "Dicen que leer te hace soñar; yo leo y me duermo, así que voy cumpliendo."
  ]},
 chispa:{
  consejo:[
   "Antes de sacar la cuenta, adivina el resultado. Si te queda muy lejos, revisa.",
   "Haz las operaciones en renglones, una debajo de otra: la mitad de los errores son de acomodo.",
   "Practica tres problemas bien hechos, no veinte a la carrera.",
   "Las tablas se aprenden con ritmo, como cancioncita. Pruébalo.",
   "Divide el problema grande en pasitos. Nadie resuelve todo de un salto.",
   "Subraya los datos del problema antes de empezar a operar.",
   "Si te sale un número rarísimo, revisa el punto decimal antes que nada.",
   "Aprende primero el porqué y luego la fórmula. Así no se te olvida.",
   "Comprueba tu resultado al revés: la suma con resta, la multiplicación con división.",
   "Para los porcentajes, saca primero el 10% y de ahí te vas.",
   "Escribe siempre las unidades: pesos, metros, litros. Evitan puros errores.",
   "Si te trabas, dibuja el problema. Los dibujos resuelven mates.",
   "Repasa tablas 5 minutos diarios, no una hora el domingo.",
   "Usa la calculadora para comprobar, no para empezar.",
   "Primero que salga bien; la velocidad llega sola después."
  ],
  animo:[
   "No eres malo para las mates, apenas vas a media práctica.",
   "Equivocarte en una cuenta es información, no fracaso.",
   "Cada problema resuelto es una conexión nueva en tu cabeza.",
   "Ya resolviste cosas que hace un mes ni intentabas.",
   "Las mates se le dan al que insiste, y tú insistes.",
   "Un error de dedo no borra que sí sabías el procedimiento.",
   "Vas agarrando velocidad sin que te des cuenta.",
   "Si te salió el primer paso, el resto es cuestión de calma.",
   "El que practica tablas hoy, presume mañana.",
   "Tranquilo, respira y vuelve a leer el problema. Tú puedes.",
   "Hasta los mejores borran y vuelven a empezar.",
   "Esa cuenta difícil ya se te hizo más fácil que la semana pasada.",
   "Dale otra vez, que ya casi te sale.",
   "Sacar mal un ejercicio es parte del entrenamiento, no el final.",
   "Ánimo, campeón: los números se te están rindiendo."
  ],
  chiste:[
   "Le pedí ayuda a la calculadora y me dijo: tú también divide responsabilidades.",
   "Mi cuaderno de mates tiene más tachones que examen de manejo.",
   "Saqué la cuenta de cuánto me falta estudiar y me dio flojera exponencial.",
   "Le debía 20 pesos a mi amigo y le pagué con un problema de mates: quedamos a mano y confundidos.",
   "En el mercado saco la cuenta rapidísimo; en el examen se me traba el cerebro.",
   "Mi maestro dijo 'esto es sencillo' y el pizarrón se llenó solito de letras.",
   "Mi promedio es como el peso: sube poquito y baja rapidísimo.",
   "Usé regla de tres para ver si me alcanzaba para la torta. No me alcanzó.",
   "Me sé la tabla del uno y la del diez. Las del medio andan de vacaciones.",
   "Compré algo con 50% de descuento y salí gastando el 200%.",
   "Dividí mi tiempo entre estudiar y descansar. Descansar ganó por goleada.",
   "Los problemas de trenes que salen a la misma hora: yo ni al camión llego a tiempo.",
   "Mi mamá suma los gastos de la casa sin calculadora y eso sí es superpoder.",
   "Le pregunté a la X por qué se esconde tanto y me dijo: despéjame si puedes.",
   "En el tianguis todos son genios de las mates hasta que llega el examen."
  ]},
 vale:{
  consejo:[
   "Deja el celular en otro cuarto, no boca abajo. Cerquita sigue distrayendo.",
   "Ponte 15 minutos de reloj y prométete solo esos 15. Casi siempre le sigues.",
   "Anota lo que te distraiga en una hoja y regresa. Luego lo ves.",
   "Cierra las pestañas que no estás usando; también cansan.",
   "Estudia siempre en el mismo lugar: tu cerebro aprende a encender ahí.",
   "Avisa en tu casa que vas a estudiar 20 minutos. Se respeta más de lo que crees.",
   "Ten agua a la mano para no pararte a cada rato.",
   "Si te distraes, no te regañes: solo regresa. Volver es el músculo que entrenas.",
   "Haz primero la tarea que menos te gusta; lo demás se siente ligero.",
   "Quita las notificaciones mientras trabajas. Ninguna es urgente por 20 minutos.",
   "Descansa moviéndote, no abriendo redes. Si no, el descanso no descansa.",
   "Ten el escritorio despejado: mesa limpia, cabeza limpia.",
   "Pon música sin letra si necesitas ruido; con letra te roba palabras.",
   "Divide la tarea en partes chiquitas y ve tachando.",
   "Si traes mil pendientes, escríbelos todos. Sacarlos de la cabeza da paz."
  ],
  animo:[
   "Te distrajiste y volviste. Eso es exactamente concentrarse.",
   "Aguantar un poquito más hoy es aguantar mucho más mañana.",
   "Cansarte de pensar quiere decir que sí estabas pensando.",
   "Tu foco dura más de lo que crees. Prueba un minuto extra.",
   "Notar que te fuiste es la mitad de la concentración.",
   "Hoy te distrajiste menos que ayer. Cuenta.",
   "No necesitas concentrarte todo el día, solo este ratito.",
   "Estás entrenando algo que casi nadie entrena. Bien por ti.",
   "Sigue, que ya llevas más de lo que creías aguantar.",
   "Cada vez que regresas al cuaderno, ganas tú.",
   "Un paso a la vez y sin prisas.",
   "Enfocarte cansa porque sirve.",
   "Vas bien, y eso lo digo yo que veo todo.",
   "Menos pestañas, más avances. Ahí la llevas.",
   "Ya casi acabas. No sueltes ahorita."
  ],
  chiste:[
   "Iba a estudiar, pero primero acomodé el escritorio… y luego el cuarto… y luego la casa.",
   "Mi concentración dura lo que dura un mensaje sin contestar.",
   "Abrí el cuaderno con toda la actitud y el cuaderno también se quedó viendo la pared.",
   "Me senté a estudiar y de repente sabía todo sobre un video de gatitos.",
   "Dije 'solo cinco minutos' y el reloj se rió en mi cara.",
   "Estaba muy concentrado hasta que… ¿de qué hablábamos?",
   "Puse el celular boca abajo y aun así lo escuché pensar.",
   "Mi mamá me habló una vez y perdí la hora completa de estudio.",
   "Empecé la tarea a las 4 y la seguí empezando hasta las 9.",
   "Tengo una lista de pendientes tan bonita que prefiero verla que hacerla.",
   "Me distraje tanto que hasta se me olvidó que me estaba distrayendo.",
   "El ventilador y yo llevamos rato viéndonos fijamente.",
   "Me puse audífonos para concentrarme y terminé dando un concierto.",
   "Juré no abrir el celular y el celular se abrió solito, según yo.",
   "Mi silla está tan cómoda que estudiar se volvió opcional."
  ]},
 donRaro:{
  consejo:[
   "Cuando no salga, dibújalo. El papel piensa contigo.",
   "Pregúntate qué es lo que NO puede ser. Eliminar también es resolver.",
   "Si te atoras, cámbiate de silla o toma agua. En serio funciona.",
   "Lee el acertijo dos veces: casi siempre la trampa está en una palabra.",
   "Prueba con números chiquitos primero y luego generaliza.",
   "Voltea el problema: empieza por el final y regrésate.",
   "Escribe todas las ideas, hasta las tontas. De ahí salen las buenas.",
   "Busca el patrón, no la respuesta. La respuesta viene sola después.",
   "Dale 10 minutos de descanso a un problema difícil; regresas distinto.",
   "Explícale el acertijo a alguien más: al contarlo se resuelve.",
   "Haz una tablita con los datos; el orden revela lo escondido.",
   "Si hay varias opciones, prueba la más rara. A veces es la correcta.",
   "No confundas rápido con listo. Pensar bien toma su tiempo.",
   "Pon a prueba tu respuesta antes de darla por buena.",
   "Guarda los acertijos que fallaste; vuélvelos a intentar en una semana."
  ],
  animo:[
   "Pensar distinto no es raro, es ventaja.",
   "Lo que hoy parece enredo, mañana es patrón.",
   "Ir despacio y con calma también es ir avanzando.",
   "Tu forma diferente de pensar es justo la que resuelve lo difícil.",
   "Los que se aburren pronto no llegan lejos; tú sigues aquí.",
   "Fallar un acertijo entrena más que acertar tres fáciles.",
   "Ya viste cosas que otros pasaron de largo.",
   "Tu curiosidad vale más que cualquier respuesta rápida.",
   "Sigue dándole vueltas, que ahí está la idea.",
   "Cada intento te acerca aunque no lo parezca.",
   "El pensamiento raro es el que inventa cosas nuevas.",
   "No te apures, apúrate con calma.",
   "Ya casi encuentras el hilo. Jálale tantito.",
   "Los problemas difíciles se te están haciendo costumbre.",
   "Me gusta cómo piensas. Sigue así."
  ],
  chiste:[
   "Tengo una adivinanza: ¿qué se llena de rayas y nunca se cansa? Mi cuaderno de la escuela.",
   "Me quedé pensando tanto en el acertijo que ya se me olvidó la pregunta.",
   "Dicen que soy raro, pero mi lápiz y yo no opinamos igual.",
   "Adivina: entra al salón, no dice nada y todos se callan. El maestro con cara de lunes.",
   "Pensé fuera de la caja y la caja se ofendió.",
   "Le hice una pregunta filosófica a mi perro y me trajo la pelota. Respuesta válida.",
   "Adivinanza: ¿qué es lo que siempre falta cuando más se necesita? El plumón del pizarrón.",
   "Tengo la respuesta en la punta de la lengua y la lengua no quiere cooperar.",
   "Soñé que resolvía el acertijo y desperté con más dudas y menos sábanas.",
   "Dicen que todo tiene solución; mi calcetín perdido dice que no.",
   "Me dijeron 'piensa rápido' y mi cerebro pidió una cita para el jueves.",
   "Adivina qué: entre más lo explico, menos lo entiendo. Como mi tarea de historia.",
   "Hice una lista de misterios sin resolver y el primero es dónde quedó mi goma.",
   "Mi teoría es rara pero funciona; el problema es explicársela a mi maestra.",
   "¿Qué es gris, tiene cuatro patas y no piensa? Mi silla en época de exámenes."
  ]}
};
window.CX_FRASES_MX=FR;

try{
  Object.keys(FR).forEach(function(k){
    if(window.CX_FRASES_ES)window.CX_FRASES_ES[k]=FR[k];
    var ch=(window.EA_CHARS||{})[k];
    if(ch){ch.consejo=FR[k].consejo.slice();ch.animo=FR[k].animo.slice();ch.chiste=FR[k].chiste.slice();
      if(ch.phrases){ch.phrases.consejo=ch.consejo;ch.phrases.animo=ch.animo;ch.phrases.chiste=ch.chiste;ch.phrases.joke=ch.chiste;ch.phrases.tip=ch.consejo;}}
  });
}catch(e){}

function favChar33(){try{return (window.cxGetFav&&window.cxGetFav())||localStorage.getItem("cx_favchar_"+uid())||"excelencia";}catch(e){return "excelencia";}}
var ultima={};
function fraseDe(k,tipo){
  var p=FR[k]||FR.excelencia;
  tipo=tipo||["consejo","animo","chiste"][Math.floor(Math.random()*3)];
  var arr=p[tipo]||p.consejo,t,i=0;
  do{t=arr[Math.floor(Math.random()*arr.length)];i++;}while(i<8&&t===ultima[k+tipo]);
  ultima[k+tipo]=t;return t;
}
window.cxFraseMX=fraseDe;

(function(){
function $(i){return document.getElementById(i);}
  var orig=window.cxChar;
  if(typeof orig!=="function")return;
  window.cxChar=function(k,tipo){
    k=k||favChar33()||"excelencia";
    if(!FR[k])return orig.call(this,k,tipo);
    tipo=tipo||["consejo","animo","chiste"][Math.floor(Math.random()*3)];
    var txt=fraseDe(k,tipo);
    var r=orig.call(this,k,tipo);
    setTimeout(function(){
      var pop=document.getElementById("cxCharPop");if(!pop)return;
      var tx=pop.querySelector(".tx");if(!tx)return;
      tx.textContent=txt;
      try{speechSynthesis.cancel();window.cxSpeak&&window.cxSpeak(txt,.98);}catch(e){}
      var vz=pop.querySelector('[data-a="voz"]');
      if(vz)vz.onclick=function(e){e.stopPropagation();try{window.cxSpeak(txt);}catch(err){}};
    },30);
    return r;
  };
})();

var VIEJAS=[/siete,\s*ocho,\s*nueve/i,/demasiados problemas/i,/modo avi[oó]n/i,/recuperativo/i,/¡?Conectamos!?/i,/wifi del sal[oó]n/i,/quedarse sin palabras/i,/desacentuado/i,/divididos entre dos/i,/solo a la derecha/i,/viene cuando quiere/i,/s[eé] mucho de ardillas/i,/mi paciencia en los ex[aá]menes/i,/la idea empez[oó] a pensar en m[ií]/i,/l[oó]gico y raro a la vez/i];
setInterval(function(){
  var pop=document.getElementById("cxCharPop");if(!pop)return;
  var tx=pop.querySelector(".tx");if(!tx)return;
  var t=tx.textContent||"";
  for(var i=0;i<VIEJAS.length;i++){
    if(VIEJAS[i].test(t)){tx.textContent=fraseDe(favChar33(),"chiste");break;}
  }
},700);


/* ===== CognitExAc v33 · PARTE 3: Tienda unificada + catálogo ampliado (+150%) + precios +5% ===== */
(function(){
function $(i){return document.getElementById(i);}
function uid3(){return (window.CU&&CU.id)||"";}
function esc3(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}

/* ---------- 1) Catálogo nuevo (se suma a SHOP_ALL) ---------- */
var NUEVOS=[];
function add(cat,arr){arr.forEach(function(a){NUEVOS.push({id:a[0],name:a[1],ico:a[2],price:a[3],cat:cat,desc:a[4]});});}

add("mascotas",[
["m33_axolote","Axolote Xochi","🦎",520,"Ajolote de Xochimilco, regenera tu ánimo"],
["m33_jaguar","Jaguar Maya","🐆",700,"Fuerza y sigilo de la selva de Calakmul"],
["m33_colibri","Colibrí Huitzil","🐦",480,"Mensajero veloz, sube tu racha"],
["m33_quetzal","Quetzal Real","🦜",760,"Plumas de mil colores, elegancia pura"],
["m33_tortuga","Tortuga Escamol","🐢",380,"Lenta pero nunca se rinde"],
["m33_alebrije","Alebrije Oaxaqueño","🐉",900,"Criatura de sueños tallada en copal"],
["m33_borrego","Borrego Cimarrón","🐏",560,"Terco (en el buen sentido) como tú estudiando"],
["m33_tlacuache","Tlacuache Travieso","🐀",300,"El que le robó el fuego a los dioses"],
["m33_guacamaya","Guacamaya Chiapaneca","🦚",640,"Ruidosa, alegre y siempre presente"],
["m33_lobomex","Lobo Mexicano","🐺",820,"Líder de manada, protege tu progreso"],
["m33_mariposa","Mariposa Monarca","🦋",540,"Viaja miles de km, como tus ideas"],
["m33_cachorro","Xoloitzcuintle","🐕",600,"El perro más mexicano de todos"],
["m33_pulpo","Pulpo Multitarea","🐙",580,"Ocho brazos para ocho materias"],
["m33_buho2","Búho Nocturno","🦉",470,"Acompaña tus repasos de última hora"],
["m33_gatoazul","Gato Neón","🐱",520,"Maullidos que te recuerdan entrenar"]
]);

add("casas",[
["c33_hacienda","Hacienda Morelense","🏡",1100,"Arcos, patio y buganvilias"],
["c33_pueblo","Casa de Pueblo Mágico","🏘️",900,"Tejas rojas y calles empedradas"],
["c33_piramide","Pirámide de Estudio","🛕",1500,"Tu mascota medita en la cima"],
["c33_depa","Depa Moderno CDMX","🏢",800,"Minimalista y con buena vista"],
["c33_cabana","Cabaña del Bosque","🛖",700,"Ideal para concentrarse"],
["c33_faro","Faro del Conocimiento","🗼",1300,"Ilumina el camino de tu mascota"],
["c33_invernadero","Invernadero","🪴",950,"Plantas que crecen con tus puntos"],
["c33_observatorio","Observatorio","🔭",1400,"Para mirar las estrellas y las metas"],
["c33_biblioteca","Mini Biblioteca","📚",1050,"Un librero enorme en casa"],
["c33_taller","Taller Creativo","🧰",880,"Donde se arman las buenas ideas"]
]);

add("vehículos",[
["v33_trajinera","Trajinera de Xochimilco","🛶",750,"Paseo con flores y música"],
["v33_calandria","Calandria","🐎",690,"Clásico paseo de plaza"],
["v33_metro","Vagón del Metro","🚇",620,"Transporte urbano legendario"],
["v33_camioncito","Camión Escolar","🚌",700,"Nunca llega tarde a clase"],
["v33_globo","Globo Aerostático","🎈",1200,"Vista de Teotihuacán al amanecer"],
["v33_bici","Bici de Montaña","🚲",480,"Ejercicio para cuerpo y mente"],
["v33_cohete","Cohete de Estudio","🚀",1600,"Despegue directo al 10"],
["v33_lancha","Lancha Caribeña","🛥️",1050,"Aguas turquesa de Quintana Roo"],
["v33_tren","Tren Ligero","🚈",860,"Ritmo constante, como tu práctica"],
["v33_moto","Moto Veloz","🏍️",790,"Para las respuestas rápidas"]
]);

add("temas",[
["t33_talavera","Talavera Poblana","🔵",620,"Azul y blanco artesanal"],
["t33_cempasuchil","Cempasúchil","🟠",640,"Naranja de ofrenda"],
["t33_selva","Selva Lacandona","🌿",600,"Verdes profundos"],
["t33_atardecer","Atardecer en Acapulco","🌅",660,"Naranjas y rosas"],
["t33_nocheciudad","Noche de Ciudad","🌃",600,"Oscuro con luces neón"],
["t33_papelpicado","Papel Picado","🎏",680,"Colores de fiesta"],
["t33_desierto","Desierto de Sonora","🏜️",580,"Arenas y cactus"],
["t33_grafito","Grafito Escolar","✏️",520,"Gris sobrio y elegante"],
["t33_pastel","Pastel Suave","🍬",540,"Colores tranquilos para leer"],
["t33_oroblanco","Oro y Blanco","🤍",720,"Edición elegante de CognitExAc"],
["t33_esmeralda","Esmeralda","💚",640,"Verde que descansa la vista"],
["t33_vino","Vino Universitario","🍷",640,"Serio y académico"]
]);

add("marcos",[
["f33_barro","Marco de Barro Negro","🪵",520,"Artesanía de Oaxaca"],
["f33_plata","Marco de Plata de Taxco","🥈",760,"Brillo fino"],
["f33_flores","Marco Floral","🌺",480,"Flores bordadas"],
["f33_azteca","Marco Azteca","🗿",700,"Grecas prehispánicas"],
["f33_neon2","Marco Neón","💡",640,"Resalta en el ranking"],
["f33_laurel","Marco de Laurel","🌿",600,"Para los que ganan seguido"],
["f33_estrellas","Marco Estelar","✨",680,"Con destellos animados"],
["f33_diploma","Marco de Diploma","📜",720,"Estilo certificado"]
]);

add("ropa",[
["r33_jorongo","Jorongo","🧣",380,"Abrigadito y muy mexicano"],
["r33_sombrero","Sombrero de Charro","🤠",460,"Para las fiestas patrias"],
["r33_rebozo","Rebozo","🧶",400,"Tejido tradicional"],
["r33_luchador","Máscara de Luchador","🎭",520,"Técnico o rudo, tú decides"],
["r33_bata","Bata de Científico","🥼",480,"Modo experimento activado"],
["r33_toga","Toga de Graduación","🎓",560,"Para presumir el promedio"],
["r33_jersey","Jersey Tricolor","👕",440,"¡Vamos México!"],
["r33_impermeable","Impermeable","🧥",360,"Para la temporada de lluvias"],
["r33_pijama","Pijama de Estudio","🩳",340,"Comodidad total"],
["r33_botas","Botas Aventureras","🥾",420,"Listas para la excursión"]
]);

add("avatar_acc",[
["a33_lentes","Lentes de Sol","🕶️",300,"Modo confianza"],
["a33_audifonos","Audífonos de Concentración","🎧",420,"Música para estudiar"],
["a33_mochila","Mochila Escolar","🎒",360,"Con todo lo necesario"],
["a33_corona","Corona de Reyes","👑",640,"De la Rosca de Reyes"],
["a33_bufanda","Bufanda Invernal","🧣",320,"Para diciembre"],
["a33_reloj","Reloj Inteligente","⌚",520,"Controla tus sesiones"],
["a33_pluma","Pluma de Oro","🖋️",480,"Firma de campeón"],
["a33_medalla","Medalla al Esfuerzo","🏅",560,"Porque no te rendiste"],
["a33_libreta","Libreta de Apuntes","📓",300,"Anota tus trucos"],
["a33_flor","Flor de Cempasúchil","🌼",280,"Detalle de temporada"]
]);

add("reacciones",[
["x33_confeti","Confeti de Fiesta","🎊",360,"Cae confeti al ganar"],
["x33_grito","¡Ese es mi Grito!","📣",420,"Grito mexicano de victoria"],
["x33_mariachi","Trompeta de Mariachi","🎺",480,"Fanfarria al subir de nivel"],
["x33_aplauso","Aplauso del Salón","👏",340,"Todo el grupo te aplaude"],
["x33_fuego","Racha en Llamas","🔥",400,"Para rachas largas"],
["x33_estrellita","Estrellita de Maestra","⭐",300,"Clásico del cuaderno"],
["x33_campana","Campana de Escuela","🔔",320,"Suena al terminar"],
["x33_chispazo","Chispazo Neuronal","⚡",440,"Efecto eléctrico"]
]);

add("powerups",[
["p33_doble","Doble LPI (1 juego)","✖️",300,"Duplica los puntos de una partida"],
["p33_pista","Pista Extra","💡",180,"Una ayudita cuando te atoras"],
["p33_tiempo","Tiempo Extra","⏱️",200,"+15 segundos en juegos con reloj"],
["p33_escudo","Escudo de Racha","🛡️",450,"Protege tu racha un día"],
["p33_saltar","Saltar Pregunta","⏭️",150,"Sin perder puntos"],
["p33_repetir","Segundo Intento","🔁",220,"Otra oportunidad"],
["p33_enfoque","Modo Enfoque","🎯",260,"Menos distracciones en pantalla"],
["p33_turbo","Turbo Monedas","🪙",380,"+50% CogniCoins por una sesión"]
]);

add("juegos",[
["g33_loteria","Lotería Mental","🃏",800,"La lotería mexicana en versión cognitiva"],
["g33_serpientes","Serpientes y Neuronas","🎲",760,"Tablero de retos"],
["g33_memorama","Memorama Nacional","🇲🇽",720,"Estados, capitales y símbolos"],
["g33_trabalenguas","Trabalenguas Express","👅",680,"Dicción y velocidad"],
["g33_albur","Ingenio Rápido","🧠",700,"Doble sentido sano y mucho ingenio"],
["g33_mercado","Cuentas del Mercado","🧮",740,"Suma, cambio y ofertas reales"],
["g33_rompe","Rompecabezas Cultural","🧩",780,"Arte y monumentos de México"],
["g33_ritmo","Ritmo y Memoria","🥁",760,"Sigue el compás sin fallar"]
]);

add("títulos",[
["ti33_chido","El Más Chido del Salón","🎖️",500,"Título honorífico"],
["ti33_neurona","Neurona de Acero","🧠",620,"Para mentes resistentes"],
["ti33_maestrazo","Maestrazo","📐",700,"Dominas lo que practicas"],
["ti33_chambeador","Chambeador Incansable","💪",560,"Nunca falta a su entrenamiento"],
["ti33_crack","Crack del LPI","📈",760,"Top del ranking"],
["ti33_sabio","Sabio de Barrio","🦉",640,"Sabiduría con sazón"],
["ti33_poliglota","Políglota en Camino","🗣️",720,"Por avanzar en CognIdiomas"],
["ti33_madrugador","Madrugador","🌄",480,"Entrena antes de la escuela"]
]);

add("especial",[
["e33_beca","Reconocimiento Excelsior","🏫",1800,"Distinción especial del plantel"],
["e33_mural","Mural del Campeón","🖼️",1500,"Tu nombre en el mural digital"],
["e33_copa","Copa de Oro CognitExAc","🏆",2000,"El premio mayor"],
["e33_placa","Placa Conmemorativa","🪧",1200,"Con la fecha de tu logro"]
]);

add("alimento",[
["al33_tamal","Tamal Oaxaqueño","🫔",90,"Energía para toda la mañana",true],
["al33_elote","Elote Preparado","🌽",70,"Antojito favorito"],
["al33_pan","Pan de Muerto","🍞",80,"Solo sabe mejor en noviembre"],
["al33_agua","Agua de Jamaica","🥤",50,"Refresca y rehidrata"],
["al33_fruta","Fruta con Chile","🍉",60,"Sanita y sabrosa"],
["al33_churro","Churro con Chocolate","🍫",85,"Premio dulce"]
]);
NUEVOS.forEach(function(it){if(it.cat==="alimento")it.food=true;});

/* ---------- 2) Ítems de temporada ligados al calendario ---------- */
var TEMP={
reyes:[["Corona de Rosca","👑",700],["Camello de Melchor","🐫",820],["Rey Mago Gaspar","🧙",950],["Rosca Dorada", "🥯", 640],["Estrella de Belén", "⭐", 560],["Regalo Sorpresa", "🎁", 480],["Melchor Sabio", "🧔", 1000],["Baltasar Real", "🤴", 1050],["Muñeco en la Rosca", "🪆", 700]],
bandera:[["Bandera de Escolta","🏳️",600],["Escudo Nacional","🦅",880],["Abanderado Estrella","🎖️",900],["Asta Monumental", "🏳️", 720],["Banda Tricolor", "🎗️", 460],["Águila Real", "🦅", 980],["Himno en Partitura", "🎼", 520],["Tambor de Escolta", "🥁", 600],["Guardia de Honor", "💂", 1100]],
primavera:[["Corona de Flores","🌷",520],["Abejita Polen","🐝",560],["Hada de Primavera","🧚",900],["Girasol Gigante", "🌻", 480],["Mariposa Monarca", "🦋", 640],["Maceta Mágica", "🪴", 420],["Lluvia de Pétalos", "🌸", 700],["Catarina Suertuda", "🐞", 520],["Jardinero Sabio", "👩‍🌾", 1000]],
aniversario:[["Pastel de Aniversario","🎂",700],["Globo Dorado","🎈",520],["Fundador Excelsior","🦁",1200],["Medalla Fundadores", "🏅", 900],["Confeti Dorado", "🎊", 480],["Cerebro de Oro", "🧠", 1400],["Trofeo Aniversario", "🏆", 1200],["Vela Mágica", "🕯️", 420],["Excelsior Legendario", "👑", 1600]],
nino:[["Papalote","🪁",420],["Piñata de Estrella","🪅",460],["Amigo Juguetón","🧸",850],["Trompo Clásico", "🪀", 380],["Balero Retro", "🎯", 400],["Canica Galáctica", "🔮", 450],["Carrusel", "🎠", 700],["Cohete de Juguete", "🚀", 820],["Niño Genio", "🧒", 1000]],
madres:[["Ramo de Flores","💐",520],["Taza Mundial de Mamá","☕",380],["Mamá Guerrera","💗",950],["Tarjeta Hecha a Mano", "💌", 360],["Corazón de Mamá", "💖", 600],["Rosa Eterna", "🌹", 700],["Abrazo de Oso", "🤗", 520],["Pastel de Mamá", "🍰", 480],["Súper Mamá", "🦸‍♀️", 1100]],
estudiante:[["Mochila del Saber","🎒",480],["Calculadora Pro","🧮",420],["Estudiante Estrella","📚",900],["Lápiz de Oro", "✏️", 420],["Birrete de Honor", "🎓", 900],["Microscopio", "🔬", 760],["Globo Terráqueo", "🌎", 620],["Libro Infinito", "📖", 560],["Genio del Salón", "🤓", 1100]],
padres:[["Gorra de Papá","🧢",400],["Parrilla Familiar","🍖",460],["Papá Entrenador","🏅",900],["Corbata Elegante", "👔", 420],["Caja de Herramientas", "🧰", 520],["Balón de Fútbol", "⚽", 460],["Taza de Papá", "☕", 380],["Reloj Clásico", "⌚", 760],["Súper Papá", "🦸‍♂️", 1100]],
independencia:[["Sombrero Charro Dorado","🤠",640],["Campana de Dolores","🔔",880],["Insurgente Valiente","⚔️",1100],["Grito de Dolores", "📣", 700],["Rehilete Tricolor", "🎡", 420],["Pozole Patrio", "🍲", 480],["Chile en Nogada", "🌶️", 560],["Mariachi", "🎺", 820],["Héroe Nacional", "🎖️", 1200]],
sismos:[["Mochila de Emergencia","🎒",500],["Silbato de Rescate","📯",350],["Brigadista Protector","🦺",900],["Lámpara de Emergencia", "🔦", 420],["Botiquín", "🩹", 480],["Casco de Brigada", "⛑️", 620],["Radio de Pilas", "📻", 520],["Perrito Rescatista", "🐕‍🦺", 980],["Héroe Civil", "🦺", 1100]],
muertos:[["Ofrenda Completa","🕯️",760],["Catrina de Papel","💀",680],["Catrín Elegante","🎩",1100],["Cempasúchil", "🌼", 420],["Calaverita de Azúcar", "💀", 480],["Papel Picado", "🎏", 380],["Alebrije", "🐉", 980],["Xoloitzcuintle", "🐕", 1050],["Vela de Ofrenda", "🕯️", 360]],
navidad:[["Ponche Navideño","🍵",420],["Piñata de Posada","🪅",560],["Duende de Diciembre","🧝",950],["Esfera Brillante", "🔮", 380],["Nochebuena", "🌺", 420],["Reno Veloz", "🦌", 820],["Muñeco de Nieve", "⛄", 700],["Bastón de Caramelo", "🍬", 360],["Santa Genio", "🎅", 1200]],
anonuevo:[["Uvas de la Suerte","🍇",380],["Fuegos Artificiales","🎆",600],["Año Nuevo Brillante","🌟",950],["Copa de Metas", "🥂", 480],["Reloj de Medianoche", "🕛", 560],["Serpentina", "🎉", 360],["Lista de Propósitos", "📝", 420],["Estrella Fugaz", "🌠", 820],["Genio del Año", "🧞", 1150]],
sanvalentin:[["Carta de Amistad", "💌", 380],["Corazón Brillante", "💖", 520],["Osito Cariñoso", "🧸", 640],["Rosa Roja", "🌹", 460],["Chocolates", "🍫", 420],["Pulsera de Amistad", "📿", 560],["Cupido Sabio", "💘", 900],["Globo Corazón", "🎈", 480],["Mejor Amigo", "🤝", 1100]],
maestro:[["Manzana Roja", "🍎", 380],["Pizarrón Mágico", "🧑‍🏫", 760],["Gis de Colores", "🖍️", 360],["Diploma de Gratitud", "📜", 520],["Regla de Oro", "📏", 460],["Globo del Saber", "🌎", 640],["Lentes de Sabio", "👓", 580],["Maestro Legendario", "🦉", 1150],["Campana de Clase", "🔔", 420]],
halloween:[["Calabaza Brillante", "🎃", 420],["Murciélago", "🦇", 480],["Fantasma Amigable", "👻", 620],["Telaraña", "🕸️", 360],["Dulces de Truco", "🍬", 380],["Gato Negro", "🐈‍⬛", 700],["Escoba Voladora", "🧹", 820],["Castillo Embrujado", "🏰", 980],["Mago de la Noche", "🧙", 1100]],
revolucion:[["Sombrero Revolucionario", "👒", 520],["Caballo Valiente", "🐎", 980],["Carabina de Juguete", "🎯", 460],["Canana Tricolor", "🎗️", 420],["Adelita", "👩", 900],["Locomotora", "🚂", 820],["Bandera de Batalla", "🚩", 480],["Cartel de Libertad", "📜", 380],["Caudillo del Sur", "🤠", 1150]]
};
var TEMPITEMS=[];
Object.keys(TEMP).forEach(function(fid){
  TEMP[fid].forEach(function(t,i){
    TEMPITEMS.push({id:"fest_"+fid+"_"+i,name:t[0],ico:t[1],price:t[2],cat:"temporada",fiesta:fid,desc:"Exclusivo de temporada · solo disponible en su fecha"});
  });
});

/* ---------- 3) Inyección en SHOP_ALL + precios +5% ---------- */
function inyectar(){
  if(!window.SHOP_ALL||!SHOP_ALL.push)return false;
  if(SHOP_ALL.__v33)return true;
  var ids={};SHOP_ALL.forEach(function(i){ids[i.id]=1;});
  NUEVOS.concat(TEMPITEMS).forEach(function(i){if(!ids[i.id])SHOP_ALL.push(i);});
  /* v37: precios fijos, sin aumento automático */
  SHOP_ALL.__v33=1;
  return true;
}

/* ---------- 4) Tienda unificada ---------- */
var SECS=[["shopV10","🛍️ Catálogo general"],["cxShopTemp","🎉 Temporada"],["shopThemes","🎨 Temas y artículos"],["shopChars","🎭 Personajes"],["shopFrames","🖼️ Marcos"],["shopReacts","✨ Reacciones"]];
function unificar(){
  var inner=document.querySelector("#sc-tienda .sec-inner");if(!inner)return;
  var wrap=$("cxShopUni");
  if(!wrap){
    wrap=document.createElement("div");wrap.id="cxShopUni";
    var head=document.createElement("div");head.id="cxShopHead";
    head.innerHTML='<div style="background:linear-gradient(135deg,rgba(212,175,55,.16),rgba(124,58,237,.14));border:1px solid var(--border);border-radius:16px;padding:14px;margin-bottom:12px">'+
      '<div style="font-weight:900;font-size:1.05rem;color:var(--gold)">🛍️ Tienda CognitExAc</div>'+
      '<div style="font-size:.74rem;color:var(--text2);margin-top:2px">Una sola tienda con todas las secciones: mascotas, casas, personajes, temporada y más. </div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px"><div style="background:rgba(0,0,0,.2);border-radius:10px;padding:8px"><div style="font-size:1.1rem;font-weight:900;color:var(--gold)"><span id="cxShopCoins">0</span> 🪙</div><div style="font-size:.64rem;color:var(--text2)"><b>CogniCoins</b>: se gastan aquí en la tienda.</div></div><div style="background:rgba(0,0,0,.2);border-radius:10px;padding:8px"><div style="font-size:1.1rem;font-weight:900;color:#10B981"><span id="cxShopLpi">0</span> 📈</div><div style="font-size:.64rem;color:var(--text2)"><b>LPI</b>: tu nivel y ranking. No se gasta.</div></div></div><div style="font-size:.62rem;color:var(--text2);margin-top:6px">Ganas CogniCoins jugando: hasta 80 por juego y 600 en total al día.</div>'+
      '<div id="cxShopChips" style="display:flex;flex-wrap:wrap;gap:6px;margin-top:10px"></div></div>';
    wrap.appendChild(head);
    inner.insertBefore(wrap,inner.firstChild);
  }
  var temp=$("cxShopTemp");
  if(!temp){temp=document.createElement("div");temp.id="cxShopTemp";wrap.appendChild(temp);}
  SECS.forEach(function(s){var el=$(s[0]);if(el&&el.parentNode!==wrap)wrap.appendChild(el);});
  var chips=$("cxShopChips");
  if(chips){
    chips.innerHTML="";
    SECS.forEach(function(s){
      var el=$(s[0]);if(!el||!el.innerHTML.trim())return;
      var b=document.createElement("button");
      b.textContent=s[1];
      b.style.cssText="background:var(--card);border:1px solid var(--border);border-radius:999px;padding:5px 11px;font-size:.68rem;font-weight:700;color:var(--text);cursor:pointer;font-family:inherit";
      b.onclick=function(){el.scrollIntoView({behavior:"smooth",block:"start"});};
      chips.appendChild(b);
    });
  }
  var c=$("cxShopCoins");if(c)c.textContent=(window.cxCoins33?cxCoins33():0);
  var l=$("cxShopLpi");if(l)l.textContent=(window.CU&&window.USERS&&USERS[CU.id]&&USERS[CU.id].pts)||0;
}


function calendarioTemporada(){
  var F=window.CX_FIESTAS||[],hoy=new Date(),y=hoy.getFullYear();
  var MES=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  function rango(f,yr){try{var r=f.tienda(yr);if(r&&r[0]&&r[1])return r;}catch(e){}return null;}
  function txt(r){var a=r[0],b=r[1];return a.getMonth()===b.getMonth()?a.getDate()+" al "+b.getDate()+" de "+MES[a.getMonth()]:a.getDate()+" de "+MES[a.getMonth()]+" al "+b.getDate()+" de "+MES[b.getMonth()];}
  var L=[];
  F.forEach(function(f){var r=rango(f,y);if(!r)return;var p=r;if(r[1].getTime()<hoy.getTime())p=rango(f,y+1)||r;L.push({f:f,r:r,p:p,d:Math.ceil((p[0].getTime()-hoy.getTime())/86400000)});});
  L.sort(function(a,b){return a.d-b.d;});
  var h='<div style="font-size:.82rem;font-weight:800;color:var(--text);margin:14px 0 6px">🎉 Temporada</div>'+
   '<div style="font-size:.72rem;color:var(--text2);background:var(--card);border:1px dashed var(--border);border-radius:12px;padding:12px;margin-bottom:10px">Ahorita no hay fiesta activa. Estas son <b>todas las fechas</b> en que la tienda se transforma con mascotas, objetos y personajes exclusivos. ¡Junta tus CogniCoins!</div>';
  if(L.length){
    var n=L[0],its=TEMPITEMS.filter(function(t){return t.fiesta===n.f.id;});
    h+='<div style="background:linear-gradient(135deg,rgba(212,175,55,.18),rgba(124,58,237,.14));border:1px solid var(--gold);border-radius:14px;padding:12px;margin-bottom:10px">'+
     '<div style="font-size:.64rem;font-weight:800;letter-spacing:.08em;color:var(--gold)">PRÓXIMA FIESTA</div>'+
     '<div style="font-size:1rem;font-weight:900;color:var(--text);margin-top:3px">'+n.f.emo+' '+esc3(n.f.nom)+'</div>'+
     '<div style="font-size:.7rem;color:var(--text2);margin-top:2px">'+esc3(n.f.lema||"")+'</div>'+
     '<div style="font-size:.7rem;font-weight:800;color:var(--gold);margin-top:6px">🗓️ '+txt(n.p)+(n.d>0?' · faltan '+n.d+(n.d===1?' día':' días'):' · ¡hoy!')+'</div>';
    if(its.length){
      h+='<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:9px">';
      its.slice(0,8).forEach(function(t){h+='<div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:7px 9px;text-align:center;min-width:62px;opacity:.85"><div style="font-size:1.1rem">'+t.ico+'</div><div style="font-size:.56rem;color:var(--text2);margin-top:2px">🔒 '+t.price+' 🪙</div></div>';});
      h+='</div><div style="font-size:.62rem;color:var(--text3);margin-top:6px">'+its.length+' artículo(s) exclusivos se desbloquean en esa fecha.</div>';
    }
    h+='</div>';
  }
  h+='<div style="font-size:.74rem;font-weight:800;color:var(--text);margin:10px 0 6px">🗓️ Calendario completo del año</div><div style="display:grid;gap:6px">';
  L.forEach(function(x){var c=TEMPITEMS.filter(function(t){return t.fiesta===x.f.id;}).length;
    h+='<div style="display:flex;align-items:center;gap:9px;background:var(--card);border:1px solid var(--border);border-radius:10px;padding:8px 10px"><div style="font-size:1.2rem">'+x.f.emo+'</div><div style="flex:1;min-width:0"><div style="font-size:.72rem;font-weight:800;color:var(--text)">'+esc3(x.f.nom)+'</div><div style="font-size:.62rem;color:var(--text2)">'+txt(x.r)+(c?' · '+c+' exclusivos':'')+'</div></div><div style="font-size:.6rem;font-weight:800;color:var(--gold);white-space:nowrap">'+(x.d>0?'en '+x.d+' d':'activa')+'</div></div>';});
  return h+'</div>';
}
function renderTemporada(){
  var box=$("cxShopTemp");if(!box)return;
  var act=(window.cxTiendaTemporada?cxTiendaTemporada():[])||[];
  var items=TEMPITEMS.filter(function(i){return act.indexOf(i.fiesta)>=0;});
  if(!items.length){ box.innerHTML = calendarioTemporada(); return; }
  var owned=[];try{owned=JSON.parse(localStorage.getItem("shop_"+uid3())||"[]");}catch(e){}
  var admin=window.CU&&CU.isAdmin,coins=window.cxCoins33?cxCoins33():0;
  var h='<div style="font-size:.82rem;font-weight:800;color:var(--text);margin:14px 0 8px">🎉 Exclusivos de temporada <span style="color:#F59E0B;font-size:.66rem">· por tiempo limitado</span></div><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(118px,1fr));gap:8px">';
  items.forEach(function(it){
    var have=owned.indexOf(it.id)>=0,can=admin||coins>=it.price;
    h+='<div style="background:var(--card);border:1px solid '+(have?"#10B981":"var(--gold)")+';border-radius:10px;padding:10px;text-align:center">'+
    '<div style="font-size:1.4rem">'+it.ico+'</div>'+
    '<div style="font-size:.68rem;font-weight:700;color:var(--text);margin:3px 0">'+esc3(it.name)+'</div>'+
    '<div style="font-size:.58rem;color:var(--text2);margin-bottom:4px">'+esc3(it.desc)+'</div>'+
    (have?'<div style="font-size:.64rem;color:#10B981;font-weight:700">✅ Obtenido</div>':
      '<div style="font-size:.68rem;font-weight:800;color:var(--gold);margin-bottom:3px">'+(admin?"Gratis":it.price+" 🪙")+'</div>'+
      (can?'<button data-iid="'+it.id+'" onclick="buyItem2(this.dataset.iid)" style="background:linear-gradient(135deg,var(--gold-d),var(--gold));border:none;border-radius:6px;padding:3px 10px;color:#1A1A2E;font-size:.66rem;font-weight:700;cursor:pointer;font-family:inherit;width:100%">Comprar</button>':'<div style="font-size:.6rem;color:var(--text3)">Sin coins</div>'))+
    '</div>';
  });
  box.innerHTML=h+"</div>";
}

function hook(){
  if(!inyectar())return false;
  var orig=window.renderFullShop;
  if(typeof orig==="function"&&!orig.__v33){
    var nu=function(){var r;try{r=orig.apply(this,arguments);}catch(e){console.warn("shop:",e);}try{unificar();}catch(e){console.warn(e);}try{renderTemporada();}catch(e){console.warn(e);}return r;};
    nu.__v33=1;window.renderFullShop=nu;
  }
  var ot=window.showTienda;
  if(typeof ot==="function"&&!ot.__v33){
    var nt=function(){var r;try{r=ot.apply(this,arguments);}catch(e){console.warn("showTienda:",e);}setTimeout(function(){try{unificar();}catch(e){console.warn(e);}try{renderTemporada();}catch(e){console.warn(e);}},120);return r;};
    nt.__v33=1;window.showTienda=nt;
  }
  return true;
}
var tries=0,iv=setInterval(function(){tries++;if(hook()||tries>60)clearInterval(iv);},400);
setTimeout(hook,1200);
window.cxShopUnificar=function(){unificar();renderTemporada();};
})();


/* ===== CognitExAc v33 · PARTE 4: Sesión 25 min + personaje favorito ===== */
(function(){
function $(i){return document.getElementById(i);}
function u4(){return (window.CU&&CU.id)||"";}

/* ---- Personaje favorito ---- */
var CHARS=[["excelencia","Excelencia","🦉"],["coco","Coco","🧠"],["laProfe","La Profe","👩‍🏫"],["chispa","Chispa","⚡"],["vale","Vale","🌟"],["donRaro","Don Raro","🎩"]];
window.cxGetFav=function(){try{return localStorage.getItem("cx_favchar_"+u4())||"";}catch(e){return "";}};
window.cxSetFav=function(k){try{localStorage.setItem("cx_favchar_"+u4(),k);}catch(e){}
  try{window.notify&&notify("⭐ Personaje favorito actualizado","#10B981");}catch(e){}
  pintarFav();};
function pintarFav(){
  var box=$("cxFavBox");if(!box)return;
  var f=window.cxGetFav()||"excelencia";
  box.innerHTML='<div style="font-weight:800;font-size:.78rem;color:var(--gold);margin-bottom:6px">⭐ Personaje favorito</div>'+
  '<div style="font-size:.68rem;color:var(--text2);margin-bottom:8px">El que elijas aparecerá más seguido en consejos, ánimos, chistes y avisos de racha.</div>'+
  '<div style="display:flex;flex-wrap:wrap;gap:6px">'+CHARS.map(function(c){
    var on=c[0]===f;
    return '<button onclick="cxSetFav(\''+c[0]+'\')" style="flex:1 1 30%;min-width:96px;padding:8px 6px;border-radius:10px;cursor:pointer;font-family:inherit;font-weight:800;font-size:.7rem;border:1.5px solid '+(on?"var(--gold)":"var(--border)")+';background:'+(on?"rgba(212,175,55,.16)":"var(--card)")+';color:var(--text)">'+c[2]+' '+c[1]+(on?" ✓":"")+'</button>';
  }).join("")+'</div>';
}
function montarFav(){
  if($("cxFavBox"))return;
  var ref0=$("cxFestBanner");
  var inner=(ref0&&ref0.parentElement)||document.querySelector("#sc-dash .sec-inner")||$("sc-dash");
  if(!inner)return;
  var box=document.createElement("div");box.id="cxFavBox";
  box.style.cssText="background:var(--bg2);border:1px solid var(--border);border-radius:14px;padding:12px;margin:12px 0";
  var ref=$("cxFestBanner");
  if(ref&&ref.nextSibling)inner.insertBefore(box,ref.nextSibling);else inner.appendChild(box);
  pintarFav();
}
setInterval(function(){if(window.CU)montarFav();},1500);

/* ---- Expiración de sesión: 25 minutos de inactividad ---- */
var LIM=25*60*1000,K="cx_lastact_v25";
function touch(){try{localStorage.setItem(K,String(Date.now()));}catch(e){}}
["click","keydown","touchstart","mousemove","scroll"].forEach(function(ev){
  document.addEventListener(ev,function(){if(window.CU)touch();},{passive:true});
});
function expirar(){
  try{localStorage.removeItem("cx_sess_v31");}catch(e){}
  try{localStorage.removeItem(K);}catch(e){}
  try{window.doLogout&&doLogout();}catch(e){}
  var d=document.createElement("div");
  d.style.cssText="position:fixed;left:50%;top:16px;transform:translateX(-50%);z-index:99999;background:#1A1A2E;color:#fff;border:1px solid #D4AF37;border-radius:12px;padding:12px 16px;font-size:.82rem;max-width:90vw;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,.5)";
  d.textContent="⌛ Tu sesión expiró por 25 minutos de inactividad. Vuelve a entrar.";
  document.body.appendChild(d);
  setTimeout(function(){d.remove();},8000);
}
setInterval(function(){
  if(!window.CU)return;
  var t=parseInt(localStorage.getItem(K)||"0",10);
  if(!t){touch();return;}
  if(Date.now()-t>LIM)expirar();
},15000);
touch();
window.cxForzarExpiracion=expirar;
})();

