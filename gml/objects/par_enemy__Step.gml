// OBJECT: par_enemy  |  EVENT: Step -> Step
if (global.mm_paused) exit;
if (flash > 0) flash -= 1;
// MM1 forgets enemies once their screen is left.
if (x < view_xview[0]-96 || x > view_xview[0]+352
 || y > view_yview[0]+300) instance_destroy();
