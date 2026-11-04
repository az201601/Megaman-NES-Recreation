// Shared query. Safe in rooms without this camera; no globals/variable introspection.
var route;
route = instance_find(obj_mm1_cutman_camera, 0);
if (!instance_exists(route)) return false;
return route.route_busy;
