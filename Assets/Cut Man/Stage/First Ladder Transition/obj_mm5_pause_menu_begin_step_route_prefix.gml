// ADD at VERY TOP of existing pause-menu BEGIN Step. Keep all existing code below.
// No menu opening while the original room handoff owns player control.
if (scr_mm1_cutman_route_busy()) exit;
