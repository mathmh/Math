/* ================= Trânsito ================= */
let cars=[], lastSim=0;
const right=d=>[-DIRS[d][1],DIRS[d][0]];
function pickOut(x,y,din){const opts=[]; for(let d=0;d<4;d++){if(d===(din+2)%4)continue; if(carLink(x,y,d))opts.push(d);}
  if(!opts.length)return (din+2)%4; if(opts.includes(din)&&Math.random()<.55)return din; return opts[(Math.random()*opts.length)|0];}
function curve(o,lane){const cx=o.x+.5,cy=o.y+.5, di=DIRS[o.din],dd=DIRS[o.dout], ri=right(o.din),ro=right(o.dout);
  const A=[cx-di[0]*.5+ri[0]*lane,cy-di[1]*.5+ri[1]*lane], B=[cx+dd[0]*.5+ro[0]*lane,cy+dd[1]*.5+ro[1]*lane];
  const Cc=o.din===o.dout?[(A[0]+B[0])/2,(A[1]+B[1])/2]:[cx+(ri[0]+ro[0])*lane,cy+(ri[1]+ro[1])*lane]; return [A,Cc,B];}
function bez(cu,p){const [A,B,Cc]=[cu[0],cu[1],cu[2]],q=1-p; return [q*q*A[0]+2*q*p*B[0]+p*p*Cc[0], q*q*A[1]+2*q*p*B[1]+p*p*Cc[1], 2*q*(B[0]-A[0])+2*p*(Cc[0]-B[0]), 2*q*(B[1]-A[1])+2*p*(Cc[1]-B[1])];}
function lightGreen(x,y,axis,now){const t=(now/1000+hsh(x,y,3)%10)%10; return axis===0?t<4.2:(t>=5&&t<9.2);}
function lightState(x,y,axis,now){const t=(now/1000+hsh(x,y,3)%10)%10; if(axis===0)return t<4.2?'g':t<5?'y':'r'; return t>=5&&t<9.2?'g':t>=9.2?'y':'r';}
// quantidade de carros cresce com a cidade: no começo quase nenhum
function wantCars(){if(!D.roadN)return 0; const v=Math.floor((D.pop-80)/70)+Math.floor(Math.max(0,D.roadN-30)/14); return Math.round(clamp(v,0,60)*QUAL.crowd*(cam.z<.55?.5:1));}
function spawnCar(){if(!D.roadN)return; for(let tries=0;tries<20;tries++){const x=(Math.random()*N)|0,y=(Math.random()*N)|0; if(!isCarRd(x,y))continue;
    const ins=[]; for(let d=0;d<4;d++)if(carLink(x,y,(d+2)%4))ins.push(d); const din=ins.length?ins[(Math.random()*ins.length)|0]:(Math.random()*4)|0;
    if(cars.some(o=>o.x===x&&o.y===y))continue; const mi=Math.random(); const m=mi<.08&&D.pop>300?4:mi<.3?0:mi<.55?1:mi<.7?2:3;
    const col=m===0?['#d63c3c','#3e7bd6','#2f9a5a','#f08c2e','#8a5cc7'][(Math.random()*5)|0]:m===1?['#24407a','#555b63','#e8e8e4','#7a1f2b'][(Math.random()*4)|0]:CARS[m].col;
    cars.push({x,y,din,dout:pickOut(x,y,din),p:Math.random()*.5,m,col,spd:m===4?.9:1.15+Math.random()*.35,wait:0}); return;}}
function simulate(now){const dt=Math.min(.1,(now-(lastSim||now))/1000); lastSim=now; if(!dt)return;
  const want=wantCars(); if(cars.length<want&&Math.random()<.05)spawnCar(); if(cars.length>want)cars.pop();
  const occ=new Map(); for(const o of cars){const k=o.y*N+o.x; let a=occ.get(k); if(!a)occ.set(k,a=[]); a.push(o);}
  for(const o of cars){if(!isCarRd(o.x,o.y)){o.dead=1;continue;}
    let stop=false; const nx=o.x+DIRS[o.dout][0],ny=o.y+DIRS[o.dout][1];
    if(o.wait<5){const same=occ.get(o.y*N+o.x)||[]; for(const q of same)if(q!==o&&q.din===o.din&&q.p>o.p&&q.p-o.p<.5)stop=true;
      if(o.p>.45){const nxt=occ.get(ny*N+nx)||[]; for(const q of nxt)if(q.din===o.dout&&q.p<.4)stop=true;}}
    if(pedCross.size&&((pedCross.has(o.y*N+o.x)&&o.p>.45&&o.p<.85)||(inMap(nx,ny)&&pedCross.has(ny*N+nx)&&o.p>.55)))stop=true;
    if(inMap(nx,ny)&&D.inter[ny*N+nx]&&!D.inter[o.y*N+o.x]&&o.p>.55&&o.p<.8&&!lightGreen(nx,ny,o.dout%2,now))stop=true;
    if(stop){o.wait+=dt; continue;} if(o.wait>=5)o.wait=Math.max(0,o.wait-dt*3); else o.wait=0;
    const len=o.din===o.dout?1:((o.dout===(o.din+1)%4)?.6:1.1); o.p+=o.spd*dt/len;
    if(o.p>=1){o.p-=1; if(!carLink(o.x,o.y,o.dout)){o.dout=pickOut(o.x,o.y,o.din); continue;} o.x=nx; o.y=ny; o.din=o.dout; if(!isCarRd(o.x,o.y)){o.dead=1;continue;} o.dout=pickOut(o.x,o.y,o.din);}}
  cars=cars.filter(o=>!o.dead);}
const NCOL=new Map();
function hexOf(rgb){if(rgb[0]==='#')return rgb; const m=rgb.match(/\d+/g).map(Number); return '#'+((1<<24)|(m[0]<<16)|(m[1]<<8)|m[2]).toString(16).slice(1);}
function nc(col,n){if(!n||n<=0)return col; col=hexOf(col); const q=Math.round(n*10); const key=col+q; let v=NCOL.get(key); if(v)return v; v=mix(col,'#101a3a',q/10*.6); NCOL.set(key,v); return v;}
function mix(a,b,t){const pa=parseInt(a.slice(1),16),pb=parseInt(b.slice(1),16); const r=((pa>>16)&255)*(1-t)+((pb>>16)&255)*t, gg=((pa>>8)&255)*(1-t)+((pb>>8)&255)*t, bb=(pa&255)*(1-t)+(pb&255)*t;
  return '#'+((1<<24)|(r<<16)|(gg<<8)|bb).toString(16).slice(1);}
const zRoad=(x,y)=>hAt(x,y)+(G.rd[Math.floor(y)*N+Math.floor(x)]===2?3:0);
function carPose(o){const lane=CARS[o.m].bus?.22:.2; const [x,y,tx,ty]=bez(curve(o,lane),clamp(o.p,0,1)); const L=Math.hypot(tx,ty)||1; return {x,y,tx:tx/L,ty:ty/L,z:zRoad(clamp(x,o.x,o.x+.999),clamp(y,o.y,o.y+.999))};}
function prism(c,x,y,tx,ty,a0,a1,w,z0,z1,col,topc,n){const nx=-ty,ny=tx; const corner=(a,b)=>[x+tx*a+nx*b,y+ty*a+ny*b];
  const pts=[corner(a1,w),corner(a1,-w),corner(a0,-w),corner(a0,w)];
  for(let i=0;i<4;i++){const p=pts[i],q=pts[(i+1)%4]; const ex=q[0]-p[0],ey=q[1]-p[1]; const onx=ey,ony=-ex; const cx=(p[0]+q[0])/2-x,cy=(p[1]+q[1])/2-y; const s=(onx*cx+ony*cy)>0?1:-1;
    if((onx+ony)*s>0){const f=clamp(.75+.25*((onx-ony)*s/Math.hypot(onx,ony)),.6,1); poly(c,[P(p[0],p[1],z0),P(q[0],q[1],z0),P(q[0],q[1],z1),P(p[0],p[1],z1)],nc(hexOf(sh(col,f)),n));}}
  poly(c,pts.map(p=>P(p[0],p[1],z1)),nc(topc||col,n));}
// carros viram sprites prontos por ângulo (32 direções), cor e modelo
const ANG=32;
const angIdx=(tx,ty)=>((Math.round(Math.atan2(ty,tx)/(Math.PI*2)*ANG)%ANG)+ANG)%ANG;
function drawCarVec(c,pose,m,col,n){const M=CARS[m], zb=pose.z, L=M.len/2,Wd=M.wid/2,{x,y,tx,ty}=pose;
  const [sx,sy]=P(x,y,zb); ell(c,sx,sy+1,(M.len*22),(M.len*11),'rgba(0,0,0,.18)');
  prism(c,x,y,tx,ty,-L,L,Wd,zb+1.2,zb+M.h*.55+1.2,col,col,n);
  if(M.bus){prism(c,x,y,tx,ty,-L,L,Wd,zb+M.h*.55+1.2,zb+M.h,'#cfe6f2',col,n); prism(c,x,y,tx,ty,-L,L,Wd*.98,zb+M.h-1.2,zb+M.h,col,'#e8e8e4',n);}
  else if(M.bed){prism(c,x,y,tx,ty,-L*.15,L*.55,Wd*.92,zb+M.h*.55+1.2,zb+M.h,'#9fc6dc','#e6e6e2',n);}
  else{prism(c,x,y,tx,ty,-L*.55,L*.4,Wd*.9,zb+M.h*.55+1.2,zb+M.h,'#9fc6dc',col,n); if(M.taxi){const [qx,qy]=P(x-tx*L*.1,y-ty*L*.1,zb+M.h+2); c.fillStyle=n>.5?'#fff1a0':'#fff7c2';c.fillRect(qx-2,qy-1,4,2.4);}}
  if(n>.25){const nx=-ty,ny=tx; for(const s of [-1,1]){const [hx,hy]=P(x+tx*L+nx*Wd*.65*s,y+ty*L+ny*Wd*.65*s,zb+3); ell2(c,hx,hy,1.1,'rgba(255,245,200,'+n+')'); const [bx,by]=P(x-tx*L+nx*Wd*.65*s,y-ty*L+ny*Wd*.65*s,zb+3); ell2(c,bx,by,1,'rgba(255,60,50,'+n+')');}}}
function carSprite(m,col,ai,night){return vecSprite('car:'+m+':'+col+':'+ai+':'+(night?1:0),[-34,-36,34,18],c=>{const a=ai/ANG*Math.PI*2; drawCarVec(c,{x:0,y:0,tx:Math.cos(a),ty:Math.sin(a),z:0},m,col,night?1:0);});}
function pushCar(o,pose,n){const M=CARS[o.m], [X,Y]=P(pose.x,pose.y,pose.z);
  if(IMG['carro-'+M.id+'-frente']||IMG['carro-'+M.id+'-traseira']){const front=pose.ty+pose.tx>0; const slug='carro-'+M.id+(front?'-frente':'-traseira'); const flip=front?pose.tx>pose.ty:pose.tx<pose.ty; const s=imgSprite(slug,n>.5); if(s){pSprite(s,X,Y,flip); return;}}
  const ai=angIdx(pose.tx,pose.ty); if(n<.99)pSprite(carSprite(o.m,o.col,ai,false),X,Y); if(n>0)pSprite(carSprite(o.m,o.col,ai,true),X,Y,false,n>=.99?1:n);}
function drawLampPost(c,x,y,n,z){const [bx,by]=P(x,y,z); ell(c,bx+1,by,4,2,'rgba(0,0,0,.18)'); line(c,[bx,by],[bx,by-30],nc('#3a4048',n),2); line(c,[bx,by-30],[bx+5,by-32],nc('#3a4048',n),2);
  ell2(c,bx+6,by-31.5,2.2,n>.2?'#fff2b0':'#d9dde1');}
const SIG=[[.1,.9,0],[.9,.1,1]];
function signalSprite(st,night){return vecSprite('sig:'+st+':'+(night?1:0),[-6,-26,6,3],c=>{const n=night?1:0; line(c,[0,0],[0,-15],nc('#2b2f36',n),1.3);
  c.fillStyle='#1b1e23'; c.fillRect(-1.7,-21.5,3.4,7.2); ell2(c,0,-20,.95,st==='r'?'#ff4b3e':'#4a2020'); ell2(c,0,-18,.95,st==='y'?'#ffc83d':'#4a3a1a'); ell2(c,0,-16,.95,st==='g'?'#4dff7a':'#1a3a22');},3);}

/* ---- Cercas e muros (grade de 1/4): nó central + braços até a borda, postes nas pontas, cantos, T e cruz ---- */
const FENCE_H=9, FCOL=['#3f8f3a','#f6f4ee','#9a958b','#b4553f','#2b2f36','#8a5a32','#b9bab5'];
const FTHIN=t=>t===1||t===4||t===5;
function fenceLinks(qx,qy){const out=[]; for(let d=0;d<4;d++){const X=qx+DIRS[d][0],Y=qy+DIRS[d][1]; if(X>=0&&Y>=0&&X<Q2&&Y<Q2&&G.fc[Y*Q2+X])out.push(d);} return out;}
function drawFence(c,qx,qy,n){const ty=G.fc[qy*Q2+qx]-1; const cx=(qx+.5)/2,cy=(qy+.5)/2, z=hAt(cx,cy), H=FENCE_H; const ls=fenceLinks(qx,qy);
  const col=nc(FCOL[ty],n), thin=FTHIN(ty), w=ty===0?.07:thin?.02:.05;
  const other=d=>{const X=qx+DIRS[d][0],Y=qy+DIRS[d][1]; return G.fc[Y*Q2+X]-1!==ty;};
  const straight=ls.length===2&&(ls[0]+2)%4===ls[1];
  const post=!straight||ls.some(other);
  const topCol=ty===0?nc('#5fb24f',n):ty===3?nc('#d9c7b0',n):ty===2?nc('#b4afa5',n):ty===6?nc('#cfd0cb',n):null;
  const arm=d=>{const dx=DIRS[d][0],dy=DIRS[d][1]; const a=w, b=.25; // do nó até a borda do quarto
    if(!thin){const x0=dx?cx+dx*a:cx-w, x1=dx?cx+dx*b:cx+w, y0=dy?cy+dy*a:cy-w, y1=dy?cy+dy*b:cy+w;
      box(c,Math.min(x0,x1),Math.min(y0,y1),Math.max(x0,x1),Math.max(y0,y1),z,z+H,col,topCol,true);
      if(ty===3)for(let k=1;k<3;k++)line(c,P(cx+dx*a+(dy?w:0),cy+dy*a+(dx?w:0),z+k*3),P(cx+dx*b+(dy?w:0),cy+dy*b+(dx?w:0),z+k*3),'rgba(80,30,20,.25)',.6);}
    else{const lw=ty===4?1:1.3, ex=cx+dx*b, ey=cy+dy*b;
      for(const hh of (ty===4?[H-1,1.5]:[H*.78,H*.38]))line(c,P(cx,cy,z+hh),P(ex,ey,z+hh),col,lw);
      const k=ty===4?3:ty===1?2:1; for(let i=1;i<=k;i++){const t=i/(k+1)*.25; line(c,P(cx+dx*t,cy+dy*t,z),P(cx+dx*t,cy+dy*t,z+(ty===1?H-.5:H)),col,ty===4?.8:1.1);}}};
  for(const d of ls)if(d===2||d===3)arm(d);
  if(!thin){box(c,cx-w,cy-w,cx+w,cy+w,z,z+H,col,topCol,true);
    if(post&&ty!==0){const p=w*1.45; box(c,cx-p,cy-p,cx+p,cy+p,z,z+H+2.2,nc(sh(FCOL[ty],.9),n),topCol,true);}
    else if(ty===0&&ls.length<2){const [px,py]=P(cx,cy,z+H); ell(c,px,py,4.5,2.4,nc('#5fb24f',n));}}
  else{const pw=post?.035:.022, ph=post?H+1.6:H; box(c,cx-pw,cy-pw,cx+pw,cy+pw,z,z+ph,col,null,true); if(post&&ty===4){const [px,py]=P(cx,cy,z+ph); ell2(c,px,py-1,1.3,col);}}
  for(const d of ls)if(d===0||d===1)arm(d);}

/* ---- Túnel: portal de pedra na encosta, perto do centro ---- */
function drawPortal(c,n){const X=PORTAL.x+1, yc=PORTAL.y+.5, hill=G.ht[PORTAL.y*N+PORTAL.x]>=2;
  const st=nc('#b3a891',n), st2=nc('#8f846e',n), dk=nc('#17140f',n), x=X+.015;
  if(!hill){box(c,X-1.5,yc-1.3,X,yc+1.3,0,26,nc('#8a7356',n),nc('#7fae5a',n));}
  const Fq=(y0,y1,z0,z1,col)=>poly(c,[P(x,y0,z0),P(x,y1,z0),P(x,y1,z1),P(x,y0,z1)],col);
  Fq(yc-1.12,yc+1.12,0,25,st);
  for(let r=0,z=3;z<25;z+=3.6,r++)for(let k=0;k<6;k++){const y0=yc-1.12+(k+(r%2)*.5)*.39; if(y0>yc+1.1)continue; line(c,P(x+.005,y0,z-3.6),P(x+.005,y0,z),'rgba(70,60,45,.28)',.7);}
  for(let z=3;z<25;z+=3.6)line(c,P(x+.005,yc-1.12,z),P(x+.005,yc+1.12,z),'rgba(70,60,45,.28)',.7);
  const r=.43, zs=12, zr=7.5, arch=[]; for(let k=0;k<=14;k++){const a=Math.PI*k/14; arch.push([yc-r*Math.cos(a),zs+zr*Math.sin(a)]);}
  // aduelas do arco
  for(let k=0;k<14;k++){const a0=Math.PI*k/14,a1=Math.PI*(k+1)/14, R=1.3;
    const q=[[yc-r*Math.cos(a0),zs+zr*Math.sin(a0)],[yc-r*Math.cos(a1),zs+zr*Math.sin(a1)],[yc-r*R*Math.cos(a1),zs+zr*R*Math.sin(a1)+1],[yc-r*R*Math.cos(a0),zs+zr*R*Math.sin(a0)+1]];
    poly(c,q.map(([yy,zz])=>P(x+.01,yy,zz)),k===6||k===7?nc('#d9cdb0',n):k%2?st2:nc(sh('#b3a891',1.08),n));}
  Fq(yc-r*1.3,yc-r,0,zs,st2); Fq(yc+r,yc+r*1.3,0,zs,st2);
  poly(c,[P(x+.012,yc-r,0),...arch.map(([yy,zz])=>P(x+.012,yy,zz)),P(x+.012,yc+r,0)],dk);
  poly(c,[P(x+.013,yc-r*.85,0),...arch.map(([yy,zz])=>P(x+.013,yc+(yy-yc)*.85,zs*.85+(zz-zs)*.85)),P(x+.013,yc+r*.85,0)],nc('#0b0a08',n));
  // cornija, placa e pilares com lampiões
  box(c,X-.05,yc-1.2,X+.08,yc+1.2,24,26.5,st2,nc('#c9bfa6',n));
  Fq(yc-.32,yc+.32,20,23.2,nc('#2f5d50',n)); for(let k=0;k<5;k++){const yy=yc-.24+k*.12; line(c,P(x+.02,yy,21),P(x+.02,yy+.06,22.2),nc('#f2e6c0',n),.9);}
  for(const s of [-1,1]){const py=yc+s*.62; box(c,X-.02,py-.09,X+.12,py+.09,0,22,st2,nc('#c9bfa6',n)); box(c,X+.03,py-.06,X+.13,py+.06,20.5,25,nc('#2b2f36',n),null,true);
    const [lx,ly]=P(X+.08,py,23); ell(c,lx,ly,1.8,2.4,n>.2?'#ffe9a0':nc('#e8dfc4',n));}
  // trilhos entrando no escuro
  for(const o of [-.1,.1])line(c,P(X,yc+o,0),P(X-.25,yc+o,0),nc('#5b6068',n),1.1);
  const [gx,gy]=P(X-.6,yc,26.5); if(hill)for(let k=0;k<3;k++)ell(c,gx-10+k*10,gy-2+(k%2)*2,5,2.5,nc('#5f9a45',n));}
const trainPathCache=new Map();
function trainPath(b){const key=b.i+':'+mapVer; let p=trainPathCache.get(key); if(p!==undefined)return p; p=null;
  const end=stationLinked(b); if(end){const prev=new Map(); const q=[[TUN.x,TUN.y]]; prev.set(TUN.y*N+TUN.x,-1);
    while(q.length){const [x,y]=q.shift(); if(x===end[0]&&y===end[1])break; for(let d=0;d<4;d++){if(!railLink(x,y,d))continue; const X=x+DIRS[d][0],Y=y+DIRS[d][1],k=Y*N+X; if(prev.has(k))continue; prev.set(k,y*N+x); q.push([X,Y]);}}
    let k=end[1]*N+end[0]; if(prev.has(k)){p=[]; while(k!==-1){p.push([k%N+.5,((k/N)|0)+.5]); k=prev.get(k);} p.reverse(); p.unshift([TUN.x-2.2,TUN.y+.5]);}}
  trainPathCache.set(key,p); return p;}
function along(path,d){let acc=0; for(let i=1;i<path.length;i++){const a=path[i-1],b=path[i],L=Math.hypot(b[0]-a[0],b[1]-a[1]); if(acc+L>=d){const t=(d-acc)/L; return [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,(b[0]-a[0])/L,(b[1]-a[1])/L];} acc+=L;}
  const a=path[path.length-2],b=path[path.length-1],L=Math.hypot(b[0]-a[0],b[1]-a[1])||1; return [b[0],b[1],(b[0]-a[0])/L,(b[1]-a[1])/L];}
const pathLen=p=>{let s=0; for(let i=1;i<p.length;i++)s+=Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]); return s;};
function trainMoving(b,now){if(!b.s||!b.t0||now>=b.a)return null; const p=trainPath(b); if(!p)return null; const len=pathLen(p), dur=clamp(len*.45,4,14)*1000;
  if(now<b.t0+dur)return {p,head:len-(now-b.t0)/dur*len,dir:-1}; if(now>b.a-dur)return {p,head:(now-(b.a-dur))/dur*len,dir:1}; return {p,head:-99,dir:0};}
function trainCars(mv){const out=[]; if(!mv||mv.head<-50)return out; const L=pathLen(mv.p); for(let k=0;k<3;k++){const d=mv.dir>0?mv.head-k*.95:mv.head+k*.95; if(d<-.5||d>L)continue; const [x,y,tx,ty]=along(mv.p,clamp(d,0,L)); out.push({x,y,tx:tx*mv.dir||tx,ty:ty*mv.dir||ty,k});} return out;}
function drawTrainVec(c,k,tx,ty,n){const col=k===0?'#d62828':'#2f6690';
  prism(c,0,0,tx,ty,-.42,.42,.17,2,2+(k===0?16:12),col,k===0?'#3a3a3a':col,n); if(k===0)prism(c,0,0,tx,ty,-.38,-.05,.12,18,23,'#3a3a3a',null,n);
  if(n>.25&&k===0){const [hx,hy]=P(tx*.42,ty*.42,8); ell2(c,hx,hy,1.6,'rgba(255,245,200,'+n+')');}}
function pushTrainCar(o,n){const z=hAt(clamp(o.x,0,N-.01),clamp(o.y,0,N-.01)); const ai=angIdx(o.tx,o.ty), a=ai/ANG*Math.PI*2;
  const fade=o.y>TUN.y-.2&&o.y<TUN.y+1.2?clamp((o.x-(TUN.x-.75))/.65,0,1):1; if(fade<=0)return; const [X,Y]=P(o.x,o.y,z);
  const sp=nt=>vecSprite('trem:'+o.k+':'+ai+':'+nt,[-34,-44,34,18],c=>drawTrainVec(c,o.k,Math.cos(a),Math.sin(a),nt));
  if(n<.99)pSprite(sp(0),X,Y,false,fade); if(n>0)pSprite(sp(1),X,Y,false,fade*(n>=.99?1:n));}
