/* ================= Constantes ================= */
const TW=64, TH=32, N=84, CH=12, NC=7, SS=2;
const SAVE_KEY='cidadeviva_save_v2', OLD_KEY='cidadeviva_save_v1', ART_KEY='cidadeviva_art_v1', OPT_KEY='cidadeviva_opts_v1';
const $=s=>document.querySelector(s);
const fmtN=n=>Math.floor(n).toLocaleString('pt-BR');
const fmtS=n=>n<10000?fmtN(n):n<100000?(Math.floor(n/100)/10).toLocaleString('pt-BR')+' mil':n<1e6?Math.floor(n/1000)+' mil':(Math.floor(n/1e5)/10).toLocaleString('pt-BR')+' mi';
function fmtT(s){s=Math.max(0,Math.ceil(s));if(s<60)return s+'s';if(s<3600){const m=Math.floor(s/60),r=s%60;return m+'min'+(r?' '+r+'s':'');}
  const h=Math.floor(s/3600),m=Math.floor((s%3600)/60);return h+'h'+(m?' '+String(m).padStart(2,'0')+'min':'');}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function hsh(a,b,c){return ((a*73856093)^(b*19349663)^(c*83492791))>>>0;}
function rng(seed){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}

/* ================= Desejos e classes ================= */
const NEEDS=[['com','Comércio','#f08c2e'],['sau','Saúde','#e5484d'],['edu','Educação','#3e7bd6'],['fun','Diversão','#a64fd6'],['fe','Fé','#d4a017']];
const NEED_I={com:0,sau:1,edu:2,fun:3,fe:4};
const CLS={b:{name:'Classe baixa',base:.85,k:.3,col:'#8a9a5b'},m:{name:'Classe média',base:.75,k:.5,col:'#3e7bd6'},a:{name:'Classe alta',base:.6,k:.8,col:'#b8860b'}};
