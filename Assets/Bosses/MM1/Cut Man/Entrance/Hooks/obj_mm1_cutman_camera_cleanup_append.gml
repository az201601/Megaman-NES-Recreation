// Append to BOTH existing camera Room End and Destroy events, after current code.
if (route_boss_close_voice != -1) audio_stop_sound(route_boss_close_voice);
if (route_boss_appear_voice != -1) audio_stop_sound(route_boss_appear_voice);
if (route_boss_fill_voice != -1) audio_stop_sound(route_boss_fill_voice);
route_boss_close_voice = -1;
route_boss_appear_voice = -1;
route_boss_fill_voice = -1;
route_boss_intro = false;
