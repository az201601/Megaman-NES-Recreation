// Called only behind screen shared-tick guard. MM6 stage0 shot cadence and busy
// lock, with original stationary-player Cutter samples (not boss projectile).
var remaining, sample_age;
if (!cmv_screen_demo_requested || cmv_screen_demo_done) exit;
cmv_demo_age = cmv_screen_age - 464;
cmv_demo_pose = -1;
cmv_demo_throwing = false;
if (cmv_demo_age >= 0 && cmv_demo_age < 240)
{
    remaining = 240 - cmv_demo_age;
    if ((remaining + 36) mod 64 == 0 && cmv_demo_active < 0)
    {
        cmv_demo_active = cmv_demo_age;
        cmv_demo_throw_serial += 1;
    }
    if (cmv_demo_active >= 0)
    {
        sample_age = cmv_demo_age - cmv_demo_active;
        cmv_demo_throwing = sample_age < 15;
        scr_mm1_cutman_weapon_demo_sample(sample_age);
        if (cmv_demo_caught)
        {
            cmv_demo_pose = -1;
            cmv_demo_active = -1;
            cmv_demo_catches += 1;
        }
    }
}
// Two real native catches,90-update tail and20-update fade. Never audio-ended.
if (cmv_screen_age >= 814 && cmv_demo_catches == 2)
    cmv_screen_demo_done = true;
