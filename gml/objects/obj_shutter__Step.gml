// OBJECT: obj_shutter  |  EVENT: Step -> Step
if (global.mm_boss_active) {
    if (shut < 1) shut = min(1, shut + 0.04);
} else {
    if (shut > 0) shut = max(0, shut - 0.02);
}
