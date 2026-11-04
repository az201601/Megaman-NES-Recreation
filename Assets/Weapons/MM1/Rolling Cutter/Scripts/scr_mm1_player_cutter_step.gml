// Sole owner:combat coordinator after enemies/Buster,before body contacts.
// argument0 player,argument1 active combat tick. No independent Step/End Step.
var player;
player = argument0;
if (!instance_exists(player)) { instance_destroy(); exit; }
if (pc_tick == argument1) exit;
pc_tick = argument1;
if (pc_owner != player || global.mm5_equipped_weapon != 1
    || pc_band != view_yview[0] || pc_room != room)
{ instance_destroy(); exit; }
pc_target_x = floor(player.x); pc_target_y = floor(player.y);
scr_mm1_player_cutter_manage();
if (!pc_active) { instance_destroy(); exit; }
scr_mm1_player_cutter_motion();
x = pc_x; y = pc_y;
// Current world adapter deliberately clips to active camera band,not terrain.
// Do not collide with solids,doors,ladders,scenery or the Super Arm block.
if (x < view_xview[0] || x >= view_xview[0] + 256
    || y < view_yview[0] || y >= view_yview[0] + 240)
{ instance_destroy(); exit; }
pc_draw_frame = floor(pc_anim / 5) mod 4;
pc_anim += 1;
scr_mm1_player_cutter_contacts(argument1);
