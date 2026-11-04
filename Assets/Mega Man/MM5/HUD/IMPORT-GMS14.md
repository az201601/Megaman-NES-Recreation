# MM5 health HUD — artwork checkpoint, GMS1.4.1760

User explicitly wants HUD first; damage/invulnerability deferred until enemies. Startup works as reported, but do not infer every suggested startup-input runtime test completed. This checkpoint imports ONE Sprite, no events/objects/player changes. Existing READY/arrival and mechanics remain intact.

## Import

Create Sprites > Mega Man > MM5 > HUD resource folder.
Create Sprite named EXACTLY spr_mm5_health_meter (without _strip29).
Edit Sprite > File > Create from Strip, source spr_mm5_health_meter_strip29.png:
- Number of images29; images per row29.
- Cell width8,height56. Whole sheet232x56.
- ALL offsets/separations0.
- Manual origin X0,Y0 (do not Center4,28).
- Do not resize, crop, or remove background colour. BLACK IS REQUIRED: original HUD is opaque black with cream/white pips, including empty areas.
- Verify29 subimages8x56. Subimage0=empty,14=half,28=full. Filled meter grows BOTTOM to TOP. These are health values, NOT an animation; don't assign it to player object or auto-animate it.

Save project and confirm import before HUD drawing-code installation. No Sound resource needed for static display. No test damage keys, damage, invulnerability, enemies, health refill/pickup/weapon logic or score implemented here.

## Native observations / source

Original MM5 USA ROM via JSNES2.1.0, approved Mesen0.9.9 default palette adapter. Not a direct Mesen runtime capture or synthesized/repainted artwork. hud-health.mjs takes original normal-gravity stage snapshot, sets ONLY HP low5 bits atB0 to0..28 preserving upper flags, runs original routines3updates and reads live HUD OAM/CHR. Controlled HP presets are not natural damage/healing tests; zero does not certify death behaviour.

Health byte is flagged (full snapshot9Chex): actual health28 = value AND31, not raw156. New GMS player-health value will be separate plain0..28, no NES flag byte or built-in global health assumptions.

Original health meter consists of7 vertically stacked8x8 sprites, X24,Y25/33/41/49/57/65/73, palette4, tiles60..64hex (0..4 pips each). Per row from top, tile60hex+clamp(hp-4*(6-row),0,4). Seven full tiles give28 units. The apparent25px origin is intentional (OAM Y stored24, screen coordinate adds1); don't shift it to24 by guess.

Tests all29 levels: exact seven coordinates/palette/tile progression; stored HP retained/player state0; no clipped pixels; opaque entire8x56 black backing;4 creamF7D8A5 and2 offwhiteFFFEFF pixels per health unit,448-6*HP black pixels, all approved palette colours. Full health has112 cream/56 white/280 black pixels. Native meter samples at10 original READY/beam/materialization/idle updates573..704 all retain7 full64hex tiles: HUD should remain visible during startup, independent of hidden player Draw.

Regenerate: install pinned tools/rom-recovery dependencies; mm5-start.mjs/mm5-stage.mjs if stage snapshots missing; mm5-arrival.mjs for natural startup snapshots; hud-health.mjs for art/tests. Large snapshots/traces remain ignored in .work. This asset/source work is NOT GMS runtime HUD acceptance. GUI logical scaling/placement and plain health value binding are next checkpoint. Native camera/loading pipeline not certified cycle-exactly.
