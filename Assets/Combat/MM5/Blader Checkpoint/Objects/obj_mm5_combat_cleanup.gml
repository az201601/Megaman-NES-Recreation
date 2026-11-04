var p;
p = instance_find(obj_mm5_megaman, 0);
if (instance_exists(p))
    if (p.mm5_refill_voice != -1) audio_stop_sound(p.mm5_refill_voice);
// Nonpersistent actors/manager are destroyed by room exit; no instance_activate_all.
