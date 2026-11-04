// obj_mm5_charge_audio > Create. One nonpersistent, invisible manager per room.
charge_audio_queue = -1;
charge_audio_voice = -1;
charge_audio_intro = -1;
charge_audio_loop = -1;
charge_audio_closing = false;
charge_audio_intro = buffer_load(working_directory + "mm5_charge_intro.pcm");
charge_audio_loop = buffer_load(working_directory + "mm5_charge_loop.pcm");
if (charge_audio_intro == -1 || charge_audio_loop == -1)
{
    scr_mm5_charge_audio_dispose();
    show_error("MM5 charge PCM files missing: add both files to Included Files.", true);
    exit;
}
