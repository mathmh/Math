/* ================= HUD ================= */
function updateHud(){
  $('#vLvl').textContent=S.lv; const a=cumXp(S.lv),b=cumXp(S.lv+1); $('#vXp').style.width=clamp((S.xp-a)/(b-a)*100,0,100)+'%';
  $('#vCoins').textContent=fmtS(S.coins); $('#vGoods').textContent=fmtS(S.goods); $('#vGoodsC').textContent='de '+fmtS(D.gCap); $('#cGoods').classList.toggle('full',S.goods>=D.gCap);
  $('#vPop').textContent=fmtS(D.pop); $('#vPopC').textContent='de '+fmtS(D.popCap); $('#cPop').classList.toggle('full',D.pop>=D.popCap);
  $('#vWood').textContent=fmtS(S.inv.wood); $('#vStone').textContent=fmtS(S.inv.stone); updateEvent();
  const h=Math.round(D.happy*100); const face=$('#vHappy'); face.style.background=h>=70?'#2fb36a':h>=40?'#f2c230':'#e5484d'; $('#cPop').title='Moradores · felicidade '+h+'%';
  const rc=readyCount(); $('#nAll').hidden=!rc; $('#nAll').textContent=rc>99?'99+':rc;
  const act=activeQuests(); const claim=act.filter(q=>qProg(q)>=q.o.n).length; $('#nQuest').hidden=!claim; $('#nQuest').textContent=claim;
  const pk=$('#peek'); const q=act[0];
  if(!q||mode.t!=='idle'||VIEW){pk.hidden=true;} else {pk.hidden=false; const p=Math.min(qProg(q),q.o.n), done=p>=q.o.n;
    pk.classList.toggle('ready',done); pk.innerHTML='<strong>'+esc(q.title)+'</strong>'+(done?'Toque para resgatar '+fmtN(q.coins)+' moedas':fmtN(p)+' de '+fmtN(q.o.n))+'<div class="pb"><i style="width:'+(p/q.o.n*100)+'%"></i></div>';}}

/* ================= Painéis ================= */
let sheetKind=null, sheetData=null, sheetKey='';
const thumbCache=new Map();
function openSheet(kind,title,html,data){sheetKind=kind;sheetData=data;$('#shTitle').textContent=title;$('#shBody').innerHTML=html;
  $('#sheet').classList.add('open');$('#sheet').setAttribute('aria-hidden','false'); liveTimers(); paintThumbs();}
function closeSheet(){if(!sheetKind)return; sheetKind=null;sheetData=null;$('#sheet').classList.remove('open');$('#sheet').setAttribute('aria-hidden','true'); selId=null;}
$('#shClose').onclick=closeSheet;
function liveTimers(){const now=Date.now(); document.querySelectorAll('[data-end]').forEach(el=>{el.textContent=fmtT((+el.dataset.end-now)/1000);});}
function paintThumbs(){document.querySelectorAll('canvas[data-th]').forEach(cc=>{const k=cc.dataset.th; const c=cc.getContext('2d'); const W=cc.width,H=cc.height; c.clearRect(0,0,W,H);
    if(k.startsWith('tool:')){drawToolIcon(c,k.slice(5),W,H);return;}
    const s=k.startsWith('ob:')?sprite('o',+k.slice(3),0,false):sprite('b',k,T[k]&&T[k].anim?1:0,false); if(!s)return; const w=s.cv.width/s.sx,h=s.cv.height/s.sy; const sc=Math.min((W-8)/w,(H-8)/h,2.2);
    c.drawImage(s.cv,(W-w*sc)/2,(H-h*sc)/2,w*sc,h*sc);});}
let shopCat='res';
function catDesc(k,t){let d='';
  if(t.cat==='res')d='+'+t.pop+' moradores · '+fmtN(t.rent)+' a cada '+fmtT(t.rt);
  else if(t.cat==='biz')d='Usa '+t.sup+' '+(t.item?ITEMS[t.item].ico+' '+ITEMS[t.item].name.toLowerCase():'mercadorias')+' · paga '+fmtN(t.pay)+' em '+fmtT(t.bt)+(t.beds?' · '+t.beds+' leitos (turismo)':'');
  else if(t.cat==='farm')d='Plante aqui para gerar mercadorias';
  else if(t.cat==='fun'||t.cat==='svc'||t.cat==='mon'){const p=[]; if(t.serve)for(const n in t.serve)p.push(NEEDS[NEED_I[n]][1]+' (raio '+t.serve[n]+')'); if(t.cap)p.push('+'+fmtN(t.cap)+' vagas'); if(t.buff){if(t.buff.rent)p.push('+'+t.buff.rent+'% aluguel'); if(t.buff.xp)p.push('+'+t.buff.xp+'% XP');} d=p.join(' · ');}
  else if(t.cat==='ind'){if(t.rec)d=(Object.keys(t.rec.in).length?matTxt(t.rec.in)+' → ':'')+matTxt(t.rec.out)+' a cada '+fmtT(t.rec.t); if(t.hydro)d='Vende energia: '+fmtN(t.pay)+' a cada '+fmtT(t.bt)+' · indústrias 25% mais rápidas · vai sobre o rio';}
  else if(t.cat==='eco')d='Energia limpa: vende '+fmtN(t.pay)+' a cada '+fmtT(t.bt)+' · indústria 5% mais rápida e menos poluição'+(t.place==='morro'?' · vai no alto dos morros':' · vai no deserto');
  else if(k==='aeroporto')d='Muito turismo, aviões pousando e decolando · exporta carga leve (mercadorias, ferramentas, pneus)';
  else if(k==='estacao')d='Importa mercadorias e exporta produtos · precisa de trilho até o túnel';
  else if(k==='porto')d='Exporta por navio (paga mais) · metade sobre a água';
  else if(t.store)d='+'+fmtN(t.store)+' de espaço para mercadorias';
  else if(t.bonus)d='+'+t.bonus+'% de renda para vizinhos';
  if(t.research)d+=' · pesquisa +'+t.research+'/h'; if(t.farmBuff)d+=' · plantações perto +'+t.farmBuff.yield+'%'; if(t.sink||SINK[k])d+=' · limpa o ar'; if(POLL[k])d+=' · polui'; if(t.place==='praia')d+=' · vai na praia'; if(t.rec&&t.place)d+=t.place==='morro'?' · vai nos morros':' · vai no deserto';
  if(t.mon&&t.buff)d+=' · +'+t.buff.rent+'% aluguel por perto'; if(t.set)d+=' · bairro '+SETS[t.set].name; if(t.tour)d+=' · turismo +'+t.tour;
  if(t.time>0)d+=' · obra de '+fmtT(t.time); if(t.max&&countK(k)>=t.max)d='Você já tem um(a)';
  return d;}
function openShop(cat){shopCat=cat||shopCat; let h='<div class="tabs">'+CATS.map(([id,n])=>'<button class="tab'+(id===shopCat?' on':'')+'" data-act="tab" data-c="'+id+'">'+n+'</button>').join('')+'</div><div class="grid">';
  if(false){for(const [k,tl] of Object.entries(TOOLS)){const locked=S.lv<tl.lv;
      h+='<button class="card'+(locked?' locked':'')+'" data-act="tool" data-k="'+k+'"><canvas data-th="tool:'+k+'" width="150" height="104"></canvas><b>'+tl.name+'</b>'+
        (locked?'<span class="lock">Libera no nível '+tl.lv+'</span>':'<span class="price">'+COIN_SVG+(tl.cost?fmtN(tl.cost)+' / quadrado':'grátis')+'</span>')+'<small>'+tl.desc+'</small></button>';}}
  else{const items=Object.entries(T).filter(([k,t])=>t.cat===shopCat&&!t.fixed||(shopCat==='res'&&t.k==='copan'&&false)).sort((a,b)=>a[1].lv-b[1].lv||a[1].cost-b[1].cost);
    if(shopCat==='mon')items.push(['copan',T.copan]);
    for(const [k,t] of items){const lk=buyLock(t), locked=S.lv<t.lv||!!lk, poor=lacks(t).length>0;
      const mat=t.mat?' · <span class="mat">'+matTxt(t.mat)+'</span>':'';
      h+='<button class="card'+(locked?' locked':'')+(poor&&!locked?' poor':'')+'" data-act="buy" data-k="'+k+'"><canvas data-th="'+k+'" width="150" height="120"></canvas><b>'+t.name+'</b>'+
        (t.cls?'<span class="cls" style="background:'+CLS[t.cls].col+'">'+CLS[t.cls].name+'</span>':'')+
        (locked?'<span class="lock">'+(S.lv<t.lv?'Libera no nível '+t.lv:esc(lk))+'</span>':'<span class="price">'+COIN_SVG+fmtN(t.cost)+mat+'</span>')+'<small>'+catDesc(k,t)+'</small></button>';}}
  openSheet('shop','Construir',h+'</div>');}
function needChips(b){const m=cov(b).mask; return '<div class="needs">'+NEEDS.map(([k,n,col],i)=>'<span class="need'+((m>>i)&1?' on':'')+'" style="--c:'+col+'">'+((m>>i)&1?'✓ ':'✗ ')+n+'</span>').join('')+'</div>';}
function infoHtml(b){const t=T[b.k],now=Date.now(); let st='',acts=''; const bo=decoBonus(b), cv2=cov(b);
  if(now<b.d){st='Em obra. Fica pronto em <b data-end="'+b.d+'"></b>.';}
  else if(t.cat==='res'){st=now>=b.a?'Aluguel pronto.':'Próximo aluguel em <b data-end="'+b.a+'"></b>.';
    st+='<br><small>'+CLS[t.cls].name+' · '+t.pop+' moradores · '+fmtN(rentAmt(b))+' moedas a cada '+fmtT(t.rt)+'</small>';
    st+=needChips(b)+setLine(b)+'<small>Felicidade '+Math.round(cv2.happy*100)+'% → aluguel ×'+happyMult(b).toFixed(2)+(bo?' · decoração +'+bo+'%':'')+(cv2.rent?' · serviços +'+cv2.rent+'%':'')+(cv2.xp?' · XP +'+cv2.xp+'%':'')+'</small>';
    if(t.mon)st+='<br><small>Monumento: +'+t.buff.rent+'% de aluguel num raio de '+t.buff.r+'.</small>';
    if(now>=b.a&&!b.fire)acts+='<button class="pill gold" data-act="collect">Coletar '+fmtN(rentAmt(b))+'</button>';}
  else if(t.cat==='biz'){
    if(b.s===0){const nm=t.item?ITEMS[t.item].name.toLowerCase():'mercadorias'; st='Sem estoque. Precisa de '+t.sup+' '+nm+' para abrir.'+(supHave(t)<t.sup?'<br><small>Você tem '+fmtN(supHave(t))+'.</small>':'');
      acts+='<button class="pill go" data-act="supply"'+(supHave(t)<t.sup?' disabled':'')+'>Abastecer ('+t.sup+')</button>';}
    else if(now>=b.a){st='Pronto para coletar.';acts+='<button class="pill gold" data-act="collect">Coletar '+fmtN(payAmt(b))+'</button>';}
    else st='Atendendo clientes. Pronto em <b data-end="'+b.a+'"></b>.';
    st+='<br><small>Paga '+fmtN(payAmt(b))+' moedas por abastecimento'+(bo+cv2.rent+cv2.set?' (bônus de +'+(bo+cv2.rent+cv2.set)+'%)':'')+(t.beds?' · turismo: +'+Math.round(Math.min(150,D.tour/60*100))+'%':'')+' · atende o desejo de Comércio num raio de 5</small>'+setLine(b);}
  else if(b.k==='plot'){const cr=C[b.s]; if(cr)st=(now>=b.a?cr.name+' pronto para colher.':cr.name+' crescendo. Colheita em <b data-end="'+b.a+'"></b>.')+'<br><small>Rende '+cr.g+' mercadorias</small>';
    if(cr&&now>=b.a)acts+='<button class="pill gold" data-act="harvest">Colher</button>';}
  else if(b.k==='estacao'||b.k==='porto'||b.k==='aeroporto'){const v=b.k==='porto'?'O navio':b.k==='aeroporto'?'O avião':'O trem'; if(b.s==='exp'){st=now>=b.a?v+' voltou com '+fmtN(b.trip.pay)+' moedas.':v+' volta em <b data-end="'+b.a+'"></b> com '+fmtN(b.trip.pay)+' moedas.'; if(now>=b.a)acts+='<button class="pill gold" data-act="arrive">Receber</button>';}
    else if(b.s){const tr=TR[b.s]; st=now>=b.a?'O trem chegou com '+tr.g+' mercadorias.':'O trem volta em <b data-end="'+b.a+'"></b> com '+tr.g+' mercadorias.'; if(now>=b.a)acts+='<button class="pill gold" data-act="arrive">Descarregar</button>';}}
  else if(t.rec){const r=b.s==='run'?recOf(b):t.rec; st=(b.s==='run'?(now>=b.a?'Produção pronta!':'Produzindo. Pronto em <b data-end="'+b.a+'"></b>.'):'Parada.')+'<br><small>Receita: '+(Object.keys(r.in).length?matTxt(r.in)+' + ':'')+r.c+' moedas → '+matTxt(r.out)+' em '+fmtT(prodTime(t,r))+(D.hydro?' (hidrelétrica: 25% mais rápido)':'')+(t.rec2?'<br>Com minério: '+matTxt(t.rec2.in)+' → '+matTxt(t.rec2.out)+' (usa sozinho quando tiver)':'')+'</small>';
    if(b.s==='run'&&now>=b.a)acts+='<button class="pill gold" data-act="pcollect">Coletar</button>'; if(!b.s)acts+='<button class="pill go" data-act="pstart"'+(canStart(b)?'':' disabled')+'>Produzir</button>';}
  else if(isGen(t)){st=now>=b.a?'Energia vendida, pronta para coletar.':'Próxima venda de energia em <b data-end="'+b.a+'"></b>.'; st+='<br><small>'+fmtN(t.pay)+' moedas a cada '+fmtT(t.bt)+' · deixa as indústrias 25% mais rápidas</small>'; if(now>=b.a)acts+='<button class="pill gold" data-act="collect">Coletar</button>';}
  else if(t.cat==='fun'||t.cat==='svc'||t.cat==='mon'){st=catDesc(b.k,t).replace(/ · obra de.*$/,'')||'Prédio da cidade.'; if(b.k==='hall'){st='O coração da cidade. Garante '+t.cap+' vagas de moradores e '+t.store+' de estoque.<br><small>Taxa de turismo: '+fmtN(D.tourists)+' turistas → '+fmtN(taxRate()*60)+' moedas por hora (acumula até 6h).</small>'; if(taxAmt()>=1)acts+='<button class="pill gold" data-act="tax">Recolher '+fmtN(taxAmt())+'</button>';}}
  else if(t.store)st='Guarda mais '+fmtN(t.store)+' mercadorias.';
  else if(t.bonus)st='Casas e comércios a até 2 quadrados de distância rendem +'+t.bonus+'%.';
  st+=infoExtraBottom(b);
  if(!t.fixed)acts+='<button class="pill" data-act="move">Mover</button>'+(t.w!==t.h?'<button class="pill" data-act="rotate">Girar</button>':'')+infoCopyBtn(b)+'<button class="pill" data-act="sell">Vender</button>';
  return infoExtraTop(b)+'<p class="status">'+st+'</p><div class="acts">'+acts+'</div>';}
function cropRows(){const empty=S.b.filter(x=>x.k==='plot'&&!x.s&&Date.now()>=x.d).length;
  return '<div class="rows">'+Object.entries(C).map(([k,c])=>{const lock=S.lv<c.lv;
    return '<div class="row'+(lock?' locked':'')+'"><span class="dot" style="background:'+c.col+'"></span><div class="info"><b>'+c.name+'</b><small>'+
      (lock?'Libera no nível '+c.lv:fmtN(c.cost)+' moedas · '+c.g+' mercadorias · '+fmtT(c.t))+'</small></div>'+
      (lock?'':'<button class="pill go" data-act="plant" data-c="'+k+'">Plantar</button>'+(empty>1?'<button class="pill" data-act="plantall" data-c="'+k+'">Todos ('+empty+')</button>':''))+'</div>';}).join('')+'</div>';}
function trainRows(){return '<div class="rows">'+Object.entries(TR).map(([k,tr])=>{const lock=S.lv<tr.lv;
  return '<div class="row'+(lock?' locked':'')+'"><span class="dot" style="background:#2f6690"></span><div class="info"><b>'+tr.name+'</b><small>'+
    (lock?'Libera no nível '+tr.lv:fmtN(tr.cost)+' moedas · traz '+fmtN(tr.g)+' mercadorias · '+fmtT(tr.t))+'</small></div>'+
    (lock?'':'<button class="pill go" data-act="train" data-c="'+k+'">Enviar</button>')+'</div>';}).join('')+'</div>';}
function infoKey(b){const t=T[b.k],now=Date.now();return [now<b.d,b.s,now>=b.a,t.sup?S.goods>=t.sup:0,b.x,b.y,b.f,cov(b).mask].join('|');}
function openInfo(b){const now=Date.now(); let html; const mv='<div class="acts"><button class="pill" data-act="move">Mover</button><button class="pill" data-act="sell">Vender</button></div>';
  if(b.k==='plot'&&!b.s&&now>=b.d)html='<p class="status">Escolha o que plantar.</p>'+cropRows()+mv;
  else if(b.k==='estacao'&&!b.s&&now>=b.d)html=(D.linked.has(b.i)?'<p class="status">Importe mercadorias ou exporte produtos. O trem sai pelo túnel e volta.</p><h4 class="sub">Importar</h4>'+trainRows()+'<h4 class="sub">Exportar</h4>'+expRows(false):'<p class="status">A estação ainda não está ligada ao túnel.<br><small>Use <b>Ruas → Trilho</b> e ligue um trilho encostado na estação até o túnel na borda do mapa (a oeste, nas montanhas).</small></p>')+mv;
  else if(b.k==='porto'&&!b.s&&now>=b.d)html='<p class="status">Exporte por navio: paga 70% acima do valor e sempre traz um item de coleção.</p>'+expRows(true)+mv;
  else if(b.k==='aeroporto'&&!b.s&&now>=b.d)html='<p class="status">Exporte carga leve de avião: chega rápido e paga bem. Os turistas chegam sozinhos.</p>'+expRows('air')+mv;
  else html=infoHtml(b);
  if(html.indexOf('data-a4="putout"')<0&&(b.fire||S.req.some(r=>r.b===b.i))&&!html.startsWith(infoExtraTop(b)))html=infoExtraTop(b)+html;
  sheetKey=infoKey(b); openSheet('info',T[b.k].name,html,{id:b.i});}
let questHtml='';
function openQuests(soft){const act=activeQuests(); let h='';
  if(!act.length)h='<p class="status">Você concluiu todas as missões. A cidade é sua: continue crescendo do seu jeito.</p>';
  for(const q of act){const p=Math.min(qProg(q),q.o.n),done=p>=q.o.n;
    h+='<div class="q"><div class="info"><b>'+esc(q.title)+'</b><small>Prêmio: '+fmtN(q.coins)+' moedas'+(q.xp?' · '+q.xp+' XP':'')+'</small><div class="pb"><i style="width:'+(p/q.o.n*100)+'%"></i></div></div>'+
      (done?'<button class="pill gold" data-act="claim" data-c="'+q.id+'">Resgatar</button>':'<span class="muted">'+fmtN(p)+'/'+fmtN(q.o.n)+'</span>')+'</div>';}
  h+='<p class="muted">'+S.q.done.length+' de '+Q.length+' missões concluídas</p>'+chainsHtml();
  if(soft&&h===questHtml)return; questHtml=h; openSheet('quests','Missões',h);}
function openMenu(){const cyc=[['auto','Automático'],['day','Sempre dia'],['night','Sempre noite']];
  const h='<div class="help"><p><b>Casas</b> trazem moradores e pagam aluguel. Cada classe (baixa, média, alta) depende da felicidade: moradores querem <b>comércio, saúde, educação, diversão e fé</b> por perto. Quanto mais desejos atendidos, maior o aluguel.</p>'+
  '<p><b>Comércios</b> precisam de mercadorias, que vêm das plantações e do trem. <b>Serviços</b> abrem vagas de moradores e atendem desejos num raio. <b>Monumentos</b> pedem madeira e pedra, que saem dos obstáculos.</p>'+
  '<p>Os botões redondos da direita abrem os pincéis: <b>Ruas</b> (rua, ponte, trilho), <b>Terreno</b> (elevar, rampa, água, tipo de chão) e <b>Decoração</b> (calçadas e muros). Arraste para pintar; dois dedos ou o botão direito do mouse movem o mapa.</p>'+
  '<p><b>Indústria</b> transforma madeira, pedra, aço e borracha em ferramentas, pneus e carros, que vendem em lojas e são pedidos em prédios grandes. O <b>trem</b> só funciona com trilho até o túnel, a oeste.</p>'+
  '<p>Toque em árvores, pedras e arbustos para limpar. Na hora de construir, <b>Girar</b> (ou a tecla R) vira o prédio, <b>Em linha</b> constrói vários enfeites seguidos e <b>Copiar</b> (no painel do prédio) repete o mesmo prédio. Nos pincéis, <b>Desfazer</b> volta a última pincelada.</p>'+
  '<p><b>Cidade</b> traz pedidos dos moradores, leis, pesquisa do Campus e gráficos. <b>Poluição</b> vem da indústria, do trânsito e do porto; parques, árvores, leis e educação limpam. Fora da área dos bombeiros podem acontecer incêndios leves.</p></div>'+
  '<h4 class="sub">Dia e noite</h4><div class="seg">'+cyc.map(([k,n])=>'<button class="tab'+(OPT.cycle===k?' on':'')+'" data-act="cycle" data-c="'+k+'">'+n+'</button>').join('')+'</div>'+
  '<h4 class="sub">Cidade</h4><div class="acts" style="margin-bottom:12px"><button class="pill" data-a4="rename">Nome: '+esc(S.name)+'</button></div>'+
  '<h4 class="sub">Clima</h4><div class="seg">'+[['auto','Automático'],['sol','Sempre sol'],['chuva','Sempre chuva']].map(([k,n])=>'<button class="tab'+((OPT.wx||'auto')===k?' on':'')+'" data-a4="opt" data-c="wx:'+k+'">'+n+'</button>').join('')+'</div>'+
  '<h4 class="sub">Desenho</h4><div class="seg">'+[['auto','WebGL (PixiJS)'],['canvas','Canvas (reserva)']].map(([k,n])=>'<button class="tab'+((OPT.renderer||'auto')===k?' on':'')+'" data-a4="opt" data-c="renderer:'+k+'">'+n+'</button>').join('')+'</div>'+
  '<div class="seg">'+[['auto','Qualidade automática'],['eco','Econômico'],['alto','Alta']].map(([k,n])=>'<button class="tab'+((OPT.qual||'auto')===k?' on':'')+'" data-a4="opt" data-c="qual:'+k+'">'+n+'</button>').join('')+'</div>'+
  '<p class="muted" style="margin:-4px 0 8px">Agora: '+BK.name+(QUAL.eco?' · modo econômico (resolução menor, 30 quadros/s, menos gente com zoom longe)':'')+'. <button class="pill" data-a4="perf" style="padding:3px 9px 1px;font-size:12px">'+(PERF.on?'Esconder':'Mostrar')+' medidor</button></p>'+
  '<h4 class="sub">Backup</h4><div class="acts" style="margin-bottom:14px"><button class="pill go" data-a4="backup">Baixar backup</button><button class="pill" data-a4="restore">Restaurar de arquivo</button></div>'+
  '<h4 class="sub">Imagens dos prédios</h4><p class="muted" style="margin:0 0 8px">Teste e aplique as imagens geradas por IA no lugar dos desenhos.</p><div class="acts" style="margin-bottom:14px"><button class="pill go" data-act="art">Abrir oficina de imagens</button></div>'+
  '<p class="muted">Progresso salvo em '+saveWhere+'.</p><div class="acts"><button class="pill warn" data-act="reset">Recomeçar do zero</button></div>';
  openSheet('menu','Menu',h);}
$('#shBody').addEventListener('click',e=>{const el=e.target.closest('[data-act]'); if(!el||el.disabled)return; const act=el.dataset.act;
  const b=sheetData&&sheetData.id!=null?byId(sheetData.id):null;
  switch(act){
    case 'tab':openShop(el.dataset.c);break;
    case 'tool':{const tl=TOOLS[el.dataset.k]; if(S.lv<tl.lv){toast('Libera no nível '+tl.lv);return;} setMode({t:'paint',tool:el.dataset.k,count:0});break;}
    case 'buy':{if(!canBuy(el.dataset.k))return; setMode({t:'place',k:el.dataset.k,has:false,f:0});break;}
    case 'collect':if(b){collect(b);after();closeSheet();}break;
    case 'supply':if(b){if(supply(b))after();openInfo(b);}break;
    case 'harvest':if(b){harvest(b);after();closeSheet();}break;
    case 'plant':if(b&&plant(b,el.dataset.c)){after();closeSheet();}break;
    case 'plantall':{let n=0; for(const p of S.b){if(p.k==='plot'&&!p.s&&Date.now()>=p.d){if(!plant(p,el.dataset.c))break;n++;}} if(n){toast(n+' terreno'+(n>1?'s':'')+' plantado'+(n>1?'s':''));after();closeSheet();}break;}
    case 'train':if(b)sendTrain(b,el.dataset.c);break;
    case 'exp':if(b)sendExport(b,el.dataset.c);break;
    case 'arrive':if(b){trainArrive(b);after();closeSheet();}break;
    case 'pstart':if(b){startProd(b);after();openInfo(b);}break;
    case 'pcollect':if(b){collectProd(b);startProd(b,true);after();openInfo(b);}break;
    case 'tax':collectTax();after();closeSheet();break;
    case 'move':if(b)setMode({t:'move',i:b.i,has:false,f:b.f});break;
    case 'rotate':if(b){if(canPlace(b.k,b.x,b.y,b.f?0:1,S.b.indexOf(b))){b.f=b.f?0:1; bounce.set(b.i,Date.now()); after(); openInfo(b);} else toast('Não cabe girado aqui. Use Mover e gire na hora de posicionar.');}break;
    case 'sell':if(b)confirmBox('Vender '+T[b.k].name+'?','Você recebe '+fmtN(Math.floor(T[b.k].cost/2))+' moedas de volta.','Vender',()=>sellB(b));break;
    case 'claim':claimQuest(el.dataset.c);break;
    case 'cycle':OPT.cycle=el.dataset.c; try{localStorage.setItem(OPT_KEY,JSON.stringify(OPT));}catch(e){} openMenu();break;
    case 'art':openArt();break;
    case 'reset':confirmBox('Recomeçar do zero?','Sua cidade atual será apagada.','Recomeçar',()=>{S=newGame();cars=[];mapVer++;afterLoad();saveNow();});break;}});
function askExpand(cx,cy){const cost=chunkCost(cx,cy),pop=expPop(S.st.expand);
  confirmBox('Comprar esta área?','Custa '+fmtN(cost)+' moedas e precisa de '+fmtN(pop)+' moradores. Você tem '+fmtN(S.coins)+' moedas e '+fmtN(D.pop)+' moradores.','Comprar',()=>buyChunk(cx,cy),D.pop<pop||S.coins<cost);}

/* ================= Oficina de imagens ================= */
let artSel='casinha', artNight=false, artFlip=false, artSaveT=0;
function artItems(){const out=[]; for(const [k,t] of Object.entries(T))if(t.art)out.push({id:'b:'+k,slug:t.slug,name:t.name,group:CATS.find(c=>c[0]===t.cat)?.[1]||'Outros',kind:(t.w*t.h===1)?'free':'lot',dims:t});
  for(const n in OB)out.push({id:'o:'+n,slug:OB[n].slug,name:OB[n].name,group:'Obstáculos',kind:'free',dims:{w:1,h:1,vw:n==3?50:n==4?40:60}});
  for(const m of CARS)for(const side of ['frente','traseira'])out.push({id:'c:'+m.id+':'+side,slug:'carro-'+m.id+'-'+side,name:m.name+' ('+side+')',group:'Veículos',kind:'car',dims:{vw:m.bus?62:36}});
  return out;}
function openArt(){const items=artItems(); const groups={}; for(const it of items)(groups[it.group]=groups[it.group]||[]).push(it);
  if(!items.find(i=>i.id===artSel||i.id==='b:'+artSel))artSel='b:casinha'; if(!artSel.includes(':'))artSel='b:'+artSel;
  const it=items.find(i=>i.id===artSel); const m=ARTMAP[it.slug]||{}; const a=m.adj||{};
  const where=assetsNS?'na sua conta (arquivos do artifact)':'só neste navegador';
  let h='<label class="fld">Item<select id="artSel">'+Object.entries(groups).map(([g,l])=>'<optgroup label="'+esc(g)+'">'+l.map(i=>'<option value="'+i.id+'"'+(i.id===artSel?' selected':'')+'>'+esc(i.name)+(ARTMAP[i.slug]?' ●':'')+'</option>').join('')+'</optgroup>').join('')+'</select></label>'+
    '<canvas id="artPrev" width="340" height="240"></canvas>'+
    '<p class="muted" style="margin:4px 0 10px">Arquivos: <code>'+it.slug+'.png</code> e <code>'+it.slug+'-noite.png</code> · imagens ficam salvas '+where+'.</p>'+
    '<div class="acts" style="margin-bottom:10px"><label class="pill go up">Imagem do dia<input type="file" accept="image/png,image/webp" id="upD" hidden></label><label class="pill up">Imagem da noite<input type="file" accept="image/png,image/webp" id="upN" hidden></label>'+(ARTMAP[it.slug]?'<button class="pill warn" data-act2="artdel">Voltar ao desenho</button>':'')+'</div>'+
    '<div class="seg" style="margin-bottom:8px"><button class="tab'+(artNight?'':' on')+'" data-act2="pday">Dia</button><button class="tab'+(artNight?' on':'')+'" data-act2="pnight">Noite</button><button class="tab'+(artFlip?' on':'')+'" data-act2="pflip">Espelhado</button></div>'+
    (ARTMAP[it.slug]&&ARTMAP[it.slug].d?['k:Tamanho:80:120:'+Math.round((a.k||1)*100),'vy:Altura:85:115:'+Math.round((a.vy||1)*100),'dx:Mover ↔:-30:30:'+(a.dx||0),'dy:Mover ↕:-30:30:'+(a.dy||0)].map(s=>{const [k,n,mi,ma,v]=s.split(':');
      return '<label class="sl"><span>'+n+'</span><input type="range" min="'+mi+'" max="'+ma+'" value="'+v+'" data-adj="'+k+'"><em>'+v+'</em></label>';}).join(''):'<p class="muted">Sem imagem: o jogo usa o desenho em código. Envie um PNG com fundo transparente.</p>')+
    '<p class="muted" id="artNote" style="margin-top:6px">'+(m.note?esc(m.note):'')+'</p>';
  openSheet('art','Oficina de imagens',h);
  $('#artSel').onchange=e=>{artSel=e.target.value;openArt();};
  $('#upD').onchange=e=>uploadArt(it,'d',e.target.files[0]); $('#upN').onchange=e=>uploadArt(it,'n',e.target.files[0]);
  document.querySelectorAll('[data-adj]').forEach(inp=>inp.oninput=()=>{const k=inp.dataset.adj; let v=+inp.value; inp.nextElementSibling.textContent=v; if(k==='k'||k==='vy')v/=100;
    const mm=ARTMAP[it.slug]; mm.adj=mm.adj||{}; mm.adj[k]=v; mm.t=Date.now(); if(IMG[it.slug])IMG[it.slug].adj=mm.adj; drawArtPreview(); clearTimeout(artSaveT); artSaveT=setTimeout(pushArt,600);});
  $('#shBody').querySelectorAll('[data-act2]').forEach(bt=>bt.onclick=()=>{const a2=bt.dataset.act2; if(a2==='pday')artNight=false; if(a2==='pnight')artNight=true; if(a2==='pflip')artFlip=!artFlip;
    if(a2==='artdel'){delete ARTMAP[it.slug]; pushArt(); applyArt(it.slug);} openArt();});
  drawArtPreview();}
async function uploadArt(it,side,file){if(!file)return; const nt=()=>$('#artNote')||{}; nt().textContent='Processando a imagem…';
  try{const im=await loadImgFile(file); const r=analyzeImage(im,it.kind,it.dims); const blob=await new Promise(res=>r.cv.toBlob(res,'image/png'));
    let u; if(assetsNS){try{const up=await assetsNS.upload(blob,{type:'image/png'}); u='a:'+up.id;}catch(e){u=null;}}
    if(!u){const key=it.slug+':'+side+':'+Date.now(); await IDB.put(key,blob); u='idb:'+key;}
    const m=ARTMAP[it.slug]||(ARTMAP[it.slug]={adj:{}}); m[side]={u,ax:Math.round(r.ax*10)/10,ay:Math.round(r.ay*10)/10}; if(side==='d')m.note=r.note||(r.vy!==1?'Ângulo normalizado em '+Math.round((r.vy-1)*100)+'% na vertical.':'');
    m.t=Date.now(); pushArt(); await applyArt(it.slug); toast('Imagem aplicada: '+it.name); if(sheetKind==='art')openArt();}
  catch(e){nt().textContent='Não consegui ler essa imagem. Confira se é PNG com fundo transparente.';}}
function drawArtPreview(){const cc=$('#artPrev'); if(!cc)return; const c=cc.getContext('2d'); const W=cc.width,H=cc.height; c.clearRect(0,0,W,H);
  const items=artItems(); const it=items.find(i=>i.id===artSel); if(!it)return; const [kind,key]=it.id.split(':');
  c.fillStyle=artNight?'#1d2a3a':'#6f9a58'; c.fillRect(0,0,W,H);
  let s,dims={w:1,h:1}; if(kind==='b'){dims=T[key];} 
  const w=artFlip?dims.h:dims.w,h=artFlip?dims.w:dims.h; const tops=kind==='b'?spriteTop('b',key,0):60; const span=(w+h)*32, sc=Math.min((W-30)/span,(H-20)/(tops+(w+h)*16),1.6);
  c.save(); c.translate(W/2-(w-h)*16*sc,H-12-(w+h)*16*sc); c.scale(sc,sc);
  c.strokeStyle='rgba(255,255,255,.5)';c.lineWidth=1/sc; for(let i=0;i<=w;i++){const a=P(i,0),b=P(i,h);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();} for(let j=0;j<=h;j++){const a=P(0,j),b=P(w,j);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();}
  if(kind==='b')s=sprite('b',key,0,artNight); else if(kind==='o')s=sprite('o',+key,0,artNight); else s=imgSprite(it.slug,artNight);
  if(s){if(kind==='c'){const [X,Y]=P(.5,.5);drawSprite(c,s,X,Y,artFlip);} else drawSprite(c,s,0,0,artFlip);}
  c.setLineDash([4/sc,4/sc]); c.strokeStyle='rgba(255,255,255,.9)'; c.lineWidth=1.4/sc; c.beginPath(); for(const p of [P(0,0),P(w,0),P(w,h),P(0,h),P(0,0)])c.lineTo(p[0],p[1]); c.stroke(); c.setLineDash([]);
  if(!s&&kind==='c'){c.fillStyle='rgba(255,255,255,.7)';c.font='14px sans-serif';c.textAlign='center';c.fillText('Carro em código (sem imagem)',(w-h)*16,30);}
  c.restore();}

/* ================= Modal e avisos ================= */
function confirmBox(title,text,okLabel,fn,disabled){const m=$('#mcard');
  m.innerHTML='<h3>'+esc(title)+'</h3><p>'+esc(text)+'</p><div class="acts"><button class="pill" id="mNo">Cancelar</button><button class="pill go" id="mOk"'+(disabled?' disabled':'')+'>'+esc(okLabel)+'</button></div>';
  $('#modal').hidden=false; $('#mNo').onclick=closeModal; $('#mOk').onclick=()=>{closeModal();fn();}; $('#mOk').focus();}
function closeModal(){$('#modal').hidden=true; if(titleQueue.length)showTitle(); else if(levelQueue.length)showLevelUp();}
function showLevelUp(){const L=levelQueue.shift(); if(L==null)return;
  const un=[...Object.values(T).filter(t=>t.lv===L).map(t=>t.name),...Object.values(TOOLS).filter(t=>t.lv===L).map(t=>t.name),...Object.values(C).filter(c=>c.lv===L).map(c=>c.name),...Object.values(TR).filter(t=>t.lv===L).map(t=>t.name)];
  $('#mcard').innerHTML='<div class="bigstar"><svg viewBox="0 0 32 32"><path d="M16 2.5l4.1 8.6 9.4 1.2-6.9 6.5 1.8 9.3L16 23.6l-8.4 4.5 1.8-9.3-6.9-6.5 9.4-1.2z" fill="#ffc43d" stroke="#c98f00" stroke-width="1.6" stroke-linejoin="round"/></svg><b>'+L+'</b></div>'+
    '<h3>Nível '+L+'</h3><p>Você ganhou '+fmtN(L*50)+' moedas.'+(un.length?' Agora dá para construir:':'')+'</p>'+(un.length?'<div class="unl">'+un.map(n=>'<span>'+esc(n)+'</span>').join('')+'</div>':'')+
    '<div class="acts"><button class="pill gold" id="mOk">Continuar</button></div>';
  $('#modal').hidden=false; $('#mOk').onclick=closeModal; $('#mOk').focus(); if(sheetKind==='shop')openShop();}
function showMigrated(){if(!migratedMsg&&migratedMsg!==0)return; const m=$('#mcard');
  m.innerHTML='<h3>Mapa novo!</h3><p>A Cidade Viva ganhou um mapa maior, com rio, lago e mar. Seu nível, XP e moedas foram mantidos'+(migratedMsg?' e as construções antigas viraram '+fmtN(migratedMsg)+' moedas de volta':'')+'.</p><div class="acts"><button class="pill gold" id="mOk">Bora construir</button></div>';
  $('#modal').hidden=false; $('#mOk').onclick=closeModal; migratedMsg=null;}
function toast(msg){const el=document.createElement('div'); el.className='toast'; el.textContent=msg; const box=$('#toasts'); box.appendChild(el);
  while(box.children.length>3)box.firstChild.remove(); setTimeout(()=>el.remove(),2600);}
const COIN_SVG='<svg viewBox="0 0 32 32"><defs><radialGradient id="cg" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff3b0"/><stop offset="1" stop-color="#f5b400"/></radialGradient></defs><circle cx="16" cy="16" r="13" fill="url(#cg)" stroke="#c98f00" stroke-width="2.5"/><text x="16" y="21.5" text-anchor="middle" font-size="15" font-weight="800" fill="#c98f00" font-family="sans-serif">$</text></svg>';

/* ================= Botões e ciclo ================= */
$('#bShop').onclick=()=>{if(sheetKind==='shop')closeSheet(); else openShop();};
$('#bAll').onclick=collectAll;
$('#bQuest').onclick=()=>{if(sheetKind==='quests')closeSheet(); else openQuests();};
$('#peek').onclick=()=>{const q=activeQuests()[0]; if(q&&qProg(q)>=q.o.n)claimQuest(q.id); else openQuests();};
if($('#bExp'))$('#bExp').onclick=()=>{if(!S.ul.some((v,i)=>!v&&chunkBuyable(i%NC,Math.floor(i/NC)))){toast('O mapa inteiro já é seu');return;} setMode({t:'expand'});};
$('#bMenu').onclick=()=>{if(sheetKind==='menu')closeSheet(); else openMenu();};
$('#hLvl').onclick=()=>{toast('Nível '+S.lv+' · faltam '+fmtN(cumXp(S.lv+1)-S.xp)+' XP para o próximo');};

function resize(){const r=$('#app').getBoundingClientRect(); VW=r.width; VH=r.height; DPR=Math.min(QUAL.dprCap,window.devicePixelRatio||1); cv.width=Math.round(VW*DPR); cv.height=Math.round(VH*DPR); BK.resize();}
function centerStart(){const [x,y]=P(44,41); cam.x=x; cam.y=y; cam.z=clamp(Math.min(VW/520,VH/440),.6,1.5); clampCam();}
function afterLoad(){derive(); refreshQuests(); closeSheet(); setMode({t:'idle'}); centerStart(); updateHud();}
setInterval(()=>{if(!S)return; systemsTick(Date.now()); derive(); updateHud(); updateWx();
  if(sheetKind==='info'&&sheetData){const b=byId(sheetData.id); if(!b)closeSheet(); else if(infoKey(b)!==sheetKey)openInfo(b); else liveTimers();}
  if(sheetKind==='quests')openQuests(true); if(sheetKind==='city'||sheetKind==='bridge')liveTimers();},1000);
setInterval(()=>{if(dirtySave)saveNow();},4000);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&S)saveNow();});
window.addEventListener('pagehide',()=>{if(S)saveNow();});
window.addEventListener('resize',()=>{resize();clampCam();});

