// Draw only. Shared phase/clock remain in boss/sole player coordinator.
var boss;
boss = instance_find(obj_mm1_cutman_boss, 0);
if (!instance_exists(boss)) exit;
with (boss) scr_mm1_cutman_weapon_screen_present();
