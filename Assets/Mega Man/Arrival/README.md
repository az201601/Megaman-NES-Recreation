# Mega Man — first arrival assets

Prepared from the supplied USA ROM with JSNES2.1.0, without resampling. Sprites are rendered from OAM/CHR tile data, palette entries and horizontal/vertical flip flags, rather than cutting holes out of the stage screenshot. These are asset preparation and observation results only, not a completed player controller.

## GMS resource organisation/import

```
Sprites
├── Mega Man
│   └── Arrival
│       └── spr_mm1_megaman_arrival
└── HUD
    ├── Stage Messages
    │   └── spr_mm1_ready
    └── Health Meter
        └── spr_mm1_health_meter_full
Sounds
└── Mega Man
    └── Arrival
        └── snd_mm1_megaman_arrival
```

### Player arrival strip

`spr_mm1_megaman_arrival_strip4.png`:128 x32 PNG, four32 x32 cells. Create sprite `spr_mm1_megaman_arrival`, Sprite Editor > File > Create from Strip. Number of images4, images per row4, width32,height32, offsets0,separations0. Origin X16,Y19 for every frame. Keep the complete cell dimensions and PNG alpha. Do not remove a corner/background colour or crop.

Subimages:

0. Narrow teleport beam (centred inside the32pixel canvas).
1. Expanded materialisation effect.
2. Short materialisation flash.
3. Standing Mega Man, including the face/eye overlay from its separate NES palette.

The origin is the reference point used for this arrival capture, NOT a final collision-mask specification. A separate stable player collision mask must be measured/assigned for movement. Do not use each changing teleport pose's automatic mask for physics. Future object code must set `image_speed = 0` and select frames explicitly.

### READY

`spr_mm1_ready.png`:40 x8, one frame, origin0,0. It is the actual five-letter sprite graphic from the stage arrival, preserving its glyph layout. No automatic colour removal. Draw at108,97. It stays steady, not blinking, during the measured READY interval.

### Full health meter

`spr_mm1_health_meter_full.png`:8 x56, one frame, origin0,0. Draw at24,25. PNG transparency and black artwork must be preserved. This is only the full-health visual, not damage logic or a complete set of variable health states. No score asset is provided or intended.

### Audio

`Assets/Audio/Mega Man/Arrival/snd_mm1_megaman_arrival.wav`: import in Sounds > Mega Man > Arrival as `snd_mm1_megaman_arrival`, Uncompressed, mono44100 Hz, volume1,pitch1,centre pan. One-shot, never looping. Do not play it yet: integrate it with the measured arrival timeline and music channel behaviour in the next implementation pass.

## Timeline

`arrival-timeline.csv` records the frame trace, referenced to the same confirmation-relative ROM frame numbering as the existing Cut Man intro observations. Stage frame1 = ROM frame414. CSV pose -1 means hidden; pose0..3 maps to the strip. Draw coordinates are taken from the prior player-reference position that generated the current OAM, not the post-update player RAM position. The timeline is a measurement aid; it is not itself executed by GMS.

- Stage frames1..192 (ROM414..605): READY visible; player hidden.
- Stage frame193 (ROM606): READY gone; HUD and beam visible.
- Beam descends16pixels perframe toward the scripted destination. The effect passes through the roof/upper block; do not resolve ordinary terrain collisions during this scripted entrance.
- Beam reference is at X128. The final standing reference is X128,Y148; it is supported by the lower-left Super Arm block at128,160, not by the floor at192.
- ROM617..619: expanded effect;620..622: short flash;623..625: beam again;626: standing pose visible. Vertical reference has small scripted adjustments during materialisation; use the trace rather than treating this as an ordinary falling player.
- Player state returns to idle in RAM at625; standing sprite is visible at626. Exact first-input acceptance still needs a controlled input-latency test.
- Original score digits appear with the HUD but are intentionally omitted from the recreation.

## Current integration boundary

Leave the working scenery, collision script, music queue and overlay unchanged while importing these assets. Next pass: stage-arrival state machine and HUD display, followed by player movement/collision. The isolated effect must not be declared NES-exact simply by adding it on top of full mixed music: original SFX/channel replacement needs to be considered. No stage controller GML is supplied by this asset-only pass, and GMS runtime visual/audio timing still needs verification.
