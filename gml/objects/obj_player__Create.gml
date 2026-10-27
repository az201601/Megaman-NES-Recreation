// OBJECT: obj_player  |  EVENT: Create
scr_mm_constants();                 // safe: constants only, no state reset

facing      = 1;                    // 1 = right, -1 = left
xfrac       = 0;                    // sub-pixel accumulators (1/256ths in ROM)
yfrac       = 0;
hsp         = 0;
vsp         = 0;
on_ground   = false;
state       = global.MM_ST_STAND;
hurt_timer  = 0;
hurt_dir    = 1;
shot_cd     = 0;
fire_anim   = 0;
climbing    = false;
depth       = -10;

sprite_index = spr_mm_stand_R;
image_speed  = 0;
image_index  = 0;
