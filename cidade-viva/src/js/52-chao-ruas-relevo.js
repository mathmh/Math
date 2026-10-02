/* ================= Peças do chão (em espaço iso) ================= */
const DIRS=DIRS4;
const AS='#636b74', SW='#d8d1c3', CU='#aaa293';
function roadTile(c,x,y){const nb=[carLink(x,y,0),carLink(x,y,1),carLink(x,y,2),carLink(x,y,3)], sw=.17;
  const e=.012, pc=ruaPeca(nb);
  if(pc){c.save(); c.translate(x+.5,y+.5); c.rotate(pc.k*Math.PI/2); c.drawImage(pc.im,-.5-e,-.5-e,1+2*e,1+2*e); c.restore();}
  else{c.fillStyle=AS; c.fillRect(x-e,y-e,1+2*e,1+2*e);
  c.fillStyle=SW; if(!nb[3])c.fillRect(x-e,y,1+2*e,sw); if(!nb[1])c.fillRect(x-e,y+1-sw,1+2*e,sw); if(!nb[2])c.fillRect(x,y-e,sw,1+2*e); if(!nb[0])c.fillRect(x+1-sw,y-e,sw,1+2*e);
  c.fillRect(x,y,sw,sw); c.fillRect(x+1-sw,y,sw,sw); c.fillRect(x,y+1-sw,sw,sw); c.fillRect(x+1-sw,y+1-sw,sw,sw);
  c.fillStyle=CU; if(!nb[3])c.fillRect(x+(nb[2]?0:sw),y+sw-.03,1-(nb[2]?0:sw)-(nb[0]?0:sw),.03); if(!nb[2])c.fillRect(x+sw-.03,y+(nb[3]?0:sw),.03,1-(nb[3]?0:sw)-(nb[1]?0:sw));
  }
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
  return [clamp(Math.floor(x0)-2,0,N-1),clamp(Math.floor(y0)-2,0,N-1),clamp(Math.ceil(x1)+13,0,N-1),clamp(Math.ceil(y1)+13,0,N-1)];}
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
const CLIFF={0:'#a39e92',3:'#c9b07a',4:'#c79a5a',5:'#7d5a3a',6:'#9aa3ab',7:'#8e8a83'};
// Sombreado suave do relevo: cada canto de quadrado guarda a média da luz das superfícies que se encontram nele,
// em duas versões: a de cima (topo dos platôs) e a de baixo (chão ao pé dos paredões, que ganha sombra de contato).
// Os valores ficam em imagens pequenas (1 pixel por canto) que o desenho estica com interpolação, em degradê.
const SHD={v:-1};
const LCORN=[[0,0],[1,0],[1,1],[0,1]];
function vertexLight(X,Y){const T4=[[X-1,Y-1,2],[X,Y-1,3],[X-1,Y,1],[X,Y,0]]; let zt=-1e9, zl=1e9;
  for(const [x,y,k] of T4)if(inMap(x,y)){const z=cornerZ(x,y)[k]; if(z>zt)zt=z; if(z<zl)zl=z;}
  const avg=zz=>{let sum=0,n=0; for(const [x,y,k] of T4){if(!inMap(x,y)||cornerZ(x,y)[k]!==zz)continue; const lc=LCORN[k];
    for(const q of tilePlanes(x,y)){if(q.tri&&!q.tri.some(t=>t[0]===lc[0]&&t[1]===lc[1]))continue; sum+=slopeLight(q.A,q.B); n++;}} return n?sum/n:1;};
  return [avg(zt),zt,avg(zl),zl];}
function shadeMaps(){if(SHD.v===mapVer&&SHD.dkT)return SHD; const M=N+1, K=['dkT','ltT','dkL','ltL'];
  if(!SHD.dkT)for(const k of K){SHD[k]=document.createElement('canvas'); SHD[k].width=SHD[k].height=M;}
  const im={}; for(const k of K)im[k]=SHD[k].getContext('2d').createImageData(M,M); SHD.zt=new Float32Array(M*M);
  const put=(D,j,rgb,a)=>{D[j]=rgb[0]; D[j+1]=rgb[1]; D[j+2]=rgb[2]; D[j+3]=Math.round(clamp(a,0,1)*255);};
  const DK=[22,30,44], LT=[255,248,212];
  for(let Y=0;Y<M;Y++)for(let X=0;X<M;X++){const v=Y*M+X, j=v*4, [rt,zt,rl,zl]=vertexLight(X,Y), drop=(zt-zl)/HZ; SHD.zt[v]=zt;
    put(im.dkT.data,j,DK,(1-rt)*2.3); put(im.ltT.data,j,LT,(rt-1)*2.1+clamp(zt/HZ,0,8)*.014+(drop>=1?.07:0));
    put(im.dkL.data,j,DK,clamp((1-rl)*2.3,0,.52)+(drop>=1?Math.min(.34,.12+drop*.04):0)); put(im.ltL.data,j,LT,(rl-1)*2.1+clamp(zl/HZ,0,8)*.014);}
  for(const k of K)SHD[k].getContext('2d').putImageData(im[k],0,0); SHD.v=mapVer; return SHD;}
// aplica o sombreado (só onde já tem pintura) no retângulo de cantos [sx,sx+w]×[sy,sy+h], com a transformação atual do plano.
// low = superfície de baixo (chão ao pé de paredão ou rampa encaixada)
function shadeRect(c,sx,sy,w,h,low){const m=shadeMaps(), M=N+1, x0=Math.max(0,sx),y0=Math.max(0,sy),x1=Math.min(M,sx+w),y1=Math.min(M,sy+h); if(x1<=x0||y1<=y0)return;
  c.globalCompositeOperation='source-atop'; c.imageSmoothingEnabled=true; c.imageSmoothingQuality='low';
  for(const im of low?[m.dkL,m.ltL]:[m.dkT,m.ltT])c.drawImage(im,x0,y0,x1-x0,y1-y0,x0-.5,y0-.5,x1-x0,y1-y0);
  c.globalCompositeOperation='source-over';}
function tileIsLow(x,y,cz){const m=shadeMaps(), M=N+1; return cz[0]<m.zt[y*M+x]||cz[1]<m.zt[y*M+x+1]||cz[2]<m.zt[(y+1)*M+x+1]||cz[3]<m.zt[(y+1)*M+x];}
// solo já com a textura de "área não comprada" por cima (uma pintura só, sem emenda entre quadrados)
const LPAT={}, LOCK_TINT='rgba(28,34,22,.24)';   // área não comprada: um pouco mais escura, sem mudar a cor do chão
function lockPat(tr){if(LPAT[tr])return LPAT[tr]; const p=SOIL_PAT(tr), k=p._k||32, S=p._src?p._src.width:64;
  const cv=document.createElement('canvas'); cv.width=cv.height=S; const c=cv.getContext('2d');
  p.setTransform(new DOMMatrix()); c.fillStyle=p; c.fillRect(0,0,S,S);
  c.fillStyle=LOCK_TINT; c.fillRect(0,0,S,S);
  const out=g.createPattern(cv,'repeat'); if(p._k)out._k=p._k; return LPAT[tr]=out;}
function cliffFace(c,pts,top,bot){const ys=pts.map(p=>p[1]), y0=Math.min(...ys), y1=Math.max(...ys);
  const gr=c.createLinearGradient(0,y0,0,y1); gr.addColorStop(0,top); gr.addColorStop(1,bot); poly(c,pts,gr);}
// paredão de rocha: blocos irregulares em fileiras (as fileiras emendam entre quadrados), rachaduras,
// sombra no pé e a borda de grama pendurada no alto. e0/e1 = cantos da borda no chão; zt/zb = alturas de cima e de baixo.
const shq=(col,f)=>sh(col,Math.round(f*50)/50);
// paredão em peças de imagem (penhasco-1..5): uma peça por borda de quadrado, empilhadas quando o paredão é alto;
// a face da direita usa a peça espelhada e mais escura. Volta false se não dá para usar (imagens não carregaram, borda inclinada).
const PENH_FX=.08, PENH_FY=.66, PENH_FACE=.56;
function cliffPieces(c,e0,zb,H,lit){if(H<8)return false; const pcs=[1,2,3,5,4].map(k=>IMGP['penhasco-'+k]).filter(Boolean); if(pcs.length<4)return false;
  const n=Math.max(1,Math.round(H/36)), Hs=H/n, seed=hsh(Math.round(e0[0]*2),Math.round(e0[1]*2),lit?7:13);
  setW(c); c.save(); if(!lit)c.filter='brightness(0.74)';
  for(let k=0;k<n;k++){const r=(seed>>>(k*3))%23, im=r===0&&pcs[4]?pcs[4]:pcs[r%4], W=im.naturalWidth/2, Hn=im.naturalHeight/2, v=Hs/(Hn*PENH_FACE);
    const [X,Y]=P(e0[0],e0[1],zb+k*Hs); c.save(); c.translate(X,Y); if(!lit)c.scale(-1,1); c.scale(1,v); c.drawImage(im,-W*PENH_FX,-Hn*PENH_FY,W,Hn); c.restore();}
  c.restore(); return true;}
function rockFace(c,e0,e1,zt0,zt1,zb0,zb1,lit,grass,n){const A=P(e0[0],e0[1],0), B=P(e1[0],e1[1],0);
  if(zt0===zt1&&zb0===zb1&&cliffPieces(c,e0,zb0,zt0-zb0,lit))return;
  const pt=(u,z)=>[A[0]+(B[0]-A[0])*u, A[1]+(B[1]-A[1])*u-z], zt=u=>zt0+(zt1-zt0)*u, zb=u=>zb0+(zb1-zb0)*u;
  const face=[pt(0,zt0),pt(1,zt1),pt(1,zb1),pt(0,zb0)], H=Math.max(zt0-zb0,zt1-zb1), base=lit?'#aaa498':'#7c776e';
  cliffFace(c,face,nc(shq(base,1.04),n),nc(shq(base,.74),n)); if(H<6)return;
  const seed=hsh(Math.round(e0[0]*2+e1[0]*3),Math.round(e0[1]*2+e1[1]*3),lit?17:29), r=rng(seed);
  const jit=(v,k)=>((hsh(Math.round(v[0])*7+k,Math.round(v[1])*13-k,91)%100)/100-.5)*8;
  c.save(); path(c,face); c.clip();
  if(ROCHA.pat){// textura de rocha da imagem: u ao longo da borda (2 quadrados por repetição), v na vertical, emendando entre quadrados
    const ex=(B[0]-A[0]), ey=(B[1]-A[1]), axis=Math.abs(e1[0]-e0[0])>Math.abs(e1[1]-e0[1])?'x':'y', t0=axis==='x'?e0[0]:e0[1], k=2/ROCHA.w;
    const O=[A[0]-ex*t0, A[1]-ey*t0]; ROCHA.pat.setTransform(new DOMMatrix([ex*k,ey*k,0,72/ROCHA.w,O[0],O[1]]));
    c.fillStyle=ROCHA.pat; c.fillRect(Math.min(...face.map(p=>p[0]))-2,Math.min(...face.map(p=>p[1]))-2,Math.abs(ex)+4,H+Math.abs(ey)+4);
    if(!lit)poly(c,face,'rgba(20,24,30,.28)'); else poly(c,face,'rgba(255,240,210,.06)');
    if(n>0)poly(c,face,'rgba(8,16,48,'+(.58*n).toFixed(3)+')');
  } else {
  const zmin=Math.min(zb0,zb1), zmax=Math.max(zt0,zt1), RH=13;
  for(let k=Math.floor(zmin/RH);k*RH<zmax;k++){const lo=u=>k*RH+jit(e0,k)*(1-u)+jit(e1,k)*u, hi=u=>(k+1)*RH+jit(e0,k+1)*(1-u)+jit(e1,k+1)*u;
    const cuts=[0]; let u=.12+r()*.3; while(u<.9){cuts.push(u); u+=.25+r()*.35;} cuts.push(1);
    for(let q=0;q+1<cuts.length;q++){const u0=cuts[q],u1=cuts[q+1], f=.84+r()*.3, g0=r()*1.2, g1=r()*1.2;
      const cell=[pt(u0,lo(u0)+g0),pt(u1,lo(u1)+g1),pt(u1,hi(u1)-g1),pt(u0,hi(u0)-g0)];
      poly(c,cell,nc(shq(base,f),n));
      if(r()<.18&&hi(u0)>zt(u0)-RH*2.2)poly(c,cell,'rgba(86,128,58,'+(.18+r()*.2).toFixed(2)+')');   // musgo perto do alto
      if(r()<.25){const um=u0+(u1-u0)*(.3+r()*.4); line(c,pt(um,hi(um)-1),pt(um+(r()-.5)*.06,lo(um)+1),'rgba(30,26,22,.18)',.8);}
      line(c,cell[3],cell[2],'rgba(255,250,235,'+(lit?.22:.12)+')',1);   // aresta de cima pega luz
      line(c,cell[0],cell[1],'rgba(30,26,22,.32)',1.1);                  // junta de baixo
      line(c,cell[1],cell[2],'rgba(30,26,22,.22)',.9);}}
  for(let k=0;k<1+(r()<.5);k++){const u=.15+r()*.7; let z=zt(u)-2, uu=u; c.beginPath(); c.moveTo(...pt(uu,z));
    while(z>zb(uu)+3&&z>zt(u)-H*.8){z-=4+r()*5; uu=clamp(uu+(r()-.5)*.08,0,1); c.lineTo(...pt(uu,z));}
    c.strokeStyle='rgba(28,24,20,.4)'; c.lineWidth=.9; c.stroke();}
  }
  const y0=Math.min(face[2][1],face[3][1])-Math.min(H,26), y1=Math.max(face[2][1],face[3][1]);
  const gr=c.createLinearGradient(0,y0,0,y1); gr.addColorStop(0,'rgba(20,18,15,0)'); gr.addColorStop(1,'rgba(20,18,15,.38)'); poly(c,face,gr);
  c.restore();
  if(grass){const pts=[pt(0,zt0+.5),pt(1,zt1+.5)]; for(let k=8;k>=0;k--){const u=k/8; pts.push(pt(u,Math.max(zb(u)+1,zt(u)-(1.5+r()*4.5))));}
    poly(c,pts,nc(lit?'#6c9e4b':'#56853b',n)); line(c,pt(0,zt0),pt(1,zt1),'rgba(255,255,255,.14)',1);}}
function drawColumn(c,x,y,n){const i=y*N+x, cz=cornerZ(x,y), tr=G.tr[i];
  const nbz=(X,Y)=>inMap(X,Y)?((G.tr[Y*N+X]===1||G.tr[Y*N+X]===2)?[0,0,0,0]:cornerZ(X,Y)):[-20,-20,-20,-20];
  const grass=tr===0||tr===5;
  const pl=tilePlanes(x,y), pat=isUl(x,y)?SOIL_PAT(tr):lockPat(tr), low=tileIsLow(x,y,cz);
  for(const q of pl){setIsoPlane(c,x,y,q.zc,q.A,q.B); c.save(); c.beginPath();
    if(q.tri){const t=q.tri, mx=(t[0][0]+t[1][0]+t[2][0])/3, my=(t[0][1]+t[1][1]+t[2][1])/3;
      t.forEach((v,k)=>{const px=x+mx+(v[0]-mx)*1.05, py=y+my+(v[1]-my)*1.05; k?c.lineTo(px,py):c.moveTo(px,py);}); c.closePath();}
    else c.rect(x-.02,y-.02,1.04,1.04);
    c.clip(); patT(pat,32); c.fillStyle=pat; c.fillRect(x-1,y-1,3,3); shadeRect(c,x-1,y-1,4,4,low); c.restore();}
  setW(c);
  setW(c); const r=nbz(x+1,y); // face direita (na sombra)
  if(cz[1]>r[0]||cz[2]>r[3])rockFace(c,[x+1,y],[x+1,y+1],cz[1],cz[2],Math.min(r[0],cz[1]),Math.min(r[3],cz[2]),false,grass,n);
  const l=nbz(x,y+1); // face esquerda (no sol)
  if(cz[3]>l[0]||cz[2]>l[1])rockFace(c,[x,y+1],[x+1,y+1],cz[3],cz[2],Math.min(l[0],cz[3]),Math.min(l[1],cz[2]),true,grass,n);
  setIsoTile(c,x,y); tileTop(c,x,y);
  setW(c);}
