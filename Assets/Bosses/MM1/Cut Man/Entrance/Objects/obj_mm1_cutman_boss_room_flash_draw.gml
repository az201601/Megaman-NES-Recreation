// Ordinary Draw, NOT Draw GUI. Only original grey-wall palette2 pixels are opaque.
var camera, flash_tick;
camera = instance_find(obj_mm1_cutman_camera, 0);
if (!instance_exists(camera)) exit;
if (!camera.route_boss_intro) exit;
flash_tick = camera.route_boss_intro_tick;
// Actual original-render phases: bright1..8/17..24/33..40/49..56/65..71.
// Normal from72 onward, long before door183/boss209/health211.
if (flash_tick < 1 || flash_tick >= 72) exit;
if ((floor((flash_tick - 1) / 8) mod 2) != 0) exit;
draw_sprite_ext(spr_mm1_cutman_boss_room_flash, 0, x, y, 1, 1, 0, c_white, 1);
