# MathCity

Jogo de construir cidade (estilo CityVille) para jogar sozinho. O artifact publicado é um arquivo só (`index.html`), gerado a partir dos arquivos em `src/`.

## Como gerar o `index.html`

```
node build.js
```

O script junta `src/head.html` (HTML e CSS), todos os arquivos `src/js/*.js` em ordem alfabética e `src/tail.html`. Os números na frente dos nomes definem essa ordem; `99-boot.js` (o início do jogo) precisa ser sempre o último.

## Onde fica cada coisa

| Quero mexer em… | Arquivo |
| --- | --- |
| Lista de prédios (preço, nível, tamanho, aluguel, o que atende) | `src/js/20-predios.js` |
| Prédios novos (campus, zoológico, aeroporto, energia, minas, exclusivos) | `src/js/21-predios-novos.js` |
| Plantações, trem, missões, XP, itens, turismo, bairros, coleções, títulos, eventos | `src/js/22-economia-missoes.js` |
| Pincéis (ruas, terreno, calçadas, muros, pontes) | `src/js/23-ferramentas-terreno.js` |
| Leis, tecnologias, cadeias de missões, pedidos e moradores | `src/js/24-leis-tecnologia-cadeias-pedidos.js` |
| Geração do mapa, montanhas, túnel, save e migração | `src/js/30-mapa-terreno-save.js` |
| Cálculos da cidade (moradores, felicidade, turismo, onde pode construir) | `src/js/31-calculos-da-cidade.js` |
| Ações do jogador (construir, coletar, plantar, indústria, exportar) | `src/js/33-acoes.js` |
| Desenho dos prédios antigos | `src/js/41-arte-predios.js` |
| Desenho dos prédios novos | `src/js/42-arte-predios-novos.js` |
| Imagens PNG no lugar dos desenhos (oficina) | `src/js/43-sprites-e-imagens.js` |
| Imagens prontas do mapa (lista e uso) | `src/js/44-imagens-prontas.js`, `src/js/45-imagens-no-jogo.js` |
| Desenho com WebGL (PixiJS) e Canvas de reserva, modo econômico | `src/js/51-backend-canvas-webgl.js` |
| Chão, ruas, trilhos, pontes, relevo | `src/js/52-chao-ruas-relevo.js` |
| Cache do mapa por pedaço (o que deixou o jogo leve) | `src/js/53-cache-por-pedaco.js` |
| Carros, semáforos, muros e cercas, portal do túnel, trem | `src/js/54-transito-cercas-tunel.js` |
| Montagem de cada quadro e modo de visão | `src/js/55-render.js` |
| Clima (sol, nublado, chuva) | `src/js/56-clima.js` |
| Pedestres | `src/js/57-pedestres.js` |
| Animações (roda-gigante, eólicas, bichos, aviões, iate, farol, fogo) | `src/js/58-animacoes.js` |
| Toque, mouse e câmera | `src/js/60-entrada-toque.js` |
| Painéis (loja, informações do prédio, menu, missões) | `src/js/61-paineis.js` |
| Painel da Cidade e abas antigas | `src/js/63-painel-cidade.js` |
| Poluição, leis cobrando, pesquisa, pedidos, incêndios, histórico | `src/js/64-sistemas.js` |
| Abas novas, desfazer, construir em linha, gráficos, backup | `src/js/65-paineis-novos.js` |

### Criar um prédio novo

1. Em `21-predios-novos.js`: `defN('chave',{cat:'fun',name:'Nome',slug:'nome-do-arquivo',lv:10,cost:5000,time:60,w:2,h:2,art:{f:'meuDesenho'}})`.
2. Em `42-arte-predios-novos.js`: `ART.meuDesenho=(c,t,a,v)=>{ ... }`.
3. O `slug` é o nome do PNG na oficina de imagens (`nome-do-arquivo.png` e `nome-do-arquivo-noite.png`).

## Mapa e imagens prontas

O mapa tem 84×84 quadrados, com áreas de compra de 12×12, e a área inicial de 24×24 fica no meio. Ele é fixo, igual em todo jogo novo, e foi montado a partir da imagem de referência:

- **Serra no fundo:** só paisagem, com picos, cordilheiras e neblina.
- **Platôs:** dois de 16×16 (P1 no nível 6, P2 no nível 3), com paredões de rocha e ruas prontas subindo.
- **Água:** rio com cachoeira e ponte, e lago com ilhota.
- **Deserto:** no canto esquerdo, com o arco de pedra.
- **Mar e praia:** com pedras na água.
- **Túnel do trem:** a oeste da área inicial.

Onde fica cada parte:

- Layout: `30-mapa-terreno-save.js` (`P1`, `P2`, `RIVER`, `LAGO`, `ARCO`, `serraZone`, `DECOR`, `presetRoads`).
- Imagens: `img/`, geradas por `imagens-mapa/preparar.py` a partir de `imagens-mapa/originais/`. O script recorta os sprite sheets, tira o fundo, escala e calcula a âncora. A lista vai para `src/js/44-imagens-prontas.js`.
- Uso das imagens: `src/js/45-imagens-no-jogo.js`. São texturas de chão e água, paredão, peças de rua giradas, enfeites da serra, árvores com variações, decoração e carros.
- Uma imagem enviada pela oficina com o mesmo nome tem prioridade sobre a pronta.

Para trocar uma imagem: ponha o original em `imagens-mapa/originais/`, rode `python3 imagens-mapa/preparar.py` e depois `node build.js`.

## Desempenho

O chão, as ruas, as calçadas, os morros, as cercas, as árvores e os postes viram imagens prontas por pedaço do mapa (8×8 quadrados) e só são refeitos quando aquele pedaço muda. Carros, trem, pessoas, bichos e aviões viram sprites prontos por ângulo e quadro de animação. Cada quadro é só uma lista de imagens, desenhada pelo PixiJS (WebGL) ou, como reserva, pelo Canvas 2D.

No celular, o modo econômico liga sozinho: resolução menor, 30 quadros por segundo e menos carros e pessoas com zoom longe. Dá para trocar em Menu → Desenho, onde também fica o medidor de quadro.

## Android (Capacitor) e PWA

- A pasta `app-www/` é o jogo pronto para o app: o `node build.js` gera ali um `index.html` que usa o `pixi.min.js` da própria pasta e copia as imagens para `app-www/img/`, então funciona sem internet.
- Capacitor: `npm i @capacitor/core @capacitor/cli @capacitor/android`, `npx cap init "MathCity" br.cidadeviva.app --web-dir=www`, copie o conteúdo de `app-www/` para `www/`, depois `npx cap add android` e `npx cap open android`.
- O save fica no `localStorage`; fora do claude.ai não existe o salvamento na conta, então use Menu → Backup para guardar o arquivo.
