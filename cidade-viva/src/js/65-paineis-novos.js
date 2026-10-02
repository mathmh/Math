/* ================= Interface das funções novas =================
 Abas novas no painel Cidade (Pedidos, Leis, Pesquisa, Gráficos, Moradores), cadeias em Missões,
 opções no Menu, desfazer nos pincéis, construir em linha, copiar prédio e backup em arquivo. */

/* ---- Painel Cidade: abas novas ---- */
CTABS.splice(1,0,['pedidos','Pedidos'],['leis','Leis'],['pesquisa','Pesquisa'],['graficos','Gráficos']);
CTABS.push(['moradores','Moradores']);
function cityTabNew(tab){let h=''; const now=Date.now();
  if(tab==='pedidos'){h+='<p class="muted" style="margin-top:0">De vez em quando um morador pede algo. Atender dá moedas e XP, e alguns pedidos liberam enfeites que só saem assim ('+REQ_UNL.filter(k=>S.unl[k]).length+' de '+REQ_UNL.length+' liberados).</p>';
    if(!S.req.length)h+='<p class="status"><small>Nenhum pedido agora. O próximo chega em <b data-end="'+S.reqT+'"></b>.</small></p>';
    S.req.forEach((r,i)=>{const b=byId(r.b); if(!b)return; const who=resident(b), ok=reqCheck(r)===true;
      h+='<div class="q"><div class="info"><b>💬 '+esc(who.nome)+' <small>· '+esc(T[b.k].name)+'</small></b><small>“'+esc(reqText(r))+'”</small><small>Prêmio: '+fmtN(r.coins)+' moedas · '+r.xp+' XP'+(r.unl?' · <b>libera '+esc(T[r.unl].name)+'</b>':'')+'</small></div>'+
        '<button class="pill gold" data-a4="req" data-c="'+i+'"'+(ok?'':' disabled')+'>'+(r.type==='entrega'?'Entregar':'Concluir')+'</button><button class="pill" data-a4="reqgo" data-c="'+r.b+'">Ver</button><button class="pill" data-a4="reqskip" data-c="'+i+'">×</button></div>';});}
  else if(tab==='leis'){h+='<p class="muted" style="margin-top:0">Ligue e desligue quando quiser. Cada lei tem uma vantagem e um custo. O custo em moedas é cobrado aos poucos, por minuto.</p><div class="rows">';
    for(const L of LAWS){const why=lawOpen(L), on=law(L.id);
      h+='<div class="row'+(why&&!on?' locked':'')+'"><span class="dot emo">'+(on?'✅':'⚖️')+'</span><div class="info"><b>'+esc(L.name)+'</b><small>✔ '+esc(L.pro)+'<br>✘ '+esc(L.con())+(why&&!on?'<br><b>'+esc(why)+'</b>':'')+'</small></div>'+
        (why&&!on?'':'<button class="pill '+(on?'warn':'go')+'" data-a4="law" data-c="'+L.id+'">'+(on?'Desligar':'Ligar')+'</button>')+'</div>';}
    h+='</div>';}
  else if(tab==='pesquisa'){const camp=countDone('campus');
    h+='<div class="stats"><div><b>'+Math.floor(S.rp)+'</b><small>pontos</small></div><div><b>'+fmtN(D.rpRate||0)+'</b><small>por hora</small></div><div><b>'+S.tech.length+'/'+TECH.length+'</b><small>tecnologias</small></div><div><b>'+camp+'</b><small>campus</small></div></div>';
    if(!camp)h+='<p class="status"><small>Construa o <b>Campus Universitário</b> (Serviços, nível 10) para gerar pesquisa de verdade. Universidades e bibliotecas ajudam um pouco.</small></p>';
    h+='<div class="rows">'; for(const t of TECH){const st=techState(t);
      h+='<div class="row'+(st==='bloqueada'?' locked':'')+'"><span class="dot emo">'+(st==='feita'?'✅':st==='bloqueada'?'🔒':'🔬')+'</span><div class="info"><b>'+esc(t.name)+'</b><small>'+esc(t.desc)+(t.req.length?'<br>Precisa de: '+t.req.map(r=>TECH.find(x=>x.id===r).name).join(', '):'')+'</small></div>'+
        (st==='feita'?'<span class="muted">feita</span>':'<button class="pill '+(st==='pronta'?'gold':'')+'" data-a4="tech" data-c="'+t.id+'"'+(st==='pronta'?'':' disabled')+'>'+t.rp+' pts</button>')+'</div>';}
    h+='</div>';}
  else if(tab==='graficos'){h+='<p class="muted" style="margin-top:0">Uma amostra a cada 10 minutos de jogo aberto. Toque num gráfico para ver o valor.</p>';
    if(S.hist.length<2)h+='<p class="status"><small>Ainda juntando dados. Volte daqui a pouco.</small></p>';
    else for(const [k,n,suf] of GRAPHS)h+='<div class="col"><div class="colh"><b>'+n+'</b><small id="gv-'+k+'"></small></div><canvas class="chart" data-g="'+k+'" width="640" height="150"></canvas></div>';}
  else if(tab==='moradores'){const homes=S.b.filter(b=>T[b.k].cat==='res'&&now>=b.d).slice(0,40);
    h+='<p class="muted" style="margin-top:0">Um morador de cada casa. Toque em “Ver” para ir até ele.</p>';
    for(const b of homes){const r=resident(b), c=cov(b); h+='<div class="q"><div class="info"><b>'+esc(r.nome)+', '+r.idade+' anos</b><small>'+esc(r.prof)+' · mora em '+esc(T[b.k].name)+' · '+esc(r.mania)+'. Sonha '+esc(r.sonho)+'.<br>Felicidade '+Math.round(c.happy*100)+'%'+(c.poll>25?' · reclama da poluição':'')+'</small></div><button class="pill" data-a4="reqgo" data-c="'+b.i+'">Ver</button></div>';}
    if(!homes.length)h+='<p class="status">Ainda não há moradores.</p>';}
  return h;}
const GRAPHS=[['pop','Moradores',''],['coins','Moedas',''],['happy','Felicidade','%'],['poll','Poluição média',''],['tour','Turistas','']];
function cssVar(n,f){try{return getComputedStyle(document.documentElement).getPropertyValue(n).trim()||f;}catch(e){return f;}}
function drawCharts(){const H=S.hist.slice().sort((a,b)=>a.t-b.t); document.querySelectorAll('canvas.chart').forEach(cc=>{const k=cc.dataset.g; if(H.length<2)return; const c=cc.getContext('2d');
  const W=cc.width,Hh=cc.height, pad=[78,12,12,24]; c.clearRect(0,0,W,Hh); const vals=H.map(p=>p[k]||0), mn=Math.min(0,...vals), mx=Math.max(1,...vals);
  const ink=cssVar('--muted','#5a6a64'), grid=cssVar('--line','#cfdcc8'), line=cssVar('--sky','#2b6cb0');
  const X=i=>pad[0]+(W-pad[0]-pad[1])*i/(H.length-1), Y=v=>Hh-pad[3]-(Hh-pad[2]-pad[3])*(v-mn)/(mx-mn||1);
  c.font='600 18px system-ui,sans-serif'; c.fillStyle=ink; c.strokeStyle=grid; c.lineWidth=1;
  for(const f of [0,.5,1]){const v=mn+(mx-mn)*f, y=Y(v); c.beginPath(); c.moveTo(pad[0],y); c.lineTo(W-pad[1],y); c.stroke(); c.textAlign='right'; c.textBaseline='middle'; c.fillText(fmtS(v),pad[0]-4,y);}
  const d0=new Date(H[0].t), d1=new Date(H[H.length-1].t), fd=d=>d.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'})+' '+d.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
  c.textBaseline='alphabetic'; c.textAlign='left'; c.fillText(fd(d0),pad[0],Hh-2); c.textAlign='right'; c.fillText(fd(d1),W-pad[1],Hh-2);
  c.strokeStyle=line; c.lineWidth=2.5; c.lineJoin='round'; c.beginPath(); vals.forEach((v,i)=>{i?c.lineTo(X(i),Y(v)):c.moveTo(X(i),Y(v));}); c.stroke();
  const last=vals[vals.length-1]; c.fillStyle=line; c.beginPath(); c.arc(X(vals.length-1),Y(last),5,0,7); c.fill();
  const lab=$('#gv-'+k); if(lab)lab.textContent='agora: '+fmtN(last)+(GRAPHS.find(g=>g[0]===k)[2]);
  cc.onpointerdown=cc.onpointermove=e=>{const r=cc.getBoundingClientRect(); const fx=(e.clientX-r.left)/r.width*W; const i=clamp(Math.round((fx-pad[0])/(W-pad[0]-pad[1])*(H.length-1)),0,H.length-1);
    if(lab)lab.textContent=fd(new Date(H[i].t))+': '+fmtN(vals[i])+(GRAPHS.find(g=>g[0]===k)[2]);};});}
$('#shBody').addEventListener('click',e=>{const el=e.target.closest('[data-a4]'); if(!el||el.disabled)return; const a=el.dataset.a4, c=el.dataset.c;
  if(a==='req'){doRequest(+c); refreshPanel();} else if(a==='reqskip'){skipRequest(+c); refreshPanel();}
  else if(a==='reqgo'){const b=byId(+c); if(b){closeSheet(); const [x,y]=P(b.x+fw(b)/2,b.y+fh(b)/2); cam.x=x; cam.y=y; cam.z=Math.max(cam.z,1.4); clampCam(); selId=b.i; openInfo(b);}}
  else if(a==='law'){toggleLaw(c); refreshPanel();} else if(a==='tech'){doResearch(c); refreshPanel();}
  else if(a==='chain'){chainAdvance(c); refreshPanel();}
  else if(a==='putout'){const b=byId(+c); if(b){putOut(b); openInfo(b);}}
  else if(a==='copy'){const b=byId(+c); if(b&&canBuy(b.k)){closeSheet(); setMode({t:'place',k:b.k,has:false,f:b.f});}}
  else if(a==='opt'){const [k,v]=c.split(':'); OPT[k]=v; saveOpt(); if(k==='renderer'){switchBackend(v==='canvas'?'canvas':'webgl'); resize();} if(k==='qual'){applyQual(); resize(); ckFreeAll();} openMenu();}
  else if(a==='perf'){PERF.on=!PERF.on; openMenu();}
  else if(a==='rename')renameBox();
  else if(a==='backup')backupSave(); else if(a==='restore')$('#restoreIn').click();});
function refreshPanel(){if(sheetKind==='city')openCity(); else if(sheetKind==='quests')openQuests(); else if(sheetKind==='info'&&sheetData){const b=byId(sheetData.id); if(b)openInfo(b);}}

/* ---- Cadeias no painel de Missões ---- */
function chainsHtml(){let h='<h4 class="sub">Cadeias especiais</h4><p class="muted" style="margin:0 0 6px">Cada cadeia libera um prédio que só sai por ela.</p>';
  for(const ch of CHAINS){const k=chainStep(ch), done=k>=ch.steps.length;
    if(S.lv<ch.lv){h+='<div class="q" style="opacity:.55"><div class="info"><b>'+esc(ch.name)+'</b><small>Libera no nível '+ch.lv+' · prêmio: '+esc(T[ch.reward].name)+'</small></div></div>'; continue;}
    if(done){h+='<div class="q"><div class="info"><b>'+esc(ch.name)+' ✓</b><small>'+esc(T[ch.reward].name)+' liberado(a) na loja.</small></div></div>'; continue;}
    const p=chainProg(ch), ok=p[0]>=p[1];
    h+='<div class="q"><div class="info"><b>'+esc(ch.name)+' · etapa '+(k+1)+' de '+ch.steps.length+'</b><small>'+esc(ch.steps[k].t)+' · prêmio final: '+esc(T[ch.reward].name)+'</small><div class="pb"><i style="width:'+Math.min(100,p[0]/p[1]*100)+'%"></i></div></div>'+
      (ok?'<button class="pill gold" data-a4="chain" data-c="'+ch.id+'">Concluir</button>':'<span class="muted">'+fmtN(Math.max(0,p[0]))+'/'+fmtN(p[1])+'</span>')+'</div>';}
  return h;}

/* ---- Painel de informações: incêndio, pedido, morador, pesquisa, aeroporto, copiar ---- */
function infoExtraTop(b){const t=T[b.k], now=Date.now(); let h='';
  if(b.fire)h+='<div class="q" style="background:#fde2e1"><div class="info"><b>🔥 Pegando fogo!</b><small>Enquanto queima, não paga aluguel. Fica fora da área dos bombeiros: um Corpo de Bombeiros perto evita isso. Um hidrante a até 2 quadrados apaga de graça.</small></div><button class="pill warn" data-a4="putout" data-c="'+b.i+'">Apagar'+(fireCost(b)?' ('+fmtN(fireCost(b))+')':'')+'</button></div>';
  const ri=S.req.findIndex(r=>r.b===b.i); if(ri>=0){const r=S.req[ri], ok=reqCheck(r)===true;
    h+='<div class="q"><div class="info"><b>💬 Pedido de '+esc(resident(b).nome)+'</b><small>“'+esc(reqText(r))+'”<br>Prêmio: '+fmtN(r.coins)+' moedas'+(r.unl?' · libera <b>'+esc(T[r.unl].name)+'</b>':'')+'</small></div><button class="pill gold" data-a4="req" data-c="'+ri+'"'+(ok?'':' disabled')+'>'+(r.type==='entrega'?'Entregar':'Concluir')+'</button></div>';}
  if(t.cat==='res'&&now>=b.d){const r=resident(b); h+='<p class="status" style="margin-bottom:6px"><small>👤 <b>'+esc(r.nome)+'</b>, '+r.idade+' anos, '+esc(r.prof)+'. '+esc(r.mania[0].toUpperCase()+r.mania.slice(1))+' e sonha '+esc(r.sonho)+'.'+(cov(b).poll>25?' Anda reclamando da fumaça.':'')+'</small></p>';}
  return h;}
function infoExtraBottom(b){const t=T[b.k]; let h='';
  if(t.research)h+='<br><small>Gera '+t.research+' pontos de pesquisa por hora. Abra Cidade → Pesquisa.</small>';
  if(t.farmBuff)h+='<br><small>Plantações a até '+t.farmBuff.r+' quadrados rendem +'+t.farmBuff.yield+'% e crescem '+t.farmBuff.speed+'% mais rápido.</small>';
  if(t.sink||SINK[b.k])h+='<br><small>Ajuda a limpar a poluição em volta.</small>';
  if(polSource(b))h+='<br><small>Polui o ar em volta (veja em Visão → Poluição).</small>';
  return h;}
function infoCopyBtn(b){const t=T[b.k]; return (!t.fixed&&!t.max)?'<button class="pill" data-a4="copy" data-c="'+b.i+'">Copiar</button>':'';}

/* ---- Desbloqueio e novidades ---- */
function showUnlock(name,txt){const m=$('#mcard'); m.innerHTML='<h3>Novo prédio liberado!</h3><p><b>'+esc(name)+'</b><br>'+esc(txt)+'</p><div class="acts"><button class="pill gold" id="mOk">Ver na loja</button><button class="pill" id="mNo">Depois</button></div>';
  $('#modal').hidden=false; $('#mOk').onclick=()=>{closeModal(); const k=Object.keys(T).find(k=>T[k].name===name); openShop(k?T[k].cat:null);}; $('#mNo').onclick=closeModal;}
function showUpgrade(){$('#mcard').innerHTML='<h3>Novidades na cidade</h3><p style="text-align:left;font-size:14.5px;line-height:1.4">Pessoas andando nas calçadas, clima com chuva, leis, poluição, pedidos dos moradores, cadeias de missões com prédios exclusivos, Campus com tecnologias, Zoológico, Aeroporto, energia limpa, mineração, incêndios leves, gráficos e backup.<br><br>Montanhas mais naturais nas áreas que você ainda não comprou, e o <b>túnel do trem agora fica na encosta perto do centro</b> (oeste da Prefeitura). Se a sua estação estava ligada ao túnel antigo, ligue um trilho até o portal novo.<br><br>O jogo também ficou mais leve, com desenho em WebGL.</p><div class="acts"><button class="pill gold" id="mOk">Bora ver</button></div>';
  $('#modal').hidden=false; $('#mOk').onclick=closeModal;}

/* ---- Desfazer nos pincéis ---- */
const UNDO=[]; let undoRec=null;
function undoBegin(){undoRec={cells:new Map(),coins:S.coins,inv:Object.assign({},S.inv),goods:S.goods};}
function undoTouch(x,y,q){if(!undoRec)return; const snap=(g,i)=>{const key=g+':'+i; if(!undoRec.cells.has(key))undoRec.cells.set(key,G[g][i]);};
  if(q){const qi=y*Q2+x; snap('pv',qi); snap('fc',qi); return;} if(!inMap(x,y))return; const i=y*N+x; for(const g of ['tr','ht','rp','rd','bm','rl','ob'])snap(g,i);
  for(const [a,b] of [[0,0],[1,0],[0,1],[1,1]]){const qi=(y*2+b)*Q2+x*2+a; snap('pv',qi); snap('fc',qi);}}
function undoEnd(){if(!undoRec)return; let ch=false; for(const [k,v] of undoRec.cells){const [g,i]=k.split(':'); if(G[g][+i]!==v){ch=true;break;}}
  if(ch){undoRec.coins1=S.coins; undoRec.inv1=Object.assign({},S.inv); UNDO.push(undoRec); if(UNDO.length>20)UNDO.shift();} undoRec=null; updateToolbar();}
function undoLast(){const r=UNDO.pop(); if(!r){toast('Nada para desfazer');return;}
  for(const [k,v] of r.cells){const [g,i]=k.split(':'); G[g][+i]=v;}
  S.coins=Math.max(0,S.coins+(r.coins-r.coins1)); for(const k in r.inv)S.inv[k]=Math.max(0,S.inv[k]+(r.inv[k]-(r.inv1[k]||0)));
  mapVer++; after(); toast('Desfeito'); updateToolbar();}
window.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&(e.key==='z'||e.key==='Z')&&mode.t==='paint'){e.preventDefault(); undoLast();}});

/* ---- Construir em linha ---- */
function lineCells(k,ax,ay,bx,by,f){const t=T[k],w=f?t.h:t.w,h=f?t.w:t.h; const out=[];
  if(Math.abs(bx-ax)>=Math.abs(by-ay)){const s=Math.sign(bx-ax)||1; for(let x=ax;s>0?x<=bx:x>=bx;x+=s*w){out.push([x,ay]); if(out.length>40)break;}}
  else{const s=Math.sign(by-ay)||1; for(let y=ay;s>0?y<=by:y>=by;y+=s*h){out.push([ax,y]); if(out.length>40)break;}}
  return out;}
function placeLine(){const k=mode.k; let n=0,spent=0; for(const [x,y] of mode.line){if(!canBuy(k,true))break; if(!canPlace(k,x,y,mode.f,-2))continue; const c0=S.coins; if(placeNew(k,x,y,mode.f)){n++; spent+=c0-S.coins;}}
  toast(n?n+' construído(s) em linha (−'+fmtN(spent)+')':'Nada coube nessa linha'); mode.line=null; mode.anchor=null; if(!canBuy(k,true))setMode({t:'idle'}); else updatePlaceBar();}

/* ---- Backup do save em arquivo ---- */
async function backupSave(){saveNow(); const json=serialize(); const name='cidade-viva-'+(S.name||'cidade').replace(/[^\w\-]+/g,'-').toLowerCase()+'-'+new Date().toISOString().slice(0,10)+'.json';
  try{const dl=window.claude&&window.claude.use?await window.claude.use('downloads'):null;
    if(dl){await dl.save({filename:name,data:json}); toast('Backup salvo'); return;}}
  catch(e){if(e&&e.code==='declined'){toast('Backup cancelado');return;} if(e&&e.code==='rate_limited'){toast('Espere um pouco e tente de novo');return;}}
  try{const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([json],{type:'application/json'})); a.download=name; document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href); a.remove();},1000); toast('Backup baixado');}
  catch(e){toast('Não consegui baixar o arquivo aqui');}}
function restoreFile(file){const rd=new FileReader(); rd.onload=()=>{try{const s=JSON.parse(rd.result); if(!s||!Array.isArray(s.b))throw 0;
    confirmBox('Restaurar este backup?','A cidade atual será trocada pela do arquivo ('+(s.name||'sem nome')+', nível '+(s.lv||1)+').','Restaurar',()=>{if(hydrate(s)){cars=[]; peds=[]; ckFreeAll(); afterLoad(); saveNow(); toast('Backup restaurado');} else toast('Arquivo inválido');});}
  catch(e){toast('Esse arquivo não é um backup da Cidade Viva');}}; rd.readAsText(file);}

/* ---- HUD: clima e nome da cidade ---- */
function updateWx(){const el=$('#wx'); if(!el||!S)return; const w=weatherNow(Date.now()); el.textContent=w.ico+' '+w.name; el.title=S.name+' · '+w.name+(w.k===2?': plantações crescem 50% mais rápido':'');
  document.title=S.name&&S.name!=='Cidade Viva'?S.name+' · Cidade Viva':'Cidade Viva';}

$('#wx').onclick=()=>{if(sheetKind==='city'&&cityTab==='resumo')closeSheet(); else openCity('resumo');};
$('#restoreIn').onchange=e=>{const f=e.target.files[0]; if(f)restoreFile(f); e.target.value='';};

// renomear a cidade (sem prompt(): o visualizador não mostra diálogos do navegador)
function renameBox(){const m=$('#mcard'); m.innerHTML='<h3>Nome da cidade</h3><p><input id="cityName" maxlength="32" style="font:inherit;font-size:17px;width:100%;padding:8px 10px;border-radius:10px;border:2px solid var(--line);background:var(--panel2);color:var(--ink)"></p><div class="acts"><button class="pill" id="mNo">Cancelar</button><button class="pill go" id="mOk">Salvar</button></div>';
  $('#modal').hidden=false; const inp=$('#cityName'); inp.value=S.name||''; inp.focus(); inp.select();
  const ok=()=>{const nm=inp.value.trim(); if(nm){S.name=nm.slice(0,32); markDirty(); updateWx(); toast('A cidade agora se chama '+S.name);} closeModal(); if(sheetKind==='menu')openMenu();};
  $('#mOk').onclick=ok; $('#mNo').onclick=closeModal; inp.onkeydown=e=>{if(e.key==='Enter')ok(); e.stopPropagation();};}
