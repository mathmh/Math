extends RefCounted
## Gera em tempo de execução as texturas e os TileSets isométricos do mapa,
## para que o projeto não dependa de nenhuma imagem externa.

const TILE_SIZE := Vector2i(64, 32)      # losango do topo de cada célula
const DEPTH := 16                        # altura da lateral visível dos blocos
const GROUND_REGION := Vector2i(64, 48)  # topo (64x32) + lateral (16)
const PROP_REGION := Vector2i(64, 96)
const PROP_BASE_Y := 80                  # y, na textura, onde o objeto toca o chão

# O Godot centraliza a textura do tile na célula e subtrai texture_origin.
# Chão: o centro do losango (y=16) precisa cair no centro da célula -> 16 - 24 = -8.
const GROUND_ORIGIN := Vector2i(0, -8)
# Objetos: a base (y=80) precisa cair no centro da célula -> 80 - 48 = 32.
const PROP_ORIGIN := Vector2i(0, 32)

const SIDE_COLORS := {
	"grass": Color("7a5636"),
	"snow": Color("7d828b"),
}


static func make_ground_tileset(terrains: Array) -> TileSet:
	var img := Image.create_empty(GROUND_REGION.x * terrains.size(), GROUND_REGION.y, false, Image.FORMAT_RGBA8)
	var rng := RandomNumberGenerator.new()
	rng.seed = 1337
	for i in terrains.size():
		var t: Dictionary = terrains[i]
		_draw_ground_tile(img, i * GROUND_REGION.x, t.color, t.pattern, rng)
	return _build_tileset(img, terrains.size(), GROUND_REGION, GROUND_ORIGIN)


static func make_prop_tileset() -> TileSet:
	var img := Image.create_empty(PROP_REGION.x * 3, PROP_REGION.y, false, Image.FORMAT_RGBA8)
	_draw_tree(img, 0)
	_draw_pine(img, PROP_REGION.x)
	_draw_rock(img, PROP_REGION.x * 2)
	return _build_tileset(img, 3, PROP_REGION, PROP_ORIGIN)


static func _build_tileset(img: Image, count: int, region: Vector2i, origin: Vector2i) -> TileSet:
	var ts := TileSet.new()
	ts.tile_shape = TileSet.TILE_SHAPE_ISOMETRIC
	ts.tile_layout = TileSet.TILE_LAYOUT_DIAMOND_DOWN
	ts.tile_size = TILE_SIZE
	var src := TileSetAtlasSource.new()
	src.texture = ImageTexture.create_from_image(img)
	src.texture_region_size = region
	for i in count:
		var coords := Vector2i(i, 0)
		src.create_tile(coords)
		src.get_tile_data(coords, 0).texture_origin = origin
	ts.add_source(src, 0)
	return ts


# --- Chão ---------------------------------------------------------------------

static func _draw_ground_tile(img: Image, ox: int, base: Color, pattern: String, rng: RandomNumberGenerator) -> void:
	# A água fica um pouco abaixo do nível do terreno.
	var top_off := 5 if pattern == "water" else 0
	var depth := DEPTH - top_off
	var hw := TILE_SIZE.x / 2.0
	var hh := TILE_SIZE.y / 2.0
	var side_base: Color = SIDE_COLORS.get(pattern, base)
	for y in GROUND_REGION.y:
		for x in GROUND_REGION.x:
			var fx := x + 0.5
			var fy := y + 0.5
			var d := absf(fx - hw) / hw + absf(fy - top_off - hh) / hh
			if d <= 1.0:
				img.set_pixel(ox + x, y, _top_pixel(base, pattern, x, y, d, rng))
				continue
			# Laterais: faixa logo abaixo das arestas inferiores do losango.
			var edge := top_off + TILE_SIZE.y - absf(fx - hw) / 2.0
			if fy <= edge or fy > edge + depth:
				continue
			var c := base
			if fy - edge > 3 + rng.randi() % 3:
				c = side_base
			c = c.darkened(0.25 if fx < hw else 0.42)
			if fy > edge + depth - 1.5:
				c = c.darkened(0.25)
			img.set_pixel(ox + x, y, c.lightened(rng.randf() * 0.05))


static func _top_pixel(base: Color, pattern: String, x: int, y: int, d: float, rng: RandomNumberGenerator) -> Color:
	# Gradiente leve: luz vindo de cima/esquerda.
	var g := (x / 64.0 + y / 48.0) * 0.5
	var c := base.lightened(0.08 * (1.0 - g)).darkened(0.08 * g)
	match pattern:
		"grass":
			var r := rng.randf()
			if r < 0.08:
				c = c.darkened(0.18)
			elif r < 0.14:
				c = c.lightened(0.15)
		"sand":
			if rng.randf() < 0.15:
				c = c.darkened(0.08)
		"dirt":
			var r := rng.randf()
			if r < 0.05:
				c = c.lightened(0.2)
			elif r < 0.15:
				c = c.darkened(0.15)
		"stone":
			if (x * 7 + y * 13) % 23 == 0 or rng.randf() < 0.06:
				c = c.darkened(0.2)
			elif rng.randf() < 0.05:
				c = c.lightened(0.15)
		"water":
			if (y + (x >> 3)) % 5 == 0 and rng.randf() < 0.6:
				c = c.lightened(0.25)
		"snow":
			if rng.randf() < 0.08:
				c = c.darkened(0.06)
	# Borda escurecida para a grade ficar legível.
	if d > 0.9:
		c = c.darkened(0.05 if pattern == "water" else 0.12)
	return c


# --- Objetos ------------------------------------------------------------------

static func _draw_tree(img: Image, ox: int) -> void:
	_ellipse(img, ox, 32, PROP_BASE_Y, 18, 7, Color(0, 0, 0, 0.28))
	_rect(img, ox, 28, 54, 8, 27, Color("6b4a2b"))
	var leaf := Color("3f8f3a")
	_ellipse(img, ox, 21, 50, 13, 11, leaf.darkened(0.1), 0.35)
	_ellipse(img, ox, 43, 50, 13, 11, leaf.darkened(0.15), 0.35)
	_ellipse(img, ox, 32, 38, 18, 16, leaf, 0.35)
	_ellipse(img, ox, 30, 26, 12, 10, leaf.lightened(0.1), 0.35)


static func _draw_pine(img: Image, ox: int) -> void:
	_ellipse(img, ox, 32, PROP_BASE_Y, 14, 6, Color(0, 0, 0, 0.28))
	_rect(img, ox, 30, 66, 5, 15, Color("5e4026"))
	var g := Color("2f6b45")
	_triangle(img, ox, 32, 40, 72, 22, g.darkened(0.1))
	_triangle(img, ox, 32, 26, 56, 18, g)
	_triangle(img, ox, 32, 12, 40, 13, g.lightened(0.08))


static func _draw_rock(img: Image, ox: int) -> void:
	_ellipse(img, ox, 32, PROP_BASE_Y, 20, 7, Color(0, 0, 0, 0.28))
	_ellipse(img, ox, 30, 70, 17, 13, Color("8b8f96"), 0.4)
	_ellipse(img, ox, 45, 76, 8, 6, Color("7d8188"), 0.4)


static func _ellipse(img: Image, ox: int, cx: float, cy: float, rx: float, ry: float, color: Color, shade := 0.0) -> void:
	for y in range(int(cy - ry) - 1, int(cy + ry) + 2):
		for x in range(int(cx - rx) - 1, int(cx + rx) + 2):
			var nx := (x + 0.5 - cx) / rx
			var ny := (y + 0.5 - cy) / ry
			var dd := nx * nx + ny * ny
			if dd > 1.0:
				continue
			var c := color
			if shade > 0.0:
				var l := -(nx + ny) * 0.5  # positivo = lado iluminado
				c = c.lightened(l * shade) if l > 0.0 else c.darkened(-l * shade)
				if dd > 0.85:
					c = c.darkened(shade * 0.5)
			_blend(img, ox + x, y, c)


static func _rect(img: Image, ox: int, x0: int, y0: int, w: int, h: int, color: Color) -> void:
	for y in range(y0, y0 + h):
		for x in range(x0, x0 + w):
			var t := float(x - x0) / w
			var c := color.lightened(0.15) if t < 0.4 else color.darkened(0.2)
			_blend(img, ox + x, y, c)


static func _triangle(img: Image, ox: int, cx: float, top: int, bottom: int, half_w: float, color: Color) -> void:
	for y in range(top, bottom):
		var hw := half_w * float(y - top) / (bottom - top)
		for x in range(int(cx - hw), int(cx + hw) + 1):
			var c := color.lightened(0.12) if x < cx else color.darkened(0.12)
			if y >= bottom - 2:
				c = c.darkened(0.2)
			_blend(img, ox + x, y, c)


static func _blend(img: Image, x: int, y: int, c: Color) -> void:
	if x < 0 or y < 0 or x >= img.get_width() or y >= img.get_height():
		return
	if c.a >= 1.0:
		img.set_pixel(x, y, c)
	else:
		img.set_pixel(x, y, img.get_pixel(x, y).blend(c))
