// Call once per room entry, after visual tile placement.
// Static terrain only. NEVER place permanent solids behind Super Arm blocks.
var region;

// Floor: x0..255, y192..239.
region = instance_create(0, 192, obj_stage_solid);
region.image_xscale = 16;
region.image_yscale = 3;

// Roof segments. Ladder openings and the x192..223 gap stay separate.
region = instance_create(0, 96, obj_stage_solid);
region.image_xscale = 5;
region.image_yscale = 1;

region = instance_create(96, 96, obj_stage_solid);
region.image_xscale = 4;
region.image_yscale = 1;

region = instance_create(176, 96, obj_stage_solid);
region.image_xscale = 1;
region.image_yscale = 1;

region = instance_create(224, 96, obj_stage_solid);
region.image_xscale = 2;
region.image_yscale = 1;

// Climb regions: left reaches floor; right reaches block top.
region = instance_create(80, 96, obj_stage_ladder);
region.image_xscale = 1;
region.image_yscale = 6;

region = instance_create(160, 96, obj_stage_ladder);
region.image_xscale = 1;
region.image_yscale = 2;

// Ladder tops: one-pixel logical surfaces, not ordinary full solids.
// Future player code must support standing, climbing through, and descending.
region = instance_create(80, 96, obj_stage_ladder_top);
region.image_xscale = 1;
region.image_yscale = 1 / 16;

region = instance_create(160, 96, obj_stage_ladder_top);
region.image_xscale = 1;
region.image_yscale = 1 / 16;
