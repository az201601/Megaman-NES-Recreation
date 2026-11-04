// Room End / Destroy safe to call twice. Queue freed BEFORE buffers deleted.
charge_audio_closing = true;
scr_mm5_charge_audio_stop();
if (charge_audio_intro != -1)
{
    buffer_delete(charge_audio_intro);
    charge_audio_intro = -1;
}
if (charge_audio_loop != -1)
{
    buffer_delete(charge_audio_loop);
    charge_audio_loop = -1;
}
