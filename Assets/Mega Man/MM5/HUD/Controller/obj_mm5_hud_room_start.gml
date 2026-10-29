// Other > Room Start: player Create has already initialized mm5_health.
if (instance_number(obj_mm5_hud) != 1)
    show_error("Use exactly ONE obj_mm5_hud in the gameplay room.", true);
if (instance_number(obj_mm5_megaman) != 1)
    show_error("MM5 HUD requires exactly ONE obj_mm5_megaman in this room.", true);
hud_player = instance_find(obj_mm5_megaman, 0);
