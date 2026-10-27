// SCRIPT: scr_mm_weapon_damage(boss_id, weapon_id) -> damage
// The 11x8 ROM table stored flat in global.mm_dmg.
var b, w;
b = argument0; w = argument1;
if (b < 0 || b > 10 || w < 0 || w > 7) return 0;
return global.mm_dmg[b*8 + w];
