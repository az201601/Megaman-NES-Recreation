// argument0=pickup,1=player. Set taken BEFORE effects; one award only.
var item, p, owner, amount;
item = argument0;
p = argument1;
owner = instance_find(obj_mm5_combat, 0);
if (!instance_exists(item) || !instance_exists(p) || !instance_exists(owner)) return false;
if (item.pickup_taken || owner.combat_dead || owner.combat_refilling
    || p.mm5_hurt_left > 0 || p.mm5_startup_active) return false;
item.pickup_taken = true;
if (item.pickup_kind == $75 || item.pickup_kind == $74)
{
    amount = 2;
    if (item.pickup_kind == $74) amount = 10;
    p.mm5_refill_left = min(amount, 28 - p.mm5_health);
    p.mm5_refill_wait = 0;
    if (p.mm5_refill_left > 0)
    {
        with (p)
        {
            if (scr_mm5_health_refill_tick()) scr_mm5_combat_refill_sound();
        }
        owner.combat_refilling = true;
    }
}
if (item.pickup_kind == $78)
{
    global.mm5_lives = min(9, global.mm5_lives + 1);
    audio_play_sound(snd_mm5_extra_life, 12, false);
}
// Weapon energy is collected/removed with NO effect/sound until weapons exist.
// Do not reroll it or silently convert it into health.
with (item) instance_destroy();
return true;
