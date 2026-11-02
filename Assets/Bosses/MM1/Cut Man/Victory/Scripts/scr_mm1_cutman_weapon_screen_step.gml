// Boss context. Approved MM6-adapted sequence, sole shared tick/freeze guard.
if (!cmv_screen_started || cmv_phase != 8) return;
if (argument1 || cmv_screen_tick == argument0) return;
cmv_screen_tick = argument0;
cmv_screen_age = min(cmv_screen_age + 1, 814);
scr_mm1_cutman_weapon_screen_intro();
cmv_screen_you_chars = clamp(floor((cmv_screen_age - 204) / 4) + 1, 0, 7);
cmv_screen_weapon_chars = clamp(floor((cmv_screen_age - 232) / 4) + 1, 0, 14);
if (cmv_screen_age >= 399) cmv_screen_demo_requested = true;
scr_mm1_cutman_weapon_demo_step();
if (cmv_screen_demo_requested && cmv_screen_demo_done) cmv_screen_done = true;
