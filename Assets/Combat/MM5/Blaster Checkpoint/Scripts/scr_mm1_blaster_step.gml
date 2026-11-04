// Cannon context. Native full animation-byte/firecounter model, one update.
var shot_index, bullet, owner;
shot_index = -1;
blaster_open = (blaster_state & 240) != 0;
blaster_timer = (blaster_timer + 1) & 255;
if (blaster_state < 64)
{
    if (blaster_state < 48)
    {
        if (blaster_timer < 77) blaster_state = 0;
    }
    else
    {
        if (blaster_state == 48) blaster_timer = 0;
        if ((blaster_timer & 31) == 0) shot_index = floor(blaster_timer / 32);
        blaster_state = 49;
        if (blaster_timer == 96) blaster_state = 64;
    }
}
else if (blaster_state >= 96)
{
    blaster_state = 0;
    blaster_timer = 0;
}
// Draw uses the state before the original graphics increment.
blaster_draw_pose = floor(blaster_state / 16);
if (blaster_draw_pose > 3) blaster_draw_pose = 6 - blaster_draw_pose;
if ((blaster_state & 15) < 6) blaster_state += 1;
else if ((blaster_state & 240) < 96) blaster_state = (blaster_state & 240) + 16;
else blaster_state = 0;
if (shot_index >= 0)
{
    owner = instance_find(obj_mm5_combat, 0);
    bullet = instance_create(x + blaster_direction * 7, y, obj_mm1_blaster_bullet);
    bullet.blaster_bullet_band = blaster_band;
    bullet.blaster_bullet_born_tick = owner.combat_tick;
    if (shot_index == 0 || shot_index == 3) bullet.blaster_bullet_vx = 556 / 256;
    else bullet.blaster_bullet_vx = 783 / 256;
    bullet.blaster_bullet_vx *= blaster_direction;
    if (shot_index == 0) bullet.blaster_bullet_vy = -556 / 256;
    else if (shot_index == 1) bullet.blaster_bullet_vy = -104 / 256;
    else if (shot_index == 2) bullet.blaster_bullet_vy = 104 / 256;
    else bullet.blaster_bullet_vy = 556 / 256;
    audio_play_sound(snd_mm1_blaster_fire, 10, false);
}
