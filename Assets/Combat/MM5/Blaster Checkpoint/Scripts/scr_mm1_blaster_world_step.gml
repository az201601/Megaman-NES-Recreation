// Manager context. Move cannons/projectiles before player shots/contact.
var i, actor;
for (i = instance_number(obj_mm1_blaster) - 1; i >= 0; i -= 1)
{
    actor = instance_find(obj_mm1_blaster, i);
    if (actor.x < view_xview[0] || actor.x >= view_xview[0] + 256
        || actor.blaster_band != view_yview[0])
    { with (actor) instance_destroy(); continue; }
    if (actor.blaster_born_tick == combat_tick) continue;
    with (actor) scr_mm1_blaster_step();
}
for (i = instance_number(obj_mm1_blaster_bullet) - 1; i >= 0; i -= 1)
{
    actor = instance_find(obj_mm1_blaster_bullet, i);
    if (actor.blaster_bullet_born_tick == combat_tick) continue;
    actor.x += actor.blaster_bullet_vx;
    actor.y += actor.blaster_bullet_vy;
    if (actor.x < view_xview[0] || actor.x >= view_xview[0] + 256
        || actor.y < view_yview[0] || actor.y >= view_yview[0] + 240
        || actor.blaster_bullet_band != view_yview[0])
        with (actor) instance_destroy();
}
