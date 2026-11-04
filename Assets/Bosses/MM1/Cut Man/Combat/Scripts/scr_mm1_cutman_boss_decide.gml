// GMS1.4.1760 decision kernel. NOT a complete actor Step event.
// Inputs/outputs: cm_* fields documented in ../README.md.
// Motion helper owns collision/position updates; throw is an output request.
var distance_x, choice, offset_x, jump_distance, landed, effective_state;
cm_throw_requested = false;
effective_state = cm_state;
if (cm_blink >= 31) effective_state = 25;
if (cm_sleep != 0) exit;
switch (effective_state)
{
    case 5:
        distance_x = scr_mm1_cutman_boss_face();
        cm_state = 6;
        if (distance_x < 64)
        {
            cm_state = 7;
            if (cm_y != cm_target_y && !cm_target_ladder) cm_state = 24;
        }
        break;
    case 6:
        scr_mm1_cutman_boss_face();
        cm_move_right = cm_face_right;
        if (cm_pose != 63)
        {
            cm_pose = 63;
            cm_anim = 0;
            cm_fire = 0;
            cm_speed_x = 288;
            if (cm_cutter != 0) cm_fire = 17;
        }
        scr_mm1_cutman_boss_motion();
        if (cm_wall != 0) cm_state = 7;
        else
        {
            distance_x = scr_mm1_cutman_boss_face();
            cm_state = 6;
            if (distance_x < 64)
            {
                cm_state = 7;
                if (cm_y != cm_target_y && !cm_target_ladder) cm_state = 24;
            }
        }
        break;
    case 7:
        scr_mm1_cutman_boss_face();
        cm_move_right = cm_face_right;
        cm_pose = 65;
        cm_fire = 0;
        cm_anim = 0;
        if (cm_cutter != 0) cm_fire = 31;
        choice = cm_seed mod 6;
        if ((choice & 1) != 0) choice = 2;
        else if ((choice & 2) == 0) choice = 1;
        else choice = 0;
        cm_state = 8;
        if (choice == 1) cm_state = 9;
        if (choice == 2) cm_state = 12;
        cm_speed_y = 1600;
        distance_x = scr_mm1_cutman_boss_face();
        offset_x = (choice - 1) * 32;
        jump_distance = (distance_x + offset_x + 256) mod 256;
        if (jump_distance >= 128) jump_distance = 256 - jump_distance;
        cm_speed_x = floor(jump_distance * 256 / 50);
        break;
    case 8:
    case 9:
    case 12:
        scr_mm1_cutman_boss_motion();
        choice = cm_seed mod 3;
        if (effective_state == 8)
        {
            cm_state = 14;
            if ((choice & 1) == 0 && cm_cutter == 0) { cm_state = 16; cm_delay = 8; }
        }
        if (effective_state == 9)
        {
            cm_state += 1;
            if ((choice & 1) == 0 && cm_cutter == 0) { cm_state = 18; cm_delay = 18; }
        }
        if (effective_state == 12)
        {
            cm_state = 13;
            if ((choice & 1) == 0 && cm_cutter == 0) { cm_state = 22; cm_delay = 21; }
        }
        break;
    case 10:
        landed = scr_mm1_cutman_boss_motion();
        if (landed != 0)
        {
            cm_state += 1;
            distance_x = scr_mm1_cutman_boss_face();
            if (distance_x >= 14) cm_state = 5;
            else
            {
                choice = cm_seed mod 3;
                if ((choice & 1) != 0 && cm_cutter == 0) { cm_state = 20; cm_delay = 18; }
                cm_speed_y = 1248;
                cm_speed_x = 192;
            }
        }
        break;
    case 11:
        if (scr_mm1_cutman_boss_motion() != 0) cm_state = 5;
        break;
    case 13:
        if (scr_mm1_cutman_boss_motion() != 0)
        {
            if ((cm_seed & 1) != 0) cm_state = 5;
            else cm_state += 1;
        }
        break;
    case 14:
        if (scr_mm1_cutman_boss_motion() != 0)
        {
            if (cm_cutter != 0) cm_state = 5;
            else if (cm_y != cm_target_y && !cm_target_ladder) cm_state = 24;
            else { cm_pose = 67; cm_speed_x = 0; cm_fire = 0; cm_state += 1; }
        }
        break;
    case 15:
        scr_mm1_cutman_boss_motion();
        if (cm_anim == 0) cm_state = 5;
        else if (cm_anim == 16) cm_throw_requested = true;
        break;
    case 16:
    case 18:
    case 20:
    case 22:
        scr_mm1_cutman_boss_motion();
        cm_delay = (cm_delay + 255) mod 256;
        if (cm_delay == 0)
        {
            cm_pose = 67;
            cm_anim = 0;
            cm_fire = 0;
            cm_state += 1;
        }
        break;
    case 17:
    case 19:
    case 21:
    case 23:
        if (cm_anim == 0) cm_pose = 65;
        else if (cm_anim == 16) cm_throw_requested = true;
        if (scr_mm1_cutman_boss_motion() != 0)
        {
            if (cm_y != cm_target_y && !cm_target_ladder) cm_state = 24;
            else
            {
                choice = floor((cm_state & 7) / 2);
                cm_state = 5;
                if (choice == 0) cm_state = 14;
                if (choice == 1) cm_state = 10;
            }
        }
        break;
    case 24:
        if (cm_pose != 70)
        {
            cm_pose = 70;
            cm_delay = 63;
            cm_anim = 0;
            cm_speed_x = 0;
            // Deliberate adaptation: rejected native sound26 stays silent.
        }
        scr_mm1_cutman_boss_motion();
        choice = 0;
        if (cm_y == cm_target_y && !cm_target_ladder) choice = 1;
        else
        {
            if (cm_delay != 0) cm_delay -= 1;
            if (cm_delay == 0) choice = 1;
        }
        if (choice != 0 && cm_cutter == 0)
        {
            cm_state = 15;
            cm_pose = 67;
            cm_speed_x = 0;
            cm_fire = 0;
        }
        break;
    case 25:
        if (cm_pose != 87)
        {
            cm_pose = 87;
            scr_mm1_cutman_boss_face();
            cm_move_right = !cm_face_right;
            cm_speed_y = 320;
            cm_speed_x = 288;
            cm_anim = 0;
            // Cut Man uses strategy14 after recoil initialization (not5).
            cm_state = 14;
        }
        scr_mm1_cutman_boss_motion();
        break;
}
