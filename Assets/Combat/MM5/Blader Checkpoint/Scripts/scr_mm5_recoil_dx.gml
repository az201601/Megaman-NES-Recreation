// Pure native horizontal recoil. argument0=stored facing(+1 right/-1 left).
// argument1=held horizontal input(-1 left,0 neutral,+1 right).
// Damage uses stored facing, NOT attacker X. Terrain sweep belongs to caller.
var facing, amount;
facing = argument0;
if (facing == 0) facing = 1;
amount = 0.5;
if (argument1 == facing) amount = 0.25;
return -facing * amount;
