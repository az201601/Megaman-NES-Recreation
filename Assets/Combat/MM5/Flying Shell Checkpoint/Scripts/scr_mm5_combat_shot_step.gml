// Projectile context; central controller is the only movement owner in this stage.
var i, enemy, half_x, half_y, left_edge, right_edge, super_consumed, battery_consumed;
if (object_index == obj_mm5_buster_mid || object_index == obj_mm5_buster_full)
{
    shot_anim_age += 1;
    image_index = floor(shot_anim_age / shot_anim_period) mod shot_anim_frames;
}
if (mm5_shot_deflected)
{
    x += shot_direction * shot_speed;
    y -= 4;
    image_xscale = shot_direction;
    if (x < view_xview[0] || x >= view_xview[0] + 256
        || y < view_yview[0] || y >= view_yview[0] + 240) instance_destroy();
    exit;
}
x += shot_direction * shot_speed;
image_xscale = shot_direction;
half_x = 11;
half_y = 10;
if (object_index == obj_mm5_buster_mid) { half_x = 14; half_y = 14; }
if (object_index == obj_mm5_buster_full) { half_x = 16; half_y = 20; }
for (i = instance_number(obj_mm1_blader) - 1; i >= 0; i -= 1)
{
    enemy = instance_find(obj_mm1_blader, i);
    if (instance_exists(enemy) && !enemy.blader_dead
        && scr_mm5_combat_overlap(x, y, enemy.x, enemy.y, half_x, half_y))
    {
        if (scr_mm5_combat_hit_blader(enemy, id))
        {
            if (object_index != obj_mm5_buster_full) exit;
        }
    }
}
// Blaster halfwidth2/halfheight8 versus Blader8/8: shrink X threshold by6.
for (i = instance_number(obj_mm1_blaster) - 1; i >= 0; i -= 1)
{
    enemy = instance_find(obj_mm1_blaster, i);
    if (scr_mm5_combat_overlap(x, y, enemy.x, enemy.y, half_x - 6, half_y))
    {
        if (scr_mm1_blaster_hit(enemy, id))
        {
            if (mm5_shot_deflected || object_index != obj_mm5_buster_full) exit;
        }
    }
}
// Cutter halfsize8/8 matches Blader; keep collision separate from tall artwork.
for (i = instance_number(obj_mm1_super_cutter) - 1; i >= 0; i -= 1)
{
    enemy = instance_find(obj_mm1_super_cutter, i);
    if (scr_mm5_combat_overlap(x, y, enemy.x, enemy.y, half_x, half_y))
    {
        super_consumed = object_index != obj_mm5_buster_full || enemy.super_hp >= 4;
        if (scr_mm1_super_cutter_hit(enemy, id))
        {
            // A full shot is consumed by a surviving high-HP cutter as in MM5.
            if (super_consumed) exit;
        }
    }
}
// Flea uses the same native8x8 target bounds as Blader/Cutter.
for (i = instance_number(obj_mm1_flea) - 1; i >= 0; i -= 1)
{
    enemy = instance_find(obj_mm1_flea, i);
    if (scr_mm5_combat_overlap(x, y, enemy.x, enemy.y, half_x, half_y))
    {
        if (scr_mm1_flea_hit(enemy, id))
            if (object_index != obj_mm5_buster_full) exit;
    }
}
// Octopus Battery halfsize7: shrink both thresholds by1. Closed eyes stay vulnerable.
for (i = instance_number(obj_mm1_octopus_battery) - 1; i >= 0; i -= 1)
{
    enemy = instance_find(obj_mm1_octopus_battery, i);
    if (scr_mm5_combat_overlap(x, y, enemy.x, enemy.y, half_x - 1, half_y - 1))
    {
        battery_consumed = object_index != obj_mm5_buster_full || enemy.battery_hp >= 4;
        if (scr_mm1_octopus_battery_hit(enemy, id))
            if (battery_consumed) exit;
    }
}
// Shell halfheight9 (one larger than Blader), halfwidth8.
for (i = instance_number(obj_mm1_flying_shell) - 1; i >= 0; i -= 1)
{
    enemy = instance_find(obj_mm1_flying_shell, i);
    if (scr_mm5_combat_overlap(x, y, enemy.x, enemy.y, half_x, half_y + 1))
    {
        if (scr_mm1_flying_shell_hit(enemy, id))
            if (mm5_shot_deflected || object_index != obj_mm5_buster_full) exit;
    }
}
left_edge = view_xview[0];
right_edge = left_edge + view_wview[0];
if (x < left_edge || x >= right_edge) instance_destroy();
