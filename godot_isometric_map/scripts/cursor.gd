extends Node2D
## Desenha o losango da célula sob o mouse e o caminho do personagem.

const HALF := Vector2(32, 16)

var ground: TileMapLayer
var player: Node2D
var cell := Vector2i(-1, -1)
var valid := false
var active := false


func show_cell(c: Vector2i, walkable: bool) -> void:
	cell = c
	valid = walkable
	active = true
	queue_redraw()


func hide_cell() -> void:
	active = false
	queue_redraw()


func _process(_delta: float) -> void:
	if player and player.is_moving():
		queue_redraw()


func _draw() -> void:
	if player and player.is_moving():
		var prev: Vector2 = player.position
		for c in player.path:
			var p := ground.map_to_local(c)
			draw_line(prev, p, Color(1, 1, 1, 0.35), 2.0)
			draw_circle(p, 2.5, Color(1, 1, 1, 0.6))
			prev = p
		_draw_diamond(ground.map_to_local(player.goal()), Color(1, 0.85, 0.3, 0.25), Color(1, 0.85, 0.3))
	if active:
		var col := Color(0.5, 1, 0.5) if valid else Color(1, 0.4, 0.4)
		_draw_diamond(ground.map_to_local(cell), Color(col, 0.25), col)


func _draw_diamond(center: Vector2, fill: Color, line: Color) -> void:
	var pts := PackedVector2Array([
		center + Vector2(0, -HALF.y),
		center + Vector2(HALF.x, 0),
		center + Vector2(0, HALF.y),
		center + Vector2(-HALF.x, 0),
	])
	draw_colored_polygon(pts, fill)
	pts.append(pts[0])
	draw_polyline(pts, line, 2.0)
