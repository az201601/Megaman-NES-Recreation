// OBJECT: obj_boss_shot  |  EVENT: Step -> Step
if (global.mm_paused) exit;
hsp *= 0.98;
vsp += 0.12;
x += hsp; y += vsp;
if (x < view_xview[0]-32 || x > view_xview[0]+288 || y > view_yview[0]+260)
    instance_destroy();
