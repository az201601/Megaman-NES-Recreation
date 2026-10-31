// Player context, exactly one hurt update. Geometry uses accepted region helpers.
var dx, remaining, amount, candidate, hit, i, px, resolved, blocked, width;
image_xscale = mm5_hurt_facing;
dx = scr_mm5_recoil_dx(mm5_hurt_facing,
    keyboard_check(vk_right) - keyboard_check(vk_left));
if (mm5_hurt_was_slide)
{
    if (collision_rectangle(floor(x + dx) - 14, floor(y - 3),
        floor(x + dx) + 14, floor(y + feet_offset) - 1,
        obj_stage_solid, false, true) == noone) x += dx;
}
else
{
    if (!scr_mm5_player_wall_blocked(x + dx, y, sign(dx))) x += dx;
    else x = scr_mm5_player_wall_limit(x + dx, y, sign(dx));
}
width = 8;
if (mm5_hurt_was_slide) width = 14;
x = max(width, x);
// MM5 damage resets velocity down1, then hurt gravity applies BEFORE movement.
fall_speed = min(fall_speed + fall_gravity, fall_speed_max);
remaining = fall_speed;
width = 7;
if (mm5_hurt_was_slide) width = 14;
grounded = false;
while (remaining > 0)
{
    amount = min(1, remaining);
    candidate = y + amount;
    resolved = candidate;
    blocked = false;
    for (i = -1; i <= 1; i += 1)
    {
        px = floor(x) + i * width;
        hit = collision_point(px, floor(candidate + feet_offset), obj_stage_solid, false, true);
        if (hit == noone)
        {
            hit = collision_point(px, floor(candidate + feet_offset), obj_stage_ladder_top, false, true);
            if (hit != noone && y + feet_offset > hit.bbox_top) hit = noone;
        }
        if (hit != noone)
        {
            blocked = true;
            resolved = min(resolved, hit.bbox_top - feet_offset);
        }
    }
    y = resolved;
    if (blocked) { fall_speed = 0; grounded = true; break; }
    remaining -= amount;
}
mm5_hurt_age += 1;
mm5_hurt_left -= 1;
if (mm5_hurt_left == 0)
{
    mm5_invulnerable = 60;
    sliding = mm5_hurt_was_slide;
    if (sliding) slide_timer = max(1, slide_timer);
    sprite_index = spr_mm5_megaman_idle;
    image_index = 0;
    if (!grounded) sprite_index = spr_mm5_megaman_air;
    if (sliding) sprite_index = spr_mm5_megaman_slide;
}
