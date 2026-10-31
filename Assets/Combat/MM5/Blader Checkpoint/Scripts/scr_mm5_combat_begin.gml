// Any Begin-Step guard can call this: exactly one tick, independent of ID ordering.
var owner, p;
owner = instance_find(obj_mm5_combat, 0);
if (!instance_exists(owner)) exit;
if (owner.combat_begin_done) exit;
owner.combat_begin_done = true;
p = instance_find(obj_mm5_megaman, 0);
if (!instance_exists(p)) exit;
if (owner.combat_dead)
{
    owner.combat_death_age += 1;
    if (owner.combat_death_age > 300)
    {
        if (global.mm5_lives > 0)
        {
            global.mm5_lives -= 1;
            room_restart();
        }
        else
        {
            // Temporary game-over destination: title, no invented GAME OVER artwork.
            scr_mm5_pause_inventory_init(true);
            room_goto(rm_mm1_title_screen);
        }
    }
    exit;
}
if (owner.combat_refilling)
{
    with (p)
    {
        if (scr_mm5_health_refill_tick()) scr_mm5_combat_refill_sound();
    }
    owner.combat_refilling = p.mm5_refill_left > 0 || p.mm5_refill_wait > 0;
    if (owner.combat_refilling) exit;
}
if (p.mm5_startup_active || scr_mm1_cutman_route_busy()) exit;
owner.combat_tick += 1;
