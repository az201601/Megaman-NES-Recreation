// Strict original integer-coordinate comparison; no sprite masks.
// argument0/1 = first centre;2/3 = second;4/5 = combined thresholds.
return abs(floor(argument0) - floor(argument2)) < argument4
    && abs(floor(argument1) - floor(argument3)) < argument5;
