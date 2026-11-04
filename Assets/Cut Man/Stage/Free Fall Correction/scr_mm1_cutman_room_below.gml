// Return the connected lower section at this WORLD X, not arbitrary room space.
// argument0=current section, argument1=player worldX. -1 is an actual pit.
var section_id, world_x;
section_id = argument0;
world_x = argument1;
if (section_id >= 1 && section_id <= 3) return section_id - 1;
if (section_id == 4 && world_x >= 768 && world_x < 1024) return 3;
if (section_id >= 5 && section_id <= 7) return section_id - 1;
if (section_id == 8)
{
    if (world_x >= 1280 && world_x < 1536) return 7;
    if (world_x >= 1792 && world_x < 2048) return 9;
}
if (section_id == 9) return 10;
if (section_id == 10) return 11;
return -1;
