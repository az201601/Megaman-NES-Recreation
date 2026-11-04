// Insert just AFTER:
// ladder_vertical_input = keyboard_check(vk_down)
//                       - keyboard_check(vk_up);
// and BEFORE ladder_y_min / ladder_y_max or any vertical movement.
scr_mm5_player_try_buster();
if (buster_pose_timer > 0)
{
    ladder_vertical_input = 0;
}
