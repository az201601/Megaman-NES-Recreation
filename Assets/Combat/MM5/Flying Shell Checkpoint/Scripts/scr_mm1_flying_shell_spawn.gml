// Manager context: repeating screen-edge encounters, not killed-record arming.
var i, inside, actor;
for (i = 0; i < shell_spawn_count; i += 1)
{
    inside = shell_spawn_band[i] == view_yview[0]
        && shell_spawn_x[i] >= view_xview[0] && shell_spawn_x[i] < view_xview[0] + 256;
    if (!inside) { shell_spawn_wait[i] = 0; continue; }
    if (instance_exists(shell_spawn_id[i])) continue;
    if (shell_spawn_wait_tick[i] == combat_tick) continue;
    if (shell_spawn_wait[i] > 0) shell_spawn_wait[i] -= 1;
    if (shell_spawn_wait[i] > 0) continue;
    actor = instance_create(shell_spawn_x[i], shell_spawn_y[i], obj_mm1_flying_shell);
    actor.shell_band = shell_spawn_band[i];
    actor.shell_spawn_index = i;
    actor.shell_born_tick = combat_tick;
    shell_spawn_id[i] = actor;
}
