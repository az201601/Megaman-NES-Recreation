// Manager context; argument0=player. Rechecked every active update, not an enter-only collision.
// Numeric 16x16 hazard tiles, separate from sprite alpha and underlying solid platforms.
var p, i, spike, px, py, width, top_edge, bottom_edge, left_edge, right_edge;
p = argument0;
if (!instance_exists(p) || combat_dead || combat_refilling || p.mm5_startup_active
    || scr_mm1_cutman_route_busy()) return false;
// MM5 protects BOTH recoil and the following flashing interval. Never latch immunity.
if (p.mm5_hurt_left > 0 || p.mm5_invulnerable > 0) return false;
px = floor(p.x);
py = floor(p.y);
width = 7;
top_edge = floor(p.y - p.head_offset);
bottom_edge = floor(p.y + p.feet_offset);
if (p.sliding) { width = 14; top_edge = py - 3; }
left_edge = px - width;
right_edge = px + width;
for (i = instance_number(obj_mm1_cutman_spike) - 1; i >= 0; i -= 1)
{
    spike = instance_find(obj_mm1_cutman_spike, i);
    if (!instance_exists(spike)) continue;
    // Spike objects use top-left origin0,0. Full native tile, not triangular alpha-mask.
    if (right_edge < floor(spike.x) || left_edge >= floor(spike.x) + 16
        || bottom_edge < floor(spike.y) || top_edge >= floor(spike.y) + 16) continue;
    // Ordinary lethal death, not pit death: retains the accepted16-particle explosion/cue/retry.
    scr_mm5_combat_die(p);
    return true;
}
return false;
