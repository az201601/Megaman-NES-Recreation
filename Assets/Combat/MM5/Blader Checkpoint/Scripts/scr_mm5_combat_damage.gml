// argument0=player ID,1=damage. Native facing-based knockback, not attacker X.
var p, owner;
p = argument0;
owner = instance_find(obj_mm5_combat, 0);
if (!instance_exists(p) || !instance_exists(owner)) return false;
if (owner.combat_dead || owner.combat_refilling || p.mm5_startup_active
    || p.mm5_hurt_left > 0 || p.mm5_invulnerable > 0) return false;
p.mm5_health = max(0, p.mm5_health - argument1);
p.buster_charge = 0;
p.buster_pose_timer = 0;
p.mm5_hurt_facing = sign(p.image_xscale);
if (p.mm5_hurt_facing == 0) p.mm5_hurt_facing = 1;
p.mm5_hurt_was_slide = p.sliding;
p.mm5_hurt_age = 0;
p.mm5_hurt_star_y = p.y;
p.on_ladder = false;
p.ladder_instance = noone;
p.ladder_moving = false;
p.fall_speed = 1;
p.grounded = false;
p.walk_pause = 0;
p.walk_previous_input = 0;
p.anim_walk_frame = 0;
p.anim_walk_timer = 0;
scr_mm5_combat_stop_charge();
if (p.mm5_health <= 0)
{
    scr_mm5_combat_die(p);
    return true;
}
p.mm5_hurt_left = 27;
audio_play_sound(snd_mm5_megaman_hurt, 10, false);
return true;
