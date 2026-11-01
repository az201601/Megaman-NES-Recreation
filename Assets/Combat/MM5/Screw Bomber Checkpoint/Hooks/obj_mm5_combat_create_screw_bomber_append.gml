// APPEND ONCE after accepted seven-enemy/Free Fall manager Create code.
screw_spawn_count = 3;
screw_spawn_x[0] = 2520; screw_spawn_y[0] = 880; screw_spawn_ceiling[0] = false;
screw_spawn_x[1] = 2760; screw_spawn_y[1] = 816; screw_spawn_ceiling[1] = true;
screw_spawn_x[2] = 2896; screw_spawn_y[2] = 880; screw_spawn_ceiling[2] = false;
var screw_init;
for (screw_init = 0; screw_init < screw_spawn_count; screw_init += 1)
{
    screw_spawn_band[screw_init] = 720;
    screw_spawn_armed[screw_init] = true;
    screw_spawn_id[screw_init] = noone;
}
