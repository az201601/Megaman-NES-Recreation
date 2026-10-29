// Insert immediately BEFORE the existing // VISUAL SELECTION section.
// Clear grace after landing or once the existing overhead overlap is gone.
if (slide_overhang_fall)
{
    if (grounded || fall_speed < 0 || scr_mm5_player_can_stand(x, y))
        slide_overhang_fall = false;
}
