// Identical code in Destroy AND Room End. Idempotent across either order.
if (pc_contacts >= 0)
{
    ds_map_destroy(pc_contacts);
    pc_contacts = -1;
}
pc_active = false;
