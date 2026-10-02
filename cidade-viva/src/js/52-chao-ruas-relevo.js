/* ================= Peças do chão (em espaço iso) ================= */
const DIRS=DIRS4;
const AS='#636b74', SW='#d8d1c3', CU='#aaa293';
function roadTile(c,x,y){const nb=[carLink(x,y,0),carLink(x,y,1),carLink(x,y,2),carLink(x,y,3)], sw=.17;
  const e=.012; c.fillStyle=AS; c.fillRect(x-e,y-e,1+2*e,1+2*e);
  c.fillStyle=SW; if(!nb[3])c.fillRect(x-e,y,1+2*e,sw); if(!nb[1])c.fillRect(x-e,y+1-sw,1+2*e,sw); if(!nb[2])c.fillRect(x,y-e,sw,1+2*e); if(!nb[0])c.fillRect(x+1-sw,y-e,sw,1+2*e);
  c.fillRect(x,y,sw,sw); c.fillRect(x+1-sw,y,sw,sw); c.fillRect(x,y+1-sw,sw,sw); c.fillRect(x+1-sw,y+1-sw,sw,sw);
  c.fillStyle=CU; if(!nb[3])c.fillRect(x+(nb[2]?0:sw),y+sw-.03,1-(nb[2]?0:sw)-(nb[0]?0:sw),.03); if(!nb[2])c.fillRect(x+sw-.03,y+(nb[3]?0:sw),.03,1-(nb[3]?0:sw)-(nb[1]?0:sw));
  const n=nb[0]+nb[1]+nb[2]+nb[3]; c.fillStyle='#f1ecdc';
  if(n<3){if((nb[0]||nb[2])&&!(nb[1]||nb[3])){c.fillRect(x+.08,y+.485,.3,.03);c.fillRect(x+.6,y+.485,.3,.03);}
    else if((nb[1]||nb[3])&&!(nb[0]||nb[2])){c.fillRect(x+.485,y+.08,.03,.3);c.fillRect(x+.485,y+.6,.03,.3);}}
  for(let d=0;d<4;d++){if(!nb[d])continue; const X=x+DIRS[d][0],Y=y+DIRS[d][1]; if(!D.inter[Y*N+X]||n>=3)continue; c.fillStyle='rgba(255,255,255,.85)';
    for(let k=0;k<4;k++){const o=.22+k*.16; if(d===0)c.fillRect(x+.8,y+o,.17,.08); if(d===2)c.fillRect(x+.03,y+o,.17,.08); if(d===1)c.fillRect(x+o,y+.8,.08,.17); if(d===3)c.fillRect(x+o,y+.03,.08,.17);}}}
function railNb(x,y){const nb=[railLink(x,y,0),railLink(x,y,1),railLink(x,y,2),railLink(x,y,3)]; if(x===TUN.x&&y===TUN.y)nb[2]=true; return nb;}
function railTile(c,x,y,water){const nb=railNb(x,y); const ds=[0,1,2,3].filter(d=>nb[d]);
  if(water){c.fillStyle='rgba(10,40,70,.3)';c.fillRect(x+.1,y+.2,.9,.9);}
  const ties='#6b4a2e', rail='#5b6068', bal=water?'#7a5434':'#9a8f80';
  const seg=(d)=>{const [dx,dy]=DIRS[d]; c.fillStyle=bal; if(dx)c.fillRect(dx>0?x+.5:x,y+.3,.5,.4); else c.fillRect(x+.3,dy>0?y+.5:y,.4,.5);
    c.fillStyle=ties; for(let k=0;k<3;k++){const o=.08+k*.15; if(dx)c.fillRect(dx>0?x+.5+o:x+.42-o,y+.3,.06,.4); else c.fillRect(x+.3,dy>0?y+.5+o:y+.42-o,.4,.06);}
    c.fillStyle=rail; for(const s of [.38,.58]){if(dx)c.fillRect(dx>0?x+.5:x,y+s,.5,.035); else c.fillRect(x+s,dy>0?y+.5:y,.035,.5);}};
  const curve=ds.length===2&&(ds[0]+ds[1])%2===1;
  if(!ds.length){c.fillStyle=bal;c.fillRect(x+.2,y+.3,.6,.4);c.fillStyle=rail;c.fillRect(x+.2,y+.38,.6,.035);c.fillRect(x+.2,y+.58,.6,.035);return;}
  if(curve){const has=d=>ds.includes(d); const cx=has(0)?x+1:x, cy=has(1)?y+1:y; const a0=Math.atan2(y+.5-cy,x+.5-cx);
    let st,en; if(has(0)&&has(1)){st=Math.PI;en=Math.PI*1.5;} else if(has(1)&&has(2)){st=Math.PI*1.5;en=Math.PI*2;} else if(has(2)&&has(3)){st=0;en=Math.PI/2;} else {st=Math.PI/2;en=Math.PI;}
    c.lineWidth=.4;c.strokeStyle=bal;c.beginPath();c.arc(cx,cy,.5,st,en);c.stroke(); c.strokeStyle=ties;c.lineWidth=.06; for(let k=1;k<6;k++){const a=st+(en-st)*k/6; c.beginPath();c.moveTo(cx+Math.cos(a)*.3,cy+Math.sin(a)*.3);c.lineTo(cx+Math.cos(a)*.7,cy+Math.sin(a)*.7);c.stroke();}
    c.strokeStyle=rail;c.lineWidth=.035; for(const r of [.4,.6]){c.beginPath();c.arc(cx,cy,r,st,en);c.stroke();} return;}
  for(const d of ds)seg(d); c.fillStyle=bal; c.fillRect(x+.3,y+.3,.4,.4); c.fillStyle=rail; if(nb[0]||nb[2]){c.fillRect(x+.3,y+.38,.4,.035);c.fillRect(x+.3,y+.58,.4,.035);} if(nb[1]||nb[3]){c.fillRect(x+.38,y+.3,.035,.4);c.fillRect(x+.58,y+.3,.035,.4);}}
function paveTile(c,x,y){for(const [a,b] of [[0,0],[1,0],[0,1],[1,1]]){const qx=x*2+a,qy=y*2+b,v=G.pv[qy*Q2+qx]; if(!v)continue; const p=PAVE[v-1]; patT(p,64); c.fillStyle=p; c.fillRect(qx/2,qy/2,.5,.5);
    c.fillStyle='rgba(0,0,0,.12)'; if(!(qy+1<Q2&&G.pv[(qy+1)*Q2+qx]))c.fillRect(qx/2,qy/2+.47,.5,.03); if(!(qx+1<Q2&&G.pv[qy*Q2+qx+1]))c.fillRect(qx/2+.47,qy/2,.03,.5);}}
function tileTop(c,x,y){const i=y*N+x; if(G.pv[(y*2)*Q2+x*2]||G.pv[(y*2)*Q2+x*2+1]||G.pv[(y*2+1)*Q2+x*2]||G.pv[(y*2+1)*Q2+x*2+1])paveTile(c,x,y);
  if(G.rd[i]===1)roadTile(c,x,y); if(G.rl[i]&&G.tr[i]!==1)railTile(c,x,y,false);}

/* ================= Chão ================= */
function visRange(){const pts=[s2w(0,0),s2w(VW,0),s2w(0,VH),s2w(VW,VH)].map(p=>w2g(p[0],p[1]+40));
  let x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity; for(const [x,y] of pts){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
  return [clamp(Math.floor(x0)-2,0,N-1),clamp(Math.floor(y0)-2,0,N-1),clamp(Math.ceil(x1)+8,0,N-1),clamp(Math.ceil(y1)+8,0,N-1)];}
let mapVer=1, geoVer=1;
const elev=i=>G.ht[i]>0||G.rp[i]>0;

/* ---- Pontes (5 modelos) ---- */
function bridgeAxis(x,y){return isCarRd(x+1,y)||isCarRd(x-1,y)?0:1;}
function spanPos(x,y,ax){let a=0,b=0; while(G.rd[(y-(ax?a+1:0))*N+x-(ax?0:a+1)]===2&&a<40)a++; while(G.rd[(y+(ax?b+1:0))*N+x+(ax?0:b+1)]===2&&b<40)b++; return {u:(a+.5)/(a+b+1),i:a,n:a+b+1};}
function bridgeTile(c,x,y,front,n){const m=G.bm[y*N+x], ax=bridgeAxis(x,y), Z=3; n=n||0;
  const side=(fr)=>ax===0?(fr?[x,y+.92,x+1,y+1]:[x,y,x+1,y+.08]):(fr?[x+.92,y,x+1,y+1]:[x,y,x+.08,y+1]);
  if(!front){setIso(c); c.fillStyle='rgba(10,40,70,.3)'; c.fillRect(x+.05,y+.15,.95,.95);
    setW(c); const deckCol=['#9c9488','#7a5434','#b3b1ac','#6e7378','#a7a9ad'][m]; box(c,x,y,x+1,y+1,-3,Z,deckCol,null,true);
    if(m===0){ // arcos de pedra visíveis na lateral
      const [ax0,ay0]=ax===0?P(x+.5,y+1,-3):P(x+1,y+.5,-3); ell(c,ax0,ay0,10,4,'rgba(30,50,70,.6)');}
    if(m===1)for(const u of [.15,.85]){const p=ax===0?[x+u,y+1]:[x+1,y+u]; line(c,P(p[0],p[1],-6),P(p[0],p[1],Z),'#5a3c22',2);}
    setIso(c,Z); if(m===1){patT(PAT.plank,64); c.fillStyle=PAT.plank; c.fillRect(x,y,1,1);} else{c.fillStyle=AS; c.fillRect(x,y,1,1);}
    c.fillStyle=m===1?'#b88a55':SW; if(ax===0){c.fillRect(x,y,1,.15);c.fillRect(x,y+.85,1,.15);} else{c.fillRect(x,y,.15,1);c.fillRect(x+.85,y,.15,1);}
    if(m!==1){c.fillStyle='#f1ecdc'; if(ax===0){c.fillRect(x+.1,y+.485,.3,.03);c.fillRect(x+.6,y+.485,.3,.03);} else{c.fillRect(x+.485,y+.1,.03,.3);c.fillRect(x+.485,y+.6,.03,.3);}}
    setW(c); bridgeRail(c,x,y,m,ax,false,0); return;}
  bridgeRail(c,x,y,m,ax,true,n);}
function bridgeRail(c,x,y,m,ax,fr,n){const Z=3; const [a0,b0,a1,b1]=ax===0?(fr?[x,y+.92,x+1,y+1]:[x,y,x+1,y+.08]):(fr?[x+.92,y,x+1,y+1]:[x,y,x+.08,y+1]);
  const col=k=>nc(k,n);
  if(m===0)box(c,a0,b0,a1,b1,Z,Z+7,col('#b8b0a2'));
  else if(m===1){for(const u of [0,.5,1]){const p=ax===0?[x+u,(b0+b1)/2]:[(a0+a1)/2,y+u]; line(c,P(p[0],p[1],Z),P(p[0],p[1],Z+8),col('#6b4a2a'),1.6);} const e0=ax===0?[x,(b0+b1)/2]:[(a0+a1)/2,y], e1=ax===0?[x+1,(b0+b1)/2]:[(a0+a1)/2,y+1]; line(c,P(e0[0],e0[1],Z+7),P(e1[0],e1[1],Z+7),col('#8a5a32'),2); line(c,P(e0[0],e0[1],Z+4),P(e1[0],e1[1],Z+4),col('#8a5a32'),1.4);}
  else if(m===2)box(c,a0,b0,a1,b1,Z,Z+5,col('#cfccc5'));
  else if(m===3){const e0=ax===0?[x,(b0+b1)/2]:[(a0+a1)/2,y], e1=ax===0?[x+1,(b0+b1)/2]:[(a0+a1)/2,y+1], H=20, cl=col('#7a3b2e');
    line(c,P(e0[0],e0[1],Z+H),P(e1[0],e1[1],Z+H),cl,2.4); line(c,P(e0[0],e0[1],Z),P(e1[0],e1[1],Z),cl,2); line(c,P(e0[0],e0[1],Z),P(e0[0],e0[1],Z+H),cl,1.8);
    line(c,P(e0[0],e0[1],Z),P(e1[0],e1[1],Z+H),cl,1.3); line(c,P(e0[0],e0[1],Z+H),P(e1[0],e1[1],Z),cl,1.3);
    if(!fr){const o0=ax===0?[x,y+.04]:[x+.04,y], o1=ax===0?[x+1,y+.96]:[x+.96,y+1]; for(const u of [0,1]){const p=ax===0?[x+u,y]:[x,y+u], q=ax===0?[x+u,y+1]:[x+1,y+u]; line(c,P(p[0],p[1],Z+H),P(q[0],q[1],Z+H),cl,1.6);}}}
  else if(m===4){const sp=spanPos(x,y,ax); const e0=ax===0?[x,(b0+b1)/2]:[(a0+a1)/2,y], e1=ax===0?[x+1,(b0+b1)/2]:[(a0+a1)/2,y+1];
    const hc=u=>Z+10+30*Math.pow(2*u-1,2); const u0=(sp.i)/sp.n,u1=(sp.i+1)/sp.n; const cl=col('#d8dde2');
    box(c,a0,b0,a1,b1,Z,Z+4,col('#c9ccd0')); line(c,P(e0[0],e0[1],hc(u0)),P(e1[0],e1[1],hc(u1)),col('#e8ecef'),2);
    for(const t of [.25,.75]){const u=u0+(u1-u0)*t; const p=[e0[0]+(e1[0]-e0[0])*t,e0[1]+(e1[1]-e0[1])*t]; line(c,P(p[0],p[1],Z+4),P(p[0],p[1],hc(u)),cl,.9);}
    if(sp.i===0||sp.i===sp.n-1){const e=sp.i===0?e0:e1; box(c,e[0]-.07,e[1]-.07,e[0]+.07,e[1]+.07,Z,Z+46,col('#e2e2de'));}}}
function dPlotAt(c,w,h,cr,p,ready){const i=.06; const Pz=(a,bb)=>P(a,bb,0); poly(c,[Pz(i,i),Pz(w-i,i),Pz(w-i,h-i),Pz(i,h-i)],'#8b5a35',EDGE);
  c.strokeStyle='rgba(60,35,18,.45)';c.lineWidth=1.3; for(let k=1;k<4;k++){const v=k*h/4; const a=Pz(.15,v),bb=Pz(w-.15,v); c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(bb[0],bb[1]);c.stroke();}
  if(!cr)return;
  for(const v of [.5,1,1.5])for(const u of [.45,1,1.55]){const [px,py]=Pz(u*w/2,v*h/2); const s=1.6+4.6*p;
    if(cr.tall){c.strokeStyle=ready?sh(cr.col,.8):'#4f9a3a';c.lineWidth=1.8;c.beginPath(); for(const o of [-3,0,3]){c.moveTo(px+o*.5,py);c.lineTo(px+o,py-s*2.4);} c.stroke(); if(ready){for(const o of [-3,0,3])ell(c,px+o,py-s*2.4,1.8,3.2,cr.col);}}
    else{ell(c,px,py-s*.45,s*1.15,s*.7,'#3f8f3a'); ell(c,px-1,py-s*.7,s*.6,s*.38,'#5cb04f');
      if(ready){if(cr.big)ell(c,px,py-3,5,3.6,cr.col); else{ell(c,px-2.5,py-3,2.3,2.3,cr.col);ell(c,px+2.5,py-2.5,2.3,2.3,cr.col);ell(c,px,py-5.5,2.3,2.3,cr.col);}}}}}

// luz vinda do alto à esquerda da tela (lado -x): encostas viradas para ela clareiam, as de costas escurecem
const LUZ=(()=>{const v=[-1,-.45,1.35],l=Math.hypot(...v); return v.map(a=>a/l);})();
function slopeLight(A,B){const nx=-A/38,ny=-B/38, l=Math.hypot(nx,ny,1); return ((nx*LUZ[0]+ny*LUZ[1]+LUZ[2])/l)/LUZ[2];}
/* ---- Colunas de relevo (paredes e topo de cada quadrado elevado) ---- */
const CLIFF={0:'#8a7356',3:'#c9b07a',4:'#c79a5a',5:'#7d5a3a',6:'#9aa3ab',7:'#74777d'};
function drawColumn(c,x,y,n){const i=y*N+x, cz=cornerZ(x,y), tr=G.tr[i];
  const nbz=(X,Y)=>inMap(X,Y)?((G.tr[Y*N+X]===1||G.tr[Y*N+X]===2)?[0,0,0,0]:cornerZ(X,Y)):[-20,-20,-20,-20];
  const col=CLIFF[tr]||'#8a7356', dark=nc(sh(col,.62),n), mid=nc(sh(col,.82),n);
  setW(c); const r=nbz(x+1,y); // face direita
  if(cz[1]>r[0]||cz[2]>r[3]){poly(c,[P(x+1,y,cz[1]),P(x+1,y+1,cz[2]),P(x+1,y+1,r[3]),P(x+1,y,r[0])],dark); line(c,P(x+1,y,cz[1]),P(x+1,y+1,cz[2]),'rgba(255,255,255,.12)',1);
    for(let z=Math.min(r[0],r[3])+5;z<Math.max(cz[1],cz[2])-2;z+=5){const za=Math.min(z,cz[1]),zb=Math.min(z,cz[2]); if(za>r[0]&&zb>r[3])line(c,P(x+1,y,za),P(x+1,y+1,zb),'rgba(0,0,0,.08)',1);}}
  const l=nbz(x,y+1); // face esquerda
  if(cz[3]>l[0]||cz[2]>l[1]){poly(c,[P(x,y+1,cz[3]),P(x+1,y+1,cz[2]),P(x+1,y+1,l[1]),P(x,y+1,l[0])],mid);
    for(let z=Math.min(l[0],l[1])+5;z<Math.max(cz[3],cz[2])-2;z+=5){const za=Math.min(z,cz[3]),zb=Math.min(z,cz[2]); if(za>l[0]&&zb>l[1])line(c,P(x,y+1,za),P(x+1,y+1,zb),'rgba(0,0,0,.07)',1);}}
  const pl=tilePlanes(x,y), pat=SOIL_PAT(tr), lock=!isUl(x,y);
  const each=fn=>{for(let k=0;k<pl.length;k++){const q=pl[k]; setIsoPlane(c,x,y,q.zc,q.A,q.B);
    if(k>0){c.save(); c.beginPath(); const t=q.tri; c.moveTo(x+t[0][0],y+t[0][1]); c.lineTo(x+t[1][0],y+t[1][1]); c.lineTo(x+t[2][0],y+t[2][1]); c.closePath(); c.clip();}
    fn(q); if(k>0)c.restore();}};
  each(q=>{patT(pat,32); c.fillStyle=pat; const e=q.tri?0:.015; c.fillRect(x-e,y-e,1+2*e,1+2*e); const r=slopeLight(q.A,q.B);
    if(r<.99){c.fillStyle='rgba(28,22,10,'+Math.min(.42,(1-r)*.62).toFixed(3)+')'; c.fillRect(x,y,1,1);}
    else if(r>1.01){c.fillStyle='rgba(255,250,215,'+Math.min(.26,(r-1)*.75).toFixed(3)+')'; c.fillRect(x,y,1,1);}
    if(G.ht[i]&&tr!==6){c.fillStyle='rgba(255,250,215,'+(G.ht[i]*.03).toFixed(3)+')'; c.fillRect(x,y,1,1);}
    if(lock){patT(PAT.lock,32); c.globalAlpha=.55; c.fillStyle=PAT.lock; c.fillRect(x,y,1,1); c.globalAlpha=1;}});
  setIsoTile(c,x,y); tileTop(c,x,y);
  if(n>0)each(()=>{c.fillStyle='rgba(8,16,48,'+(.58*n).toFixed(3)+')'; c.fillRect(x,y,1,1);});
  setW(c);}
