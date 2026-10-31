// Stop only the gate voice owned by this camera. Idempotent Room End/Destroy.
if (route_gate_voice != -1)
{
    audio_stop_sound(route_gate_voice);
    route_gate_voice = -1;
}
scr_mm1_cutman_scroll_dispose();
