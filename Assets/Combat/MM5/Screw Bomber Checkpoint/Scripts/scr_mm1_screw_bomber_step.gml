// Turret context. Original AI + pre-increment draw +64animation control.
// argument0=playerworldX; argument1=randombyte ONLY at cooldown choice (native modulo3).
var offset_y, muzzle_y, decrease, burst, choice, i, bullet, owner;
offset_y = 8;
muzzle_y = -4;
if (screw_ceiling) { offset_y = -8; muzzle_y = 4; }
decrease = true;
burst = false;
if (screw_state <= 1)
{
    if (screw_timer != 0) screw_state = 0;
    else if (abs(argument0 - x) >= 80)
    { screw_state = 0; decrease = false; }
    else
    {
        screw_state = 16;
        y -= offset_y;
        screw_timer = 96;
    }
}
else if (screw_state == 80) screw_state = 32;
else if (screw_state < 80)
{
    if (screw_timer == 0)
    {
        choice = argument1 mod 3;
        screw_timer = 32;
        if (choice == 1) screw_timer = 63;
        if (choice == 2) screw_timer = 125;
        screw_state = 80;
    }
    else if ((screw_timer & 31) == 0) burst = true;
}
// Native retract reaches60hex, then restores original floor/ceiling anchorY.
if (screw_state == 96) y += offset_y;
if (decrease) screw_timer = (screw_timer - 1) & 255;
if (burst)
{
    owner = instance_find(obj_mm5_combat, 0);
    // Same native2D projectile/CHR/palette as approved Blaster bullet, no new actor type.
    for (i = 0; i < 5; i += 1)
    {
        bullet = instance_create(x, y + muzzle_y, obj_mm1_blaster_bullet);
        bullet.blaster_bullet_band = screw_band;
        bullet.blaster_bullet_born_tick = owner.combat_tick;
        bullet.blaster_bullet_vx = 0;
        bullet.blaster_bullet_vy = -3;
        if (screw_ceiling) bullet.blaster_bullet_vy = 3;
        if (i == 0) { bullet.blaster_bullet_vx = -3; bullet.blaster_bullet_vy = 0; }
        if (i == 4) { bullet.blaster_bullet_vx = 3; bullet.blaster_bullet_vy = 0; }
        if (i == 1 || i == 3)
        {
            bullet.blaster_bullet_vx = -556 / 256;
            if (i == 3) bullet.blaster_bullet_vx = 556 / 256;
            bullet.blaster_bullet_vy = -556 / 256;
            if (screw_ceiling) bullet.blaster_bullet_vy = 556 / 256;
        }
    }
    // Native five same-frame15requests; reuse approved cue ONCE, not five stacked WAVs.
    audio_play_sound(snd_mm1_blaster_fire, 10, false);
}
screw_draw_pose = floor(screw_state / 16);
if (screw_draw_pose == 5) screw_draw_pose = 1;
else if (screw_draw_pose == 6) screw_draw_pose = 0;
if ((screw_state & 15) < 4) screw_state += 1;
else if ((screw_state & 240) < 96) screw_state = (screw_state & 240) + 16;
else screw_state = 0;
