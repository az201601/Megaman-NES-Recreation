// Uninstalled source object contract: parentNONE,spriteNONE,visibleON,
// solidOFF,persistentOFF. No Step/Alarm/Collision events; sole shared controller.
pc_owner = noone;
pc_active = false;
pc_caught = false;
pc_tick = -1;
pc_anim = 0;
pc_draw_frame = 0;
depth = -11;
pc_contacts = ds_map_create();
pc_band = view_yview[0];
pc_room = room;
