// REPLACE normal shot End Step. No added movement in Step.
if (instance_exists(obj_mm5_combat)) exit;
// obj_mm5_buster_shot > End Step, NOT normal Step.
// Later, firing in player Step will create the shot before this movement phase.
x += shot_direction * shot_speed;
image_xscale = shot_direction;

// GMS camera adaptation: use active view0, or room bounds if views are disabled.
// Static256px boundary traces match the measured standing ROM shot lifetime.
var shot_left, shot_right;
shot_left = 0;
shot_right = room_width;
if (view_enabled && view_visible[0])
{
    shot_left = view_xview[0];
    shot_right = shot_left + view_wview[0];
}
if (x < shot_left || x >= shot_right)
{
    instance_destroy();
}
