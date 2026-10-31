// Native two palette phases share the controller clock, not per-item image_speed.
var owner, phase, art;
owner = instance_find(obj_mm5_combat, 0);
if (!instance_exists(owner) || pickup_taken) exit;
if (pickup_age > 195 && ((255 - pickup_age) & 2) != 0) exit;
phase = floor(owner.combat_tick / 9) mod 2;
art = spr_mm5_pickup_small_health;
if (pickup_kind == $74) art = spr_mm5_pickup_large_health;
if (pickup_kind == $77) art = spr_mm5_pickup_small_weapon;
if (pickup_kind == $76) art = spr_mm5_pickup_large_weapon;
if (pickup_kind == $78)
{
    art = spr_mm5_pickup_extra_life;
    phase = 0;
}
draw_sprite(art, phase, floor(x), floor(y));
