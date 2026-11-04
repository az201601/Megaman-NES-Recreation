// Supplied-USA-ROM byte audit and isolated native 6502 centring-routine test.
// NOT a natural boss kill, full victory timing, graphics, music or physics probe.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { NES } from 'jsnes';
const root = new URL('../../', import.meta.url);
const rom = fs.readFileSync(new URL('Mega Man 6 (USA).nes', root));
const sha256 = b => crypto.createHash('sha256').update(b).digest('hex');
assert.equal(rom.toString('ascii', 0, 4), 'NES\x1a');
assert.equal(rom[6] & 4, 0, 'No trainer offset assumed');
const read = (bank, address, count) => rom.subarray(16 + bank * 8192 + (address & 8191), 16 + bank * 8192 + (address & 8191) + count);
const spans = [];
function verify(name, bank, address, hex) {
  const expected = Buffer.from(hex.replaceAll(' ', ''), 'hex');
  assert.deepEqual(read(bank, address, expected.length), expected, name);
  spans.push({ name, bank: bank.toString(16), address: address.toString(16), bytes: expected.toString('hex') });
}
verify('Boss HP subtract and surviving-hit branch (native signed HP convention)', 0x3f, 0xef99,
  'a9 35 85 dc bd e5 03 38 e5 00 9d e5 03 10 11');
verify('Normal boss defeat pre-clear wait 240; later stages 60', 0x3f, 0xf964,
  'a9 f0 a4 51 c0 08 90 02 a9 3c 9d b1 05');
verify('Stage-clear request 13 and subsequent 240-update wait initialization', 0x3f, 0xf97e,
  'a9 13 85 dc 20 2b c6 a9 f0 9d b1 05');
verify('Clear forced input during post-music wait', 0x3f, 0xf98a,
  'a9 00 85 40 20 30 d4 20 68 e4 de b1 05 d0 f1');
verify('Center branch and forced right walk', 0x3f, 0xf9ce,
  'ad 86 04 c9 80 b0 11 a9 01 20 2a d4 20 68 e4 ad 86 04 c9 80 90 f1 b0 0f');
verify('Forced left walk, crossing test, center snap', 0x3f, 0xf9e6,
  'a9 02 20 2a d4 20 68 e4 ad 86 04 c9 80 b0 f1 a9 80 8d 86 04');
verify('Forced controls clear live input then install direction', 0x3e, 0xd42a,
  '48 a9 00 85 40 68 85 99 a5 40 29 40 05 99 85 40 a9 00 85 42 85 9a 60');
verify('Native defeat preparation requests 0C (not clear track 13)', 0x3f, 0xfa0b,
  'a9 0c 85 dc a5 51 c9 0f d0 04 a9 18 85 dc');
verify('After centring: neutral forced input until player Y >= B4', 0x3f, 0xf9a5,
  'a9 00 20 2a d4 20 68 e4 ad cb 04 c9 b4 90 f1');

// Run the original fixed-bank centring instructions. Only the frame-yield
// helper E468 is replaced by a deterministic movement fixture. D42A runs
// unmodified. No timers/speeds measured here: fixture displacement != MM6 physics.
function centerTrial(start, stride) {
  const n = new NES(); n.loadROM(rom.toString('binary'));
  const c = n.cpu, m = c.mem;
  c.irqRequested = false; c.REG_PC = 0xf9c5; c.REG_SP = 0xfd;
  m[0x1fe] = 0xff; m[0x1ff] = 0x06; // fake caller's return address 06FF -> 0700
  m[0x486] = start; m[0x40] = 0xff; m[0x42] = 0xff; m[0x9a] = 0xff;
  const directions = []; let instructions = 0;
  while (c.REG_PC !== 0x06ff) {
    assert.ok(++instructions < 20000, 'Routine must return');
    const pc = (c.REG_PC + 1) & 65535;
    if (pc === 0xe468) {
      const direction = m[0x40];
      assert.ok(direction === 1 || direction === 2, 'No live jump/fire/start bits');
      assert.equal(m[0x42], 0); assert.equal(m[0x9a], 0);
      directions.push(direction);
      m[0x486] += direction === 1 ? stride : -stride;
      const lo = c.pull(), hi = c.pull();
      c.REG_PC = lo | (hi << 8); // emulate RTS, not the helper's own engine work
    } else c.emulate();
  }
  assert.equal(m[0x486], 128);
  assert.equal(c.REG_SP, 0xff, 'Caller stack restored');
  return { start, fixtureStride: stride, updates: directions.length, firstDirection: directions[0], resultX: m[0x486] };
}
const trials = [];
for (const stride of [1, 2, 3]) for (const start of [24, 64, 127, 128, 129, 192, 232]) trials.push(centerTrial(start, stride));
// The >=128 branch at exactly128 takes at least one left step, then snaps back.
assert.ok(trials.filter(t => t.start === 128).every(t => t.updates === 1 && t.firstDirection === 2));
const report = {
  romSha256: sha256(rom),
  source: { repository: 'refreshing-lemonade/megaman6-disassembly', revision: 'f0763c46fad2bbcb45e4b8a2f759a10ee3c7c421', file: 'bank38_3F.asm' },
  method: 'Exact USA ROM instruction bytes plus isolated native 6502 center routine; E468 frame/physics helper replaced by disclosed stride fixture. No ROM modifications.',
  limitations: ['Not a natural boss kill or complete end-to-end victory trace.', 'Wait constants are instruction evidence, not rendered/audio onset measurements.', 'No extracted music identification by listening yet.', 'No airborne/slide/hurt/full MM5 runtime test.', 'Weapon-get screen path, sprites and music still require separate verification.'],
  spans, centerTrials: trials,
};
const out = new URL('./.work/mm6-victory/', import.meta.url); fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(new URL('source-audit.json', out), JSON.stringify(report, null, 2) + '\n');
console.log(`PASS: ${spans.length} USA-ROM spans; ${trials.length} isolated native centring cases. Research only; no runtime installation.`);
