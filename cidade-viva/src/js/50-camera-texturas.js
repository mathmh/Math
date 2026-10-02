/* ================= Câmera e tempo ================= */
const cv=$('#cv'); const g=cv.getContext('2d');
let VW=0,VH=0,DPR=1; const cam={x:0,y:0,z:1};
let mode={t:'idle'}, selId=null, bubbles=[], floats=[], puffs=[], VIEW=null;
let OPT={cycle:'auto',bm:0,pv:0,fc:0,soil:0}; try{Object.assign(OPT,JSON.parse(localStorage.getItem(OPT_KEY)||'{}'));}catch(e){}
const saveOpt=()=>{try{localStorage.setItem(OPT_KEY,JSON.stringify(OPT));}catch(e){}};
const DAY_LEN=600;
function dayState(now){if(OPT.cycle==='day')return {n:0,dusk:0}; if(OPT.cycle==='night')return {n:1,dusk:0};
  const p=((now/1000)%DAY_LEN)/DAY_LEN; let n=0; if(p<.5)n=0; else if(p<.6)n=(p-.5)/.1; else if(p<.9)n=1; else n=1-(p-.9)/.1;
  n=n*n*(3-2*n); const dusk=(p>.45&&p<.62)?Math.sin((p-.45)/.17*Math.PI):(p>.88?Math.sin((p-.88)/.12*Math.PI)*.7:0); return {n,dusk:Math.max(0,dusk)};}
const s2w=(sx,sy)=>[(sx-VW/2)/cam.z+cam.x,(sy-VH/2)/cam.z+cam.y];
const w2s=(wx,wy)=>[(wx-cam.x)*cam.z+VW/2,(wy-cam.y)*cam.z+VH/2];
function w2g(wx,wy){return[(wx/(TW/2)+wy/(TH/2))/2,(wy/(TH/2)-wx/(TW/2))/2];}
// alvo de desenho: mundo → pixel do canvas atual (tela ou imagem de um pedaço do mapa)
const TGT={k:1,tx:0,ty:0};
function camTGT(){TGT.k=DPR*cam.z; TGT.tx=DPR*(VW/2-cam.x*cam.z); TGT.ty=DPR*(VH/2-cam.y*cam.z);}
function setW(c){c.setTransform(TGT.k,0,0,TGT.k,TGT.tx,TGT.ty);}
function setIso(c,z){const k=TGT.k; c.setTransform(k*32,k*16,-k*32,k*16,TGT.tx,TGT.ty-(z||0)*k);}
// plano inclinado z = zc + A*(X-x) + B*(Y-y) em espaço iso
function setIsoPlane(c,x,y,zc,A,B){const k=TGT.k; c.setTransform(k*32,k*(16-A),-k*32,k*(16-B),TGT.tx,TGT.ty-(zc-A*x-B*y)*k);}
// planos do topo de um quadrado (1 ou 2 triângulos nas encostas de canto)
function tilePlanes(x,y){const z=cornerZ(x,y), r=G.rp[y*N+x];
  if(r<5)return [{zc:z[0],A:z[1]-z[0],B:z[3]-z[0],tri:null}];
  const k=(r-5)%4;
  if(k===0||k===2)return [{zc:z[0],A:z[1]-z[0],B:z[3]-z[0],tri:[[0,0],[1,0],[0,1]]},{zc:z[1]+z[3]-z[2],A:z[2]-z[3],B:z[2]-z[1],tri:[[1,0],[1,1],[0,1]]}];
  return [{zc:z[0],A:z[1]-z[0],B:z[2]-z[1],tri:[[0,0],[1,0],[1,1]]},{zc:z[0],A:z[2]-z[3],B:z[3]-z[0],tri:[[0,0],[1,1],[0,1]]}];}
// iso com inclinação do quadrado (usa o primeiro plano; serve para ruas em rampa)
function setIsoTile(c,x,y){const p=tilePlanes(x,y)[0]; setIsoPlane(c,x,y,p.zc,p.A,p.B);}
function setS(c){c.setTransform(DPR,0,0,DPR,0,0);}

/* ================= Texturas ================= */
function mkPat(draw,size,key){const p=document.createElement('canvas'); p.width=p.height=size; draw(p.getContext('2d'),size); if(key)PAT_SRC[key]=p; return g.createPattern(p,'repeat');}
const PAT_SRC={};
const PAT={}, PAVE=[];
function speck(c,s,seed,n,a,b,base){c.fillStyle=base;c.fillRect(0,0,s,s); const r=rng(seed); for(let k=0;k<n;k++){c.fillStyle=r()<.5?a:b;c.fillRect(r()*s,r()*s,1.5,1.5);}}
function initPats(){
  PAT.grass=mkPat((c,s)=>{const t=s/2; for(let i=0;i<2;i++)for(let j=0;j<2;j++){c.fillStyle=(i+j)%2?'#8bc46a':'#86bf65';c.fillRect(i*t,j*t,t,t);}
    const r=rng(5); for(let k=0;k<90;k++){c.fillStyle=r()<.5?'rgba(60,120,40,.22)':'rgba(170,220,120,.25)'; c.fillRect(r()*s,r()*s,1.6,1.6);}},64);
  PAT.lock=mkPat((c,s)=>speck(c,s,9,80,'rgba(40,80,30,.25)','rgba(150,190,110,.2)','#6f9a58'),64);
  PAT.sand=mkPat((c,s)=>speck(c,s,3,70,'rgba(180,150,90,.35)','rgba(255,250,220,.5)','#ead9a6'),64);
  PAT.desert=mkPat((c,s)=>{speck(c,s,4,60,'rgba(160,110,50,.3)','rgba(255,235,190,.4)','#e3b877'); c.strokeStyle='rgba(170,120,60,.25)';c.lineWidth=1;for(let k=0;k<4;k++){c.beginPath();c.moveTo(0,k*16+6);c.quadraticCurveTo(s/2,k*16+1,s,k*16+6);c.stroke();}},64);
  PAT.dirt=mkPat((c,s)=>speck(c,s,6,90,'rgba(90,60,30,.35)','rgba(200,170,130,.35)','#a07a52'),64);
  PAT.snow=mkPat((c,s)=>speck(c,s,8,50,'rgba(180,200,220,.4)','rgba(255,255,255,.8)','#eef3f7'),64);
  PAT.water=mkPat((c,s)=>{c.fillStyle='#4aa3d6';c.fillRect(0,0,s,s); c.strokeStyle='rgba(255,255,255,.28)';c.lineWidth=1.4; const r=rng(11);
    for(let k=0;k<10;k++){const x=r()*s,y=r()*s,l=6+r()*8; c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+l/2,y-2,x+l,y);c.stroke(); c.beginPath();c.moveTo(x-s,y);c.quadraticCurveTo(x-s+l/2,y-2,x-s+l,y);c.stroke();}},64);
  PAT.sea=mkPat((c,s)=>{c.fillStyle='#2f7fc0';c.fillRect(0,0,s,s); c.strokeStyle='rgba(255,255,255,.22)';c.lineWidth=1.6; const r=rng(17);
    for(let k=0;k<9;k++){const x=r()*s,y=r()*s,l=8+r()*10; c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+l/2,y-3,x+l,y);c.stroke(); c.beginPath();c.moveTo(x-s,y);c.quadraticCurveTo(x-s+l/2,y-3,x-s+l,y);c.stroke();}},64,'sea');
  PAT.rock=mkPat((c,s)=>{speck(c,s,13,140,'rgba(60,62,66,.5)','rgba(120,150,90,.45)','#8a8c86'); c.strokeStyle='rgba(50,52,56,.25)'; c.lineWidth=1; const r=rng(14); for(let k=0;k<6;k++){const x=r()*s,y=r()*s; c.beginPath(); c.moveTo(x,y); c.lineTo(x+6+r()*8,y+r()*4-2); c.stroke();}},64);
  PAT.plank=mkPat((c,s)=>{c.fillStyle='#9a6b3f';c.fillRect(0,0,s,s);c.fillStyle='rgba(60,35,15,.35)';for(let k=0;k<s;k+=8)c.fillRect(0,k,s,1.2);},64);
  // calçadas (64 px = 1 quadrado)
  PAVE[0]=mkPat((c,s)=>{c.fillStyle='#f4f1ea';c.fillRect(0,0,s,s);c.strokeStyle='#2b2b2b';c.lineWidth=5;for(let k=-1;k<3;k++){c.beginPath();c.moveTo(0,k*32+16);for(let x=0;x<=s;x+=4)c.lineTo(x,k*32+16+Math.sin(x/s*Math.PI*2)*8);c.stroke();}},64);
  PAVE[1]=mkPat((c,s)=>{c.fillStyle='#c9c6be';c.fillRect(0,0,s,s);c.strokeStyle='#a9a59c';c.lineWidth=1.5;for(let k=0;k<=s;k+=16){c.beginPath();c.moveTo(k,0);c.lineTo(k,s);c.moveTo(0,k);c.lineTo(s,k);c.stroke();}},64);
  PAVE[2]=mkPat((c,s)=>{c.fillStyle='#b6553c';c.fillRect(0,0,s,s);c.fillStyle='#d9c7b0';for(let y=0;y<s;y+=8){c.fillRect(0,y,s,1.2);for(let x=(y/8%2)*8;x<s;x+=16)c.fillRect(x,y,1.2,8);}},64);
  PAVE[3]=mkPat((c,s)=>speck(c,s,21,260,'rgba(90,90,90,.6)','rgba(240,240,235,.7)','#b9b4a8'),64);
  PAVE[4]=mkPat((c,s)=>{c.fillStyle='#a8743f';c.fillRect(0,0,s,s);c.fillStyle='rgba(60,35,15,.35)';for(let k=0;k<s;k+=10)c.fillRect(k,0,1.4,s);c.fillStyle='rgba(255,220,170,.2)';for(let k=3;k<s;k+=10)c.fillRect(k,0,1,s);},64);
  PAVE[5]=mkPat((c,s)=>{const cols=['#e8e1d0','#2f7f8f','#c8553d','#e8e1d0'];for(let i=0;i<4;i++)for(let j=0;j<4;j++){c.fillStyle=cols[(i+j)%4];c.fillRect(i*16,j*16,16,16);c.fillStyle='#f6f0e2';c.beginPath();c.arc(i*16+8,j*16+8,4,0,7);c.fill();}},64);
  PAVE[6]=mkPat((c,s)=>speck(c,s,23,120,'rgba(90,60,30,.4)','rgba(220,190,150,.4)','#b38a5e'),64);
  PAVE[7]=mkPat((c,s)=>{c.fillStyle='#86bf65';c.fillRect(0,0,s,s);c.fillStyle='#d8d2c4';for(const [x,y] of [[10,10],[42,14],[22,40],[50,46]]){c.beginPath();c.ellipse(x,y,9,6,0,0,7);c.fill();}},64);}
function patT(p,scale,ox,oy){p.setTransform(new DOMMatrix([1/scale,0,0,1/scale,ox||0,oy||0]));}
const SOIL_PAT=t=>t===7?PAT.rock:t===3?PAT.sand:t===4?PAT.desert:t===5?PAT.dirt:t===6?PAT.snow:PAT.grass;

