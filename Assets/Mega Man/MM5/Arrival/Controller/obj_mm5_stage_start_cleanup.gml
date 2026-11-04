// SAME code in Other > Room End AND Destroy.
if (instance_exists(start_player)) start_player.mm5_startup_active = false;
start_state = 4;
if (start_voice != -1)
{
    if (audio_is_playing(start_voice)) audio_stop_sound(start_voice);
    start_voice = -1;
}
