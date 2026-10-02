/* ================= Conteúdo novo: prédios, leis, tecnologias, cadeias e pedidos =================
 Para criar um prédio novo: defN('chave',{cat,name,slug,lv,cost,time,w,h,...,art:{f:'desenho'}}) e um ART.desenho em 08b-arte-nova.js.
 excl:'cadeia' / excl:'pedido' = só libera pela cadeia de missões ou pelo pedido de morador (S.unl[chave]).
 tech:'id' = precisa da tecnologia pesquisada no Campus. place:'morro'|'deserto'|'praia'|'agua' = regra de terreno. */
CATS.splice(6,0,['eco','Energia']);
const defN=(k,o)=>def(k,Object.assign({nv:1},o)); // nv = tempos e materiais já finais

// ---- comércio, fazenda e cadeias
defN('mercado-agri',{cat:'biz',name:'Mercado de Agricultores',slug:'mercado-de-agricultores',lv:5,cost:2500,time:20,w:3,h:2,sup:30,pay:380,bt:420,serve:{com:4},art:{f:'farmmarket'}});
defN('cooperativa',{cat:'farm',excl:'cadeia',name:'Cooperativa Agrícola',slug:'cooperativa-agricola',lv:4,cost:6000,time:40,w:3,h:2,farmBuff:{r:8,yield:30,speed:20},art:{f:'coop'}});
defN('jardim-botanico',{cat:'fun',excl:'cadeia',name:'Jardim Botânico',slug:'jardim-botanico',lv:7,cost:18000,time:120,w:4,h:4,serve:{fun:9},buff:{rent:10,r:8},tour:12,sink:22,art:{f:'botanic'}});
defN('observatorio',{cat:'svc',excl:'cadeia',name:'Observatório',slug:'observatorio',lv:9,cost:20000,time:150,w:3,h:3,cap:150,serve:{edu:6},research:12,tour:10,art:{f:'observatory'},glow:[[1.5,1.5,46,10,'160,200,255']]});
defN('roda-gigante',{cat:'fun',excl:'cadeia',name:'Roda-gigante',slug:'roda-gigante',lv:10,cost:28000,time:160,w:3,h:3,serve:{fun:10},buff:{rent:5,r:8},tour:18,art:{f:'ferris'},anim:'ferris'});
defN('museu-industria',{cat:'mon',excl:'cadeia',name:'Museu da Indústria',slug:'museu-da-industria',lv:9,cost:24000,time:160,w:4,h:3,cap:200,serve:{edu:5},tour:12,indBuff:10,art:{f:'museum'},glow:[[2,1.6,30,14,'255,190,120']]});
// ---- conhecimento e lazer grandes
defN('campus',{cat:'svc',name:'Campus Universitário',slug:'campus-universitario',lv:10,cost:25000,time:180,w:5,h:4,cap:600,serve:{edu:10},buff:{rent:10,xp:15,r:10},research:30,tour:6,mat:{wood:12,stone:16,tools:3},art:{f:'campus'},glow:[[2.5,2,40,20,'255,220,150']]});
defN('zoo',{cat:'fun',name:'Zoológico',slug:'zoologico',lv:14,cost:40000,time:240,w:5,h:4,serve:{fun:12},buff:{rent:8,r:9},tour:30,mat:{wood:25,stone:15,tools:4},art:{f:'zoo'},anim:'zoo'});
defN('farol',{cat:'fun',name:'Farol',slug:'farol',lv:12,cost:9000,time:90,w:2,h:2,serve:{fun:5},tour:10,place:'praia',mat:{stone:12},art:{f:'lighthouse'},anim:'farol'});
// ---- logística
defN('aeroporto',{cat:'log',name:'Aeroporto',slug:'aeroporto',lv:18,tech:'aviacao',cost:90000,time:300,w:7,h:4,tour:60,air:1,mat:{steel:30,stone:40,tools:8},art:{f:'airport'},anim:'air',
  glow:[[6.5,.4,10,6,'255,80,80'],[.4,3.6,10,6,'120,255,140'],[3.5,1,40,14,'255,230,160']]});
defN('marina',{cat:'log',name:'Marina',slug:'marina',lv:16,cost:22000,time:200,w:4,h:2,port:1,marina:1,tour:14,mat:{wood:20,steel:6},art:{f:'marina'},anim:'iate'});
// ---- energia limpa e mineração
defN('eolica',{cat:'eco',name:'Turbina Eólica',slug:'turbina-eolica',lv:10,tech:'eolica',cost:6000,time:60,w:1,h:1,gen:1,pay:260,bt:900,clean:1,place:'morro',mat:{steel:4},art:{f:'windmill'},anim:'eolica'});
defN('solar',{cat:'eco',name:'Usina Solar',slug:'usina-solar',lv:10,tech:'solar',cost:8000,time:80,w:3,h:3,gen:1,pay:420,bt:1200,clean:1,place:'deserto',mat:{steel:5,tools:1},art:{f:'solar'}});
defN('mina-montanha',{cat:'ind',name:'Mina de Ferro',slug:'mina-de-ferro',lv:9,tech:'mineracao',cost:6000,time:60,w:3,h:2,place:'morro',rec:{in:{},out:{ore:4},c:40,t:120},poll:10,art:{f:'mine'}});
defN('mina-deserto',{cat:'ind',name:'Mina de Calcário',slug:'mina-de-calcario',lv:9,tech:'mineracao',cost:5000,time:50,w:3,h:3,place:'deserto',rec:{in:{},out:{lime:3},c:30,t:100},poll:8,art:{f:'quarryd'}});
// ---- liberados por pedidos de moradores
defN('horta',{cat:'deco',excl:'pedido',name:'Horta Comunitária',slug:'horta-comunitaria',lv:1,cost:500,w:2,h:2,bonus:8,sink:4,art:{f:'garden'}});
defN('mural',{cat:'deco',excl:'pedido',name:'Mural de Grafite',slug:'mural-de-grafite',lv:1,cost:400,w:1,h:1,bonus:6,art:{f:'mural'}});
defN('parquinho',{cat:'fun',excl:'pedido',name:'Parquinho',slug:'parquinho',lv:1,cost:900,w:2,h:2,serve:{fun:4},art:{f:'playground'}});
defN('bebedouro',{cat:'deco',excl:'pedido',name:'Bebedouro',slug:'bebedouro',lv:1,cost:200,bonus:3,art:{f:'drinker'}});
defN('quiosque',{cat:'deco',excl:'pedido',name:'Quiosque de Coco',slug:'quiosque-de-coco',lv:1,cost:600,bonus:5,tour:1,art:{f:'kiosk'}});
// enfeites novos (imagens do sprite sheet de decoração; o desenho em código é só reserva)
defN('lixeira',{cat:'deco',name:'Lixeira',slug:'lixeira',lv:1,cost:40,bonus:1,art:{f:'hydrant'}});
defN('vaso',{cat:'deco',name:'Vaso de Plantas',slug:'vaso-de-plantas',lv:1,cost:50,bonus:1,art:{f:'flowers'}});
defN('correio',{cat:'deco',name:'Caixa de Correio',slug:'caixa-de-correio',lv:2,cost:60,bonus:1,art:{f:'hydrant'}});
defN('placa',{cat:'deco',name:'Placa de Direção',slug:'placa-de-direcao',lv:2,cost:80,bonus:1,art:{f:'lamp'}});
defN('cerca-viva',{cat:'deco',name:'Cerca Viva',slug:'cerca-viva',lv:3,cost:120,bonus:2,art:{f:'flowers'}});
defN('ponto-onibus',{cat:'deco',name:'Ponto de Ônibus',slug:'ponto-de-onibus',lv:4,cost:500,bonus:4,art:{f:'bench'}});
defN('relogio',{cat:'deco',name:'Relógio de Praça',slug:'relogio-de-praca',lv:6,cost:900,bonus:5,art:{f:'lamp'}});
defN('banco-mosaico',{cat:'deco',excl:'pedido',name:'Banco de Mosaico',slug:'banco-de-mosaico',lv:1,cost:350,bonus:4,art:{f:'mosaic'}});
// ajustes nos antigos
T.bombeiros.fireR=10; T.siderurgica.rec2={in:{ore:2,lime:1},out:{steel:5},c:60,t:120};
const POLL={madeireira:6,pedreira:10,siderurgica:22,ferramentas:4,borracha:12,pneus:14,montadora:18,porto:10,marina:3,aeroporto:24,'mina-montanha':10,'mina-deserto':8};
const SINK={pracinha:3,'parque-bairro':7,'parque-central':12,golfe:8,arvore:1.2,ipe:1.6,flores:.4,chafariz:1,horta:4,parquinho:2,'jardim-botanico':22,coreto:1,zoo:6,campus:3};
const PARKS=['pracinha','parque-bairro','parque-central','parquinho','jardim-botanico','golfe'];

