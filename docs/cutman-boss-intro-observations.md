# Cut Man: confirmation and introduction observations

Observed the supplied USA ROM using JSNES 2.1.0. These are rendered emulator frames, not a cycle-exact GMS timing specification. Count frame 1 as the first emulated frame after pressing Start on Cut Man in stage select. Measurements from 500 frames of uninterrupted playback.

## Rendered sequence

- Frame 1: stage-select display remains visible.
- Frame 2: introduction background and Cut Man appear; the screen is in its light/flash palette. There is no long selection-screen blink sequence before this.
- Cut Man rises toward the top, partially leaves the visible playfield, then descends into the central band. This is a jump, not just a downward entrance.
- Normal background field in this emulator: RGB (0,64,255). Central band: RGB (0,40,109), y=80 through143 inclusive (64 pixels).
- Light background: RGB (255,255,255). Light band: RGB (248,248,248).
- Flash palette frames: 2–9 light, 10–17 normal, 18–25 light, 26–33 normal, 34–41 light, 42–49 normal, 50–57 light, 58–65 normal, 66–72 light. Normal palette from73 onward.
- By frame65 the jumping pose's visible bounds are x84..107, y97..127.
- Stationary animation alternates at eight-frame intervals before the name reveal. In the sampled frame73, the visible bounds are x84..107, y97..128. Frame77 has the alternate pose; full subsequent changes at85,93,101, etc.
- Frame189: first letter C appears. Subsequent letters at194,199,204,209,214. Text cell origin (136,96); string CUTMAN, one letter every five frames.
- In the sample, the idle pose stops alternating at the first-letter boundary (frame189) and holds through the remainder of the introduction.
- Frame402: screen black. Frames402–413 black; frame414 shows the Cut Man stage.

## Deliberate recreation differences

- No CLEAR POINTS text, numerical score, scoring state or scoring sounds.
- The original begins its points-label reveal at224, with later characters through279. This is reference only, not implementation work.
- Preserve the original overall intro duration initially; removal of points does not automatically shorten music or cut into the next scene. Revisit pacing explicitly if desired.
- The project removed stage-select outer black margins. For the Cut Man intro use edge-to-edge background colours as the consistent default, retaining the measured band and sprite/text coordinates. Do not import captured outer black margins unintentionally.

## Audio observations and remaining work

- Stage-select music changes immediately into the confirmation/introduction sequence, not an invented silent delay or generic menu beep.
- Initial APU writes include a pulse-channel sweep and introduction music. Capture the combined transition with correct onset; do not reuse the movement beep as confirmation.
- Audio was recorded during the 500-frame measurement in scratch storage. No final intro audio asset has been delivered yet. Check the points-era audio before packaging it to avoid unintentionally keeping a points-specific sound.
- APU/sample timing and the GMS 60-step clock are not identical. Include audio assets and event instructions when implementing this sequence.

## Resource organisation (planned)

```
Sprites > Cut Man > Boss Intro
Objects > Cut Man > Boss Intro
Rooms   > Cut Man > Boss Intro
Sounds  > Cut Man > Boss Intro
```

Proposed names: `spr_mm1_cutman_boss_intro`, `obj_mm1_cutman_boss_intro`, `rm_mm1_cutman_boss_intro`. Name the final audio assets by their measured role when prepared, not before deciding whether confirmation and music must be separate.

## Next implementation steps

1. Prepare transparent intro poses and both background palette states without text baked in.
2. Extract and validate confirmation/introduction audio without points-specific effects.
3. Import assets with explicit GMS folder paths, origins, frame dimensions and sound settings.
4. Route Start on Cut Man only into the new room; do not route other bosses there.
5. Implement the observed entrance, palette flashes, idle poses and name reveal, then verify before creating Cut Man's stage.
