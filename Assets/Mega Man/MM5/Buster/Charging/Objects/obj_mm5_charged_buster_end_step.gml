// Paste into BOTH charged objects' End Step events, NOT ordinary Step.
// Creation-update counts as age1, matching measured post-update ROM phases.
shot_anim_age += 1;
image_index = floor(shot_anim_age / shot_anim_period) mod shot_anim_frames;
// Parent owns the one movement/cleanup pass. Do not also move here.
event_inherited();
