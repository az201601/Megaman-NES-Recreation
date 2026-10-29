// Native charge palette-bank selection. Drawing only, never a timer update.
if (buster_charge >= 80)
{
    if (buster_charge < 82) return 0;
    if (buster_charge < 84) return 4;
    return 5;
}
if ((buster_charge & 2) == 0) return 0;
var charge_band;
charge_band = floor(buster_charge / 16);
if (charge_band == 2) return 1;
if (charge_band == 3) return 2;
if (charge_band == 4) return 3;
return 0;
