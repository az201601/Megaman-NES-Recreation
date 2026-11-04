// Controller context. Called ONLY by camera End Step AFTER final view placement.
// Projectile End Steps are guarded, so their instance event order cannot double-move.
var p, i, enemy, shot, item, boom, half_y, inside, spawn;
scr_mm5_combat_begin();
p = instance_find(obj_mm5_megaman, 0);
if (!instance_exists(p)) { combat_begin_done = false; exit; }
if (combat_dead || combat_refilling || p.mm5_startup_active)
{ combat_begin_done = false; exit; }
if (scr_mm1_cutman_route_busy())
{
    if (!combat_route_was_busy)
    {
        with (obj_mm1_blader) instance_destroy();
        with (obj_mm5_pickup) instance_destroy();
        with (obj_mm5_enemy_explosion) instance_destroy();
        for (i = 0; i < combat_spawn_count; i += 1) combat_spawn_armed[i] = true;
    }
    combat_route_was_busy = true;
    combat_begin_done = false;
    exit;
}
combat_route_was_busy = false;
// Existing enemies move first, using final player position; new spawns wait one update.
for (i = instance_number(obj_mm1_blader) - 1; i >= 0; i -= 1)
{
    enemy = instance_find(obj_mm1_blader, i);
    if (enemy.blader_born_tick == combat_tick) continue;
    with (enemy)
    {
        scr_mm1_blader_ai(p.x, p.y);
        blader_age += 1;
        if (x < view_xview[0] || x >= view_xview[0] + 256
            || blader_band_y != view_yview[0]) instance_destroy();
    }
}
// Shots can kill before body contacts are considered.
with (obj_mm5_buster_shot) scr_mm5_combat_shot_step();
// Complete explosions and roll exactly ONCE, never on offscreen cleanup/Destroy.
for (i = instance_number(obj_mm5_enemy_explosion) - 1; i >= 0; i -= 1)
{
    boom = instance_find(obj_mm5_enemy_explosion, i);
    if (boom.explosion_born_tick == combat_tick) continue;
    boom.explosion_age += 1;
    if (boom.explosion_age >= 13 && !boom.explosion_drop_done)
    {
        boom.explosion_drop_done = true;
        spawn = scr_mm5_enemy_drop_from_byte(irandom(255));
        if (spawn != -1)
        {
            item = instance_create(boom.x, boom.y, obj_mm5_pickup);
            item.pickup_kind = spawn;
            item.pickup_born_tick = combat_tick;
        }
        with (boom) instance_destroy();
    }
}
// Contact is blocked during recoil AND subsequent timer; never use sprite masks.
half_y = 20;
if (p.sliding) half_y = 13;
for (i = instance_number(obj_mm1_blader) - 1; i >= 0; i -= 1)
{
    enemy = instance_find(obj_mm1_blader, i);
    if (scr_mm5_combat_overlap(p.x, p.y, enemy.x, enemy.y, 16, half_y))
        scr_mm5_combat_damage(p, 3);
}
// Collection after contact: a newly hurt player cannot immediately negate that hit.
if (!combat_dead)
for (i = instance_number(obj_mm5_pickup) - 1; i >= 0; i -= 1)
{
    item = instance_find(obj_mm5_pickup, i);
    if (item.pickup_born_tick == combat_tick) continue;
    with (item) scr_mm5_combat_pickup_step();
    if (!instance_exists(item)) continue;
    half_y = 20;
    if (p.sliding) half_y = 13;
    if (scr_mm5_combat_overlap(p.x, p.y, item.x, item.y, 16, half_y))
    {
        scr_mm5_combat_collect(item, p);
        if (combat_refilling) break;
    }
}
// Native renderer tests PRE-decrement counter bit1, then stores decremented timer.
p.mm5_blink_sample = p.mm5_invulnerable;
if (p.mm5_invulnerable > 0) p.mm5_invulnerable -= 1;
// Spawn when the original record enters the256px view. Anchor re-arms offscreen;
// active record ID prevents duplicates while its enemy pursues inside the view.
if (!combat_dead && !combat_refilling)
for (i = 0; i < combat_spawn_count; i += 1)
{
    inside = combat_spawn_band[i] == view_yview[0]
        && combat_spawn_x[i] >= view_xview[0]
        && combat_spawn_x[i] <= view_xview[0] + 255;
    if (!inside) { combat_spawn_armed[i] = true; continue; }
    if (!combat_spawn_armed[i] || instance_exists(combat_spawn_id[i])) continue;
    enemy = instance_create(combat_spawn_x[i], combat_spawn_y[i], obj_mm1_blader);
    enemy.blader_band_y = combat_spawn_band[i];
    enemy.blader_spawn_index = i;
    enemy.blader_born_tick = combat_tick;
    combat_spawn_id[i] = enemy;
    combat_spawn_armed[i] = false;
}
combat_begin_done = false;
