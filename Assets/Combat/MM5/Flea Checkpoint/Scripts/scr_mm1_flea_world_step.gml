// Manager context, before player projectiles/contact. No actor Step events.
var p, i, actor, random_byte;
p = argument0;
for (i = instance_number(obj_mm1_flea) - 1; i >= 0; i -= 1)
{
    actor = instance_find(obj_mm1_flea, i);
    if (actor.flea_band != view_yview[0]) { with (actor) instance_destroy(); continue; }
    if (actor.flea_born_tick == combat_tick) continue;
    // Use a byte only when launching, not once per enemy per frame.
    random_byte = 0;
    if (!actor.flea_airborne && actor.flea_timer == 1) random_byte = irandom(255);
    with (actor) scr_mm1_flea_step(p.x, other.combat_tick, random_byte);
    if (actor.x < view_xview[0] || actor.x >= view_xview[0] + 256
        || actor.y < view_yview[0] || actor.y >= view_yview[0] + 240)
        with (actor) instance_destroy();
}
