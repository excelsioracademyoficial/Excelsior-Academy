/* CognitExAc v41 — Fase 1: palomita / X grande + sonido en todas las calificaciones */
(function(){
  "use strict";
  var ctx=null,last=0;
  function soundAllowed(){
    try{ if(localStorage.getItem("cx_sound")==="off") return false; }catch(e){}
    if(window.CU && CU.soundOff) return false;
    return true;
  }
  function ac(){
    var C=window.AudioContext||window.webkitAudioContext; if(!C) return null;
    if(!ctx){ try{ ctx=(typeof getAudioCtx==="function"&&getAudioCtx())||new C(); }catch(e){ return null; } }
    if(ctx.state==="suspended") ctx.resume().catch(function(){});
    return ctx;
  }
  function tone(c,f,t0,dur,type,vol){
    var o=c.createOscillator(),g=c.createGain();
    o.type=type; o.frequency.setValueAtTime(f[0],t0);
    if(f[1]) o.frequency.exponentialRampToValueAtTime(f[1],t0+dur);
    g.gain.setValueAtTime(0.0001,t0);
    g.gain.exponentialRampToValueAtTime(vol,t0+0.015);
    g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
    o.connect(g); g.connect(c.destination); o.start(t0); o.stop(t0+dur+0.02);
  }
  function beep(ok){
    if(!soundAllowed()) return;
    var c=ac(); if(!c) return; var n=c.currentTime;
    if(ok){ tone(c,[880],n,0.09,"sine",0.22); tone(c,[1318.5],n+0.08,0.16,"sine",0.22); }
    else { tone(c,[220,140],n,0.28,"square",0.09); tone(c,[180,110],n+0.05,0.26,"sawtooth",0.05); }
  }
  function anchor(sel){
    for(var i=0;i<sel.length;i++){
      var el=document.querySelector(sel[i]);
      if(el && el.offsetParent!==null){ var r=el.getBoundingClientRect(); if(r.width) return r; }
    }
    return null;
  }
  function mark(ok,sel){
    var r=anchor(sel||["#qText","#qCard",".exam-q","#battleWrap2"]);
    var d=document.createElement("div");
    d.className="cx-mark "+(ok?"cx-mark-ok":"cx-mark-bad");
    d.setAttribute("aria-hidden","true");
    d.textContent=ok?"✔":"✖";
    if(r){ d.style.left=(r.left+r.width/2)+"px"; d.style.top=(r.top+Math.min(r.height/2,120))+"px"; }
    else { d.style.left="50%"; d.style.top="35%"; }
    document.body.appendChild(d);
    setTimeout(function(){ d.parentNode&&d.parentNode.removeChild(d); },750);
  }
  function feedback(ok,sel){
    var now=Date.now(); if(now-last<120) return; last=now; /* evita doble disparo */
    ok=!!ok; mark(ok,sel); beep(ok);
  }
  window.cxAnswerFeedback=feedback;

  function wrap(name,fn){
    var orig=window[name]; if(typeof orig!=="function"||orig.__cxfb) return;
    var w=function(){ try{ fn.apply(this,arguments); }catch(e){} return orig.apply(this,arguments); };
    w.__cxfb=true; window[name]=w;
  }
  /* Juegos normales y pregunta final del Laboratorio (ambos califican aquí) */
  wrap("doRec",function(ok){
    var tg=document.getElementById("qTag"),lab=!!(tg&&/^Experimento/.test(tg.textContent||""));
    feedback(ok, lab?["#qText","#qCard","#expCard"]:null);
  });
  /* Examen General */
  wrap("answerExam",function(i){
    var a=window._examState; if(!a||!a.qs||!a.qs[a.idx]) return;
    var correct=a.curShuffled?a.curShuffled.idx:a.qs[a.idx].a;
    feedback(i===correct,[".exam-q","#examWrap",".exam-opt"]);
  });
  /* Batallas 1vs1 */
  wrap("battleAns2",function(btn){
    try{ var q=_activeBattle2.qs[_bIdx2]; feedback(chkAns(btn.dataset.opt,q.ans),["#battleWrap2"]); }catch(e){}
  });

  var css=document.createElement("style");
  css.textContent=".cx-mark{position:fixed;z-index:5000;transform:translate(-50%,-50%) scale(.3);font-size:6.5rem;font-weight:900;line-height:1;pointer-events:none;animation:cxMark .75s cubic-bezier(.2,1.4,.4,1) forwards}"+
  ".cx-mark-ok{color:#22c55e;text-shadow:0 0 28px rgba(34,197,94,.7),0 6px 18px rgba(0,0,0,.45)}"+
  ".cx-mark-bad{color:#ef4444;text-shadow:0 0 28px rgba(239,68,68,.7),0 6px 18px rgba(0,0,0,.45)}"+
  "@keyframes cxMark{0%{opacity:0;transform:translate(-50%,-50%) scale(.3)}25%{opacity:1;transform:translate(-50%,-50%) scale(1.1)}70%{opacity:1;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-50%) scale(.9)}}"+
  "@media (prefers-reduced-motion:reduce){.cx-mark{animation-duration:.01s;opacity:1}}";
  document.head.appendChild(css);
})();
