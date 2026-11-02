// Player context, called from the TOP Step prefix after scr_mm5_combat_begin().
// Returns true whenever victory owns the player, including frozen/terminal phases.
// Sole victory phase/motion clock; do NOT also call from camera or actor Step.
var boss, owner, next_tick, frozen, cancelled, event, px, supported;
boss = instance_find(obj_mm1_cutman_boss, 0);
if (!instance_exists(boss) || !boss.cm_defeat_pending) return false;
owner = instance_find(obj_mm5_combat, 0);
if (!instance_exists(owner)) return true;
next_tick = owner.combat_tick;
frozen = owner.combat_refilling || global.mm5_pause_active;
cancelled = owner.combat_dead;
px = x;
supported = grounded;
event = 0;
with (boss)
{
    // Body disappearance ack starts the wait; particles continue concurrently.
    scr_mm1_cutman_defeat_step(next_tick, frozen);
    scr_mm1_cutman_victory_anim_step(next_tick, frozen);
    scr_mm1_cutman_weapon_screen_step(next_tick, frozen);
    event = scr_mm1_cutman_victory_step(next_tick, frozen, cancelled,
        cmv_defeat_done, px, supported, cmv_acquisition_done,
        cmv_teleport_done, cmv_screen_done);
}
if (event != 0)
{
    boss.cmv_entry_event = event;
    boss.cmv_entry_serial += 1;
    if (event == 8) boss.cmv_fx_count = 0;
    // Each renderer/scene must acknowledge its OWN current animation, not stale data.
    if (event == 4) boss.cmv_acquisition_done = false;
    if (event == 5) boss.cmv_teleport_done = false;
    if (event == 6) boss.cmv_screen_done = false;
}
// Start at the real supported position; do not let the renderer move collision.
if (boss.cmv_snap) x = boss.cmv_center;
if (event != 0)
{
    with (boss) scr_mm1_cutman_victory_anim_enter(event, other.x, other.y, next_tick);
    with (boss) scr_mm1_cutman_weapon_screen_enter(event, next_tick);
}
// Audio serial consumption is independent of phase advancement (cancel/freeze).
with (boss) scr_mm1_cutman_victory_audio_step(frozen);
// Reward receiver retries only after actual screen completion. No screen timer.
// A missing persistent state holds safely rather than resetting the inventory.
if (boss.cmv_phase == 9)
    with (boss) scr_mm1_cutman_victory_reward_return(cancelled);
if (!boss.cmv_advanced) return true;
// Before acquisition, continue real MM5 gravity under locked input. No snap Y.
if (boss.cmv_phase <= 5)
    scr_mm1_cutman_victory_player_tick(next_tick, false, boss.cmv_move);
return true;
