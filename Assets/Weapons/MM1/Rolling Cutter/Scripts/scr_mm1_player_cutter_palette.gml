// Draw-only sprite selection, never changes player sprite_index or mask.
if (global.mm5_equipped_weapon != 1) return argument0;
switch (argument0)
{
    case spr_mm5_megaman_idle_charge: return spr_mm5_cutter_player_idle;
    case spr_mm5_megaman_walk_charge: return spr_mm5_cutter_player_walk;
    case spr_mm5_megaman_air_charge: return spr_mm5_cutter_player_air;
    case spr_mm5_megaman_climb_charge: return spr_mm5_cutter_player_climb;
    case spr_mm5_megaman_ladder_top_charge: return spr_mm5_cutter_player_ladder_top;
    case spr_mm5_megaman_slide_charge: return spr_mm5_cutter_player_slide;
    case spr_mm5_megaman_idle_shoot_charge: return spr_mm5_cutter_player_idle_shoot;
    case spr_mm5_megaman_walk_shoot_charge: return spr_mm5_cutter_player_walk_shoot;
    case spr_mm5_megaman_air_shoot_charge: return spr_mm5_cutter_player_air_shoot;
    case spr_mm5_megaman_climb_shoot_charge: return spr_mm5_cutter_player_climb_shoot;
    case spr_mm5_megaman_ladder_top_shoot_charge: return spr_mm5_cutter_player_ladder_top_shoot;
    case spr_mm5_megaman_hurt: return spr_mm5_cutter_player_hurt;
    case spr_mm5_megaman_arrival: return spr_mm5_cutter_player_arrival;
}
return argument0;
