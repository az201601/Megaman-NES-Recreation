// Player context. Existing MM5 normal/ladder fire call sites remain authoritative.
// No charging/auto-repeat/fallback Buster or zero-energy ghost projectile.
var direction, input_direction, projectile;
if (global.mm5_equipped_weapon != 1 || !global.mm5_pause_owned[1]) return false;
if (sliding || buster_slide_at_start) return false;
if (!keyboard_check_pressed(buster_fire_key)) return false;
if (global.mm5_pause_energy[1] < 1) return false;
if (instance_number(obj_mm1_player_cutter) > 0) return false;
direction = sign(image_xscale);
if (direction == 0) direction = 1;
if (on_ladder)
{
    input_direction = keyboard_check(vk_right) - keyboard_check(vk_left);
    if (input_direction != 0) direction = input_direction;
    image_xscale = direction;
}
projectile = instance_create(floor(x) + direction * 12, floor(y) - 4,
    obj_mm1_player_cutter);
if (!instance_exists(projectile)) return false;
projectile.pc_owner = id;
projectile.pc_target_x = floor(x);
projectile.pc_target_y = floor(y);
projectile.pc_right = direction > 0;
with (projectile) scr_mm1_player_cutter_begin();
// Native denominator1/numerator1; only successful allocations pay/play.
global.mm5_pause_energy[1] -= 1;
buster_charge = 0;
buster_pose_timer = 16;
audio_play_sound(snd_mm1_cutman_rolling_cutter_throw, 10, false);
return true;
