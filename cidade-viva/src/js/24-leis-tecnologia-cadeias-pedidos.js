/* ================= Leis, tecnologias (Campus), cadeias de missões, pedidos e moradores ================= */
/* ---- Leis (ligar/desligar no painel Leis) ---- */
const LAWS=[
  {id:'coleta',name:'Coleta seletiva',lv:6,pro:'−20% de poluição em toda a cidade',con:p=>'custa '+fmtN(lawCost('coleta'))+' moedas por hora'},
  {id:'feira',name:'Feira livre aos domingos',lv:5,pro:'comércios pagam +10%',con:()=>'gasta 15 mercadorias por hora'},
  {id:'parques',name:'Parques abertos à noite',lv:7,pro:'+5% de felicidade',con:()=>'custa '+fmtN(lawCost('parques'))+' moedas por hora'},
  {id:'turismo',name:'Incentivo ao turismo',lv:8,pro:'+25% de turistas',con:()=>'aluguel 5% menor'},
  {id:'onibus',name:'Transporte público',tech:'transporte',pro:'−30% da poluição do trânsito e mais ônibus nas ruas',con:()=>'custa '+fmtN(lawCost('onibus'))+' moedas por hora'},
  {id:'filtros',name:'Filtro nas chaminés',tech:'filtros',pro:'−40% da poluição da indústria',con:()=>'indústria 10% mais lenta'},
  {id:'integral',name:'Educação integral',tech:'pedagogia',pro:'educação conta em dobro contra a poluição e +10% de XP',con:()=>'custa '+fmtN(lawCost('integral'))+' moedas por hora'},
  {id:'brigada',name:'Brigada de incêndio',tech:'brigada',pro:'60% menos incêndios e apagam mais rápido',con:()=>'custa '+fmtN(lawCost('brigada'))+' moedas por hora'},
  {id:'verde',name:'Cinturão verde',tech:'reciclagem',pro:'árvores e parques limpam 50% mais',con:()=>'custa '+fmtN(lawCost('verde'))+' moedas por hora'}];
const law=id=>!!(S&&S.laws&&S.laws[id]);
function lawCost(id){const p=D?D.pop:0; return Math.round(({coleta:20+p/40,parques:25+p/50,onibus:40+p/30,integral:50+p/25,brigada:30,verde:35})[id]||0);}
function lawOpen(L){if(L.lv&&S.lv<L.lv)return 'Libera no nível '+L.lv; if(L.tech&&!hasTech(L.tech))return 'Precisa da tecnologia '+TECH.find(t=>t.id===L.tech).name; return '';}

/* ---- Tecnologias (pesquisa do Campus) ---- */
const TECH=[
  {id:'brigada',name:'Brigada de incêndio',rp:30,req:[],desc:'Libera a lei Brigada de incêndio.'},
  {id:'mineracao',name:'Mineração moderna',rp:40,req:[],desc:'Libera a Mina de Ferro (morros) e a Mina de Calcário (deserto), que alimentam a Siderúrgica.'},
  {id:'pedagogia',name:'Pedagogia',rp:40,req:[],desc:'Libera a lei Educação integral.'},
  {id:'eolica',name:'Energia eólica',rp:50,req:[],desc:'Libera a Turbina Eólica, que vai nos morros.'},
  {id:'transporte',name:'Transporte público',rp:50,req:[],desc:'Libera a lei Transporte público.'},
  {id:'solar',name:'Energia solar',rp:60,req:['eolica'],desc:'Libera a Usina Solar, que vai no deserto.'},
  {id:'reciclagem',name:'Reciclagem',rp:60,req:[],desc:'−10% de poluição base e libera a lei Cinturão verde.'},
  {id:'filtros',name:'Filtros industriais',rp:80,req:['mineracao'],desc:'Libera a lei Filtro nas chaminés.'},
  {id:'agro',name:'Biotecnologia agrícola',rp:80,req:['reciclagem'],desc:'Plantações rendem +25% de mercadorias.'},
  {id:'smart',name:'Semáforos inteligentes',rp:100,req:['transporte'],desc:'Carros esperam menos e o trânsito polui 15% menos.'},
  {id:'turismo2',name:'Turismo inteligente',rp:120,req:['pedagogia'],desc:'+15% de turistas.'},
  {id:'aviacao',name:'Aviação',rp:150,req:['transporte','mineracao'],desc:'Libera o Aeroporto.'}];
const hasTech=id=>!!(S&&S.tech&&S.tech.includes(id));
function techState(t){if(hasTech(t.id))return 'feita'; if(t.req.some(r=>!hasTech(r)))return 'bloqueada'; return S.rp>=t.rp?'pronta':'falta';}

/* ---- Cadeias de missões que liberam prédios exclusivos ---- */
const CHAINS=[
  {id:'feira',name:'Feira comunitária',lv:4,reward:'cooperativa',steps:[
    {t:'Tenha 4 Terrenos de Plantio',o:{t:'own',k:'plot',n:4}},{t:'Construa um Mercado de Agricultores',o:{t:'own',k:'mercado-agri',n:1}},
    {t:'Colha 10 plantações',o:{t:'stat',s:'harvest',n:10}},{t:'Abasteça comércios 5 vezes',o:{t:'stat',s:'supply',n:5}}]},
  {id:'verde',name:'Cidade verde',lv:7,reward:'jardim-botanico',steps:[
    {t:'Tenha 10 árvores de rua ou ipês',o:{t:'ownAny',ks:['arvore','ipe'],n:10}},{t:'Tenha 2 praças ou parques',o:{t:'ownAny',ks:PARKS,n:2}},
    {t:'Ligue a lei Coleta seletiva',o:{t:'law',id:'coleta'}},{t:'Deixe a poluição média abaixo de 15',o:{t:'pollBelow',n:15}}]},
  {id:'saber',name:'Polo do conhecimento',lv:9,reward:'observatorio',steps:[
    {t:'Tenha uma Escola e uma Biblioteca',o:{t:'ownAll',ks:['escola','biblioteca']}},{t:'Construa o Campus Universitário',o:{t:'own',k:'campus',n:1}},
    {t:'Pesquise 3 tecnologias',o:{t:'tech',n:3}},{t:'Alcance 800 moradores',o:{t:'pop',n:800}}]},
  {id:'turismo',name:'Rota turística',lv:10,reward:'roda-gigante',steps:[
    {t:'Tenha uma Pousada ou Hotel',o:{t:'ownAny',ks:['pousada','hotel','resort'],n:1}},{t:'Tenha o Farol ou o Porto',o:{t:'ownAny',ks:['farol','porto','marina'],n:1}},
    {t:'Ligue a lei Incentivo ao turismo',o:{t:'law',id:'turismo'}},{t:'Receba 60 turistas',o:{t:'tourists',n:60}}]},
  {id:'industria',name:'Coração industrial',lv:9,reward:'museu-industria',steps:[
    {t:'Tenha Madeireira e Pedreira',o:{t:'ownAll',ks:['madeireira','pedreira']}},{t:'Construa a Siderúrgica',o:{t:'own',k:'siderurgica',n:1}},
    {t:'Colete 20 produções da indústria',o:{t:'stat',s:'prod',n:20}},{t:'Entregue 3 encomendas',o:{t:'stat',s:'order',n:3}}]}];

/* ---- Pedidos dos moradores ---- */
const REQ_UNL=['horta','mural','parquinho','bebedouro','quiosque','banco-mosaico'];
const NOMES=['Ana','Bruno','Carla','Diego','Elisa','Fábio','Gabi','Heitor','Iara','João','Kátia','Lucas','Marina','Nina','Otávio','Paula','Rafa','Sílvia','Téo','Úrsula','Vítor','Wanda','Yuri','Zé','Beatriz','Caio','Dandara','Enzo','Flávia','Guto','Helena','Igor','Jussara','Leo','Mel','Nando','Olga','Pedro','Rita','Sara'];
const SOBRE=['Silva','Souza','Oliveira','Santos','Lima','Pereira','Costa','Ferreira','Rocha','Almeida','Nunes','Carvalho','Gomes','Martins','Araújo','Barbosa','Ribeiro','Teixeira','Moura','Cardoso'];
const PROF=['professora','padeiro','enfermeira','motorista de ônibus','engenheira','jardineiro','cozinheira','carteiro','pintora','músico','bibliotecária','eletricista','dentista','costureira','programador','pescador','bombeira','feirante','arquiteta','marceneiro'];
const SONHO=['abrir uma livraria na esquina','ver um parque cheio de crianças','ganhar a feira de abóboras gigantes','tocar no coreto da praça','plantar um ipê para cada neto','ver o trem chegar lotado de turistas','andar de bicicleta até a praia','aprender a pintar o pôr do sol','montar uma horta no quintal','assistir ao jogo no Grande Estádio','conhecer outras cidades de avião','juntar a coleção inteira de selos'];
const MANIA=['coleciona tampinhas','cuida de três gatos','faz o melhor café do bairro','acorda cedo para correr','conta histórias para as crianças','conserta tudo que quebra','sabe o nome de todas as árvores','nunca perde uma festa no bairro'];
function resident(b){const r=rng(b.i*2654435761>>>0); const p=a=>a[(r()*a.length)|0]; const nome=p(NOMES)+' '+p(SOBRE), idade=18+((r()*64)|0), prof=p(PROF);
  return {nome,idade,prof,sonho:p(SONHO),mania:p(MANIA)};}
const REQ_TYPES=[
  {id:'parque',w:3,txt:'Queria uma praça ou parque pertinho de casa para levar as crianças.',make:b=>({r:4})},
  {id:'arvores',w:3,txt:'A rua está muito quente. Plante árvores perto da minha casa?',make:b=>({n:countNear(b,['arvore','ipe'],3)+3,r:3})},
  {id:'entrega',w:3,txt:'Estou organizando um mutirão. Pode me entregar uns materiais?',make:b=>{const av=availItems().filter(k=>k!=='cars'), it=av[(Math.random()*av.length)|0]; const q=it==='goods'?40+S.lv*5:it==='tools'||it==='tires'?2+Math.floor(S.lv/8):4+Math.floor(S.lv/3); return {item:it,q};}},
  {id:'calcada',w:2,txt:'Toda vez que chove vira lama na frente de casa. Faz uma calçada?',make:b=>({n:pvNear(b,2)+6,r:2})},
  {id:'comercio',w:2,txt:'Tenho que andar muito para comprar pão. Abre um comércio aqui perto?',make:b=>({r:4})},
  {id:'colher',w:2,txt:'Prometi uma feijoada para a vizinhança. Colhe umas plantações pra mim?',make:b=>({base:S.st.harvest,n:3})},
  {id:'saude',w:1,txt:'Meu pai está velhinho. Precisamos de um posto de saúde perto.',make:b=>({})}];
function countNear(b,ks,r){let n=0; for(const o of S.b)if(ks.includes(o.k)&&dist(b,o)<=r&&Date.now()>=o.d)n++; return n;}
function pvNear(b,r){let n=0; const w=fw(b),h=fh(b); for(let y=Math.max(0,(b.y-r)*2);y<Math.min(Q2,(b.y+h+r)*2);y++)for(let x=Math.max(0,(b.x-r)*2);x<Math.min(Q2,(b.x+w+r)*2);x++)if(G.pv[y*Q2+x])n++; return n;}

