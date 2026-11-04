// Called once per eligible player Step; never from Draw or projectile events.
if (!keyboard_check_pressed(buster_fire_key)) return false;
if (sliding || buster_slide_at_start) return false;
// Endpoint/lip/drop priorities are not part of this first firing checkpoint.
if (on_ladder && y < ladder_instance.bbox_top) return false;
if (instance_number(obj_mm5_buster_shot) >= 3) return false;

var buster_dir, buster_input, buster_x, buster_shot;
buster_dir = sign(image_xscale);
if (buster_dir == 0) buster_dir = 1;
if (on_ladder)
{
    buster_input = keyboard_check(vk_right) - keyboard_check(vk_left);
    if (buster_input != 0) buster_dir = buster_input;
    image_xscale = buster_dir;
}
buster_x = floor(x) + 16;
if (buster_dir < 0) buster_x = floor(x) - 15;
buster_shot = instance_create(buster_x, floor(y) - 1, obj_mm5_buster_shot);
buster_shot.shot_direction = buster_dir;
buster_shot.image_xscale = buster_dir;

if (buster_pose_timer == 0)
{
    anim_walk_frame = 0;
    anim_walk_timer = 0;
}
buster_pose_timer = 16;
audio_play_sound(snd_mm5_buster_shot, 1, false);
return true;
