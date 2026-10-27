// OBJECT: obj_player  |  EVENT: Step -> Step
// THE 1:1 PHYSICS. Every number here is in docs/01_THE_1_TO_1_SPEC.md.
var mv, spd, n, s, i, wanted_ladder, lv, cost, wid;
if (global.mm_paused) exit;
if (global.mm_dying)  exit;
if (global.mm_ready_timer > 0) exit;      // "READY" freeze at stage start

// ---- timers ---------------------------------------------------------------
if (shot_cd > 0)   shot_cd -= 1;
if (fire_anim > 0) fire_anim -= 1;
if (hurt_timer > 0) hurt_timer -= 1;

// ---- ladder ---------------------------------------------------------------
wanted_ladder = place_meeting(x, y, obj_ladder)
             && (keyboard_check(vk_up) || keyboard_check(vk_down))
             && (hurt_timer <= 0);

if (wanted_ladder) {
    climbing = true;
    vsp = 0; yfrac = 0;
    lv = (keyboard_check(vk_down) - keyboard_check(vk_up)) * global.MM_LADDER;
    yfrac += lv;
    n = floor(abs(yfrac)) * sign(yfrac);
    yfrac -= n;
    s = sign(n);
    repeat (abs(n)) {
        if (!place_meeting(x, y + s, par_solid)) y += s; else break;
    }
    state = global.MM_ST_CLIMB;
    if (fire_anim > 0) state = global.MM_ST_CLIMB;   // climb_shoot is a later step
}
else {
    climbing = false;

    // ---- horizontal input -------------------------------------------------
    mv = keyboard_check(vk_right) - keyboard_check(vk_left);
    if (mv != 0 && hurt_timer <= 0) facing = mv;

    if (hurt_timer > 0) {
        hsp = hurt_dir * global.MM_KNOCKBACK;
        state = global.MM_ST_HURT;
    } else {
        spd = global.MM_WALK;
        if (!on_ground) spd = global.MM_AIR;   // MM1: slower in the air!
        hsp = mv * spd;
        if (on_ground) {
            if (mv == 0) state = (fire_anim > 0) ? global.MM_ST_SHOOT : global.MM_ST_STAND;
            else         state = (fire_anim > 0) ? global.MM_ST_RUNSHOOT : global.MM_ST_RUN;
        } else {
            state = (fire_anim > 0) ? global.MM_ST_JUMPSHOOT : global.MM_ST_JUMP;
        }
    }

    // ---- jump (fixed height, exactly like MM1) ----------------------------
    on_ground = place_meeting(x, y + 1, par_solid);
    if (on_ground && keyboard_check_pressed(ord('X')) && hurt_timer <= 0) {
        vsp = -global.MM_JUMP;       // 4.87109375 px/frame up
        yfrac = 0;
        on_ground = false;
    }

    // ---- gravity ----------------------------------------------------------
    vsp += global.MM_GRAV;           // 0.25 px/frame^2
    if (vsp > global.MM_MAXFALL) vsp = global.MM_MAXFALL;   // 12

    // ---- move X one whole pixel at a time, keeping the fraction -----------
    xfrac += hsp;
    n = floor(abs(xfrac)) * sign(xfrac);
    xfrac -= n;
    s = sign(n);
    repeat (abs(n)) {
        if (!place_meeting(x + s, y, par_solid)) x += s;
        else { xfrac = 0; break; }
    }

    // ---- move Y one whole pixel at a time ---------------------------------
    yfrac += vsp;
    n = floor(abs(yfrac)) * sign(yfrac);
    yfrac -= n;
    s = sign(n);
    repeat (abs(n)) {
        if (!place_meeting(x, y + s, par_solid)) y += s;
        else {
            if (s > 0) on_ground = true;
            vsp = 0; yfrac = 0;
            break;
        }
    }
}

// ---- shooting -------------------------------------------------------------
// Z = NES B, X = NES A. B is edge-triggered in the original (JoyD0).
if (keyboard_check_pressed(ord('Z')) && shot_cd <= 0 && hurt_timer <= 0) {
    wid = global.mm_weapon;
    cost = global.mm_weapon_cost[wid];
    if (wid == 0 || global.mm_energy[wid] >= cost) {
        scr_mm_spawn_shot(x + facing*16, y, facing, wid);
        if (cost > 0) {
            global.mm_energy[wid] -= cost;
            if (global.mm_energy[wid] <= 0) {
                global.mm_energy[wid] = 0;
                global.mm_weapon = 0;       // auto-return to buster when empty
            }
        }
        fire_anim = global.MM_FIREANIM;     // 31-frame firing pose
        shot_cd = 4;                        // short tap cooldown; 3-shot cap does the rest
    }
}

// ---- animation & mercy-invincibility blink --------------------------------
scr_mm_set_sprite(state, facing);
if (global.mm_invuln > 0 && (global.mm_invuln div 4) mod 2 == 0) visible = false;
else visible = true;
