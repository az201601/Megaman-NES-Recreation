// Projectile context; central controller is the only movement owner in this stage.
var i, enemy, half_x, half_y, left_edge, right_edge;
if (object_index == obj_mm5_buster_mid || object_index == obj_mm5_buster_full)
{
    shot_anim_age += 1;
    image_index = floor(shot_anim_age / shot_anim_period) mod shot_anim_frames;
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
left_edge = view_xview[0];
right_edge = left_edge + view_wview[0];
if (x < left_edge || x >= right_edge) instance_destroy();
