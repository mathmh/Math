/* ================= Desenhos dos prédios (em código) ================= */
let SID=7;
const ART={};
ART.house=(c,t,a)=>{const W=t.w,H=t.h; lot(c,W,H,a.lot); const fl=a.fl||1, Z=2, Ht=a.H||18;
  let x0=.32,y0=.3,x1=W-.32,y1=H-.38, gx=null;
  if(a.garage){gx=x1; x1=x1-(W>2?1:.78);}
  if(a.garage)box(c,x1,y0+.25,gx,y1,Z,Z+12,a.wall);
  box(c,x0,y0,x1,y1,Z,Z+Ht,a.wall);
  if(a.siding||a.planks){for(let z=Z+3;z<Z+Ht-1;z+=3)qL(c,x0,x1,y1,0,1,z,z+.6,'rgba(0,0,0,.07)');}
  if(a.planks){for(let k=1;k<8;k++)qR(c,x1,y0,y1,k/8,k/8+.02,Z,Z+Ht,'rgba(0,0,0,.12)');}
  if(a.brick){qL(c,x0,x1,y1,0,1,Z,Z+Ht*.42,'#a3523c'); qR(c,x1,y0,y1,0,1,Z,Z+Ht*.42,'#8a4331');}
  const nl=Math.max(2,Math.round((x1-x0)*1.7)), nr=Math.max(1,Math.round((y1-y0)*1.4)), fh=Ht/fl, door=Math.min(nl-1,Math.floor(nl/2));
  for(let f=0;f<fl;f++){const za=Z+f*fh+fh*.3, zb=Z+f*fh+fh*.78;
    for(let k=0;k<nl;k++){if(f===0&&k===door)continue; const u0=(k+.22)/nl,u1=(k+.78)/nl; wL(c,x0,x1,y1,u0,u1,za,zb,f*10+k);
      if(a.shut){qL(c,x0,x1,y1,u0-.07/nl*3,u0,za,zb,a.shut); qL(c,x0,x1,y1,u1,u1+.07/nl*3,za,zb,a.shut);}}
    for(let k=0;k<nr;k++)wR(c,x1,y0,y1,(k+.25)/nr,(k+.75)/nr,za,zb,f*10+k+5);}
  const du=(door+.5)/nl, dx=x0+(x1-x0)*du; qL(c,x0,x1,y1,du-.32/nl,du+.32/nl,Z,Z+Math.min(fh*.72,13),DOOR);
  if(a.garage){qL(c,x1,gx,y1,.15,.85,Z,Z+9,'#e9e6df'); for(let z=Z+2;z<Z+9;z+=2.2)qL(c,x1,gx,y1,.15,.85,z,z+.5,'rgba(0,0,0,.12)'); hip(c,x1-.05,y0+.2,gx+.06,y1+.06,Z+12,6,a.roof);}
  if(a.balcony&&fl>1){box(c,x0+(x1-x0)*.1,y1,x0+(x1-x0)*.9,y1+.22,Z+fh,Z+fh+1.5,'#8a5a3a'); for(let k=0;k<6;k++){const u=x0+(x1-x0)*(.12+k*.15); ellW(c,u,y1+.15,Z+fh+3.5,2.5,1.8,['#ff5d8f','#ffd23f','#ff8c42'][k%3]);}}
  walk(c,dx,y1,H,.13);
  if(a.porch){box(c,dx-.35,y1,dx+.35,y1+.3,Z+Math.min(fh*.8,14),Z+Math.min(fh*.8,14)+1.6,sh(a.wall,.85)); line(c,P(dx-.3,y1+.28,Z),P(dx-.3,y1+.28,Z+Math.min(fh*.8,14)),'#fff',1.4); line(c,P(dx+.3,y1+.28,Z),P(dx+.3,y1+.28,Z+Math.min(fh*.8,14)),'#fff',1.4);}
  if(a.chair){const u=dx+.45; box(c,u,y1+.05,u+.16,y1+.2,Z,Z+3,'#ffffff'); box(c,u,y1+.05,u+.04,y1+.2,Z+3,Z+7,'#ffffff');}
  const rh=a.low?6:(x1-x0<1.6?10:12)+((y1-y0)>1.5?3:0);
  if(a.rt==='gable')gable(c,x0-.12,y0-.12,x1+.12,y1+.12,Z+Ht,rh,a.roof,a.wall);
  else if(a.rt==='gabley')gableY(c,x0-.12,y0-.12,x1+.12,y1+.12,Z+Ht,rh,a.roof,a.wall);
  else if(a.rt==='flat')box(c,x0-.05,y0-.05,x1+.05,y1+.05,Z+Ht,Z+Ht+2,sh(a.wall,.8));
  else hip(c,x0-.12,y0-.12,x1+.12,y1+.12,Z+Ht,rh,a.roof);
  if(!a.low&&a.rt!=='flat')box(c,x0+.25,y0+.15,x0+.45,y0+.35,Z+Ht+2,Z+Ht+rh*.8,'#8a5a44');
  if(a.laundry){const p=P(x1+.15,y1-.1,Z+9),q=P(x1+.15,y0+.2,Z+9); line(c,p,q,'#777',.8); ['#ff5d8f','#3e7bd6','#ffd23f'].forEach((col,i)=>{const u=.25+i*.25; const [px,py]=[p[0]+(q[0]-p[0])*u,p[1]+(q[1]-p[1])*u]; poly(c,[[px-2,py],[px+2,py-1],[px+2,py+4],[px-2,py+5]],col);});}
  shrub(c,x0+.15,y1+.22,.7); shrub(c,x1-.1,y1+.25,.6,'#4c9a3f');};
ART.row=(c,t,a)=>{const W=t.w,H=t.h; lot(c,W,H,a.lot); const n=a.cols.length,Z=2,Ht=a.H; const x0=.25,y0=.32,x1=W-.25,y1=H-.38;
  for(let i=0;i<n;i++){const ax=x0+(x1-x0)*i/n, bx=x0+(x1-x0)*(i+1)/n; box(c,ax,y0,bx,y1,Z,Z+Ht,a.cols[i]);
    wL(c,ax,bx,y1,.12,.42,Z+5,Z+13,i*3); qL(c,ax,bx,y1,.58,.82,Z,Z+12,DOOR); walk(c,ax+(bx-ax)*.7,y1,H,.1);}
  for(let k=0;k<2;k++)wR(c,x1,y0,y1,.2+k*.35,.45+k*.35,Z+5,Z+13,40+k);
  gable(c,x0-.1,y0-.12,x1+.1,y1+.12,Z+Ht,11,a.roof,a.cols[n-1]);
  for(let i=1;i<n;i++){const ax=x0+(x1-x0)*i/n; line(c,P(ax,y1+.12,Z+Ht),P(ax,(y0+y1)/2,Z+Ht+11),'rgba(0,0,0,.25)',1);}
  shrub(c,x0+.1,y1+.22,.6); shrub(c,x1-.1,y1+.22,.6,'#4c9a3f');};
ART.brick=(c,t,a)=>{const W=t.w,H=t.h; lot(c,W,H,a.lot); const Z=2, fl=a.fl, fh=12, Ht=fl*fh+4; const i=.22,x0=i,y0=i,x1=W-i,y1=H-(a.stoop?.5:.32);
  box(c,x0,y0,x1,y1,Z,Z+Ht,a.wall);
  for(let z=Z+2;z<Z+Ht;z+=3){qL(c,x0,x1,y1,0,1,z,z+.5,'rgba(0,0,0,.06)');qR(c,x1,y0,y1,0,1,z,z+.5,'rgba(0,0,0,.08)');}
  const nl=Math.round((x1-x0)*2.2), nr=Math.round((y1-y0)*2.2);
  for(let f=(a.shop?1:0);f<fl;f++){const za=Z+f*fh+3.5, zb=za+7.2; for(let k=0;k<nl;k++){qL(c,x0,x1,y1,(k+.16)/nl,(k+.84)/nl,za-1,zb+1,'#efe6d8'); wL(c,x0,x1,y1,(k+.22)/nl,(k+.78)/nl,za,zb,f*10+k);
      if(a.ac&&hsh(f,k,3)%4===0)box(c,x0+(x1-x0)*(k+.35)/nl,y1,x0+(x1-x0)*(k+.65)/nl,y1+.08,za-2,za+1,'#d7d7d2');}
    for(let k=0;k<nr;k++){qR(c,x1,y0,y1,(k+.16)/nr,(k+.84)/nr,za-1,zb+1,'#e3d9ca'); wR(c,x1,y0,y1,(k+.22)/nr,(k+.78)/nr,za,zb,f*10+k);}}
  if(a.shop){qL(c,x0,x1,y1,.05,.75,Z+1,Z+9,'#bfe3f2'); qL(c,x0,x1,y1,.8,.95,Z,Z+9,DOOR); awningL(c,x0,x1,y1,Z+12,a.shop,Math.round((x1-x0)*4)); qR(c,x1,y0,y1,.1,.9,Z+1,Z+9,'#a9cfdf');}
  else qL(c,x0,x1,y1,.42,.58,Z,Z+10,DOOR);
  box(c,x0-.04,y0-.04,x1+.04,y1+.04,Z+Ht,Z+Ht+3,a.cornice||sh(a.wall,.6));
  if(a.esc){const u0=a.shop?.1:.08,u1=a.shop?.5:.42; for(let f=1;f<fl;f++){const z=Z+f*fh+2; box(c,x0+(x1-x0)*u0,y1,x0+(x1-x0)*u1,y1+.16,z,z+1,'#2b2b2b');
      line(c,P(x0+(x1-x0)*u0,y1+.16,z+1),P(x0+(x1-x0)*u1,y1+.16,z+fh),'#2b2b2b',1.2);}}
  if(a.stoop){const dx=x0+(x1-x0)*.5; for(let s=0;s<4;s++)box(c,dx-.2,y1+s*.04,dx+.2,y1+.05+s*.06,Z,Z+8-s*2,'#a07a5e');}
  if(a.tank){const mx=x0+(x1-x0)*.65,my=y0+(y1-y0)*.4; for(const [ux,uy] of [[-.12,-.12],[.12,-.12],[-.12,.12],[.12,.12]])line(c,P(mx+ux,my+uy,Z+Ht+3),P(mx+ux,my+uy,Z+Ht+11),'#5a4030',1.2); cyl(c,mx,my,Z+Ht+11,Z+Ht+22,.22,'#8a6142'); pyr(c,mx-.22,my-.22,mx+.22,my+.22,Z+Ht+22,6,'#5a4030');}
  if(a.chimney)cyl(c,x1-.4,y0+.4,Z+Ht+3,Z+Ht+30,.16,'#9a4434');
  if(a.terrace){for(let k=0;k<4;k++)shrub(c,x0+.4+k*.55,y0+.5,.6);  if(!LM)for(let k=0;k<6;k++){const p=P(x0+.3+k*.4,y0+.3,Z+Ht+9);ell(c,p[0],p[1],1.2,1.2,'#ffe28a');}}
  if(a.big){qL(c,x0,x1,y1,.02,.3,Z+Ht-10,Z+Ht-3,'#f4e6c8');}};
ART.rowapt=(c,t,a)=>{const W=t.w,H=t.h; lot(c,W,H,a.lot); const Z=2,n=a.cols.length,fh=12,Ht=a.fl*fh+4; const x0=.2,y0=.22,x1=W-.2,y1=H-.52;
  for(let i=0;i<n;i++){const ax=x0+(x1-x0)*i/n,bx=x0+(x1-x0)*(i+1)/n; box(c,ax,y0,bx,y1,Z,Z+Ht,a.cols[i]);
    for(let f=0;f<a.fl;f++){const za=Z+f*fh+3.5; for(let k=0;k<2;k++){if(f===0&&k===1)continue; qL(c,ax,bx,y1,(k+.15)/2,(k+.75)/2,za-1,za+8,'#efe6d8'); wL(c,ax,bx,y1,(k+.22)/2,(k+.68)/2,za,za+7,f*9+k+i*30);}}
    qL(c,ax,bx,y1,.58,.82,Z,Z+10,DOOR); const dx=ax+(bx-ax)*.7; for(let s=0;s<4;s++)box(c,dx-.16,y1+s*.05,dx+.16,y1+.06+s*.07,Z,Z+8-s*2,sh(a.cols[i],.8));
    box(c,ax-.02,y0-.04,bx+.02,y1+.04,Z+Ht,Z+Ht+3,sh(a.cols[i],.55));}
  for(let f=0;f<a.fl;f++)for(let k=0;k<3;k++)wR(c,x1,y0,y1,(k+.2)/3,(k+.75)/3,Z+f*fh+3.5,Z+f*fh+10.5,f*3+k);};
ART.tower=(c,t,a)=>{const W=t.w,H=t.h; lot(c,W,H,a.lot); const Z=2,i=.3,x0=i,y0=i,x1=W-i,y1=H-i; let Ht=a.H;
  const fh=a.balc?11:9, rows=Math.floor((Ht-12)/fh);
  box(c,x0,y0,x1,y1,Z,Z+Ht,a.wall,sh(a.wall,.75));
  const nl=Math.round((x1-x0)*2.6), nr=Math.round((y1-y0)*2.6);
  for(let r=0;r<rows;r++){const za=Z+12+r*fh, zb=za+fh*(a.balc?.62:.72);
    for(let k=0;k<nl;k++)wL(c,x0,x1,y1,(k+.12)/nl,(k+.88)/nl,za,zb,r*41+k,a.glass);
    for(let k=0;k<nr;k++)wR(c,x1,y0,y1,(k+.12)/nr,(k+.88)/nr,za,zb,r*41+k,a.glass);
    if(a.balc){box(c,x0,y1,x1,y1+.12,za-1.5,za,'#f4f1ea'); qL(c,x0,x1,y1+.12,0,1,za,za+3,'rgba(220,240,255,.55)');}
    if(a.bands){qL(c,x0,x1,y1,0,1,za-2,za,'#ffffff');qR(c,x1,y0,y1,0,1,za-2,za,'#eef4f7');}}
  if(a.stone){for(const u of [.0,.33,.66,.97])qL(c,x0,x1,y1,u,u+.04,Z,Z+Ht,a.stone); for(const u of [.0,.33,.66,.97])qR(c,x1,y0,y1,u,u+.04,Z,Z+Ht,sh(a.stone,.85));}
  qL(c,x0,x1,y1,.38,.62,Z,Z+10,a.hotel?'#c9a227':'#4b3a2a');
  if(a.hotel){box(c,x0+(x1-x0)*.3,y1,x0+(x1-x0)*.7,y1+.35,Z+11,Z+13,'#d9b23a'); flat(c,x0+(x1-x0)*.42,y1,x0+(x1-x0)*.58,H-.05,2.05,'#c0392b');
    for(let k=0;k<4;k++)flag(c,x0+(x1-x0)*(.15+k*.22),y1+.05,Z+18,['#e63946','#2b6cb0','#2f9a5a','#f2c230'][k]);
    box(c,x0+(x1-x0)*.2,y1-.1,x0+(x1-x0)*.8,y1,Z+Ht,Z+Ht+9,'#3a2a1a'); qL(c,x0+(x1-x0)*.2,x0+(x1-x0)*.8,y1,.1,.9,Z+Ht+2,Z+Ht+7,'#ffd166');}
  if(a.step){const m=.45; box(c,x0+m,y0+m,x1-m,y1-m,Z+Ht,Z+Ht+22,a.wall,sh(a.wall,.75)); winGrid(c,x0+m,y0+m,x1-m,y1-m,Z+Ht,Z+Ht+22,2,4,4,a.glass);
    const m2=.85; box(c,x0+m2,y0+m2,x1-m2,y1-m2,Z+Ht+22,Z+Ht+36,a.stone||a.wall); Ht+=36;}
  else box(c,x0-.03,y0-.03,x1+.03,y1+.03,Z+Ht,Z+Ht+3,sh(a.wall,.8));
  const mx=(x0+x1)/2,my=(y0+y1)/2;
  if(a.crown){pyr(c,mx-.5,my-.5,mx+.5,my+.5,Z+Ht,20,'#d9b23a'); line(c,P(mx,my,Z+Ht+20),P(mx,my,Z+Ht+36),'#b0b4b8',2);}
  else if(a.roofgreen){flat(c,x0+.15,y0+.15,x1-.15,y1-.15,Z+Ht+3.1,'#7cc46a'); for(let k=0;k<3;k++)shrub(c,x0+.4+k*.7,y0+.5,.55);}
  else{box(c,mx-.4,my-.4,mx+.2,my+.2,Z+Ht+3,Z+Ht+11,'#b9bcc0'); cyl(c,x1-.4,y0+.45,Z+Ht+3,Z+Ht+10,.16,'#9aa2a8');}};
ART.modern=(c,t,a)=>{const W=t.w,H=t.h; lot(c,W,H,'g'); const Z=2,x0=.35,y0=.35,x1=W-.4,y1=H-.45;
  box(c,x0,y0,x1-.8,y1,Z,Z+14,a.wall); qL(c,x0,x1-.8,y1,.1,.75,Z+2,Z+12,'#9fd0e3'); qL(c,x0,x1-.8,y1,.8,.95,Z,Z+12,a.wood);
  box(c,x0+.4,y0,x1,y1+.25,Z+14,Z+28,a.wall); qL(c,x0+.4,x1,y1+.25,.05,.45,Z+16,Z+26,a.wood); wL(c,x0+.4,x1,y1+.25,.5,.95,Z+16,Z+26,3,'#9fd0e3');
  wR(c,x1,y0,y1+.25,.1,.9,Z+16,Z+26,5,'#9fd0e3'); box(c,x1-.8,y0,x1,y1,Z,Z+14,a.wood); wR(c,x1,y0,y1,.2,.8,Z+3,Z+11,7,'#9fd0e3');
  box(c,x0+.38,y0-.02,x1+.02,y1+.27,Z+28,Z+30,'#e8e6e1'); walk(c,x0+.6,y1,H,.12); shrub(c,x0+.1,y1+.2,.6); shrub(c,x1-.2,y1+.25,.6);};
ART.mansion=(c,t,a)=>{const W=t.w,H=t.h; lot(c,W,H,'g'); const Z=2,fl=a.fl||2,Ht=fl*14; const x0=.4,y0=.35,x1=W-(a.pool?1.25:.4),y1=H-(a.fountain?1.1:.75);
  if(a.tennis){flat(c,W-1.2,.15,W-.12,1.9,2.1,'#3d8f6a'); flat(c,W-1.1,.25,W-.22,1.8,2.15,null,'#ffffff');}
  if(a.pool){const px0=x1+.15,py0=a.tennis?2:.6,px1=W-.15,py1=H-.4; flat(c,px0,py0,px1,py1,2.1,'#e8dcc2'); flat(c,px0+.12,py0+.12,px1-.12,py1-.12,2.2,'#4fb3e3'); flat(c,px0+.2,py0+.2,px1-.3,py0+.5,2.25,'rgba(255,255,255,.35)');
    umbrella(c,px1-.25,py1-.2,'#ff6f61'); umbrella(c,px0+.2,py1-.15,'#ffd166');}
  box(c,x0,y0,x1,y1,Z,Z+Ht,a.wall);
  winGrid(c,x0,y0,x1,y1,Z+2,Z+Ht,fl,Math.round((x1-x0)*2),Math.round((y1-y0)*1.8),null,1);
  const mx=x0+(x1-x0)/2;
  if(a.cols||a.arches){box(c,mx-.6,y1,mx+.6,y1+.45,Z+Ht-2,Z+Ht+1,sh(a.wall,1.05)); for(let k=0;k<4;k++){const u=mx-.5+k*.333; box(c,u-.04,y1+.36,u+.04,y1+.44,Z,Z+Ht-2,'#ffffff');}
    if(a.cols)poly(c,[P(mx-.62,y1+.47,Z+Ht+1),P(mx+.62,y1+.47,Z+Ht+1),P(mx,y1+.47,Z+Ht+11)],sh(a.wall,.95),EDGE);}
  qL(c,x0,x1,y1,.44,.56,Z,Z+12,DOOR); walk(c,mx,y1+.45,H,.18,'#e0d8c8');
  hip(c,x0-.1,y0-.1,x1+.1,y1+.1,Z+Ht,14,a.roof);
  for(const u of [.3,.7])box(c,x0+(x1-x0)*u-.12,y1-.2,x0+(x1-x0)*u+.12,y1-.05,Z+Ht+2,Z+Ht+8,a.wall);
  box(c,x0+.3,y0+.3,x0+.5,y0+.5,Z+Ht+4,Z+Ht+20,'#8a7a6a'); box(c,x1-.5,y0+.3,x1-.3,y0+.5,Z+Ht+4,Z+Ht+20,'#8a7a6a');
  if(a.fountain){const [fx,fy]=P(mx,H-.55,2); ell(c,fx,fy,20,10,'#cfc8bd'); ell(c,fx,fy-1,16,8,'#6cc0ee'); line(c,[fx,fy-1],[fx,fy-12],'#cfe9f7',2);}
  for(let k=0;k<5;k++)shrub(c,x0+(x1-x0)*(k+.5)/5,y1+.15+(a.fountain?.1:0),.65,'#2f7d3a');};
ART.villa=(c,t,a)=>{const W=t.w,H=t.h; lot(c,W,H,'g'); const Z=2;
  flat(c,W-1,.3,W-.2,H-.3,2.1,'#b8834f'); flat(c,W-.85,.45,W-.35,H-.45,2.2,'#4fb3e3');
  box(c,.35,.35,W-1.15,H-.6,Z,Z+16,'#f5f5f2'); qL(c,.35,W-1.15,H-.6,.05,.7,Z+2,Z+14,'#9fd0e3'); wR(c,W-1.15,.35,H-.6,.1,.9,Z+3,Z+14,4,'#9fd0e3');
  box(c,.5,.35,W-1.6,H-1.1,Z+16,Z+30,'#f5f5f2'); qL(c,.5,W-1.6,H-1.1,.1,.9,Z+18,Z+28,'#9fd0e3'); qR(c,W-1.6,.35,H-1.1,.1,.6,Z+18,Z+28,'#7fb5c9');
  box(c,.45,.3,W-1.55,H-1.05,Z+30,Z+32,'#e6e4de'); box(c,W-2,H-1.05,W-1.2,H-.65,Z+16,Z+19,'#b8834f'); umbrella(c,W-1.6,H-.85,'#f2f2ee');
  qL(c,.35,W-1.15,H-.6,.75,.88,Z,Z+12,'#b8834f'); walk(c,.35+(W-1.5)*.8,H-.6,H,.12); shrub(c,.4,H-.4,.6); shrub(c,1.2,H-.35,.6);};
ART.condo=(c,t,a)=>{const W=t.w,H=t.h; lot(c,W,H,'g'); const Z=2;
  box(c,.3,.3,1.25,1.4,Z,Z+70,a.wall); winGrid(c,.3,.3,1.25,1.4,Z+4,Z+70,6,2,2,null);
  for(let f=1;f<6;f++)box(c,.3,1.4,1.25,1.52,Z+4+f*11-1,Z+4+f*11,a.trim);
  flat(c,1.45,.5,W-.3,2.3,2.1,'#e8dcc2'); flat(c,1.6,.65,W-.45,2.15,2.2,'#4fb3e3'); flat(c,1.7,.75,W-.6,1.1,2.25,'rgba(255,255,255,.35)');
  umbrella(c,1.6,2.4,'#ff6f61'); umbrella(c,W-.6,2.45,'#ffd166');
  box(c,.3,1.75,1.5,H-.35,Z,Z+66,a.wall); winGrid(c,.3,1.75,1.5,H-.35,Z+4,Z+66,6,2,2,null); for(let f=1;f<6;f++)box(c,.3,H-.35,1.5,H-.23,Z+4+f*10-1,Z+4+f*10,a.trim);
  box(c,.28,.28,1.27,1.42,Z+70,Z+73,a.trim); box(c,.28,1.73,1.52,H-.33,Z+66,Z+69,a.trim); qL(c,.3,1.5,H-.35,.4,.6,Z,Z+10,DOOR);
  shrub(c,2.2,H-.3,.7); shrub(c,2.7,H-.3,.6);};
ART.chinese=(c,t,a)=>{const W=t.w,H=t.h; lot(c,W,H,'p'); const Z=2,fl=a.fl||2,Ht=fl*15; const x0=.38,y0=.35,x1=W-.38,y1=H-.5;
  box(c,x0,y0,x1,y1,Z,Z+Ht,a.wall); winGrid(c,x0,y0,x1,y1,Z+2,Z+Ht,fl,Math.round((x1-x0)*1.8),Math.round((y1-y0)*1.6),'#f2d38a',1);
  for(const u of [0,.33,.66,1])qL(c,x0,x1,y1,Math.max(0,u-.03),Math.min(1,u+.03),Z,Z+Ht,'#b8241f');
  qL(c,x0,x1,y1,.4,.6,Z,Z+11,'#7a1c14'); if(a.shop)awningL(c,x0,x1,y1,Z+13,'#d9a520',Math.round((x1-x0)*3));
  if(fl>1){box(c,x0-.1,y0-.1,x1+.1,y1+.1,Z+15,Z+17,a.roof);}
  hip(c,x0-.16,y0-.16,x1+.16,y1+.16,Z+Ht,9,a.roof);
  for(const [px,py] of [[x0-.16,y1+.16],[x1+.16,y1+.16],[x1+.16,y0-.16]]){const [sx,sy]=P(px,py,Z+Ht); poly(c,[[sx-4,sy+1],[sx+4,sy+1],[sx+(px>x0?6:-6),sy-6]],sh(a.roof,.8));}
  if(a.lant){lantern(c,x0+.4,y1+.12,Z+10); lantern(c,x1-.4,y1+.12,Z+10); if(fl>1){lantern(c,x0+(x1-x0)*.5,y1+.12,Z+27);}}
  walk(c,x0+(x1-x0)*.5,y1,H,.12,'#d8cfc0');};
ART.chinapt=(c,t,a)=>{const W=t.w,H=t.h; lot(c,W,H,'p'); const Z=2,fl=a.fl,Ht=fl*12+3; const x0=.25,y0=.25,x1=W-.25,y1=H-.38;
  box(c,x0,y0,x1,y1,Z,Z+Ht,a.wall); winGrid(c,x0,y0,x1,y1,Z+12,Z+Ht,fl-1,Math.round((x1-x0)*2),Math.round((y1-y0)*2),null);
  qL(c,x0,x1,y1,0,1,Z,Z+11,'#b8241f'); qL(c,x0,x1,y1,.08,.6,Z+2,Z+9,'#f2d38a'); qL(c,x0,x1,y1,.68,.85,Z,Z+9,'#5a1410'); qL(c,x0,x1,y1,0,1,Z+10,Z+11.5,'#d9a520');
  for(let f=1;f<fl;f++)box(c,x0+(x1-x0)*.15,y1,x0+(x1-x0)*.45,y1+.15,Z+12*f+2,Z+12*f+3,'#7a5a3a');
  for(const u of [.2,.75]){const sx=x0+(x1-x0)*u; box(c,sx,y1,sx+.12,y1+.14,Z+16,Z+38,u<.5?'#e63946':'#2f9a5a'); }
  for(let f=1;f<fl;f+=2){for(let k=0;k<6;k++)lantern(c,x0+(x1-x0)*(k+.5)/6,y1+.08,Z+12*f+10);}
  box(c,x0-.12,y0-.12,x1+.12,y1+.12,Z+Ht,Z+Ht+2,'#3f8f5f'); hip(c,x0-.12,y0-.12,x1+.12,y1+.12,Z+Ht+2,5,'#3f8f5f');};
ART.shop=(c,t,a)=>{const W=t.w,H=t.h; lot(c,W,H,'p'); const Z=2,fl=a.fl||1,Ht=fl===2?30:24; const x0=.32,y0=.32,x1=W-.32,y1=H-.45;
  box(c,x0,y0,x1,y1,Z,Z+Ht,a.wall);
  if(a.brick)for(let z=Z+2;z<Z+Ht;z+=3){qL(c,x0,x1,y1,0,1,z,z+.5,'rgba(0,0,0,.08)');qR(c,x1,y0,y1,0,1,z,z+.5,'rgba(0,0,0,.1)');}
  wL(c,x0,x1,y1,.06,.6,Z+1.5,Z+10,1,'#cfe9f5'); qL(c,x0,x1,y1,.68,.9,Z,Z+11,DOOR); wR(c,x1,y0,y1,.12,.88,Z+1.5,Z+10,2,'#cfe9f5');
  if(fl===2){for(let k=0;k<2;k++){wL(c,x0,x1,y1,.15+k*.4,.45+k*.4,Z+17,Z+25,5+k);} wR(c,x1,y0,y1,.2,.8,Z+17,Z+25,8);}
  if(a.sign==='hanger'||a.sign==='bread'||a.sign==='pizza'||a.sign==='crates'){ /* manequins / produtos */
    if(!LM){for(let k=0;k<3;k++){const [mx,my]=P(x0+(x1-x0)*(.12+k*.17),y1,Z+3); ell(c,mx,my-2,1.6,3.2,['#e63946','#3e7bd6','#ffd23f'][k]);}}}
  awningL(c,x0,x1,y1,Z+14,a.awn,Math.round((x1-x0)*4)); awningR(c,x1,y0,y1,Z+14,a.awn,Math.round((y1-y0)*4));
  if(a.flat||fl===2)box(c,x0-.03,y0-.03,x1+.03,y1+.03,Z+Ht,Z+Ht+2,sh(a.wall,.8)); else hip(c,x0-.06,y0-.06,x1+.06,y1+.06,Z+Ht,7,a.chinese?'#3f8f5f':'#7a6a5e');
  const mx=(x0+x1)/2; const top=Z+Ht+(a.flat||fl===2?2:4);
  if(a.sign==='bread'){const [sx,sy]=P(mx,y1-.1,top+6); ell(c,sx,sy,13,5.5,'#d99a4e'); for(let k=-1;k<=1;k++)line(c,[sx+k*5-2,sy-3],[sx+k*5+2,sy+3],'#a86a2a',1.2);}
  else if(a.sign==='pizza'){const [sx,sy]=P(mx,y1-.1,top+8); ell(c,sx,sy,8,8,'#f2c14e'); ell(c,sx,sy,6.5,6.5,'#e2553c'); for(const [dx,dy] of [[-2,-2],[3,1],[-1,3]])ell(c,sx+dx,sy+dy,1.4,1.4,'#fff3d6');}
  else if(a.sign==='cross'){const [sx,sy]=P(x1,y1,Z+Ht-4); if(LM){polyL(c,[[sx-2,sy-9],[sx+2,sy-9],[sx+2,sy-5],[sx+6,sy-5],[sx+6,sy-1],[sx+2,sy-1],[sx+2,sy+3],[sx-2,sy+3],[sx-2,sy-1],[sx-6,sy-1],[sx-6,sy-5],[sx-2,sy-5]],'#7dffb0');}
    else poly(c,[[sx-2,sy-9],[sx+2,sy-9],[sx+2,sy-5],[sx+6,sy-5],[sx+6,sy-1],[sx+2,sy-1],[sx+2,sy+3],[sx-2,sy+3],[sx-2,sy-1],[sx-6,sy-1],[sx-6,sy-5],[sx-2,sy-5]],'#26a85e'); qL(c,x0,x1,y1,0,1,Z+Ht-4,Z+Ht-1,'#2fa36a');}
  else if(a.sign==='hanger'){const [sx,sy]=P(mx,y1,top+5); box(c,mx-.4,y1-.1,mx+.4,y1,top,top+9,'#2b2b33'); line(c,[sx-5,sy+1],[sx,sy-4],'#fff',1.2); line(c,[sx,sy-4],[sx+5,sy+1],'#fff',1.2);}
  else if(a.sign==='tools'){const [sx,sy]=P(mx,y1-.1,top+7); line(c,[sx-8,sy+5],[sx+8,sy-5],'#c9ccd0',3); line(c,[sx-8,sy-5],[sx+8,sy+5],'#8a5a32',3); box(c,x0+.15,y1+.2,x0+.45,y1+.4,Z,Z+5,'#2f9a5a');}
  else if(a.sign==='tire'){const [sx,sy]=P(mx,y1-.1,top+8); if(!LM){c.lineWidth=4;c.strokeStyle='#222';c.beginPath();c.arc(sx,sy,6,0,7);c.stroke();} for(let k=0;k<3;k++){const [px,py]=P(x0+.2+k*.18,y1+.32,Z); ell(c,px,py-2,5,2.5,'#222'); ell(c,px,py-5,5,2.5,'#2b2b2b');}}
  else if(a.sign==='crates'){for(let k=0;k<3;k++){const u=x0+(x1-x0)*(.1+k*.2); box(c,u,y1+.25,u+.25,y1+.45,Z,Z+4,'#b07a4a'); ellW(c,u+.12,y1+.35,Z+5,4,2,['#e63946','#f77f00','#7bc043'][k]);}
    lantern(c,x0+.3,y1+.1,Z+15); lantern(c,x1-.3,y1+.1,Z+15);}};
ART.diner=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'p'); const Z=2,x0=.3,y0=.45,x1=W-.3,y1=H-.45;
  box(c,x0,y0,x1,y1,Z,Z+18,'#d9dde1','#c7ccd1'); qL(c,x0,x1,y1,0,1,Z+3,Z+5,'#d63c3c'); qR(c,x1,y0,y1,0,1,Z+3,Z+5,'#b02f2f');
  for(let k=0;k<6;k++)wL(c,x0,x1,y1,(k+.15)/6,(k+.85)/6,Z+7,Z+15,k,'#bfe3f2'); qL(c,x0,x1,y1,.0,.08,Z,Z+15,DOOR);
  for(let k=0;k<2;k++)wR(c,x1,y0,y1,(k+.2)/2,(k+.8)/2,Z+7,Z+15,9+k,'#bfe3f2');
  box(c,x0-.04,y0-.04,x1+.04,y1+.04,Z+18,Z+21,'#e7eaee'); const mx=(x0+x1)/2; box(c,mx-.7,y0+.4,mx+.7,y0+.5,Z+21,Z+33,'#2b2b33');
  const [sx,sy]=P(mx,y0+.5,Z+27); if(LM){c.fillStyle='#ff5a8a';c.font='700 8px sans-serif';c.textAlign='center';c.fillText('DINER',sx,sy+3);} else{c.fillStyle='#ff7aa2';c.font='700 8px sans-serif';c.textAlign='center';c.fillText('DINER',sx,sy+3);}};
ART.market=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'p'); const Z=2,x0=.3,y0=.3,x1=W-.3,y1=H-.8;
  box(c,x0,y0,x1,y1,Z,Z+22,'#f5f3ee'); qL(c,x0,x1,y1,0,1,Z+16,Z+22,'#f08c2e'); qR(c,x1,y0,y1,0,1,Z+16,Z+22,'#d87a22');
  wL(c,x0,x1,y1,.05,.95,Z+1,Z+14,1,'#cfe9f5'); qL(c,x0,x1,y1,.42,.58,Z,Z+13,'#9fd0e3'); wR(c,x1,y0,y1,.1,.9,Z+3,Z+12,4,'#cfe9f5');
  for(const u of [.3,.6])box(c,x0+u*(x1-x0),y0+.4,x0+u*(x1-x0)+.5,y0+.8,Z+22,Z+26,'#b9bcc0');
  const mx=(x0+x1)/2; box(c,mx-.8,y1-.08,mx+.8,y1,Z+22,Z+33,'#f08c2e'); const [sx,sy]=P(mx,y1,Z+28); if(!LM){c.strokeStyle='#fff';c.lineWidth=1.6;c.strokeRect(sx-5,sy-3,10,6);line(c,[sx-6,sy-5],[sx-3,sy-3],'#fff',1.4);}
  for(let k=0;k<5;k++){const u=x0+.3+k*.18; box(c,u,y1+.25,u+.12,y1+.45,Z,Z+4,'#b9c2cc');}
  flat(c,x0,y1,x1,H-.05,2.02,'#d9d4c8');};
ART.mall=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'p'); const Z=2,x0=.3,y0=.3,x1=W-.3,y1=H-.6;
  box(c,x0,y0,x1,y1,Z,Z+40,'#f2f2f0'); const cols=['#e63946','#2b6cb0','#2f9a5a','#f08c2e','#a64fd6','#f2c230'];
  for(let k=0;k<6;k++){wL(c,x0,x1,y1,(k+.1)/6,(k+.9)/6,Z+2,Z+11,k,'#cfe9f5'); qL(c,x0,x1,y1,(k+.1)/6,(k+.9)/6,Z+11,Z+13,cols[k]);}
  for(let k=0;k<6;k++){wR(c,x1,y0,y1,(k+.1)/6,(k+.9)/6,Z+2,Z+11,k+9,'#cfe9f5'); qR(c,x1,y0,y1,(k+.1)/6,(k+.9)/6,Z+11,Z+13,cols[5-k]);}
  winGrid(c,x0,y0,x1,y1,Z+14,Z+40,2,8,8,'#b5dcee'); qL(c,x0,x1,y1,.42,.58,Z,Z+22,'#9fd0e3');
  box(c,x0-.04,y0-.04,x1+.04,y1+.04,Z+40,Z+42,'#dcdcda'); const [dx,dy]=P((x0+x1)/2,(y0+y1)/2,Z+42);
  if(!LM){c.beginPath();c.ellipse(dx,dy,34,17,0,Math.PI,0);c.bezierCurveTo(dx+34,dy-34,dx-34,dy-34,dx-34,dy);c.fillStyle='rgba(150,205,235,.9)';c.fill(); c.strokeStyle='rgba(255,255,255,.6)';c.lineWidth=1;for(let k=-2;k<=2;k++){c.beginPath();c.moveTo(dx+k*12,dy);c.quadraticCurveTo(dx+k*6,dy-30,dx,dy-25);c.stroke();}}
  flat(c,x0,y1,x1,H-.05,2.02,'#ddd7cb'); for(let k=0;k<3;k++)shrub(c,x0+.6+k*1.1,H-.3,.6);};
ART.park=(c,t,a)=>{const W=t.w,H=t.h; lot(c,W,H,'g'); const n=a.size;
  // caminhos
  flat(c,W*.45,.05,W*.55,H-.05,2.05,'#e3d6b8'); flat(c,.05,H*.45,W-.05,H*.55,2.05,'#e3d6b8');
  if(n>=3){const [cx,cy]=P(W/2,H/2,2.1); ell(c,cx,cy,22,11,'#e3d6b8');}
  if(a.pond){const px=n>=4?W*.72:W*.75,py=n>=4?H*.28:H*.25; const [qx,qy]=P(px,py,2.1); ell(c,qx,qy,n*8+6,n*4+3,'#4fa3d8'); ell(c,qx+3,qy-1,n*4,n*2,'rgba(255,255,255,.3)');
    if(a.pond>1){for(let k=0;k<2;k++){const [bx,by]=P(px-.3+k*.5,py+.1,3); ell(c,bx,by,3,2,'#fff'); ell(c,bx+2,by-2,1.4,1.4,'#fff');}}}
  if(a.play){box(c,.25,.25,.75,.45,2,8,'#e63946'); line(c,P(.3,.75,2),P(.3,.75,14),'#555',1.4); line(c,P(.7,.75,2),P(.7,.75,14),'#555',1.4); line(c,P(.3,.75,14),P(.7,.75,14),'#555',1.4);}
  const trees=n===2?[[1.6,.35],[.4,1.6]]:n===3?[[.4,.4],[2.5,1.2],[.4,2.5],[1.2,.35],[2.55,2.55]]:[[.4,.4],[1.2,.3],[.35,1.3],[.4,3.5],[1.3,3.6],[3.5,3.5],[2.6,3.6],[3.6,2.4],[.35,2.4]];
  trees.forEach(([x,y],i)=>treeAt(c,x,y,n===2?.7:.8,i));
  if(a.gazebo){const gx=W*.5,gy=H*.5; box(c,gx-.35,gy-.35,gx+.35,gy+.35,2,4,'#efe9df'); for(const [u,v] of [[-.3,-.3],[.3,-.3],[-.3,.3],[.3,.3]])line(c,P(gx+u,gy+v,4),P(gx+u,gy+v,18),'#fff',1.8); pyr(c,gx-.42,gy-.42,gx+.42,gy+.42,18,9,'#3f8f5f');}
  if(a.kiosk){box(c,1.1,1.3,1.5,1.7,2,12,'#f2c230'); pyr(c,1.05,1.25,1.55,1.75,12,6,'#d64545'); umbrella(c,1.9,1.4,'#ffffff'); umbrella(c,1.7,2,'#e63946');}
  bench(c,W*.35,H*.62,.9); bench(c,W*.62,H*.35,.9);
  for(let k=0;k<n*2;k++){const u=.3+(hsh(k,n,1)%100)/100*(W-.6),v=.3+(hsh(k,n,2)%100)/100*(H-.6); const [px,py]=P(u,v,2.1); ell(c,px,py,2,1.2,['#ff5d8f','#ffd23f','#fff'][k%3]);}};
ART.court=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'g'); flat(c,.12,.12,W-.12,H-.12,2.05,'#3d6fb0'); flat(c,.3,.3,W-.3,H-.3,2.1,'#d86f3a');
  flat(c,.3,.3,W-.3,H-.3,2.15,null,'#ffffff'); line(c,P(W/2,.3,2.2),P(W/2,H-.3,2.2),'#fff',1.2); const [cx,cy]=P(W/2,H/2,2.2); if(!LM){c.strokeStyle='#fff';c.beginPath();c.ellipse(cx,cy,10,5,0,0,Math.PI*2);c.stroke();}
  for(const x of [.3,W-.3]){line(c,P(x,H/2,2),P(x,H/2,20),'#555',1.6); box(c,x-.04,H/2-.25,x+.04,H/2+.25,16,24,'#fff');}
  for(let k=0;k<=8;k++){line(c,P(.08+k*(W-.16)/8,.08,2),P(.08+k*(W-.16)/8,.08,16),'rgba(80,80,80,.6)',.8); line(c,P(.08,.08+k*(H-.16)/8,2),P(.08,.08+k*(H-.16)/8,16),'rgba(80,80,80,.6)',.8);}
  line(c,P(.08,.08,16),P(W-.08,.08,16),'#666',1); line(c,P(.08,.08,16),P(.08,H-.08,16),'#666',1); bench(c,W/2,H-.18,.8);};
ART.field=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'g'); for(let k=0;k<6;k++)flat(c,.2+k*(W-.4)/6,.2,.2+(k+1)*(W-.4)/6,H-.2,2.05,k%2?'#5bb04e':'#6cc05c');
  flat(c,.3,.3,W-.3,H-.3,2.1,null,'#fff'); line(c,P(W/2,.3,2.1),P(W/2,H-.3,2.1),'#fff',1.2); const [cx,cy]=P(W/2,H/2,2.1); if(!LM){c.strokeStyle='#fff';c.beginPath();c.ellipse(cx,cy,12,6,0,0,Math.PI*2);c.stroke();}
  for(const x of [.3,W-.3]){box(c,x-.06,H/2-.3,x+.06,H/2+.3,2,10,'rgba(255,255,255,.7)');}
  box(c,.6,.0,W-.6,.25,2,9,'#8a6a4a'); for(let s=0;s<3;s++)box(c,.6,.0+s*.07,W-.6,.08+s*.07,9-s*2.5,10-s*2.5,['#e63946','#ffd23f','#2b6cb0'][s]);
  for(const [x,y] of [[.1,.1],[W-.1,.1],[.1,H-.1],[W-.1,H-.1]]){line(c,P(x,y,2),P(x,y,40),'#666',1.6); box(c,x-.08,y-.08,x+.08,y+.08,38,42,'#f5f5f0');}};
ART.pool=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'b'); flat(c,.3,.25,W-.3,H-1,2.1,'#3a9ad6'); flat(c,.4,.35,W-.4,H-1.1,2.15,'#59b8ea');
  for(let k=1;k<5;k++)line(c,P(.4,.35+k*(H-1.45)/5,2.2),P(W-.4,.35+k*(H-1.45)/5,2.2),'rgba(255,255,255,.7)',1);
  box(c,W-.55,.3,W-.3,.5,2,8,'#ffffff'); const [kx,ky]=P(.9,H-.5,2.1); ell(c,kx,ky,13,6.5,'#7fd0f5');
  box(c,W-1,H-.9,W-.15,H-.15,2,12,'#f2e6cf'); hip(c,W-1.05,H-.95,W-.1,H-.1,12,5,'#3a8fc9');
  umbrella(c,1.6,H-.45,'#ff6f61'); umbrella(c,2.1,H-.6,'#ffd166'); umbrella(c,.3,H-.75,'#7bc043'); line(c,P(.2,.2,2),P(.2,.2,16),'#fff',1.5); box(c,.12,.12,.3,.3,16,18,'#e63946');};
ART.golf=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'g'); const greens=[[1,1,1],[2.8,1.1,.9],[1.4,3,.9]];
  greens.forEach(([x,y,r])=>{const [px,py]=P(x,y,2.1); ell(c,px,py,r*30,r*15,'#9ad86e'); line(c,[px,py],[px,py-14],'#eee',1); poly(c,[[px,py-14],[px+7,py-12],[px,py-10]],'#e63946');});
  for(const [x,y] of [[2,1.9],[3.1,2.4]]){const [px,py]=P(x,y,2.1); ell(c,px,py,12,5,'#ecdca3');}
  const [qx,qy]=P(2.4,3,2.1); ell(c,qx,qy,22,10,'#4fa3d8'); treeAt(c,.4,2.2,.75,0); treeAt(c,3.6,.4,.75,1); treeAt(c,.4,.4,.75,2);
  box(c,3,3,3.8,3.8,2,16,'#f2e6cf'); hip(c,2.95,2.95,3.85,3.85,16,8,'#2f6b4a'); for(let k=0;k<2;k++)box(c,2.6+k*.25,3.7,2.78+k*.25,3.9,2,6,'#ffffff');};
ART.stadium=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'p'); const Z=2;
  box(c,.2,.2,W-.2,H-.2,Z,Z+4,'#b9bcc0'); flat(c,.9,.9,W-.9,H-.9,Z+4.1,'#4fae5a'); flat(c,1.05,1.05,W-1.05,H-1.05,Z+4.2,null,'#fff');
  line(c,P(W/2,1.05,Z+4.2),P(W/2,H-1.05,Z+4.2),'#fff',1);
  const st=(x0,y0,x1,y1,z,col)=>box(c,x0,y0,x1,y1,Z+4,Z+z,col);
  st(.2,.2,W-.2,.9,26,'#2b6cb0'); st(.2,.9,.9,H-.2,22,'#3f84cf');
  for(let r=0;r<5;r++){flat(c,.2,.2+r*.14,W-.2,.2+r*.14+.08,Z+26-r*4,r%2?'#ffffff':'#2b6cb0');}
  box(c,.15,.15,W-.15,.5,Z+34,Z+36,'#e6e8ea'); line(c,P(.3,.5,Z+26),P(.3,.5,Z+34),'#999',1.2); line(c,P(W-.3,.5,Z+26),P(W-.3,.5,Z+34),'#999',1.2);
  box(c,.9,H-.5,W-.9,H-.2,Z+4,Z+12,'#3f84cf'); box(c,W-.5,.9,W-.2,H-.9,Z+4,Z+12,'#2b6cb0');
  box(c,W-.45,1.6,W-.35,H-1.6,Z+12,Z+26,'#222'); qR(c,W-.35,1.6,H-1.6,.1,.9,Z+15,Z+23,'#f2c230');
  for(const [x,y] of [[.2,.2],[W-.2,.2],[.2,H-.2],[W-.2,H-.2]]){line(c,P(x,y,Z),P(x,y,62),'#777',2); box(c,x-.12,y-.12,x+.12,y+.12,58,64,'#f5f5f0');}};
ART.oval=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'p'); const [cx,cy]=P(W/2,H/2,2), R=W*.46*TW/2*1.0;
  if(LM)return; const ring=(z,rx,ry,col)=>{c.beginPath();c.ellipse(cx,cy-z,rx,ry,0,0,Math.PI*2);c.fillStyle=col;c.fill();};
  c.fillStyle='#9a9a94'; c.beginPath(); c.ellipse(cx,cy,R,R/2,0,0,Math.PI); c.lineTo(cx-R,cy-34); c.ellipse(cx,cy-34,R,R/2,0,Math.PI,0,true); c.closePath(); c.fill();
  for(let k=0;k<16;k++){const a=Math.PI*(k+.5)/16; const x=cx-Math.cos(a)*R, y=cy+Math.sin(a)*R/2; c.fillStyle='rgba(60,60,60,.35)'; c.fillRect(x-2,y-30,4,10);}
  ring(34,R,R/2,'#d9d9d3'); ring(34,R*.86,R*.43,'#f2c230'); ring(32,R*.74,R*.37,'#2b6cb0'); ring(28,R*.62,R*.31,'#ffffff'); ring(22,R*.5,R*.25,'#4fae5a');
  c.strokeStyle='#fff';c.lineWidth=1;c.beginPath();c.ellipse(cx,cy-22,R*.3,R*.15,0,0,Math.PI*2);c.stroke();
  c.strokeStyle='rgba(255,255,255,.95)';c.lineWidth=8;c.beginPath();c.ellipse(cx,cy-40,R*.93,R*.465,0,0,Math.PI*2);c.stroke();
  for(const [x,y] of [[.5,.5],[W-.5,.5],[.5,H-.5],[W-.5,H-.5]]){line(c,P(x,y,2),P(x,y,64),'#777',2); box(c,x-.14,y-.14,x+.14,y+.14,60,66,'#f5f5f0');}};
ART.cinema=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'p'); const Z=2,x0=.3,y0=.3,x1=W-.3,y1=H-.7;
  box(c,x0,y0,x1,y1,Z,Z+34,'#efe2c8'); qL(c,x0,x1,y1,0,1,Z,Z+12,'#7a1f2b'); qR(c,x1,y0,y1,0,1,Z,Z+12,'#5e1721');
  for(let k=0;k<3;k++)qL(c,x0,x1,y1,.08+k*.3,.2+k*.3,Z+14,Z+30,'#d8c8a6');
  for(const u of [.08,.82])qL(c,x0,x1,y1,u,u+.1,Z+2,Z+10,'#f2c230');
  wL(c,x0,x1,y1,.35,.65,Z,Z+10,1,'#ffe9a8');
  box(c,x0+.25,y1,x1-.25,y1+.45,Z+12,Z+16,'#7a1f2b'); qL(c,x0+.25,x1-.25,y1+.45,.05,.95,Z+12.5,Z+15.5,'#fff6c2');
  for(let k=0;k<14;k++){const [px,py]=P(x0+.3+k*(x1-x0-.6)/13,y1+.45,Z+16.5); if(LM)ell2(c,px,py,1.4,'#fff2a8'); else ell(c,px,py,1.1,1.1,'#ffe066');}
  box(c,x0+(x1-x0)*.45,y1-.05,x0+(x1-x0)*.55,y1+.12,Z+16,Z+52,'#7a1f2b'); for(let k=0;k<6;k++){const [px,py]=P(x0+(x1-x0)*.5,y1+.12,Z+20+k*5.5); if(LM)ell2(c,px,py,1.6,'#fff2a8'); else ell(c,px,py,1.4,1.4,'#ffe066');}
  box(c,x0-.04,y0-.04,x1+.04,y1+.04,Z+34,Z+37,'#d8c8a6');
  for(const [u,v] of [[.8,.8],[2.1,.8]]){box(c,u-.18,v-.18,u+.18,v+.18,Z+37,Z+41,'#555'); cyl(c,u,v,Z+41,Z+47,.15,'#8a9096','#e8f4ff');}
  flat(c,x0,y1+.45,x1,H-.05,2.02,'#d9d4c8');};
ART.casino=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'p'); const Z=2,x0=.3,y0=.3,x1=W-.3,y1=H-.9;
  box(c,x0,y0,x1,y1,Z,Z+38,'#d9b23a'); qL(c,x0,x1,y1,0,1,Z,Z+14,'#a8231f'); qR(c,x1,y0,y1,0,1,Z,Z+14,'#861b18'); winGrid(c,x0,y0,x1,y1,Z+16,Z+38,2,7,5,'#ffe9a8');
  wL(c,x0,x1,y1,.38,.62,Z,Z+12,2,'#ffe9a8');
  for(let k=0;k<20;k++){const [px,py]=P(x0+k*(x1-x0)/19,y1,Z+14); if(LM)ell2(c,px,py,1.3,'#fff2a8'); else ell(c,px,py,1,1,'#fff2a8');}
  const mx=(x0+x1)/2; box(c,mx-.9,y1-.12,mx+.9,y1,Z+38,Z+60,'#a8231f'); const [sx,sy]=P(mx,y1,Z+50);
  if(!LM){c.fillStyle='#fff';c.fillRect(sx-14,sy-8,10,14);c.fillStyle='#d63c3c';c.font='700 9px sans-serif';c.textAlign='center';c.fillText('♦',sx-9,sy+3);c.fillStyle='#fff';c.fillRect(sx+3,sy-6,10,10);c.fillStyle='#222';c.fillRect(sx+5,sy-4,2,2);c.fillRect(sx+9,sy,2,2);}
  else{c.fillStyle='rgba(255,220,120,.9)';c.fillRect(sx-16,sy-10,32,18);}
  const [fx,fy]=P(mx,H-.45,2); ell(c,fx,fy,18,9,'#cfc8bd'); ell(c,fx,fy-1,14,7,'#6cc0ee'); line(c,[fx,fy-2],[fx,fy-14],'#d8f0ff',2);
  for(const u of [x0+.3,x1-.3]){const [px,py]=P(u,H-.4,2); line(c,[px,py],[px,py-16],'#7a5230',2); for(let k=0;k<5;k++){const a=-Math.PI*(k/4); if(!LM){c.strokeStyle='#2f9a5a';c.lineWidth=3;c.beginPath();c.moveTo(px,py-16);c.quadraticCurveTo(px+Math.cos(a)*6,py-22,px+Math.cos(a)*10,py-14+Math.abs(Math.sin(a))*-4);c.stroke();}}}};
ART.arcade=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'p'); const Z=2,x0=.3,y0=.3,x1=W-.3,y1=H-.45;
  box(c,x0,y0,x1,y1,Z,Z+20,'#6a3fa0'); qR(c,x1,y0,y1,0,1,Z,Z+20,'#2fa39a'); wL(c,x0,x1,y1,.05,.7,Z+1,Z+13,1,'#3a2a5a');
  if(!LM)for(let k=0;k<4;k++)qL(c,x0,x1,y1,.08+k*.15,.16+k*.15,Z+1,Z+10,['#e63946','#ffd23f','#3ee0d0','#ff7ad9'][k]);
  qL(c,x0,x1,y1,.76,.92,Z,Z+12,'#222'); box(c,x0-.04,y0-.04,x1+.04,y1+.04,Z+20,Z+22,'#4b2a78');
  const mx=(x0+x1)/2; box(c,mx-.6,y1-.1,mx+.6,y1,Z+22,Z+32,'#1a1030'); qL(c,mx-.6,mx+.6,y1,.08,.92,Z+24,Z+30,LM?'#ff7ad9':'#ff4fd0');};
ART.bowling=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'p'); const Z=2,x0=.3,y0=.35,x1=W-.3,y1=H-.45;
  box(c,x0,y0,x1,y1,Z,Z+20,'#5fc7c0'); qL(c,x0,x1,y1,0,1,Z+12,Z+20,'#f5f5f2'); qR(c,x1,y0,y1,0,1,Z+12,Z+20,'#e2e2df');
  wL(c,x0,x1,y1,.1,.4,Z+1,Z+10,1,'#cfe9f5'); qL(c,x0,x1,y1,.45,.6,Z,Z+10,'#2b6cb0'); wL(c,x0,x1,y1,.65,.92,Z+1,Z+10,2,'#cfe9f5');
  box(c,x0-.04,y0-.04,x1+.04,y1+.04,Z+20,Z+22,'#3a9a92');
  const [px,py]=P(x0+(x1-x0)*.7,(y0+y1)/2,Z+22); if(!LM){ell(c,px,py-16,6,14,'#ffffff'); ell(c,px,py-28,4,5,'#ffffff'); c.fillStyle='#e63946';c.fillRect(px-4.5,py-25,9,2.5);}
  const [sx,sy]=P(x0+(x1-x0)*.25,y1,Z+28); if(!LM){c.fillStyle='#ffd23f';c.beginPath();for(let k=0;k<16;k++){const a=k*Math.PI/8,r=k%2?4:10;c.lineTo(sx+Math.cos(a)*r,sy+Math.sin(a)*r);}c.closePath();c.fill();}};
ART.civic=(c,t,a)=>{const W=t.w,H=t.h; lot(c,W,H,a.lot); const Z=2,x0=.3,y0=.3,x1=W-.3,y1=H-(a.yard?.9:.45),Ht=a.H;
  if(a.yard){flat(c,.15,H-.85,W-.15,H-.1,2.05,'#c9c3b5'); for(let k=0;k<4;k++)flat(c,.4+k*.18,H-.6,.54+k*.18,H-.45,2.1,'#fff'); line(c,P(W-.6,H-.5,2),P(W-.6,H-.5,16),'#666',1.4);}
  box(c,x0,y0,x1,y1,Z,Z+Ht,a.wall); const fl=Math.max(1,Math.round(Ht/14));
  winGrid(c,x0,y0,x1,y1,Z+2,Z+Ht-4,fl,Math.round((x1-x0)*2),Math.round((y1-y0)*1.8),null,1);
  qL(c,x0,x1,y1,0,1,Z+Ht-4,Z+Ht,a.trim); qR(c,x1,y0,y1,0,1,Z+Ht-4,Z+Ht,sh(a.trim,.85));
  const nl=Math.round((x1-x0)*2), du=(Math.floor(nl/2)+.5)/nl; qL(c,x0,x1,y1,du-.3/nl,du+.3/nl,Z,Z+11,'#6a8fa8'); box(c,x0+(x1-x0)*(du-.5/nl),y1,x0+(x1-x0)*(du+.5/nl),y1+.22,Z+11,Z+13,a.trim);
  walk(c,x0+(x1-x0)*du,y1,H,.13,'#ddd5c6'); box(c,x0-.03,y0-.03,x1+.03,y1+.03,Z+Ht,Z+Ht+2,sh(a.wall,.82));
  const mx=(x0+x1)/2,my=(y0+y1)/2;
  if(a.sym==='cross'){poly(c,[P(mx-.35,my-.1,Z+Ht+2.1),P(mx+.35,my-.1,Z+Ht+2.1),P(mx+.35,my+.1,Z+Ht+2.1),P(mx-.35,my+.1,Z+Ht+2.1)],a.trim);poly(c,[P(mx-.1,my-.35,Z+Ht+2.1),P(mx+.1,my-.35,Z+Ht+2.1),P(mx+.1,my+.35,Z+Ht+2.1),P(mx-.1,my+.35,Z+Ht+2.1)],a.trim);}
  if(a.sym==='clock'){box(c,mx-.35,y1-.35,mx+.35,y1,Z+Ht,Z+Ht+12,a.wall); gable(c,mx-.4,y1-.4,mx+.4,y1+.05,Z+Ht+12,7,'#6b4b3a',a.wall); const [kx,ky]=P(mx,y1,Z+Ht+6); ell(c,kx,ky,4,4,'#fff'); line(c,[kx,ky],[kx,ky-3],'#333',1); line(c,[kx,ky],[kx+2,ky],'#333',1);}
  if(a.sym==='shield'){const [kx,ky]=P(mx,y1,Z+Ht-10); poly(c,[[kx-5,ky-6],[kx+5,ky-6],[kx+5,ky],[kx,ky+5],[kx-5,ky]],'#2b5ea8'); poly(c,[[kx-2,ky-3],[kx+2,ky-3],[kx,ky+1]],'#ffd23f');
    line(c,P(x1-.3,y0+.3,Z+Ht+2),P(x1-.3,y0+.3,Z+Ht+22),'#555',1.2);}
  if(a.flag)flag(c,x0+.25,y1+.15,Z+2,'#2f9a5a');};
ART.fire=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'p'); const Z=2,x0=.3,y0=.3,x1=W-.3,y1=H-.5;
  box(c,x0+.2,y0,x0+.75,y0+.6,Z,Z+48,'#a33a2a'); for(let k=0;k<4;k++)wR(c,x0+.75,y0,y0+.6,.3,.7,Z+12+k*9,Z+17+k*9,k); pyr(c,x0+.15,y0-.05,x0+.8,y0+.65,Z+48,8,'#3b3b3b');
  box(c,x0,y0+.3,x1,y1,Z,Z+26,'#b5432f'); for(let z=Z+2;z<Z+26;z+=3)qL(c,x0,x1,y1,0,1,z,z+.5,'rgba(0,0,0,.08)');
  for(let k=0;k<2;k++){qL(c,x0,x1,y1,.1+k*.42,.45+k*.42,Z,Z+15,'#e2e2df'); for(let z=Z+2;z<Z+15;z+=2.5)qL(c,x0,x1,y1,.1+k*.42,.45+k*.42,z,z+.5,'rgba(0,0,0,.15)'); qL(c,x0,x1,y1,.1+k*.42,.45+k*.42,Z+15,Z+17,'#ffffff');}
  for(let k=0;k<4;k++)wL(c,x0,x1,y1,.08+k*.23,.2+k*.23,Z+19,Z+24,k+5); wR(c,x1,y0+.3,y1,.2,.8,Z+6,Z+20,9);
  box(c,x0-.03,y0+.27,x1+.03,y1+.03,Z+26,Z+28,'#f2efe8'); const [bx,by]=P(x0+(x1-x0)*.5,y1,Z+21); ell(c,bx,by,2.4,2.4,'#d9b23a'); flat(c,x0,y1,x1,H-.05,2.02,'#c2bdb3');};
ART.library=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'g'); const Z=2,x0=.3,y0=.3,x1=W-.3,y1=H-.75;
  box(c,x0,y0,x1,y1,Z+4,Z+30,'#ece4d2'); box(c,x0-.1,y0-.1,x1+.1,y1+.1,Z,Z+4,'#d6ccb6');
  for(let k=0;k<5;k++)wR(c,x1,y0,y1,(k+.25)/5,(k+.75)/5,Z+10,Z+24,k);
  for(let k=0;k<7;k++){qL(c,x0,x1,y1,(k+.3)/7,(k+.6)/7,Z+4,Z+26,'#ffffff');}
  for(let s=0;s<4;s++)box(c,x0+(x1-x0)*.2,y1+s*.08,x0+(x1-x0)*.8,y1+.1+s*.08,Z,Z+4-s*.9,'#d6ccb6');
  box(c,x0-.04,y0-.04,x1+.04,y1+.04,Z+30,Z+33,'#d6ccb6'); poly(c,[P(x0+.2,y1+.04,Z+33),P(x1-.2,y1+.04,Z+33),P((x0+x1)/2,y1+.04,Z+42)],'#e8dfca',EDGE);
  const [dx,dy]=P((x0+x1)/2,(y0+y1)/2,Z+33); if(!LM){c.beginPath();c.ellipse(dx,dy,14,7,0,Math.PI,0);c.bezierCurveTo(dx+14,dy-16,dx-14,dy-16,dx-14,dy);c.fillStyle='#7aa6a0';c.fill();}
  for(const u of [.15,.85]){const [lx,ly]=P(x0+(x1-x0)*u,y1+.35,Z); ell(c,lx,ly-5,4,3.5,'#d6ccb6'); ell(c,lx,ly-9,2.6,2.6,'#cfc4ad');}};
ART.church=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'g'); const Z=2,x0=1,y0=.4,x1=W-.3,y1=H-.45;
  box(c,x0,y0,x1,y1,Z,Z+24,'#f7f4ec'); for(let k=0;k<3;k++)wR(c,x1,y0,y1,(k+.3)/3,(k+.7)/3,Z+8,Z+20,k,'#9fc5e8');
  gableY(c,x0-.08,y0-.1,x1+.08,y1+.1,Z+24,12,'#cf6b3d','#f7f4ec');
  for(let k=0;k<3;k++)wL(c,x0,x1,y1,(k+.35)/3,(k+.65)/3,Z+8,Z+20,k+5,'#9fc5e8');
  const tx0=.3,tx1=1.05,ty0=y1-.8,ty1=y1+.05; box(c,tx0,ty0,tx1,ty1,Z,Z+52,'#f7f4ec'); qL(c,tx0,tx1,ty1,.3,.7,Z,Z+14,DOOR);
  const [rx,ry]=P((tx0+tx1)/2,ty1,Z+24); ell(c,rx,ry,4.5,4.5,'#5ba3d9'); ell(c,rx,ry,2,2,'#f2c230');
  qL(c,tx0,tx1,ty1,.35,.65,Z+36,Z+46,'#3a3a3a'); qR(c,tx1,ty0,ty1,.35,.65,Z+36,Z+46,'#3a3a3a');
  pyr(c,tx0-.05,ty0-.05,tx1+.05,ty1+.05,Z+52,18,'#cf6b3d'); const [cx,cy]=P((tx0+tx1)/2,(ty0+ty1)/2,Z+70); line(c,[cx,cy],[cx,cy-10],'#d4a017',1.8); line(c,[cx-3.5,cy-6.5],[cx+3.5,cy-6.5],'#d4a017',1.8);
  walk(c,(tx0+tx1)/2,ty1,H,.12); shrub(c,x0+.4,y1+.22,.6); shrub(c,x1-.3,y1+.22,.6);};
ART.mosque=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'b'); const Z=2,x0=.55,y0=.45,x1=W-.45,y1=H-.75;
  box(c,x0,y0,x1,y1,Z,Z+26,'#fbfaf6'); for(let k=0;k<4;k++){qL(c,x0,x1,y1,(k+.2)/4,(k+.8)/4,Z+3,Z+18,'#2f8f8a'); qL(c,x0,x1,y1,(k+.28)/4,(k+.72)/4,Z+3,Z+16,'#e8f1f0');}
  for(let k=0;k<3;k++)qR(c,x1,y0,y1,(k+.25)/3,(k+.75)/3,Z+6,Z+18,'#2f8f8a');
  box(c,x0-.04,y0-.04,x1+.04,y1+.04,Z+26,Z+29,'#e8e2d4'); const [dx,dy]=P((x0+x1)/2,(y0+y1)/2,Z+29);
  if(!LM){c.beginPath();c.ellipse(dx,dy,30,15,0,Math.PI,0);c.bezierCurveTo(dx+32,dy-44,dx-32,dy-44,dx-30,dy);c.fillStyle='#2fa39a';c.fill(); c.beginPath();c.moveTo(dx-12,dy-8);c.quadraticCurveTo(dx-14,dy-28,dx-2,dy-34);c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=3;c.stroke();}
  line(c,[dx,dy-35],[dx,dy-46],'#d4a017',1.6); ell(c,dx,dy-48,2.5,2.5,'#d4a017');
  for(const [x,y] of [[.3,H-.4],[W-.3,.35]]){cyl(c,x,y,Z,Z+70,.13,'#fbfaf6'); box(c,x-.16,y-.16,x+.16,y+.16,Z+50,Z+53,'#e8e2d4'); const [mx,my]=P(x,y,Z+70); if(!LM){c.fillStyle='#2fa39a';c.beginPath();c.moveTo(mx-4,my);c.lineTo(mx,my-12);c.lineTo(mx+4,my);c.fill();}}
  const [fx,fy]=P(W/2,H-.38,2); ell(c,fx,fy,9,4.5,'#cfc8bd'); ell(c,fx,fy-1,7,3.4,'#6cc0ee');};
ART.temple=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'p'); const Z=2,x0=.5,y0=.45,x1=W-.45,y1=H-.85;
  for(let s=0;s<3;s++)box(c,x0+.6,y1+s*.1,x1-.6,y1+.12+s*.1,Z,Z+6-s*2,'#c9c3b5');
  box(c,x0,y0,x1,y1,Z+4,Z+22,'#c43a2c'); for(let k=0;k<5;k++)qL(c,x0,x1,y1,k/4-.02,k/4+.02,Z+4,Z+22,'#8f1d16'); wL(c,x0,x1,y1,.3,.7,Z+6,Z+18,1,'#f2d38a');
  hip(c,x0-.2,y0-.2,x1+.2,y1+.2,Z+22,7,'#e08a2c'); box(c,x0+.35,y0+.35,x1-.35,y1-.35,Z+27,Z+40,'#c43a2c'); wL(c,x0+.35,x1-.35,y1-.35,.3,.7,Z+30,Z+37,4,'#f2d38a'); hip(c,x0+.15,y0+.15,x1-.15,y1-.15,Z+40,11,'#e08a2c');
  for(const [px,py] of [[x0-.2,y1+.2],[x1+.2,y1+.2],[x1+.2,y0-.2]]){const [sx,sy]=P(px,py,Z+22); poly(c,[[sx-4,sy+1],[sx+4,sy+1],[sx+(px>x0?7:-7),sy-7]],'#b86a1f');}
  const [ix,iy]=P(W/2-.2,H-.35,2); ell(c,ix,iy-3,7,4,'#8a6a3a'); ell(c,ix,iy-6,5,2.5,'#a8834e'); if(!LM){c.fillStyle='rgba(200,200,200,.5)';c.fillRect(ix-.5,iy-16,1,10);}
  for(const u of [x0+.4,x1-.4]){const [lx,ly]=P(u,y1+.35,Z); ell(c,lx,ly-4,3,3,'#9a9a94');}
  lantern(c,x0+.25,y1+.1,Z+20); lantern(c,x1-.25,y1+.1,Z+20);};
ART.hospital=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'p'); const Z=2,x0=.3,y0=.3,x1=W-.3,y1=H-.6;
  box(c,x0,y0,x1,y1,Z,Z+70,'#f7f8f9'); winGrid(c,x0,y0,x1,y1,Z+4,Z+66,6,Math.round((x1-x0)*2.4),Math.round((y1-y0)*2.4),'#7fb7e6',1);
  qL(c,x0,x1,y1,.42,.58,Z,Z+11,'#9fd0e3'); box(c,x0+(x1-x0)*.35,y1,x0+(x1-x0)*.65,y1+.4,Z+11,Z+13,'#f7f8f9');
  box(c,x0+(x1-x0)*.75,y1,x0+(x1-x0)*.95,y1+.45,Z+11,Z+13,'#e5484d'); box(c,x0-.03,y0-.03,x1+.03,y1+.03,Z+70,Z+72,'#d9dde1');
  const mx=(x0+x1)/2,my=(y0+y1)/2; const [hx,hy]=P(mx,my,Z+72.1); ell(c,hx,hy,22,11,'#3b3f44'); if(!LM){c.strokeStyle='#ffd23f';c.lineWidth=1.4;c.beginPath();c.ellipse(hx,hy,18,9,0,0,Math.PI*2);c.stroke();c.fillStyle='#fff';c.font='700 10px sans-serif';c.textAlign='center';c.fillText('H',hx,hy+3.5);}
  const [cx,cy]=P(x1,y1,Z+62); poly(c,[[cx+3,cy-10],[cx+7,cy-12],[cx+7,cy-8],[cx+11,cy-10],[cx+11,cy-6],[cx+7,cy-4],[cx+7,cy],[cx+3,cy+2],[cx+3,cy-2],[cx-1,cy],[cx-1,cy-4],[cx+3,cy-6]],'#e5484d');};
ART.uni=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'g'); const Z=2; flat(c,1.2,1.2,W-.2,H-.2,2.05,'#86c763'); flat(c,1.2,2.55,W-.2,2.75,2.08,'#e0d8c8'); flat(c,2.55,1.2,2.75,H-.2,2.08,'#e0d8c8');
  box(c,.3,.3,1.1,H-.4,Z,Z+30,'#b4553f'); winGrid(c,.3,.3,1.1,H-.4,Z+3,Z+30,2,2,6,null);  hip(c,.25,.25,1.15,H-.35,Z+30,8,'#4a4a4a');
  box(c,1.3,.3,W-.3,1.1,Z,Z+30,'#b4553f'); winGrid(c,1.3,.3,W-.3,1.1,Z+3,Z+30,2,4,2,null); hip(c,1.25,.25,W-.25,1.15,Z+30,8,'#4a4a4a');
  box(c,1.35,1.35,2.45,2.45,Z,Z+36,'#cfc6b2'); winGrid(c,1.35,1.35,2.45,2.45,Z+3,Z+36,3,3,3,null,1); hip(c,1.3,1.3,2.5,2.5,Z+36,10,'#5a5a5a');
  box(c,1.65,1.65,2.15,2.15,Z+36,Z+76,'#cfc6b2'); const [kx,ky]=P(1.9,2.15,Z+64); ell(c,kx,ky,5,5,'#fff'); line(c,[kx,ky],[kx,ky-4],'#333',1); line(c,[kx,ky],[kx+3,ky],'#333',1);
  pyr(c,1.6,1.6,2.2,2.2,Z+76,16,'#5a5a5a'); for(let k=0;k<4;k++){const [vx,vy]=P(.3+k*.2,H-.4,Z+6+k*5); ell(c,vx,vy,4,3,'#3f8f3a');}
  treeAt(c,3.4,3.4,.7,1); treeAt(c,3.5,1.6,.65,0);};
ART.hall=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'p'); const Z=2,x0=.3,y0=.3,x1=W-.3,y1=H-.55;
  box(c,x0-.05,y0-.05,x1+.05,y1+.05,Z,Z+5,'#d8d2c6'); box(c,x0,y0,x1,y1,Z+5,Z+38,'#f3ead8');
  for(let k=0;k<7;k++){qL(c,x0,x1,y1,(k+.3)/7,(k+.62)/7,Z+6,Z+30,'#ffffff'); qL(c,x0,x1,y1,(k+.62)/7,(k+.72)/7,Z+6,Z+30,'rgba(0,0,0,.12)');}
  for(let k=0;k<5;k++)wR(c,x1,y0,y1,(k+.25)/5,(k+.75)/5,Z+12,Z+28,k);
  for(let k=0;k<4;k++)wL(c,x0,x1,y1,(k*1.75+.68)/7,(k*1.75+.95)/7,Z+12,Z+26,k+9);
  qL(c,x0,x1,y1,0,1,Z+31,Z+38,'#2f6690'); qR(c,x1,y0,y1,0,1,Z+31,Z+38,'#24557a');
  for(let s=0;s<3;s++)box(c,x0+.6,y1+s*.08,x1-.6,y1+.1+s*.08,Z,Z+5-s*1.5,'#d8d2c6');
  const mx=(x0+x1)/2,my=(y0+y1)/2; box(c,mx-.5,my-.5,mx+.5,my+.5,Z+38,Z+48,'#f3ead8'); const [kx,ky]=P(mx,my+.5,Z+43); ell(c,kx,ky,3.5,3.5,'#fff');
  const [dx,dy]=P(mx,my,Z+48); if(!LM){c.beginPath();c.ellipse(dx,dy,31,15,0,0,Math.PI*2);c.fillStyle='#24557a';c.fill(); c.beginPath();c.moveTo(dx-31,dy);c.bezierCurveTo(dx-31,dy-30,dx+31,dy-30,dx+31,dy);c.closePath();c.fillStyle='#2f6690';c.fill();
    c.beginPath();c.moveTo(dx-18,dy-6);c.bezierCurveTo(dx-16,dy-20,dx-4,dy-24,dx+2,dy-24);c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=3;c.stroke(); c.fillStyle='#ffd166';c.beginPath();c.arc(dx,dy-24,3.5,0,Math.PI*2);c.fill();}
  flag(c,x1-.2,y0+.2,Z+38,'#2f9a5a');};
ART.eiffel=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'p'); flat(c,.2,.2,W-.2,H-.2,2.05,'#9fcf7a'); flat(c,.5,.5,W-.5,H-.5,2.08,'#e0d8c8');
  if(LM)return; const col='#7a4f2e', top=[W/2,H/2]; const legs=[[.45,.45],[W-.45,.45],[.45,H-.45],[W-.45,H-.45]];
  const at=(lx,ly,z,f)=>P(lx+(top[0]-lx)*f,ly+(top[1]-ly)*f,z);
  const levels=[[0,0],[40,.42],[100,.72],[200,.95]];
  const ord=[0,1,2,3].sort((a,b)=>(legs[a][0]+legs[a][1])-(legs[b][0]+legs[b][1]));
  for(const li of ord){const [lx,ly]=legs[li]; c.strokeStyle=sh(col,li===3?.85:1); c.lineWidth=3.4;
    for(let s=0;s<3;s++){const [z0,f0]=levels[s],[z1,f1]=levels[s+1]; const a=at(lx,ly,z0+2,f0),b=at(lx,ly,z1+2,f1); c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();
      c.lineWidth=.8; for(let k=0;k<5;k++){const u=k/5,v=(k+1)/5; const p=[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u],q=[a[0]+(b[0]-a[0])*v,a[1]+(b[1]-a[1])*v]; c.beginPath();c.moveTo(p[0]-3*(1-f0),p[1]);c.lineTo(q[0]+3*(1-f0),q[1]);c.stroke();} c.lineWidth=2.6;}}
  for(const [z,f] of [[40,.42],[100,.72]]){const pts=legs.map(([lx,ly])=>at(lx,ly,z+2,f)); poly(c,[pts[0],pts[1],pts[3],pts[2]],sh(col,.9),'#4a2f1a');}
  // arcos da base
  c.strokeStyle=col;c.lineWidth=2;for(const [a,b] of [[2,3],[1,3]]){const p=at(legs[a][0],legs[a][1],2,0),q=at(legs[b][0],legs[b][1],2,0); const m=[(p[0]+q[0])/2,(p[1]+q[1])/2-26]; c.beginPath();c.moveTo(p[0],p[1]-14);c.quadraticCurveTo(m[0],m[1],q[0],q[1]-14);c.stroke();}
  const [tx,ty]=P(top[0],top[1],202); c.lineWidth=2;c.beginPath();c.moveTo(tx,ty);c.lineTo(tx,ty-20);c.stroke(); poly(c,[[tx,ty-20],[tx+7,ty-18],[tx,ty-15]],'#2b6cb0');
  for(let k=0;k<4;k++)shrub(c,[.3,W-.3,.3,W-.3][k],[1.5,1.5,.3,H-.3][k],.6);};
ART.colosseum=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'p'); if(LM)return; const [cx,cy]=P(W/2,H/2,2), R=W*.45*TW/2;
  const stone='#d9c9a3';
  c.fillStyle=sh(stone,.75);c.beginPath();c.ellipse(cx,cy-46,R,R/2,0,Math.PI,0);c.lineTo(cx+R,cy-46);c.ellipse(cx,cy,R,R/2,0,0,Math.PI,true);c.closePath();c.fill();
  c.fillStyle='#cdbb8f';c.beginPath();c.ellipse(cx,cy-46,R*.8,R*.4,0,0,Math.PI*2);c.fill();
  for(let r=0;r<3;r++){c.fillStyle=sh(stone,.8+r*.08);c.beginPath();c.ellipse(cx,cy-40+r*8,R*(.8-r*.08),R*(.4-r*.04),0,0,Math.PI*2);c.fill();}
  c.fillStyle='#d8c08a';c.beginPath();c.ellipse(cx,cy-16,R*.45,R*.22,0,0,Math.PI*2);c.fill();
  // parede da frente (parte em ruína do lado direito)
  for(let k=0;k<28;k++){const a0=Math.PI*k/28,a1=Math.PI*(k+1)/28; const hgt=k>18?24+((k*7)%5)*3:46;
    const x0=cx-Math.cos(a0)*R,y0=cy+Math.sin(a0)*R/2,x1=cx-Math.cos(a1)*R,y1=cy+Math.sin(a1)*R/2;
    c.fillStyle=sh(stone,.85+.15*Math.sin(a0)); c.beginPath();c.moveTo(x0,y0);c.lineTo(x1,y1);c.lineTo(x1,y1-hgt);c.lineTo(x0,y0-hgt);c.closePath();c.fill();
    for(let r=0;r<3;r++){if(r*15+12>hgt)break; const mxp=(x0+x1)/2,myp=(y0+y1)/2-r*15-4; c.fillStyle='rgba(70,50,30,.55)'; c.beginPath();c.ellipse(mxp,myp-5,Math.abs(x1-x0)*.32,5,0,Math.PI,0);c.lineTo(mxp+Math.abs(x1-x0)*.32,myp+1);c.lineTo(mxp-Math.abs(x1-x0)*.32,myp+1);c.fill();}}
  c.strokeStyle='rgba(90,70,40,.4)';c.lineWidth=1;for(const z of [16,31]){c.beginPath();c.ellipse(cx,cy-z,R,R/2,0,0,Math.PI);c.stroke();}};
ART.copan=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'p'); const Z=2, Ht=200, n=24; const curve=u=>.45+ .45*Math.sin(u*Math.PI*1.6-.6);
  const pts=[]; for(let k=0;k<=n;k++){const u=k/n; pts.push([.2+u*(W-.4),curve(u)]);}
  // laje traseira (topo) e faces
  const depth=.75;
  for(let k=0;k<n;k++){const [ax,ay]=pts[k],[bx,by]=pts[k+1]; const nx=-(by-ay),ny=(bx-ax),L=Math.hypot(nx,ny); const sh2=.78+.22*((nx+ny)/L/1.414);
    poly(c,[P(ax,ay+depth,Z),P(bx,by+depth,Z),P(bx,by+depth,Z+Ht),P(ax,ay+depth,Z+Ht)],sh('#e9e6dc',clamp(sh2,.6,1)));}
  for(let k=0;k<n;k++){const [ax,ay]=pts[k],[bx,by]=pts[k+1];
    for(let z=Z+10;z<Z+Ht-2;z+=6.5){poly(c,[P(ax,ay+depth,z),P(bx,by+depth,z),P(bx,by+depth,z+2.2),P(ax,ay+depth,z+2.2)],'#ffffff');
      if(!LM)poly(c,[P(ax,ay+depth,z+2.2),P(bx,by+depth,z+2.2),P(bx,by+depth,z+5),P(ax,ay+depth,z+5)],'rgba(120,140,160,.35)'); else if(isLit(k,z|0))polyL(c,[P(ax,ay+depth,z+2.4),P(bx,by+depth,z+2.4),P(bx,by+depth,z+4.8),P(ax,ay+depth,z+4.8)],LIT);}}
  const top=[];for(const p of pts)top.push(P(p[0],p[1],Z+Ht)); for(let k=n;k>=0;k--)top.push(P(pts[k][0],pts[k][1]+depth,Z+Ht)); poly(c,top,'#d6d2c6');
  const [ex,ey]=P(W-.2,pts[n][1],Z); poly(c,[P(W-.2,pts[n][1],Z),P(W-.2,pts[n][1]+depth,Z),P(W-.2,pts[n][1]+depth,Z+Ht),P(W-.2,pts[n][1],Z+Ht)],'#cfcabd');
  for(let k=0;k<6;k++){const u=.4+k*.55; box(c,u,H-.55,u+.08,H-.47,Z,Z+10,'#bdb8ab');}};
ART.barn=(c,t,a)=>{const W=t.w,H=t.h; lot(c,W,H,a.lot); const Z=2,x0=.3,y0=.3,x1=W-(a.silo?.75:.3),y1=H-.4,Ht=a.tall?26:20;
  if(a.silo){cyl(c,W-.4,.75,Z,Z+40,.28,'#b9c2cc'); const [sx,sy]=P(W-.4,.75,Z+40); ell(c,sx,sy-3,9,6,'#9aa4ad');}
  box(c,x0,y0,x1,y1,Z,Z+Ht,a.wall); qL(c,x0,x1,y1,.28,.72,Z,Z+Ht*.75,'#5a2a1d');
  const a1=P(x0+(x1-x0)*.28,y1,Z),b1=P(x0+(x1-x0)*.72,y1,Z+Ht*.75),c1=P(x0+(x1-x0)*.72,y1,Z),d1=P(x0+(x1-x0)*.28,y1,Z+Ht*.75); line(c,a1,b1,'#fff',1.4); line(c,c1,d1,'#fff',1.4);
  qL(c,x0,x1,y1,.28,.72,Z+Ht*.75,Z+Ht*.78,'#fff'); qR(c,x1,y0,y1,.4,.6,Z+Ht*.45,Z+Ht*.72,'#f4e3c1');
  if(a.tall){gableY(c,x0-.1,y0-.1,x1+.1,y1+.1,Z+Ht,16,a.roof,a.wall);} else gable(c,x0-.1,y0-.1,x1+.1,y1+.1,Z+Ht,14,a.roof,a.wall);
  for(let k=0;k<3;k++)box(c,x0+.1+k*.25,y1+.08,x0+.3+k*.25,y1+.28,Z,Z+4,k%2?'#c7a04a':'#b07a4a');};
ART.ware=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'c'); const Z=2,x0=.3,y0=.3,x1=W-.3,y1=H-.7;
  box(c,x0,y0,x1,y1,Z,Z+30,'#a7b0b8'); for(let k=0;k<12;k++)qR(c,x1,y0,y1,k/12,k/12+.015,Z,Z+30,'rgba(0,0,0,.1)');
  for(let k=0;k<3;k++){const u=(k+.15)/3; qL(c,x0,x1,y1,u,u+.22,Z,Z+18,'#5f6870'); for(let s=1;s<6;s++)qL(c,x0,x1,y1,u,u+.22,Z+18*s/6,Z+18*s/6+.8,'#4c545b');}
  qR(c,x1,y0,y1,.1,.9,Z+20,Z+25,WIN); gable(c,x0-.08,y0-.08,x1+.08,y1+.08,Z+30,12,'#3f6f9a','#a7b0b8');
  box(c,x0,y1+.15,x0+.9,y1+.55,Z,Z+10,'#c0392b'); box(c,x0+1,y1+.15,x0+1.9,y1+.55,Z,Z+10,'#2b6cb0'); for(let k=0;k<2;k++)box(c,x1-.6+k*.3,y1+.2,x1-.35+k*.3,y1+.45,Z,Z+5,'#b07a4a');};
ART.station=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'p'); const Z=2;
  box(c,.3,.15,W-.6,.95,Z,Z+24,'#b4553f'); for(let k=0;k<6;k++)wL(c,.3,W-.6,.95,(k+.2)/6,(k+.7)/6,Z+8,Z+18,k); qL(c,.3,W-.6,.95,.45,.55,Z,Z+16,DOOR);
  gable(c,.2,.05,W-.5,1.05,Z+24,11,'#5a4a3a','#b4553f'); const [kx,ky]=P((W-.3)/2,.95,Z+20); ell(c,kx,ky,4,4,'#fff');
  box(c,.15,1.05,W-.15,1.25,Z,Z+3,'#c9c3b5'); box(c,.15,1.0,W-.15,1.3,Z+16,Z+18,'#6b5b4b'); for(let k=0;k<5;k++){const u=.3+k*(W-.6)/4; line(c,P(u,1.25,Z+3),P(u,1.25,Z+16),'#3a3a3a',1.4);}
  flat(c,.05,1.35,W-.05,H-.05,2.02,'#9a8f80'); for(let k=0;k<=W*4;k++){const u=.1+k*(W-.2)/(W*4); line(c,P(u,1.42,2.1),P(u,H-.12,2.1),'#7a5c3a',2.2);}
  for(const ry of [1.55,1.82])line(c,P(.05,ry,3),P(W-.05,ry,3),'#5d6066',1.6);};
// ---- decoração e natureza
ART.tree=(c,t,a,v)=>{treeAt(c,.5,.5,1,v||0);};
ART.ipe=(c)=>{const [cx,cy]=P(.5,.5,0); ell(c,cx+3,cy,12,5,'rgba(0,0,0,.15)'); if(!LM){c.fillStyle='#6b4a2a';c.fillRect(cx-1.5,cy-14,3,14);}
  ell(c,cx,cy-24,13,11,'#f2c230'); ell(c,cx-6,cy-19,8,7,'#e8b21e'); ell(c,cx+6,cy-20,8,7,'#d9a017'); ell(c,cx-3,cy-28,7,5,'#ffe066'); for(let k=0;k<5;k++)ell(c,cx-8+k*4,cy+1-(k%2),1.6,.9,'#f2c230');};
ART.flowers=(c)=>{box(c,.15,.15,.85,.85,0,4,'#a8a29a','#6e4a2e'); const cols=['#ff5d8f','#ffd23f','#ffffff','#b388eb','#ff8c42'];
  for(let k=0;k<11;k++){const u=.25+((hsh(k,3,3)%100)/100)*.5,v=.25+((hsh(k,7,7)%100)/100)*.5; const [px,py]=P(u,v,4); ell(c,px,py,2.6,1.6,'#3f8f3a'); ell(c,px,py-2.5,2.3,2.3,cols[k%5]);}};
ART.bench=(c)=>{box(c,.2,.42,.8,.62,0,5,'#3a3a3a'); box(c,.16,.4,.84,.64,5,7,'#a8713e'); box(c,.16,.36,.84,.42,7,15,'#8f5d30');};
ART.hydrant=(c)=>{cyl(c,.5,.5,0,10,.09,'#d63c3c'); const [px,py]=P(.5,.5,10); ell(c,px,py-2,4,3,'#d63c3c'); ell(c,px,py-3,2,1.5,'#e9e9e9'); box(c,.38,.46,.62,.54,5,7,'#c9c9c9');};
ART.lamp=(c)=>{const [bx,by]=P(.5,.5,0); ell(c,bx,by,6,3,'rgba(0,0,0,.2)'); line(c,[bx,by],[bx,by-34],'#1f4a32',2.6); poly(c,[[bx-4,by-34],[bx+4,by-34],[bx+3,by-41],[bx-3,by-41]],'#fff6d0','#1f4a32'); if(LM){polyL(c,[[bx-4,by-34],[bx+4,by-34],[bx+3,by-41],[bx-3,by-41]],'#ffe9a0');} poly(c,[[bx-5,by-41],[bx+5,by-41],[bx,by-46]],'#1f4a32');};
ART.fountain=(c)=>{const [cx,cy]=P(1,1,2); box(c,.05,.05,1.95,1.95,0,2,'#ddd5c6',null,true); ell(c,cx,cy,44,22,'#a39e94'); ell(c,cx,cy-6,44,22,'#d6cfc4'); ell(c,cx,cy-7,37,18,'#5aa9e6'); ell(c,cx+6,cy-9,14,5,'rgba(255,255,255,.35)');
  if(!LM){c.fillStyle='#d6cfc4'; c.fillRect(cx-3,cy-26,6,20);} ell(c,cx,cy-26,12,6,'#cfc8bd'); ell(c,cx,cy-27,9,4,'#7cc0ee');
  if(!LM){c.strokeStyle='rgba(220,242,255,.95)';c.lineWidth=1.6;c.beginPath();c.moveTo(cx,cy-30);c.quadraticCurveTo(cx-14,cy-40,cx-20,cy-12);c.moveTo(cx,cy-30);c.quadraticCurveTo(cx+14,cy-40,cx+20,cy-12);c.stroke();}};
ART.statue=(c)=>{box(c,.2,.2,.8,.8,0,14,'#d6d1c4'); box(c,.4,.4,.6,.6,14,30,'#a8834e'); const [hx,hy]=P(.5,.5,35); ell(c,hx,hy,5,5,'#a8834e'); const a=P(.6,.45,26); line(c,a,[a[0]+7,a[1]-12],'#a8834e',3);};
ART.bandstand=(c)=>{box(c,.15,.15,1.85,1.85,0,6,'#ece6da'); for(const [u,v] of [[.35,.35],[1.65,.35],[.35,1.65],[1.65,1.65],[1,.3],[.3,1]])line(c,P(u,v,6),P(u,v,30),'#fafafa',3); pyr(c,.08,.08,1.92,1.92,30,14,'#2f9c95');};
ART.gate=(c)=>{box(c,.02,.02,1.98,.98,0,2,'#cbc8c0',null,true); for(const u of [.25,1.75]){box(c,u-.1,.4,u+.1,.6,2,40,'#c43a2c');}
  box(c,.1,.35,1.9,.65,34,40,'#c43a2c'); qL(c,.1,1.9,.65,.3,.7,35,39,'#d9a520'); hip(c,0,.2,2,.8,40,10,'#3f8f5f'); for(const [px,py] of [[0,.8],[2,.8],[2,.2]]){const [sx,sy]=P(px,py,40); poly(c,[[sx-4,sy+1],[sx+4,sy+1],[sx+(px>0?6:-6),sy-6]],'#2f7a4f');}
  for(let k=0;k<4;k++)lantern(c,.45+k*.37,.7,30);};
// ---- obstáculos
ART.bigtree=(c,t,a,v)=>{const [cx,cy]=P(.5,.5,0); ell(c,cx+4,cy,17,7,'rgba(0,0,0,.18)'); if(!LM){c.fillStyle='#5e3e22';c.beginPath();c.moveTo(cx-4,cy);c.lineTo(cx-2,cy-16);c.lineTo(cx+2,cy-16);c.lineTo(cx+4,cy);c.fill();}
  const g=['#2c6e33','#356f2a','#2a5f3a'][v%3]; ell(c,cx,cy-30,17,15,g); ell(c,cx-9,cy-24,11,9,g); ell(c,cx+9,cy-25,11,9,sh(g,.82)); ell(c,cx-4,cy-37,9,7,sh(g,1.25)); ell(c,cx+5,cy-33,6,5,sh(g,1.15));};
ART.pine=(c,t,a,v)=>{const [cx,cy]=P(.5,.5,0); ell(c,cx+3,cy,10,4.5,'rgba(0,0,0,.18)'); if(!LM){c.fillStyle='#5e3e22';c.fillRect(cx-1.5,cy-8,3,8);}
  const g=['#24583a','#2d6a3e','#1f4f33'][v%3]; for(let k=0;k<3;k++){const y=cy-8-k*10,w=13-k*3.5; poly(c,[[cx-w,y],[cx+w,y],[cx,y-16]],k%2?sh(g,1.1):g); poly(c,[[cx,y],[cx+w,y],[cx,y-16]],sh(g,.82));}};
ART.rock=(c,t,a,v)=>{const [cx,cy]=P(.5,.5,0); ell(c,cx+2,cy+1,15,6,'rgba(0,0,0,.18)');
  poly(c,[[cx-14,cy],[cx-12,cy-9],[cx-4,cy-15],[cx+7,cy-13],[cx+14,cy-5],[cx+12,cy+1],[cx,cy+3]],'#9a9d9f'); poly(c,[[cx-4,cy-15],[cx+7,cy-13],[cx+14,cy-5],[cx+2,cy-6]],'#b8bbbd');
  poly(c,[[cx+2,cy-6],[cx+14,cy-5],[cx+12,cy+1],[cx,cy+3]],'#7d8082'); ell(c,cx-6,cy-11,4,2,'#6f9a4a'); ell(c,cx+9,cy+3,2.4,1.4,'#8a8d90'); ell(c,cx-12,cy+3,2,1.2,'#8a8d90');};
ART.bush=(c,t,a,v)=>{const [cx,cy]=P(.5,.5,0); ell(c,cx+2,cy,11,4.5,'rgba(0,0,0,.16)'); const g=['#3f8f3a','#4c9a3f','#3a7f45'][v%3];
  ell(c,cx-4,cy-6,7,6,g); ell(c,cx+5,cy-6,7,6,sh(g,.85)); ell(c,cx,cy-10,7,6,sh(g,1.15)); for(let k=0;k<3;k++)ell(c,cx-5+k*5,cy-9+(k%2)*3,1.4,1.4,'#ffffff');};
/* ================= Indústria, porto, hidrelétrica, resort ================= */
ART.lumber=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'c'); const Z=2;
  box(c,.3,.3,1.6,H-.4,Z,Z+18,'#a8703f'); for(let k=0;k<7;k++)qR(c,1.6,.3,H-.4,k/7,k/7+.03,Z,Z+18,'rgba(0,0,0,.15)'); qL(c,.3,1.6,H-.4,.2,.8,Z,Z+13,'#3a2a1a');
  gable(c,.2,.2,1.7,H-.3,Z+18,10,'#6b5b52','#a8703f');
  for(let r=0;r<3;r++)for(let k=0;k<3;k++){const y=.4+k*.22, x=1.9+r*.02; cyl(c,x+.2,y+.1,Z+r*5,Z+r*5+4.6,.11,'#8a5a32','#d9a66b');}
  for(let k=0;k<4;k++)box(c,2.3,1.1+k*.04,W-.25,1.3+k*.04,Z+k*2.5,Z+k*2.5+2,'#d9a66b'); const [sx,sy]=P(1.2,H-.4,Z+6); ell(c,sx,sy,6,6,'#c9ccd0'); ell(c,sx,sy,2,2,'#555');};
ART.quarry=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'c'); const Z=2;
  for(let s=0;s<3;s++)box(c,.2+s*.35,.2+s*.35,W-.2-s*.1,1.4-s*.2,Z,Z+26-s*8,['#8d8f91','#9a9c9e','#a7a9ab'][s]);
  for(let k=0;k<4;k++)box(c,.5+k*.45,2.2,.85+k*.45,2.55,Z,Z+5+(k%2)*3,'#c2c4c6');
  line(c,P(1.4,1.9,Z+6),P(2.6,1.5,Z+20),'#555',2.6); box(c,1.9,2.1,2.5,2.6,Z,Z+7,'#f2c230'); box(c,2,2.2,2.25,2.45,Z+7,Z+12,'#3a3a3a'); line(c,P(2.4,2.3,Z+10),P(2.9,1.7,Z+16),'#f2c230',2);
  const [sx,sy]=P(2.7,1.6,Z+14); ell(c,sx,sy,6,3,'#9a9c9e');};
ART.steel=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'c'); const Z=2;
  box(c,.3,1.2,W-.3,H-.4,Z,Z+22,'#7a8088'); for(let k=0;k<10;k++)qL(c,.3,W-.3,H-.4,k/10,k/10+.02,Z,Z+22,'rgba(0,0,0,.12)'); qL(c,.3,W-.3,H-.4,.55,.85,Z,Z+14,'#ff8a2a');
  if(LM)qL(c,.3,W-.3,H-.4,.55,.85,Z,Z+14,'#ffb050'); gable(c,.25,1.15,W-.25,H-.35,Z+22,8,'#5a6068','#7a8088');
  cyl(c,1,.7,Z,Z+40,.35,'#8a5040'); for(const [x,y] of [[2.1,.5],[2.6,.8]]){cyl(c,x,y,Z,Z+62,.13,'#e8e6e1'); for(let k=0;k<3;k++){const [px,py]=P(x,y,Z+20+k*16); if(!LM){c.fillStyle='#c0392b';c.fillRect(px-4.2,py-5,8.4,5);}}}
  line(c,P(1.3,.7,Z+30),P(2,.9,Z+22),'#555',2); for(let k=0;k<3;k++)box(c,.4+k*.3,H-.3,.65+k*.3,H-.1,Z,Z+3,'#b9bec4');};
ART.rubber=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'c'); const Z=2; flat(c,.1,.1,1.3,H-.1,2.05,'#6cb04f');
  for(let r=0;r<3;r++)for(let k=0;k<3;k++)treeAt(c,.35+r*.38,.5+k*.8,.55,r+k);
  box(c,1.5,.4,W-.3,1.8,Z,Z+20,'#9aa4ad'); for(let k=0;k<8;k++)qR(c,W-.3,.4,1.8,k/8,k/8+.02,Z,Z+20,'rgba(0,0,0,.12)'); gable(c,1.45,.35,W-.25,1.85,Z+20,8,'#4f5961','#9aa4ad');
  cyl(c,1.9,2.4,Z,Z+16,.3,'#d9dde1'); cyl(c,2.5,2.5,Z,Z+16,.3,'#d9dde1'); for(let k=0;k<3;k++)box(c,1.6+k*.3,2.05,1.85+k*.3,2.3,Z,Z+3+k,'#2b2b2b');};
ART.tirefac=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'c'); const Z=2;
  box(c,.3,.3,W-.3,1.9,Z,Z+26,'#3e6fa8'); qL(c,.3,W-.3,1.9,0,1,Z+18,Z+26,'#9aa4ad'); for(let k=0;k<5;k++)wL(c,.3,W-.3,1.9,(k+.2)/5,(k+.8)/5,Z+4,Z+14,k);
  box(c,.25,.25,W-.25,1.95,Z+26,Z+28,'#2b4f7a'); const [tx,ty]=P(1.5,1.1,Z+40); if(!LM){c.lineWidth=7;c.strokeStyle='#222';c.beginPath();c.ellipse(tx,ty,13,13,0,0,7);c.stroke();c.lineWidth=2;c.strokeStyle='#666';c.beginPath();c.ellipse(tx,ty,8,8,0,0,7);c.stroke();}
  cyl(c,W-.6,.6,Z+28,Z+44,.1,'#9aa4ad');
  for(let s=0;s<2;s++)for(let k=0;k<4;k++){const [px,py]=P(.6+k*.5,2.5,Z+s*4); ell(c,px,py-2,7,3.5,'#222'); ell(c,px,py-2,3,1.5,'#555');}};
ART.carfac=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'c'); const Z=2;
  box(c,.3,.3,W-.3,H-1,Z,Z+24,'#e9ecef'); for(let k=0;k<6;k++){const x0=.3+k*(W-.6)/6, x1=x0+(W-.6)/6; poly(c,[P(x0,.3,Z+24),P(x1,.3,Z+24),P(x1,H-1,Z+24),P(x0,H-1,Z+24)],sh('#cfd4d9',1)); poly(c,[P(x0,H-1,Z+24),P(x0,.3,Z+24),P(x0,.3,Z+32),P(x0,H-1,Z+32)],'#9fd0e3');}
  qL(c,.3,W-.3,H-1,.05,.6,Z,Z+14,'#5a6068'); for(let k=0;k<3;k++){box(c,.5+k*.6,H-1.3,.9+k*.6,H-1.05,Z,Z+5,['#d63c3c','#3e7bd6','#f2f2ee'][k]);}
  qL(c,.3,W-.3,H-1,.65,.95,Z+16,Z+22,'#2b6cb0');
  for(let k=0;k<5;k++){const col=['#d63c3c','#3e7bd6','#2f9a5a','#f2c230','#8a5cc7'][k]; box(c,.4+k*.7,H-.7,.85+k*.7,H-.45,Z,Z+4,col); box(c,.5+k*.7,H-.66,.75+k*.7,H-.49,Z+4,Z+6.5,'#9fc6dc');}};
ART.dealer=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'c'); const Z=2;
  box(c,.3,.3,W-.3,1.6,Z,Z+20,'#eef2f5'); wL(c,.3,W-.3,1.6,.04,.96,Z+1,Z+17,1,'#bfe3f2'); wR(c,W-.3,.3,1.6,.05,.95,Z+1,Z+17,2,'#bfe3f2');
  for(let k=0;k<3;k++)box(c,.6+k*.75,1,.95+k*.75,1.3,Z,Z+4,['#d63c3c','#2b2b33','#3e7bd6'][k]);
  box(c,.25,.25,W-.25,1.65,Z+20,Z+22,'#2b6cb0'); line(c,P(W-.4,1.9,Z),P(W-.4,1.9,Z+44),'#555',2); box(c,W-.65,1.8,W-.15,2,Z+36,Z+46,'#2b6cb0');
  for(let r=0;r<2;r++)for(let k=0;k<4;k++){const col=['#f2f2ee','#d63c3c','#2f9a5a','#f2c230','#8a5cc7','#24407a','#555b63','#e08a2c'][r*4+k]; box(c,.4+k*.6,2+r*.45,.8+k*.6,2.25+r*.45,Z,Z+4,col); box(c,.48+k*.6,2.04+r*.45,.7+k*.6,2.21+r*.45,Z+4,Z+6.5,'#9fc6dc');}
  for(let k=0;k<6;k++){const [px,py]=P(.4+k*.45,1.75,Z+14); poly(c,[[px,py],[px+5,py+1],[px+2,py+6]],['#e63946','#ffd23f','#2b6cb0'][k%3]);}};
ART.dam=(c,t)=>{const W=t.w,H=t.h; const Z=0;
  box(c,.15,.55,W-.15,1.25,Z-6,Z+18,'#c9c6bf'); for(let k=0;k<4;k++)qL(c,.15,W-.15,1.25,(k+.15)/4,(k+.55)/4,Z-6,Z+12,'#8fd0f0');
  if(!LM){for(let k=0;k<4;k++){const [a,b]=P(.15+(W-.3)*(k+.35)/4,1.25,Z+12); c.fillStyle='rgba(220,240,255,.85)'; c.fillRect(a-3,b,6,22);}}
  box(c,.1,.5,W-.1,.8,Z+18,Z+21,'#b9b6ae'); box(c,W-1.1,.1,W-.2,.6,Z,Z+26,'#e8e6e1'); hip(c,W-1.15,.05,W-.15,.65,Z+26,6,'#3a7d8f'); wL(c,W-1.1,W-.2,.6,.2,.8,Z+8,Z+20,3);
  for(const x of [.5,1.3]){line(c,P(x,.3,Z+18),P(x,.3,Z+44),'#777',1.6); line(c,P(x-.15,.3,Z+40),P(x+.15,.3,Z+40),'#777',1.6);} line(c,P(.5,.3,Z+42),P(1.3,.3,Z+42),'#999',1);
  if(LM){for(let k=0;k<5;k++){const [px,py]=P(.3+k*.5,.65,Z+22); ell2(c,px,py,1.5,'#fff2a8');}}};
ART.port=(c,t)=>{const W=t.w,H=t.h; const Z=2;
  box(c,.02,.02,1.98,H-.02,0,2,'#b9b6ae',null,true);
  for(let k=0;k<6;k++)for(const v of [.2,H-.2]){const u=2.1+k*.35; line(c,P(u,v,-6),P(u,v,Z),'#5a3c22',2);}
  box(c,2,.05,W-.05,H-.05,Z-1,Z+1,'#9a6b3f',null,true); for(let k=0;k<8;k++)line(c,P(2+k*.25,.05,Z+1),P(2+k*.25,H-.05,Z+1),'rgba(60,35,15,.4)',.8);
  box(c,.25,.25,1.6,1.4,Z,Z+22,'#b4553f'); for(let k=0;k<3;k++)qL(c,.25,1.6,1.4,(k+.15)/3,(k+.7)/3,Z,Z+14,'#6b4423'); gable(c,.2,.2,1.65,1.45,Z+22,9,'#5a4a3a','#b4553f');
  for(let k=0;k<4;k++)box(c,.3+k*.35,1.55,.6+k*.35,1.85,Z,Z+5+(k%2)*4,k%2?'#b07a4a':'#c0392b');
  line(c,P(2.4,1,Z),P(2.4,1,Z+46),'#f2c230',3); line(c,P(2.4,1,Z+46),P(3.4,.6,Z+50),'#f2c230',2.4); line(c,P(3.3,.65,Z+49),P(3.3,.65,Z+30),'#555',1); box(c,3.2,.55,3.4,.75,Z+26,Z+30,'#b07a4a');
  for(const v of [.15,H-.15])for(let k=0;k<3;k++){const [px,py]=P(2.3+k*.7,v,Z+1); ell(c,px,py-2,1.6,3,'#3a2a1a');}};
ART.resort=(c,t)=>{const W=t.w,H=t.h; lot(c,W,H,'b'); const Z=2;
  flat(c,.2,2.4,W-.2,H-.2,2.05,'#ead9a6'); const [px,py]=P(2.2,3,2.1); ell(c,px,py,46,16,'#4fb3e3'); ell(c,px+10,py-3,20,6,'rgba(255,255,255,.3)');
  for(let k=0;k<4;k++)umbrella(c,.5+k*.9,3.75,['#ff6f61','#ffd166','#4ecdc4','#ff6f61'][k]);
  box(c,.3,.3,W-.3,1.9,Z,Z+40,'#fff6e8'); winGrid(c,.3,.3,W-.3,1.9,Z+4,Z+40,4,8,4,'#9fd0e3',1);
  for(let f=1;f<4;f++)box(c,.3,1.9,W-.3,2.02,Z+4+f*9-1,Z+4+f*9,'#e08a5a');
  box(c,.25,.25,W-.25,1.95,Z+40,Z+43,'#e08a5a'); box(c,1.6,1.9,2.4,2.35,Z+10,Z+12,'#e08a5a');
  for(const [x,y] of [[.3,2.2],[W-.3,2.3],[3.4,3.5]]){const [qx,qy]=P(x,y,Z); line(c,[qx,qy],[qx+2,qy-22],'#7a5230',2.4); for(let k=0;k<5;k++){const a=-Math.PI*(k/4); if(!LM){c.strokeStyle='#2f9a5a';c.lineWidth=3;c.beginPath();c.moveTo(qx+2,qy-22);c.quadraticCurveTo(qx+2+Math.cos(a)*7,qy-28,qx+2+Math.cos(a)*12,qy-19);c.stroke();}}}};
ART.cactus=(c,t,a,v)=>{const [cx,cy]=P(.5,.5,0); ell(c,cx+2,cy,8,3.5,'rgba(0,0,0,.16)'); const g2=['#4f8f3a','#5a9a42','#47823a'][v%3];
  if(LM)return; const arm=(x,y,w,h)=>{c.fillStyle=g2;c.beginPath();c.roundRect?c.roundRect(x-w/2,y-h,w,h,w/2):c.rect(x-w/2,y-h,w,h);c.fill();};
  arm(cx,cy,7,30); arm(cx-7,cy-10,5,12); c.fillRect(cx-7,cy-12,7,4); arm(cx+7,cy-14,5,14); c.fillRect(cx,cy-16,7,4);
  c.fillStyle='rgba(255,255,255,.25)'; c.fillRect(cx-1.5,cy-28,1.4,26); if(v===1){ell(c,cx,cy-31,2.4,2,'#ff5d8f');}};
