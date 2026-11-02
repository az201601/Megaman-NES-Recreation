# Full teleport-out sound addition — existing installed package only

Do not reinstall the whole package. Stop runner/back up current project first.

1. Sounds > MM1 > Bosses > Cut Man > Victory: create
   snd_mm6_megaman_teleport_out and load Sounds/snd_mm6_megaman_teleport_out.wav.
   Default group,uncompressed/nonstreamed,nonpositional,volume1,no looping.
   This is the exact approved full-tail take (2xSFX gain already in file).
2. Replace ENTIRE existing Scripts with matching files in Scripts/:
   scr_mm1_cutman_victory_audio_step,
   scr_mm1_cutman_victory_audio_dispose,
   scr_mm1_cutman_victory_init.
   Do not append these Script bodies or create duplicate resources.
3. In existing obj_mm1_cutman_boss Create APPEND the one initialization line from
   Objects/obj_mm1_cutman_boss_create_teleport_append.gml once at the bottom.
   Do not replace boss Create or append another init call.
4. Save,fresh run,F8 then one shot. Keep the previously added death-sound line
   in scr_mm1_cutman_victory_handoff unchanged. No other events/timing changes.

Expected:3A starts once at departure (animation283),full natural tail completes
before weapon-screen music. No former native323/40-update cutoff. Pause/resume
and terminal/Room End/Destroy dispose this dedicated voice via existing owner.
No effect on weapon music's original volume or other accepted sounds.

Source audio/coordinator tests pass. Installed retest remains pending.
Remove temporary F8 test block once all victory testing is accepted.
