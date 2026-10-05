# Mapa Isométrico (Godot 4)

Mapa isométrico funcional feito em **Godot 4.3+** usando `TileMapLayer`, sem nenhuma
imagem externa: todas as texturas (blocos de terreno, árvores, pedras) são geradas
por código em `scripts/tile_factory.gd`.

## Como abrir

1. Instale o Godot **4.3 ou mais novo** (testado no 4.4.1).
2. No Project Manager, clique em **Importar** e escolha `godot_isometric_map/project.godot`.
3. Aperte **F5** para rodar.

## O que tem

- **Mapa procedural** 48x48 (ilha) gerado com `FastNoiseLite`: grama, areia, terra,
  pedra, neve e água, com árvores, pinheiros e rochas.
- **Tiles isométricos com volume** (topo + laterais) no layout *diamond down*.
- **Y-sort**: o personagem passa na frente/atrás de árvores e pedras corretamente.
- **Pathfinding A\*** (`AStarGrid2D`) com custo por terreno (areia e neve são mais lentas,
  água e objetos bloqueiam).
- **Editor de mapa** em tempo real: pinte terreno e objetos; o caminho é recalculado
  se você bloquear a rota do personagem.
- **Câmera** com pan, zoom no ponteiro do mouse e modo seguir.

## Controles

| Ação | Tecla |
| --- | --- |
| Andar até a célula | Botão esquerdo |
| Pintar com o pincel atual | Botão direito (segure e arraste) |
| Escolher pincel | `1`–`9`, `0` (borracha) |
| Novo mapa aleatório | `R` |
| Câmera seguir o personagem | `F` |
| Mover a câmera | `WASD` / setas / arrastar com botão do meio |
| Zoom | Roda do mouse |
| Mostrar/esconder ajuda | `H` |

## Estrutura

```
main.tscn                    cena principal
scripts/main.gd              geração do mapa, A*, edição, entrada e HUD
scripts/tile_factory.gd      cria as texturas e os TileSets isométricos
scripts/player.gd            personagem que segue o caminho
scripts/cursor.gd            destaque da célula sob o mouse e linha do caminho
scripts/camera_controller.gd pan, zoom e seguir
```

Para trocar a arte por sprites próprios, crie um `TileSet` isométrico (64x32,
*Diamond Down*) no editor, atribua aos nós `Ground` e `World/Objects` e remova as
duas linhas de `TileFactory` em `main.gd::_ready()` — mantendo a mesma ordem de
colunas no atlas (ou ajustando os enums `Terrain` e `Prop`).
