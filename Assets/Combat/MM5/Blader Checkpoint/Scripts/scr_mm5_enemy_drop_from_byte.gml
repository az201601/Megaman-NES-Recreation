// Pure native selector. argument0 must be an integer0..255 from the RNG owner.
// Returns original MM5 animation ID, or -1 for no item.
// This preserves byte modulo50 bias; it does NOT invent a replacement RNG sequence.
var roll;
roll = (argument0 & 255) mod 50;
if (roll < 2) return $76;  // Large weapon energy; effect deferred.
if (roll < 3) return $78;  // Extra life.
if (roll < 8) return $75;  // Small health.
if (roll < 10) return $74; // Large health.
if (roll < 14) return $77; // Small weapon energy; effect deferred.
return -1;
