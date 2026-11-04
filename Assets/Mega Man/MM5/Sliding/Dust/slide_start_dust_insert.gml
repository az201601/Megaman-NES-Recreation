// Inside successful NEW slide entry, after clearance succeeds, BEFORE X moves.
// Original ROM uses one effect slot: don't reset/duplicate an existing puff.
if (!instance_exists(obj_mm5_slide_dust))
{
    instance_create(x - 12, y + 7, obj_mm5_slide_dust);
}
