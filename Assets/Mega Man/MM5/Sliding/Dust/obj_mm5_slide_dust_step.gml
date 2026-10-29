// Objects > Effects > MM5 > Sliding > obj_mm5_slide_dust > Step > Step.
dust_age += 1;
if (dust_age >= 27)
{
    instance_destroy();
    exit;
}
image_index = floor(dust_age / 9);
