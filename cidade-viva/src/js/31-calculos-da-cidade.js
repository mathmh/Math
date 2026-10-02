/* ================= Derivados ================= */
const fw=b=>b.f?T[b.k].h:T[b.k].w, fh=b=>b.f?T[b.k].w:T[b.k].h;
const isCarRdRaw=(x,y)=>inMap(x,y)&&(G.rd[y*N+x]===1||G.rd[y*N+x]===2);
function carLink(x,y,d){const X=x+DIRS4[d][0],Y=y+DIRS4[d][1]; return isCarRdRaw(x,y)&&isCarRdRaw(X,Y)&&linked(x,y,d);}
const isCarRd=isCarRdRaw;
function railLink(x,y,d){const X=x+DIRS4[d][0],Y=y+DIRS4[d][1]; return inMap(X,Y)&&G.rl[y*N+x]&&G.rl[Y*N+X]&&G.ht[y*N+x]===G.ht[Y*N+X]&&!G.rp[y*N+x]&&!G.rp[Y*N+X];}
const qHas=(x,y)=>{const a=(y*2)*Q2+x*2, b=a+Q2; return G.pv[a]||G.pv[a+1]||G.pv[b]||G.pv[b+1]||G.fc[a]||G.fc[a+1]||G.fc[b]||G.fc[b+1];};
function derive(){const now=Date.now(); const pver=D?D.ver:0; const d=emptyD(); let pop=0,popCap=0,gCap=0;
  S.b.forEach((b,i)=>{const t=T[b.k],w=fw(b),h=fh(b);
    for(let dy=0;dy<h;dy++)for(let dx=0;dx<w;dx++){const X=b.x+dx,Y=b.y+dy; if(inMap(X,Y)){d.occ[Y*N+X]=i; if(elev(Y*N+X))d.under[Y*N+X]=1;}}
    const ci=clamp(Math.floor(b.y/CH),0,NC-1)*NC+clamp(Math.floor(b.x/CH),0,NC-1); (d.ckB[ci]||(d.ckB[ci]=[])).push(b);
    if(t.pop)pop+=t.pop; const done=now>=b.d; if(done&&t.cap)popCap+=t.cap; if(done&&t.store)gCap+=t.store; if(done&&t.hydro)d.hydro++; if(done&&t.clean)d.clean++;});
  let rn=0; for(let y=0;y<N;y++)for(let x=0;x<N;x++){if(!isCarRd(x,y))continue; rn++;
    let n=0; for(let k=0;k<4;k++)if(carLink(x,y,k))n++; if(n>=3)d.inter[y*N+x]=1;}
  d.pop=pop; d.popCap=popCap; d.gCap=gCap; d.roadN=rn; computePollution(d,now);
  // trilhos ligados ao túnel
  if(G.rl[TUN.y*N+TUN.x]){const q=[[TUN.x,TUN.y]]; d.rail[TUN.y*N+TUN.x]=1; while(q.length){const [x,y]=q.pop(); for(let k=0;k<4;k++){if(!railLink(x,y,k))continue; const X=x+DIRS4[k][0],Y=y+DIRS4[k][1]; if(d.rail[Y*N+X])continue; d.rail[Y*N+X]=1; q.push([X,Y]);}}}
  D=d;
  for(const b of S.b)if((b.k==='estacao')&&stationLinked(b))d.linked.add(b.i);
  // cobertura de desejos, buffs e bairros
  const prov=[], buffs=[];
  for(const b of S.b){const t=T[b.k]; if(now<b.d)continue; if(t.serve)prov.push(b); else if(t.cat==='biz')prov.push(b); if(t.buff)buffs.push(b);}
  let hs=0,hp=0;
  for(const b of S.b){const t=T[b.k]; if(t.cat!=='res'&&t.cat!=='biz')continue; let mask=0,rent=0,xp=0,set=0,setN=0;
    if(t.cat==='res'){for(const p of prov){if(p===b)continue; const pt=T[p.k]; const sv=pt.serve||{};
        if(pt.cat==='biz'&&!sv.com&&dist(b,p)<=5)mask|=1;
        for(const k in sv){if(dist(b,p)<=sv[k])mask|=1<<NEED_I[k];}}
      if(t.serve&&t.serve.com)mask|=1;}
    for(const p of buffs){if(p===b)continue; const bf=T[p.k].buff; if(dist(b,p)<=bf.r){rent+=bf.rent||0;xp+=bf.xp||0;}}
    if(t.set&&now>=b.d){const ks=new Set([b.k]); for(const o of S.b){if(o!==b&&T[o.k].set===t.set&&now>=o.d&&dist(b,o)<=5)ks.add(o.k);} setN=ks.size; set=setN>=SETS[t.set].keys.length?30:setN>=4?20:setN>=3?10:0;}
    const poll=pollAt(b); const happy=clamp(popc(mask)/5-pollPenalty(poll)+(law('parques')?.05:0),0,1); d.cov.set(b.i,{mask,rent:Math.min(60,rent),xp:Math.min(60,xp),happy,set,setN,poll});
    if(t.cat==='res'&&now>=b.d){hs+=happy*t.pop;hp+=t.pop;}}
  d.happy=hp?hs/hp:0;
  // turismo
  let tour=0,beds=0; for(const b of S.b){if(now<b.d)continue; const t=T[b.k]; if(t.tour)tour+=t.tour; if(t.beds)beds+=t.beds; if(t.port)tour+=12;}
  let beach=0; for(let i=0;i<N*N;i++)if(G.tr[i]===3&&isUl(i%N,(i/N)|0))beach++; tour+=Math.min(20,Math.floor(beach/6));
  if(d.linked.size)tour+=8; tour*=evMul('tour')*(law('turismo')?1.25:1)*(hasTech('turismo2')?1.15:1)*wxMul.tour(); d.tour=Math.round(tour); d.beds=beds; d.tourists=Math.min(Math.round(tour*4),beds+Math.round(tour*.5));
  d.ver=pver+1; D=d; geoVer++; deriveExtra(d,now);}
const popc=m=>{let c=0;while(m){c+=m&1;m>>=1;}return c;};
function dist(a,b){const aw=fw(a),ah=fh(a),bw=fw(b),bh=fh(b);
  const dx=Math.max(0,b.x-(a.x+aw-1),a.x-(b.x+bw-1)), dy=Math.max(0,b.y-(a.y+ah-1),a.y-(b.y+bh-1)); return Math.max(dx,dy);}
function stationLinked(b){const w=fw(b),h=fh(b); for(let i=-1;i<=w;i++)for(let j=-1;j<=h;j++){if(i>=0&&i<w&&j>=0&&j<h)continue; const X=b.x+i,Y=b.y+j; if(inMap(X,Y)&&D.rail[Y*N+X])return [X,Y];} return null;}
function freeTile(x,y,ignore,water){if(!isUl(x,y)||peakZone(x,y))return false; const i=y*N+x; if(!water&&(G.tr[i]===1||G.tr[i]===2))return false; if(G.rd[i]||G.rl[i]||G.ob[i]||qHas(x,y))return false;
  const o=D.occ[i]; return o===-1||o===ignore;}
function canPlace(k,x,y,f,ignore){const t=T[k],w=f?t.h:t.w,h=f?t.w:t.h; let L=null, wat=0, land=0; if(placeRule(t,x,y,w,h))return false;
  for(let dy=0;dy<h;dy++)for(let dx=0;dx<w;dx++){const X=x+dx,Y=y+dy; if(!inMap(X,Y))return false; const i=Y*N+X, isW=G.tr[i]===1||G.tr[i]===2;
    if(t.port){const u=f?dy:dx; if(u>=2){if(!isW||G.rd[i]||!isUl(X,Y)||D.occ[i]!==-1&&D.occ[i]!==ignore)return false; continue;} }
    if(t.hydro&&isW){if(G.tr[i]!==1||G.rd[i]||!isUl(X,Y)||(D.occ[i]!==-1&&D.occ[i]!==ignore))return false; wat++; continue;}
    if(!freeTile(X,Y,ignore))return false; if(G.rp[i])return false; if(L==null)L=G.ht[i]; else if(G.ht[i]!==L)return false; land++;}
  if(t.hydro&&(wat<2||land<2))return false;
  if(t.port&&L!==0)return false;
  return true;}
function whyNot(k,x,y,f){const t=T[k],w=f?t.h:t.w,h=f?t.w:t.h; let lv=null; const pr=placeRule(t,x,y,w,h); if(pr)return pr;
  for(let dy=0;dy<h;dy++)for(let dx=0;dx<w;dx++)if(peakZone(x+dx,y+dy))return 'A serra é só paisagem';
  for(let dy=0;dy<h;dy++)for(let dx=0;dx<w;dx++){const X=x+dx,Y=y+dy; if(!isUl(X,Y))return 'Área não comprada'; const i=Y*N+X;
    if(G.ob[i])return 'Limpe os obstáculos'; if(G.rp[i])return 'Não dá pra construir em rampa'; if(lv==null)lv=G.ht[i]; else if(lv!==G.ht[i]&&!(G.tr[i]===1))return 'O chão precisa estar nivelado';}
  if(t.port)return 'O porto precisa da metade direita sobre a água';
  if(t.hydro)return 'A hidrelétrica precisa ficar sobre o rio (2 quadrados de água e 2 de terra)';
  return 'Espaço ocupado';}
const countK=k=>S.b.filter(b=>b.k===k).length;
const countDone=k=>{const now=Date.now();return S.b.filter(b=>b.k===k&&now>=b.d).length;};
const byId=id=>S.b.find(b=>b.i===id);
function decoBonus(b){const t=T[b.k]; if(t.cat!=='res'&&t.cat!=='biz')return 0; const now=Date.now(); let bo=0;
  for(const d of S.b){const dt=T[d.k]; if(!dt.bonus||now<d.d)continue; if(dist(b,d)<=2)bo+=dt.bonus;}
  // calçadas e cercas por perto também enfeitam
  const w=fw(b),h=fh(b); let q=0; for(let y=Math.max(0,(b.y-1)*2);y<Math.min(Q2,(b.y+h+1)*2);y++)for(let x=Math.max(0,(b.x-1)*2);x<Math.min(Q2,(b.x+w+1)*2);x++)if(G.pv[y*Q2+x]||G.fc[y*Q2+x])q++;
  bo+=Math.min(10,Math.floor(q/3));
  if(t.cat==='biz'){let road=false;
    for(let i=0;i<w&&!road;i++)if(isCarRd(b.x+i,b.y-1)||isCarRd(b.x+i,b.y+h))road=true;
    for(let j=0;j<h&&!road;j++)if(isCarRd(b.x-1,b.y+j)||isCarRd(b.x+w,b.y+j))road=true;
    if(road)bo+=10;}
  return Math.min(100,bo);}
const cov=b=>D.cov.get(b.i)||{mask:0,rent:0,xp:0,happy:0,set:0,setN:0};
function happyMult(b){const t=T[b.k],c=CLS[t.cls]; return c.base+c.k*cov(b).happy;}
function rentAmt(b){const t=T[b.k]; const cv2=cov(b); return Math.round(t.rent*(1+(decoBonus(b)+cv2.rent+cv2.set)/100)*happyMult(b)*evMul('rent')*(law('turismo')?.95:1));}
function payAmt(b){const t=T[b.k], cv2=cov(b); let m=1+(decoBonus(b)+cv2.rent+cv2.set)/100; if(t.beds)m+=Math.min(1.5,D.tour/60); return Math.round(t.pay*m*evMul('biz')*(law('feira')?1.1:1));}

