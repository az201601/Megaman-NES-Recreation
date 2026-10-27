// OBJECT: obj_game  |  EVENT: Step -> Step
if (global.mm_invuln > 0) global.mm_invuln -= 1;
if (global.mm_message_timer > 0) global.mm_message_timer -= 1;
if (global.mm_ready_timer > 0) global.mm_ready_timer -= 1;

if (keyboard_check_pressed(vk_enter)) global.mm_paused = !global.mm_paused;
if (keyboard_check_pressed(vk_f1)) game_restart();       // quick reset while learning
if (keyboard_check_pressed(vk_f3)) {                     // weapon test cycle
    global.mm_weapon += 1;
    if (global.mm_weapon > 7) global.mm_weapon = 0;
    global.mm_energy[global.mm_weapon] = global.MM_ENERGY_MAX;
}
