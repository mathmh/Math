/* ================= Economia: plantações, trem, missões, XP, itens, turismo, bairros, coleções, títulos e eventos ================= */
const C={
  straw:{name:'Morango',lv:1,cost:15,t:30,g:10,xp:2,col:'#e63946'},
  corn:{name:'Milho',lv:2,cost:35,t:120,g:24,xp:3,col:'#f4d35e',tall:1},
  tomato:{name:'Tomate',lv:4,cost:60,t:300,g:45,xp:4,col:'#ff5a36'},
  pumpkin:{name:'Abóbora',lv:6,cost:100,t:900,g:90,xp:6,col:'#f77f00',big:1},
  wheat:{name:'Trigo',lv:8,cost:150,t:1800,g:150,xp:8,col:'#e9c46a',tall:1},
  grape:{name:'Uva',lv:11,cost:250,t:3600,g:270,xp:11,col:'#7b2cbf'},
  coffee:{name:'Café',lv:15,cost:400,t:7200,g:480,xp:15,col:'#9a3412'},
};
const TR={s:{name:'Carga pequena',lv:3,cost:100,t:120,g:60},m:{name:'Carga média',lv:5,cost:400,t:900,g:260},l:{name:'Carga grande',lv:8,cost:1500,t:3600,g:1100}};
const Q=[
 ['q1','Tenha 2 Casinhas Simples',{t:'own',k:'casinha',n:2},120,10],
 ['q2','Plante em 2 terrenos',{t:'stat',s:'plant',n:2},100,10],
 ['q3','Colete aluguel 3 vezes',{t:'stat',s:'rent',n:3},150,15],
 ['q4','Limpe 5 obstáculos',{t:'stat',s:'clear',n:5},150,15],
 ['q5','Abasteça comércios 2 vezes',{t:'stat',s:'supply',n:2},200,20],
 ['q6','Construa 6 trechos de rua',{t:'stat',s:'road',n:6},150,15],
 ['q7','Construa um Galpão',{t:'own',k:'galpao',n:1},250,20],
 ['q8','Chegue ao nível 3',{t:'lv',n:3},300,0],
 ['q9','Construa uma Pracinha',{t:'own',k:'pracinha',n:1},300,25],
 ['q10','Construa um Posto de Saúde',{t:'own',k:'posto',n:1},400,30],
 ['q11','Construa uma Vila de Casinhas',{t:'own',k:'vila',n:1},400,30],
 ['q12','Alcance 150 moradores',{t:'pop',n:150},400,30],
 ['q13','Construa uma ponte',{t:'stat',s:'bridge',n:1},400,30],
 ['q14','Construa a Estação de Trem',{t:'own',k:'estacao',n:1},500,40],
 ['q14b','Ligue a estação ao túnel com trilhos',{t:'rail',n:1},900,70],
 ['q15','Construa uma Igreja',{t:'own',k:'igreja',n:1},500,40],
 ['q16','Expanda a cidade',{t:'exp',n:1},800,60],
 ['q17','Construa uma Escola',{t:'own',k:'escola',n:1},800,60],
 ['q18','Deixe uma casa com os 5 desejos atendidos',{t:'happy',n:1},1000,80],
 ['q19','Chegue ao nível 6',{t:'lv',n:6},1000,0],
 ['q19b','Construa uma Madeireira',{t:'own',k:'madeireira',n:1},700,50],
 ['q19c','Faça uma rampa e suba o morro',{t:'stat',s:'terra',n:3},600,40],
 ['q20','Limpe 25 obstáculos',{t:'stat',s:'clear',n:25},900,70],
 ['q21','Crie 6 trechos de água',{t:'stat',s:'dig',n:6},700,60],
 ['q22','Alcance 500 moradores',{t:'pop',n:500},1500,100],
 ['q23','Construa um Fliperama',{t:'own',k:'fliperama',n:1},1200,80],
 ['q24','Construa um Brownstone',{t:'own',k:'brownstone',n:1},1200,80],
 ['q25','Chegue ao nível 10',{t:'lv',n:10},3000,0],
 ['q25b','Construa a Siderúrgica',{t:'own',k:'siderurgica',n:1},2500,150],
 ['q25c','Entregue 3 encomendas',{t:'stat',s:'order',n:3},2000,120],
 ['q26','Construa um Cinema com Holofotes',{t:'own',k:'cinema',n:1},2500,150],
 ['q27','Expanda a cidade 3 vezes',{t:'exp',n:3},4000,200],
 ['q28','Construa um Hospital',{t:'own',k:'hospital',n:1},5000,250],
 ['q28b','Construa uma Hidrelétrica',{t:'own',k:'hidreletrica',n:1},5000,250],
 ['q28c','Construa o Porto',{t:'own',k:'porto',n:1},5000,250],
 ['q29','Construa a Torre Eiffel',{t:'own',k:'eiffel',n:1},6000,300],
 ['q30','Alcance 2.000 moradores',{t:'pop',n:2000},6000,300],
 ['q31','Construa uma Mansão Clássica',{t:'own',k:'mansao-classica',n:1},6000,300],
 ['q32','Construa o Estádio Médio',{t:'own',k:'estadio-medio',n:1},8000,400],
 ['q33','Construa o Coliseu',{t:'own',k:'coliseu',n:1},12000,600],
 ['q34','Construa o Edifício Copan',{t:'own',k:'copan',n:1},15000,700],
 ['q35','Construa uma Universidade',{t:'own',k:'universidade',n:1},20000,800],
 ['q36','Expanda a cidade 10 vezes',{t:'exp',n:10},30000,1000],
 ['q37','Construa o Grande Estádio',{t:'own',k:'grande-estadio',n:1},40000,1500],
 ['q38','Chegue ao nível 30',{t:'lv',n:30},100000,0],
].map(([id,title,o,coins,xp])=>({id,title,o,coins,xp}));

const cumXp=L=>L<=1?0:Math.round(40*Math.pow(L-1,1.8));
const buildXp=t=>Math.max(1,Math.round(t.cost/40));
const rentXp=t=>Math.max(1,Math.round(t.rent/12));
const bizXp=t=>Math.max(1,Math.round(t.pay/15));
const expCost=k=>Math.round((900+1400*Math.pow(k,1.55))/50)*50;
const expPop=k=>60+75*k;
/* ================= Fase 2: produção, logística, turismo ================= */
const ITEMS={goods:{name:'Mercadorias',ico:'📦',val:4},wood:{name:'Madeira',ico:'🪵',val:15},stone:{name:'Pedra',ico:'🪨',val:15},
  steel:{name:'Aço',ico:'🔩',val:40},rubber:{name:'Borracha',ico:'⚫',val:30},tools:{name:'Ferramentas',ico:'🔧',val:90},tires:{name:'Pneus',ico:'🛞',val:110},cars:{name:'Carros',ico:'🚗',val:900}};
const MATS=['wood','stone','steel','rubber','tools','tires','cars'];
ITEMS.ore={name:'Minério de ferro',ico:'⛏️',val:30}; ITEMS.lime={name:'Calcário',ico:'🧱',val:22};
MATS.push('ore','lime');
// Turismo: pontos de atração
const TOUR={eiffel:40,coliseu:50,copan:25,cinema:6,cassino:15,'estadio-medio':10,'grande-estadio':25,golfe:8,'parque-central':8,piscina:4,boliche:3,portal:4,templo:6,mesquita:4,igreja:2,universidade:5,resort:20,hall:3,shopping:6,'parque-bairro':3,chafariz:1,coreto:2};
for(const k in TOUR)if(T[k])T[k].tour=TOUR[k];

// Bairros temáticos (bônus de conjunto)
const SETS={china:{name:'Chinatown',keys:['sobrado-chines','predio-chines','restaurante','mercadinho','templo','portal']},
  brooklyn:{name:'Brooklyn',keys:['brownstone','predio-tijolo','esquina','fileira','lofts']},
  suburbio:{name:'Subúrbio',keys:['suburbana','sobrado-sub','rancho','colonial','moderna']},
  popular:{name:'Vila Popular',keys:['casinha','chale','geminadas','vila']},
  luxo:{name:'Bairro Nobre',keys:['mansao-classica','vila-moderna','mansao-med','grande-mansao','condominio']}};
for(const id in SETS)for(const k of SETS[id].keys)if(T[k])T[k].set=id;

// Coleções
const COLS={selos:{name:'Selos antigos',src:'Aluguel de casas',items:['Selo do Bonde','Selo da Praia','Selo do Farol','Selo do Ipê','Selo do Carnaval'],coins:1500,xp:120},
  minerais:{name:'Minerais',src:'Pedras, pedreira e montanhas',items:['Quartzo','Ametista','Turmalina','Pirita','Topázio'],coins:2500,xp:180},
  engren:{name:'Engrenagens',src:'Indústrias',items:['Parafuso de Ouro','Engrenagem Antiga','Mola Mestra','Chave Inglesa de Bronze','Pistão Raro'],coins:4000,xp:250},
  conchas:{name:'Conchas',src:'Porto e exportações',items:['Concha Rosa','Estrela-do-mar','Búzio','Nautilus','Pérola'],coins:6000,xp:350},
  brinq:{name:'Brinquedos de rua',src:'Comércios e lazer',items:['Pião','Bolinha de Gude','Pipa','Ioiô','Peteca'],coins:2000,xp:150}};

// Títulos da cidade
const TITLES=[[0,'Povoado',0],[120,'Vila',500],[400,'Cidade Pequena',1500],[1200,'Cidade',4000],[3000,'Cidade Grande',10000],[7000,'Metrópole',25000],[15000,'Megalópole',60000]];

// Eventos leves (alternam a cada 90 min, ficam ativos por 30 min)
const EVENTS=[{id:'festa',name:'Festa no bairro',desc:'Aluguéis rendem +50%',rent:1.5},{id:'feira',name:'Feira de rua',desc:'Comércios pagam +50%',biz:1.5},
  {id:'colheita',name:'Colheita farta',desc:'Plantações rendem +50%',harvest:1.5},{id:'turistas',name:'Temporada de turistas',desc:'Turismo em dobro',tour:2},
  {id:'mutirao',name:'Mutirão',desc:'Limpar obstáculos rende o dobro',clear:2},{id:'fabrica',name:'Semana da indústria',desc:'Indústrias produzem +50%',prod:1.5}];

// missões novas encaixadas na sequência
(function(){const ins=(after,arr)=>{const i=Q.findIndex(q=>q.id===after); Q.splice(i<0?Q.length:i+1,0,...arr.map(([id,title,o,coins,xp])=>({id,title,o,coins,xp})));};
  ins('q19c',[['n1','Atenda 2 pedidos de moradores',{t:'stat',s:'reqs',n:2},600,40]]);
  ins('q25c',[['n2','Ligue uma lei no painel Cidade → Leis',{t:'stat',s:'law',n:1},1500,90]]);
  ins('q28c',[['n3','Construa o Campus Universitário',{t:'own',k:'campus',n:1},6000,300],['n4','Pesquise uma tecnologia',{t:'stat',s:'research',n:1},3000,150]]);
  ins('q32',[['n5','Construa o Zoológico',{t:'own',k:'zoo',n:1},9000,450]]);
  ins('q36',[['n6','Construa o Aeroporto',{t:'own',k:'aeroporto',n:1},25000,900]]);})();
