// Ordinary Draw, NOT Draw GUI. Read-only; all animation advances centrally.
if (!boss_visible) exit;
if (!cm_initialized) { draw_self(); exit; }
// Native boss OAM precedes cutter: draw cutter first so body wins overlaps.
if (cm_cutter != 0)
    draw_sprite(spr_mm1_cutman_combat, cc_draw_sprite, 3072 + cc_x, 720 + cc_y);
draw_sprite(spr_mm1_cutman_combat, cm_draw_sprite, floor(x), floor(y));
