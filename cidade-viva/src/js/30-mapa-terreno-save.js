/* ================= Mapa ================= */
// tr: 0 grama, 1 água, 2 mar, 3 areia de praia, 4 deserto, 5 terra, 6 neve · ht: nível 0-4 · rp: rampa (1-4 = direção que sobe)
// rd: 0 nada, 1 rua, 2 ponte · bm: modelo da ponte · rl: 1 trilho · ob: obstáculo · pv/fc: calçadas e cercas (grade de 1/4 de quadrado)
// área inicial: 2×2 áreas de 12×12 no meio do mapa (quadrados 36..59)
const START_CH=[[3,3],[4,3],[3,4],[4,4]], HZ=13, Q2=N*2;
// túnel do trem: o portal (imagem de morro com boca de pedra) fica a oeste da área inicial; TUN é o primeiro trilho fora dele
const TUN={x:36,y:38}, PORTAL={x:35,y:38};
const PORTAL_LOTE={x:33,y:37,w:3,h:3};
// ruído suave (value noise)
function vnoise(seed){const h=(x,y)=>(hsh(x+seed*7,y-seed*3,seed+11)%10007)/10007;
  return (x,y)=>{const xi=Math.floor(x),yi=Math.floor(y),fx=x-xi,fy=y-yi,sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy);
    const a=h(xi,yi),b=h(xi+1,yi),c=h(xi,yi+1),d=h(xi+1,yi+1); return a+(b-a)*sx+(c-a)*sy+(a-b-c+d)*sx*sy;};}
const inStart=(x,y)=>x>=36&&x<60&&y>=36&&y<60;
const inLote=(L,x,y)=>x>=L.x&&x<L.x+L.w&&y>=L.y&&y<L.y+L.h;
const nearPortal=(x,y)=>inLote(PORTAL_LOTE,x,y)||(x>=36&&x<=37&&y===TUN.y);
/* Mapa fixo (o mesmo em todo jogo novo), desenhado a partir da imagem de referência:
   - serra no fundo (bordas de cima): só paisagem, picos e cordilheiras em imagem, neblina; não dá para construir;
   - platô alto P1 (nível 6) e platô baixo P2 (nível 3), cada um com 16×16 planos, paredões de rocha;
   - rio que nasce numa cachoeira na serra, passa entre os platôs e desce até o mar; lago com ilhota à esquerda;
   - deserto no canto esquerdo com o arco de pedra; mar e praia na borda da direita, com pedras na água;
   - ruas prontas subindo aos dois platôs (com ponte sobre o rio). */
const LV_P1=6, LV_P2=3;
const P1={x:12,y:9,w:16,h:16}, P2={x:46,y:8,w:16,h:16};
const ARCO={x:8,y:71,w:4,h:3};
function serraZone(x,y){return (y<=6&&x<=76)||(x<=6&&y<=50)||(x+y<=16)||(x>=64&&y<=22)||(x>=71&&y<=27);}
function peakZone(x,y){return serraZone(x,y)||inLote(ARCO,x,y)||inLote(PORTAL_LOTE,x,y);}
function coastX(y){const c=77.5+1.6*Math.sin(y*.21+.7)+1.1*Math.sin(y*.071+2.1); return y<24?99:y<30?c+(30-y)*1.5:c;}
const RIVER=[[36,4],[37,10],[36,17],[38,24],[42,29],[50,30.5],[58,29.5],[64,31],[69,35],[74,39],[80,41],[86,42]];
function riverDist(x,y){let best=99; for(let k=0;k+1<RIVER.length;k++){const [ax,ay]=RIVER[k],[bx,by]=RIVER[k+1]; const dx=bx-ax,dy=by-ay, t=clamp(((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy),0,1);
  best=Math.min(best,Math.hypot(x-ax-dx*t,y-ay-dy*t));} return best;}
const LAGO={x:13,y:47,rx:7.2,ry:5.6};
function lakeV(x,y){const a=Math.atan2(y-LAGO.y,x-LAGO.x), r=1+.1*Math.sin(a*3+1)+.06*Math.sin(a*5); const dx=(x-LAGO.x)/LAGO.rx, dy=(y-LAGO.y)/LAGO.ry; return Math.hypot(dx,dy)/r;}
// ruas prontas: [x,y,nível,rampa]  (rampa 3 = sobe para oeste, 4 = sobe para norte)
function presetRoads(){const out=[], add=(x,y,h,r)=>out.push([x,y,h,r||0]);
  // P2 (nível 3): sai da avenida x=47, cruza o rio por ponte, sobe pela rampa na frente do paredão
  for(let y=24;y<=35;y++)add(47,y,0); add(47,26,0,4); add(47,25,1,4); add(47,24,2,4); for(let y=15;y<=23;y++)add(47,y,LV_P2);
  // P1 (nível 6): sai da rua y=41 para oeste, sobe para o norte e encosta no paredão da frente do P1
  for(let x=30;x<=35;x++)add(x,41,0); for(let y=33;y<=40;y++)add(30,y,0); for(let x=21;x<=29;x++)add(x,33,0); for(let y=31;y<=33;y++)add(20,y,0);
  for(let k=0;k<6;k++)add(20,30-k,k,4); for(let y=16;y<=24;y++)add(20,y,LV_P1);
  return out;}
function genTerrain(seed){const tr=new Uint8Array(N*N), ht=new Uint8Array(N*N), rp=new Uint8Array(N*N), rd=new Uint8Array(N*N);
  const nz=vnoise(seed+5), rim=(x,y)=>nz(x*.7,y*.7)>.55;      // borda irregular dos platôs (fora do miolo 16×16)
  const inP=(P,x,y)=>inLote(P,x,y)||(x>=P.x-1&&x<=P.x+P.w&&y>=P.y-1&&y<=P.y+P.h&&rim(x,y));
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){const i=y*N+x; let v=0, h=0;
    const cx=coastX(y); if(x+.5>cx)v=2; else if(x+.5>cx-2.6)v=3;
    if(Math.hypot(x+.5,N-(y+.5))<25+2.5*Math.sin(x*.4+y*.2)&&v===0)v=4;                 // deserto no canto esquerdo
    if(v!==2&&riverDist(x+.5,y+.5)<1.25+(x>60?.35:0))v=1;
    const lv=lakeV(x+.5,y+.5); if(lv<1&&lv>.3)v=1;                                     // lago com ilhota no meio
    if(v===0&&!serraZone(x,y)){if(inP(P1,x,y))h=LV_P1; else if(inP(P2,x,y))h=LV_P2;}
    tr[i]=v; ht[i]=h;}
  // nada de borda irregular colada nas rampas
  for(const [x,y] of [[19,25],[21,25],[46,24],[48,24],[20,25],[47,24]])if(inMap(x,y)&&!inLote(P1,x,y)&&!inLote(P2,x,y))ht[y*N+x]=0;
  for(const [x,y,h,r] of presetRoads()){const i=y*N+x; if(tr[i]===2)continue; ht[i]=h; rp[i]=r; rd[i]=tr[i]===1?2:1;}
  return {tr,ht,rp,rd};}
// enfeites fixos do mapa: serra (picos, cordilheiras e morros em imagem), arco, pedras no mar e portal do túnel.
// k = imagem, x/y = canto de cima do lote, f = espelhado (as da borda esquerda olham para o outro lado)
const DECOR=(()=>{const L=[], add=(k,x,y,f)=>L.push({k,x,y,f:!!f});
  // borda de cima-direita (y pequeno): cordilheiras e picos alternados, um pouco sobrepostos
  const cimaD=[['serra-cordilheira-1',-1],['serra-pico-1',-2],['serra-cordilheira-2',-1],['serra-pico-3',-1],['serra-cordilheira-1',-1],['serra-pico-2',-2],['serra-cordilheira-2',-1],['serra-pico-4',-1]];
  let x=4; for(let n=0;x<62;n++){const [k,y]=cimaD[n%cimaD.length]; add(k,x,y); x+=k.includes('cordilheira')?10:6;}
  // borda de cima-esquerda (x pequeno): espelhadas
  let y=6; for(let n=0;y<46;n++){const [k,x0]=cimaD[(n+3)%cimaD.length]; add(k,x0,y,true); y+=k.includes('cordilheira')?10:6;}
  add('serra-pico-1',-2,-2); add('serra-pico-3',4,-3); add('serra-pico-2',-3,4,true);           // canto do fundo
  // canto direito: maciço que desce até o mar
  add('serra-pico-2',64,-2); add('serra-pico-1',71,1); add('serra-pico-3',76,-2); add('serra-pico-4',66,7); add('serra-rocha-1',73,9);
  add('serra-pico-3',72,14); add('serra-rocha-2',66,15); add('serra-rocha-1',72,21);
  add('arco-do-deserto',ARCO.x,ARCO.y);
  add('pedra-no-mar-1',80,48); add('pedra-no-mar-2',81,64); add('pedra-no-mar-1',79,76,true);
  return L;})();
const PEAKS_ALL=DECOR.filter(d=>d.k.startsWith('serra-'));
const decorChunk=d=>[clamp(Math.floor(d.x/CH),0,NC-1),clamp(Math.floor(d.y/CH),0,NC-1)];
function peaks(){return PEAKS_ALL;}
// alturas dos 4 cantos em níveis a partir de ht/rp
function cornerL(h,r){if(!r)return [h,h,h,h];
  if(r<5){const d=r-1; return d===0?[h,h+1,h+1,h]:d===1?[h,h,h+1,h+1]:d===2?[h+1,h,h,h+1]:[h+1,h+1,h,h];}
  const k=(r-5)%4, o=r<9; const z=o?[h,h,h,h]:[h+1,h+1,h+1,h+1]; z[k]=o?h+1:h; return z;}
const DIRS4=[[1,0],[0,1],[-1,0],[0,-1]];
function genObstacles(tr,ht,seed){const ob=new Uint8Array(N*N), r=rng(seed);
  const nz=(x,y)=>Math.sin(x*.21+seed%7)*Math.cos(y*.17+1.3)+Math.sin((x+y)*.09+2)*.6;
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){const i=y*N+x; const v=tr[i]; if(v!==0&&v!==4)continue; if(nearPortal(x,y)||inLote(ARCO,x,y))continue;
    if(serraZone(x,y)){if(r()<.12)ob[i]=2; continue;}
    const start=inStart(x,y);
    if(v===4){if(r()<.07)ob[i]=r()<.7?5:3; continue;}
    const mt=ht[i]>0, forest=nz(x,y)>.5, u0=r();
    let p=start?.04:(mt?.14:forest?.5:.05);
    if(lakeV(x+.5,y+.5)<=.3)p=.6;                            // ilhota do lago com árvores
    if(u0<p){const u=r(); ob[i]=mt?(u<.55?2:u<.8?1:u<.92?4:3):forest?(u<.55?2:u<.85?1:u<.93?4:3):(u<.4?1:u<.6?2:u<.92?4:3);}}
  return ob;}

/* ================= Estado ================= */
let S=null, G={}, D=null;
function emptyGrids(){return {tr:new Uint8Array(N*N),ht:new Uint8Array(N*N),rp:new Uint8Array(N*N),rd:new Uint8Array(N*N),bm:new Uint8Array(N*N),rl:new Uint8Array(N*N),ob:new Uint8Array(N*N),pv:new Uint8Array(Q2*Q2),fc:new Uint8Array(Q2*Q2)};}
function emptyD(){return {pop:0,popCap:0,gCap:0,occ:new Int32Array(N*N).fill(-1),cov:new Map(),happy:0,roadN:0,inter:new Uint8Array(N*N),rail:new Uint8Array(N*N),tour:0,beds:0,tourists:0,hydro:0,linked:new Set(),qocc:new Uint8Array(N*N),clean:0,ckB:[],under:new Uint8Array(N*N),poll:new Float32Array(N*N),fireCov:new Uint8Array(N*N),ver:0};}
D=emptyD();
function newGame(keep){
  const now=Date.now(), seed=(Math.random()*1e9)|0;
  const s={v:5,coins:1500,goods:60,inv:{wood:10,stone:10,steel:0,rubber:0,tools:0,tires:0,cars:0},xp:0,lv:1,ul:Array(NC*NC).fill(0),b:[],nid:1,seed,
    st:{rent:0,biz:0,supply:0,harvest:0,plant:0,train:0,expand:0,clear:0,road:0,bridge:0,dig:0,prod:0,build:0,order:0,export:0,terra:0},q:{done:[],base:{}},t:now,
    col:{}, ord:[], ordT:[0,0,0], ch:null, title:0, taxT:now, evSeen:''};
  fillNewState(s,now);
  START_CH.forEach(([cx,cy])=>s.ul[cy*NC+cx]=1);
  G=emptyGrids(); const tg=genTerrain(seed); G.tr=tg.tr; G.ht=tg.ht; G.rp=tg.rp; G.ob=genObstacles(G.tr,G.ht,seed); for(let i=0;i<N*N;i++)if(tg.rd[i]){G.rd[i]=tg.rd[i]; G.ob[i]=0;}
  G.rl[TUN.y*N+TUN.x]=1; G.rl[TUN.y*N+TUN.x+1]=1;
  const add=(k,x,y,extra)=>{const t=T[k]; s.b.push(Object.assign({i:s.nid++,k,x,y,f:0,lv:1,d:now,a:0,s:0},extra||{}));
    for(let dy=0;dy<t.h;dy++)for(let dx=0;dx<t.w;dx++)G.ob[(y+dy)*N+x+dx]=0;};
  for(let x=36;x<=59;x++){G.rd[41*N+x]=1;G.ob[41*N+x]=0;}
  for(let y=36;y<=59;y++){const i=y*N+47; G.rd[i]=1; G.ob[i]=0;}
  add('hall',43,38);
  add('casinha',37,39,{a:now+20000}); add('chale',39,39,{a:now+45000});
  add('padaria',48,39); add('geminadas',50,39,{a:now+30000});
  add('plot',37,42,{s:''}); add('plot',39,42,{s:'straw',a:now+15000});
  add('arvore',41,39); add('arvore',42,40); add('flores',46,40); add('flores',41,40);
  for(let qy=84;qy<=91;qy++)G.pv[qy*Q2+86]=1;
  for(let qx=82;qx<=85;qx++)G.fc[87*Q2+qx]=1;
  if(keep){s.coins=Math.max(s.coins,keep.coins||0); s.goods=Math.min(400,Math.max(60,keep.goods||0)); s.xp=keep.xp||0; s.lv=keep.lv||1; s.st.rent=keep.st?.rent||0;}
  return s;}
const GRID_KEYS=['tr','ht','rp','rd','bm','rl','ob','pv','fc'];
function serialize(){const enc=a=>{let s=''; for(let i=0;i<a.length;i++)s+=a[i].toString(36); return s;};
  const o=Object.assign({},S); for(const k of GRID_KEYS)o['g_'+k]=enc(G[k]); return JSON.stringify(o);}
// v5 = mapa 84×84 (áreas de 12×12). Saves do mapa antigo (v2 a v4) não servem mais: viram jogo novo (com cópia guardada).
const SAVE_VER=5;
function hydrate(s){if(!s||!Array.isArray(s.b)||s.v!==SAVE_VER)return false;
  const dec=(str,len)=>{const a=new Uint8Array(len); if(str)for(let i=0;i<len&&i<str.length;i++)a[i]=parseInt(str[i],36)||0; return a;};
  const g=emptyGrids();
  for(const k of GRID_KEYS){g[k]=dec(s['g_'+k],(k==='pv'||k==='fc')?Q2*Q2:N*N); delete s['g_'+k];}
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

