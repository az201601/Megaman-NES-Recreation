// Boss context. Phase entry event,shared tick. Owns initialization only,not Draw.
if (argument0 != 6 || cmv_screen_started) exit;
cmv_screen_started = true;
cmv_screen_tick = argument1;
cmv_screen_age = 0;
cmv_screen_intro = 0;
cmv_screen_reveal = 0;
cmv_screen_you_chars = 0;
cmv_screen_weapon_chars = 0;
cmv_screen_demo_requested = false;
cmv_screen_demo_done = false;
// Dedicated draw-only overlay after accepted HUD(-10000)/pause(-20000).
// No independent Step/animation clock or persistent instance.
if (!instance_exists(obj_mm1_cutman_weapon_screen))
    instance_create(0, 0, obj_mm1_cutman_weapon_screen);
