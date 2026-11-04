// Shell context. Native movement precedes cycle decisions; no gravity/homing.
var i, bullet, owner;
owner = instance_find(obj_mm5_combat, 0);
shell_open = (shell_state & 240) != 0;
x -= shell_vx;
if (x < view_xview[0])
{
    // Native no-kill exit immediately re-enters from the right, retaining Xfraction.
    x = view_xview[0] + 248 + x - floor(x);
    shell_timer = 0;
    shell_state = 1;
    shell_vx = 288 / 256;
    shell_hp = 1;
    shell_open = false;
    shell_draw_pose = 0;
    exit;
}
shell_timer = (shell_timer + 1) & 255;
if (shell_timer == 56) { shell_vx = 0; shell_state = 16; }
else if (shell_timer == 72)
{
    // Original2D projectiles: share accepted Blaster bullet motion/contact owner, separate native palette.
    for (i = 0; i < 8; i += 1)
    {
        bullet = instance_create(x, y, obj_mm1_flying_shell_bullet);
        bullet.blaster_bullet_band = shell_band;
        bullet.blaster_bullet_born_tick = owner.combat_tick;
        bullet.blaster_bullet_vx = 0;
        bullet.blaster_bullet_vy = 0;
        if (i == 0) bullet.blaster_bullet_vy = -4;
        if (i == 1) { bullet.blaster_bullet_vx = -720 / 256; bullet.blaster_bullet_vy = -720 / 256; }
        if (i == 2) bullet.blaster_bullet_vx = -4;
        if (i == 3) { bullet.blaster_bullet_vx = -720 / 256; bullet.blaster_bullet_vy = 720 / 256; }
        if (i == 4) bullet.blaster_bullet_vy = 4;
        if (i == 5) { bullet.blaster_bullet_vx = 720 / 256; bullet.blaster_bullet_vy = 720 / 256; }
        if (i == 6) bullet.blaster_bullet_vx = 4;
        if (i == 7) { bullet.blaster_bullet_vx = 720 / 256; bullet.blaster_bullet_vy = -720 / 256; }
    }
    // One full-APU recording of all8native requests, NOT8stacked single-shot WAVs.
    audio_play_sound(snd_mm1_flying_shell_fire, 10, false);
}
else if (shell_timer >= 88) { shell_vx = 288 / 256; shell_timer = 0; shell_state = 0; }
else shell_state = shell_state & 240;
shell_draw_pose = floor(shell_state / 16);
if ((shell_state & 15) < 8) shell_state += 1;
else if ((shell_state & 240) < 16) shell_state = (shell_state & 240) + 16;
else shell_state = 0;
