// TEMPORARY playback test. Remove this event after successful test.
// F6 does NOT affect player charging/shooting in this checkpoint.
if (keyboard_check_pressed(vk_f6)) scr_mm5_charge_audio_start();
if (!keyboard_check(vk_f6)) scr_mm5_charge_audio_stop();
