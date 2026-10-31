// Second gate adds page23 atX3072/Y720; width3328, handshake1301.
camera_player = noone;
route_section = 0;
route_target_section = 0;
route_start_version = 0;
route_busy = false;
route_tick = 0;
route_dir = -1;
route_entry_x = 0;
route_entry_y = 0;
route_was_ladder = false;
route_fall_speed = 0;
route_fire_key = ord("X");
route_fire_held = false;
route_fire_released = false;
route_block_fire = false;
route_charge_object = asset_get_index("obj_mm5_charge_audio");
route_voices = ds_list_create();
route_lists_ready = true;
if (room_width != 3328 || room_height != 2160 || room_speed != 60)
    show_error("Cut Man ladder route requires3328x2160 room, speed60.", true);
if (!view_enabled || !view_visible[0] || view_wview[0] != 256 || view_hview[0] != 240)
    show_error("Cut Man ladder route requires visible view0 at256x240.", true);
view_object[0] = noone;
view_xview[0] = 0;
view_yview[0] = 1920;
route_origin_y = 1920;
route_unlock = 126;

route_gate_mode = false;
route_gate = noone;
route_gate_voice = -1;

route_gate_origin_x = 2048;
route_gate_second = false;
