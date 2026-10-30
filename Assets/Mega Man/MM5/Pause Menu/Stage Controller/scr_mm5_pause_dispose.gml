// Controller context. Idempotent Room End/Destroy cleanup; no leaked lists/frozen world.
if (!menu_lists_ready) exit;
if (menu_open) scr_mm5_pause_restore();
ds_list_destroy(menu_frozen_list);
ds_list_destroy(menu_voice_list);
menu_lists_ready = false;
global.mm5_pause_active = false;
