# GMS1.4 unexpected-symbol correction

Installed user error list points to bare return; statements in supplied Scripts.
This was a supplied-code compatibility mistake, not project corruption.
Replace each exact no-value `return;` with `exit;` in these existing Scripts:

- `scr_mm1_cutman_defeat_draw`
- `scr_mm1_cutman_defeat_start`
- `scr_mm1_cutman_defeat_step`
- `scr_mm1_cutman_victory_anim_draw`
- `scr_mm1_cutman_victory_anim_step`
- `scr_mm1_cutman_victory_audio_step`
- `scr_mm1_cutman_weapon_demo_step`
- `scr_mm1_cutman_weapon_screen_enter`
- `scr_mm1_cutman_weapon_screen_step`
- `scr_mm1_cutman_weapon_screen_present`

Keep value-returning statements (`return true;`, `return false;`, `return 0;`,
`return expression;`) unchanged. This terminates only the current Script and
preserves the intended guards. No resource reinstall or deletion is necessary.

Apply this edit to the currently installed Scripts, whether or not the optional
teleport sound patch has been applied. Do not replace the installed audio Script
with a newer whole file unless all its teleport resource/field dependencies are
also installed. The source and both current package ZIPs are corrected.

Regression adapters now explicitly translate GML exit to JS function return;
package validation rejects bare return; in shipped GML. This closes the test
coverage gap that previously accepted JavaScript syntax not valid in GMS1.4.
Source guard/animation/audio tests pass; user GMS compile retest pending.
