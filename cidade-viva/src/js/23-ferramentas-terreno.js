/* ================= Pincéis: ruas, terreno, calçadas, muros e pontes ================= */

// Ferramentas de pincel, em grupos
const TOOLS={
  rua:{g:'ruas',name:'Rua',lv:1,cost:10,desc:'Carros circulam. Sobe morro pelas rampas.'},
  ponte:{g:'ruas',name:'Ponte',lv:2,cost:0,desc:'Rua por cima de rio ou lago. Escolha o modelo.',opt:'bridge'},
  trilho:{g:'ruas',name:'Trilho',lv:3,cost:30,desc:'Liga a estação ao túnel do trem.'},
  remover:{g:'ruas',name:'Demolir',lv:1,cost:0,desc:'Tira ruas, pontes e trilhos. Limpa obstáculos.'},
  elevar:{g:'terreno',name:'Elevar',lv:3,cost:60,desc:'Sobe o terreno um nível.'},
  rebaixar:{g:'terreno',name:'Rebaixar',lv:3,cost:60,desc:'Desce o terreno um nível.'},
  nivelar:{g:'terreno',name:'Nivelar',lv:3,cost:40,desc:'Deixa tudo na altura do primeiro quadrado.'},
  rampa:{g:'terreno',name:'Rampa',lv:3,cost:80,desc:'Liga dois níveis. Ruas sobem por ela.'},
  cavar:{g:'terreno',name:'Criar água',lv:3,cost:80,desc:'Cava rio ou lago no chão plano.'},
  aterrar:{g:'terreno',name:'Aterrar',lv:3,cost:60,desc:'Transforma água em chão.'},
  pintar:{g:'terreno',name:'Pintar chão',lv:2,cost:5,desc:'Troca o tipo de chão.',opt:'soil'},
  plantar:{g:'terreno',name:'Plantar árvores',lv:2,cost:20,desc:'Cria mata. Dá madeira se cortar depois.'},
  piso:{g:'enfeite',name:'Calçada',lv:1,cost:3,desc:'Caminho fino, 1/4 de quadrado.',opt:'pave',q:1},
  muro:{g:'enfeite',name:'Muros e cercas',lv:2,cost:8,desc:'Cerca viva, muros e grades.',opt:'fence',q:1},
  apagar:{g:'enfeite',name:'Apagar',lv:1,cost:0,desc:'Tira calçadas e cercas.',q:1},
};
const TOOL_GROUPS={ruas:'Ruas e trilhos',terreno:'Terreno',enfeite:'Decoração'};
const BRIDGES=[{name:'Pedra em arcos',lv:2,c:150,mat:{stone:2}},{name:'Madeira',lv:2,c:100,mat:{wood:2}},{name:'Concreto',lv:8,c:200,mat:{stone:1,steel:1}},
  {name:'Metálica',lv:9,c:250,mat:{steel:2}},{name:'Pênsil',lv:14,c:400,mat:{steel:2,tools:1}}];
const SOILS=[[0,'Grama','#86bf65'],[3,'Areia','#ead9a6'],[4,'Deserto','#e3b877'],[5,'Terra','#a07a52'],[6,'Neve','#f2f5f7'],[7,'Rocha','#8d9096']];
const PAVES=[{name:'Pedra portuguesa',lv:1},{name:'Lajota cinza',lv:1},{name:'Tijolinho',lv:2},{name:'Cascalho',lv:2},{name:'Deck de madeira',lv:4},{name:'Ladrilho hidráulico',lv:6},{name:'Terra batida',lv:1},{name:'Pisante na grama',lv:3}];
const FENCES=[{name:'Cerca viva',lv:2},{name:'Cerca branca',lv:2},{name:'Muro de pedra',lv:3},{name:'Muro de tijolo',lv:4},{name:'Grade de ferro',lv:5},{name:'Cerca de madeira',lv:2},{name:'Muro de concreto',lv:6}];

// Ajustes gerais: obras 3x mais rápidas e materiais em prédios grandes
for(const k in T){const t=T[k]; if(t.nv)continue; if(t.time)t.time=Math.max(2,Math.round(t.time/3));
  if(!t.mat&&t.cost>=9000&&t.cat!=='mon'&&!t.fixed){t.mat={wood:Math.ceil(t.cost/6000),stone:Math.ceil(t.cost/5000)}; if(t.cost>=15000)t.mat.tools=Math.ceil(t.cost/15000); if(t.cost>=30000)t.mat.steel=Math.ceil(t.cost/20000);}}
