// Manager context, after shot/contact processing. Draw must never decrement blink.
var actor, active_tick;
actor = instance_find(obj_mm1_cutman_boss, 0);
if (!instance_exists(actor) || !actor.cm_initialized || !actor.cm_active
    || actor.cm_defeat_pending || !actor.boss_intro_complete) exit;
active_tick = combat_tick;
if (actor.cm_last_tick != active_tick || actor.cm_post_tick == active_tick) exit;
actor.cm_post_tick = active_tick;
with (actor)
{
    cm_render_pose = cm_pose + floor(cm_fire / 16);
    scr_mm1_cutman_boss_animate(scr_mm1_cutman_animation_header(cm_render_pose));
    cm_draw_sprite = scr_mm1_cutman_animation_sprite(cm_render_pose,
        cm_animation_frame, cm_face_right, cm_draw_hurt);
    cc_draw_sprite = scr_mm1_cutman_animation_sprite(69, cc_draw_frame, cc_face_right, false);
}
