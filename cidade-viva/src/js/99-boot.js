/* ================= Início do jogo (sempre por último) ================= */
applyQual(); initPats(); bootState(); resize(); if(wantGL())switchBackend('webgl',true); window.__backendName=()=>BK.name; derive(); refreshQuests(); centerStart(); updateHud(); requestAnimationFrame(loop);
loadArtLocal(); loadAllArt();
if(migratedMsg!=null)setTimeout(showMigrated,300); else if(!loadLocal())setTimeout(()=>toast('Toque nas bolhas sobre os prédios para coletar'),600);
saveNow(); initCloud();
refreshOrders(); refreshCh(); updateHud(); updateWx();
if(upgradedV2||upgradedV3)setTimeout(showUpgrade,400);
setInterval(()=>{if(!S)return; refreshOrders(); refreshCh(); if(sheetKind==='city')openCity(null,true); else if(sheetKind==='city')liveTimers();},2000);

