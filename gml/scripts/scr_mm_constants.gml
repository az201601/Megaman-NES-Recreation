// SCRIPT: scr_mm_constants
// PURPOSE: every ROM-verified constant + view setup. SAFE TO CALL MANY TIMES.
// Called from obj_game (Create) and from any object's Create so that instance
// creation order in the room editor can never break the game.

var d;

// --- NES screen / timing ---------------------------------------------------
room_speed = 60;                    // NTSC is 60.0988 Hz; 60 is the GMS match
view_enabled = true;
view_visible[0] = true;
view_xport[0] = 0;  view_yport[0] = 0;
view_wport[0] = 768; view_hport[0] = 720;      // 3x integer scale
view_wview[0] = 256; view_hview[0] = 240;      // NES resolution
view_object[0] = -1;               // obj_camera moves the view itself
view_hborder[0] = 0; view_vborder[0] = 0;
view_hspeed[0] = -1; view_vspeed[0] = -1;
texture_set_interpolation(false);  // crisp pixels

// --- player physics (pixels per frame) -------------------------------------
global.MM_WALK     = 1.375;        // ROM $61  (running)
global.MM_AIR      = 1.3125;       // ROM $51  (jumping/falling)
global.MM_JUMP     = 4.87109375;   // ROM $04.DF
global.MM_GRAV     = 0.25;         // ROM $40/256
global.MM_MAXFALL  = 12;           // ROM $F4 = -12
global.MM_LADDER   = 0.75;         // ROM $C0
global.MM_KNOCKBACK= 0.5625;       // ROM $90
global.MM_SHOT_SPD = 4;            // ROM $04
global.MM_MAXSHOTS = 3;            // object slots 2,3,4
global.MM_FIREANIM = 31;           // ROM $1F  (firing pose length)
global.MM_INVULN   = 111;          // ROM $6F
global.MM_READY    = 192;          // ROM $C0

// --- meters -----------------------------------------------------------------
global.MM_HP_MAX     = 28;
global.MM_ENERGY_MAX = 28;

// --- animation states -------------------------------------------------------
global.MM_ST_STAND    = 0;
global.MM_ST_SHOOT    = 1;
global.MM_ST_RUN      = 2;
global.MM_ST_RUNSHOOT = 3;
global.MM_ST_JUMP     = 4;
global.MM_ST_JUMPSHOOT= 5;
global.MM_ST_CLIMB    = 6;
global.MM_ST_HURT     = 7;

// --- weapons ----------------------------------------------------------------
// 0 P buster, 1 C cutter, 2 I ice, 3 B bomb, 4 F fire, 5 E elec, 6 G arm, 7 M magnet
global.mm_weapon_name[0] = "P"; global.mm_weapon_name[1] = "C";
global.mm_weapon_name[2] = "I"; global.mm_weapon_name[3] = "B";
global.mm_weapon_name[4] = "F"; global.mm_weapon_name[5] = "E";
global.mm_weapon_name[6] = "G"; global.mm_weapon_name[7] = "M";
global.mm_weapon_cost[0] = 0; global.mm_weapon_cost[1] = 1;
global.mm_weapon_cost[2] = 1; global.mm_weapon_cost[3] = 2;
global.mm_weapon_cost[4] = 1; global.mm_weapon_cost[5] = 1;
global.mm_weapon_cost[6] = 2; global.mm_weapon_cost[7] = 2;

// --- boss damage table (bank7 $FE22), flat 11 rows x 8 columns --------------
// rows: Cut, Ice, Bomb, Fire, Elec, Guts, YellowDevil, Wily2, Wily3, Wily4a, Wily4b
d = 0;
global.mm_dmg[d]=3; d+=1; global.mm_dmg[d]=1; d+=1; global.mm_dmg[d]=0; d+=1; global.mm_dmg[d]=2; d+=1;
global.mm_dmg[d]=3; d+=1; global.mm_dmg[d]=1; d+=1; global.mm_dmg[d]=14; d+=1; global.mm_dmg[d]=0; d+=1; // Cut
global.mm_dmg[d]=1; d+=1; global.mm_dmg[d]=2; d+=1; global.mm_dmg[d]=0; d+=1; global.mm_dmg[d]=4; d+=1;
global.mm_dmg[d]=1; d+=1; global.mm_dmg[d]=10; d+=1; global.mm_dmg[d]=0; d+=1; global.mm_dmg[d]=0; d+=1; // Ice
global.mm_dmg[d]=2; d+=1; global.mm_dmg[d]=2; d+=1; global.mm_dmg[d]=0; d+=1; global.mm_dmg[d]=1; d+=1;
global.mm_dmg[d]=4; d+=1; global.mm_dmg[d]=2; d+=1; global.mm_dmg[d]=0; d+=1; global.mm_dmg[d]=0; d+=1; // Bomb
global.mm_dmg[d]=2; d+=1; global.mm_dmg[d]=2; d+=1; global.mm_dmg[d]=4; d+=1; global.mm_dmg[d]=1; d+=1;
global.mm_dmg[d]=1; d+=1; global.mm_dmg[d]=1; d+=1; global.mm_dmg[d]=0; d+=1; global.mm_dmg[d]=0; d+=1; // Fire
global.mm_dmg[d]=1; d+=1; global.mm_dmg[d]=10; d+=1; global.mm_dmg[d]=0; d+=1; global.mm_dmg[d]=2; d+=1;
global.mm_dmg[d]=1; d+=1; global.mm_dmg[d]=1; d+=1; global.mm_dmg[d]=4; d+=1; global.mm_dmg[d]=0; d+=1; // Elec
global.mm_dmg[d]=2; d+=1; global.mm_dmg[d]=1; d+=1; global.mm_dmg[d]=0; d+=1; global.mm_dmg[d]=10; d+=1;
global.mm_dmg[d]=2; d+=1; global.mm_dmg[d]=1; d+=1; global.mm_dmg[d]=1; d+=1; global.mm_dmg[d]=0; d+=1; // Guts
global.mm_dmg[d]=2; d+=1; global.mm_dmg[d]=2; d+=1; global.mm_dmg[d]=0; d+=1; global.mm_dmg[d]=0; d+=1;
global.mm_dmg[d]=2; d+=1; global.mm_dmg[d]=4; d+=1; global.mm_dmg[d]=0; d+=1; global.mm_dmg[d]=0; d+=1; // YD
global.mm_dmg[d]=1; d+=1; global.mm_dmg[d]=1; d+=1; global.mm_dmg[d]=0; d+=1; global.mm_dmg[d]=2; d+=1;
global.mm_dmg[d]=2; d+=1; global.mm_dmg[d]=2; d+=1; global.mm_dmg[d]=0; d+=1; global.mm_dmg[d]=0; d+=1; // Wily2
global.mm_dmg[d]=0; d+=1; global.mm_dmg[d]=0; d+=1; global.mm_dmg[d]=0; d+=1; global.mm_dmg[d]=0; d+=1;
global.mm_dmg[d]=0; d+=1; global.mm_dmg[d]=0; d+=1; global.mm_dmg[d]=0; d+=1; global.mm_dmg[d]=0; d+=1; // Wily3
global.mm_dmg[d]=1; d+=1; global.mm_dmg[d]=1; d+=1; global.mm_dmg[d]=1; d+=1; global.mm_dmg[d]=1; d+=1;
global.mm_dmg[d]=4; d+=1; global.mm_dmg[d]=1; d+=1; global.mm_dmg[d]=1; d+=1; global.mm_dmg[d]=0; d+=1; // W4a
global.mm_dmg[d]=1; d+=1; global.mm_dmg[d]=1; d+=1; global.mm_dmg[d]=0; d+=1; global.mm_dmg[d]=1; d+=1;
global.mm_dmg[d]=1; d+=1; global.mm_dmg[d]=1; d+=1; global.mm_dmg[d]=1; d+=1; global.mm_dmg[d]=0; d+=1; // W4b

// --- enemy contact damage (bank7 $FEBD), first 26 object types --------------
global.mm_contact[0]=3;  global.mm_contact[1]=1;  global.mm_contact[2]=2;  global.mm_contact[3]=3;
global.mm_contact[4]=4;  global.mm_contact[5]=1;  global.mm_contact[6]=4;  global.mm_contact[7]=4;
global.mm_contact[8]=3;  global.mm_contact[9]=10; global.mm_contact[10]=1; global.mm_contact[11]=1;
global.mm_contact[12]=4; global.mm_contact[13]=1; global.mm_contact[14]=3; global.mm_contact[15]=3;
global.mm_contact[16]=4; global.mm_contact[17]=4; global.mm_contact[18]=4; global.mm_contact[19]=3;
global.mm_contact[20]=1; global.mm_contact[21]=3; global.mm_contact[22]=2; global.mm_contact[23]=1;
global.mm_contact[24]=3; global.mm_contact[25]=4;
