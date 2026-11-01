// Manager context: native record enters the256px view, then waits one update.
var i, inside, actor;
for (i = 0; i < big_eye_spawn_count; i += 1)
{
    inside = big_eye_spawn_band[i] == view_yview[0]
        && big_eye_spawn_x[i] >= view_xview[0] && big_eye_spawn_x[i] < view_xview[0] + 256;
    if (!inside) { big_eye_spawn_armed[i] = true; continue; }
    if (!big_eye_spawn_armed[i] || instance_exists(big_eye_spawn_id[i])) continue;
    actor = instance_create(big_eye_spawn_x[i], big_eye_spawn_y[i], obj_mm1_big_eye);
    actor.big_eye_band = big_eye_spawn_band[i];
    actor.big_eye_born_tick = combat_tick;
    big_eye_spawn_id[i] = actor;
    big_eye_spawn_armed[i] = false;
}
