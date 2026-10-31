// Pure timing/state helper, in health-owner context. No audio/world side effects.
// Required: mm5_health, mm5_refill_left, mm5_refill_wait.
// Caller starts left=min(amount,28-health), wait=0; calls once immediately.
// Caller freezes game while left>0 OR wait>0, including the LAST four-update wait.
// Returns true exactly when one bar is added; caller restarts its OWN refill voice.
if (mm5_refill_wait > 0)
{
    mm5_refill_wait -= 1;
    if (mm5_refill_wait > 0) return false;
}
if (mm5_refill_left <= 0) return false;
if (mm5_health >= 28)
{
    mm5_refill_left = 0;
    return false;
}
mm5_health += 1;
mm5_refill_left -= 1;
mm5_refill_wait = 4;
return true;
