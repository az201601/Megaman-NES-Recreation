// OBJECT: obj_game  |  EVENT: Alarm -> Alarm 0  (player death / respawn)
global.mm_lives -= 1;
global.mm_hp = global.MM_HP_MAX;
global.mm_invuln = 0;
global.mm_dying = false;
if (global.mm_lives < 0) {
    game_restart();                 // replace with a Game Over room in step 11
} else {
    room_restart();                 // rebuilds the player from the room
}
