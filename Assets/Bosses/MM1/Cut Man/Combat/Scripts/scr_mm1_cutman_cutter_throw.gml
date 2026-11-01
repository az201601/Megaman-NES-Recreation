// Boss context; call only when decision sets cm_throw_requested.
// Single owned cutter; native allocation integer-spawns with zero fractions.
// No object/Draw event yet: boss owns projectile state until actor integration.
if (cm_cutter != 0) exit;
cc_face_right = cm_face_right;
cc_x = cm_x - 8;
if (cc_face_right) cc_x = cm_x + 8;
cc_x = (cc_x + 256) mod 256;
cc_y = (cm_y + 246) mod 256;
cc_x_fp = cc_x * 256;
cc_y_fp = cc_y * 256;
cc_anim = 0;
cc_draw_frame = 0;
cc_caught = false;
cc_base = 608;
// Native allocation copies facing BEFORE the throw's SearchMegaman call.
cc_dx = scr_mm1_cutman_boss_face();
cc_upward = cc_y >= cm_target_y;
cc_dy_byte = (cc_y - cm_target_y + 256) mod 256;
scr_mm1_cutman_cutter_aim();
cm_cutter = 1;
audio_play_sound(snd_mm1_cutman_rolling_cutter_throw, 10, false);
