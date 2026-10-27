// OBJECT: obj_boss  |  EVENT: Step -> Step
var c;
if (global.mm_paused) exit;
if (flash > 0) flash -= 1;
timer += 1;

if (phase == 0) {                                   // wait, facing the player
    if (instance_exists(obj_player)) {
        if (obj_player.x < x) image_xscale = 1; else image_xscale = -1;
    }
    if (timer > 60) {
        phase = 1; timer = 0;
        vsp = -6;
        if (instance_exists(obj_player)) hsp = sign(obj_player.x - x) * 1.5;
        else hsp = -1.5;
    }
}
else if (phase == 1) {                              // jumping arc
    vsp += 0.25;
    if (vsp > 12) vsp = 12;
    x += hsp; y += vsp;
    if (x < view_xview[0]+16 || x > view_xview[0]+240) hsp = -hsp;
    if (vsp > 0 && place_meeting(x, y+1, par_solid)) {
        while (place_meeting(x, y-1, par_solid)) y -= 1;
        phase = 2; timer = 0; vsp = 0; hsp = 0;
        // throw the Rolling Cutter (add obj_boss_shot in step 10)
        c = instance_create(x, y-8, obj_boss_shot);
        if (instance_exists(obj_player)) c.hsp = sign(obj_player.x - x) * 3;
        else c.hsp = -3;
        c.vsp = -2;
    }
}
else {                                              // recover
    if (timer > 40) { phase = 0; timer = 0; }
}
