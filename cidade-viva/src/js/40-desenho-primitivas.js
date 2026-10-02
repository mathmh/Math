/* ================= Desenho: primitivas ================= */
function P(x,y,z){return[(x-y)*TW/2,(x+y)*TH/2-(z||0)];}
let LM=false; // modo "só luzes" (janelas acesas da versão noturna)
const EDGE='rgba(40,28,18,.28)', WIN='#a9d3e6', DOOR='#6b4423', LIT='#ffd98a';
function path(c,pts){c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)c.lineTo(pts[i][0],pts[i][1]);c.closePath();}
function poly(c,pts,fill,stroke,lw){if(LM)return; path(c,pts); if(fill){c.fillStyle=fill;c.fill();} if(stroke){c.strokeStyle=stroke;c.lineWidth=lw||1;c.stroke();}}
function polyL(c,pts,fill){path(c,pts);c.fillStyle=fill;c.fill();}
const shC=new Map();
function sh(hex,f){const key=hex+'|'+f; let v=shC.get(key); if(v)return v; let r,g,b;
  if(hex.startsWith('rgb')){const m=hex.match(/[\d.]+/g).map(Number); r=m[0];g=m[1];b=m[2];}
  else{let h=hex.replace('#',''); if(h.length===3)h=h.split('').map(c=>c+c).join(''); const n=parseInt(h,16); r=(n>>16)&255;g=(n>>8)&255;b=n&255;}
  if(f>=1){const t=f-1;r+=(255-r)*t;g+=(255-g)*t;b+=(255-b)*t;}else{r*=f;g*=f;b*=f;}
  v='rgb('+(r|0)+','+(g|0)+','+(b|0)+')'; shC.set(key,v); return v;}
function box(c,x0,y0,x1,y1,z0,z1,col,top,noEdge){const e=noEdge?null:EDGE;
  poly(c,[P(x0,y1,z0),P(x1,y1,z0),P(x1,y1,z1),P(x0,y1,z1)],sh(col,.9),e);
  poly(c,[P(x1,y1,z0),P(x1,y0,z0),P(x1,y0,z1),P(x1,y1,z1)],sh(col,.72),e);
  poly(c,[P(x0,y0,z1),P(x1,y0,z1),P(x1,y1,z1),P(x0,y1,z1)],top||sh(col,1.1),e);}
function qL(c,x0,x1,y1,u0,u1,za,zb,fill){const a=x0+(x1-x0)*u0,b=x0+(x1-x0)*u1;poly(c,[P(a,y1,za),P(b,y1,za),P(b,y1,zb),P(a,y1,zb)],fill);}
function qR(c,x1,y0,y1,u0,u1,za,zb,fill){const a=y1-(y1-y0)*u0,b=y1-(y1-y0)*u1;poly(c,[P(x1,a,za),P(x1,b,za),P(x1,b,zb),P(x1,a,zb)],fill);}
const isLit=(id,k)=>hsh(id,k,5)%10<6;
function wL(c,x0,x1,y1,u0,u1,za,zb,k,glass){const a=x0+(x1-x0)*u0,b=x0+(x1-x0)*u1, pts=[P(a,y1,za),P(b,y1,za),P(b,y1,zb),P(a,y1,zb)];
  if(LM){if(isLit(SID,k))polyL(c,pts,LIT);return;} poly(c,pts,glass||WIN); poly(c,[P(a,y1,za),P(b,y1,za),P(b,y1,za+1.2),P(a,y1,za+1.2)],'rgba(255,255,255,.55)');}
function wR(c,x1,y0,y1,u0,u1,za,zb,k,glass){const a=y1-(y1-y0)*u0,b=y1-(y1-y0)*u1, pts=[P(x1,a,za),P(x1,b,za),P(x1,b,zb),P(x1,a,zb)];
  if(LM){if(isLit(SID,k+99))polyL(c,pts,'#f2c56e');return;} poly(c,pts,glass?sh(glass,.85):'#86b4c9'); poly(c,[P(x1,a,za),P(x1,b,za),P(x1,b,za+1.2),P(x1,a,za+1.2)],'rgba(255,255,255,.4)');}
function winGrid(c,x0,y0,x1,y1,z0,z1,rows,nl,nr,glass,skipDoor){const st=(z1-z0)/rows;
  for(let r=0;r<rows;r++){const za=z0+r*st+st*.25, zb=z0+r*st+st*.78;
    for(let k=0;k<nl;k++){if(skipDoor&&r===0&&k===Math.floor(nl/2))continue; wL(c,x0,x1,y1,(k+.2)/nl,(k+.8)/nl,za,zb,r*31+k,glass);}
    for(let k=0;k<nr;k++)wR(c,x1,y0,y1,(k+.2)/nr,(k+.8)/nr,za,zb,r*31+k,glass);}}
function pyr(c,x0,y0,x1,y1,z,hh,col){const ap=P((x0+x1)/2,(y0+y1)/2,z+hh);
  poly(c,[P(x0,y0,z),P(x1,y0,z),ap],sh(col,1.15),EDGE); poly(c,[P(x0,y0,z),P(x0,y1,z),ap],sh(col,1.05),EDGE);
  poly(c,[P(x0,y1,z),P(x1,y1,z),ap],sh(col,.95),EDGE); poly(c,[P(x1,y0,z),P(x1,y1,z),ap],sh(col,.76),EDGE);}
function hip(c,x0,y0,x1,y1,z,hh,col){const w=x1-x0,h=y1-y0;
  if(Math.abs(w-h)<.05)return pyr(c,x0,y0,x1,y1,z,hh,col);
  if(w>h){const ym=(y0+y1)/2,d=h/2,a=P(x0+d,ym,z+hh),b=P(x1-d,ym,z+hh);
    poly(c,[P(x0,y0,z),P(x1,y0,z),b,a],sh(col,1.15),EDGE); poly(c,[P(x0,y0,z),P(x0,y1,z),a],sh(col,1.04),EDGE);
    poly(c,[P(x0,y1,z),P(x1,y1,z),b,a],sh(col,.95),EDGE); poly(c,[P(x1,y0,z),P(x1,y1,z),b],sh(col,.74),EDGE);}
  else{const xm=(x0+x1)/2,d=w/2,a=P(xm,y0+d,z+hh),b=P(xm,y1-d,z+hh);
    poly(c,[P(x0,y0,z),P(x1,y0,z),a],sh(col,1.15),EDGE); poly(c,[P(x0,y0,z),P(x0,y1,z),b,a],sh(col,1.04),EDGE);
    poly(c,[P(x0,y1,z),P(x1,y1,z),b],sh(col,.95),EDGE); poly(c,[P(x1,y0,z),P(x1,y1,z),b,a],sh(col,.74),EDGE);}}
function gable(c,x0,y0,x1,y1,z,hh,col,end){const ym=(y0+y1)/2,r0=P(x0,ym,z+hh),r1=P(x1,ym,z+hh);
  poly(c,[P(x0,y0,z),P(x1,y0,z),r1,r0],sh(col,1.12),EDGE); poly(c,[P(x0,y1,z),P(x1,y1,z),r1,r0],sh(col,.94),EDGE);
  poly(c,[P(x1,y0,z),P(x1,y1,z),r1],sh(end||col,.74),EDGE);}
function gableY(c,x0,y0,x1,y1,z,hh,col,end){const xm=(x0+x1)/2,r0=P(xm,y0,z+hh),r1=P(xm,y1,z+hh);
  poly(c,[P(x0,y0,z),P(x0,y1,z),r1,r0],sh(col,1.08),EDGE); poly(c,[P(x0,y1,z),P(x1,y1,z),r1],sh(end||col,.9),EDGE);
  poly(c,[P(x1,y0,z),P(x1,y1,z),r1,r0],sh(col,.8),EDGE);}
function ell(c,x,y,rx,ry,fill){if(LM)return;c.beginPath();c.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),0,0,Math.PI*2);c.fillStyle=fill;c.fill();}
function ellW(c,x,y,z,rx,ry,fill){const [px,py]=P(x,y,z);ell(c,px,py,rx,ry,fill);}
function line(c,a,b,col,w){if(LM)return;c.strokeStyle=col;c.lineWidth=w||1;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();}
function flat(c,x0,y0,x1,y1,z,fill,stroke){poly(c,[P(x0,y0,z),P(x1,y0,z),P(x1,y1,z),P(x0,y1,z)],fill,stroke);}
function cyl(c,x,y,z0,z1,r,col,roof){const [bx,by]=P(x,y,z0),[tx,ty]=P(x,y,z1),rx=r*TW/2*1.0,ry=rx/2;
  if(!LM){c.fillStyle=sh(col,.82);c.beginPath();c.ellipse(bx,by,rx,ry,0,0,Math.PI);c.lineTo(tx-rx,ty);c.ellipse(tx,ty,rx,ry,0,Math.PI,0,true);c.closePath();c.fill();
    const g=c.createLinearGradient(bx-rx,0,bx+rx,0);g.addColorStop(0,sh(col,1.05));g.addColorStop(.6,sh(col,.85));g.addColorStop(1,sh(col,.62));c.fillStyle=g;c.fill();}
  ell(c,tx,ty,rx,ry,roof||sh(col,1.12));}
function shrub(c,x,y,s,col){const [px,py]=P(x,y,2); ell(c,px+2,py+1,6*s,3*s,'rgba(0,0,0,.15)'); ell(c,px,py-3*s,6*s,5*s,col||'#3f8f3a'); ell(c,px-2*s,py-5*s,3.4*s,2.8*s,'#5fb24f');}
function lot(c,w,h,kind){const col=kind==='p'?'#cbc8c0':kind==='b'?'#e8dcc2':kind==='c'?'#b9b6ae':'#7cbd58';
  box(c,.02,.02,w-.02,h-.02,0,2,col,kind==='g'?'#86c763':null,true);
  if(kind==='g'){ /* bordinha */ flat(c,.02,.02,w-.02,h-.02,2,null,'rgba(40,90,30,.25)');}}
function walk(c,u,y1,h,wd,col){flat(c,u-wd,y1,u+wd,h-.02,2.01,col||'#d9d2c3');}
function stripesL(c,x0,x1,y1,za,zb,n,a,b){for(let k=0;k<n;k++)qL(c,x0,x1,y1,k/n,(k+1)/n,za,zb,k%2?b:a);}
function stripesR(c,x1,y0,y1,za,zb,n,a,b){for(let k=0;k<n;k++)qR(c,x1,y0,y1,k/n,(k+1)/n,za,zb,k%2?b:a);}
function awningL(c,x0,x1,y1,z,col,n){const d=.22;for(let k=0;k<n;k++){const a=x0+(x1-x0)*k/n,b=x0+(x1-x0)*(k+1)/n;
  poly(c,[P(a,y1,z),P(b,y1,z),P(b,y1+d,z-5),P(a,y1+d,z-5)],k%2?'#ffffff':col,'rgba(0,0,0,.12)');}}
function awningR(c,x1,y0,y1,z,col,n){const d=.18;for(let k=0;k<n;k++){const a=y1-(y1-y0)*k/n,b=y1-(y1-y0)*(k+1)/n;
  poly(c,[P(x1,a,z),P(x1,b,z),P(x1+d,b,z-5),P(x1+d,a,z-5)],k%2?sh('#ffffff',.85):sh(col,.8),'rgba(0,0,0,.12)');}}
function flag(c,x,y,z,col){const [fx,fy]=P(x,y,z); line(c,[fx,fy],[fx,fy-22],'#555',1.4); poly(c,[[fx,fy-22],[fx+11,fy-19],[fx,fy-15]],col);}
function lantern(c,x,y,z){const [px,py]=P(x,y,z); if(LM){ell2(c,px,py,3,'#ff9a5a');return;} ell(c,px,py,2.6,3.2,'#d63a2f'); ell(c,px-.8,py-1,1,1.2,'#ff8a70');}
function ell2(c,x,y,r,col){c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fillStyle=col;c.fill();}
function treeAt(c,x,y,s,v){const [cx,cy]=P(x,y,2); const cols=[['#3e8e41','#62b45f'],['#2f7d4a','#4ea366'],['#56923a','#7ab85a']][v%3];
  ell(c,cx+3*s,cy,11*s,5*s,'rgba(0,0,0,.15)'); if(!LM){c.fillStyle='#7a5230';c.fillRect(cx-1.5*s,cy-11*s,3*s,11*s);}
  ell(c,cx,cy-18*s,11*s,10*s,cols[0]); ell(c,cx-5*s,cy-14*s,7*s,6*s,cols[0]); ell(c,cx+5*s,cy-15*s,7*s,6*s,sh(cols[0],.85)); ell(c,cx-3*s,cy-22*s,6*s,5*s,cols[1]);}
function bench(c,x,y,s){const [px,py]=P(x,y,2); if(LM)return; c.fillStyle='#8f5d30'; c.fillRect(px-6*s,py-5*s,12*s,2.4*s); c.fillStyle='#6b4423'; c.fillRect(px-6*s,py-8*s,12*s,2*s); c.fillStyle='#333';c.fillRect(px-5*s,py-3*s,1.2*s,3*s);c.fillRect(px+4*s,py-3*s,1.2*s,3*s);}
function umbrella(c,x,y,col){const [px,py]=P(x,y,2); line(c,[px,py],[px,py-12],'#666',1.2); if(LM)return; c.beginPath();c.moveTo(px-8,py-10);c.quadraticCurveTo(px,py-19,px+8,py-10);c.closePath();c.fillStyle=col;c.fill();}
function person(c,x,y,col){const [px,py]=P(x,y,2); ell(c,px,py-5,1.6,3,col); ell(c,px,py-9,1.4,1.4,'#f1c27d');}
