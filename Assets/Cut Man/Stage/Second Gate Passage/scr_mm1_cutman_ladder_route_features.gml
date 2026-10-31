// Existing feature call once per entry; both buildings are separate objects.
instance_create(864, 1088, obj_mm1_super_cutter_dispenser);
instance_create(1376, 128, obj_mm1_super_cutter_dispenser);
instance_create(2000, 528, obj_mm1_cutman_spike);
instance_create(2016, 528, obj_mm1_cutman_spike);
instance_create(1920, 688, obj_mm1_cutman_spike);
instance_create(1936, 688, obj_mm1_cutman_spike);
instance_create(1952, 688, obj_mm1_cutman_spike);
instance_create(1968, 688, obj_mm1_cutman_spike);
instance_create(1984, 688, obj_mm1_cutman_spike);
instance_create(2000, 688, obj_mm1_cutman_spike);
instance_create(2016, 688, obj_mm1_cutman_spike);
instance_create(2032, 688, obj_mm1_cutman_spike);
instance_create(2272, 816, obj_mm1_cutman_boss_gate);

// Closed second gate is a separate scripted object; its operation is deferred.
var gate;
gate = instance_create(3056, 816, obj_mm1_cutman_boss_gate);
gate.gate_first = false;
gate.sprite_index = spr_mm1_cutman_second_gate_closed;
gate.mask_index = spr_mm1_cutman_second_gate_closed;
