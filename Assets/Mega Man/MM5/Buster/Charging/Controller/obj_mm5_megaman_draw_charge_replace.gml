// Replace ONLY existing character drawing block; retain all debug drawing after.
// No sprite_index/mask mutation: palette variants are drawn, not assigned.
var charge_bank, charge_sprite, charge_frame, charge_draw_y;
charge_bank = scr_mm5_player_charge_colour();
charge_sprite = sprite_index;
charge_frame = image_index;
charge_draw_y = y;
if (sliding)
{
    charge_sprite = spr_mm5_megaman_slide_charge;
    charge_frame = charge_bank;
    charge_draw_y = y + 2;
}
else if (buster_pose_timer > 0)
{
    if (sprite_index == spr_mm5_megaman_idle)
    {
        charge_sprite = spr_mm5_megaman_idle_shoot_charge;
        charge_frame = charge_bank;
    }
    else if (sprite_index == spr_mm5_megaman_walk)
    {
        charge_sprite = spr_mm5_megaman_walk_shoot_charge;
        charge_frame = charge_bank * 4 + image_index;
    }
    else if (sprite_index == spr_mm5_megaman_air)
    {
        charge_sprite = spr_mm5_megaman_air_shoot_charge;
        charge_frame = charge_bank;
    }
    else if (sprite_index == spr_mm5_megaman_climb)
    {
        charge_sprite = spr_mm5_megaman_climb_shoot_charge;
        charge_frame = charge_bank;
    }
    else if (sprite_index == spr_mm5_megaman_ladder_top)
    {
        charge_sprite = spr_mm5_megaman_ladder_top_shoot_charge;
        charge_frame = charge_bank;
    }
}
else
{
    if (sprite_index == spr_mm5_megaman_idle)
    {
        charge_sprite = spr_mm5_megaman_idle_charge;
        charge_frame = charge_bank;
    }
    else if (sprite_index == spr_mm5_megaman_walk)
    {
        charge_sprite = spr_mm5_megaman_walk_charge;
        charge_frame = charge_bank * 4 + image_index;
    }
    else if (sprite_index == spr_mm5_megaman_air)
    {
        charge_sprite = spr_mm5_megaman_air_charge;
        charge_frame = charge_bank;
    }
    else if (sprite_index == spr_mm5_megaman_climb)
    {
        charge_sprite = spr_mm5_megaman_climb_charge;
        charge_frame = charge_bank * 2 + image_index;
    }
    else if (sprite_index == spr_mm5_megaman_ladder_top)
    {
        charge_sprite = spr_mm5_megaman_ladder_top_charge;
        charge_frame = charge_bank;
    }
}
draw_sprite_ext(charge_sprite, charge_frame, x, charge_draw_y,
    image_xscale, image_yscale, image_angle, image_blend, image_alpha);
