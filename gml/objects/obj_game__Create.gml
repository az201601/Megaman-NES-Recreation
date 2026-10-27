// OBJECT: obj_game  |  EVENT: Create
// Persistent controller. Instance order does not matter: every object calls
// scr_mm_constants() in its own Create event.
scr_mm_constants();
scr_mm_new_game();
persistent = true;
depth = -10000;
if (!instance_exists(obj_hud))    instance_create(0, 0, obj_hud);
if (!instance_exists(obj_camera)) instance_create(0, 0, obj_camera);
