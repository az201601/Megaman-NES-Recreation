// SCRIPT: scr_mm_hurt_player(damage, source_x)
// 1:1 rules: 111 frames of mercy invincibility, 0.5625 px/f knockback,
// and death at 0 HP. Spikes pass 999.
var dmg, sx;
dmg = argument0; sx = argument1;
if (global.mm_dying) exit;
if (global.mm_invuln > 0) exit;

global.mm_hp -= dmg;
global.mm_invuln = global.MM_INVULN;

if (global.mm_hp <= 0) {
    global.mm_hp = 0;
    global.mm_dying = true;
    if (instance_exists(obj_player)) {
        instance_create(obj_player.x, obj_player.y, obj_explosion);
        with (obj_player) instance_destroy();
    }
    obj_game.alarm[0] = 90;            // ~1.5 s before respawn
} else {
    with (obj_player) {
        hurt_timer = 24;
        hurt_dir = sign(x - sx);
        if (hurt_dir == 0) hurt_dir = -facing;
        vsp = -2;
        state = global.MM_ST_HURT;
    }
}
