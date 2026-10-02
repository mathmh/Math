/* ================= Extras animados: roda-gigante, eólicas, zoológico, aviões, iate, farol, fogo e fumaça =================
 Tudo vira sprite pronto (por quadro de animação) e entra na lista de desenho ordenada. */
function extraItems(items,now,n,vis){const nn=n>.5?1:0;
  for(const b of S.b){const t=T[b.k]; if(!vis(b,fw(b),fh(b)))continue; const done=now>=b.d;
    const base=b.x+b.y+(fw(b)+fh(b))/2+.001, zb=G.ht[b.y*N+b.x]*HZ;
    if(done&&t.anim==='ferris'){const [hx,hy]=P(b.x+fw(b)/2,b.y+fh(b)/2,zb+2+ferrisR()+8); const st=Math.floor(now/120)%24;
      items.push({d:base+.0005,t:9,f:()=>pSprite(vecSprite('ferris:'+st+':'+nn,[-34,-52,34,56],c=>ferrisCabins(c,0,0,ferrisR(),st/24*Math.PI/6,nn)),hx,hy)});}
    else if(done&&t.anim==='eolica'){const [hx,hy]=P(b.x+.5,b.y+.5,zb+73); const st=Math.floor(now/70+b.i*3)%12;
      items.push({d:base+.0005,t:9,f:()=>pSprite(vecSprite('pas:'+st+':'+nn,[-18,-30,18,30],c=>windBlades(c,0,0,0,st/12*Math.PI*2/3,nn)),hx,hy)});}
    else if(done&&t.anim==='zoo'){zooAnimals(items,b,now,base,zb,nn);}
    else if(done&&t.anim==='air'){planeItems(items,b,now,base,zb,nn);}
    else if(done&&t.anim==='iate'){const ph=(now/1000+b.i)%60/60, u=2.3+1.3*(.5-.5*Math.cos(ph*Math.PI*2)), bob=Math.sin(now/600)*1.2; const [x,y]=loc(b,u,1.6); const [X,Y]=P(x,y,bob);
      const dir=Math.sin(ph*Math.PI*2)>=0?1:-1; items.push({d:x+y+.3,t:9,f:()=>pSprite(vecSprite('iate:'+(b.f?1:0)+':'+dir+':'+nn,[-40,-40,40,16],c=>drawYacht(c,b.f?0:dir,b.f?dir:0,nn)),X,Y)});}
    if(done&&t.rec&&b.s==='run'&&now<b.a)smokeAt(items,b,now,base,zb,.5);
    if(b.fire)smokeAt(items,b,now,base,zb,1);}}
// fumaça subindo (chaminé da indústria ou incêndio)
let PUFFC=null; function puffImg(){if(PUFFC)return PUFFC; const c2=document.createElement('canvas'); c2.width=c2.height=48; const c=c2.getContext('2d'); const gr=c.createRadialGradient(24,24,0,24,24,24); gr.addColorStop(0,'rgba(120,120,125,.85)'); gr.addColorStop(1,'rgba(120,120,125,0)'); c.fillStyle=gr; c.fillRect(0,0,48,48); return PUFFC=c2;}
function smokeAt(items,b,now,base,zb,k){const [X,Y]=P(b.x+fw(b)/2,b.y+fh(b)/2,zb); const top=spriteTop('b',b.k,0)-(fw(b)+fh(b))*8;
  items.push({d:base+.0008,t:9,f:()=>{for(let i=0;i<4;i++){const q=((now/2400+i/4+b.i*.13)%1); const r=(6+q*14)*k; pImg(puffImg(),X-r+q*10*k,Y-top-q*36*k-r,r*2,r*2,(1-q)*.55*k);}}});}
function fireFx(b,now,X,Y){const top=spriteTop('b',b.k,0)-(fw(b)+fh(b))*8, fr=Math.floor(now/110)%4;
  for(const [u,s] of [[-.25,1],[.15,.8],[.35,.9]]){const [dx]=P(u*fw(b),-u*fh(b)); pSprite(vecSprite('chama:'+fr+':'+s,[-10,-26,10,3],c=>drawFlame(c,fr,s)),X+(fw(b)-fh(b))*16+dx*.6,Y+(fw(b)+fh(b))*8-top*.55);}}
function drawFlame(c,fr,s){const w=[1,.85,1.1,.95][fr]*s, h=[1,1.15,.9,1.05][fr]*s;
  c.fillStyle='rgba(255,120,30,.9)'; c.beginPath(); c.moveTo(-7*w,0); c.quadraticCurveTo(-8*w,-12*h,0,-24*h); c.quadraticCurveTo(8*w,-12*h,7*w,0); c.closePath(); c.fill();
  c.fillStyle='rgba(255,220,90,.95)'; c.beginPath(); c.moveTo(-3.5*w,0); c.quadraticCurveTo(-4*w,-8*h,0,-14*h); c.quadraticCurveTo(4*w,-8*h,3.5*w,0); c.closePath(); c.fill();}
function drawYacht(c,tx,ty,n){prism(c,0,0,tx||1e-6,ty,-.55,.55,.16,-1,4,'#fbfbfb','#d9d2c4',n); prism(c,0,0,tx||1e-6,ty,-.25,.2,.11,4,9,'#e8eef2','#2b3a55',n);
  const [mx,my]=P(0,0,9); line(c,[mx,my],[mx,my-22],nc('#9aa4ad',n),1.2); poly(c,[[mx,my-21],[mx+12,my-4],[mx,my-4]],nc('#f4f1ea',n));}

/* ---- zoológico: bichos andando de um lado para o outro nos recintos ---- */
const ZOO_A=[{k:'girafa',u:[.5,2],v:1.1,sp:22,col:'#e8b04a'},{k:'elefante',u:[.6,1.9],v:.7,sp:30,col:'#9aa0a6'},{k:'zebra',u:[.4,2.1],v:1.5,sp:16,col:'#f4f4f2'},
  {k:'hipo',u:[3.3,4.4],v:1,sp:34,col:'#8d7f8a'},{k:'flamingo',u:[3.1,4.6],v:1.55,sp:20,col:'#f4a7b9'},{k:'leao',u:[.5,2],v:2.6,sp:26,col:'#d9a24a'},
  {k:'macaco',u:[.5,2],v:2.3,sp:12,col:'#7a4b2a'},{k:'pinguim',u:[3.2,4.6],v:2.65,sp:14,col:'#2b2f36'},{k:'pinguim',u:[3.4,4.4],v:2.85,sp:17,col:'#2b2f36'}];
function zooAnimals(items,b,now,base,zb,nn){for(let i=0;i<ZOO_A.length;i++){const A=ZOO_A[i]; const ph=((now/1000)/A.sp+i*.37)%1, s=.5-.5*Math.cos(ph*Math.PI*2);
    const u=A.u[0]+(A.u[1]-A.u[0])*s, dir=Math.sin(ph*Math.PI*2)>=0?1:-1; const [x,y]=loc(b,u,A.v); const fr=Math.floor(now/180+i)%2;
    const [X,Y]=P(x,y,zb+2+(A.k==='hipo'?-1:0)); const flip=b.f?dir>0:dir<0;
    items.push({d:base+.0006+i*.00001,t:9,f:()=>pSprite(vecSprite('bicho:'+A.k+':'+fr+':'+nn,[-16,-36,16,4],c=>drawAnimal(c,A,fr,nn)),X,Y,flip)});}}
function drawAnimal(c,A,fr,n){const col=nc(A.col,n), dk=nc(sh(A.col,.7),n), leg=fr?1.2:-1.2; c.fillStyle='rgba(0,0,0,.18)'; c.beginPath(); c.ellipse(0,0,7,2.2,0,0,7); c.fill();
  const legs=(xs,h,w)=>{c.strokeStyle=dk; c.lineWidth=w||1.4; for(let k=0;k<xs.length;k++){const o=k%2?leg:-leg; c.beginPath(); c.moveTo(xs[k],-h); c.lineTo(xs[k]+o*.5,0); c.stroke();}};
  switch(A.k){
    case 'girafa':legs([-3,-1.5,2,3.5],9); c.fillStyle=col; c.beginPath(); c.ellipse(0,-11,5.5,3,0,0,7); c.fill(); c.strokeStyle=col; c.lineWidth=2.4; c.beginPath(); c.moveTo(3.5,-12); c.lineTo(7,-26); c.stroke();
      c.beginPath(); c.ellipse(8,-27,2.6,1.6,0,0,7); c.fill(); c.fillStyle=dk; for(const [a,b2] of [[-2,-11],[1,-12],[3,-10],[5.2,-19]]){c.beginPath(); c.arc(a,b2,1,0,7); c.fill();} break;
    case 'elefante':legs([-3.5,-1.5,1.5,3.5],6,2.6); c.fillStyle=col; c.beginPath(); c.ellipse(0,-9,7,4.8,0,0,7); c.fill(); c.beginPath(); c.ellipse(6.5,-10,3.4,3.2,0,0,7); c.fill();
      c.strokeStyle=col; c.lineWidth=1.8; c.beginPath(); c.moveTo(9,-9); c.quadraticCurveTo(10.5,-4,9.5,-1.5); c.stroke(); c.fillStyle=dk; c.beginPath(); c.ellipse(5,-10.5,2,2.8,0,0,7); c.fill(); break;
    case 'zebra':legs([-3,-1.5,2,3.2],6); c.fillStyle=col; c.beginPath(); c.ellipse(0,-8,5,2.8,0,0,7); c.fill(); c.beginPath(); c.ellipse(5.8,-11,2,1.4,-.5,0,7); c.fill();
      c.strokeStyle=nc('#222',n); c.lineWidth=.7; for(let k=-3;k<=3;k+=1.5){c.beginPath(); c.moveTo(k,-10.5); c.lineTo(k+.6,-5.5); c.stroke();} break;
    case 'hipo':c.fillStyle=nc('rgba(79,163,216,.0)',n); c.fillStyle=col; c.beginPath(); c.ellipse(0,-3,6,3,0,0,7); c.fill(); c.beginPath(); c.ellipse(5.5,-3.5,3,2.2,0,0,7); c.fill(); c.fillStyle='rgba(120,190,235,.55)'; c.fillRect(-8,-1.5,16,2.5); break;
    case 'flamingo':c.strokeStyle=nc('#e88aa0',n); c.lineWidth=.8; c.beginPath(); c.moveTo(0,-6); c.lineTo(fr?.8:-.2,0); c.stroke(); c.fillStyle=col; c.beginPath(); c.ellipse(0,-8,3,1.8,0,0,7); c.fill();
      c.strokeStyle=col; c.lineWidth=1.1; c.beginPath(); c.moveTo(2,-8.5); c.quadraticCurveTo(4,-13,2.5,-15); c.stroke(); c.fillStyle=nc('#2b2b2b',n); c.fillRect(2.3,-15.5,1.8,.9); break;
    case 'leao':legs([-3,-1.5,2,3.3],5,1.8); c.fillStyle=col; c.beginPath(); c.ellipse(0,-7,5.5,2.8,0,0,7); c.fill(); c.fillStyle=nc('#8a5a2a',n); c.beginPath(); c.arc(5.5,-9,3.4,0,7); c.fill();
      c.fillStyle=col; c.beginPath(); c.arc(6,-9,2.1,0,7); c.fill(); c.strokeStyle=col; c.lineWidth=1; c.beginPath(); c.moveTo(-5,-7); c.quadraticCurveTo(-8,-9,-7.5,-4); c.stroke(); break;
    case 'macaco':c.fillStyle=col; c.beginPath(); c.ellipse(0,-5+(fr?-1.5:0),2.4,3,0,0,7); c.fill(); c.beginPath(); c.arc(0,-9.5+(fr?-1.5:0),2.1,0,7); c.fill(); c.fillStyle=nc('#e8c9a0',n); c.beginPath(); c.arc(.6,-9.3+(fr?-1.5:0),1.1,0,7); c.fill();
      c.strokeStyle=col; c.lineWidth=.9; c.beginPath(); c.moveTo(-2,-4); c.quadraticCurveTo(-6,-6,-4,-11); c.stroke(); break;
    case 'pinguim':c.fillStyle=col; c.beginPath(); c.ellipse(0,-4.5,2.3,4,fr?.12:-.12,0,7); c.fill(); c.fillStyle=nc('#fbfbfb',n); c.beginPath(); c.ellipse(.6,-4,1.4,3,0,0,7); c.fill(); c.fillStyle=nc('#f2a33a',n); c.fillRect(1.6,-7.6,1.6,.8); break;}}

/* ---- aeroporto: um avião pousa, taxia e decola em ciclo ---- */
const AIR_CYCLE=52000;
function planeState(b,now){const W=Math.max(fw(b),fh(b)); const ph=((now+b.i*9000)%AIR_CYCLE)/AIR_CYCLE;
  if(ph<.30){const q=ph/.30; return {u:-8+(W*.6+8)*(1-(1-q)*(1-q)),alt:q<.75?110*(1-q/.75):0,back:false};}
  if(ph<.45)return {u:W*.6,alt:0,back:false};
  if(ph<.55){const q=(ph-.45)/.1; return {u:W*.6+(.4-W*.6)*q,alt:0,back:true};}
  if(ph<.62)return {u:.4,alt:0,back:false};
  if(ph<.92){const q=(ph-.62)/.3; return {u:.4+(W+12)*q*q,alt:q>.45?(q-.45)*220:0,back:false};}
  return null;}
function planeItems(items,b,now,base,zb,nn){const s=planeState(b,now); if(!s)return; const W=fw(b)>fh(b)?fw(b):fh(b), H=fw(b)>fh(b)?fh(b):fw(b);
  const [x,y]=loc(b,s.u,H-.95); const [X,Y]=P(x,y,zb+2+s.alt), [gx,gy]=P(x,y,zb+2.2);
  const key='aviao:'+(s.back?1:0)+':'+nn, spr=vecSprite(key,[-60,-40,60,20],c=>drawPlane(c,nn));
  const flip=b.f?!s.back:s.back;
  items.push({d:s.alt>6?1e6:base+.0009,t:9,f:()=>{if(s.alt<70)pImg(puffImg(),gx-22,gy-6,44,12,.35*(1-s.alt/70)); pSprite(spr,X,Y,flip);}});}
function drawPlane(c,n){const W=nc('#f4f7fa',n), dk=nc('#2b6cb0',n);
  prism(c,0,0,1,1e-6,-.95,.95,.11,0,7,W,W,n); prism(c,0,0,1,1e-6,.7,1,.08,1,6,'#d0d7de',W,n);
  poly(c,[P(-.2,-.75,4),P(.25,-.75,4),P(.35,0,4.5),P(.35,.75,4),P(-.1,.75,4),P(-.2,0,4.5)],nc('#d9e1e8',n),'rgba(0,0,0,.15)');
  poly(c,[P(-.95,-.25,6),P(-.75,-.25,6),P(-.7,0,15),P(-.92,0,15)],dk); poly(c,[P(-.95,-.3,7),P(-.8,-.3,7),P(-.8,.3,7),P(-.95,.3,7)],nc('#d9e1e8',n));
  for(let k=0;k<7;k++){const [wx,wy]=P(-.5+k*.18,.11,4.5); ell2(c,wx,wy,.7,nc('#5b7fa3',n));} const [ex,ey]=P(.15,.45,2.5); ell(c,ex,ey,2.5,1.6,nc('#9aa4ad',n));}

/* ---- luzes extras da noite: farol, aviões ---- */
function lightsExtra(now,n){for(const b of S.b){const t=T[b.k]; if(now<b.d)continue;
  if(t.anim==='farol'){const zb=G.ht[b.y*N+b.x]*HZ, [wx,wy]=loc(b,.85,.8), [px,py]=P(wx,wy,zb+74); const a=(now/1600)%(Math.PI*2);
    pImg(glowImg('255,240,180'),px-14,py-14,28,28,.9*n,false,true); pBeam('farol',px,py,a,260,22,.45*n);}
  if(t.anim==='air'){const s=planeState(b,now); if(s&&s.alt>2){const H=fw(b)>fh(b)?fh(b):fw(b), [x,y]=loc(b,s.u,H-.95), [X,Y]=P(x,y,G.ht[b.y*N+b.x]*HZ+2+s.alt); const bl=Math.floor(now/500)%2;
    pImg(glowImg(bl?'255,80,80':'120,255,140'),X-5,Y-9,10,10,.9*n,false,true);}}}}
function skyExtra(now,n,W,vx,vy,vw,vh){cloudShadows(now,W,vx,vy,vw,vh);}
