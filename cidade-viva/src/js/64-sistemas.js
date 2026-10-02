/* ================= Sistemas: poluição, leis, pesquisa, pedidos, cadeias, incêndios, histórico ================= */

/* ---- Poluição: indústria, trânsito e porto poluem; parques, árvores, leis e educação reduzem ---- */
function polSource(b){const t=T[b.k]; if(Date.now()<b.d)return 0; return t.poll||POLL[b.k]||0;}
function computePollution(d,now){const F=d.poll; F.fill(0); const prevEdu=D&&D.edu||0;
  const eduF=Math.min(1,prevEdu*(law('integral')?2:1)); let ind=0,traf=0,port=0,sink=0;
  const mInd=(law('filtros')?.6:1)*(law('coleta')?.8:1)*(hasTech('reciclagem')?.9:1)*(1-.3*eduF);
  const mTraf=(law('onibus')?.7:1)*(hasTech('smart')?.85:1)*(law('coleta')?.8:1)*(hasTech('reciclagem')?.9:1)*(1-.3*eduF);
  const splat=(cx,cy,r,v)=>{const x0=Math.max(0,Math.floor(cx-r)),x1=Math.min(N-1,Math.ceil(cx+r)),y0=Math.max(0,Math.floor(cy-r)),y1=Math.min(N-1,Math.ceil(cy+r));
    for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const dd=Math.hypot(x+.5-cx,y+.5-cy); if(dd<=r)F[y*N+x]+=v*(1-dd/(r+1));}};
  for(const b of S.b){const v=polSource(b); if(!v)continue; const w=fw(b),h=fh(b); const isPort=b.k==='porto'||b.k==='aeroporto'||b.k==='marina'; const val=v*mInd;
    if(isPort)port+=val; else ind+=val; splat(b.x+w/2,b.y+h/2,7,val*1.2);}
  // trânsito: proporcional aos carros, espalhado pelas ruas
  if(d.roadN){const cars=clamp(Math.floor((d.pop-80)/70)+Math.floor(Math.max(0,d.roadN-30)/14),0,60); const per=cars*mTraf*.08; traf=Math.round(cars*mTraf*.5);
    if(per>0.01)for(let y=0;y<N;y++)for(let x=0;x<N;x++){if(!isCarRd(x,y))continue; splat(x+.5,y+.5,2.5,per);}}
  // o que limpa
  const mS=(law('verde')?1.5:1)*(1+.3*eduF);
  for(const b of S.b){const v=SINK[b.k]||T[b.k].sink||0; if(!v||now<b.d)continue; const w=fw(b),h=fh(b); sink+=v*mS; splat(b.x+w/2,b.y+h/2,4+Math.min(4,v/4),-v*mS*1.4);}
  let trees=0; for(let y=0;y<N;y++)for(let x=0;x<N;x++){const o=G.ob[y*N+x]; if((o===1||o===2)&&isUl(x,y)){trees++; F[y*N+x]-=.6*mS;}}
  const clean=d.clean||0; const glob=(law('coleta')?.8:1);
  for(let i=0;i<N*N;i++){F[i]=Math.max(0,F[i]*glob-clean*.4);}
  d.pollSrc={ind:Math.round(ind),traf:Math.round(traf),port:Math.round(port),sink:Math.round(sink+trees*.3),clean,edu:Math.round(eduF*100)};}
const pollAt=(b)=>{const w=fw(b),h=fh(b); let s=0,n=0; for(let y=b.y;y<b.y+h;y++)for(let x=b.x;x<b.x+w;x++){if(inMap(x,y)){s+=D.poll[y*N+x];n++;}} return n?s/n:0;};
const pollPenalty=p=>clamp((p-25)/75,0,1)*.2;

/* ---- extras no cálculo da cidade (chamado no fim do derive) ---- */
function deriveExtra(d,now){
  // bombeiros cobrem um raio; fora disso pode haver incêndios leves
  for(const b of S.b){const t=T[b.k]; if(!t.fireR||now<b.d)continue; const r=t.fireR, w=fw(b),h=fh(b);
    for(let y=Math.max(0,b.y-r);y<Math.min(N,b.y+h+r);y++)for(let x=Math.max(0,b.x-r);x<Math.min(N,b.x+w+r);x++)d.fireCov[y*N+x]=1;}
  let rate=0; for(const b of S.b){if(now<b.d)continue; const t=T[b.k]; if(t.research)rate+=t.research; else if(b.k==='universidade')rate+=6; else if(b.k==='biblioteca')rate+=1;} d.rpRate=rate;
  let pe=0,pp=0,ps=0,sh=0; for(const b of S.b){const t=T[b.k]; if(t.cat!=='res'||now<b.d)continue; const c=cov(b); pp+=t.pop; if((c.mask>>NEED_I.edu)&1)pe+=t.pop; ps+=(c.poll||0)*t.pop; sh+=(((c.mask>>NEED_I.sau)&1)?1:.55)*(1-Math.min(.5,(c.poll||0)/200))*t.pop;}
  d.edu=pp?pe/pp:0; d.pollAvg=pp?ps/pp:0; d.health=pp?sh/pp:1;}

/* ---- Pesquisa (pontos do Campus) ---- */
function researchTick(now){const dt=Math.min(12*3600,(now-S.rpT)/1000); if(dt<=0)return; S.rpT=now; if(!D.rpRate)return; S.rp+=D.rpRate*dt/3600;}
function doResearch(id){const t=TECH.find(x=>x.id===id); if(!t)return; const st=techState(t); if(st!=='pronta'){toast(st==='feita'?'Já pesquisada':st==='bloqueada'?'Pesquise antes: '+t.req.map(r=>TECH.find(x=>x.id===r).name).join(', '):'Faltam '+Math.ceil(t.rp-S.rp)+' pontos de pesquisa');return;}
  S.rp-=t.rp; S.tech.push(id); S.st.research++; gainXp(20+t.rp/2); toast('Tecnologia pronta: '+t.name); after();}

/* ---- Leis: custo cobrado por minuto ---- */
function toggleLaw(id){const L=LAWS.find(l=>l.id===id); if(!L)return; const why=lawOpen(L); if(why&&!S.laws[id]){toast(why);return;}
  if(S.laws[id])delete S.laws[id]; else{S.laws[id]=1; S.st.law++;} toast((S.laws[id]?'Lei ligada: ':'Lei desligada: ')+L.name); after();}
function lawTick(now){const min=(now-S.lawT)/60000; if(min<1)return; const m=Math.min(min,6*60); S.lawT=now; let cost=0;
  for(const id in S.laws){const c=lawCost(id); if(c)cost+=c*m/60; if(id==='feira'){const g=15*m/60; if(S.goods>=g)S.goods-=g; else{delete S.laws.feira; toast('Feira livre suspensa: faltaram mercadorias');}}}
  cost=Math.round(cost); if(cost>0){if(S.coins>=cost)S.coins-=cost; else{const ids=Object.keys(S.laws).filter(i=>lawCost(i)); if(ids.length){delete S.laws[ids[ids.length-1]]; toast('Sem moedas para as leis: uma lei foi desligada');}}} markDirty();}

/* ---- Pedidos dos moradores ---- */
function reqCheck(r){const b=byId(r.b); if(!b)return 'some'; const now=Date.now();
  switch(r.type){
    case 'parque':return S.b.some(o=>PARKS.includes(o.k)&&now>=o.d&&dist(b,o)<=r.r);
    case 'arvores':return countNear(b,['arvore','ipe'],r.r)>=r.n;
    case 'calcada':return pvNear(b,r.r)>=r.n;
    case 'comercio':return S.b.some(o=>T[o.k].cat==='biz'&&now>=o.d&&dist(b,o)<=r.r);
    case 'colher':return S.st.harvest-r.base>=r.n;
    case 'saude':return ((cov(b).mask>>NEED_I.sau)&1)===1;
    case 'entrega':return (r.item==='goods'?S.goods:S.inv[r.item])>=r.q;}
  return false;}
function reqText(r){const T2=REQ_TYPES.find(t=>t.id===r.type); let s=T2?T2.txt:'';
  if(r.type==='entrega')s+=' ('+r.q+' '+ITEMS[r.item].ico+' '+ITEMS[r.item].name.toLowerCase()+')';
  if(r.type==='arvores')s+=' (árvores a até 3 quadrados: '+(byId(r.b)?countNear(byId(r.b),['arvore','ipe'],3):0)+' de '+r.n+')';
  if(r.type==='calcada')s+=' (pedaços de calçada por perto: '+(byId(r.b)?pvNear(byId(r.b),2):0)+' de '+r.n+')';
  if(r.type==='colher')s+=' ('+Math.max(0,S.st.harvest-r.base)+' de '+r.n+' colheitas)';
  return s;}
function newRequest(now){const homes=S.b.filter(b=>T[b.k].cat==='res'&&now>=b.d&&!S.req.some(r=>r.b===b.i)); if(!homes.length)return;
  const b=homes[(Math.random()*homes.length)|0]; const tot=REQ_TYPES.reduce((s,t)=>s+t.w,0); let u=Math.random()*tot, ty=REQ_TYPES[0]; for(const t of REQ_TYPES){u-=t.w; if(u<=0){ty=t;break;}}
  const r=Object.assign({b:b.i,type:ty.id,t:now},ty.make(b)); if(reqCheck(r)===true&&r.type!=='entrega')return;
  const left=REQ_UNL.filter(k=>!S.unl[k]&&!S.req.some(q=>q.unl===k)); if(left.length&&Math.random()<.45)r.unl=left[(Math.random()*left.length)|0];
  r.coins=Math.round((150+S.lv*45)*(r.type==='entrega'?1.4:1)/10)*10; r.xp=10+S.lv*3; S.req.push(r); markDirty();
  const who=resident(b); toast('💬 '+who.nome.split(' ')[0]+' tem um pedido');}
function reqTick(now){S.req=S.req.filter(r=>byId(r.b)); if(now>=S.reqT&&S.req.length<2&&D.pop>=40){newRequest(now); S.reqT=now+(6+Math.random()*5)*60000;}}
function doRequest(i){const r=S.req[i]; if(!r)return; if(reqCheck(r)!==true){toast('Ainda não deu: '+reqText(r));return;}
  if(r.type==='entrega'){if(r.item==='goods')S.goods-=r.q; else S.inv[r.item]-=r.q;}
  S.req.splice(i,1); S.coins+=r.coins; gainXp(r.xp); S.reqDone++; S.st.reqs++; const b=byId(r.b); if(b){floatAt(b,'+'+fmtN(r.coins),'#ffd43b'); bounce.set(b.i,Date.now());}
  if(r.unl){S.unl[r.unl]=1; showUnlock(T[r.unl].name,'Presente de '+(b?resident(b).nome:'um morador')+' por atender o pedido.');} else toast('Pedido atendido: +'+fmtN(r.coins)+' moedas');
  after();}
function skipRequest(i){S.req.splice(i,1); S.reqT=Math.max(S.reqT,Date.now()+3*60000); markDirty();}

/* ---- Cadeias de missões ---- */
function chainStep(ch){return S.chain[ch.id]||0;}
function chainProg(ch){const k=chainStep(ch); const st=ch.steps[k]; if(!st)return null; const o=st.o; const now=Date.now();
  switch(o.t){case 'own':return [countDone(o.k),o.n];
    case 'ownAny':return [S.b.filter(b=>o.ks.includes(b.k)&&now>=b.d).length,o.n];
    case 'ownAll':return [o.ks.filter(k=>countDone(k)>0).length,o.ks.length];
    case 'stat':{const key=ch.id+':'+k; if(S.chainBase[key]==null){S.chainBase[key]=S.st[o.s]||0; markDirty();} return [(S.st[o.s]||0)-S.chainBase[key],o.n];}
    case 'law':return [law(o.id)?1:0,1];
    case 'pollBelow':return [D.pop>=300&&D.pollAvg<o.n?1:0,1];
    case 'tech':return [S.tech.length,o.n];
    case 'pop':return [D.pop,o.n];
    case 'tourists':return [D.tourists,o.n];}
  return [0,1];}
function chainAdvance(id){const ch=CHAINS.find(c=>c.id===id); if(!ch||S.lv<ch.lv)return; const p=chainProg(ch); if(!p||p[0]<p[1])return;
  S.chain[id]=chainStep(ch)+1; S.st.chainStep++; S.coins+=500+S.lv*80; gainXp(40+S.lv*4);
  if(S.chain[id]>=ch.steps.length){S.unl[ch.reward]=1; showUnlock(T[ch.reward].name,'Você completou a cadeia "'+ch.name+'". Esse prédio só sai por ela.');}
  else toast('Etapa concluída: '+ch.name); after();}
function chainsReady(){let n=0; for(const ch of CHAINS){if(S.lv<ch.lv)continue; const p=chainProg(ch); if(p&&p[0]>=p[1])n++;} return n;}

/* ---- Incêndios leves fora da cobertura dos bombeiros ---- */
function fireTick(now){const W=weatherNow(now);
  for(const b of S.b){if(!b.fire)continue; const out=W.raining||D.fireCov[b.y*N+b.x]||now-b.fire>(law('brigada')?4:10)*60000;
    if(out){delete b.fire; if(!W.raining&&!D.fireCov[b.y*N+b.x]&&T[b.k].cat==='res')b.a=Math.max(b.a,now+T[b.k].rt*1000*.5); toast((W.raining?'A chuva apagou o fogo em ':'O fogo apagou em ')+T[b.k].name); markDirty();}}
  if(now<S.fireT)return; S.fireT=now+(4+Math.random()*5)*60000;
  if(S.lv<6||D.pop<150||W.k===2)return; if(Math.random()>(law('brigada')?.2:.5))return;
  const cands=S.b.filter(b=>{const t=T[b.k]; return (t.cat==='res'||t.cat==='biz')&&now>=b.d&&!b.fire&&!D.fireCov[b.y*N+b.x];}); if(!cands.length)return;
  const b=cands[(Math.random()*cands.length)|0]; b.fire=now; S.st.fire++; toast('🔥 Começou um incêndio em '+T[b.k].name+'. Toque nele para apagar.'); markDirty();}
function fireCost(b){const hyd=S.b.some(o=>o.k==='hidrante'&&Date.now()>=o.d&&dist(b,o)<=2); return hyd?0:Math.max(40,Math.round(T[b.k].cost*.03/10)*10);}
function putOut(b){const c=fireCost(b); if(S.coins<c){toast('Faltam '+fmtN(c-S.coins)+' moedas');return;} S.coins-=c; delete b.fire; S.st.fireOut++; gainXp(8); puff(b.x+fw(b)/2,b.y+fh(b)/2); toast(c?'Fogo apagado (−'+fmtN(c)+')':'O hidrante ajudou: fogo apagado de graça'); after();}

/* ---- Histórico para os gráficos (uma amostra a cada 10 min, comprime quando enche) ---- */
function histTick(now){if(now-S.histT<10*60000&&S.hist.length)return; S.histT=now;
  S.hist.push({t:now,pop:D.pop,coins:Math.round(S.coins),happy:Math.round(D.happy*100),poll:Math.round(D.pollAvg||0),tour:D.tourists,lv:S.lv});
  if(S.hist.length>360){const h=S.hist, out=[]; for(let i=0;i<h.length-60;i+=2)out.push(h[i]); S.hist=out.concat(h.slice(h.length-60));} markDirty();}

/* ---- Tique de 1 segundo ---- */
function systemsTick(now){if(!S)return; researchTick(now); lawTick(now); reqTick(now); fireTick(now); weatherTick(now); histTick(now);}

/* ---- Regras extras de construção ---- */
function placeRule(t,x,y,w,h){if(!t.place)return ''; let ok=0,tot=0;
  for(let dy=0;dy<h;dy++)for(let dx=0;dx<w;dx++){const X=x+dx,Y=y+dy; if(!inMap(X,Y))continue; const i=Y*N+X; tot++;
    if(t.place==='morro'&&G.ht[i]>=2)ok++; if(t.place==='deserto'&&G.tr[i]===4)ok++; if(t.place==='praia'&&(G.tr[i]===3||nearSea(X,Y)))ok++;}
  if(t.place==='morro'&&ok<tot)return 'Vai no alto dos morros (nível 2 ou mais)';
  if(t.place==='deserto'&&ok<tot)return 'Vai no deserto, ao sul';
  if(t.place==='praia'&&!ok)return 'Vai na praia, perto do mar';
  return '';}
function nearSea(x,y){for(const [a,b] of DIRS4){const X=x+a,Y=y+b; if(inMap(X,Y)&&G.tr[Y*N+X]===2)return true;} return false;}
function buyLock(t){if(t.excl&&!S.unl[t.k])return t.excl==='cadeia'?'Exclusivo: complete a cadeia de missões':'Exclusivo: atenda pedidos dos moradores';
  if(t.tech&&!hasTech(t.tech))return 'Precisa da tecnologia '+TECH.find(x=>x.id===t.tech).name; return '';}
