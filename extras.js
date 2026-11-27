/* extras.js for "For Mehnaz": movie tickets, realistic cinema, forehead kiss, scarf, badminton.
   Self-contained: it injects its own CSS and scenes (all names start with x), so it works whatever earlier patches you pasted. */
(function(){
'use strict';
const $ = (s, r)=> (r || document).querySelector(s);
const host = document.getElementById('content');
if(!host || typeof FLOW === 'undefined'){ console.error('extras.js: main page not found'); return; }

/* ================= CSS ================= */
const css = `
.xt{width:100%;max-width:290px;margin:8px 0;position:relative}
.xt .a{background:#fff8f4;border:3px solid var(--coral);border-bottom:0;border-radius:10px 10px 0 0;padding:12px 14px;text-align:left;color:var(--ink)}
.xt .a b{font-size:11px;letter-spacing:3px;color:var(--red)}
.xt .a .t{font-family:'Great Vibes',cursive;font-size:36px;line-height:1.1}
.xt .a .r{font-size:12px;color:#b5716f}
.xt .s{background:#fff8f4;border:3px solid var(--coral);border-top:3px dashed var(--coral);border-radius:0 0 10px 10px;padding:12px 14px;font-size:11px;letter-spacing:2px;color:#b5716f;display:flex;justify-content:space-between;touch-action:none;cursor:grab;user-select:none;-webkit-user-select:none;transform-origin:0 0;transition:transform .6s,opacity .6s}
.xt.torn .s{transform:translate(30px,80px) rotate(18deg);opacity:0;pointer-events:none}
.xhall{position:relative;width:100%;aspect-ratio:360/340;border-radius:12px;overflow:hidden;border:3px solid #4a0d16;background:#050102;--xg:rgba(190,205,230,.45);--xg2:rgba(190,205,230,.2)}
.xhall canvas.xl{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.xscr{position:absolute;left:14%;top:5.5%;width:72%;height:43%;overflow:hidden;border-radius:3px/6px;display:flex;align-items:center;justify-content:center;background:linear-gradient(#f4f7fb,#cdd6e4);box-shadow:0 0 0 5px #0a0204,0 0 70px 16px var(--xg);transform:perspective(800px) rotateX(1.5deg)}
.xscr.on{background:#000}
.xscr video{width:100%;height:100%;object-fit:contain;display:none;cursor:pointer;background:#000}
.xscr.on video{display:block}
.xscr:after{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 50%,transparent 58%,rgba(0,0,0,.5)),linear-gradient(118deg,rgba(255,255,255,.09),transparent 32%)}
#xplay{position:absolute;margin:0;z-index:3}
.xglow{position:absolute;inset:0;pointer-events:none;mix-blend-mode:screen;background:radial-gradient(ellipse 85% 70% at 50% 28%,var(--xg2),transparent 72%)}
.xseek{display:none;width:100%;align-items:center;gap:8px;margin-top:10px;font-size:12px;color:#93504f}
.xseek.show{display:flex}.xseek input{flex:1;accent-color:var(--red)}.xseek input:disabled{opacity:.55}
.xpair{display:flex;justify-content:center;gap:10px;margin:8px 0 14px}
.xpair canvas{width:116px;height:116px;image-rendering:pixelated;filter:drop-shadow(0 6px 10px rgba(0,0,0,.2));animation:idle-bob 2.5s ease-in-out infinite}
#xaNo{position:relative;transition:left .16s ease,top .16s ease}
#xaRow.floating #xaNo{position:absolute}
.xk{position:relative;width:100%;max-width:320px;height:310px;border-radius:14px;border:3px solid var(--coral);overflow:hidden;background:linear-gradient(#eaf7e3,#bfe3dc 50%,#86aecb)}
.xkc{position:absolute;inset:0}
.xkp{position:absolute;image-rendering:pixelated;transition:transform 2.4s ease-in-out;filter:drop-shadow(0 6px 8px rgba(0,0,0,.25))}
#xkE{width:170px;height:170px;left:6px;bottom:-10px;z-index:1;transition:transform 2.6s ease-in-out}
#xkM{width:130px;height:130px;right:20px;bottom:-6px;z-index:2;transform-origin:50% 100%;transition:transform 2.6s ease-in-out}
.xsn i{position:absolute;top:-12px;border-radius:50%;background:#fff;animation:xsn linear infinite}
@keyframes xsn{to{transform:translate(18px,350px)}}
#xkH{position:absolute;left:calc(50% - 17px);top:26%;font-size:34px;color:#e23b4e;transform:scale(0);opacity:0;z-index:6}
#xkH.show{animation:xpop .8s cubic-bezier(.2,1.6,.4,1) forwards,heartbeat 1.4s ease-in-out .8s infinite}
@keyframes xpop{to{transform:scale(1);opacity:1}}
#xkF{position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none;z-index:7}
#xkF.go{animation:xfl 1.2s ease-out}
@keyframes xfl{0%{opacity:.7}100%{opacity:0}}
`;
const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

/* ================= scenes ================= */
const wrap = document.createElement('div');
wrap.innerHTML = `
<section class="scene" id="scene-xask">
  <div class="qprog">YOUR TURN TO ASK</div>
  <div class="bubble up" id="xaBub"><span id="xaTxt"></span></div>
  <div class="xpair"><canvas id="xaE" width="16" height="16"></canvas><canvas id="xaM" width="16" height="16"></canvas></div>
  <div class="amblock" id="xaW">
    <textarea class="ta" id="xaAns" placeholder="Ask me anything, as many questions as you like..." maxlength="3000"></textarea>
    <button class="pixel-btn" id="xaSend" style="margin-top:12px">SUBMIT &hearts;</button>
    <div class="skiphint">leave it empty if you have nothing to ask</div>
  </div>
  <div class="amblock" id="xaY" style="display:none">
    <div class="btn-row" id="xaRow"><button class="pixel-btn" id="xaYes">YES</button><button class="pixel-btn" id="xaNo">NO</button></div>
    <div class="msg" id="xaHint" style="margin-top:10px"></div>
  </div>
</section>
<section class="scene" id="scene-xkiss">
  <div class="qprog">A KISS ON THE FOREHEAD</div>
  <div class="xk"><div class="xkc" id="xkC"><div class="xsn" id="xkS"></div>
    <canvas id="xkM" class="xkp" width="16" height="16"></canvas><canvas id="xkE" class="xkp" width="16" height="16"></canvas>
    <span id="xkH">&hearts;</span></div><div id="xkF"></div></div>
  <div class="msg" id="xkMsg" style="margin-top:12px;min-height:48px"></div>
  <button class="pixel-btn" id="xkNext" style="display:none;margin-top:12px">CONTINUE &rsaquo;</button>
</section>
<section class="scene" id="scene-xticket">
  <div class="qprog">TWO TICKETS TO A MOVIE</div>
  <div class="xt"><div class="a"><b>CINEMA &middot; ADMIT ONE</b><div class="t">Another Love</div><div class="r">Eren &amp; Mikasa &middot; ROW H &middot; SEAT 7</div></div><div class="s"><span>MEHNAZ</span><span>&#9986; SWIPE TO TEAR &rarr;</span></div></div>
  <div class="xt"><div class="a"><b>CINEMA &middot; ADMIT ONE</b><div class="t">Another Love</div><div class="r">Eren &amp; Mikasa &middot; ROW H &middot; SEAT 8</div></div><div class="s"><span>EREN</span><span>&#9986; SWIPE TO TEAR &rarr;</span></div></div>
  <div class="msg" id="xtHint" style="margin-top:6px">Drag along the dotted line to tear each ticket</div>
  <button class="pixel-btn" id="xtGo" style="display:none;margin-top:14px">ENTER THE CINEMA &hearts;</button>
</section>
<section class="scene" id="scene-xcinema">
  <div class="xhall" id="xhall">
    <canvas class="xl" id="xcb"></canvas>
    <div class="xscr" id="xscr"><video id="xvid" src="another-love.mp4" playsinline preload="metadata"></video><button class="pixel-btn" id="xplay">&#9654; PLAY</button></div>
    <canvas class="xl" id="xcf"></canvas>
    <div class="xglow"></div>
  </div>
  <div class="xseek" id="xseekrow"><span id="xt0">0:00</span><input type="range" id="xseek" min="0" max="1000" value="0" disabled><span id="xt1">0:00</span></div>
  <div class="msg" id="xhint" style="margin-top:8px">Just us, in the dark &hearts;</div>
  <button class="pixel-btn" id="xreplay" style="display:none;margin-top:12px">&#8635; WATCH AGAIN</button>
  <button class="pixel-btn" id="xnext" style="display:none;margin-top:12px">CONTINUE &rsaquo;</button>
</section>`;
while(wrap.firstChild) host.appendChild(wrap.firstChild);

/* ================= flow ================= */
const OLD = ['mticket','cinema','askme','xask','xticket','xcinema'];
const askAt = Math.max(0, FLOW.findIndex(s=> s.t === 'askme' || s.t === 'xask'));
for(let k = FLOW.length - 1; k >= 0; k--) if(OLD.includes(FLOW[k].t)) FLOW.splice(k, 1);
FLOW.splice(Math.min(askAt, FLOW.length), 0, {t:'xask', mood:'night'});
const tAt = FLOW.findIndex(s=> s.t === 'ticket');
FLOW.splice(tAt < 0 ? FLOW.length : tAt, 0, {t:'xticket', mood:'candle'}, {t:'xcinema', mood:'night'});

const X = {};
const _next = nextStep;
nextStep = function(){
  const s = FLOW[fi + 1];
  if(s && X[s.t]){ fi++; setMood(s.mood || 'night'); X[s.t](); } else _next();
};
const fmt = s => { s = Math.floor(s || 0); return Math.floor(s/60) + ':' + String(s%60).padStart(2,'0'); };

/* ================= Mehnaz asks, then the forehead kiss ================= */
let xaT = 0, xaDone = false;
function xaSay(t){ clearInterval(xaT); const el = $('#xaTxt'); el.textContent = ''; let i = 0; xaT = setInterval(()=>{ el.textContent = t.slice(0, ++i); if(i >= t.length) clearInterval(xaT); }, 26); }
X.xask = function(){
  xaDone = false; $('#xaAns').value = ''; $('#xaW').style.display = ''; $('#xaY').style.display = 'none';
  $('#xaSend').disabled = false; $('#xaRow').classList.remove('floating'); $('#xaNo').style.left = ''; $('#xaNo').style.top = ''; $('#xaHint').textContent = '';
  drawCat($('#xaE'), catNormal); drawGrid($('#xaM'), MEH_N, PM);
  showScene('scene-xask'); xaSay('Now you ask me. Anything you want.');
};
$('#xaSend').addEventListener('click', ()=>{
  const t = $('#xaAns').value.trim();
  if(!t){ nextStep(); return; }
  $('#xaSend').disabled = true; queueSend(`[Mehnaz's questions for me]\n${t}`);
  $('#xaW').style.display = 'none'; $('#xaY').style.display = '';
  xaSay('I will answer these questions if you permit me to give a kiss on your forehead');
});
function xaDodge(){
  const row = $('#xaRow'), no = $('#xaNo'); row.classList.add('floating');
  no.style.left = (Math.random() * Math.max(row.getBoundingClientRect().width - no.getBoundingClientRect().width, 40)) + 'px';
  no.style.top = (Math.random() * 90 - 20) + 'px'; $('#xaHint').textContent = 'Hehe, you cannot say no ♥';
}
$('#xaNo').addEventListener('mouseenter', xaDodge);
$('#xaNo').addEventListener('click', e=>{ e.preventDefault(); xaDodge(); });
$('#xaNo').addEventListener('touchstart', e=>{ e.preventDefault(); xaDodge(); }, {passive:false});
$('#xaYes').addEventListener('click', ()=>{ if(xaDone) return; xaDone = true; kiss(); });

(function(){ const s = $('#xkS');
  for(let i = 0; i < 26; i++){ const d = document.createElement('i'), z = 3 + Math.random()*6;
    d.style.cssText = `left:${Math.random()*100}%;width:${z}px;height:${z}px;animation-duration:${4+Math.random()*5}s;animation-delay:${-Math.random()*8}s;opacity:${.4+Math.random()*.5}`; s.appendChild(d); } })();
let kT = [];
function kiss(){
  kT.forEach(clearTimeout); kT = [];
  const E = $('#xkE'), M = $('#xkM'), H = $('#xkH');
  drawCat(E, catBlush); drawGrid(M, MEH_H, PM);
  E.style.transition = 'none'; M.style.transition = 'none'; E.style.transform = ''; M.style.transform = '';
  E.style.transformOrigin = '50% 59.4%';
  H.classList.remove('show'); $('#xkF').classList.remove('go');
  $('#xkMsg').textContent = ''; $('#xkNext').style.display = 'none';
  showScene('scene-xkiss');
  void E.offsetWidth; E.style.transition = ''; M.style.transition = '';
  // his mouth now vs the top of her forehead (layout px, not affected by transforms)
  const mx = E.offsetLeft + .5*E.offsetWidth, my = E.offsetTop + .594*E.offsetHeight;
  const fx = M.offsetLeft + .5*M.offsetWidth - 4, fy = M.offsetTop + .075*M.offsetHeight;
  H.style.left = (fx + 70) + 'px'; H.style.top = (fy - 52) + 'px';
  const at = (f, ms)=> kT.push(setTimeout(f, ms));
  at(()=>{ M.style.transform = 'rotate(-3deg)'; }, 600);
  at(()=>{ E.style.transform = `translate(${fx - mx}px, ${fy - my}px) rotate(20deg)`; }, 1200);
  at(()=>{ H.classList.add('show'); $('#xkF').classList.add('go'); const r = H.getBoundingClientRect(); spawnJoyBurst(r.left + r.width/2, r.top + r.height/2, 18); }, 4000);
  at(()=>{ $('#xkMsg').textContent = 'I will add these answers on the next update of this page, so don’t lose it, my love ♥'; }, 5000);
  at(()=>{ $('#xkNext').style.display = ''; }, 6400);
}
$('#xkNext').addEventListener('click', ()=> nextStep());

/* ================= movie tickets: swipe to tear ================= */
let torn = 0;
X.xticket = function(){
  torn = 0; document.querySelectorAll('#scene-xticket .xt').forEach(t=> t.classList.remove('torn'));
  $('#xtGo').style.display = 'none'; $('#xtHint').textContent = 'Drag along the dotted line to tear each ticket';
  showScene('scene-xticket');
};
document.querySelectorAll('#scene-xticket .xt').forEach(t=>{
  const s = t.querySelector('.s'); let x0 = null;
  s.addEventListener('pointerdown', e=>{ if(t.classList.contains('torn')) return; x0 = e.clientX; s.setPointerCapture(e.pointerId); s.style.transition = 'none'; });
  s.addEventListener('pointermove', e=>{
    if(x0 === null) return;
    const p = Math.max(0, Math.min(1, (e.clientX - x0) / (s.offsetWidth * .8)));
    s.style.transform = `rotate(${p*7}deg)`;
    if(p >= 1){ x0 = null; s.style.transition = ''; s.style.transform = ''; t.classList.add('torn');
      const r = t.getBoundingClientRect(); spawnJoyBurst(r.left + r.width/2, r.bottom - 20, 8);
      if(++torn >= 2){ $('#xtGo').style.display = ''; $('#xtHint').textContent = 'Both torn ♥ our seats are waiting'; } }
  });
  const rel = ()=>{ if(x0 === null) return; x0 = null; s.style.transition = ''; s.style.transform = ''; };
  s.addEventListener('pointerup', rel); s.addEventListener('pointercancel', rel);
});
$('#xtGo').addEventListener('click', ()=> nextStep());

/* ================= cinema ================= */
const BE = ["...HHHHHH...","..HHHHHHHH..",".HHHHHHHHHH.",".HHHHHHHHHH.",".HHHHHHHHHH.",".HHHHHHHHHH.","..HHHHHHHH..","...SSSSSS...",".JJJJSSJJJJ.","JJJJJJJJJJJJ","JJJJJJJJJJJJ"];
const BM = ["...HHHHHH...","..HHHHHHHH..",".HHHHHHHHHH.",".HHHHHHHHHH.",".HHHHHHHHHH.",".HHHHHHHHHH.",".HHHHHHHHHH.",".hHHHHHHHHh.","..ZZZZZZZZ..","nnnnnnnnnnnn","nnnnnnnnnnnn"];
function drawHall(){
  const W = 360, H = 340;
  const mk = cv => { cv.width = W*2; cv.height = H*2; const c = cv.getContext('2d'); c.setTransform(2,0,0,2,0,0); c.imageSmoothingEnabled = false; return c; };
  const b = mk($('#xcb')), f = mk($('#xcf'));
  const spr = (grid, pal)=>{ const cv = document.createElement('canvas'); drawGrid(cv, grid, pal); return cv; };
  const sE = spr(BE, {H:'#3b2418', S:'#fbd9c3', J:'#a8702f'}), sM = spr(BM, {H:'#a8d8ff', h:'#6aaef0', Z:'#8e1b2b', n:'#1f3f9a'});
  let g = b.createLinearGradient(0,0,0,H); g.addColorStop(0,'#1b0509'); g.addColorStop(1,'#050102'); b.fillStyle = g; b.fillRect(0,0,W,H);
  [[0,1],[W-30,-1]].forEach(([x,d])=>{
    const cg = b.createLinearGradient(x,0,x+30,0); cg.addColorStop(d>0?0:1,'#6a0f1e'); cg.addColorStop(d>0?1:0,'#1f0409');
    b.fillStyle = cg; b.fillRect(x,0,30,H); b.fillStyle = 'rgba(0,0,0,.4)'; for(let i=3;i<30;i+=6) b.fillRect(x+i,0,2,H);
    b.fillStyle = 'rgba(255,120,130,.08)'; for(let i=5;i<30;i+=6) b.fillRect(x+i,0,1,H);
  });
  g = b.createLinearGradient(0,0,0,14); g.addColorStop(0,'#7a1020'); g.addColorStop(1,'#2a0610'); b.fillStyle = g; b.fillRect(0,0,W,14);
  [[40,120],[W-40,120],[40,200],[W-40,200]].forEach(([x,y])=>{
    const sg = b.createRadialGradient(x,y,0,x,y,26); sg.addColorStop(0,'rgba(255,190,110,.55)'); sg.addColorStop(1,'rgba(255,190,110,0)');
    b.fillStyle = sg; b.fillRect(x-26,y-26,52,52); b.fillStyle = '#ffd9a0'; b.fillRect(x-1,y-3,3,6);
  });
  let seed = 11; const rnd = ()=> (seed = (seed*16807) % 2147483647) / 2147483647;
  [[182,.5],[198,.62],[220,.78],[248,.98],[284,1.22],[330,1.5]].forEach(([y,s],r)=>{
    if(r === 5){ const sp = f.createRadialGradient(W/2,170,10,W/2,230,240); sp.addColorStop(0,'rgba(215,225,255,.20)'); sp.addColorStop(1,'rgba(215,225,255,0)'); f.fillStyle = sp; f.fillRect(0,170,W,H-170); }
    const sw = 30*s, sh = 26*s, pitch = 36*s, m = Math.ceil(W/2/pitch) + 1, k0 = .42 + r*.11;
    for(let k = -m-1; k <= m; k++){
      const cx = W/2 + (k+.5)*pitch, top = y - sh, ours = r === 4 && (k === -1 || k === 0);
      if(r < 5 && !ours && rnd() < (r === 4 ? .3 : .5)){
        f.fillStyle = '#0c0206'; f.beginPath(); f.ellipse(cx, top + 3*s, 11*s, 7*s, 0, 0, 7); f.fill();
        f.beginPath(); f.ellipse(cx, top - 2*s, 6*s, 7.5*s, 0, 0, 7); f.fill();
        f.strokeStyle = 'rgba(190,210,255,.45)'; f.lineWidth = 1; f.beginPath(); f.ellipse(cx, top - 2*s, 6*s, 7.5*s, 0, Math.PI*1.1, Math.PI*1.9); f.stroke();
      }
      if(ours){
        f.save(); f.translate(cx, top + 8); f.rotate(k === -1 ? .05 : -.05);
        f.shadowColor = 'rgba(170,200,255,.9)'; f.shadowBlur = 7; f.drawImage(k === -1 ? sE : sM, -18, -33, 36, 33); f.restore();
      }
      const sg = f.createLinearGradient(0,top,0,y);
      sg.addColorStop(0,`rgb(${170*k0|0},${26*k0|0},${44*k0|0})`); sg.addColorStop(1,`rgb(${74*k0|0},${8*k0|0},${20*k0|0})`);
      f.beginPath(); f.moveTo(cx-sw/2,y); f.lineTo(cx-sw/2,top+8*s); f.quadraticCurveTo(cx-sw/2,top,cx-sw/2+8*s,top);
      f.lineTo(cx+sw/2-8*s,top); f.quadraticCurveTo(cx+sw/2,top,cx+sw/2,top+8*s); f.lineTo(cx+sw/2,y); f.closePath();
      f.fillStyle = sg; f.fill(); f.strokeStyle = 'rgba(190,210,255,.2)'; f.lineWidth = 1; f.stroke();
    }
    f.fillStyle = 'rgba(255,170,80,.85)'; f.fillRect(30,y-3*s,3,3*s); f.fillRect(W-33,y-3*s,3,3*s);
  });
  g = f.createLinearGradient(0,0,0,170); g.addColorStop(0,'rgba(200,220,255,.12)'); g.addColorStop(1,'rgba(200,220,255,0)');
  f.fillStyle = g; f.beginPath(); f.moveTo(W/2-10,0); f.lineTo(W/2+10,0); f.lineTo(W-60,170); f.lineTo(60,170); f.closePath(); f.fill();
  g = f.createRadialGradient(W/2,H*.38,H*.3,W/2,H*.38,H*.85); g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(1,'rgba(0,0,0,.72)');
  f.fillStyle = g; f.fillRect(0,0,W,H);
}
const vid = $('#xvid'), scr = $('#xscr'), hallEl = $('#xhall'), seek = $('#xseek');
let cinT = 0, seeking = false, watched = false;
X.xcinema = function(){
  drawHall(); clearTimeout(cinT); vid.pause(); vid.currentTime = 0; watched = false; seeking = false;
  scr.classList.remove('on'); $('#xplay').style.display = ''; $('#xnext').style.display = 'none'; $('#xreplay').style.display = 'none';
  seek.disabled = true; seek.value = 0; $('#xt0').textContent = '0:00'; $('#xseekrow').classList.remove('show');
  $('#xhint').innerHTML = 'Just us, in the dark &hearts;'; showScene('scene-xcinema');
};
$('#xplay').addEventListener('click', ()=>{
  scr.classList.add('on'); $('#xplay').style.display = 'none'; $('#xseekrow').classList.add('show');
  $('#xhint').innerHTML = 'Watch it till the end, my love &hearts;'; vid.play().catch(()=>{});
  cinT = setTimeout(()=>{ if(vid.currentTime < .5) $('#xnext').style.display = ''; }, 10000);   // safety if the video fails to load
});
vid.addEventListener('click', ()=>{ vid.paused ? vid.play() : vid.pause(); });
vid.addEventListener('loadedmetadata', ()=>{ $('#xt1').textContent = fmt(vid.duration); });
vid.addEventListener('timeupdate', ()=>{ if(!seeking && vid.duration) seek.value = vid.currentTime / vid.duration * 1000; $('#xt0').textContent = fmt(vid.currentTime); });
vid.addEventListener('ended', ()=>{ watched = true; seek.disabled = false; $('#xnext').style.display = ''; $('#xreplay').style.display = ''; $('#xhint').innerHTML = 'Drag the bar to watch any moment again &hearts;'; });
seek.addEventListener('input', ()=>{ if(!watched) return; seeking = true; vid.currentTime = seek.value / 1000 * vid.duration; });
seek.addEventListener('change', ()=>{ seeking = false; if(watched) vid.play().catch(()=>{}); });
$('#xreplay').addEventListener('click', ()=>{ $('#xreplay').style.display = 'none'; vid.currentTime = 0; vid.play().catch(()=>{}); });
$('#xnext').addEventListener('click', ()=>{ clearTimeout(cinT); vid.pause(); nextStep(); });
const sc4 = document.createElement('canvas'); sc4.width = sc4.height = 4; const sctx = sc4.getContext('2d', {willReadFrequently:true});
setInterval(()=>{                     // the hall takes on the colour of what is on screen
  if(vid.paused || vid.ended || !vid.videoWidth) return;
  try{ sctx.drawImage(vid, 0, 0, 4, 4); const d = sctx.getImageData(0,0,4,4).data; let r = 0, g = 0, b = 0;
    for(let i = 0; i < d.length; i += 4){ r += d[i]; g += d[i+1]; b += d[i+2]; } const n = d.length / 4;
    r = r/n|0; g = g/n|0; b = b/n|0;
    hallEl.style.setProperty('--xg', `rgba(${r},${g},${b},.6)`); hallEl.style.setProperty('--xg2', `rgba(${r},${g},${b},.3)`); }catch(e){}
}, 250);

/* ================= scarf: from Eren's hand to Mikasa's neck ================= */
const EH = ["................","....HHHHHHHH....","...HHHHHHHHHH...","..HHHHHHHHHHHH..","..HHHHHSSHHHHH..","..HHHSSSSSSHHH..","..HHSEESSEESHH..","..HHSSESSESSHH..","..HHSESSSSESHH..","..HHSPSMMSPSHH..","...HSSSSSSSSH...","....JCCCCCCJ....","...JJJCCCCJJJJJJ","..JJJBCCCCBJJJJS","..SJJBBBBBBJJ...","...TTT....TTT..."];
const sBtn = (()=>{ const o = $('#scarfBtn'), n = o.cloneNode(true); o.replaceWith(n); return n; })();
const wNext = (()=>{ const o = $('#walkNext'), n = o.cloneNode(true); o.replaceWith(n); return n; })();
const scarfEl = $('#scarf'), wHint = $('#walkHint'), stage = scarfEl.parentElement;
enterReward = function(){
  drawCat($('#erenWalk'), EH); drawGrid($('#mehWalk'), MEH_H, PM);
  scarfEl.className = ''; drawGrid(scarfEl, SCARF, PALS);
  Object.assign(scarfEl.style, {transition:'none', opacity:'1', width:'56px', height:'32px', left:'136px', top:'192px', transform:'translate(-50%,0) scale(0)'});
  sBtn.style.display = 'none'; wNext.style.display = 'none'; sBtn.textContent = 'PUT ON THE SCARF ♥';
  wHint.textContent = 'You beat me. Fair and square ♥'; showScene('scene-walk');
  const r = $('#mehWalk').getBoundingClientRect(); spawnJoyBurst(r.left + r.width/2, r.top + r.height/2, 14);
  setTimeout(()=>{ scarfEl.style.transition = 'transform .6s cubic-bezier(.2,1.5,.4,1)'; scarfEl.style.transform = 'translate(-50%,0) scale(1)';
    wHint.textContent = 'So here is your prize.'; sBtn.style.display = ''; }, 1700);
};
sBtn.addEventListener('click', ()=>{
  sBtn.style.display = 'none'; wHint.textContent = 'Let me put it on you…';
  const sw = stage.clientWidth;
  scarfEl.style.transition = 'left 1s ease, top 1s ease, transform 1s ease, opacity .5s ease';
  scarfEl.style.left = (sw - 86) + 'px'; scarfEl.style.top = '158px'; scarfEl.style.transform = 'translate(-50%,0) scale(.8)';
  setTimeout(()=>{
    scarfEl.style.opacity = '0'; drawGrid($('#mehWalk'), MEH_S, PM); drawCat($('#erenWalk'), catHappy);
    const r = $('#mehWalk').getBoundingClientRect(); spawnJoyBurst(r.left + r.width/2, r.top + r.height*.5, 16);
    wHint.textContent = 'For my Mikasa. Keep it warm ♥';
  }, 1050);
  setTimeout(()=>{ wNext.style.display = ''; }, 2700);
});
wNext.addEventListener('click', ()=> nextStep());

/* ================= badminton: faster, Eren misses once it gets too fast, never over his head ================= */
const MISS_S = 7.6;
startServe = function(){
  sx = ex; sy = EY + 18; S = 4.6; vy = S;
  { const tt = (RY - sy) / S, tgt = GW/2 + (Math.random() - .5) * 90; vx = (tgt - sx) / tt; }
  erDecided = false; gState = 'play';
};
moveShuttle = function(dt){
  sx += vx*dt; sy += vy*dt;
  if(vy > 0){
    eSw = eSw > 0 && performance.now() - eSw > SW_DUR ? -1 : eSw;
    if(sy > RY - 78 && mSw < 0) mSw = performance.now();
    if(sy >= RY-16 && sy <= RY+14 && Math.abs(sx - rx) <= 50){
      S = Math.min(11, S + 0.5); vy = -S; vx = ((sx - rx) / (RW/2)) * S * 0.75;
      const tt = (sy - EY) / S;
      let land = Math.max(40, Math.min(GW - 40, sx + vx * tt));
      if(S >= MISS_S) land = ex < GW/2 ? GW - 42 : 42;
      vx = (land - sx) / tt;
      burstAt(sx, sy); if(performance.now() - mSw > 300) mSw = performance.now() - 140;
    } else if(sy > GH + 10){ point('er'); }
  } else {
    if(sy <= EY + 60 && sy >= EY - 30 && eSw < 0) eSw = performance.now();
    if(S < MISS_S && sy <= EY + 18 && sy >= EY - 26 && Math.abs(sx - ex) <= 34){
      S = Math.min(11, S + 0.5);
      const tx = Math.max(45, Math.min(GW-45, GW/2 + (Math.random() - .5) * 140)), tt = (RY - sy) / S;
      vy = S; vx = Math.max(-S*.8, Math.min(S*.8, (tx - sx) / tt));
      burstAt(sx, sy); if(performance.now() - eSw > 300) eSw = performance.now() - 140;
    }
    if(sy < -10){ point('me'); }
  }
};
moveEren = function(dt){
  let target = GW/2;
  if(vy < 0){ const t = Math.max(0, (sy - EY) / -vy); target = sx + vx * t; }
  target = Math.max(30, Math.min(GW-30, target));
  const sp = Math.max(0.9, 2.0 - 0.1*losses) * dt;
  ex += Math.max(-sp, Math.min(sp, target - ex)); ex = Math.max(30, Math.min(GW-30, ex));
};
})();
