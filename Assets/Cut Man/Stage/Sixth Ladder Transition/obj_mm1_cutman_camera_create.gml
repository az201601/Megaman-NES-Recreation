// REPLACE existing camera Create. World lowerY1440; page4/5/6 Y1200/960/720; stripe7..9 Y480; page10Y240/page11Y0.
camera_player = noone;
route_section = 0;
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
if (room_width != 1536 || room_height != 1680 || room_speed != 60)
    show_error("Cut Man ladder route requires1536x1680 room, speed60.", true);
if (!view_enabled || !view_visible[0] || view_wview[0] != 256 || view_hview[0] != 240)
    show_error("Cut Man ladder route requires visible view0 at256x240.", true);
view_object[0] = noone;
view_xview[0] = 0;
view_yview[0] = 1440;
route_origin_y = 1440;
route_unlock = 126;
