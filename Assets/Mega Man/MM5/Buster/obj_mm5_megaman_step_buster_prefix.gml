// Insert at the very TOP of obj_mm5_megaman > Step, before any possible exit.
buster_slide_at_start = sliding;
if (buster_pose_timer > 0)
{
    buster_pose_timer -= 1;
    if (buster_pose_timer == 0)
    {
        anim_walk_frame = 0;
        anim_walk_timer = 0;
    }
}
