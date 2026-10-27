// SCRIPT: scr_mm_new_game
// PURPOSE: mutable game state. CALL ONCE from obj_game Create only.

var i;

global.mm_hp       = global.MM_HP_MAX;
global.mm_lives    = 3;
global.mm_score    = 0;
global.mm_weapon   = 0;
global.mm_invuln   = 0;
global.mm_dying    = false;
global.mm_paused   = false;
global.mm_boss_active = false;
global.mm_message  = "";
global.mm_message_timer = 0;
global.mm_ready_timer = 0;

for (i = 0; i < 8; i += 1) {
    global.mm_energy[i] = 0;
    global.mm_unlocked[i] = 0;
    global.mm_boss_defeated[i] = 0;
}
global.mm_unlocked[0] = 1;          // Mega Buster always available

global.mm_checkpoint_x = 40;
global.mm_checkpoint_y = 180;
