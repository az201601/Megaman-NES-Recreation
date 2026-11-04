// Controller context. Frame0 before input;1 entry; full-bright35; ready38.
menu_dim = 0;
menu_show_stage = false;
if (menu_phase == 1 || menu_phase == 3)
{
    var first_in;
    first_in = 24;
    if (menu_phase == 3) first_in = 23;
    if (menu_tick < 2) menu_dim = 0;
    else if (menu_tick < 6) menu_dim = 1;
    else if (menu_tick < 10) menu_dim = 2;
    else if (menu_tick < 14) menu_dim = 3;
    else if (menu_tick < first_in) menu_dim = 4;
    else if (menu_tick < 27) menu_dim = 3;
    else if (menu_tick < 31) menu_dim = 2;
    else if (menu_tick < 35) menu_dim = 1;
    if (menu_phase == 1) menu_show_stage = (menu_tick < first_in);
    else menu_show_stage = (menu_tick >= first_in);
}
