/* ================= Ícones das ferramentas ================= */
function drawToolIcon(c,tool,W,H){c.save(); c.translate(W/2,H/2+4); const k=Math.min(W/110,H/70); c.scale(k,k);
  const dia=(col,s)=>{s=s||1;c.beginPath();c.moveTo(0,-24*s);c.lineTo(48*s,0);c.lineTo(0,24*s);c.lineTo(-48*s,0);c.closePath();c.fillStyle=col;c.fill();};
  const blk=(h,top,side)=>{c.fillStyle=side;c.beginPath();c.moveTo(-48,0);c.lineTo(0,24);c.lineTo(48,0);c.lineTo(48,h);c.lineTo(0,24+h);c.lineTo(-48,h);c.closePath();c.fill(); c.save();c.translate(0,0);dia(top);c.restore();};
  switch(tool){
    case 'rua':dia('#636b74'); c.strokeStyle='#f1ecdc';c.lineWidth=3;c.setLineDash([7,7]);c.beginPath();c.moveTo(-24,-12);c.lineTo(24,12);c.stroke();c.setLineDash([]);break;
    case 'ponte':dia('#4aa3d6'); c.fillStyle='#9c9488';c.beginPath();c.moveTo(-34,-17);c.lineTo(14,7);c.lineTo(34,-3);c.lineTo(-14,-27);c.closePath();c.fill(); c.strokeStyle='#7a3b2e';c.lineWidth=3;c.beginPath();c.moveTo(-34,-30);c.lineTo(14,-6);c.stroke();break;
    case 'trilho':dia('#9a8f80'); c.strokeStyle='#6b4a2e';c.lineWidth=5;for(let i=-2;i<=2;i++){c.beginPath();c.moveTo(-14+i*10,-7+i*5-10);c.lineTo(-14+i*10+16,-7+i*5+2);c.stroke();} c.strokeStyle='#4b5058';c.lineWidth=3;for(const o of [-6,6]){c.beginPath();c.moveTo(-34,-17+o);c.lineTo(34,17+o);c.stroke();}break;
    case 'remover':dia('#86bf65'); c.fillStyle='#f2c230';c.fillRect(-22,-26,32,18);c.fillStyle='#333';c.fillRect(-18,-8,9,9);c.fillRect(2,-8,9,9);c.fillStyle='#f2c230';c.beginPath();c.moveTo(10,-22);c.lineTo(32,-8);c.lineTo(32,-2);c.lineTo(10,-12);c.fill();break;
    case 'elevar':c.translate(0,6);blk(14,'#86bf65','#8a7356');c.fillStyle='#fff';c.beginPath();c.moveTo(0,-34);c.lineTo(10,-22);c.lineTo(-10,-22);c.fill();c.fillRect(-3,-23,6,12);break;
    case 'rebaixar':c.translate(0,-2);blk(10,'#86bf65','#8a7356');c.fillStyle='#fff';c.beginPath();c.moveTo(0,8);c.lineTo(10,-4);c.lineTo(-10,-4);c.fill();c.fillRect(-3,-16,6,12);break;
    case 'nivelar':blk(8,'#86bf65','#8a7356');c.strokeStyle='#fff';c.lineWidth=3;c.beginPath();c.moveTo(-28,-2);c.lineTo(28,-2);c.stroke();break;
    case 'rampa':c.fillStyle='#8a7356';c.beginPath();c.moveTo(-48,10);c.lineTo(0,34);c.lineTo(48,10);c.lineTo(48,-6);c.closePath();c.fill();c.fillStyle='#86bf65';c.beginPath();c.moveTo(-48,10);c.lineTo(0,-14);c.lineTo(48,-6);c.lineTo(0,34);c.closePath();c.fill();c.fillStyle='#636b74';c.beginPath();c.moveTo(-26,13);c.lineTo(-6,3);c.lineTo(26,10);c.lineTo(6,22);c.closePath();c.fill();break;
    case 'cavar':dia('#86bf65'); dia('#4aa3d6',.7); c.fillStyle='#fff';c.font='800 22px sans-serif';c.textAlign='center';c.fillText('+',0,8);break;
    case 'aterrar':dia('#4aa3d6'); dia('#8b5a35',.7);break;
    case 'pintar':dia('#86bf65'); c.save();c.beginPath();c.moveTo(0,-24);c.lineTo(48,0);c.lineTo(0,24);c.closePath();c.clip();dia('#e3b877');c.restore();c.fillStyle='#f2f5f7';c.beginPath();c.moveTo(-24,-12);c.lineTo(0,-24);c.lineTo(0,0);c.closePath();c.fill();break;
    case 'plantar':dia('#86bf65'); c.fillStyle='#7a5230';c.fillRect(-2,-20,4,16);c.fillStyle='#3e8e41';c.beginPath();c.arc(0,-26,13,0,7);c.fill();c.fillStyle='#24583a';c.beginPath();c.moveTo(22,-6);c.lineTo(32,-6);c.lineTo(27,-26);c.fill();break;
    case 'piso':dia('#86bf65'); c.fillStyle='#d9d2c4';c.beginPath();c.moveTo(-12,-18);c.lineTo(36,6);c.lineTo(24,12);c.lineTo(-24,-12);c.closePath();c.fill();break;
    case 'muro':dia('#86bf65'); c.fillStyle='#3f8f3a';c.beginPath();c.moveTo(-30,-15);c.lineTo(30,15);c.lineTo(30,3);c.lineTo(-30,-27);c.closePath();c.fill();c.fillStyle='#5fb24f';c.beginPath();c.moveTo(-30,-27);c.lineTo(30,3);c.lineTo(34,1);c.lineTo(-26,-29);c.closePath();c.fill();break;
    case 'apagar':dia('#86bf65'); c.strokeStyle='#e5484d';c.lineWidth=6;c.beginPath();c.moveTo(-14,-14);c.lineTo(14,14);c.moveTo(14,-14);c.lineTo(-14,14);c.stroke();break;}
  c.restore();}

/* ================= Barra de pincéis ================= */
let tbKey='';
function openTools(group){const first=Object.keys(TOOLS).find(k=>TOOLS[k].g===group&&S.lv>=TOOLS[k].lv)||Object.keys(TOOLS).find(k=>TOOLS[k].g===group);
  if(S.lv<TOOLS[first].lv){toast('Libera no nível '+TOOLS[first].lv);return;} closeSheet(); setMode({t:'paint',tool:first,group,count:0});}
function optList(tl){if(tl.opt==='bridge')return BRIDGES.map((m,i)=>({i,name:m.name,lv:m.lv,sub:fmtN(m.c)+' '+matTxt(m.mat),sel:OPT.bm===i}));
  if(tl.opt==='soil')return SOILS.map((m,i)=>({i,name:m[1],lv:1,col:m[2],sel:OPT.soil===i}));
  if(tl.opt==='pave')return PAVES.map((m,i)=>({i,name:m.name,lv:m.lv,pat:'pv'+i,sel:OPT.pv===i}));
  if(tl.opt==='fence')return FENCES.map((m,i)=>({i,name:m.name,lv:m.lv,pat:'fc'+i,sel:OPT.fc===i}));
  return null;}
function updateToolbar(){if(mode.t!=='paint')return; const tl=TOOLS[mode.tool], ops=optList(tl);
  const key=mode.tool+'|'+mode.group+'|'+OPT.bm+OPT.soil+OPT.pv+OPT.fc+'|'+S.lv;
  if(key!==tbKey){tbKey=key;
    $('#tbTools').innerHTML=Object.entries(TOOLS).filter(([k,t])=>t.g===mode.group).map(([k,t])=>'<button class="tchip'+(k===mode.tool?' on':'')+(S.lv<t.lv?' locked':'')+'" data-tool="'+k+'"><canvas data-ti="'+k+'" width="88" height="54"></canvas><span>'+t.name+'</span>'+(S.lv<t.lv?'<em>nv '+t.lv+'</em>':'')+'</button>').join('');
    const ob=$('#tbOpts'); ob.hidden=!ops; if(ops)ob.innerHTML=ops.map(o=>'<button class="ochip'+(o.sel?' on':'')+(S.lv<o.lv?' locked':'')+'" data-opt="'+o.i+'">'+(o.col?'<i style="background:'+o.col+'"></i>':o.pat?'<canvas data-sw="'+o.pat+'" width="40" height="26"></canvas>':'')+'<span>'+o.name+(o.sub?'<small>'+o.sub+'</small>':'')+(S.lv<o.lv?'<small>nível '+o.lv+'</small>':'')+'</span></button>').join('');
    document.querySelectorAll('canvas[data-ti]').forEach(cc=>drawToolIcon(cc.getContext('2d'),cc.dataset.ti,cc.width,cc.height));
    document.querySelectorAll('canvas[data-sw]').forEach(cc=>drawSwatch(cc,cc.dataset.sw));}
  const cc=toolCost(mode.tool,curOpt()); const cost=mode.tool==='ponte'?fmtN(cc.c)+' moedas + '+matTxt(cc.mat)+' por trecho':cc.c?fmtN(cc.c)+' moedas por '+(tl.q?'pedaço':'quadrado'):'grátis';
  $('#tbUndo').disabled=!UNDO.length;
  $('#tbTxt').innerHTML='<b>'+tl.name+'</b> · '+cost+'<span>'+tl.desc+(mode.count?' · '+mode.count+' feito(s)':' · arraste para pintar, dois dedos movem o mapa')+'</span>';}
function drawSwatch(cc,id){const c=cc.getContext('2d'); const W=cc.width,H=cc.height; c.clearRect(0,0,W,H);
  if(id.startsWith('pv')){const p=PAVE[+id.slice(2)]; p.setTransform(new DOMMatrix([.6,0,0,.6,0,0])); c.fillStyle=p; c.beginPath();c.moveTo(W/2,1);c.lineTo(W-1,H/2);c.lineTo(W/2,H-1);c.lineTo(1,H/2);c.closePath();c.fill();}
  else{const i=+id.slice(2); const col=['#3f8f3a','#f6f4ee','#9a958b','#b4553f','#2b2f36','#8a5a32','#b9bab5'][i]; c.fillStyle='#86bf65'; c.beginPath();c.moveTo(W/2,H*.35);c.lineTo(W-1,H*.68);c.lineTo(W/2,H-1);c.lineTo(1,H*.68);c.closePath();c.fill();
    if(i===1||i===4||i===5){c.strokeStyle=col;c.lineWidth=i===4?1.2:2;for(let k=0;k<5;k++){const x=6+k*7;c.beginPath();c.moveTo(x,H*.7-k*1);c.lineTo(x,H*.3-k*1);c.stroke();} c.beginPath();c.moveTo(4,H*.4);c.lineTo(W-4,H*.28);c.moveTo(4,H*.62);c.lineTo(W-4,H*.5);c.stroke();}
    else{c.fillStyle=col;c.fillRect(5,H*.25,W-10,H*.4);c.fillStyle='rgba(255,255,255,.25)';c.fillRect(5,H*.25,W-10,3);}}}
$('#tbTools').addEventListener('click',e=>{const b=e.target.closest('[data-tool]'); if(!b)return; const k=b.dataset.tool; if(S.lv<TOOLS[k].lv){toast('Libera no nível '+TOOLS[k].lv);return;} mode.tool=k; mode.count=0; mode.hover=null; updateToolbar();});
$('#tbOpts').addEventListener('click',e=>{const b=e.target.closest('[data-opt]'); if(!b)return; const i=+b.dataset.opt, tl=TOOLS[mode.tool];
  const lv=tl.opt==='bridge'?BRIDGES[i].lv:tl.opt==='pave'?PAVES[i].lv:tl.opt==='fence'?FENCES[i].lv:1; if(S.lv<lv){toast('Libera no nível '+lv);return;}
  if(tl.opt==='bridge')OPT.bm=i; else if(tl.opt==='soil')OPT.soil=i; else if(tl.opt==='pave')OPT.pv=i; else if(tl.opt==='fence')OPT.fc=i; saveOpt(); updateToolbar();});
$('#tbDone').onclick=()=>setMode({t:'idle'});
$('#tbUndo').onclick=()=>undoLast();
document.querySelectorAll('#rail [data-g]').forEach(b=>b.onclick=()=>openTools(b.dataset.g));
$('#rExp').onclick=()=>{if(!S.ul.some((v,i)=>!v&&chunkBuyable(i%NC,Math.floor(i/NC)))){toast('O mapa inteiro já é seu');return;} setMode({t:'expand'});};
$('#rView').onclick=()=>{VIEW=VIEW?null:'happy'; updateViewBar();};

/* ================= Modo de visão ================= */
function updateViewBar(){const vb=$('#viewbar'); vb.hidden=!VIEW; $('#rView').classList.toggle('on',!!VIEW); if(!VIEW)return;
  vb.innerHTML=VIEWS.map(([k,n])=>'<button class="tab'+(k===VIEW?' on':'')+'" data-v="'+k+'">'+n+'</button>').join('')+'<button class="x" data-v="">×</button>';}
$('#viewbar').addEventListener('click',e=>{const b=e.target.closest('[data-v]'); if(!b)return; VIEW=b.dataset.v||null; updateViewBar();
  if(VIEW){const m={happy:'Verde = feliz, vermelho = infeliz',tour:'Amarelo atrai turistas, azul hospeda',set:'Quanto mais forte, mais tipos do bairro por perto'}[VIEW]||'Área colorida = atendida · casas verdes têm o desejo, vermelhas não'; toast(m);}});

/* ================= Ponte ================= */
function openBridge(x,y){const span=bridgeSpan(x,y), m=G.bm[y*N+x];
  const h='<p class="status">Modelo atual: <b>'+BRIDGES[m].name+'</b> · '+span.length+' trecho(s).<br><small>Trocar refaz a ponte inteira com o novo modelo.</small></p><div class="rows">'+
    BRIDGES.map((M,i)=>{const lock=S.lv<M.lv, tot={}; for(const k in M.mat)tot[k]=M.mat[k]*span.length;
      return '<div class="row'+(lock?' locked':'')+'"><canvas class="bsw" data-bm="'+i+'" width="70" height="44"></canvas><div class="info"><b>'+M.name+'</b><small>'+(lock?'Libera no nível '+M.lv:fmtN(M.c*span.length)+' moedas · '+matTxt(tot))+'</small></div>'+
        (lock||i===m?'':'<button class="pill go" data-a3="bridge" data-c="'+i+'">Trocar</button>')+(i===m?'<span class="muted">atual</span>':'')+'</div>';}).join('')+'</div>';
  openSheet('bridge','Ponte',h,{bx:x,by:y});
  document.querySelectorAll('canvas[data-bm]').forEach(cc=>{const c=cc.getContext('2d'); const mm=+cc.dataset.bm; c.translate(35,20); c.scale(.55,.55); const save={m:G.bm[y*N+x]};
    c.fillStyle='#4aa3d6'; c.beginPath();c.moveTo(0,-16);c.lineTo(64,16);c.lineTo(0,48);c.lineTo(-64,16);c.closePath();c.fill();
    const col=['#9c9488','#7a5434','#b3b1ac','#6e7378','#a7a9ad'][mm]; c.fillStyle=col; c.beginPath();c.moveTo(-40,-4);c.lineTo(24,28);c.lineTo(40,20);c.lineTo(-24,-12);c.closePath();c.fill();
    c.strokeStyle=mm===3?'#7a3b2e':mm===4?'#d8dde2':mm===1?'#6b4a2a':'#c9c3b5'; c.lineWidth=mm===3?3:2; const hh=mm===3?24:mm===4?8:8;
    c.beginPath();c.moveTo(-40,-4-hh);c.lineTo(24,28-hh);c.stroke(); if(mm===3){c.beginPath();c.moveTo(-40,-4);c.lineTo(-8,12-hh);c.lineTo(24,28);c.stroke();}
    if(mm===4){c.strokeStyle='#e2e2de';c.lineWidth=4;c.beginPath();c.moveTo(-36,-4);c.lineTo(-36,-44);c.moveTo(20,24);c.lineTo(20,-16);c.stroke();c.lineWidth=1.5;c.beginPath();c.moveTo(-36,-44);c.quadraticCurveTo(-8,8,20,-16);c.stroke();}});}

/* ================= Exportação ================= */
function expRows(port){const air=port==='air'; if(air)port=false;
  return '<div class="rows">'+Object.keys(EXP_Q).filter(k=>(!air||AIR_ITEMS.includes(k))&&(k==='goods'||k==='wood'||k==='stone'||S.lv>=({steel:8,tools:8,rubber:10,tires:11,cars:14})[k])).map(k=>{const q=EXP_Q[k], have=k==='goods'?S.goods:S.inv[k];
  const pay=Math.round(expPay(k,port)*(air?1.25:1));
  return '<div class="row'+(have<q?' locked':'')+'"><span class="dot emo">'+ITEMS[k].ico+'</span><div class="info"><b>'+q+' '+ITEMS[k].name.toLowerCase()+'</b><small>Paga '+fmtN(pay)+' moedas · '+fmtT(air?240:port?900:300)+' · você tem '+fmtN(have)+'</small></div>'+
    '<button class="pill go" data-act="exp" data-c="'+k+'"'+(have<q?' disabled':'')+'>Enviar</button></div>';}).join('')+'</div>';}
function setLine(b){const t=T[b.k]; if(!t.set)return ''; const c=cov(b), st=SETS[t.set]; return '<small class="setl">Bairro '+st.name+': '+(c.setN||1)+' de '+st.keys.length+' tipos por perto'+(c.set?' → +'+c.set+'%':' (3 tipos dão +10%)')+'</small>';}

