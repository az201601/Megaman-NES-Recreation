// Controller context. Idempotent Room End/Destroy cleanup; no leaked lists/frozen world.
if (!menu_lists_ready) exit;
if (menu_open) scr_mm5_pause_restore();
if (surface_exists(menu_stage_surface)) surface_free(menu_stage_surface);
if (surface_exists(menu_frame_surface)) surface_free(menu_frame_surface);
if (surface_exists(menu_lut_surface)) surface_free(menu_lut_surface);
menu_stage_surface = -1;
menu_frame_surface = -1;
menu_lut_surface = -1;
ds_list_destroy(menu_frozen_list);
ds_list_destroy(menu_voice_list);
menu_lists_ready = false;
global.mm5_pause_active = false;
