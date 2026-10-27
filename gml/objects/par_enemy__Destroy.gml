// OBJECT: par_enemy  |  EVENT: Destroy
var p;
instance_create(x, y, obj_explosion);
global.mm_score += 100;
// ROM drop rate is ~1/4; small capsule unless the random roll is high.
if (random(4) < 1) {
    p = instance_create(x, y-8, obj_pickup);
    if (random(10) < 2) p.kind = 2 + irandom(1);   // large
    else                p.kind = irandom(1);       // small
}
