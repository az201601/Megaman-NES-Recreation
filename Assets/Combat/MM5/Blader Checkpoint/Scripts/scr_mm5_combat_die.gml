// argument0=player. Native300-update death delay/vectors, adapted stage retry flow.
var p, owner, stage;
p = argument0;
owner = instance_find(obj_mm5_combat, 0);
if (!instance_exists(owner) || owner.combat_dead) exit;
owner.combat_dead = true;
owner.combat_death_age = 0;
owner.combat_death_x = p.x;
owner.combat_death_y = p.y;
p.mm5_health = 0;
p.mm5_hurt_left = 0;
p.sliding = false;
with (obj_mm5_buster_shot) instance_destroy();
scr_mm5_combat_stop_charge();
// Stop only the known stage voice. Its existing Room End still owns queue/buffers.
stage = instance_find(obj_mm1_cutman_stage, 0);
if (instance_exists(stage))
{
    stage.stage_audio_closing = true;
    stage.alarm[0] = -1;
    if (stage.stage_music_voice != -1) audio_stop_sound(stage.stage_music_voice);
}
audio_play_sound(snd_mm5_megaman_death, 15, false);
