// Verified native frame mapping; explicitly exported facings avoid mirror offsets.
// arguments: effective native pose, pre-advance frame index, right-facing, hurt.
var native_pose, frame_number, face_right;
native_pose = argument0;
frame_number = argument1;
face_right = argument2;
if (argument3)
{
    if (face_right) return 33;
    return 32;
}
switch (native_pose)
{
    case 63:
        switch (frame_number)
        {
            case 0:
                if (face_right) return 1;
                return 0;
            case 1:
                if (face_right) return 3;
                return 2;
            case 2:
                if (face_right) return 5;
                return 4;
            case 3:
                if (face_right) return 3;
                return 2;
        }
        break;
    case 64:
        switch (frame_number)
        {
            case 0:
                if (face_right) return 7;
                return 6;
            case 1:
                if (face_right) return 9;
                return 8;
            case 2:
                if (face_right) return 11;
                return 10;
            case 3:
                if (face_right) return 9;
                return 8;
        }
        break;
    case 65:
        switch (frame_number)
        {
            case 0:
                if (face_right) return 13;
                return 12;
        }
        break;
    case 66:
        switch (frame_number)
        {
            case 0:
                if (face_right) return 15;
                return 14;
        }
        break;
    case 67:
        switch (frame_number)
        {
            case 0:
                if (face_right) return 17;
                return 16;
            case 1:
                if (face_right) return 19;
                return 18;
        }
        break;
    case 68:
        switch (frame_number)
        {
            case 0:
                if (face_right) return 19;
                return 18;
            case 1:
                if (face_right) return 19;
                return 18;
        }
        break;
    case 69:
        switch (frame_number)
        {
            case 0:
                if (face_right) return 20;
                return 20;
            case 1:
                if (face_right) return 22;
                return 21;
            case 2:
                if (face_right) return 23;
                return 23;
            case 3:
                if (face_right) return 22;
                return 21;
        }
        break;
    case 70:
        switch (frame_number)
        {
            case 0:
                if (face_right) return 25;
                return 24;
            case 1:
                if (face_right) return 27;
                return 26;
        }
        break;
    case 71:
        switch (frame_number)
        {
            case 0:
                if (face_right) return 29;
                return 28;
            case 1:
                if (face_right) return 31;
                return 30;
        }
        break;
    case 87:
        switch (frame_number)
        {
            case 0:
                if (face_right) return 3;
                return 2;
        }
        break;
}
return 0;
