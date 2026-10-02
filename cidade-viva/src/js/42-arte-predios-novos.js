/* ================= Desenhos dos prédios novos (em código) =================
 Cada ART.x(c,t,a,v) desenha o lote de t.w x t.h quadrados. v===1 = miniatura (desenha também as partes que
 no mapa são animadas à parte: pás da eólica, cabines da roda-gigante). */
function stripes3(c,x0,x1,y,z,col,n){awningL(c,x0,x1,y,z,col,n||6);}
function crateRow(c,x0,y,z,n,cols){for(let k=0;k<n;k++){const u=x0+k*.22; box(c,u,y,u+.18,y+.16,z,z+3,'#b07a4a'); ellW(c,u+.09,y+.08,z+4,3.2,1.6,cols[k%cols.length]);}}
ART.farmmarket=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'p'); const Z=2;
  flat(c,.15,.15,W-.15,H-.15,2.03,'#d9cdb4');
  for(let s=0;s<3;s++){const x0=.25+s*.95,x1=x0+.75,y0=.35,y1=1.2;
    box(c,x0,y0+.35,x1,y1,Z,Z+7,'#9a6b3f'); crateRow(c,x0+.05,y1-.25,Z+7,3,[['#e63946','#7bc043','#f77f00'],['#ffd23f','#e63946','#7b2cbf'],['#7bc043','#ff5a36','#f4d35e']][s]);
    for(const [u,v] of [[x0+.03,y1-.03],[x1-.03,y1-.03],[x0+.03,y0+.38],[x1-.03,y0+.38]])line(c,P(u,v,Z),P(u,v,Z+18),'#6b4a2a',1.4);
    const col=['#d64545','#2f8f57','#f2c230'][s]; for(let k=0;k<5;k++){const a=x0-.05+(x1-x0+.1)*k/5,b=x0-.05+(x1-x0+.1)*(k+1)/5; poly(c,[P(a,y0+.3,Z+20),P(b,y0+.3,Z+20),P(b,y1+.08,Z+16),P(a,y1+.08,Z+16)],k%2?'#fffaf0':col,'rgba(0,0,0,.1)');}}
  box(c,.2,H-.45,.32,H-.33,Z,Z+22,'#6b4a2a'); box(c,W-.32,H-.45,W-.2,H-.33,Z,Z+22,'#6b4a2a'); box(c,.2,H-.45,W-.2,H-.33,Z+22,Z+27,'#2f8f57');
  const [sx,sy]=P(W/2,H-.33,Z+24.5); if(!LM){c.fillStyle='#fff';c.font='800 7px sans-serif';c.textAlign='center';c.fillText('FEIRA',sx,sy+2.5);}
  for(let k=0;k<4;k++)person(c,.6+k*.6,1.55+(k%2)*.1,['#e63946','#3e7bd6','#ffd23f','#2f9a5a'][k]);};
ART.coop=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'g'); const Z=2;
  box(c,.3,.3,2.1,H-.4,Z,Z+22,'#3f7d4a'); for(let k=0;k<8;k++)qR(c,2.1,.3,H-.4,k/8,k/8+.02,Z,Z+22,'rgba(0,0,0,.12)');
  qL(c,.3,2.1,H-.4,.3,.7,Z,Z+16,'#e8dcc2'); line(c,P(.3+.54,H-.4,Z),P(.3+1.26,H-.4,Z+16),'#c9b98f',1.2); line(c,P(.3+1.26,H-.4,Z),P(.3+.54,H-.4,Z+16),'#c9b98f',1.2);
  gableY(c,.2,.2,2.2,H-.3,Z+22,13,'#d9a520','#3f7d4a');
  for(const [x,y] of [[2.5,.5],[2.6,1.15]]){cyl(c,x,y,Z,Z+38,.28,'#cfd4d9'); const [px,py]=P(x,y,Z+38); ell(c,px,py-4,9.5,6,'#aab3bb');}
  box(c,.5,H-.32,1.3,H-.12,Z+12,Z+18,'#fff'); const [sx,sy]=P(.9,H-.12,Z+15); if(!LM){c.fillStyle='#2f8f57';c.font='800 5px sans-serif';c.textAlign='center';c.fillText('COOP',sx,sy+2);}
  box(c,2.3,H-.5,2.75,H-.25,Z,Z+5,'#c0392b'); ellW(c,2.38,H-.27,Z+3,3,3,'#222'); ellW(c,2.68,H-.27,Z+3,2.2,2.2,'#222');};
ART.botanic=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'g'); const Z=2;
  flat(c,W*.45,.1,W*.55,H-.1,2.05,'#e3d6b8'); flat(c,.1,H*.62,W-.1,H*.7,2.05,'#e3d6b8');
  for(const [x0,y0,x1,y1,col] of [[.25,2.9,1.6,3.75,'#ff5d8f'],[2.4,2.9,3.75,3.75,'#ffd23f'],[.25,.3,1.5,.9,'#b388eb']]){flat(c,x0,y0,x1,y1,2.08,'#5a8a3a'); for(let k=0;k<12;k++){const u=x0+.1+((hsh(k,x0*10|0,3)%100)/100)*(x1-x0-.2),v=y0+.1+((hsh(k,7,y0*10|0)%100)/100)*(y1-y0-.2); ellW(c,u,v,2.5,1.8,1.4,col);}}
  const [qx,qy]=P(3.1,1.2,2.1); ell(c,qx,qy,20,9,'#4fa3d8'); ell(c,qx-3,qy-1,7,3,'rgba(255,255,255,.35)');
  // estufa de vidro
  const cx=1.7,cy=1.5,R=.95; box(c,cx-R,cy-R*.75,cx+R,cy+R*.75,Z,Z+6,'#e8e6e1');
  const [dx,dy]=P(cx,cy,Z+6); if(!LM){c.beginPath();c.ellipse(dx,dy,R*44,R*22,0,Math.PI,0);c.bezierCurveTo(dx+R*44,dy-60,dx-R*44,dy-60,dx-R*44,dy);c.fillStyle='rgba(170,225,240,.72)';c.fill();
    c.strokeStyle='rgba(255,255,255,.85)';c.lineWidth=1;for(let k=-3;k<=3;k++){c.beginPath();c.moveTo(dx+k*R*13,dy+Math.abs(k)*.5);c.quadraticCurveTo(dx+k*R*8,dy-48,dx,dy-45);c.stroke();}
    for(const f of [.35,.7]){c.beginPath();c.ellipse(dx,dy-45*f,R*44*(1-f*.6),R*22*(1-f*.6),0,Math.PI,0);c.stroke();}
    for(let k=0;k<5;k++)ell(c,dx-24+k*12,dy-10-(k%2)*6,7,8,'rgba(60,140,60,.55)');}
  ell(c,dx,dy-47,3,2.5,'#e8e6e1');
  treeAt(c,3.6,.4,.7,0); treeAt(c,.35,2.3,.65,1); treeAt(c,3.65,2.35,.7,2); bench(c,2.1,2.6,.8);};
ART.observatory=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'p'); const Z=2;
  for(let s=0;s<3;s++)box(c,.9+s*.05,H-.75+s*.1,W-.9-s*.05,H-.6+s*.1,Z,Z+5-s*1.6,'#d6d1c4');
  box(c,.45,.45,W-.45,H-.75,Z,Z+26,'#f4f2ec'); winGrid(c,.45,.45,W-.45,H-.75,Z+4,Z+24,2,4,4,'#2b3a55',1); qL(c,.45,W-.45,H-.75,.42,.58,Z,Z+11,'#4b5563');
  box(c,.4,.4,W-.4,H-.7,Z+26,Z+28,'#d9d6cf');
  const mx=(W)/2,my=(H-.3)/2; const [dx,dy]=P(mx,my,Z+28); if(!LM){c.beginPath();c.ellipse(dx,dy,36,18,0,0,Math.PI*2);c.fillStyle='#c9ccd1';c.fill();
    c.beginPath();c.ellipse(dx,dy,34,17,0,Math.PI,0);c.bezierCurveTo(dx+34,dy-40,dx-34,dy-40,dx-34,dy);const gr=c.createLinearGradient(dx-34,0,dx+34,0);gr.addColorStop(0,'#f7f8fa');gr.addColorStop(1,'#a9b0b8');c.fillStyle=gr;c.fill();
    c.fillStyle='#2b3a55';c.beginPath();c.moveTo(dx-5,dy-3);c.lineTo(dx-4,dy-34);c.lineTo(dx+4,dy-34);c.lineTo(dx+5,dy-3);c.closePath();c.fill();
    c.strokeStyle='#6b7280';c.lineWidth=3;c.beginPath();c.moveTo(dx,dy-14);c.lineTo(dx+10,dy-36);c.stroke();}
  else{ell2(c,dx,dy-20,4,'#9ecbff');}
  flag(c,.6,H-.7,Z+2,'#3e7bd6'); shrub(c,.5,H-.35,.6); shrub(c,W-.5,H-.35,.6);};
ART.ferris=(c,t,a,v)=>{const W=t.w,H=t.h; lot(c,W,H,'p'); const Z=2; const cx=W/2,cy=H/2;
  flat(c,.3,.3,W-.3,H-.3,2.05,'#e9e1cf'); box(c,.3,H-.75,.95,H-.3,Z,Z+12,'#e85d2a'); hip(c,.25,H-.8,1,H-.25,Z+12,5,'#f2c230');
  const R=ferrisR(); const [hx,hy]=P(cx,cy,Z+R+8);
  for(const s of [-1,1]){const [ax,ay]=P(cx-.6,cy+s*.28,Z),[bx,by]=P(cx+.6,cy+s*.28,Z); line(c,[ax,ay],[hx,hy+s*1.5],'#5b6068',2.4); line(c,[bx,by],[hx,hy+s*1.5],'#5b6068',2.4);}
  if(!LM){c.strokeStyle='#d64545';c.lineWidth=2.4;c.beginPath();c.ellipse(hx,hy,R*.62,R,0,0,Math.PI*2);c.stroke(); c.strokeStyle='rgba(120,120,130,.8)';c.lineWidth=.8;
    for(let k=0;k<12;k++){const an=k*Math.PI/6; c.beginPath();c.moveTo(hx,hy);c.lineTo(hx+Math.cos(an)*R*.62,hy+Math.sin(an)*R);c.stroke();}}
  ell2(c,hx,hy,3,'#f2c230'); if(v===1)ferrisCabins(c,hx,hy,R,0,0);};
const ferrisR=()=>44;
function ferrisCabins(c,hx,hy,R,ang,n){const cols=['#e63946','#2b6cb0','#2f9a5a','#f2c230','#a64fd6','#ff8c42'];
  for(let k=0;k<12;k++){const an=ang+k*Math.PI/6, x=hx+Math.cos(an)*R*.62, y=hy+Math.sin(an)*R;
    c.fillStyle=nc(cols[k%6],n); c.beginPath(); c.roundRect?c.roundRect(x-3,y+1,6,5,1.5):c.rect(x-3,y+1,6,5); c.fill(); c.fillStyle=nc('#555',n); c.fillRect(x-.4,y-1,.8,2.5);}}
ART.museum=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'p'); const Z=2,x0=.3,y0=.3,x1=W-.3,y1=H-.6;
  box(c,x0,y0,x1,y1,Z,Z+26,'#9e4a35'); for(let z=Z+2;z<Z+26;z+=3)qL(c,x0,x1,y1,0,1,z,z+.5,'rgba(0,0,0,.08)');
  for(let k=0;k<6;k++)wL(c,x0,x1,y1,(k+.18)/6,(k+.82)/6,Z+12,Z+22,k,'#cfe0ea'); qL(c,x0,x1,y1,.4,.6,Z,Z+11,'#cfe9f5'); box(c,x0+(x1-x0)*.38,y1,x0+(x1-x0)*.62,y1+.3,Z+11,Z+13,'#3b3b3b');
  for(let k=0;k<4;k++){const a=x0+k*(x1-x0)/4, b=a+(x1-x0)/4; poly(c,[P(a,y0,Z+26),P(b,y0,Z+26),P(b,y0,Z+36),P(a,y0,Z+26)],'#6b7280'); poly(c,[P(a,y0,Z+26),P(a,y1,Z+26),P(b,y1,Z+36),P(b,y0,Z+36)],k%2?'#9aa4ad':'#aab3bb','rgba(0,0,0,.15)'); qR(c,b,y0,y1,.1,.9,Z+28,Z+34,'#cfe9f5');}
  cyl(c,x1-.35,y0+.35,Z+26,Z+70,.18,'#8a3a2a'); const [gx,gy]=P(x0+(x1-x0)*.5,y1,Z+20); if(!LM){c.fillStyle='#d9b23a';c.beginPath();for(let k=0;k<16;k++){const an=k*Math.PI/8,r=k%2?5:7;c.lineTo(gx+Math.cos(an)*r,gy-6+Math.sin(an)*r);}c.closePath();c.fill();ell2(c,gx,gy-6,2.2,'#9e4a35');}
  box(c,x0+.2,y1+.15,x0+.7,y1+.45,Z,Z+6,'#3a3a3a'); box(c,x0+.25,y1+.18,x0+.65,y1+.42,Z+6,Z+9,'#555');};
ART.campus=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'g'); const Z=2;
  flat(c,1.4,1.3,W-1.4,H-.4,2.06,'#8fcf6c'); flat(c,W/2-.12,1.2,W/2+.12,H-.05,2.08,'#e0d8c8'); flat(c,1.3,2.35,W-1.3,2.55,2.08,'#e0d8c8');
  // prédio principal com torre do relógio (fundo)
  box(c,1.2,.25,W-1.2,1.15,Z,Z+30,'#c9b28a'); winGrid(c,1.2,.25,W-1.2,1.15,Z+3,Z+28,2,6,2,null,1); qL(c,1.2,W-1.2,1.15,.44,.56,Z,Z+14,'#6b4423');
  for(let k=0;k<6;k++)box(c,1.5+k*.4,1.15,1.56+k*.4,1.22,Z,Z+26,'#fffaf0'); box(c,1.4,1.1,W-1.4,1.3,Z+26,Z+30,'#e9ddc4');
  hip(c,1.15,.2,W-1.15,1.2,Z+30,9,'#7a3b2e'); const mx=W/2; box(c,mx-.3,.45,mx+.3,1.05,Z+30,Z+74,'#c9b28a'); const [kx,ky]=P(mx,1.05,Z+62); ell(c,kx,ky,5,5,'#fff'); line(c,[kx,ky],[kx,ky-4],'#333',1); line(c,[kx,ky],[kx+3,ky],'#333',1);
  pyr(c,mx-.36,.4,mx+.36,1.1,Z+74,18,'#7a3b2e');
  // blocos laterais
  box(c,.25,.3,1.1,H-.3,Z,Z+24,'#b4553f'); winGrid(c,.25,.3,1.1,H-.3,Z+3,Z+22,2,2,7,null); gable(c,.2,.25,1.15,H-.25,Z+24,9,'#4a4a4a','#b4553f');
  box(c,W-1.1,1.5,W-.25,H-.3,Z,Z+34,'#dfe8ee'); winGrid(c,W-1.1,1.5,W-.25,H-.3,Z+2,Z+33,3,3,5,'#8fc3dc'); box(c,W-1.14,1.46,W-.21,H-.26,Z+34,Z+36,'#9aa4ad');
  for(const [x,y] of [[1.7,1.7],[W-1.7,1.75],[1.7,H-.9],[W-1.7,H-.85]])treeAt(c,x,y,.6,(x*3|0)%3);
  bench(c,mx-.6,2.2,.8); for(let k=0;k<5;k++)person(c,1.8+k*.35,2.75+(k%2)*.3,['#3e7bd6','#e63946','#2f9a5a','#a64fd6','#f2c230'][k]);};
ART.zoo=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'g'); const Z=2;
  flat(c,.1,H-.85,W-.1,H-.55,2.05,'#e3d6b8'); flat(c,W*.48,.1,W*.56,H-.55,2.05,'#e3d6b8');
  // savana (fundo esquerda), lagoa (fundo direita), floresta (frente esquerda), pinguins (frente direita)
  flat(c,.2,.2,2.3,1.8,2.07,'#e3c98e'); treeAt(c,.6,.55,.6,2); for(let k=0;k<4;k++)ellW(c,.8+k*.4,1.3,2.2,3,1.5,'#c9a96a');
  flat(c,2.85,.2,W-.2,1.8,2.07,'#9ad07a'); const [px,py]=P(3.9,1,2.1); ell(c,px,py,30,13,'#4fa3d8'); ell(c,px+5,py-2,10,3,'rgba(255,255,255,.35)');
  flat(c,.2,2.1,2.3,H-1.05,2.07,'#5f9a45'); treeAt(c,.6,2.5,.65,0); treeAt(c,1.9,2.4,.6,1);
  flat(c,2.85,2.1,W-.2,H-1.05,2.07,'#e8f1f5'); flat(c,3.3,2.35,4.4,2.9,2.1,'#6cc0ee');
  for(const [x0,y0,x1,y1] of [[.2,.2,2.3,1.8],[2.85,.2,W-.2,1.8],[.2,2.1,2.3,H-1.05],[2.85,2.1,W-.2,H-1.05]]){
    for(let k=0;k<=8;k++){const u=x0+(x1-x0)*k/8; line(c,P(u,y1,2),P(u,y1,9),'#6b4a2a',1); } line(c,P(x0,y1,8),P(x1,y1,8),'#6b4a2a',1.2); line(c,P(x1,y0,8),P(x1,y1,8),'#6b4a2a',1.2);}
  // portal de entrada
  const gx=W/2+.05; box(c,gx-.7,H-.5,gx-.55,H-.35,Z,Z+26,'#7a4b2a'); box(c,gx+.55,H-.5,gx+.7,H-.35,Z,Z+26,'#7a4b2a'); box(c,gx-.75,H-.52,gx+.75,H-.33,Z+26,Z+31,'#2f8f57');
  const [sx,sy]=P(gx,H-.33,Z+28.5); if(!LM){c.fillStyle='#fff';c.font='800 7px sans-serif';c.textAlign='center';c.fillText('ZOO',sx,sy+2.5);}
  shrub(c,.3,H-.3,.6); shrub(c,W-.3,H-.3,.6);};
ART.lighthouse=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'b'); const Z=2; const mx=.85,my=.8;
  box(c,1.1,1.05,W-.15,H-.15,Z,Z+12,'#f4f1ea'); gable(c,1.05,1,W-.1,H-.1,Z+12,7,'#c0392b','#f4f1ea'); wL(c,1.1,W-.15,H-.15,.3,.7,Z+3,Z+9,1);
  for(let k=0;k<6;k++)cyl(c,mx,my,Z+k*11,Z+(k+1)*11,.34-k*.025,k%2?'#d64545':'#fbfaf6');
  box(c,mx-.32,my-.32,mx+.32,my+.32,Z+66,Z+68,'#3a3a3a'); cyl(c,mx,my,Z+68,Z+78,.17,'#ffe9a0','#3a3a3a'); pyr(c,mx-.22,my-.22,mx+.22,my+.22,Z+78,8,'#2b2f36');
  for(let k=0;k<3;k++)ellW(c,.3+k*.2,H-.3,2.3,4,2,'#9a958b');};
ART.airport=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'c'); const Z=2;
  // pista (frente, ao longo de x)
  flat(c,.05,H-1.55,W-.05,H-.35,2.04,'#4b5058'); for(let k=0;k<14;k++)flat(c,.4+k*.47,H-.98,.62+k*.47,H-.92,2.06,'#f4f1e6');
  for(const yy of [H-1.5,H-.4])flat(c,.05,yy-.03,W-.05,yy+.03,2.06,'#f2c230'); for(let k=0;k<6;k++)flat(c,.12,H-1.45+k*.17,.42,H-1.38+k*.17,2.06,'#f4f1e6');
  flat(c,.05,.15,W-.05,H-1.6,2.03,'#9da3ab');
  // terminal
  box(c,.3,.25,3.6,1.45,Z,Z+22,'#e9eef2'); wL(c,.3,3.6,1.45,.03,.97,Z+3,Z+19,2,'#8fc3dc'); box(c,.25,.2,3.65,1.5,Z+22,Z+25,'#cfd6dc');
  const [dx,dy]=P(1.95,.85,Z+25); if(!LM){c.beginPath();c.ellipse(dx,dy,60,14,0,Math.PI,0);c.fillStyle='#f4f7fa';c.fill();}
  for(let k=0;k<3;k++){const u=.8+k*1.1; box(c,u,1.45,u+.12,2.2,Z+7,Z+10,'#cfd6dc');}
  // torre de controle
  cyl(c,4.4,.6,Z,Z+58,.16,'#e9eef2'); box(c,4.15,.35,4.65,.85,Z+58,Z+66,'#8fc3dc'); box(c,4.1,.3,4.7,.9,Z+66,Z+68,'#3a3a3a');
  // hangar
  box(c,5.1,.3,W-.3,1.6,Z,Z+20,'#aab3bb'); for(let k=0;k<8;k++)qL(c,5.1,W-.3,1.6,k/8,k/8+.02,Z,Z+18,'rgba(0,0,0,.12)'); gableY(c,5.05,.25,W-.25,1.65,Z+20,8,'#7a838c','#aab3bb');
  const [lx,ly]=P(5.6,1.6,Z+16); if(!LM){c.fillStyle='#2b6cb0';c.font='800 6px sans-serif';c.textAlign='center';c.fillText('AERO',lx+10,ly+3);}
  for(const [x,y] of [[.15,H-.25],[W-.15,H-.25],[.15,H-1.65],[W-.15,H-1.65]]){const [qx,qy]=P(x,y,Z); ell2(c,qx,qy-2,1.6,LM?'#ffe9a0':'#f4f1e6');}};
ART.marina=(c,t)=>{const W=t.w,H=t.h; const Z=2;
  box(c,.02,.02,1.98,H-.02,0,2,'#cbc8c0',null,true); box(c,.25,.3,1.5,1.35,Z,Z+16,'#f4f1ea'); hip(c,.2,.25,1.55,1.4,Z+16,7,'#2b6cb0'); wL(c,.25,1.5,1.35,.1,.9,Z+3,Z+12,1,'#bfe3f2');
  flag(c,1.7,1.7,Z,'#2f9a5a');
  box(c,2,.85,W-.05,1.15,Z-1,Z+1,'#9a6b3f',null,true); for(const u of [2.6,3.3])box(c,u,.2,u+.18,H-.1,Z-1,Z+1,'#9a6b3f',null,true);
  for(let k=0;k<5;k++){const u=2.1+k*.4; line(c,P(u,1.15,-5),P(u,1.15,Z),'#5a3c22',1.6);}
  for(const [x,y,col] of [[2.35,.45,'#fff'],[3.0,1.55,'#e8eef2'],[3.65,.45,'#fff']]){prism(c,x,y,0,1,-.3,.3,.1,-1,3,col,'#d9d2c4',0); line(c,P(x,y,3),P(x,y,18),'#888',1);}};
ART.windmill=(c,t,a,v)=>{const Z=0; const [bx,by]=P(.5,.5,Z); ell(c,bx+2,by,9,4,'rgba(0,0,0,.18)'); box(c,.38,.38,.62,.62,Z,Z+4,'#cfd0cb');
  cyl(c,.5,.5,Z+4,Z+70,.07,'#f4f5f6'); box(c,.42,.38,.6,.58,Z+70,Z+76,'#e6e8ea'); if(v===1)windBlades(c,.5,.5,Z+73,0,0);};
function windBlades(c,x,y,z,ang,n){const [hx,hy]=P(x,y,z); const col=nc('#fbfbfb',n);
  for(let k=0;k<3;k++){const an=ang+k*Math.PI*2/3; const ex=hx+Math.cos(an)*26*.55, ey=hy+Math.sin(an)*26;
    c.strokeStyle=nc('#c9ccd0',n); c.lineWidth=3.2; c.lineCap='round'; c.beginPath(); c.moveTo(hx,hy); c.lineTo(ex,ey); c.stroke(); c.strokeStyle=col; c.lineWidth=2; c.stroke();}
  ell2(c,hx,hy,2.4,nc('#e6e8ea',n));}
ART.solar=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'b'); const Z=2;
  for(let r=0;r<4;r++)for(let k=0;k<3;k++){const x0=.25+k*.9,x1=x0+.75,y0=.25+r*.68,y1=y0+.42;
    poly(c,[P(x0,y0,Z+7),P(x1,y0,Z+7),P(x1,y1,Z+2.5),P(x0,y1,Z+2.5)],'#24407a','rgba(200,220,255,.6)');
    for(let q=1;q<4;q++){const u=x0+(x1-x0)*q/4; line(c,P(u,y0,Z+7),P(u,y1,Z+2.5),'rgba(170,200,240,.55)',.6);} line(c,P(x0,(y0+y1)/2,Z+4.75),P(x1,(y0+y1)/2,Z+4.75),'rgba(170,200,240,.55)',.6);
    poly(c,[P(x0+.1,y0+.04,Z+6.6),P(x0+.35,y0+.04,Z+6.6),P(x0+.3,y0+.2,Z+5),P(x0+.05,y0+.2,Z+5)],'rgba(255,255,255,.25)');}
  box(c,W-.55,H-.45,W-.2,H-.15,Z,Z+8,'#cfd4d9');};
ART.mine=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'c'); const Z=2;
  box(c,.15,.15,1.6,H-.5,Z,Z+24,'#7d756a'); for(let k=0;k<5;k++)line(c,P(.15+k*.3,H-.5,Z+4+k*3),P(.45+k*.3,H-.5,Z+10+k*3),'rgba(40,30,20,.3)',1);
  qL(c,.15,1.6,H-.5,.3,.7,Z,Z+14,'#1c1b19'); box(c,.5,H-.55,.62,H-.45,Z,Z+16,'#6b4a2a'); box(c,1.13,H-.55,1.25,H-.45,Z,Z+16,'#6b4a2a'); box(c,.48,H-.57,1.27,H-.43,Z+14,Z+17,'#6b4a2a');
  for(const s of [-1,1]){line(c,P(2.2+s*.25,.4,Z),P(2.2,.4,Z+40),'#5b6068',1.8);} line(c,P(2.2,.4,Z+40),P(2.2,.9,Z+36),'#5b6068',1.8); ellW(c,2.2,.4,Z+40,4,4,'#c0392b');
  for(const o of [-.08,.08])line(c,P(.9+o,H-.45,Z),P(W-.2,H-.45+o,Z),'#5b6068',1); box(c,1.8,H-.6,2.2,H-.3,Z+1,Z+6,'#8a5a32'); for(let k=0;k<3;k++)ellW(c,1.85+k*.12,H-.45,Z+7,2.6,1.8,'#8a4a3a');
  for(let k=0;k<3;k++){const [qx,qy]=P(2.3+k*.22,.95+k*.12,Z); ell(c,qx,qy-3,8-k,4,'#7a4334');}};
ART.quarryd=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'b'); const Z=2;
  for(let s=0;s<3;s++)flat(c,.3+s*.3,.3+s*.3,W-.3-s*.3,H-.9-s*.15,2.05-s*.0,['#d8c08a','#cdb27a','#bfa16a'][s]);
  for(let s=0;s<3;s++)line(c,P(.3+s*.3,H-.9-s*.15,2.05),P(W-.3-s*.3,H-.9-s*.15,2.05),'rgba(80,60,30,.4)',1.2);
  line(c,P(1.4,1.4,Z+2),P(2.6,H-.4,Z+16),'#5b6068',3); line(c,P(1.4,1.4,Z+3),P(2.6,H-.4,Z+17),'#2b2b2b',1.5);
  for(let k=0;k<3;k++){const [qx,qy]=P(2.6+k*.1,H-.35+k*.05,Z); ell(c,qx,qy-4,12-k*2,6,'#f1eee6');}
  box(c,.4,H-.65,.95,H-.35,Z,Z+7,'#f2c230'); box(c,.45,H-.62,.62,H-.38,Z+7,Z+11,'#3a3a3a');};
ART.garden=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'g'); const Z=2;
  for(let r=0;r<2;r++)for(let k=0;k<2;k++){const x0=.2+k*.85,y0=.2+r*.85; box(c,x0,y0,x0+.65,y0+.6,Z,Z+3,'#8a5a32','#5a3a22');
    for(let q=0;q<6;q++)ellW(c,x0+.12+(q%3)*.2,y0+.15+((q/3)|0)*.28,Z+4,2.6,2,['#3f8f3a','#5cb04f','#e63946','#f77f00'][(q+r+k)%4]);}
  box(c,1.55,1.4,1.85,1.8,Z,Z+10,'#b07a4a'); gable(c,1.5,1.35,1.9,1.85,Z+10,5,'#7a5230'); person(c,1.2,1.75,'#2f9a5a');};
ART.mural=(c)=>{box(c,.1,.4,.9,.6,0,22,'#efe6d8'); const cols=['#e63946','#ffd23f','#3ecfc0','#a64fd6','#2b6cb0'];
  for(let k=0;k<5;k++)qL(c,.1,.9,.6,k*.2,k*.2+.2,2+((k*7)%9),12+((k*5)%9),cols[k]); qL(c,.1,.9,.6,.15,.85,14,18,'#2b2b33');};
ART.playground=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'g'); flat(c,.15,.15,W-.15,H-.15,2.05,'#e8d8a8'); const Z=2;
  box(c,.3,.3,.7,.7,Z,Z+14,'#e85d2a'); poly(c,[P(.7,.35,Z+14),P(.7,.65,Z+14),P(1.4,.65,Z+2),P(1.4,.35,Z+2)],'#f2c230'); pyr(c,.28,.28,.72,.72,Z+14,6,'#2b6cb0');
  for(const u of [1.1,1.7])line(c,P(u,1.3,Z),P(u,1.3,Z+16),'#5b6068',1.6); line(c,P(1.1,1.3,Z+16),P(1.7,1.3,Z+16),'#5b6068',1.6);
  for(const u of [1.25,1.55]){line(c,P(u,1.3,Z+16),P(u,1.3,Z+5),'#888',.8); box(c,u-.06,1.26,u+.06,1.34,Z+4,Z+5,'#d64545');}
  flat(c,.3,1.2,.85,1.75,2.08,'#f1e2b0'); ellW(c,.55,1.5,2.5,4,2,'#d64545');};
ART.drinker=(c)=>{box(c,.38,.38,.62,.62,0,9,'#bfb8aa'); box(c,.34,.34,.66,.66,9,11,'#a39e94'); const [px,py]=P(.5,.5,11); ell(c,px,py,3,1.5,'#6cc0ee');};
ART.kiosk=(c)=>{box(c,.25,.25,.75,.75,0,10,'#b07a4a'); for(let k=0;k<4;k++)line(c,P(.28+k*.15,.75,10),P(.28+k*.15,.75,18),'#7a5230',1);
  pyr(c,.12,.12,.88,.88,18,9,'#d9c27a'); for(let k=0;k<3;k++)ellW(c,.35+k*.15,.8,6,2.4,2.4,'#5a8a2a');};
ART.mosaic=(c)=>{const cols=['#2b6cb0','#ffd23f','#e63946','#3ecfc0','#f4f1ea']; for(let k=0;k<6;k++){const u=.12+k*.13; box(c,u,.4,u+.13,.6,0,5,cols[k%5]);} box(c,.12,.55,.9,.62,5,11,'#3ecfc0');};
