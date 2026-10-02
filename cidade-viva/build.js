// Junta src/ em um único index.html (o artifact publicado é um arquivo só).
const fs=require('fs'), path=require('path');
const d=__dirname, js=fs.readdirSync(d+'/src/js').filter(f=>f.endsWith('.js')).sort();
const body=js.map(f=>'/* ---- '+f+' ---- */\n'+fs.readFileSync(d+'/src/js/'+f,'utf8')).join('\n');
const out=fs.readFileSync(d+'/src/head.html','utf8')+"'use strict';\n"+body+fs.readFileSync(d+'/src/tail.html','utf8');
fs.writeFileSync(d+'/index.html',out);
console.log('index.html',(out.length/1024).toFixed(1)+'KB', js.length,'partes');
