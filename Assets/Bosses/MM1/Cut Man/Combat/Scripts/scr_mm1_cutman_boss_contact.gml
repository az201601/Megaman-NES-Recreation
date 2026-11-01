// Manager context, AFTER shots: a final hit removes body/cutter danger immediately.
// Original USA boss-damage override FEBB[CutMan0]=4; shared MM5 recoil/protection.
var p, actor, player_half_y;
p = argument0;
if (!instance_exists(p)) exit;
actor = instance_find(obj_mm1_cutman_boss, 0);
if (!instance_exists(actor) || !actor.cm_initialized || !actor.cm_active
    || actor.cm_defeat_pending || !actor.boss_intro_complete) exit;
player_half_y = 12;
if (p.sliding) player_half_y = 5;
if (scr_mm5_combat_overlap(p.x, p.y, actor.x, actor.y, 16, player_half_y + 12))
    scr_mm5_combat_damage(p, 4);
if (actor.cm_cutter != 0
    && scr_mm5_combat_overlap(p.x, p.y, 3072 + actor.cc_x, 720 + actor.cc_y,
        14, player_half_y + 6))
    scr_mm5_combat_damage(p, 4);
