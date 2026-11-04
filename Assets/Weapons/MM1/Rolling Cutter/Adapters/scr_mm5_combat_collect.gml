// argument0=pickup,1=player. Set taken BEFORE effects; one award only.
var item, p, owner, amount;
item = argument0;
p = argument1;
owner = instance_find(obj_mm5_combat, 0);
if (!instance_exists(item) || !instance_exists(p) || !instance_exists(owner)) return false;
if (item.pickup_taken || owner.combat_dead || owner.combat_refilling
    || p.mm5_hurt_left > 0 || p.mm5_startup_active) return false;
// Dedicated fixed E-Tank: leave it available at cap, no immediate health effect.
if (item.object_index == obj_mm1_cutman_e_tank)
{
    if (global.mm1_cutman_e_tank_taken || global.mm5_pause_tanks[0] >= 9) return false;
    item.pickup_taken = true;
    global.mm1_cutman_e_tank_taken = true;
    global.mm5_pause_tanks[0] = min(9, global.mm5_pause_tanks[0] + 1);
    // Native E-tank and extra-life pickups both request24hex; reuse approved sound only.
    audio_play_sound(snd_mm5_extra_life, 12, false);
    with (item) instance_destroy();
    return true;
}
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
// Equipped Cutter only; Buster cannot silently refill another weapon.
// W/M tanks and Balancer behaviour remain deferred,unchanged.
if ((item.pickup_kind == $77 || item.pickup_kind == $76)
    && global.mm5_equipped_weapon == 1 && global.mm5_pause_owned[1])
{
    amount = 2;
    if (item.pickup_kind == $76) amount = 10;
    owner.combat_weapon_refill_left = min(amount, 28 - global.mm5_pause_energy[1]);
    owner.combat_weapon_refill_wait = 0;
    if (owner.combat_weapon_refill_left > 0)
    {
        with (owner)
            if (scr_mm1_player_cutter_refill_tick()) scr_mm5_combat_refill_sound();
        owner.combat_refilling = true;
    }
}
with (item) instance_destroy();
return true;
