/* ================= Catálogo =================
 cat: res biz fun svc mon farm log deco
 art: {f:desenho,...parâmetros}  slug: nome do arquivo de imagem */
const CATS=[['res','Casas'],['biz','Comércio'],['fun','Lazer'],['svc','Serviços'],['mon','Monumentos'],['ind','Indústria'],['farm','Fazenda'],['log','Logística'],['deco','Decoração']];
const T={};
function def(k,o){T[k]=Object.assign({k,lvl:1,time:0,w:1,h:1},o); if(!T[k].slug)T[k].slug=k;}

// ---- Moradia popular
def('casinha',{cat:'res',cls:'b',name:'Casinha Simples',slug:'casinha-simples',lv:1,cost:100,time:5,w:2,h:2,pop:12,rent:22,rt:60,
  art:{f:'house',lot:'g',wall:'#9cc3d6',roof:'#c8653f',rt:'gable',H:18,porch:1,chair:1}});
def('chale',{cat:'res',cls:'b',name:'Chalé de Madeira',slug:'chale-de-madeira',lv:1,cost:150,time:8,w:2,h:2,pop:15,rent:30,rt:90,
  art:{f:'house',lot:'g',wall:'#b07a4a',roof:'#9aa4ad',rt:'gabley',H:17,planks:1,laundry:1}});
def('geminadas',{cat:'res',cls:'b',name:'Casas Geminadas',slug:'casas-geminadas',lv:2,cost:300,time:15,w:2,h:2,pop:25,rent:52,rt:150,
  art:{f:'row',lot:'g',cols:['#f2d36b','#8fd9c4'],roof:'#c8653f',H:18}});
def('vila',{cat:'res',cls:'b',name:'Vila de Casinhas',slug:'vila-de-casinhas',lv:3,cost:600,time:25,w:3,h:2,pop:40,rent:95,rt:240,
  art:{f:'row',lot:'g',cols:['#f4a7b9','#f3e3c3','#a9cfee'],roof:'#c8653f',H:18}});
def('predio-tijolo',{cat:'res',cls:'b',name:'Prédio de Tijolo',slug:'predio-de-tijolo',lv:6,cost:2800,time:90,w:2,h:2,pop:110,rent:240,rt:900,
  art:{f:'brick',lot:'p',wall:'#b5523b',fl:5,esc:1,tank:1,ac:1}});
// ---- Subúrbio (classe média)
def('suburbana',{cat:'res',cls:'m',name:'Casa Suburbana Térrea',slug:'casa-suburbana-terrea',lv:4,cost:900,time:40,w:2,h:2,pop:35,rent:125,rt:300,
  art:{f:'house',lot:'g',wall:'#f3e3a0',roof:'#6f7780',rt:'hip',H:17,garage:1,siding:1}});
def('sobrado-sub',{cat:'res',cls:'m',name:'Sobrado Suburbano',slug:'sobrado-suburbano',lv:5,cost:1500,time:60,w:3,h:2,pop:50,rent:205,rt:420,
  art:{f:'house',lot:'g',wall:'#f2a38a',roof:'#7a4b33',rt:'gable',H:30,fl:2,porch:1,garage:1,siding:1}});
def('rancho',{cat:'res',cls:'m',name:'Casa Rancho',slug:'casa-rancho',lv:6,cost:2200,time:90,w:3,h:2,pop:55,rent:300,rt:600,
  art:{f:'house',lot:'g',wall:'#a9cfe8',roof:'#4f565e',rt:'hip',H:16,brick:1,garage:1,low:1}});
def('colonial',{cat:'res',cls:'m',name:'Casa Colonial Mediterrânea',slug:'casa-colonial-mediterranea',lv:7,cost:3000,time:120,w:3,h:2,pop:60,rent:420,rt:900,
  art:{f:'house',lot:'g',wall:'#f7f3ea',roof:'#cf6b3d',rt:'hip',H:30,fl:2,shut:'#2f6fb5',balcony:1}});
def('moderna',{cat:'res',cls:'m',name:'Casa Moderna',slug:'casa-moderna',lv:9,cost:4500,time:150,w:3,h:2,pop:65,rent:600,rt:1200,
  art:{f:'modern',lot:'g',wall:'#f4f4f2',wood:'#b8834f'}});
def('brownstone',{cat:'res',cls:'m',name:'Brownstone',slug:'brownstone',lv:5,cost:2000,time:60,w:2,h:2,pop:80,rent:190,rt:600,
  art:{f:'brick',lot:'p',wall:'#7b4a32',fl:4,stoop:1,cornice:'#4a2c1e'}});
def('esquina',{cat:'res',cls:'m',name:'Prédio de Esquina com Lojinha',slug:'predio-de-esquina-com-lojinha',lv:8,cost:4200,time:120,w:3,h:2,pop:130,rent:380,rt:1200,
  serve:{com:3},art:{f:'brick',lot:'p',wall:'#d6b77a',fl:4,esc:1,shop:'#3a9a5b'}});
def('fileira',{cat:'res',cls:'m',name:'Fileira de Brownstones',slug:'fileira-de-brownstones',lv:10,cost:6000,time:180,w:4,h:2,pop:150,rent:520,rt:1500,
  art:{f:'rowapt',lot:'p',cols:['#7b4a32','#b5523b','#8d8f94'],fl:3}});
def('lofts',{cat:'res',cls:'m',name:'Lofts na Antiga Fábrica',slug:'lofts-na-antiga-fabrica',lv:12,cost:9000,time:300,w:3,h:3,pop:220,rent:800,rt:2400,
  art:{f:'brick',lot:'p',wall:'#a8473a',fl:5,big:1,chimney:1,terrace:1}});
def('sobrado-chines',{cat:'res',cls:'m',name:'Sobrado Chinês',slug:'sobrado-chines',lv:8,cost:3500,time:90,w:2,h:2,pop:70,rent:300,rt:900,
  art:{f:'chinese',lot:'p',wall:'#f1e3c8',roof:'#3f8f5f',fl:2,lant:1}});
def('predio-chines',{cat:'res',cls:'m',name:'Prédio Chinês com Loja',slug:'predio-chines-com-loja',lv:11,cost:7000,time:240,w:3,h:2,pop:160,rent:600,rt:1800,
  serve:{com:3},art:{f:'chinapt',lot:'p',wall:'#e9d6b9',fl:4}});
def('edificio',{cat:'res',cls:'m',name:'Edifício Residencial',slug:'edificio-residencial',lv:13,cost:14000,time:480,w:3,h:3,pop:320,rent:1000,rt:3600,
  art:{f:'tower',lot:'p',wall:'#e8dcc4',glass:'#a9cfe0',H:110,balc:1}});
// ---- Classe alta
def('condominio',{cat:'res',cls:'a',name:'Condomínio com Piscina',slug:'condominio-com-piscina',lv:16,cost:24000,time:600,w:3,h:3,pop:260,rent:1800,rt:3600,
  art:{f:'condo',lot:'g',wall:'#f6f1e8',trim:'#c9714a'}});
def('torre-vidro',{cat:'res',cls:'a',name:'Torre de Vidro',slug:'torre-de-vidro',lv:19,cost:38000,time:900,w:3,h:3,pop:450,rent:2600,rt:5400,
  art:{f:'tower',lot:'p',wall:'#7fc3dc',glass:'#bfe9f7',H:150,bands:1,roofgreen:1}});
def('arranha-ceu',{cat:'res',cls:'a',name:'Arranha-céu Residencial',slug:'arranha-ceu-residencial',lv:24,cost:80000,time:1500,w:4,h:4,pop:900,rent:5200,rt:7200,
  art:{f:'tower',lot:'p',wall:'#3d5a80',glass:'#9ec3e6',H:230,step:1,crown:1,stone:'#e5e1d6'},glow:[[2,2,250,26,'255,230,150']]});
def('mansao-classica',{cat:'res',cls:'a',name:'Mansão Clássica',slug:'mansao-classica',lv:15,cost:20000,time:600,w:3,h:3,pop:60,rent:1600,rt:2400,
  art:{f:'mansion',lot:'g',wall:'#efe4cc',roof:'#5c6670',cols:1}});
def('vila-moderna',{cat:'res',cls:'a',name:'Vila Moderna',slug:'vila-moderna',lv:18,cost:32000,time:720,w:3,h:3,pop:70,rent:2400,rt:3600,
  art:{f:'villa',lot:'g'}});
def('mansao-med',{cat:'res',cls:'a',name:'Mansão Mediterrânea com Piscina',slug:'mansao-mediterranea-com-piscina',lv:21,cost:50000,time:900,w:4,h:3,pop:90,rent:3600,rt:4800,
  art:{f:'mansion',lot:'g',wall:'#e9cf9f',roof:'#c96a3b',arches:1,pool:1}});
def('grande-mansao',{cat:'res',cls:'a',name:'Grande Mansão com Piscina',slug:'grande-mansao-com-piscina',lv:26,cost:90000,time:1200,w:4,h:4,pop:120,rent:6000,rt:7200,
  art:{f:'mansion',lot:'g',wall:'#f7f5ef',roof:'#2f4a78',cols:1,pool:1,fl:3,fountain:1,tennis:1}});

// ---- Comércio
def('padaria',{cat:'biz',name:'Padaria',slug:'padaria',lv:1,cost:200,time:10,w:2,h:2,sup:8,pay:50,bt:60,
  art:{f:'shop',lot:'p',wall:'#f5e6c4',awn:'#d64545',sign:'bread'}});
def('pizzaria',{cat:'biz',name:'Pizzaria',slug:'pizzaria',lv:3,cost:700,time:30,w:2,h:2,sup:20,pay:140,bt:180,
  art:{f:'shop',lot:'p',wall:'#b4553f',awn:'#2f8f57',sign:'pizza',brick:1}});
def('farmacia',{cat:'biz',name:'Farmácia',slug:'farmacia',lv:4,cost:1200,time:45,w:2,h:2,sup:25,pay:200,bt:300,serve:{sau:4},
  art:{f:'shop',lot:'p',wall:'#f7f9f8',awn:'#2fa36a',sign:'cross',flat:1},glow:[[1.9,1.3,26,10,'90,255,150']]});
def('mercadinho',{cat:'biz',name:'Mercadinho Chinês',slug:'mercadinho-chines',lv:6,cost:2000,time:60,w:2,h:2,sup:35,pay:300,bt:420,
  art:{f:'shop',lot:'p',wall:'#efe1c2',awn:'#c8322f',sign:'crates',chinese:1}});
def('roupas',{cat:'biz',name:'Loja de Roupas',slug:'loja-de-roupas',lv:7,cost:2600,time:90,w:2,h:2,sup:45,pay:420,bt:600,
  art:{f:'shop',lot:'p',wall:'#f6c4d3',awn:'#2b2b33',sign:'hanger',fl:2}});
def('lanchonete',{cat:'biz',name:'Lanchonete Retrô',slug:'lanchonete-retro',lv:9,cost:4500,time:150,w:3,h:2,sup:70,pay:700,bt:900,
  art:{f:'diner'},glow:[[1.5,.6,34,16,'255,80,120']]});
def('pousada',{cat:'biz',beds:30,name:'Pousada',slug:'pousada',lv:9,cost:5000,time:150,w:3,h:2,sup:60,pay:650,bt:900,
  art:{f:'house',lot:'g',wall:'#fff1c9',roof:'#3f7d6e',rt:'hip',H:30,fl:2,porch:1,shut:'#3f7d6e'}});
def('restaurante',{cat:'biz',name:'Restaurante Chinês',slug:'restaurante-chines',lv:11,cost:7000,time:240,w:3,h:2,sup:100,pay:1000,bt:1200,
  art:{f:'chinese',lot:'p',wall:'#c8322f',roof:'#d9a520',fl:2,lant:1,shop:1}});
def('supermercado',{cat:'biz',name:'Supermercado',slug:'supermercado',lv:14,cost:16000,time:480,w:4,h:3,sup:200,pay:2400,bt:2400,
  art:{f:'market'}});
def('hotel',{cat:'biz',beds:80,name:'Hotel',slug:'hotel',lv:17,cost:30000,time:720,w:3,h:3,sup:300,pay:4200,bt:3600,
  art:{f:'tower',lot:'p',wall:'#efe3cf',glass:'#a9cfe0',H:100,hotel:1},glow:[[1.5,1.5,108,18,'255,215,120']]});
def('shopping',{cat:'biz',name:'Shopping',slug:'shopping',lv:22,cost:60000,time:1200,w:4,h:4,sup:500,pay:8000,bt:7200,
  art:{f:'mall'}});

// ---- Lazer (diversão)
def('pracinha',{cat:'fun',name:'Pracinha',slug:'pracinha',lv:2,cost:400,time:15,w:2,h:2,serve:{fun:4},art:{f:'park',size:2,play:1}});
def('quadra',{cat:'fun',name:'Quadra de Basquete',slug:'quadra-de-basquete',lv:3,cost:600,time:20,w:2,h:2,serve:{fun:4},art:{f:'court'}});
def('fliperama',{cat:'fun',name:'Fliperama',slug:'fliperama',lv:5,cost:1500,time:45,w:2,h:2,serve:{fun:5},art:{f:'arcade'},glow:[[1,1,30,16,'200,90,255']]});
def('futebol',{cat:'fun',name:'Campo de Futebol de Bairro',slug:'campo-de-futebol-de-bairro',lv:6,cost:2500,time:60,w:3,h:2,serve:{fun:6},art:{f:'field'},
  glow:[[.1,.1,40,14,'255,250,220'],[2.9,.1,40,14,'255,250,220'],[.1,1.9,40,14,'255,250,220'],[2.9,1.9,40,14,'255,250,220']]});
def('boliche',{cat:'fun',name:'Boliche',slug:'boliche',lv:8,cost:4000,time:120,w:3,h:2,serve:{fun:6},art:{f:'bowling'},glow:[[1.5,1,40,16,'120,240,255']]});
def('parque-bairro',{cat:'fun',name:'Parque do Bairro',slug:'parque-do-bairro',lv:9,cost:5000,time:120,w:3,h:3,serve:{fun:7},buff:{rent:5,r:5},art:{f:'park',size:3,pond:1,gazebo:1}});
def('piscina',{cat:'fun',name:'Piscina Pública',slug:'piscina-publica',lv:10,cost:7000,time:180,w:3,h:3,serve:{fun:7},art:{f:'pool'}});
def('cinema',{cat:'fun',name:'Cinema com Holofotes',slug:'cinema-com-holofotes',lv:12,cost:10000,time:300,w:3,h:3,serve:{fun:8},art:{f:'cinema'},search:1,
  glow:[[1.5,2.95,16,22,'255,220,120']]});
def('estadio-medio',{cat:'fun',name:'Estádio Médio',slug:'estadio-medio',lv:15,cost:25000,time:600,w:4,h:4,serve:{fun:11},art:{f:'stadium'},
  glow:[[.2,.2,62,20,'255,250,220'],[3.8,.2,62,20,'255,250,220'],[.2,3.8,62,20,'255,250,220'],[3.8,3.8,62,20,'255,250,220']]});
def('parque-central',{cat:'fun',name:'Parque Central',slug:'parque-central',lv:17,cost:30000,time:600,w:4,h:4,serve:{fun:10},buff:{rent:10,r:7},art:{f:'park',size:4,pond:2,kiosk:1}});
def('cassino',{cat:'fun',name:'Cassino',slug:'cassino',lv:20,cost:45000,time:900,w:4,h:3,serve:{fun:10},buff:{rent:5,r:8},art:{f:'casino'},glow:[[2,1.5,50,40,'255,200,80']]});
def('golfe',{cat:'fun',name:'Campo de Golfe',slug:'campo-de-golfe',lv:23,cost:60000,time:900,w:4,h:4,serve:{fun:10},buff:{rent:10,r:8},art:{f:'golf'}});
def('grande-estadio',{cat:'fun',name:'Grande Estádio',slug:'grande-estadio',lv:28,cost:120000,time:1800,w:5,h:5,serve:{fun:16},buff:{rent:10,r:12},art:{f:'oval'},
  glow:[[.5,.5,64,26,'255,250,220'],[4.5,.5,64,26,'255,250,220'],[.5,4.5,64,26,'255,250,220'],[4.5,4.5,64,26,'255,250,220']]});

// ---- Serviços
def('posto',{cat:'svc',name:'Posto de Saúde',slug:'posto-de-saude',lv:2,cost:600,time:20,w:2,h:2,cap:100,serve:{sau:6},art:{f:'civic',lot:'g',wall:'#fbfbf8',trim:'#d64545',H:18,sym:'cross'}});
def('igreja',{cat:'svc',name:'Igreja',slug:'igreja',lv:4,cost:1800,time:60,w:3,h:2,cap:120,serve:{fe:7},art:{f:'church'}});
def('escola',{cat:'svc',name:'Escola',slug:'escola',lv:5,cost:2500,time:90,w:3,h:3,cap:250,serve:{edu:8},buff:{rent:10,r:8},art:{f:'civic',lot:'g',wall:'#b4553f',trim:'#fff4e0',H:30,sym:'clock',flag:1,yard:1}});
def('delegacia',{cat:'svc',name:'Delegacia',slug:'delegacia',lv:7,cost:4000,time:120,w:3,h:2,cap:220,buff:{rent:5,r:8},art:{f:'civic',lot:'p',wall:'#9aa1a8',trim:'#2b5ea8',H:28,sym:'shield',flag:1},glow:[[1.5,1.95,14,8,'90,150,255']]});
def('bombeiros',{cat:'svc',name:'Corpo de Bombeiros',slug:'corpo-de-bombeiros',lv:8,cost:5000,time:150,w:3,h:2,cap:250,buff:{rent:5,r:8},art:{f:'fire'}});
def('biblioteca',{cat:'svc',name:'Biblioteca',slug:'biblioteca',lv:9,cost:6000,time:180,w:3,h:2,cap:180,serve:{edu:6},buff:{xp:25,r:6},art:{f:'library'}});
def('mesquita',{cat:'svc',name:'Mesquita',slug:'mesquita',lv:10,cost:7000,time:240,w:3,h:3,cap:250,serve:{fe:9},art:{f:'mosque'}});
def('templo',{cat:'svc',name:'Templo Chinês',slug:'templo-chines',lv:12,cost:9000,time:300,w:3,h:3,cap:250,serve:{fe:9},art:{f:'temple'}});
def('hospital',{cat:'svc',name:'Hospital',slug:'hospital',lv:13,cost:15000,time:480,w:4,h:3,cap:800,serve:{sau:12},art:{f:'hospital'},glow:[[3.6,.6,70,12,'255,80,80']]});
def('universidade',{cat:'svc',name:'Universidade',slug:'universidade',lv:21,cost:70000,time:1200,w:4,h:4,cap:2500,serve:{edu:14},buff:{rent:15,xp:25,r:14},art:{f:'uni'}});

// ---- Monumentos
def('hall',{cat:'mon',name:'Prefeitura',slug:'prefeitura',lv:999,cost:0,w:3,h:3,cap:150,store:200,fixed:1,art:{f:'hall'}});
def('eiffel',{cat:'mon',name:'Torre Eiffel',slug:'torre-eiffel',lv:14,cost:30000,mat:{steel:25,stone:20,tools:4},time:900,w:3,h:3,cap:500,serve:{fun:10},buff:{rent:20,r:12},max:1,art:{f:'eiffel'},
  glow:[[1.5,1.5,215,10,'255,230,160'],[1.5,1.5,120,26,'255,200,110']]});
def('coliseu',{cat:'mon',name:'Coliseu',slug:'coliseu',lv:18,cost:50000,mat:{stone:60,wood:20,tools:6},time:1200,w:4,h:4,cap:800,serve:{fun:12},buff:{rent:25,r:14},max:1,art:{f:'colosseum'}});
def('copan',{cat:'res',cls:'m',mon:1,name:'Edifício Copan',slug:'edificio-copan',lv:20,cost:60000,mat:{stone:40,steel:20,tools:8},time:1200,w:4,h:2,pop:1200,rent:4000,rt:5400,buff:{rent:15,r:10},max:1,art:{f:'copan'}});

// ---- Fazenda e logística
def('plot',{cat:'farm',name:'Terreno de Plantio',slug:'terreno-de-plantio',lv:1,cost:50,w:2,h:2,flat:1});
def('galpao',{cat:'log',name:'Galpão',slug:'galpao',lv:1,cost:400,time:15,w:2,h:2,store:150,art:{f:'barn',wall:'#c0392b',roof:'#6b5b52',lot:'g'}});
def('estacao',{cat:'log',name:'Estação de Trem',slug:'estacao-de-trem',lv:3,cost:1500,time:60,w:4,h:2,max:1,art:{f:'station'}});
def('celeiro',{cat:'log',name:'Celeiro',slug:'celeiro',lv:4,cost:1500,time:60,w:2,h:2,store:400,art:{f:'barn',wall:'#8c2f39',roof:'#4b3a30',lot:'g',tall:1,silo:1}});
def('armazem',{cat:'log',name:'Armazém',slug:'armazem',lv:11,cost:7000,time:300,w:3,h:3,store:1200,art:{f:'ware'}});

// ---- Decoração
def('arvore',{cat:'deco',name:'Árvore de Rua',slug:'arvore-de-rua',lv:1,cost:60,bonus:2,art:{f:'tree'}});
def('flores',{cat:'deco',name:'Canteiro de Flores',slug:'canteiro-de-flores',lv:1,cost:40,bonus:1,art:{f:'flowers'}});
def('banco',{cat:'deco',name:'Banco de Praça',slug:'banco-de-praca',lv:2,cost:150,bonus:3,art:{f:'bench'}});
def('hidrante',{cat:'deco',name:'Hidrante',slug:'hidrante',lv:2,cost:80,bonus:1,art:{f:'hydrant'}});
def('poste',{cat:'deco',name:'Poste de Luz',slug:'poste-de-luz',lv:3,cost:300,bonus:3,art:{f:'lamp'},lamp:1});
def('ipe',{cat:'deco',name:'Ipê Amarelo',slug:'ipe-amarelo',lv:5,cost:600,bonus:5,art:{f:'ipe'}});
def('chafariz',{cat:'deco',name:'Chafariz',slug:'chafariz',lv:7,cost:1500,w:2,h:2,bonus:8,art:{f:'fountain'}});
def('estatua',{cat:'deco',name:'Estátua',slug:'estatua',lv:10,cost:2500,bonus:10,art:{f:'statue'}});
def('portal',{cat:'deco',name:'Portal de Chinatown',slug:'portal-de-chinatown',lv:11,cost:4000,w:2,h:1,bonus:12,art:{f:'gate'},glow:[[1,.5,26,14,'255,90,60']]});
def('coreto',{cat:'deco',name:'Coreto',slug:'coreto',lv:13,cost:5000,w:2,h:2,bonus:14,art:{f:'bandstand'}});

// ---- Obstáculos (aparecem nos terrenos)
const OB={1:{name:'Árvore Grande',slug:'obstaculo-arvore-grande',cost:15,wood:3,stone:0,xp:3,art:{f:'bigtree'}},
  2:{name:'Pinheiro',slug:'obstaculo-pinheiro',cost:15,wood:2,stone:0,xp:2,art:{f:'pine'}},
  3:{name:'Pedra Grande',slug:'obstaculo-pedra-grande',cost:30,wood:0,stone:3,xp:4,art:{f:'rock'}},
  4:{name:'Arbusto',slug:'obstaculo-arbusto',cost:0,wood:0,stone:0,xp:1,coins:8,art:{f:'bush'}},
  5:{name:'Cacto',slug:'obstaculo-cacto',cost:10,wood:1,stone:0,xp:2,art:{f:'cactus'}}};
// ---- Veículos (imagens opcionais: frente e traseira)
const CARS=[{id:'hatch',name:'Hatch',col:'#d63c3c',len:.36,wid:.2,h:6},{id:'seda',name:'Sedã',col:'#24407a',len:.42,wid:.21,h:6},
  {id:'taxi',name:'Táxi',col:'#f2c230',len:.42,wid:.21,h:6,taxi:1},{id:'picape',name:'Picape',col:'#f2f2ee',len:.46,wid:.22,h:7,bed:1},
  {id:'onibus',name:'Ônibus',col:'#2f9a5a',len:.82,wid:.24,h:13,bus:1}];


// Indústria: rec = receita {in, out, c(moedas), t(segundos)}
def('madeireira',{cat:'ind',name:'Madeireira',slug:'madeireira',lv:4,cost:1500,time:60,w:3,h:2,rec:{in:{},out:{wood:4},c:30,t:60},art:{f:'lumber'}});
def('pedreira',{cat:'ind',name:'Pedreira',slug:'pedreira',lv:5,cost:2200,time:90,w:3,h:3,rec:{in:{},out:{stone:4},c:40,t:75},art:{f:'quarry'}});
def('siderurgica',{cat:'ind',name:'Siderúrgica',slug:'siderurgica',lv:8,cost:5000,time:150,w:3,h:3,rec:{in:{stone:2},out:{steel:3},c:60,t:120},art:{f:'steel'},glow:[[1.6,1.2,24,22,'255,140,40']]});
def('ferramentas',{cat:'ind',name:'Loja de Ferramentas',slug:'loja-de-ferramentas',lv:8,cost:3500,time:120,w:2,h:2,rec:{in:{wood:2,steel:1},out:{tools:2},c:20,t:90},art:{f:'shop',lot:'p',wall:'#9aa1a8',awn:'#d64545',sign:'tools'}});
def('borracha',{cat:'ind',name:'Fábrica de Borracha',slug:'fabrica-de-borracha',lv:10,cost:6000,time:180,w:3,h:3,rec:{in:{},out:{rubber:4},c:50,t:120},art:{f:'rubber'}});
def('pneus',{cat:'ind',name:'Fábrica de Pneus',slug:'fabrica-de-pneus',lv:11,cost:8000,time:240,w:3,h:3,rec:{in:{rubber:3},out:{tires:2},c:40,t:150},art:{f:'tirefac'}});
def('montadora',{cat:'ind',name:'Montadora de Carros',slug:'montadora-de-carros',lv:14,cost:20000,time:480,w:4,h:3,rec:{in:{steel:3,tires:4},out:{cars:1},c:100,t:300},art:{f:'carfac'}});
def('hidreletrica',{cat:'ind',name:'Hidrelétrica',slug:'hidreletrica',lv:12,cost:15000,time:420,w:3,h:2,hydro:1,mat:{stone:30,steel:15},pay:1800,bt:1200,art:{f:'dam'}});
// Lojas que vendem produtos da indústria
def('borracharia',{cat:'biz',name:'Borracharia',slug:'borracharia',lv:11,cost:4000,time:120,w:2,h:2,item:'tires',sup:2,pay:900,bt:600,art:{f:'shop',lot:'c',wall:'#f2c230',awn:'#2b2b33',sign:'tire'}});
def('concessionaria',{cat:'biz',name:'Concessionária',slug:'concessionaria',lv:15,cost:18000,time:420,w:3,h:3,item:'cars',sup:1,pay:4200,bt:1800,art:{f:'dealer'}});
// Logística e turismo
def('porto',{cat:'log',name:'Porto',slug:'porto',lv:12,cost:12000,time:360,w:4,h:2,port:1,mat:{wood:20,steel:10},art:{f:'port'}});
def('resort',{cat:'biz',name:'Resort de Praia',slug:'resort-de-praia',lv:19,cost:40000,time:900,w:4,h:4,beds:150,sup:250,pay:5200,bt:3600,art:{f:'resort'},glow:[[2,2,60,30,'255,200,120']]});

