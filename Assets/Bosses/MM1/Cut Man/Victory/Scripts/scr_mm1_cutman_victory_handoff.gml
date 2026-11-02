// Called synchronously from the lethal-hit adapter AFTER its combat-disable latch.
// argument0 boss. Never replay the final-hit transaction on later colliding shots.
var boss, player;
boss = argument0;
if (!instance_exists(boss) || !boss.cm_defeat_pending || boss.cmv_phase != 0) return false;
with (boss) scr_mm1_cutman_victory_start(3200);
boss.cmv_entry_event = 1;
boss.cmv_entry_serial += 1;
player = instance_find(obj_mm5_megaman, 0);
if (instance_exists(player))
    with (player) scr_mm1_cutman_victory_player_begin();
// Dispose only known owners. Never audio_stop_all (UI/refill ownership is separate).
scr_mm5_combat_stop_charge();
scr_mm1_cutman_boss_stop_combat();
// Approved existing player-death sound, once on successful lethal handoff.
// Never call player death: no life loss, retry or inventory reset.
audio_play_sound(snd_mm5_megaman_death, 15, false);
// No drops, no post-hit projectile motion; includes mid/full descendants.
with (obj_mm5_buster_shot) instance_destroy();
return true;
