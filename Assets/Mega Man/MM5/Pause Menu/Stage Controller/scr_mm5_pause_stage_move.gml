// Script. Stage controller context.0=dx,1=dy. Cursor sound only when target changes.
var previous, next_target, dx, dy, projection, cross_axis, nav_cost, best, i;
if (menu_page == 1)
{
    menu_upgrade_cursor = 1 - menu_upgrade_cursor;
    audio_stop_sound(snd_mm5_menu_cursor);
    audio_play_sound(snd_mm5_menu_cursor, 0, false);
    exit;
}
previous = menu_cursor;
next_target = previous;
best = 100000;
for (i = 0; i < 15; i += 1)
{
    dx = menu_target_x[i] - menu_target_x[previous];
    dy = menu_target_y[i] - menu_target_y[previous];
    projection = dx * argument0 + dy * argument1;
    cross_axis = abs(dx * argument1 - dy * argument0);
    if (projection > 0 && (argument0 == 0 || cross_axis <= 20))
    {
        nav_cost = projection + cross_axis * 4;
        if (nav_cost < best)
        {
            best = nav_cost;
            next_target = i;
        }
    }
}
menu_cursor = next_target;
if (menu_cursor != previous)
{
    audio_stop_sound(snd_mm5_menu_cursor);
    audio_play_sound(snd_mm5_menu_cursor, 0, false);
}
