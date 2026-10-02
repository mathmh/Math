/* ================= Painel da Cidade ================= */
let cityTab='resumo', cityHtml='';
const CTABS=[['resumo','Resumo'],['estoque','Estoque'],['ordens','Encomendas'],['desafios','Desafios'],['colecoes','Coleções'],['bairros','Bairros']];
function cityBadge(){let n=0; for(const o of S.ord)if(o&&!lacksMat(o.items).length)n++; if(S.ch){S.ch.dl.forEach((id,i)=>{if(!S.ch.dc[i]){const c=chInfo(id,0); if(c.p>=c.n)n++;}}); S.ch.wl.forEach((id,i)=>{if(!S.ch.wc[i]){const c=chInfo(id,1); if(c.p>=c.n)n++;}});}
  for(const id in COLS)if(colDone(id))n++; for(const r of S.req)if(reqCheck(r)===true)n++; for(const t of TECH)if(techState(t)==='pronta')n++; return n;}
function openCity(tab,soft){if(tab)cityTab=tab; refreshOrders(); refreshCh(); const now=Date.now(); let h='<div class="tabs">'+CTABS.map(([k,n])=>'<button class="tab'+(k===cityTab?' on':'')+'" data-a3="ctab" data-c="'+k+'">'+n+'</button>').join('')+'</div>';
  if(['pedidos','leis','pesquisa','graficos','moradores'].includes(cityTab))h+=cityTabNew(cityTab);
  else if(cityTab==='resumo'){const ti=TITLES[S.title], nx=TITLES[S.title+1]; const ev=curEvent(now), ne=nextEvent(now), W=weatherNow(now), ps=D.pollSrc||{};
    h+='<div class="title-card"><small>'+esc(S.name)+' · título da cidade</small><b>'+ti[1]+'</b>'+(nx?'<div class="pb"><i style="width:'+clamp((D.pop-ti[0])/(nx[0]-ti[0])*100,0,100)+'%"></i></div><small>'+fmtN(D.pop)+' de '+fmtN(nx[0])+' moradores para '+nx[1]+' (prêmio de '+fmtN(nx[2])+' moedas)</small>':'<small>Título máximo!</small>')+'</div>'+
      '<div class="stats"><div><b>'+fmtN(D.pop)+'</b><small>moradores</small></div><div><b>'+Math.round(D.happy*100)+'%</b><small>felicidade</small></div><div><b>'+fmtN(D.tour)+'</b><small>pontos de turismo</small></div><div><b>'+fmtN(D.tourists)+'</b><small>turistas</small></div></div>'+
      '<div class="stats"><div><b>'+Math.round(D.pollAvg||0)+'</b><small>poluição</small></div><div><b>'+Math.round((D.health||1)*100)+'%</b><small>saúde</small></div><div><b>'+Math.round((D.edu||0)*100)+'%</b><small>educação</small></div><div><b>'+W.ico+'</b><small>'+W.name+'</small></div></div>'+
      '<p class="status"><small><b>Poluição:</b> indústria '+fmtN(ps.ind||0)+' · trânsito '+fmtN(ps.traf||0)+' · porto/aeroporto '+fmtN(ps.port||0)+' · limpeza de parques e árvores −'+fmtN(ps.sink||0)+(ps.clean?' · '+ps.clean+' usina(s) limpa(s)':'')+'. Uma população mais instruída polui menos ('+(ps.edu||0)+'% atendida por educação). Acima de 25, a felicidade cai um pouco. Veja em Visão → Poluição.</small></p>'+
      '<p class="status"><small><b>Clima:</b> '+W.name+(W.k===2?' — plantações crescem 50% mais rápido, menos turistas e sem incêndios':W.k===0?' — turismo um pouco maior':'')+'. Muda em <b data-end="'+W.end+'"></b>.</small></p>'+
      '<p class="status"><small><b>Turismo:</b> monumentos, lazer, praia, porto e trem atraem turistas. Eles pagam uma taxa que acumula na Prefeitura ('+fmtN(taxRate()*60)+' moedas/h) e aumentam o que hotéis e resorts pagam ('+fmtN(D.beds)+' leitos).</small></p>'+
      '<p class="status"><small><b>Evento:</b> '+(ev?ev.name+' — '+ev.desc+' · termina em <b data-end="'+ev.end+'"></b>':'nenhum agora. Próximo: '+ne.name+' em <b data-end="'+ne.start+'"></b>')+'</small></p>';}
  else if(cityTab==='estoque'){h+='<div class="inv">'+['goods',...MATS].map(k=>'<div><span>'+ITEMS[k].ico+'</span><b>'+fmtN(k==='goods'?S.goods:S.inv[k])+'</b><small>'+ITEMS[k].name+'</small></div>').join('')+'</div><p class="muted">Madeira e pedra também saem dos obstáculos. Aço, borracha, ferramentas, pneus e carros vêm da Indústria.</p>';}
  else if(cityTab==='ordens'){h+='<p class="muted" style="margin-top:0">Pedidos de outras cidades. Entregue para ganhar moedas e XP.</p>';
    for(let i=0;i<3;i++){const o=S.ord[i]; if(!o){h+='<div class="q"><div class="info"><b>Nova encomenda chegando</b><small>em <b data-end="'+(S.ordT[i]||now)+'"></b></small></div></div>';continue;}
      const ok=!lacksMat(o.items).length; h+='<div class="q"><div class="info"><b>'+Object.entries(o.items).map(([k,v])=>{const have=k==='goods'?S.goods:S.inv[k]; return '<span class="'+(have>=v?'ok':'no')+'">'+ITEMS[k].ico+' '+fmtN(Math.min(have,v))+'/'+fmtN(v)+'</span>';}).join(' ')+'</b><small>Prêmio: '+fmtN(o.coins)+' moedas · '+o.xp+' XP</small></div>'+
        '<button class="pill gold" data-a3="deliver" data-c="'+i+'"'+(ok?'':' disabled')+'>Entregar</button><button class="pill" data-a3="skip" data-c="'+i+'">Trocar</button></div>';}}
  else if(cityTab==='desafios'){const row=(id,i,week)=>{const c=chInfo(id,week), done=(week?S.ch.wc:S.ch.dc)[i];
      return '<div class="q"><div class="info"><b>'+c.title+'</b><small>'+fmtN(c.coins)+' moedas · '+c.xp+' XP</small><div class="pb"><i style="width:'+(c.p/c.n*100)+'%"></i></div></div>'+(done?'<span class="muted">feito ✓</span>':c.p>=c.n?'<button class="pill gold" data-a3="ch" data-c="'+i+'" data-w="'+(week?1:0)+'">Resgatar</button>':'<span class="muted">'+fmtN(Math.max(0,c.p))+'/'+fmtN(c.n)+'</span>')+'</div>';};
    const di=dayIdx(now), endDay=(di+1)*864e5+new Date().getTimezoneOffset()*60000, endWeek=(Math.floor((di+3)/7)*7+4)*864e5+new Date().getTimezoneOffset()*60000;
    h+='<h4 class="sub">Hoje · renova em <span data-end="'+endDay+'"></span></h4>'+S.ch.dl.map((id,i)=>row(id,i,0)).join('')+
      '<h4 class="sub">Semana · renova em <span data-end="'+endWeek+'"></span></h4>'+S.ch.wl.map((id,i)=>row(id,i,1)).join('')+'<p class="muted">Completando os 3 semanais: bônus extra e 5 ferramentas.</p>';}
  else if(cityTab==='colecoes'){for(const id in COLS){const c=COLS[id], a=S.col[id]||c.items.map(()=>0);
      h+='<div class="col"><div class="colh"><b>'+c.name+'</b><small>'+c.src+' · troca por '+fmtN(c.coins)+' moedas e '+c.xp+' XP</small></div><div class="colit">'+c.items.map((n,i)=>'<span class="'+(a[i]?'got':'')+'">'+esc(n)+(a[i]>1?' ×'+a[i]:'')+'</span>').join('')+'</div>'+
        (colDone(id)?'<button class="pill gold" data-a3="col" data-c="'+id+'">Trocar coleção</button>':'')+'</div>';}}
  else if(cityTab==='bairros'){h+='<p class="muted" style="margin-top:0">Construa prédios do mesmo bairro perto uns dos outros (até 5 quadrados): 3 tipos dão +10% de renda, 4 tipos +20%, o bairro completo +30%.</p>';
    for(const id in SETS){const st=SETS[id]; let best=0; for(const b of S.b)if(T[b.k].set===id)best=Math.max(best,cov(b).setN||1);
      h+='<div class="col"><div class="colh"><b>'+st.name+'</b><small>Melhor grupo: '+best+' de '+st.keys.length+' tipos</small></div><div class="colit">'+st.keys.map(k=>'<span class="'+(countDone(k)?'got':'')+'">'+esc(T[k].name)+'</span>').join('')+'</div></div>';}}
  if(soft&&h===cityHtml)return; cityHtml=h; openSheet('city',S.name||'Cidade',h); if(cityTab==='graficos')drawCharts();}
$('#shBody').addEventListener('click',e=>{const el=e.target.closest('[data-a3]'); if(!el||el.disabled)return; const a=el.dataset.a3, c=el.dataset.c;
  if(a==='ctab')openCity(c); else if(a==='deliver'){deliverOrder(+c); openCity();} else if(a==='skip'){skipOrder(+c); openCity();}
  else if(a==='ch'){claimCh(+c,el.dataset.w==='1'); openCity();} else if(a==='col'){tradeCol(c); openCity();}
  else if(a==='bridge'){rebuildBridge(sheetData.bx,sheetData.by,+c); openBridge(sheetData.bx,sheetData.by);}});
$('#bCity').onclick=()=>{if(sheetKind==='city')closeSheet(); else openCity();};
$('#cMat').onclick=()=>openCity('estoque');

/* ================= Evento, títulos e aviso de versão ================= */
function updateEvent(){const e=curEvent(), el=$('#evBan'); if(!e){el.hidden=true;return;} el.hidden=false; el.innerHTML='<b>'+e.name+':</b> '+e.desc+' · '+fmtT((e.end-Date.now())/1000);
  const n=cityBadge(); $('#nCity').hidden=!n; $('#nCity').textContent=n;}
function showTitle(){const k=titleQueue.shift(); if(k==null)return; const t=TITLES[k];
  $('#mcard').innerHTML='<h3>Agora você é '+t[1]+'!</h3><p>A cidade passou de '+fmtN(t[0])+' moradores. Prêmio de '+fmtN(t[2])+' moedas.</p><div class="acts"><button class="pill gold" id="mOk">Bora crescer</button></div>';
  $('#modal').hidden=false; $('#mOk').onclick=()=>{$('#modal').hidden=true; if(titleQueue.length)showTitle(); else if(levelQueue.length)showLevelUp();};}
