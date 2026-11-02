// Boss context. Shared tick,frozen. Custom presentation timings,not native1:1.
if (!cmv_screen_started || cmv_phase != 8) return;
if (argument1 || cmv_screen_tick == argument0) return;
cmv_screen_tick = argument0;
// Hold approved name-card composition after reveal; unfinished demo cannot time out.
cmv_screen_age = min(cmv_screen_age + 1, 220);
cmv_screen_reveal = min(96, cmv_screen_age * 2);
cmv_screen_you_chars = clamp(floor((cmv_screen_age - 60) / 4) + 1, 0, 7);
cmv_screen_weapon_chars = clamp(floor((cmv_screen_age - 100) / 4) + 1, 0, 14);
if (cmv_screen_age >= 220) cmv_screen_demo_requested = true;
scr_mm1_cutman_weapon_demo_step();
// Only actual demonstration owner may acknowledge. No elapsed-time/audio test.
if (cmv_screen_demo_requested && cmv_screen_demo_done) cmv_screen_done = true;
