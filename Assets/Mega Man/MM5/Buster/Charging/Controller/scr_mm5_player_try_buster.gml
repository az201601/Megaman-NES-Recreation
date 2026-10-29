// REPLACE contents of existing scr_mm5_player_try_buster (not an extra call).
// Existing normal/ladder Step call sites stay exactly where installed.
if (sliding || buster_slide_at_start) return false;
if (on_ladder && y < ladder_instance.bbox_top) return false;

var charge_level, charge_object, charge_sound;
var charge_dir, charge_input, charge_x, charge_shot;
charge_level = -1;
if (keyboard_check_pressed(buster_fire_key))
{
    // Neither fresh basics nor lower-level releases may overlap another charged shot.
    if (instance_exists(obj_mm5_buster_mid) || instance_exists(obj_mm5_buster_full)) return false;
    if (instance_number(obj_mm5_buster_shot) >= 3) return false;
    charge_level = 0;
    // A retained pending charge is selected by the original emission routine too.
    if (buster_charge >= 40) charge_level = 1;
    if (buster_charge >= 80) charge_level = 2;
}
else if (keyboard_check(buster_fire_key))
{
    // First held increment is update AFTER press, even if initial press was blocked.
    if (buster_charge == 32)
    {
        with (obj_mm5_charge_audio)
        {
            scr_mm5_charge_audio_stop();
            scr_mm5_charge_audio_start();
        }
    }
    buster_charge += 1;
    if (buster_charge >= 86) buster_charge = 80;
    return false;
}
else
{
    if (buster_charge < 16) return false;
    if (buster_charge >= 80)
    {
        if (instance_number(obj_mm5_buster_shot) != 0)
        {
            // Full release rejected, not queued; measured native residual is1.
            buster_charge = 1;
            // Native rejected-full trace keeps its charge voice until a later shot.
            return false;
        }
        charge_level = 2;
    }
    else
    {
        // Keep counter pending if lower-level release cannot yet get a slot.
        if (instance_exists(obj_mm5_buster_mid) || instance_exists(obj_mm5_buster_full)) return false;
        if (instance_number(obj_mm5_buster_shot) >= 3) return false;
        charge_level = 0;
        if (buster_charge >= 40) charge_level = 1;
    }
}

charge_dir = sign(image_xscale);
if (charge_dir == 0) charge_dir = 1;
if (on_ladder)
{
    charge_input = keyboard_check(vk_right) - keyboard_check(vk_left);
    if (charge_input != 0) charge_dir = charge_input;
    image_xscale = charge_dir;
}
charge_object = obj_mm5_buster_shot;
charge_sound = snd_mm5_buster_shot;
charge_x = floor(x) + 16;
if (charge_dir < 0) charge_x = floor(x) - 15;
if (charge_level > 0)
{
    charge_x = floor(x) + charge_dir * 20;
    charge_object = obj_mm5_buster_mid;
    charge_sound = snd_mm5_buster_mid;
    if (charge_level == 2)
    {
        charge_object = obj_mm5_buster_full;
        charge_sound = snd_mm5_buster_full;
    }
}
charge_shot = instance_create(charge_x, floor(y) - 1, charge_object);
charge_shot.shot_direction = charge_dir;
charge_shot.image_xscale = charge_dir;
if (buster_pose_timer == 0)
{
    anim_walk_frame = 0;
    anim_walk_timer = 0;
}
buster_pose_timer = 16;
buster_charge = 0;
// Stop only charge voice BEFORE selected release; never stop music/landing audio.
with (obj_mm5_charge_audio) scr_mm5_charge_audio_stop();
audio_play_sound(charge_sound, 1, false);
return true;
