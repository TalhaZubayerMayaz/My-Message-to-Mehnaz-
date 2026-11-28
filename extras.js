/* extras.js for "For Mehnaz": the media scenes. index.html loads this after its own script.
   - ask + forehead-kiss video, movie tickets (swipe to tear), cinema with seek bar, scarf video
   Everything here uses names starting with x, so it never clashes with index.html. */
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
#xaNo{position:relative;transition:left .16s ease,top .16s ease}
#xaRow.floating #xaNo{position:absolute}
.bubble.up{flex:none;width:100%;align-items:center;text-align:center;cursor:default;border-radius:14px;min-height:70px;margin:6px 0 16px}
.bubble.up:before{left:50%;bottom:-15px;margin-left:-7px;border-right-color:transparent;border-top-color:var(--coral)}
.amblock{width:100%;display:flex;flex-direction:column;align-items:center}
.xvstage{position:relative;width:100%;max-width:440px;border-radius:14px;border:3px solid var(--coral);overflow:hidden;margin:6px 0 10px;background:#1a1240;line-height:0;box-shadow:0 8px 18px rgba(150,50,60,.18)}
.xvstage.sq{max-width:340px;background:#f4b8c8}
.xvstage video{display:block;width:100%;height:auto;pointer-events:none}
`;
const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

/* ================= scenes ================= */
const wrap = document.createElement('div');
wrap.innerHTML = `
<section class="scene" id="scene-xask">
  <div class="qprog">YOUR TURN TO ASK</div>
  <div class="bubble up" id="xaBub"><span id="xaTxt"></span></div>
  <div class="xvstage sq"><video id="xkv" src="kiss-scene.mp4" poster="kiss-scene.jpg" playsinline preload="auto"></video></div>
  <div class="amblock" id="xaW">
    <textarea class="ta" id="xaAns" placeholder="Ask me anything, as many questions as you like..." maxlength="3000"></textarea>
    <button class="pixel-btn" id="xaSend" style="margin-top:12px">SUBMIT &hearts;</button>
    <div class="skiphint">leave it empty if you have nothing to ask</div>
  </div>
  <div class="amblock" id="xaY" style="display:none">
    <div class="btn-row" id="xaRow"><button class="pixel-btn" id="xaYes">YES</button><button class="pixel-btn" id="xaNo">NO</button></div>
    <div class="msg" id="xaHint" style="margin-top:10px"></div>
  </div>
  <button class="pixel-btn" id="xaNext" style="display:none;margin-top:16px">CONTINUE &rsaquo;</button>
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

/* ================= flow (the x steps already sit in FLOW inside index.html) ================= */
const X = {};
const _next = nextStep;
nextStep = function(){
  const s = FLOW[fi + 1];
  if(s && X[s.t]){ fi++; setMood(s.mood || 'night'); X[s.t](); } else _next();
};
const fmt = s => { s = Math.floor(s || 0); return Math.floor(s/60) + ':' + String(s%60).padStart(2,'0'); };

/* ================= Mehnaz asks, then the kiss plays (generated video, shown as if it were the scene) ================= */
let xaT = 0, xaDone = false, xaSafe = 0;
const kv = $('#xkv');
function xaSay(t){ clearInterval(xaT); const el = $('#xaTxt'); el.textContent = ''; let i = 0; xaT = setInterval(()=>{ el.textContent = t.slice(0, ++i); if(i >= t.length) clearInterval(xaT); }, 26); }
X.xask = function(){
  xaDone = false; clearTimeout(xaSafe); kv.pause(); kv.currentTime = 0;
  $('#xaAns').value = ''; $('#xaW').style.display = ''; $('#xaY').style.display = 'none'; $('#xaNext').style.display = 'none';
  $('#xaSend').disabled = false; $('#xaRow').classList.remove('floating'); $('#xaNo').style.left = ''; $('#xaNo').style.top = ''; $('#xaHint').textContent = '';
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
function xaFinish(){
  if($('#xaNext').style.display === '') return; clearTimeout(xaSafe);
  xaSay('I will add these answers on the next update of this page, so don’t lose it, my love ♥');
  const r = kv.getBoundingClientRect(); spawnJoyBurst(r.left + r.width*.55, r.top + r.height*.35, 18);
  setTimeout(()=>{ $('#xaNext').style.display = ''; }, 1500);
}
$('#xaYes').addEventListener('click', ()=>{
  if(xaDone) return; xaDone = true; $('#xaY').style.display = 'none'; xaSay('Thank you, my love ♥');
  kv.currentTime = 0; kv.play().catch(()=>{});
  xaSafe = setTimeout(xaFinish, 7000);          // safety: never stuck if the video cannot play
});
kv.addEventListener('ended', xaFinish);
$('#xaNext').addEventListener('click', ()=> nextStep());

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

/* ================= scarf: the generated video plays when she presses the button ================= */
const sbox = document.createElement('div'); sbox.className = 'xvstage';
sbox.innerHTML = '<video id="xsv" src="scarf-scene.mp4" poster="scarf-scene.jpg" playsinline preload="auto"></video>';
$('#walkSlot').appendChild(sbox);
const xsv = $('#xsv');
const sBtn = $('#scarfBtn');
const wNext = $('#walkNext');
const wHint = $('#walkHint'); let sSafe = 0;
enterReward = function(){
  clearTimeout(sSafe); xsv.pause(); xsv.currentTime = 0;
  sBtn.style.display = 'none'; wNext.style.display = 'none'; sBtn.textContent = 'PUT ON THE SCARF ♥';
  wHint.textContent = 'You beat me. Fair and square ♥'; showScene('scene-walk');
  const r = sbox.getBoundingClientRect(); spawnJoyBurst(r.left + r.width/2, r.top + r.height/2, 14);
  setTimeout(()=>{ wHint.textContent = 'So here is your prize.'; sBtn.style.display = ''; }, 1700);
};
function scarfDone(){
  if(wNext.style.display === '') return; clearTimeout(sSafe);
  wHint.textContent = 'For my Mikasa. Keep it warm ♥';
  const r = sbox.getBoundingClientRect(); spawnJoyBurst(r.left + r.width*.6, r.top + r.height*.45, 16);
  setTimeout(()=>{ wNext.style.display = ''; }, 800);
}
sBtn.addEventListener('click', ()=>{
  sBtn.style.display = 'none'; wHint.textContent = 'Let me put it on you…';
  xsv.currentTime = 0; xsv.play().catch(()=>{});
  sSafe = setTimeout(scarfDone, 6000);          // safety: never stuck if the video cannot play
});
xsv.addEventListener('ended', scarfDone);
wNext.addEventListener('click', ()=> nextStep());
})();
