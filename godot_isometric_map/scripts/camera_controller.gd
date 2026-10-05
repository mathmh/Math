extends Camera2D
## Câmera com pan (WASD/setas/botão do meio), zoom na roda do mouse e modo "seguir".

@export var pan_speed := 600.0
@export var min_zoom := 0.4
@export var max_zoom := 3.0
@export var zoom_step := 1.1

var follow_target: Node2D
var follow := true

var _dragging := false


func _ready() -> void:
	zoom = Vector2(1.5, 1.5)
	position_smoothing_enabled = true
	position_smoothing_speed = 8.0


func snap_to(pos: Vector2) -> void:
	position = pos
	reset_smoothing()


func _process(delta: float) -> void:
	var dir := Input.get_vector("ui_left", "ui_right", "ui_up", "ui_down")
	dir += Vector2(
		float(Input.is_physical_key_pressed(KEY_D)) - float(Input.is_physical_key_pressed(KEY_A)),
		float(Input.is_physical_key_pressed(KEY_S)) - float(Input.is_physical_key_pressed(KEY_W)))
	if dir != Vector2.ZERO:
		follow = false
		position += dir.normalized() * pan_speed * delta / zoom.x
	elif follow and follow_target:
		position = follow_target.global_position


func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventMouseButton:
		match event.button_index:
			MOUSE_BUTTON_WHEEL_UP:
				if event.pressed:
					_zoom_at(zoom_step, get_global_mouse_position())
			MOUSE_BUTTON_WHEEL_DOWN:
				if event.pressed:
					_zoom_at(1.0 / zoom_step, get_global_mouse_position())
			MOUSE_BUTTON_MIDDLE:
				_dragging = event.pressed
	elif event is InputEventMouseMotion and _dragging:
		follow = false
		position -= event.relative / zoom.x


## Aplica o zoom mantendo fixo o ponto do mundo sob o mouse.
func _zoom_at(factor: float, anchor: Vector2) -> void:
	var old := zoom.x
	var new_zoom := clampf(old * factor, min_zoom, max_zoom)
	if is_equal_approx(new_zoom, old):
		return
	if not follow:
		position = anchor + (get_screen_center_position() - anchor) * (old / new_zoom)
		reset_smoothing()
	zoom = Vector2(new_zoom, new_zoom)
