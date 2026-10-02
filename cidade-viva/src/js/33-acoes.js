/* ================= Ações ================= */
const levelQueue=[], bounce=new Map();
const isGen=t=>!!(t.hydro||t.gen);
function gainXp(n){if(law('integral'))n=Math.round(n*1.1); S.xp+=n; while(S.xp>=cumXp(S.lv+1)){S.lv++; S.coins+=S.lv*50; levelQueue.push(S.lv);} if(levelQueue.length&&$('#modal').hidden)showLevelUp();}
function after(){derive(); refreshQuests(); checkTitle(); updateHud(); markDirty();}
const matTxt=m=>Object.entries(m||{}).filter(([k,v])=>v).map(([k,v])=>ITEMS[k].ico+' '+v).join(' ');
function lacksMat(m,coins){const out=[]; if(coins&&S.coins<coins)out.push(fmtN(coins-S.coins)+' moedas');
  for(const k in m||{}){const have=k==='goods'?S.goods:S.inv[k]; if(have<m[k])out.push((m[k]-have)+' '+ITEMS[k].name.toLowerCase());} return out;}
function payMat(m){for(const k in m||{}){if(k==='goods')S.goods-=m[k]; else S.inv[k]-=m[k];}}
const lacks=t=>lacksMat(t.mat,t.cost);
function canBuy(k,silent){const t=T[k];
  if(S.lv<t.lv){if(!silent)toast('Libera no nível '+t.lv);return false;}
  const lk=buyLock(t); if(lk){if(!silent)toast(lk);return false;}
  if(t.max&&countK(k)>=t.max){if(!silent)toast('Você já tem: '+t.name);return false;}
  const l=lacks(t); if(l.length){if(!silent)toast('Faltam '+l.join(', '));return false;}
  if(t.pop&&D.pop+t.pop>D.popCap){if(!silent)toast('Sem vaga para moradores. Construa um prédio de Serviços.');return false;}
  return true;}
function placeNew(k,x,y,f){const t=T[k]; if(!canBuy(k))return false;
  if(!canPlace(k,x,y,f,-2)){toast(whyNot(k,x,y,f));return false;}
  const now=Date.now(); S.coins-=t.cost; payMat(t.mat);
  const b={i:S.nid++,k,x,y,f:f?1:0,lv:1,d:now+t.time*1000,a:0,s:0};
  if(t.cat==='res')b.a=b.d+t.rt*1000; if(k==='plot'||k==='estacao'||k==='porto'||k==='aeroporto'||t.rec)b.s=''; if(isGen(t))b.a=b.d+t.bt*1000;
  S.b.push(b); S.st.build++; bounce.set(b.i,now); floatAt(b,'-'+fmtN(t.cost),'#ffd43b'); gainXp(buildXp(t)); after(); return true;}
function collect(b,silent){const t=T[b.k],now=Date.now(); if(now<b.d)return 0;
  if(b.fire&&(t.cat==='res'||t.cat==='biz')){if(!silent)toast('Está pegando fogo! Apague primeiro.');return 0;}
  if(t.cat==='res'&&now>=b.a){const c=rentAmt(b); S.coins+=c; S.st.rent++; b.a=now+t.rt*1000;
    if(!silent)floatAt(b,'+'+fmtN(c),'#ffd43b'); gainXp(Math.round(rentXp(t)*(1+cov(b).xp/100))); drop('selos',.035,b); return c;}
  if(t.cat==='biz'&&b.s===1&&now>=b.a){const c=payAmt(b); S.coins+=c; S.st.biz++; b.s=0; b.a=0;
    if(!silent)floatAt(b,'+'+fmtN(c),'#ffd43b'); gainXp(bizXp(t)); drop('brinq',.03,b); return c;}
  if(isGen(t)&&now>=b.a){const c=Math.round(t.pay*evMul('prod')); S.coins+=c; b.a=now+t.bt*1000; if(!silent)floatAt(b,'+'+fmtN(c),'#ffd43b'); gainXp(Math.round(t.pay/20)); return c;}
  return 0;}
const supHave=t=>t.item?S.inv[t.item]:S.goods;
function supply(b,silent){const t=T[b.k]; if(b.s===1||Date.now()<b.d)return false;
  if(supHave(t)<t.sup){if(!silent)toast(t.item?'Faltam '+(t.sup-supHave(t))+' '+ITEMS[t.item].name.toLowerCase()+'. Produza na indústria.':'Faltam '+fmtN(t.sup-S.goods)+' mercadorias. Colha plantações ou use o trem.');return false;}
  if(t.item)S.inv[t.item]-=t.sup; else S.goods-=t.sup; b.s=1; b.a=Date.now()+t.bt*1000; S.st.supply++;
  if(!silent)floatAt(b,'-'+t.sup+' '+(t.item?ITEMS[t.item].ico:'merc.'),'#ffb35c'); return true;}
function harvest(b,silent){const now=Date.now(); if(!b.s||now<b.a)return 0; const c=C[b.s];
  const space=D.gCap-S.goods; if(space<=0){if(!silent)toast('Depósito cheio. Construa um Galpão ou gaste mercadorias.');return -1;}
  const g=Math.round(c.g*evMul('harvest')*(hasTech('agro')?1.25:1)*(1+farmBuff(b,'yield')/100)); const got=Math.min(space,g); S.goods+=got; S.st.harvest++; b.s=''; b.a=0;
  if(!silent){floatAt(b,'+'+got+' merc.','#ffb35c'); if(got<g)toast('Depósito cheio: '+(g-got)+' mercadorias ficaram para trás.');}
  gainXp(c.xp); return got;}
function plant(b,ck){const c=C[ck]; if(S.lv<c.lv){toast('Libera no nível '+c.lv);return false;}
  if(S.coins<c.cost){toast('Faltam '+fmtN(c.cost-S.coins)+' moedas');return false;} if(b.s||Date.now()<b.d)return false;
  S.coins-=c.cost; b.s=ck; b.a=Date.now()+c.t*1000*(1-farmBuff(b,'speed')/100); S.st.plant++; return true;}
function farmBuff(b,k){let v=0; for(const o of S.b){const fb=T[o.k].farmBuff; if(fb&&Date.now()>=o.d&&dist(b,o)<=fb.r)v=Math.max(v,fb[k]||0);} return v;}

/* ---- Indústria ---- */
function prodMul(){let m=D.hydro?.75:1; m*=1-Math.min(.25,.05*(D.clean||0)); if(S.b.some(o=>T[o.k].indBuff&&Date.now()>=o.d))m*=.9; if(law('filtros'))m*=1.1; return m;}
const prodTime=(t,r)=>Math.round((r||t.rec).t*prodMul());
const recOf=b=>b.r===2&&T[b.k].rec2?T[b.k].rec2:T[b.k].rec;
function canStart(b){const t=T[b.k]; return !lacksMat(t.rec.in,t.rec.c).length||(t.rec2&&!lacksMat(t.rec2.in,t.rec2.c).length);}
function startProd(b,silent){const t=T[b.k],now=Date.now(); if(now<b.d||b.s)return false;
  let r=t.rec, ri=1; if(t.rec2&&!lacksMat(t.rec2.in,t.rec2.c).length){r=t.rec2; ri=2;}
  const l=lacksMat(r.in,r.c); if(l.length){if(!silent)toast('Faltam '+l.join(', '));return false;}
  S.coins-=r.c; payMat(r.in); b.s='run'; b.r=ri; b.a=now+prodTime(t,r)*1000; if(!silent)floatAt(b,'-'+r.c,'#ffd43b'); return true;}
function collectProd(b,silent){const t=T[b.k],now=Date.now(); if(b.s!=='run'||now<b.a)return 0;
  const rc=recOf(b); const parts=[]; for(const k in rc.out){const q=Math.round(rc.out[k]*evMul('prod')); S.inv[k]+=q; parts.push('+'+q+' '+ITEMS[k].ico);}
  b.s=''; b.a=0; b.r=0; S.st.prod++; gainXp(Math.max(2,Math.round((rc.t)/15))); drop('engren',.05,b); if(rc.out.stone||rc.out.ore||rc.out.lime)drop('minerais',.05,b);
  if(!silent)floatAt(b,parts.join(' '),'#ffe6a8'); return 1;}

/* ---- Trem, porto e exportação ---- */
const EXP_Q={goods:100,wood:20,stone:20,steel:10,rubber:10,tools:6,tires:6,cars:2};
function expPay(item,port){return Math.round(ITEMS[item].val*EXP_Q[item]*(port?1.7:1.3));}
function trainArrive(b,silent){const now=Date.now(); if(!b.s||now<b.a)return 0;
  if(b.s==='exp'){const tr=b.trip||{pay:0}; S.coins+=tr.pay; S.st.export++; b.s=''; b.a=0; b.trip=null; if(!silent)floatAt(b,'+'+fmtN(tr.pay),'#ffd43b'); gainXp(Math.round(tr.pay/40));
    if(T[b.k].port){drop('conchas',1,b);} else drop('conchas',.15,b); return tr.pay;}
  const tr=TR[b.s]; const space=D.gCap-S.goods; if(space<=0){if(!silent)toast('Depósito cheio. Abra espaço antes de descarregar.');return -1;}
  const got=Math.min(space,tr.g); S.goods+=got; b.s=''; b.a=0; if(!silent){floatAt(b,'+'+got+' merc.','#ffb35c');}
  gainXp(Math.max(1,Math.round(tr.g/20))); return got;}
function sendTrain(b,id){const tr=TR[id]; if(!D.linked.has(b.i)){toast('Ligue a estação ao túnel com trilhos primeiro');return;}
  if(S.lv<tr.lv){toast('Libera no nível '+tr.lv);return;} if(S.coins<tr.cost){toast('Faltam '+fmtN(tr.cost-S.coins)+' moedas');return;}
  S.coins-=tr.cost; b.s=id; b.t0=Date.now(); b.a=Date.now()+tr.t*1000; S.st.train++; floatAt(b,'-'+fmtN(tr.cost),'#ffd43b'); after(); closeSheet();}
const AIR_ITEMS=['goods','tools','tires'];
function sendExport(b,item){const air=!!T[b.k].air, port=!air&&!!T[b.k].port; if(!port&&!air&&!D.linked.has(b.i)){toast('Ligue a estação ao túnel com trilhos primeiro');return;}
  if(air&&!AIR_ITEMS.includes(item)){toast('O avião só leva carga leve');return;}
  const q=EXP_Q[item], have=item==='goods'?S.goods:S.inv[item]; if(have<q){toast('Precisa de '+q+' '+ITEMS[item].name.toLowerCase());return;}
  if(item==='goods')S.goods-=q; else S.inv[item]-=q; b.s='exp'; b.t0=Date.now(); b.trip={item,qty:q,pay:Math.round(expPay(item,port)*(air?1.25:1))}; b.a=Date.now()+(air?240:port?900:300)*1000;
  toast((air?'Avião':port?'Navio':'Trem')+' saiu com '+q+' '+ITEMS[item].name.toLowerCase()); after(); closeSheet();}

function collectAll(){const now=Date.now(); let coins=0,goods=0,n=0,full=false,prod=0;
  for(const b of S.b){const t=T[b.k]; if(now<b.d)continue;
    if(t.cat==='res'||t.cat==='biz'||isGen(t)){const c=collect(b,true); if(c){coins+=c;n++;}}
    else if(b.k==='plot'){const g=harvest(b,true); if(g>0){goods+=g;n++;} else if(g<0)full=true;}
    else if(b.k==='estacao'||b.k==='porto'||b.k==='aeroporto'){const g=trainArrive(b,true); if(g>0){n++; if(b.trip===null)coins+=0;} else if(g<0)full=true;}
    else if(t.rec){if(collectProd(b,true)){prod++;n++;} if(!b.s&&startProd(b,true))n++;}}
  let sup=0; for(const b of S.b){if(T[b.k].cat==='biz'&&b.s===0&&now>=b.d){if(supply(b,true))sup++;}}
  const tax=taxAmt(); if(tax>=10){collectTax(true); coins+=tax; n++;}
  if(!n&&!sup){toast(full?'Depósito cheio. Construa um Galpão.':'Nada pronto agora');return;}
  const parts=[]; if(coins)parts.push('+'+fmtN(coins)+' moedas'); if(goods)parts.push('+'+fmtN(goods)+' mercadorias'); if(prod)parts.push(prod+' produção'+(prod>1?'ões':''));
  if(sup)parts.push(sup+' comércio'+(sup>1?'s':'')+' abastecido'+(sup>1?'s':''));
  toast((parts.join(' · ')||'Tudo coletado')+(full?' · depósito cheio':'')); after();}
function readyCount(){const now=Date.now(); let n=0;
  for(const b of S.b){const t=T[b.k]; if(now<b.d)continue;
    if(t.cat==='res'&&now>=b.a)n++; else if(t.cat==='biz'&&((b.s===1&&now>=b.a)||(b.s===0&&supHave(t)>=t.sup)))n++;
    else if((b.k==='plot'||b.k==='estacao'||b.k==='porto'||b.k==='aeroporto')&&b.s&&now>=b.a)n++;
    else if(t.rec&&((b.s==='run'&&now>=b.a)||(!b.s&&canStart(b))))n++; else if(isGen(t)&&now>=b.a)n++;}
  if(taxAmt()>=10)n++; return n;}
function sellB(b){const t=T[b.k]; const ref=Math.floor(t.cost/2); S.coins+=ref; S.b=S.b.filter(x=>x!==b); if(selId===b.i)selId=null; after(); toast(t.name+' vendido(a) por '+fmtN(ref)+' moedas');}

/* ---- Turismo: taxa recolhida na Prefeitura ---- */
function taxRate(){return D.tourists*.6;} // moedas por minuto
function taxAmt(){if(!S||!D.tourists)return 0; const min=Math.min(360,(Date.now()-S.taxT)/60000); return Math.floor(min*taxRate());}
function collectTax(silent){const a=taxAmt(); if(a<1)return 0; S.coins+=a; S.taxT=Date.now(); const h=S.b.find(b=>b.k==='hall'); if(!silent&&h)floatAt(h,'+'+fmtN(a),'#ffd43b'); gainXp(Math.max(1,Math.round(a/30))); return a;}

/* ---- Obstáculos ---- */
function clearOb(x,y,silent){const i=y*N+x, o=OB[G.ob[i]]; if(!o)return false;
  if(!isUl(x,y)){if(!silent)toast('Compre esta área primeiro (Expandir)');return false;}
  if(S.coins<o.cost){toast('Faltam '+fmtN(o.cost-S.coins)+' moedas para limpar');return false;}
  const m=evMul('clear'); S.coins-=o.cost; G.ob[i]=0; S.st.clear++; S.inv.wood+=o.wood*m; S.inv.stone+=o.stone*m; if(o.coins)S.coins+=o.coins*m;
  const parts=[]; if(o.wood)parts.push('+'+o.wood*m+' 🪵'); if(o.stone)parts.push('+'+o.stone*m+' 🪨'); if(o.coins)parts.push('+'+o.coins*m);
  floatXY(x+.5,y+.5,30+hAt(x+.5,y+.5),parts.join(' ')||('+'+o.xp+' XP'),o.stone?'#d9dde3':o.wood?'#e7b77a':'#ffd43b');
  if(o.stone)drop('minerais',G.ht[i]?.08:.04); puff(x+.5,y+.5); gainXp(o.xp); after(); return true;}

/* ---- Pincéis ---- */
const tileBusy=(x,y)=>D.occ[y*N+x]!==-1;
function toolCost(tool,opt){if(tool==='ponte'){const m=BRIDGES[opt||0]; return {c:m.c,mat:m.mat};} return {c:TOOLS[tool].cost,mat:null};}
function toolCheck(tool,x,y,opt){const tl=TOOLS[tool];
  if(tl.q){const qx=x,qy=y; if(qx<0||qy<0||qx>=Q2||qy>=Q2)return 'fora'; x=qx>>1; y=qy>>1;
    if(!isUl(x,y))return 'Área não comprada'; const i=y*N+x, qi=qy*Q2+qx;
    if(tool==='apagar')return (G.pv[qi]||G.fc[qi])?'':'já';
    if(G.tr[i]===1||G.tr[i]===2)return 'Não dá na água'; if(tileBusy(x,y))return 'Ocupado'; if(G.rd[i]||G.rl[i])return 'Tem rua ou trilho aqui'; if(G.ob[i])return 'Limpe o obstáculo primeiro'; if(G.rp[i])return 'Não dá em rampa';
    if(tool==='piso'&&G.pv[qi]===(opt||0)+1)return 'já'; if(tool==='muro'&&G.fc[qi]===(opt||0)+1)return 'já'; return '';}
  if(!inMap(x,y))return 'fora'; if(!isUl(x,y))return 'Área não comprada';
  const i=y*N+x, tr=G.tr[i], rd=G.rd[i], busy=tileBusy(x,y), wat=tr===1||tr===2;
  switch(tool){
    case 'rua': if(wat)return 'Na água use a Ponte'; if(busy)return 'Ocupado'; if(G.ob[i])return 'Limpe o obstáculo primeiro'; if(rd===1)return 'já'; return '';
    case 'ponte': if(tr!==1)return tr===2?'Ponte só em rio ou lago':'Ponte só sobre rio ou lago'; if(G.rl[i])return 'Tem trilho aqui'; if(rd===2&&G.bm[i]===(opt||0))return 'já'; if(S.lv<BRIDGES[opt||0].lv)return 'Esse modelo libera no nível '+BRIDGES[opt||0].lv; return '';
    case 'trilho': if(tr===2)return 'Trilho não vai no mar'; if(busy)return 'Ocupado'; if(G.ob[i])return 'Limpe o obstáculo primeiro'; if(G.rp[i])return 'Trem não sobe rampa'; if(rd===2)return 'Tem ponte de carro aqui'; if(G.rl[i])return 'já'; return '';
    case 'remover': if(x===TUN.x&&y===TUN.y)return 'O túnel fica'; if(rd||G.ob[i]||G.rl[i])return ''; return 'já';
    case 'elevar': case 'rebaixar': case 'nivelar':{if(wat)return 'Não dá na água'; if(busy)return 'Tem construção aqui'; if(rd||G.rl[i])return 'Tire a rua ou o trilho antes';
      const L=G.ht[i]; if(tool==='elevar'&&L>=4)return 'Altura máxima'; if(tool==='rebaixar'&&L<=0&&!G.rp[i])return 'já';
      if(tool==='nivelar'&&L===(opt||0)&&!G.rp[i])return 'já'; return '';}
    case 'rampa':{if(wat)return 'Não dá na água'; if(busy)return 'Tem construção aqui'; if(G.rl[i])return 'Trem não sobe rampa'; if(G.rp[i])return 'já';
      const L=G.ht[i]; for(let d=0;d<4;d++){const X=x+DIRS4[d][0],Y=y+DIRS4[d][1]; if(inMap(X,Y)&&edgeZ(X,Y,(d+2)%4)===L+1)return '';} return 'A rampa precisa de um vizinho um nível acima';}
    case 'cavar': if(wat)return 'já'; if(busy||rd||G.rl[i])return 'Ocupado'; if(G.ob[i])return 'Limpe o obstáculo primeiro'; if(G.ht[i]||G.rp[i])return 'Só dá pra cavar no nível do chão'; return '';
    case 'aterrar': if(tr!==1)return 'já'; if(rd||G.rl[i])return 'Tire a ponte ou o trilho antes'; return '';
    case 'pintar': if(wat)return 'Não dá na água'; if(tr===SOILS[opt||0][0])return 'já'; return '';
    case 'plantar': if(wat)return 'Não dá na água'; if(busy||rd||G.rl[i]||G.ob[i]||qHas(x,y))return 'Ocupado'; return '';}
  return 'já';}
function applyTool(tool,x,y,opt){const why=toolCheck(tool,x,y,opt); if(why)return why; undoTouch(x,y,!!TOOLS[tool].q); const tl=TOOLS[tool], cc=toolCost(tool,opt);
  if(tool==='remover'){const i=y*N+x; if(G.ob[i])return clearOb(x,y)?'':'sem'; if(G.rl[i])G.rl[i]=0; else G.rd[i]=0; puff(x+.5,y+.5); mapVer++; after(); return '';}
  if(tool==='apagar'){const qi=y*Q2+x; G.pv[qi]=0; G.fc[qi]=0; mapVer++; markDirty(); return '';}
  if(lacksMat(cc.mat,cc.c).length)return 'sem';
  S.coins-=cc.c; payMat(cc.mat);
  if(tl.q){const qi=y*Q2+x; if(tool==='piso')G.pv[qi]=(opt||0)+1; else G.fc[qi]=(opt||0)+1; mapVer++; markDirty(); return '';}
  const i=y*N+x;
  switch(tool){
    case 'rua':G.rd[i]=1;S.st.road++; clearQ(x,y); break;
    case 'ponte':G.rd[i]=2;G.bm[i]=opt||0;S.st.bridge++; break;
    case 'trilho':G.rl[i]=1; clearQ(x,y); break;
    case 'elevar':G.ht[i]=Math.min(4,G.ht[i]+(G.rp[i]?1:1)); G.rp[i]=0; S.st.terra++; snowFix(i); break;
    case 'rebaixar':if(G.rp[i])G.rp[i]=0; else G.ht[i]--; S.st.terra++; snowFix(i); break;
    case 'nivelar':G.ht[i]=opt||0; G.rp[i]=0; S.st.terra++; snowFix(i); break;
    case 'rampa':{const L=G.ht[i]; for(let d=0;d<4;d++){const X=x+DIRS4[d][0],Y=y+DIRS4[d][1]; if(inMap(X,Y)&&edgeZ(X,Y,(d+2)%4)===L+1){G.rp[i]=d+1;break;}} S.st.terra++; break;}
    case 'cavar':G.tr[i]=1;S.st.dig++; clearQ(x,y); break;
    case 'aterrar':G.tr[i]=0; break;
    case 'pintar':G.tr[i]=SOILS[opt||0][0]; break;
    case 'plantar':G.ob[i]=G.ht[i]>0||Math.random()<.4?2:1; break;}
  if(cc.c)gainXp(Math.max(1,Math.round(cc.c/30)));
  puff(x+.5,y+.5); mapVer++; after(); return '';}
function snowFix(i){if(G.ht[i]>=4&&G.tr[i]===0)G.tr[i]=6; else if(G.ht[i]<4&&G.tr[i]===6)G.tr[i]=0;}
function clearQ(x,y){for(const [a,b] of [[0,0],[1,0],[0,1],[1,1]]){const qi=(y*2+b)*Q2+x*2+a; G.pv[qi]=0; G.fc[qi]=0;}}
// troca o modelo de uma ponte inteira (todos os trechos ligados)
function bridgeSpan(x,y){const out=[],seen=new Set([y*N+x]),q=[[x,y]]; while(q.length){const [a,b]=q.pop(); out.push([a,b]); for(const [dx,dy] of DIRS4){const X=a+dx,Y=b+dy,i=Y*N+X; if(inMap(X,Y)&&!seen.has(i)&&G.rd[i]===2){seen.add(i);q.push([X,Y]);}}} return out;}
function rebuildBridge(x,y,m){const span=bridgeSpan(x,y).filter(([a,b])=>G.bm[b*N+a]!==m); if(!span.length)return; const M=BRIDGES[m]; const tot={}; for(const k in M.mat)tot[k]=M.mat[k]*span.length;
  const l=lacksMat(tot,M.c*span.length); if(l.length){toast('Faltam '+l.join(', '));return;} S.coins-=M.c*span.length; payMat(tot); for(const [a,b] of span){G.bm[b*N+a]=m; puff(a+.5,b+.5);} mapVer++; after(); toast('Ponte trocada para '+M.name);}

/* ---- Expansão ---- */
function chunkBuyable(cx,cy){if(cx<0||cy<0||cx>=NC||cy>=NC||S.ul[cy*NC+cx])return false;
  return DIRS4.some(([a,b])=>{const X=cx+a,Y=cy+b;return X>=0&&Y>=0&&X<NC&&Y<NC&&S.ul[Y*NC+X];});}
function chunkWater(cx,cy){let w=0; for(let y=0;y<CH;y++)for(let x=0;x<CH;x++)if(G.tr[(cy*CH+y)*N+cx*CH+x]===2)w++; return w/(CH*CH);}
function chunkCost(cx,cy){const c=expCost(S.st.expand); return chunkWater(cx,cy)>.5?Math.round(c/2/50)*50:c;}
function buyChunk(cx,cy){const cost=chunkCost(cx,cy), pop=expPop(S.st.expand);
  if(D.pop<pop){toast('Precisa de '+fmtN(pop)+' moradores para expandir');return;}
  if(S.coins<cost){toast('Faltam '+fmtN(cost-S.coins)+' moedas');return;}
  S.coins-=cost; S.ul[cy*NC+cx]=1; S.st.expand++; mapVer++; gainXp(Math.round(cost/30)); after(); toast('Nova área liberada! Limpe os obstáculos para construir.');
  if(!S.ul.some((v,i)=>!v&&chunkBuyable(i%NC,Math.floor(i/NC))))setMode({t:'idle'}); else updatePlaceBar();}

/* ================= Coleções ================= */
function drop(id,chance,b){if(Math.random()>chance)return; const c=COLS[id]; const arr=S.col[id]||(S.col[id]=c.items.map(()=>0)); const k=(Math.random()*c.items.length)|0; arr[k]++;
  toast('Item de coleção: '+c.items[k]+' ('+c.name+')'); if(b)floatAt(b,'★ '+c.items[k],'#ffe066'); markDirty();}
function colDone(id){const a=S.col[id]; return a&&a.every(v=>v>0);}
function tradeCol(id){if(!colDone(id))return; const c=COLS[id]; S.col[id]=S.col[id].map(v=>v-1); S.coins+=c.coins; gainXp(c.xp); toast('Coleção trocada: +'+fmtN(c.coins)+' moedas e '+c.xp+' XP'); after();}

/* ================= Encomendas ================= */
function availItems(){const a=['goods','wood','stone']; if(S.lv>=8)a.push('steel','tools'); if(S.lv>=10)a.push('rubber'); if(S.lv>=11)a.push('tires'); if(S.lv>=14)a.push('cars'); return a;}
function genOrder(){const av=availItems(), n=Math.random()<.4&&av.length>2?2:1, items={}; const pool=av.slice();
  for(let k=0;k<n;k++){const it=pool.splice((Math.random()*pool.length)|0,1)[0]; const base=it==='goods'?30+S.lv*6:it==='cars'?1:Math.max(2,Math.round((3+S.lv/2)*(it==='tools'||it==='tires'?.5:1))); items[it]=base;}
  let v=0; for(const k in items)v+=ITEMS[k].val*items[k]; return {items,coins:Math.round(v*1.8/10)*10+50,xp:Math.max(5,Math.round(v/25))};}
function refreshOrders(){const now=Date.now(); for(let i=0;i<3;i++){if(!S.ord[i]&&now>=(S.ordT[i]||0)){S.ord[i]=genOrder(); markDirty();}}}
function deliverOrder(i){const o=S.ord[i]; if(!o)return; const l=lacksMat(o.items); if(l.length){toast('Faltam '+l.join(', '));return;}
  payMat(o.items); S.coins+=o.coins; gainXp(o.xp); S.st.order++; S.ord[i]=null; S.ordT[i]=Date.now()+60000; toast('Encomenda entregue: +'+fmtN(o.coins)+' moedas'); drop('brinq',.12); after();}
function skipOrder(i){S.ord[i]=null; S.ordT[i]=Date.now()+5*60000; markDirty();}

/* ================= Desafios diários e semanais ================= */
const CH_T=[['rent','Colete aluguel',l=>8+l],['harvest','Colha plantações',l=>4+Math.floor(l/2)],['supply','Abasteça comércios',l=>4+Math.floor(l/3)],
  ['clear','Limpe obstáculos',l=>5],['build','Construa algo novo',l=>3],['road','Construa trechos de rua',l=>8],['biz','Colete comércios',l=>5+Math.floor(l/3)],
  ['prod','Colete produções da indústria',l=>3+Math.floor(l/4),4],['order','Entregue encomendas',l=>2],['export','Exporte cargas',l=>1,5],['terra','Modele o terreno',l=>6,3]];
function dayIdx(now){const d=new Date(now); return Math.floor((d.getTime()-d.getTimezoneOffset()*60000)/864e5);}
function pickCh(seed,n,lv){const ok=CH_T.filter(c=>!c[3]||lv>=c[3]); const out=[]; let k=0; while(out.length<n&&k<50){const c=ok[hsh(seed,k++,11)%ok.length]; if(!out.includes(c[0]))out.push(c[0]);} return out;}
function refreshCh(){const now=Date.now(), di=dayIdx(now), wi=Math.floor((di+3)/7); let ch=S.ch;
  if(!ch||ch.day!==di){ch=S.ch=Object.assign(ch||{},{day:di,dl:pickCh(di,3,S.lv),dbase:Object.assign({},S.st),dc:[0,0,0]}); markDirty();}
  if(ch.week!==wi){Object.assign(ch,{week:wi,wl:pickCh(wi*7+1,3,S.lv),wbase:Object.assign({},S.st),wc:[0,0,0],wb:0}); markDirty();}}
function chInfo(id,week){const c=CH_T.find(x=>x[0]===id); const n=c[2](S.lv)*(week?6:1); const base=(week?S.ch.wbase:S.ch.dbase)[id]||0; return {title:c[1],n,p:Math.min(n,(S.st[id]||0)-base),
  coins:week?1000+200*S.lv:150+40*S.lv, xp:week?120+15*S.lv:20+4*S.lv};}
function claimCh(i,week){const id=(week?S.ch.wl:S.ch.dl)[i], done=week?S.ch.wc:S.ch.dc; if(done[i])return; const c=chInfo(id,week); if(c.p<c.n)return;
  done[i]=1; S.coins+=c.coins; gainXp(c.xp); toast('Desafio concluído: +'+fmtN(c.coins)+' moedas');
  if(week&&S.ch.wc.every(Boolean)&&!S.ch.wb){S.ch.wb=1; S.coins+=3000+500*S.lv; S.inv.tools+=5; toast('Semana completa! Bônus de '+fmtN(3000+500*S.lv)+' moedas e 5 ferramentas');} after();}

/* ================= Títulos da cidade ================= */
const titleQueue=[];
function titleIdx(pop){let k=0; for(let i=0;i<TITLES.length;i++)if(pop>=TITLES[i][0])k=i; return k;}
function checkTitle(){const k=titleIdx(D.pop); if(k>S.title){for(let i=S.title+1;i<=k;i++){S.coins+=TITLES[i][2]; titleQueue.push(i);} S.title=k; if($('#modal').hidden)showTitle();}}

/* ================= Missões ================= */
function activeQuests(){const out=[]; for(const q of Q){if(S.q.done.includes(q.id))continue; out.push(q); if(out.length>=3)break;} return out;}
function qProg(q){const o=q.o;
  switch(o.t){case 'own':return countDone(o.k); case 'stat':return S.st[o.s]-(S.q.base[q.id]??S.st[o.s]);
    case 'lv':return S.lv; case 'pop':return D.pop; case 'exp':return S.st.expand;
    case 'happy':{let n=0; for(const b of S.b){if(T[b.k].cat==='res'&&cov(b).mask===31)n++;} return n;}
    case 'rail':return D.linked.size;}
  return 0;}
function refreshQuests(){for(const q of activeQuests()){if(q.o.t==='stat'&&S.q.base[q.id]==null){S.q.base[q.id]=S.st[q.o.s];markDirty();}}}
function claimQuest(id){const q=Q.find(x=>x.id===id); if(!q||S.q.done.includes(id)||qProg(q)<q.o.n)return;
  S.q.done.push(id); delete S.q.base[id]; S.coins+=q.coins; toast('Missão concluída: +'+fmtN(q.coins)+' moedas'+(q.xp?' · +'+q.xp+' XP':''));
  gainXp(q.xp); after(); if(sheetKind==='quests')openQuests();}
