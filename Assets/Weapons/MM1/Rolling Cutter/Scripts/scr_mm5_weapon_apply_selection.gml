// Player context, AFTER pause restore reactivates its exact frozen IDs.
// argument0 requested slot. Only connected owned weapons0/1 may equip.
var requested;
requested = argument0;
if (requested != 0 && requested != 1) return false;
if (!global.mm5_pause_owned[requested]) return false;
if (global.mm5_equipped_weapon == requested) return true;
// Never destroy inactive IDs or activate the world while menu is open.
with (obj_mm1_player_cutter) instance_destroy();
with (obj_mm5_buster_shot) instance_destroy();
scr_mm5_combat_stop_charge();
buster_charge = 0;
buster_pose_timer = 0;
global.mm5_equipped_weapon = requested;
return true;
