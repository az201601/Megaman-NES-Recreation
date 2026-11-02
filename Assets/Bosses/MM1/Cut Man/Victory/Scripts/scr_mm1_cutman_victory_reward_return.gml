// Boss context. argument0 cancellation/death. Called by sole player coordinator.
// Completion is owned by the custom screen/demo, never this reward receiver.
if (argument0 || cmv_phase != 9 || !cmv_screen_done
    || !cmv_reward_requested || cmv_return_started) return false;
// Persistent inventory must already be owned by the accepted session state.
// Never create/reset inventory here: that would erase tanks/lives/other weapons.
if (!instance_exists(obj_mm5_pause_state)) return false;
if (!global.mm5_pause_inventory_ready) return false;
if (!cmv_reward_committed)
{
    // Index1 is the accepted R.CUTTER slot. New unlock gets28 energy; revisiting
    // an owned weapon never refills it or duplicates any collectible reward.
    if (!global.mm5_pause_owned[1])
    {
        global.mm5_pause_owned[1] = true;
        global.mm5_pause_energy[1] = 28;
    }
    global.mm1_cutman_cleared = true;
    cmv_reward_committed = true;
}
// Set before requesting transition; repeated player calls cannot return twice.
cmv_return_started = true;
scr_mm1_cutman_victory_audio_dispose();
room_goto(rm_mm1_stage_select);
return true;
