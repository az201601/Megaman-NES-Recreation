// OBJECT: obj_camera  |  EVENT: Step -> Step
// Screen-snap camera. For a scripted pan between screens, see step 9.
if (instance_exists(obj_player)) scr_mm_camera_snap(obj_player.x, obj_player.y);
