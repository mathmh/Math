extends Node2D
## Gera o mapa isométrico, cuida do pathfinding (A*), da edição do mapa e do HUD.

const TileFactory := preload("res://scripts/tile_factory.gd")

const MAP_SIZE := Vector2i(48, 48)

enum Terrain { GRASS, SAND, DIRT, STONE, WATER, SNOW }
enum Prop { TREE, PINE, ROCK }

# A ordem segue o enum Terrain (índice = coluna no atlas).
const TERRAINS := [
	{"name": "Grama", "color": Color("5fa04e"), "walkable": true, "cost": 1.0, "pattern": "grass"},
	{"name": "Areia", "color": Color("dcc98a"), "walkable": true, "cost": 1.6, "pattern": "sand"},
	{"name": "Terra", "color": Color("9a7148"), "walkable": true, "cost": 1.0, "pattern": "dirt"},
	{"name": "Pedra", "color": Color("8a8f98"), "walkable": true, "cost": 1.3, "pattern": "stone"},
	{"name": "Água", "color": Color("3f7fc4"), "walkable": false, "cost": 1.0, "pattern": "water"},
	{"name": "Neve", "color": Color("e8eef5"), "walkable": true, "cost": 2.0, "pattern": "snow"},
]
const PROP_NAMES := ["Árvore", "Pinheiro", "Rocha"]

const BRUSHES := [
	{"label": "Grama", "type": "terrain", "id": Terrain.GRASS},
	{"label": "Areia", "type": "terrain", "id": Terrain.SAND},
	{"label": "Terra", "type": "terrain", "id": Terrain.DIRT},
	{"label": "Pedra", "type": "terrain", "id": Terrain.STONE},
	{"label": "Água", "type": "terrain", "id": Terrain.WATER},
	{"label": "Neve", "type": "terrain", "id": Terrain.SNOW},
	{"label": "Árvore", "type": "prop", "id": Prop.TREE},
	{"label": "Pinheiro", "type": "prop", "id": Prop.PINE},
	{"label": "Rocha", "type": "prop", "id": Prop.ROCK},
	{"label": "Borracha", "type": "erase"},
]

const HELP := [
	"Botão esquerdo: andar até a célula  •  Botão direito (segurar): pintar",
	"1-0: escolher pincel  •  R: novo mapa  •  F: câmera segue o personagem",
	"WASD/setas/botão do meio: mover câmera  •  Roda: zoom  •  H: esconder ajuda",
]

@onready var ground: TileMapLayer = $Ground
@onready var objects: TileMapLayer = $World/Objects
@onready var player: Node2D = $World/Player
@onready var cursor: Node2D = $Cursor
@onready var camera: Camera2D = $Camera
@onready var info: Label = $HUD/Info

var astar := AStarGrid2D.new()
var map_seed := 0
var brush_index := 0
var hovered := Vector2i(-1, -1)
var show_help := true

var _painting := false
var _last_painted := Vector2i(-1, -1)
var _message := ""
var _message_time := 0.0


func _ready() -> void:
	ground.tile_set = TileFactory.make_ground_tileset(TERRAINS)
	objects.tile_set = TileFactory.make_prop_tileset()
	player.ground = ground
	cursor.ground = ground
	cursor.player = player
	camera.follow_target = player

	var panel := StyleBoxFlat.new()
	panel.bg_color = Color(0, 0, 0, 0.55)
	panel.set_corner_radius_all(6)
	panel.set_content_margin_all(10)
	info.add_theme_stylebox_override("normal", panel)

	generate(randi())


func _process(delta: float) -> void:
	_update_hover()
	if _message_time > 0.0:
		_message_time -= delta
		if _message_time <= 0.0:
			_message = ""
			_refresh_hud()


# --- Geração ------------------------------------------------------------------

func generate(new_seed: int) -> void:
	map_seed = new_seed
	var height := FastNoiseLite.new()
	height.seed = new_seed
	height.noise_type = FastNoiseLite.TYPE_SIMPLEX_SMOOTH
	height.frequency = 0.045
	height.fractal_octaves = 4
	var moisture := FastNoiseLite.new()
	moisture.seed = new_seed + 1
	moisture.frequency = 0.08
	var rng := RandomNumberGenerator.new()
	rng.seed = new_seed

	ground.clear()
	objects.clear()
	var center := Vector2(MAP_SIZE) / 2.0
	for y in MAP_SIZE.y:
		for x in MAP_SIZE.x:
			var c := Vector2i(x, y)
			# Ilha: a altura cai conforme se afasta do centro.
			var dist := (Vector2(c) - center).length() / center.x
			var h := height.get_noise_2d(x, y) + 0.35 - dist * dist * 0.9
			var m := moisture.get_noise_2d(x, y)
			var t := _terrain_for(h, m)
			ground.set_cell(c, 0, Vector2i(t, 0))
			var prop := _prop_for(t, m, rng)
			if prop >= 0:
				objects.set_cell(c, 0, Vector2i(prop, 0))

	_rebuild_navigation()
	player.place(_find_spawn())
	camera.snap_to(player.position)
	hovered = Vector2i(-1, -1)
	_refresh_hud()


func _terrain_for(h: float, m: float) -> int:
	if h < 0.0:
		return Terrain.WATER
	if h < 0.07:
		return Terrain.SAND
	if h < 0.38:
		return Terrain.DIRT if m < -0.25 else Terrain.GRASS
	if h < 0.52:
		return Terrain.STONE
	return Terrain.SNOW


func _prop_for(t: int, m: float, rng: RandomNumberGenerator) -> int:
	var r := rng.randf()
	match t:
		Terrain.GRASS:
			if m > 0.1 and r < 0.25:
				return Prop.TREE if rng.randf() < 0.6 else Prop.PINE
			if r < 0.04:
				return Prop.TREE
		Terrain.DIRT:
			if r < 0.03:
				return Prop.ROCK
		Terrain.STONE:
			if r < 0.12:
				return Prop.ROCK
			if r < 0.16:
				return Prop.PINE
		Terrain.SNOW:
			if r < 0.08:
				return Prop.PINE
		Terrain.SAND:
			if r < 0.02:
				return Prop.ROCK
	return -1


func _find_spawn() -> Vector2i:
	var center := MAP_SIZE / 2
	var best := center
	var best_d := INF
	for y in MAP_SIZE.y:
		for x in MAP_SIZE.x:
			var c := Vector2i(x, y)
			var d := Vector2(c - center).length_squared()
			if d < best_d and not astar.is_point_solid(c):
				best_d = d
				best = c
	return best


# --- Navegação ----------------------------------------------------------------

func _rebuild_navigation() -> void:
	astar.region = Rect2i(Vector2i.ZERO, MAP_SIZE)
	astar.diagonal_mode = AStarGrid2D.DIAGONAL_MODE_ONLY_IF_NO_OBSTACLES
	astar.default_compute_heuristic = AStarGrid2D.HEURISTIC_OCTILE
	astar.default_estimate_heuristic = AStarGrid2D.HEURISTIC_OCTILE
	astar.update()
	for y in MAP_SIZE.y:
		for x in MAP_SIZE.x:
			_update_nav_cell(Vector2i(x, y))


func _update_nav_cell(c: Vector2i) -> void:
	var t: Dictionary = TERRAINS[terrain_at(c)]
	var solid: bool = not t.walkable or objects.get_cell_source_id(c) != -1
	astar.set_point_solid(c, solid)
	if not solid:
		astar.set_point_weight_scale(c, t.cost)


func terrain_at(c: Vector2i) -> int:
	return ground.get_cell_atlas_coords(c).x


func in_bounds(c: Vector2i) -> bool:
	return astar.is_in_boundsv(c)


func _move_player_to(target: Vector2i) -> void:
	if not in_bounds(target):
		return
	if astar.is_point_solid(target):
		_flash("Não dá para andar até aí.")
		return
	var path := astar.get_id_path(player.step_cell(), target)
	if path.is_empty():
		_flash("Sem caminho até essa célula.")
		return
	player.follow_path(path)


# --- Edição -------------------------------------------------------------------

func _paint(c: Vector2i) -> void:
	if not in_bounds(c) or c == _last_painted:
		return
	_last_painted = c
	var brush: Dictionary = BRUSHES[brush_index]
	match brush.type:
		"terrain":
			if brush.id == Terrain.WATER:
				if player.occupies(c):
					_flash("O personagem está nessa célula.")
					return
				objects.erase_cell(c)  # nada fica em cima da água
			ground.set_cell(c, 0, Vector2i(brush.id, 0))
		"prop":
			if player.occupies(c):
				_flash("O personagem está nessa célula.")
				return
			if terrain_at(c) == Terrain.WATER:
				_flash("Não dá para colocar objetos na água.")
				return
			objects.set_cell(c, 0, Vector2i(brush.id, 0))
		"erase":
			objects.erase_cell(c)
	_update_nav_cell(c)
	_repath_if_needed()
	cursor.show_cell(c, not astar.is_point_solid(c))
	_refresh_hud()


## Recalcula o caminho do personagem caso a edição tenha mudado o mapa.
func _repath_if_needed() -> void:
	if not player.is_moving():
		return
	var path := astar.get_id_path(player.step_cell(), player.goal())
	if path.is_empty():
		player.stop()
		_flash("Caminho bloqueado!")
	else:
		player.follow_path(path)


# --- Entrada ------------------------------------------------------------------

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventMouseMotion:
		if _painting:
			_update_hover()
			_paint(hovered)
	elif event is InputEventMouseButton:
		if event.button_index == MOUSE_BUTTON_LEFT and event.pressed:
			_update_hover()
			_move_player_to(hovered)
		elif event.button_index == MOUSE_BUTTON_RIGHT:
			_painting = event.pressed
			_last_painted = Vector2i(-1, -1)
			if event.pressed:
				_update_hover()
				_paint(hovered)
	elif event is InputEventKey and event.pressed and not event.echo:
		var key: Key = event.physical_keycode
		if key >= KEY_1 and key <= KEY_9:
			_select_brush(key - KEY_1)
		elif key == KEY_0:
			_select_brush(9)
		elif key == KEY_R:
			generate(randi())
			_flash("Novo mapa gerado.")
		elif key == KEY_F:
			camera.follow = not camera.follow
			_flash("Câmera seguindo: %s" % ("sim" if camera.follow else "não"))
		elif key == KEY_H:
			show_help = not show_help
			_refresh_hud()


func _select_brush(i: int) -> void:
	brush_index = clampi(i, 0, BRUSHES.size() - 1)
	_refresh_hud()


func _update_hover() -> void:
	var c := ground.local_to_map(ground.get_local_mouse_position())
	if c == hovered:
		return
	hovered = c
	if in_bounds(c):
		cursor.show_cell(c, not astar.is_point_solid(c))
	else:
		cursor.hide_cell()
	_refresh_hud()


# --- HUD ----------------------------------------------------------------------

func _flash(text: String) -> void:
	_message = text
	_message_time = 2.5
	_refresh_hud()


func _refresh_hud() -> void:
	var lines := PackedStringArray()
	lines.append("Mapa isométrico %dx%d  •  seed %d" % [MAP_SIZE.x, MAP_SIZE.y, map_seed])
	var parts := PackedStringArray()
	for i in BRUSHES.size():
		var label := "%d %s" % [(i + 1) % 10, BRUSHES[i].label]
		parts.append("[%s]" % label if i == brush_index else label)
	lines.append("Pincel: " + "   ".join(parts))
	if in_bounds(hovered):
		var t: Dictionary = TERRAINS[terrain_at(hovered)]
		var prop_id := objects.get_cell_atlas_coords(hovered).x
		var prop: String = "  •  " + PROP_NAMES[prop_id] if prop_id >= 0 else ""
		var walk := "andável (custo %.1f)" % t.cost if not astar.is_point_solid(hovered) else "bloqueada"
		lines.append("Célula (%d, %d)  •  %s%s  •  %s" % [hovered.x, hovered.y, t.name, prop, walk])
	if show_help:
		lines.append_array(HELP)
	if _message != "":
		lines.append("» " + _message)
	info.text = "\n".join(lines)
