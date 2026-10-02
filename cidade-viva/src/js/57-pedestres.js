/* ================= Pedestres =================
 Andam num grafo de calçadas: os 4 cantos de cada rua (faixa de calçada), as bordas sem rua e as calçadas
 pintadas. Só atravessam a rua nas faixas (ao lado dos cruzamentos) e esperam o sinal fechar para os carros.
 O movimento é sempre contínuo de um ponto ao outro; aparecem e somem com um esmaecer suave. */
let peds=[], pedGraph=null, pedGraphVer=-1;
const pedCross=new Set();
const PO=.11, PCORN=[[PO,PO],[1-PO,PO],[1-PO,1-PO],[PO,1-PO]], PSIDE=[[1,2],[2,3],[0,3],[0,1]];
function pedNodePos(id){if(id<4*N*N){const t=id>>2,k=id&3; return [(t%N)+PCORN[k][0],((t/N)|0)+PCORN[k][1]];} const q=id-4*N*N; return [((q%Q2)+.5)/2,(((q/Q2)|0)+.5)/2];}
function buildPedGraph(){const adj=new Map(), add=(a,b,cr)=>{let l=adj.get(a); if(!l)adj.set(a,l=[]); if(!l.some(e=>e.to===b))l.push({to:b,cr}); let m=adj.get(b); if(!m)adj.set(b,m=[]); if(!m.some(e=>e.to===a))m.push({to:a,cr});};
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){if(!isCarRd(x,y))continue; const t=y*N+x, base=t*4, nb=[carLink(x,y,0),carLink(x,y,1),carLink(x,y,2),carLink(x,y,3)], n=nb[0]+nb[1]+nb[2]+nb[3];
    for(let d=0;d<4;d++){const [p,q]=PSIDE[d];
      if(!nb[d])add(base+p,base+q,null);
      else if(n<3&&G.rd[t]===1){const X=x+DIRS[d][0],Y=y+DIRS[d][1]; if(inMap(X,Y)&&D.inter[Y*N+X])add(base+p,base+q,{t,d,ix:X,iy:Y});}}
    // ligação com o vizinho (cantos encostados)
    if(isCarRd(x+1,y)&&linked(x,y,0)){const b2=(t+1)*4; add(base+1,b2+0,null); add(base+2,b2+3,null);}
    if(isCarRd(x,y+1)&&linked(x,y,1)){const b2=(t+N)*4; add(base+3,b2+0,null); add(base+2,b2+1,null);}}
  // calçadas pintadas
  const PB=4*N*N;
  for(let qy=0;qy<Q2;qy++)for(let qx=0;qx<Q2;qx++){const qi=qy*Q2+qx; if(!G.pv[qi])continue;
    if(qx+1<Q2&&G.pv[qi+1])add(PB+qi,PB+qi+1,null); if(qy+1<Q2&&G.pv[qi+Q2])add(PB+qi,PB+qi+Q2,null);
    const cx=(qx+.5)/2,cy=(qy+.5)/2, tx=qx>>1,ty=qy>>1;
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const X=tx+dx,Y=ty+dy; if(!inMap(X,Y)||!isCarRd(X,Y)||G.rd[Y*N+X]!==1)continue;
      for(let k=0;k<4;k++){const px=X+PCORN[k][0],py=Y+PCORN[k][1]; if(Math.hypot(px-cx,py-cy)<.45)add(PB+qi,(Y*N+X)*4+k,null);}}}
  const nodes=[...adj.keys()];
  return {adj,nodes};}
function pedG(){if(pedGraphVer!==mapVer){pedGraph=buildPedGraph(); pedGraphVer=mapVer;} return pedGraph;}
function wantPeds(){if(!D.pop||D.pop<25)return 0; let v=Math.round(Math.sqrt(D.pop)*1.3); v=clamp(v,1,140)*QUAL.crowd; if(cam.z<.55)v*=.45; return Math.round(v);}
function pedZ(x,y){const tx=Math.floor(x),ty=Math.floor(y); if(!inMap(tx,ty))return 0; return hAt(clamp(x,tx,tx+.999),clamp(y,ty,ty+.999))+(G.rd[ty*N+tx]===2?3:.8);}
function spawnPed(gr,R){const nodes=gr.nodes; if(!nodes.length)return;
  for(let tries=0;tries<25;tries++){const a=nodes[(Math.random()*nodes.length)|0], [x,y]=pedNodePos(a);
    if(R&&(x<R[0]-1||x>R[2]+1||y<R[1]-1||y>R[3]+1)&&tries<20)continue; const ed=gr.adj.get(a); if(!ed||!ed.length)continue;
    const e=ed.filter(q=>!q.cr); if(!e.length)continue; const nx=e[(Math.random()*e.length)|0];
    peds.push({a,b:nx.to,cr:null,t:0,spd:.32+Math.random()*.16,o:(Math.random()*PED_OUT)|0,age:0,life:45+Math.random()*90,wait:0,walk:Math.random()*4,al:0}); return;}}
function simPeds(now){const dt=Math.min(.1,(now-(simPeds.last||now))/1000); simPeds.last=now; if(!dt||!S)return;
  const gr=pedG(); const want=wantPeds(); const R=visRange();
  if(peds.length<want&&Math.random()<.25)spawnPed(gr,R); if(peds.length>want+3)peds[(Math.random()*peds.length)|0].life=0;
  pedCross.clear();
  for(const p of peds){p.age+=dt; const dying=p.age>p.life; p.al=dying?Math.max(0,p.al-dt*1.6):Math.min(1,p.al+dt*1.6); if(dying&&p.al<=0){p.dead=1;continue;}
    const ea=gr.adj.get(p.a), okEdge=p.a===p.b?!!ea:ea&&ea.some(e=>e.to===p.b); if(!okEdge){p.life=0; p.wait=0;}
    const [ax,ay]=pedNodePos(p.a),[bx,by]=pedNodePos(p.b), L=Math.hypot(bx-ax,by-ay)||.01;
    if(p.cr){pedCross.add(p.cr.t);}
    if(p.wait>0){p.wait-=dt; const cr=p.next&&p.next.cr; if(cr&&(!lightGreen(cr.ix,cr.iy,cr.d%2,now)||p.wait<=0)){p.wait=0; p.a=p.b; p.b=p.next.to; p.cr=cr; p.t=0; p.next=null;} continue;}
    p.t+=p.spd*dt/L; p.walk+=p.spd*dt;
    if(p.t>=1){const eds=(gr.adj.get(p.b)||[]).filter(e=>e.to!==p.a); let nx;
      if(!eds.length)nx={to:p.a,cr:p.cr};
      else{const dx=(bx-ax)/L,dy=(by-ay)/L; const sc=eds.map(e=>{const [qx,qy]=pedNodePos(e.to),[cx,cy]=pedNodePos(p.b), l=Math.hypot(qx-cx,qy-cy)||1; return ((qx-cx)*dx+(qy-cy)*dy)/l;});
        let bi=sc.indexOf(Math.max(...sc)); nx=Math.random()<.55&&sc[bi]>.7?eds[bi]:eds[(Math.random()*eds.length)|0];}
      p.t=0; const prevB=p.b;
      if(nx.cr&&lightGreen(nx.cr.ix,nx.cr.iy,nx.cr.d%2,now)){p.a=prevB; p.b=prevB; p.next=nx; p.wait=12; p.cr=null; continue;}
      p.a=prevB; p.b=nx.to; p.cr=nx.cr||null;}}
  peds=peds.filter(p=>!p.dead);}
function pedPose(p){const [ax,ay]=pedNodePos(p.a),[bx,by]=pedNodePos(p.b); const t=clamp(p.t,0,1); const x=ax+(bx-ax)*t,y=ay+(by-ay)*t; return {x,y,dx:bx-ax,dy:by-ay};}
function pedItems(items,ax,ay,bx,by){for(const p of peds){const ps=pedPose(p); const [px,py]=P(ps.x,ps.y); if(px<ax-60||px>bx+60||py<ay-60||py>by+20)continue;
  const tx=Math.floor(ps.x),ty=Math.floor(ps.y); items.push({d:inMap(tx,ty)&&elev(ty*N+tx)?tx+ty+1.02:ps.x+ps.y+.004,t:9,p,ps,f:pushPed});}}
function pushPed(it){const p=it.p,ps=it.ps, n=dayState(Date.now()).n; const z=pedZ(ps.x,ps.y), [X,Y]=P(ps.x,ps.y,z);
  // direção na tela: frente = descendo (+x ou +y), espelhado quando vai para a esquerda
  let front=true, flip=false; const moving=p.wait<=0&&(Math.abs(ps.dx)+Math.abs(ps.dy))>.01;
  if(moving){const sx=ps.dx-ps.dy, sy=ps.dx+ps.dy; front=sy>=0; flip=sx<0;} else{front=true; flip=(p.o&1)===1;}
  const fr=moving?1+Math.floor((p.walk*14)%8):0; const A=pedAtlas(p.o), cell=[ (front?0:9)+fr, 0];
  const src=[cell[0]*PCW*PSS,0,PCW*PSS,PCH*PSS];
  if(n<.99)pImg(A.d,X-PCW/2,Y-PANC,PCW,PCH,p.al,flip,false,src);
  if(n>0)pImg(A.n(),X-PCW/2,Y-PANC,PCW,PCH,p.al*(n>=.99?1:n),flip,false,src);}

/* ---- aparência: atlas de quadros por roupa (frente e costas, parado + 8 passos) ---- */
const PED_OUT=40, PCW=12, PCH=15, PANC=13.4, PSS=6, PATL=new Map();
const SKIN=['#f6d2b5','#e8b48f','#c98e62','#9c6640','#6e4428'], HAIR=['#2a1d14','#4a3020','#8a5a2b','#d9b25f','#b9b9b9','#c1442e','#1b1b22'];
const SHIRT=['#e63946','#2b6cb0','#2f9a5a','#f2c230','#ffffff','#8a5cc7','#ff8c42','#3ecfc0','#e84f9a','#4b5563','#a3c94a','#f4a7b9'];
const PANTS=['#2b3a55','#3a3a3a','#6b4a2e','#4f6db0','#d9d2c3','#2f5d50','#7a1f2b'];
function outfit(o){const r=rng(o*7919+13); const pick=a=>a[(r()*a.length)|0];
  return {skin:pick(SKIN),hair:pick(HAIR),hs:(r()*6)|0,shirt:pick(SHIRT),pants:pick(PANTS),skirt:r()<.25,bag:r()<.2,bagc:pick(['#7a4b2a','#2b2b33','#c0392b']),sleeve:r()<.5,cap:r()<.12,capc:pick(SHIRT)};}
function drawPerson(c,ot,front,ph,walking){
  // origem nos pés; y para cima negativo; personagem com ~10,5 px de altura
  const sw=walking?Math.sin(ph):0, lift=walking?Math.abs(Math.cos(ph))*.35:0;
  const fx=front?1:-1; // sentido do passo na tela (frente = para baixo e à direita)
  const dir=[.89*fx,.45*fx];
  const hipY=-4.6-lift, shY=-7.9-lift, headY=-9.65-lift;
  c.fillStyle='rgba(0,0,0,.2)'; c.beginPath(); c.ellipse(0,.1,2.5,1.05,0,0,7); c.fill();
  const leg=(side,s)=>{const hx=side*.7, fxp=hx+dir[0]*s*1.25, fyp=-0+dir[1]*s*.9;
    c.strokeStyle=ot.skirt?ot.skin:ot.pants; c.lineWidth=1.25; c.lineCap='round'; c.beginPath(); c.moveTo(hx,hipY); c.lineTo(fxp,fyp-.5); c.stroke();
    c.fillStyle='#2a2522'; c.beginPath(); c.ellipse(fxp+dir[0]*.35,fyp-.35,.85,.45,0,0,7); c.fill();};
  const arm=(side,s,back)=>{const sx=side*1.55, hx=sx+dir[0]*s*1.1, hy=shY+3.1+dir[1]*s*.7;
    c.strokeStyle=ot.sleeve?ot.shirt:ot.skin; c.lineWidth=.95; c.lineCap='round'; c.beginPath(); c.moveTo(sx,shY+.3); c.lineTo((sx+hx)/2,(shY+hy)/2); c.stroke();
    c.strokeStyle=ot.skin; c.beginPath(); c.moveTo((sx+hx)/2,(shY+hy)/2); c.lineTo(hx,hy); c.stroke();
    c.fillStyle=ot.skin; c.beginPath(); c.arc(hx,hy,.5,0,7); c.fill();};
  // ordem: braço e perna de trás, perna da frente, tronco, braço da frente, cabeça
  const far=front?-1:1;
  arm(far,-sw,true); leg(far,-sw); leg(-far,sw);
  if(ot.skirt){c.fillStyle=ot.pants; c.beginPath(); c.moveTo(-1.5,hipY+.2); c.lineTo(1.5,hipY+.2); c.lineTo(2.1,hipY+2.6); c.lineTo(-2.1,hipY+2.6); c.closePath(); c.fill();}
  else{c.fillStyle=ot.pants; c.beginPath(); c.roundRect?c.roundRect(-1.45,hipY-.4,2.9,1.5,.5):c.rect(-1.45,hipY-.4,2.9,1.5); c.fill();}
  c.fillStyle=ot.shirt; c.beginPath(); c.roundRect?c.roundRect(-1.6,shY-.2,3.2,4.1,1):c.rect(-1.6,shY-.2,3.2,4.1); c.fill();
  c.fillStyle='rgba(0,0,0,.14)'; c.fillRect(front?.5:-1.6,shY,1.1,3.8);
  if(ot.bag){c.strokeStyle=ot.bagc; c.lineWidth=.45; c.beginPath(); c.moveTo(-1.3,shY); c.lineTo(1.2,hipY); c.stroke(); c.fillStyle=ot.bagc; c.fillRect(front?.7:-2.2,hipY-1.2,1.5,1.4);}
  arm(-far,sw,false);
  c.fillStyle=ot.skin; c.fillRect(-.45,shY-.9,.9,1);
  c.fillStyle=ot.skin; c.beginPath(); c.arc(0,headY,1.65,0,7); c.fill();
  const h=ot.hair;
  if(ot.cap){c.fillStyle=ot.capc; c.beginPath(); c.arc(0,headY-.2,1.72,Math.PI,0); c.fill(); c.fillRect(front?0:-2.6,headY-.45,2.6,.55);}
  else if(ot.hs===0){c.fillStyle=h; c.beginPath(); c.arc(0,headY-.25,1.7,Math.PI*1.02,-.02); c.fill(); if(!front){c.beginPath(); c.arc(0,headY,1.66,0,7); c.fill();}}
  else if(ot.hs===1){c.fillStyle=h; c.beginPath(); c.arc(0,headY-.2,1.78,Math.PI,0); c.fill(); c.fillRect(-1.78,headY-.3,front?1:3.56,3.2); if(front)c.fillRect(.95,headY-.3,.83,3.2);}
  else if(ot.hs===2){c.fillStyle=h; c.beginPath(); c.arc(0,headY-.25,1.7,Math.PI,0); c.fill(); c.beginPath(); c.arc(front?-.6:.3,headY-1.9,.85,0,7); c.fill(); if(!front){c.beginPath(); c.arc(0,headY,1.66,0,7); c.fill();}}
  else if(ot.hs===3){c.fillStyle=h; for(const [a,b] of [[-1.2,-.8],[0,-1.5],[1.2,-.8],[-1.5,.3],[1.5,.3],[0,-.4]]){if(front&&b>-.5&&Math.abs(a)<1)continue; c.beginPath(); c.arc(a,headY+b,.95,0,7); c.fill();}}
  else if(ot.hs===4){c.fillStyle=h; c.beginPath(); c.arc(0,headY-.3,1.7,Math.PI,0); c.fill(); c.beginPath(); c.moveTo(front?-1.7:-1.5,headY); c.lineTo(front?-2:-1.9,headY+2.6); c.lineTo(front?-.8:1.9,headY+2.6); c.lineTo(front?-.6:1.5,headY); c.fill(); if(!front){c.beginPath(); c.arc(0,headY,1.66,0,7); c.fill();}}
  else{c.fillStyle=h; c.beginPath(); c.arc(0,headY-.6,1.5,Math.PI*1.1,-.1); c.fill();}
  if(front){c.fillStyle='#2a1d14'; c.fillRect(.25,headY-.1,.35,.42); c.fillRect(1.05,headY-.15,.32,.4); c.fillStyle='rgba(200,80,70,.55)'; c.fillRect(.55,headY+.85,.6,.22);}}
function pedAtlas(o){let A=PATL.get(o); if(A)return A; const ot=outfit(o); const cvs=document.createElement('canvas'); cvs.width=18*PCW*PSS; cvs.height=PCH*PSS; const c=cvs.getContext('2d');
  for(let dir=0;dir<2;dir++)for(let f=0;f<9;f++){c.setTransform(PSS,0,0,PSS,(dir*9+f)*PCW*PSS+PCW/2*PSS,PANC*PSS); drawPerson(c,ot,dir===0,f===0?0:(f-1)/8*Math.PI*2,f>0);}
  A={d:cvs,nc:null,n(){if(!this.nc){const n2=document.createElement('canvas'); n2.width=cvs.width; n2.height=cvs.height; const c2=n2.getContext('2d'); c2.drawImage(cvs,0,0); c2.globalCompositeOperation='source-atop'; c2.fillStyle='rgba(14,22,58,.55)'; c2.fillRect(0,0,n2.width,n2.height); this.nc=n2;} return this.nc;}};
  PATL.set(o,A); return A;}
