// Combat-owner context. Same accepted MM5 one-bar/4-update/final-wait policy.
if (combat_weapon_refill_wait > 0)
{
    combat_weapon_refill_wait -= 1;
    if (combat_weapon_refill_wait > 0) return false;
}
if (combat_weapon_refill_left <= 0) return false;
if (global.mm5_pause_energy[1] >= 28)
{ combat_weapon_refill_left = 0; return false; }
global.mm5_pause_energy[1] += 1;
combat_weapon_refill_left -= 1;
combat_weapon_refill_wait = 4;
return true;
