/* ================= Mapa ================= */
// tr: 0 grama, 1 água, 2 mar, 3 areia de praia, 4 deserto, 5 terra, 6 neve · ht: nível 0-4 · rp: rampa (1-4 = direção que sobe)
// rd: 0 nada, 1 rua, 2 ponte · bm: modelo da ponte · rl: 1 trilho · ob: obstáculo · pv/fc: calçadas e cercas (grade de 1/4 de quadrado)
const START_CH=[[2,2],[3,2],[2,3],[3,3]], HZ=13, Q2=N*2;
// túnel do trem: TUN é o primeiro trilho fora da montanha; o portal fica na encosta logo a oeste
const TUN={x:16,y:17}, PORTAL={x:15,y:17};
function riverY(xx){return 26.8+2.6*Math.sin((xx-6)*0.13)+0.7*Math.sin(xx*0.41+0.4)+(xx>38?(xx-38)*0.18:0);}
// ruído suave (value noise) para relevo natural
function vnoise(seed){const h=(x,y)=>(hsh(x+seed*7,y-seed*3,seed+11)%10007)/10007;
  return (x,y)=>{const xi=Math.floor(x),yi=Math.floor(y),fx=x-xi,fy=y-yi,sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy);
    const a=h(xi,yi),b=h(xi+1,yi),c=h(xi,yi+1),d=h(xi+1,yi+1); return a+(b-a)*sx+(c-a)*sy+(a-b-c+d)*sx*sy;};}
const inStart=(x,y)=>x>=16&&x<32&&y>=16&&y<32;
const nearPortal=(x,y)=>x>=14&&x<=16&&y>=16&&y<=18;
/* Relevo em platôs (estilo serra): chão no nível 0, platô baixo A (nível 3) colado na cidade, platô alto B (nível 6)
   atrás dele e a serra de picos no fundo do mapa (só enfeite, não dá para construir). As bordas são paredões de rocha.
   As ruas já vêm prontas: A sobe por uma rampa colada no paredão sul; B por uma estrada na encosta leste. */
const LV_A=3, LV_B=6, LV_P=7;
function peakZone(x,y){return (y<=2&&x<=28)||(x<=2&&y<=23)||(x+y<=10);}
function plateauShape(seed){const nz=vnoise(seed+303), n=(t,k)=>Math.round((nz(t*.33,k*7.3)-.5)*3.2);
  const bS=x=>x>=10&&x<=22?9:clamp(9+n(x,1),8,10);          // última linha do platô B (sul)
  const bE=y=>clamp(21+n(y,2),20,21);                       // última coluna de B (leste); a estrada fica em x=22
  const aE=y=>y>=13?15:clamp(14+n(y,3),13,15);              // última coluna de A (leste): paredão do túnel em x=15
  const aS=x=>x>=12?21:clamp(21+n(x,4),20,22);              // última linha de A (sul): a rampa corre na borda
  const inB=(x,y)=>!peakZone(x,y)&&x>=3&&y>=3&&x<=bE(y)&&y<=bS(x);
  const inA=(x,y)=>!peakZone(x,y)&&!inB(x,y)&&x>=3&&x<=aE(y)&&y>bS(x)&&y<=aS(x);
  return {inA,inB,bS};}
// ruas prontas: [x,y,nível,rampa]
function presetRoads(){const out=[], add=(x,y,h,r)=>out.push([x,y,h,r||0]);
  // A: rampa subindo para oeste na borda sul (sai da rua principal em x=16), depois rua norte-sul em x=12
  add(15,21,0,3); add(14,21,1,3); add(13,21,2,3); for(let y=10;y<=21;y++)add(12,y,LV_A);
  // B: rua no chão saindo da coluna x=27, estrada subindo para o norte colada no paredão leste e rua no alto
  for(let x=23;x<=27;x++)add(x,15,0); for(let y=10;y<=15;y++)add(22,y,0);
  for(let k=0;k<6;k++)add(22,9-k,k,4);
  for(let x=12;x<=22;x++)add(x,3,LV_B); for(let y=4;y<=9;y++)add(12,y,LV_B);
  return out;}
function genTerrain(seed){const tr=new Uint8Array(N*N), ht=new Uint8Array(N*N), rp=new Uint8Array(N*N), rd=new Uint8Array(N*N);
  const sh=plateauShape(seed);
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){const i=y*N+x;
    const coast=53.5+1.6*Math.sin(y*0.21+0.7)+1.1*Math.sin(y*0.071+2.1); let v=0;
    if(x+.5>coast)v=2; else if(x+.5>coast-2.3)v=3;
    const dz=(x+.5)<27+3*Math.sin(y*.3)&&(y+.5)>46+2.5*Math.sin(x*.27+1); if(dz&&v===0)v=4;
    const xx=x+.5, hw=1.25+(xx>40?Math.min(.7,(xx-40)*.05):0);
    if(Math.abs(y+.5-riverY(xx))<hw&&v!==2)v=1;
    const lx=(x+.5-42)/4.6, ly=(y+.5-11)/3.4; if(lx*lx+ly*ly<1+.12*Math.sin(x*1.3+y*.7))v=1;
    let h=0; if(v===0){if(peakZone(x,y)){h=LV_P; v=7;} else if(sh.inB(x,y))h=LV_B; else if(sh.inA(x,y))h=LV_A;}
    tr[i]=v; ht[i]=h;}
  for(const [x,y,h,r] of presetRoads()){const i=y*N+x; if(tr[i]===1||tr[i]===2)continue; ht[i]=h; rp[i]=r; rd[i]=1;}
  return {tr,ht,rp,rd};}
// picos da serra (enfeite desenhado por cima da faixa de rocha do fundo)
let PEAK_C=null;
function peaks(){const seed=S?S.seed||1:1; if(PEAK_C&&PEAK_C.seed===seed)return PEAK_C.list; const r=rng(seed+77), list=[];
  const add=(x,y,big)=>list.push({x,y,w:(big?220:160)+r()*80,h:(big?210:150)+r()*90,sx:(r()-.5)*.3,k:Math.floor(r()*1e6)});
  for(let x=3;x<=27;x+=4+Math.floor(r()*2))add(x,1,r()<.5);
  for(let y=5;y<=22;y+=4+Math.floor(r()*2))add(1,y,r()<.5);
  add(4,4,true);
  PEAK_C={seed,list}; return list;}
// alturas dos 4 cantos em níveis a partir de ht/rp
function cornerL(h,r){if(!r)return [h,h,h,h];
  if(r<5){const d=r-1; return d===0?[h,h+1,h+1,h]:d===1?[h,h,h+1,h+1]:d===2?[h+1,h,h,h+1]:[h+1,h+1,h,h];}
  const k=(r-5)%4, o=r<9; const z=o?[h,h,h,h]:[h+1,h+1,h+1,h+1]; z[k]=o?h+1:h; return z;}
const DIRS4=[[1,0],[0,1],[-1,0],[0,-1]];
function genObstacles(tr,ht,seed){const ob=new Uint8Array(N*N), r=rng(seed);
  const nz=(x,y)=>Math.sin(x*.21+seed%7)*Math.cos(y*.17+1.3)+Math.sin((x+y)*.09+2)*.6;
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){const i=y*N+x; const v=tr[i]; if(v!==0&&v!==4&&v!==6&&v!==7)continue; if(nearPortal(x,y))continue;
    if(peakZone(x,y)){if(v===7&&r()<.07)ob[i]=2; continue;}
    const ch=Math.floor(x/CH)+Math.floor(y/CH)*NC, start=START_CH.some(([a,b])=>a+b*NC===ch);
    if(v===4){if(r()<.09)ob[i]=r()<.75?5:3; continue;}
    const mt=ht[i]>0, forest=nz(x,y)>.55||mt, u0=r();
    let p=start?.05:(mt?.34:forest?.42:.15); if(v===6)p=.12;
    if(u0<p){const u=r(); ob[i]=mt?(u<.6?2:u<.85?3:1):forest?(u<.55?2:u<.85?1:u<.93?4:3):(u<.35?1:u<.5?2:u<.78?4:3);}}
  return ob;}

/* ================= Estado ================= */
let S=null, G={}, D=null;
function emptyGrids(){return {tr:new Uint8Array(N*N),ht:new Uint8Array(N*N),rp:new Uint8Array(N*N),rd:new Uint8Array(N*N),bm:new Uint8Array(N*N),rl:new Uint8Array(N*N),ob:new Uint8Array(N*N),pv:new Uint8Array(Q2*Q2),fc:new Uint8Array(Q2*Q2)};}
function emptyD(){return {pop:0,popCap:0,gCap:0,occ:new Int32Array(N*N).fill(-1),cov:new Map(),happy:0,roadN:0,inter:new Uint8Array(N*N),rail:new Uint8Array(N*N),tour:0,beds:0,tourists:0,hydro:0,linked:new Set(),qocc:new Uint8Array(N*N),clean:0,ckB:[],under:new Uint8Array(N*N),poll:new Float32Array(N*N),fireCov:new Uint8Array(N*N),ver:0};}
D=emptyD();
function newGame(keep){
  const now=Date.now(), seed=(Math.random()*1e9)|0;
  const s={v:4,terr:TERR_VER,coins:1500,goods:60,inv:{wood:10,stone:10,steel:0,rubber:0,tools:0,tires:0,cars:0},xp:0,lv:1,ul:Array(NC*NC).fill(0),b:[],nid:1,seed,
    st:{rent:0,biz:0,supply:0,harvest:0,plant:0,train:0,expand:0,clear:0,road:0,bridge:0,dig:0,prod:0,build:0,order:0,export:0,terra:0},q:{done:[],base:{}},t:now,
    col:{}, ord:[], ordT:[0,0,0], ch:null, title:0, taxT:now, evSeen:''};
  fillNewState(s,now);
  START_CH.forEach(([cx,cy])=>s.ul[cy*NC+cx]=1);
  G=emptyGrids(); const tg=genTerrain(seed); G.tr=tg.tr; G.ht=tg.ht; G.rp=tg.rp; G.ob=genObstacles(G.tr,G.ht,seed); for(let i=0;i<N*N;i++)if(tg.rd[i]){G.rd[i]=1; G.ob[i]=0;}
  G.rl[TUN.y*N+TUN.x]=1; G.rl[TUN.y*N+TUN.x+1]=1;
  const add=(k,x,y,extra)=>{const t=T[k]; s.b.push(Object.assign({i:s.nid++,k,x,y,f:0,lv:1,d:now,a:0,s:0},extra||{}));
    for(let dy=0;dy<t.h;dy++)for(let dx=0;dx<t.w;dx++)G.ob[(y+dy)*N+x+dx]=0;};
  for(let x=16;x<=31;x++){G.rd[21*N+x]=1;G.ob[21*N+x]=0;}
  for(let y=16;y<=31;y++){const i=y*N+27; G.rd[i]=G.tr[i]===1?2:(G.tr[i]!==2?1:0); G.ob[i]=0;}
  add('hall',23,18);
  add('casinha',17,19,{a:now+20000}); add('chale',19,19,{a:now+45000});
  add('padaria',28,19); add('geminadas',30,19,{a:now+30000});
  add('plot',17,22,{s:''}); add('plot',19,22,{s:'straw',a:now+15000});
  add('arvore',21,19); add('arvore',22,20); add('flores',26,20); add('flores',21,20);
  for(let qy=44;qy<=51;qy++)G.pv[qy*Q2+46]=1;
  for(let qx=42;qx<=45;qx++)G.fc[47*Q2+qx]=1;
  if(keep){s.coins=Math.max(s.coins,keep.coins||0); s.goods=Math.min(400,Math.max(60,keep.goods||0)); s.xp=keep.xp||0; s.lv=keep.lv||1; s.st.rent=keep.st?.rent||0;}
  return s;}
const GRID_KEYS=['tr','ht','rp','rd','bm','rl','ob','pv','fc'];
function serialize(){const enc=a=>{let s=''; for(let i=0;i<a.length;i++)s+=a[i].toString(36); return s;};
  const o=Object.assign({},S); for(const k of GRID_KEYS)o['g_'+k]=enc(G[k]); return JSON.stringify(o);}
function hydrate(s){if(!s||!Array.isArray(s.b))return false;
  const dec=(str,len)=>{const a=new Uint8Array(len); if(str)for(let i=0;i<len&&i<str.length;i++)a[i]=parseInt(str[i],36)||0; return a;};
  const g=emptyGrids();
  if(s.v===2){ // save da fase 1: sem relevo, calçada de quadrado inteiro
    g.tr=dec(s.tr,N*N); g.rd=dec(s.rd,N*N); g.ob=dec(s.ob,N*N);
    const tg=genTerrain(s.seed||1);
    for(let i=0;i<N*N;i++){const x=i%N,y=(i/N)|0; const cx=Math.floor(x/CH),cy=Math.floor(y/CH); const owned=!!(s.ul||[])[cy*NC+cx];
      if(!owned&&g.tr[i]===0){g.ht[i]=tg.ht[i]; g.tr[i]=tg.tr[i]===6||tg.tr[i]===4?tg.tr[i]:g.tr[i]; if(tg.tr[i]===4&&g.ob[i]&&g.ob[i]!==3)g.ob[i]=5;}
      if(g.rd[i]===3){g.rd[i]=0; for(const [a,b] of [[0,0],[1,0],[0,1],[1,1]])g.pv[(y*2+b)*Q2+x*2+a]=2;}}
    s.inv={wood:s.wood||0,stone:s.stone||0,steel:0,rubber:0,tools:0,tires:0,cars:0}; delete s.wood; delete s.stone; delete s.tr; delete s.rd; delete s.ob; s.v=3;}
  else if(s.v===3||s.v===4){for(const k of GRID_KEYS){g[k]=dec(s['g_'+k],(k==='pv'||k==='fc')?Q2*Q2:N*N); delete s['g_'+k];}}
  else return false;
  if(s.v===3){migrateV4(s,g); s.v=4; upgradedV3=true;}
  else if((s.terr||0)<TERR_VER)refreshTerrain(s,g);
  fillNewState(s,Date.now());
  s.b=s.b.filter(b=>T[b.k]);
  s.st=Object.assign({rent:0,biz:0,supply:0,harvest:0,plant:0,train:0,expand:0,clear:0,road:0,bridge:0,dig:0,prod:0,build:0,order:0,export:0,terra:0},s.st||{});
  s.inv=Object.assign({wood:0,stone:0,steel:0,rubber:0,tools:0,tires:0,cars:0},s.inv||{});
  if(!s.col)s.col={}; if(!s.ord)s.ord=[]; if(!s.ordT)s.ordT=[0,0,0]; if(s.title==null)s.title=0; if(!s.taxT)s.taxT=Date.now();
  S=s; G=g; mapVer++; return true;}
// campos novos da versão 4 (leis, tecnologia, pedidos, cadeias, histórico...)
function fillNewState(s,now){if(!s.name)s.name='Cidade Viva'; if(!s.laws)s.laws={}; if(!s.lawT)s.lawT=now; if(!s.tech)s.tech=[]; if(s.rp==null)s.rp=0; if(!s.rpT)s.rpT=now;
  if(!s.chain)s.chain={}; if(!s.chainBase)s.chainBase={}; if(!s.unl)s.unl={}; if(!s.req)s.req=[]; if(!s.reqT)s.reqT=now+90000; if(s.reqDone==null)s.reqDone=0;
  if(!s.hist)s.hist=[]; if(!s.histT)s.histT=0; if(!s.fireT)s.fireT=now+5*60000;
  for(const k of ['ore','lime'])if(s.inv&&s.inv[k]==null)s.inv[k]=0;
  for(const k of ['fire','fireOut','harvestT','research','reqs','law','chainStep'])if(s.st&&s.st[k]==null)s.st[k]=0;}
// relevo novo nas áreas não compradas. O que o jogador já tem (áreas compradas, água, ruas, trilhos) fica igual
// e as alturas dos cantos dele viram pontos fixos, para o relevo novo encostar sem degrau.
const TERR_VER=3;
function refreshTerrain(s,g){const seed=s.seed||1, owned=(x,y)=>!!(s.ul||[])[Math.floor(y/CH)*NC+Math.floor(x/CH)];
  const tg=genTerrain(seed), ob=genObstacles(tg.tr,tg.ht,seed);
  for(let i=0;i<N*N;i++){const x=i%N,y=(i/N)|0, o=g.tr[i];
    if(owned(x,y)||o===1||o===2||g.rd[i]||g.rl[i]||tg.tr[i]===1||tg.tr[i]===2)continue;
    g.ht[i]=tg.ht[i]; g.rp[i]=tg.rp[i]; if(o===0||o===6||o===5||o===4||o===7)g.tr[i]=tg.tr[i]===3?o:tg.tr[i];
    g.ob[i]=tg.rd[i]?0:ob[i]; if(tg.rd[i])g.rd[i]=1;}
  s.terr=TERR_VER;}
// save v3 → v4: relevo novo nas áreas não compradas e túnel novo perto do centro
function migrateV4(s,g){const owned=(x,y)=>!!(s.ul||[])[Math.floor(y/CH)*NC+Math.floor(x/CH)];
  for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(!owned(x,y))g.rl[y*N+x]=0;
  const busy=s.b.some(b=>{const t=T[b.k]; if(!t)return false; const w=b.f?t.h:t.w,h=b.f?t.w:t.h; return TUN.x>=b.x&&TUN.x<b.x+w&&TUN.y>=b.y&&TUN.y<b.y+h;});
  const i=TUN.y*N+TUN.x; if(!busy&&!g.rd[i]&&g.tr[i]!==1&&g.tr[i]!==2){g.rl[i]=1; g.ob[i]=0; g.ht[i]=0; g.rp[i]=0;}
  refreshTerrain(s,g);}
function migrateV1(old){let refund=0; for(const b of old.b||[]){const k=b.k; if(k==='hall'||k==='road')continue;
  const c={h1:100,h2:400,h3:1200,h4:2500,h5:6000,h6:15000,h7:40000,h8:70000,b1:200,b2:600,b3:1500,b4:3000,b5:8000,b6:18000,b7:45000,b8:80000,
    plot:50,c1:800,c2:2500,c3:6000,c4:15000,c5:35000,c6:70000,s1:500,st:1500,s2:2000,s3:8000,d1:50,d2:80,d3:200,d4:400,d5:1500,d6:3000,d7:6000}[k]||0; refund+=c;}
  const s=newGame({coins:(old.coins||0)+refund,goods:old.goods,xp:old.xp,lv:old.lv,st:old.st});
  return {s,refund};}

/* ================= Relevo ================= */
const inMap=(x,y)=>x>=0&&y>=0&&x<N&&y<N;
const isUl=(x,y)=>inMap(x,y)&&!!S.ul[Math.floor(y/CH)*NC+Math.floor(x/CH)];
const lvl=(x,y)=>inMap(x,y)?G.ht[y*N+x]:0;
// alturas dos 4 cantos: [x0y0, x1y0, x1y1, x0y1] · rp 1-4 rampa reta (lado que sobe), 5-8 canto externo (canto alto), 9-12 canto interno (canto baixo)
function cornerZ(x,y){const i=y*N+x, z=cornerL(G.ht[i],G.rp[i]); z[0]*=HZ; z[1]*=HZ; z[2]*=HZ; z[3]*=HZ; return z;}
// altura (em px) de um ponto qualquer do mapa
function hAt(fx,fy){const x=Math.floor(fx),y=Math.floor(fy); if(!inMap(x,y))return 0; const i=y*N+x; const r=G.rp[i]; if(!r)return G.ht[i]*HZ;
  const z=cornerZ(x,y), u=fx-x, v=fy-y;
  if(r<5)return z[0]+(z[1]-z[0])*u+(z[3]-z[0])*v;
  const k=(r-5)%4;
  if(k===0||k===2){if(u+v<=1)return z[0]+(z[1]-z[0])*u+(z[3]-z[0])*v; return z[2]+(z[3]-z[2])*(1-u)+(z[1]-z[2])*(1-v);}
  if(u>=v)return z[0]+(z[1]-z[0])*u+(z[2]-z[1])*v; return z[0]+(z[3]-z[0])*v+(z[2]-z[3])*u;}
// altura (em níveis) da borda de um quadrado na direção d (null = borda inclinada)
const EDGE_C=[[1,2],[2,3],[0,3],[0,1]];
function edgeZ(x,y,d){const i=y*N+x; if(!G.rp[i])return G.ht[i]; const z=cornerZ(x,y), a=z[EDGE_C[d][0]], b=z[EDGE_C[d][1]]; return a===b?a/HZ:null;}
function linked(x,y,d,grid){const X=x+DIRS4[d][0],Y=y+DIRS4[d][1]; if(!inMap(X,Y))return false; const a=edgeZ(x,y,d),b=edgeZ(X,Y,(d+2)%4); return a!=null&&a===b;}

