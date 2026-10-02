/* ================= Entrada ================= */
const ptrs=new Map(); let drag=null, pinch=null, painting=null;
function pickG(sx,sy){const [wx,wy]=s2w(sx,sy); let [gx,gy]=w2g(wx,wy); for(let k=0;k<3;k++){const x=Math.floor(gx),y=Math.floor(gy); const z=inMap(x,y)?hAt(clamp(gx,x,x+.999),clamp(gy,y,y+.999)):0; [gx,gy]=w2g(wx,wy+z);} return [gx,gy];}
function tileAt(sx,sy){const [gx,gy]=pickG(sx,sy); return [Math.floor(gx),Math.floor(gy)];}
function qAt(sx,sy){const [gx,gy]=pickG(sx,sy); return [Math.floor(gx*2),Math.floor(gy*2)];}
function curOpt(){const tl=TOOLS[mode.tool]; if(!tl)return 0; if(mode.tool==='nivelar')return painting&&painting.level!=null?painting.level:0; return tl.opt==='bridge'?OPT.bm:tl.opt==='pave'?OPT.pv:tl.opt==='fence'?OPT.fc:tl.opt==='soil'?OPT.soil:0;}
function paintAt(sx,sy){const tl=TOOLS[mode.tool]; const [x,y]=tl.q?qAt(sx,sy):tileAt(sx,sy); mode.hover=[x,y];
  if(painting&&mode.tool==='nivelar'&&painting.level==null&&inMap(x,y))painting.level=G.ht[y*N+x];
  const line=[]; if(painting&&painting.last){let [ax,ay]=painting.last; while(ax!==x||ay!==y){if(ax!==x)ax+=Math.sign(x-ax); else ay+=Math.sign(y-ay); line.push([ax,ay]);}} else line.push([x,y]);
  for(const [tx,ty] of line){if(painting&&painting.done.has(tx+','+ty))continue; if(painting)painting.done.add(tx+','+ty);
    const r=applyTool(mode.tool,tx,ty,curOpt()); if(r===''){mode.count=(mode.count||0)+1;} else if(r==='sem'){toast('Faltam moedas ou materiais');painting&&(painting.stop=1);break;}
    else if(r!=='já'&&r!=='fora'&&!(painting&&painting.warned)){toast(r); if(painting)painting.warned=1;}}
  if(painting)painting.last=[x,y]; updateToolbar();}
cv.addEventListener('contextmenu',e=>e.preventDefault());
cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId); ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY}); const r=cv.getBoundingClientRect();
  const panBtn=e.pointerType==='mouse'&&(e.button===1||e.button===2);
  if(ptrs.size===1){if(mode.t==='paint'&&!panBtn){painting={done:new Set(),last:null}; undoBegin(); paintAt(e.clientX-r.left,e.clientY-r.top); drag=null;}
    else drag={sx:e.clientX,sy:e.clientY,cx:cam.x,cy:cam.y,moved:false,pan:panBtn};}
  else if(ptrs.size===2){drag=null; if(painting)undoEnd(); painting=null; const [a,b]=[...ptrs.values()]; const mx=(a.x+b.x)/2,my=(a.y+b.y)/2;
    pinch={d0:Math.hypot(a.x-b.x,a.y-b.y)||1,z0:cam.z,anchor:s2w(mx-r.left,my-r.top)};}});
cv.addEventListener('pointermove',e=>{const r=cv.getBoundingClientRect(); if(ptrs.has(e.pointerId))ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pinch&&ptrs.size>=2){const [a,b]=[...ptrs.values()]; const d=Math.hypot(a.x-b.x,a.y-b.y); cam.z=clamp(pinch.z0*d/pinch.d0,.3,ZMAX);
    const mx=(a.x+b.x)/2-r.left,my=(a.y+b.y)/2-r.top; cam.x=pinch.anchor[0]-(mx-VW/2)/cam.z; cam.y=pinch.anchor[1]-(my-VH/2)/cam.z; clampCam(); return;}
  if(painting&&ptrs.size===1&&!painting.stop){paintAt(e.clientX-r.left,e.clientY-r.top);return;}
  if(drag){const dx=e.clientX-drag.sx,dy=e.clientY-drag.sy; if(!drag.moved&&Math.hypot(dx,dy)>8)drag.moved=true; if(drag.moved){cam.x=drag.cx-dx/cam.z;cam.y=drag.cy-dy/cam.z;clampCam();}}
  else if(e.pointerType==='mouse'){if(mode.t==='place'||mode.t==='move')setGhost(e.clientX-r.left,e.clientY-r.top); else if(mode.t==='paint')mode.hover=TOOLS[mode.tool].q?qAt(e.clientX-r.left,e.clientY-r.top):tileAt(e.clientX-r.left,e.clientY-r.top);}});
function endPtr(e){const wasDrag=drag; ptrs.delete(e.pointerId); if(ptrs.size<2)pinch=null;
  if(ptrs.size===0){if(painting){painting=null; undoEnd();} else if(wasDrag&&!wasDrag.moved&&!wasDrag.pan&&e.type==='pointerup'){const r=cv.getBoundingClientRect();tap(e.clientX-r.left,e.clientY-r.top);} drag=null;}
  else if(ptrs.size===1){const p=[...ptrs.values()][0]; drag={sx:p.x,sy:p.y,cx:cam.x,cy:cam.y,moved:true}; if(painting)undoEnd(); painting=null;}}
cv.addEventListener('pointerup',endPtr); cv.addEventListener('pointercancel',endPtr);
cv.addEventListener('wheel',e=>{e.preventDefault(); const r=cv.getBoundingClientRect(); const sx=e.clientX-r.left,sy=e.clientY-r.top; const w=s2w(sx,sy);
  cam.z=clamp(cam.z*Math.exp(-e.deltaY*.0015),.3,ZMAX); cam.x=w[0]-(sx-VW/2)/cam.z; cam.y=w[1]-(sy-VH/2)/cam.z; clampCam();},{passive:false});
window.addEventListener('keydown',e=>{if(e.target&&(e.target.tagName==='INPUT'||e.target.tagName==='SELECT'))return;
  if(e.key==='Escape'){if(!$('#modal').hidden)return; if(mode.t!=='idle')setMode({t:'idle'}); else closeSheet();}
  if((e.key==='r'||e.key==='R')&&(mode.t==='place'||mode.t==='move'))rotateGhost();});
const ZMAX=3.2;
function clampCam(){cam.z=clamp(cam.z,.3,ZMAX); cam.x=clamp(cam.x,-N*TW/2,N*TW/2+200); cam.y=clamp(cam.y,0,N*TH);}
function setGhost(sx,sy){const [gx,gy]=pickG(sx,sy); const k=mode.t==='place'?mode.k:byId(mode.i).k, t=T[k], w=mode.f?t.h:t.w,h=mode.f?t.w:t.h;
  const nx=Math.floor(gx)-Math.floor((w-1)/2), ny=Math.floor(gy)-Math.floor((h-1)/2);
  if(mode.has&&nx===mode.gx&&ny===mode.gy)return false; mode.gx=nx;mode.gy=ny;mode.has=true; if(mode.lineOn&&mode.anchor)mode.line=lineCells(k,mode.anchor[0],mode.anchor[1],nx,ny,mode.f); updatePlaceBar();return true;}
function rotateGhost(){mode.f=mode.f?0:1; updatePlaceBar();}
function hitB(sx,sy){const [wx,wy]=s2w(sx,sy); const list=S.b.slice().sort((a,b)=>(b.x+b.y+fw(b)+fh(b))-(a.x+a.y+fw(a)+fh(a)));
  for(const b of list){const t=T[b.k],w=fw(b),h=fh(b),H=t.flat?2:Math.max(10,(Date.now()<b.d?20:spriteTop('b',b.k,0))-(w+h)*8);
    const z0=G.ht[b.y*N+b.x]*HZ; const pts=[P(b.x,b.y+h,z0),P(b.x+w,b.y+h,z0),P(b.x+w,b.y,z0),P(b.x+w,b.y,z0+H),P(b.x,b.y,z0+H),P(b.x,b.y+h,z0+H)]; if(inPoly(wx,wy,pts))return b;}
  return null;}
function hitOb(sx,sy){const [wx,wy]=s2w(sx,sy),[gx,gy]=w2g(wx,wy); let best=null,bd=1e9;
  for(let y=Math.floor(gy)-1;y<=Math.floor(gy)+3;y++)for(let x=Math.floor(gx)-1;x<=Math.floor(gx)+3;x++){if(!inMap(x,y)||!G.ob[y*N+x])continue;
    const [px,py]=P(x+.5,y+.5,18+G.ht[y*N+x]*HZ); const dx=(wx-px)/18,dy=(wy-py)/24; const d=dx*dx+dy*dy; if(d<1&&(x+y)*10-d>bd*-1&&(best==null||x+y>best[0]+best[1])){best=[x,y];bd=d;}}
  return best;}
function inPoly(x,y,p){let ins=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const [xi,yi]=p[i],[xj,yj]=p[j];if(((yi>y)!==(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi))ins=!ins;}return ins;}
let obHint=false;
function tap(sx,sy){
  if(mode.t==='place'&&mode.lineOn){const moved=setGhost(sx,sy); if(!mode.anchor){mode.anchor=[mode.gx,mode.gy]; mode.line=[[mode.gx,mode.gy]]; updatePlaceBar();} else if(!moved)placeLine(); return;}
  if(mode.t==='place'||mode.t==='move'){const moved=setGhost(sx,sy); if(!moved)confirmPlace(); return;}
  if(mode.t==='paint')return;
  if(mode.t==='expand'){const [gx,gy]=tileAt(sx,sy); const cx=Math.floor(gx/CH),cy=Math.floor(gy/CH);
    if(chunkBuyable(cx,cy))askExpand(cx,cy); else if(cx>=0&&cy>=0&&cx<NC&&cy<NC&&!S.ul[cy*NC+cx])toast('Só dá para comprar áreas vizinhas à cidade'); return;}
  for(let i=bubbles.length-1;i>=0;i--){const bb=bubbles[i]; if(Math.hypot(sx-bb.x,sy-bb.y)<=bb.r){onB(bb.b);return;}}
  const b=hitB(sx,sy); if(b){onB(b);return;}
  const [tgx,tgy]=tileAt(sx,sy); if(inMap(tgx,tgy)&&G.rd[tgy*N+tgx]===2&&!G.ob[tgy*N+tgx]){openBridge(tgx,tgy);return;}
  const o=hitOb(sx,sy); if(o){const ob=OB[G.ob[o[1]*N+o[0]]]; if(!isUl(o[0],o[1])){toast(ob.name+' · compre esta área em Expandir');return;}
    if(!obHint&&ob.cost){obHint=true; toast('Limpar custa '+ob.cost+' moedas e rende '+(ob.wood?ob.wood+' madeira':ob.stone+' pedra'));}
    clearOb(o[0],o[1]); return;}
  selId=null;closeSheet();}
function onB(b){const t=T[b.k],now=Date.now();
  if(b.fire||(S.req&&S.req.some(r=>r.b===b.i))){selId=b.i; openInfo(b); return;}
  if(now>=b.d){
    if(t.cat==='res'&&now>=b.a){collect(b);after();return;}
    if(t.cat==='biz'){if(b.s===1&&now>=b.a){collect(b);after();return;} if(b.s===0&&supHave(t)>=t.sup){supply(b);after();return;}}
    if(b.k==='plot'&&b.s&&now>=b.a){harvest(b);after();return;}
    if((b.k==='estacao'||b.k==='porto'||b.k==='aeroporto')&&b.s&&now>=b.a){trainArrive(b);after();return;}
    if(isGen(t)&&now>=b.a){collect(b);after();return;}
    if(t.rec){if(b.s==='run'&&now>=b.a){collectProd(b); startProd(b,true); after(); return;} if(!b.s&&canStart(b)){startProd(b); after(); return;}}
    if(b.k==='hall'&&taxAmt()>=10){collectTax(); after(); return;}}
  selId=b.i; openInfo(b);}

/* ================= Modos ================= */
function setMode(m){mode=m; const placing=m.t!=='idle', paint=m.t==='paint';
  $('#dock').style.display=placing?'none':''; $('#rail').style.display=placing?'none':''; $('#placebar').hidden=!placing||paint; $('#toolbar').hidden=!paint; $('#app').classList.toggle('tb',paint); cv.classList.toggle('placing',placing); if(paint)updateToolbar();
  if(placing){closeSheet();selId=null;} updatePlaceBar(); updateHud();}
function updatePlaceBar(){const txt=$('#pbTxt'),ok=$('#pbOk'),rot=$('#pbRot'); rot.hidden=!(mode.t==='place'||mode.t==='move'); const ln=$('#pbLine'); ln.hidden=mode.t!=='place'; ln.classList.toggle('on',!!mode.lineOn);
  if(mode.t==='expand'){const pop=expPop(S.st.expand), can=D.pop>=pop;
    txt.innerHTML='<b>Expandir a cidade</b><span class="'+(can?'':'bad')+'">Toque numa área com placa · precisa de '+fmtN(pop)+' moradores</span>'; ok.hidden=true; $('#pbCancel').textContent='Pronto'; return;}
  if(mode.t==='paint'){updateToolbar(); return;}
  ok.hidden=false; $('#pbCancel').textContent='Cancelar';
  if(mode.t==='place'){const t=T[mode.k]; let msg='toque no mapa para escolher', bad=false;
    if(mode.has){const can=canPlace(mode.k,mode.gx,mode.gy,mode.f,-2); msg=can?'toque de novo para confirmar':'espaço ocupado'; bad=!can; ok.disabled=!can;} else ok.disabled=true;
    const l=lacks(t); if(l.length){msg='Faltam '+l.join(', ');bad=true;ok.disabled=true;} else if(mode.has&&!canPlace(mode.k,mode.gx,mode.gy,mode.f,-2)){msg=whyNot(mode.k,mode.gx,mode.gy,mode.f);}
    if(mode.lineOn){const n=mode.line?mode.line.filter(([x,y])=>canPlace(mode.k,x,y,mode.f,-2)).length:0; msg=!mode.anchor?'toque onde a linha começa':'toque no fim · '+n+' cabem ('+fmtN(n*t.cost)+' moedas)'; ok.disabled=!n; bad=false;}
    txt.innerHTML='<b>'+t.name+'</b><span class="'+(bad?'bad':'')+'">'+fmtN(t.cost)+' moedas'+(t.mat?' · '+matTxt(t.mat):'')+' · '+msg+'</span>'; ok.textContent=mode.lineOn?'Construir linha':'Construir';}
  else if(mode.t==='move'){const b=byId(mode.i),t=T[b.k]; let msg='Toque no novo lugar',bad=false;
    if(mode.has){const can=canPlace(b.k,mode.gx,mode.gy,mode.f,S.b.indexOf(b)); msg=can?'Toque de novo ou confirme':'Esse espaço não está livre'; bad=!can; ok.disabled=!can;} else ok.disabled=true;
    txt.innerHTML='<b>Mover '+t.name+'</b><span class="'+(bad?'bad':'')+'">'+msg+'</span>'; ok.textContent='Mover aqui';}}
function confirmPlace(){
  if(mode.t==='place'&&mode.lineOn&&mode.line&&mode.line.length){placeLine(); return;}
  if(mode.t==='place'){if(!mode.has)return; const k=mode.k,t=T[k];
    if(placeNew(k,mode.gx,mode.gy,mode.f)){const keep=t.cat==='deco'||k==='plot'; if(!keep||!canBuy(k,true))setMode({t:'idle'}); else updatePlaceBar();}}
  else if(mode.t==='move'){const b=byId(mode.i); if(!mode.has||!canPlace(b.k,mode.gx,mode.gy,mode.f,S.b.indexOf(b))){toast('Esse espaço não está livre');return;}
    b.x=mode.gx;b.y=mode.gy;b.f=mode.f?1:0; bounce.set(b.i,Date.now()); setMode({t:'idle'}); after();}}
$('#pbOk').onclick=confirmPlace; $('#pbLine').onclick=()=>{mode.lineOn=!mode.lineOn; mode.anchor=null; mode.line=null; updatePlaceBar(); toast(mode.lineOn?'Em linha: toque no começo e depois no fim':'Construção normal');}; $('#pbCancel').onclick=()=>setMode({t:'idle'}); $('#pbRot').onclick=rotateGhost;

