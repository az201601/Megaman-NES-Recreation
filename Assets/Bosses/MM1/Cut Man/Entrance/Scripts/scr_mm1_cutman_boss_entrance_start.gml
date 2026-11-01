// Camera context. Gate scroll age120 commit; keep existing route ownership/charge lock.
if (route_boss_intro) exit;
route_boss_intro = true;
route_boss_intro_tick = 0;
route_gate_mode = false;
route_section = 13;
route_boss_actor = instance_create(3264, 900, obj_mm1_cutman_boss);
camera_player.x = 3096.5625;
camera_player.y = route_entry_y;
camera_player.sprite_index = spr_mm5_megaman_idle;
camera_player.image_index = 0;
camera_player.image_speed = 0;
view_xview[0] = 3072;
view_yview[0] = 720;
// Stop ONLY accepted stage voice; original stage still owns its buffers/queue cleanup.
var stage;
stage = instance_find(obj_mm1_cutman_stage, 0);
if (instance_exists(stage))
{
    stage.stage_audio_closing = true;
    stage.alarm[0] = -1;
    if (stage.stage_music_voice != -1) audio_stop_sound(stage.stage_music_voice);
}
if (!instance_exists(obj_mm1_cutman_boss_music))
    instance_create(0, 0, obj_mm1_cutman_boss_music);
