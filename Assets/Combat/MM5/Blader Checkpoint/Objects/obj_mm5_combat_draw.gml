if (!combat_dead) exit;
var i, xx, yy;
for (i = 0; i < 16; i += 1)
{
    xx = combat_death_x + combat_death_vx[i] * combat_death_age;
    yy = combat_death_y + combat_death_vy[i] * combat_death_age;
    if (xx >= view_xview[0] - 16 && xx < view_xview[0] + 272
        && yy >= view_yview[0] - 16 && yy < view_yview[0] + 256)
        draw_sprite(spr_mm5_combat_explosion, floor(combat_death_age / 3) mod 5, floor(xx), floor(yy));
}
