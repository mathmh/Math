extends Node2D
## Personagem que anda de célula em célula seguindo um caminho do A*.

@export var speed := 120.0

var ground: TileMapLayer
var cell := Vector2i.ZERO
## Células que ainda faltam percorrer; path[0] é a célula para onde está indo.
var path: Array[Vector2i] = []

var _walk_time := 0.0
var _facing := 1.0


func place(c: Vector2i) -> void:
	cell = c
	path.clear()
	position = ground.map_to_local(c)
	queue_redraw()


func follow_path(new_path: Array[Vector2i]) -> void:
	path = new_path.duplicate()


func stop() -> void:
	# Termina o passo atual para não ficar parado no meio de duas células.
	if is_moving():
		path = [path[0]]


func is_moving() -> bool:
	return not path.is_empty()


## Célula de onde um novo caminho deve partir.
func step_cell() -> Vector2i:
	return path[0] if is_moving() else cell


func goal() -> Vector2i:
	return path[-1] if is_moving() else cell


func occupies(c: Vector2i) -> bool:
	return c == cell or c == step_cell()


func _process(delta: float) -> void:
	if path.is_empty():
		if _walk_time != 0.0:
			_walk_time = 0.0
			queue_redraw()
		return
	var target := ground.map_to_local(path[0])
	var to := target - position
	if absf(to.x) > 0.5:
		_facing = signf(to.x)
	var step := speed * delta
	if to.length() <= step:
		position = target
		cell = path.pop_front()
	else:
		position += to.normalized() * step
	_walk_time += delta
	queue_redraw()


func _draw() -> void:
	var bob := -absf(sin(_walk_time * 12.0)) * 3.0
	var outline := Color("1b1b24")
	_draw_ellipse(Vector2.ZERO, Vector2(12, 5), Color(0, 0, 0, 0.3))
	# Pernas
	var swing := sin(_walk_time * 12.0) * 2.0
	draw_rect(Rect2(-5, -10 + bob, 4, 10 + swing), Color("2d3250"))
	draw_rect(Rect2(1, -10 + bob, 4, 10 - swing), Color("2d3250"))
	# Corpo
	draw_rect(Rect2(-8, -27 + bob, 16, 18), outline)
	draw_rect(Rect2(-7, -26 + bob, 14, 16), Color("d9534f"))
	# Cabeça
	var head := Vector2(0, -33 + bob)
	draw_circle(head, 8, outline)
	draw_circle(head, 7, Color("f2c9a0"))
	draw_circle(head + Vector2(3 * _facing, -1), 1.3, outline)
	# Cabelo
	var hair := PackedVector2Array()
	for i in 9:
		var a := PI + PI * i / 8.0
		hair.append(head + Vector2(cos(a), sin(a)) * 7.5)
	draw_colored_polygon(hair, Color("4a2f1c"))


func _draw_ellipse(center: Vector2, radius: Vector2, color: Color) -> void:
	var pts := PackedVector2Array()
	for i in 24:
		var a := TAU * i / 24.0
		pts.append(center + Vector2(cos(a) * radius.x, sin(a) * radius.y))
	draw_colored_polygon(pts, color)
