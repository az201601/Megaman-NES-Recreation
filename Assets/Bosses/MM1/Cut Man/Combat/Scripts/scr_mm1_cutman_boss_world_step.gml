// Combat manager context, before player-shot movement. No actor Step event.
var p, actor, active_tick;
p = argument0;
if (!instance_exists(p)) exit;
actor = instance_find(obj_mm1_cutman_boss, 0);
if (!instance_exists(actor) || !actor.boss_intro_complete || !actor.boss_visible) exit;
if (combat_dead || combat_refilling || p.mm5_startup_active || global.mm5_pause_active) exit;
active_tick = combat_tick;
if (actor.cm_last_tick == active_tick) exit;
actor.cm_last_tick = active_tick;
with (actor)
{
    if (!cm_initialized)
    {
        cm_initialized = true;
        cm_active = true;
        cm_x = floor(x) - 3072;
        cm_y = floor(y) - 720;
    }
    if (!cm_active || cm_defeat_pending) exit;
    cm_target_x = clamp(floor(p.x) - 3072, 0, 255);
    cm_target_y = clamp(floor(p.y) - 720, 0, 255);
    cm_target_ladder = p.on_ladder;
    // Explicit project RNG adaptation: one byte per active update, shared by
    // decisions within that update. Not the native raster-coupled RNG sequence.
    cm_seed = irandom(255);
    scr_mm1_cutman_cutter_manage(active_tick);
    scr_mm1_cutman_boss_decide();
    if (cm_throw_requested) scr_mm1_cutman_cutter_throw();
    scr_mm1_cutman_cutter_move(scr_mm1_cutman_animation_header(69));
}
