// OBJECT: obj_met  |  EVENT: Step -> Step
// Simplified Met: hides under its helmet for 90 frames, pops up for 40,
// shuffles toward the player. Step 7 adds its 3-way shot.
var d;
event_inherited();
if (global.mm_paused) exit;
timer += 1;
if (timer < 90) pose = 0;
else if (timer < 130) {
    pose = 1;
    if (instance_exists(obj_player)) {
        d = sign(obj_player.x - x);
        if (d != 0) facing = d;
        if (!place_meeting(x + d*0.5, y, par_solid)) x += d*0.5;
    }
} else timer = 0;

if (facing > 0) sprite_index = spr_met_R; else sprite_index = spr_met_L;
image_index = pose;
