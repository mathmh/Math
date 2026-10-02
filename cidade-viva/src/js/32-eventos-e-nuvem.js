/* ================= Eventos ================= */
const EV_SLOT=90*60000, EV_LEN=30*60000;
function curEvent(now){now=now||Date.now(); const slot=Math.floor(now/EV_SLOT); if(now-slot*EV_SLOT>EV_LEN)return null; const e=EVENTS[hsh(slot,7,3)%EVENTS.length]; return Object.assign({end:slot*EV_SLOT+EV_LEN},e);}
function nextEvent(now){now=now||Date.now(); const slot=Math.floor(now/EV_SLOT)+1; return Object.assign({start:slot*EV_SLOT},EVENTS[hsh(slot,7,3)%EVENTS.length]);}
function evMul(k){const e=curEvent(); return e&&e[k]?e[k]:1;}

/* ================= Salvamento ================= */
let dirtySave=false, dbRef=null, dbWriting=false, dbPending=false, saveWhere='este navegador';
function markDirty(){dirtySave=true;}
function saveNow(){if(!S)return; S.t=Date.now(); const json=serialize(); try{localStorage.setItem(SAVE_KEY,json);}catch(e){} dirtySave=false; pushDb(json);}
function pushDb(json){if(!dbRef)return; if(dbWriting){dbPending=true;return;} dbWriting=true;
  dbRef.set({save:json,t:S.t}).catch(()=>{}).finally(()=>{dbWriting=false; if(dbPending){dbPending=false; pushDb(serialize());}});}
function loadLocal(){try{const j=localStorage.getItem(SAVE_KEY); if(j){const s=JSON.parse(j); if(s&&(s.v>=2&&s.v<=4))return s;}}catch(e){} return null;}
function loadOld(){try{const j=localStorage.getItem(OLD_KEY); if(j){const s=JSON.parse(j); if(s&&s.v===1)return s;}}catch(e){} return null;}
let migratedMsg=null, upgradedV2=false, upgradedV3=false;
function bootState(){const s=loadLocal(); if(s){const was=s.v; if(hydrate(s)){if(was===2)upgradedV2=true; return;}}
  const old=loadOld(); if(old){const m=migrateV1(old); S=m.s; migratedMsg=m.refund; try{localStorage.removeItem(OLD_KEY);}catch(e){} return;}
  S=newGame();}
async function initCloud(){
  try{if(!window.claude||!window.claude.use)return;
    const [db,user]=await Promise.all([window.claude.use('db'),window.claude.use('user')]); if(!db||!user)return;
    const id=await user.id(); if(!id)return; const ref=db.doc('data/users/'+id+'/save'); const snap=await ref.get(); dbRef=ref; saveWhere='sua conta';
    if(snap.exists){const d=snap.data(); try{const s=JSON.parse(d.save);
      if(s&&(s.v>=2&&s.v<=4)&&(s.t||0)>(S.t||0)+3000){const was=s.v; if(hydrate(s)){afterLoad(); if(was<4)showUpgrade(); else toast('Progresso carregado da sua conta');}}
      else if(s&&s.v===1&&!migratedMsg&&(S.st.expand===0&&S.lv<=1)){const m=migrateV1(s); S=m.s; migratedMsg=m.refund; afterLoad(); showMigrated();}}catch(e){}}
    saveNow(); initArtCloud(db);
  }catch(e){dbRef=null;}}
