// Enemy context. argument0=player world X, argument1=player world Y.
// Required fields: blader_band_y, blader_timer, blader_vx256,
// blader_vy256 (positive DOWN), blader_direction (+1 RIGHT), x,y.
// Run once AFTER the player movement pass, never while paused/refilling/scrolling.
// Terrain/shot/body collision and despawn are separate callers, NOT implicit here.
var dx, dy, speed256;
if (blader_timer == 0)
{
    dx = floor(argument0) - floor(x);
    blader_direction = -1;
    if (dx >= 0) blader_direction = 1;
    if ((abs(dx) & 255) < 40)
    {
        dy = floor(argument1 - blader_band_y) - floor(y - blader_band_y);
        speed256 = floor(abs(dy) * 256 / 24);
        blader_vy256 = speed256;
        if (dy < 0) blader_vy256 = -speed256;
        blader_timer = 51;
        blader_vx256 = 0;
    }
}
if (blader_timer != 0)
{
    if (blader_timer >= 27) blader_vx256 += 24;
    else
    {
        if (blader_timer == 26) blader_vy256 = -blader_vy256;
        blader_vx256 += 4;
    }
    blader_timer -= 1;
    if (blader_timer == 0)
    {
        blader_vy256 = 0;
        blader_vx256 = 288;
    }
}
x += blader_direction * blader_vx256 / 256;
// Original engine wraps the native eight-bit vertical coordinate at256, not240.
// Normalize negative modulo explicitly for GMS1.4.
y = blader_band_y + (((y - blader_band_y + blader_vy256 / 256) mod 256) + 256) mod 256;
