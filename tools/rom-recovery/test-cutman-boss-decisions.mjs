// Differential original-USA 6502 vs actual GML decisions. Physics/throw are
// explicitly stubbed; NOT a complete native fight or GMS runtime test.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { NES } from 'jsnes';
const root = new URL('../../', import.meta.url);
const base = new URL('Assets/Bosses/MM1/Cut Man/Combat/', root);
const rom = fs.readFileSync(new URL('Mega Man (USA).nes', root));
assert.equal(crypto.createHash('sha256').update(rom).digest('hex'), '58fb9ef0c14c2947332929b9330d56c38a78040fd388274c39efd84e8d5446c7');
const n = new NES({ emulateSound: false }); n.loadROM(rom.toString('binary'));
const c = n.cpu, m = c.mem;
const compile = name => new Function('s', 'with(s){' + fs.readFileSync(new URL('Scripts/' + name + '.gml', base), 'utf8').replace(/\bmod\b/g, '%').replace(/\bexit\s*;/g, 'return;') + '}');
const decide = compile('scr_mm1_cutman_boss_decide'), face = compile('scr_mm1_cutman_boss_face');
const mappings = {
  cm_state: 0x3e, cm_delay: 0x3f, cm_cutter: 0x44, cm_seed: 0x46,
  cm_pose: 0x401, cm_anim: 0x441, cm_fire: 0x641, cm_y: 0x601,
};
const ret = () => { const lo = c.pull(), hi = c.pull(); c.REG_PC = lo | hi << 8; };
let checks = 0, rng = 0x623ac;
function random(max) { rng = (Math.imul(rng, 1664525) + 1013904223) >>> 0; return rng % max; }
const evidence = [];
for (let trial = 0; trial < 12000; trial++) {
  const state = 5 + trial % 21;
  const s = {
    cm_state: state, cm_delay: [0,1,8,18,21,63][random(6)], cm_cutter: random(3), cm_seed: random(256),
    cm_pose: [63,65,67,70,87][random(5)], cm_anim: [0,1,15,16,17,32][random(6)], cm_fire: random(32),
    cm_x: [24,64,128,192,232][random(5)], cm_y: [100,180][random(2)],
    cm_target_x: [24,63,64,127,128,129,192,232][random(8)], cm_target_y: [100,180][random(2)],
    cm_target_ladder: !!random(2), cm_face_right: !!random(2), cm_move_right: !!random(2),
    cm_speed_x: random(600), cm_speed_y: random(1800), cm_wall: random(2), cm_landed: random(2),
    cm_sleep: 0, cm_blink: [0,30,31,63][random(4)], cm_throw_requested: false,
    floor: Math.floor, abs: Math.abs,
  };
  const input = { ...s }; let nativeThrows = 0, steps = 0;
  // Reset low RAM. This intentionally does not run the AI dispatcher/cutter manager.
  m.fill(0, 0, 0x800);
  for (const [key, address] of Object.entries(mappings)) m[address] = s[key];
  m[0x480] = s.cm_target_x; m[0x481] = s.cm_x; m[0x600] = s.cm_target_y;
  m[0x400] = s.cm_target_ladder ? 9 : 0;
  m[0x421] = s.cm_face_right ? 64 : 0; m[0x43] = s.cm_move_right ? 64 : 0;
  m[0x4e1] = s.cm_speed_x & 255; m[0x4c1] = s.cm_speed_x >> 8;
  m[0x661] = s.cm_speed_y & 255; m[0x681] = s.cm_speed_y >> 8;
  const effective = s.cm_blink >= 31 ? 25 : state;
  const table = 0xdfc0 + (effective - 5) * 2;
  c.REG_PC = (n.mmap.load(table) | n.mmap.load(table+1) << 8) - 1;
  c.REG_SP = 0xfd; m[0x1fe] = 0xff; m[0x1ff] = 6; c.irqRequested = false;
  while (c.REG_PC !== 0x6ff) {
    assert.ok(++steps < 3000, 'Native decision returns');
    const pc = (c.REG_PC + 1) & 65535;
    if (pc === 0xedfb) {
      // EDF8 has already executed real EDD5 facing. No terrain/physics update.
      m[0x2a] = s.cm_wall; m[0x2b] = s.cm_landed;
      c.REG_ACC = s.cm_landed; c.F_ZERO = s.cm_landed; c.F_SIGN = 0; ret();
    } else if (pc === 0xdf8f) { nativeThrows++; ret(); }
    else if (pc === 0xc477) { ret(); } // rejected cue26 deliberately silent in GML
    else c.emulate();
  }
  s.scr_mm1_cutman_boss_face = () => face(s);
  s.scr_mm1_cutman_boss_motion = () => { face(s); return s.cm_landed; };
  decide(s);
  const expected = {};
  for (const [key, address] of Object.entries(mappings)) expected[key] = m[address];
  expected.cm_face_right = !!(m[0x421] & 64);
  expected.cm_move_right = !!(m[0x43] & 64);
  expected.cm_speed_x = m[0x4e1] | m[0x4c1] << 8;
  expected.cm_speed_y = m[0x661] | m[0x681] << 8;
  expected.cm_throw_requested = nativeThrows > 0;
  for (const [key, value] of Object.entries(expected)) assert.equal(s[key], value, JSON.stringify({ trial, key, input, expected }));
  checks++;
  if (trial < 21) evidence.push({ state, effective, result: expected });
}
const report = {
  method: '12000 single-decision comparisons against supplied MM1-USA original 6502 strategy routines and helpers EDC2/EDD5/C5A0/C5AC/EF16. EDFB physics and DF8F projectile creation are disclosed stubs. No native dispatcher/cutter/animation/render/audio simulation.',
  checks, romSha256: crypto.createHash('sha256').update(rom).digest('hex'),
  sourceSha256: crypto.createHash('sha256').update(fs.readFileSync(new URL('Scripts/scr_mm1_cutman_boss_decide.gml', base))).digest('hex'),
  adaptations: ['Rejected standalone cue26 is suppressed.', 'Throw is a request, not projectile creation.', 'Physics delegated to an unimplemented integration helper; do not import as complete fight.'],
  evidence,
};
fs.mkdirSync(new URL('Reference/', base), { recursive: true });
fs.writeFileSync(new URL('Reference/decision-differential.json', base), JSON.stringify(report, null, 2) + '\n');
console.log(`PASS ${checks} original-USA-6502 vs actual-GML single-decision cases; physics/projectile/animation integration NOT covered.`);

// Execute original animation counter helper D2F8 across all packed headers and
// counter bytes. Native input table is deliberately supplied at RAM0700; this
// verifies counter mechanics, not which animation tables/frames the actor uses.
const animate = compile('scr_mm1_cutman_boss_animate');
let animationChecks = 0;
for (let header = 0; header < 256; header++) for (let counter = 0; counter < 256; counter++) {
  m[0] = 0; m[1] = 7; m[0x700] = header; m[0x441] = counter;
  c.REG_X = 1; c.REG_PC = 0xd2f7; c.REG_SP = 0xfd;
  m[0x1fe] = 255; m[0x1ff] = 6; c.irqRequested = false;
  let steps = 0;
  while (c.REG_PC !== 0x6ff) { assert.ok(++steps < 40); c.emulate(); }
  const s = { argument0: header, cm_animation_frame: 0, cm_draw_hurt: false, cm_anim: counter, cm_blink: 0, cm_fire: 0, cm_sleep: 0, floor: Math.floor };
  animate(s);
  assert.equal(s.cm_anim, m[0x441], `header${header}/counter${counter}`);
  assert.equal(s.cm_animation_frame, counter >> 4);
  animationChecks++;
}
// Freeze and fire/blink semantics independently checked against visible source
// D1B1..D1E9; complete DrawObject is not executed by the above exhaustive helper test.
for (const sleep of [0,1]) for (let fire = 0; fire < 256; fire++) for (const blink of [0,1,2,30,31,63]) {
  const s = { argument0: 0x22, cm_animation_frame: 0, cm_draw_hurt: false, cm_anim: 0, cm_blink: blink, cm_fire: fire, cm_sleep: sleep, floor: Math.floor };
  animate(s);
  assert.equal(s.cm_blink, Math.max(0, blink-1));
  assert.equal(s.cm_draw_hurt, !!(blink & 2));
  assert.equal(s.cm_fire, sleep ? fire : fire === 0 || (fire & 15) === 1 ? 0 : (fire + 255) % 256);
  assert.equal(s.cm_anim, sleep ? 0 : 1);
}
console.log(`PASS ${animationChecks} original-6502 animation-counter comparisons; 3072 source-derived sleep/fire/blink checks. NOT GMS scheduling or final sprite selection.`);
