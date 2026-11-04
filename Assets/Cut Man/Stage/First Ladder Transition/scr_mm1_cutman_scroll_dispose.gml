// Idempotent camera cleanup; release only our paused charge voice, never music.
if (!route_lists_ready) exit;
scr_mm1_cutman_scroll_finish();
ds_list_destroy(route_voices);
route_lists_ready = false;
