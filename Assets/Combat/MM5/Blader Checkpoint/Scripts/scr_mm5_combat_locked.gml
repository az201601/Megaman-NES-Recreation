var owner;
owner = instance_find(obj_mm5_combat, 0);
if (!instance_exists(owner)) return false;
return owner.combat_refilling || owner.combat_dead;
