/* ================= Clima: sol, nublado e chuva =================
 Alterna sozinho a cada 8 minutos (mesmo padrão para todo mundo, como os eventos).
 Chuva: gotas, céu mais escuro, poças; plantações crescem 50% mais rápido e o turismo cai um pouco. */
const WX_SLOT=8*60000, WX_NAMES=['Sol','Nublado','Chuva'], WX_ICO=['☀️','⛅','🌧️'];
function wxKind(slot){if(OPT.wx==='sol')return 0; if(OPT.wx==='chuva')return 2; const h=hsh(slot,91,7)%100; return h<62?0:h<89?1:2;}   // chuva em ~11% do tempo
function weatherNow(now){const slot=Math.floor(now/WX_SLOT), f=(now%WX_SLOT)/WX_SLOT, k=wxKind(slot), kp=wxKind(slot-1);
  const t=clamp(f/.1,0,1), cl=q=>q===0?0:q===1?.6:1;
  const cloud=cl(k)*t+cl(kp)*(1-t), rain=(k===2?t:0)+(kp===2?1-t:0);
  let wet=k===2?clamp(f/.15,0,1):kp===2?clamp(1-f/.35,0,1):0;
  return {k,name:WX_NAMES[k],ico:WX_ICO[k],cloud,rain,wet,dark:.09*cloud+.13*rain,raining:k===2&&t>.5,end:(slot+1)*WX_SLOT};}
const wxMul={tour:()=>{const w=weatherNow(Date.now()); return w.k===2?.8:w.k===0?1.05:1;}};
// efeito da chuva: plantações crescem mais rápido (chamado a cada segundo)
function weatherTick(now){const w=weatherNow(now); if(!w.raining)return; let ch=false;
  for(const b of S.b){if(b.k==='plot'&&b.s&&now<b.a){b.a-=500; ch=true;}} if(ch)markDirty();}
// sombras de nuvem que passam pelo mapa
let CLOUDC=null; function cloudImg(){if(CLOUDC)return CLOUDC; const c2=document.createElement('canvas'); c2.width=256; c2.height=128; const c=c2.getContext('2d');
  for(const [x,y,r] of [[90,64,60],[150,58,52],[60,70,40],[190,72,42],[125,80,48]]){const gr=c.createRadialGradient(x,y,0,x,y,r); gr.addColorStop(0,'rgba(20,30,45,.9)'); gr.addColorStop(1,'rgba(20,30,45,0)'); c.fillStyle=gr; c.fillRect(0,0,256,128);}
  return CLOUDC=c2;}
function cloudShadows(now,W,vx,vy,vw,vh){if(W.cloud<.05)return; const t=now/1000;
  for(let k=0;k<9;k++){const sp=6+(k%3)*2, wx=((k*397+t*sp)%(N*64+800))-N*32-400, wy=((k*211)%(N*32))+((k*53)%40);
    const w=500+(k%4)*160, h=w/2; if(wx+w<vx||wx>vx+vw||wy+h<vy||wy>vy+vh)continue; pImg(cloudImg(),wx,wy,w,h,.16*W.cloud);}}
