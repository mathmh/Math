// Junta src/ em um único index.html (o artifact publicado é um arquivo só).
const fs=require('fs'), path=require('path');
const d=__dirname, js=fs.readdirSync(d+'/src/js').filter(f=>f.endsWith('.js')).sort();
const body=js.map(f=>'/* ---- '+f+' ---- */\n'+fs.readFileSync(d+'/src/js/'+f,'utf8')).join('\n');
const out=fs.readFileSync(d+'/src/head.html','utf8')+"'use strict';\n"+body+fs.readFileSync(d+'/src/tail.html','utf8');
fs.writeFileSync(d+'/index.html',out);
console.log('index.html',(out.length/1024).toFixed(1)+'KB', js.length,'partes');
// cópia para o app Android/PWA: usa o pixi.min.js da própria pasta (funciona sem internet)
const CDN='<script src="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/7.4.2/pixi.min.js" crossorigin="anonymous"></script>';
if(!out.includes(CDN))throw new Error('linha do PixiJS não encontrada em head.html');
fs.mkdirSync(d+'/app-www',{recursive:true});
fs.writeFileSync(d+'/app-www/index.html',out.replace(CDN,'<script src="pixi.min.js"></script>'));
console.log('app-www/index.html (PixiJS local)');
// imagens prontas do mapa vão junto para o app
fs.rmSync(d+'/app-www/img',{recursive:true,force:true}); fs.cpSync(d+'/img',d+'/app-www/img',{recursive:true});
console.log('app-www/img', fs.readdirSync(d+'/img').length, 'imagens');
