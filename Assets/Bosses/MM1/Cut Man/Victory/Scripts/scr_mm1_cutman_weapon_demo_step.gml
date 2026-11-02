// Called ONLY by screen Step after its shared-tick/freeze guard.
// Fixed native stationary-player demonstration, not gameplay weapon AI.
var sample_age;
if (!cmv_screen_demo_requested || cmv_screen_demo_done) return;
cmv_demo_age += 1;
cmv_demo_pose = -1;
cmv_demo_throwing = false;
sample_age = -1;
if (cmv_demo_age >= 30 && cmv_demo_age <= 101)
    sample_age = cmv_demo_age - 30;
if (cmv_demo_age >= 150 && cmv_demo_age <= 221)
    sample_age = cmv_demo_age - 150;
if (sample_age >= 0)
{
    if (sample_age == 0) cmv_demo_throw_serial += 1;
    cmv_demo_throwing = sample_age < 15;
    scr_mm1_cutman_weapon_demo_sample(sample_age);
    if (cmv_demo_caught)
    {
        cmv_demo_pose = -1;
        cmv_demo_catches += 1;
    }
}
// Native catch acknowledgements are mandatory; tail delay alone cannot finish.
if (cmv_demo_age >= 311 && cmv_demo_catches == 2)
    cmv_screen_demo_done = true;
