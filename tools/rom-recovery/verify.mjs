import assert from 'node:assert/strict';
import fs from 'node:fs';
const read = name => JSON.parse(fs.readFileSync(new URL('./.work/' + name + '.json', import.meta.url)));
const recoil = read('recoil');
assert.equal(recoil.mm1.NONE[0].x - recoil.mm1.NONE[1].x, 0.5625);
for (const key of ['LEFT', 'RIGHT', 'A']) {
  assert.deepEqual(recoil.mm1[key].slice(0, 29).map(r => [r.x,r.y]), recoil.mm1.NONE.slice(0, 29).map(r => [r.x,r.y]));
}
assert.notEqual(recoil.mm1.RIGHT[29].x, recoil.mm1.NONE[29].x);
assert.equal(recoil.mm5.NONE[0].x - recoil.mm5.NONE[1].x, 0.5);
assert.equal(recoil.mm5.RIGHT[0].x - recoil.mm5.RIGHT[1].x, 0.25);
assert.equal(recoil.mm5.RIGHT.find(r => r.state === 0).timer, 59);
const facing = read('mm5-facing');
assert.equal(facing[0].rows[2].hp, 22);
assert.equal(facing[1].rows[2].hp, 22);
assert.equal(facing[0].rows[3].x - facing[0].rows[2].x, -0.5);
assert.equal(facing[1].rows[3].x - facing[1].rows[2].x, 0.5);
const spikes = read('mm5-spikes');
assert.equal(spikes.none[0].hp, 0);
assert.equal(spikes.timer60[0].hp, 10);
assert.equal(spikes.timer60.find(r => r.hp === 0).t, 61);
for (const r of read('mm1-spike-controlled')) assert.equal(r.death, true);
for (const r of read('contact-gates')) {
  if (r.protection === 'none') assert.ok(r.finalHP < r.initialHP);
  else assert.equal(r.finalHP, r.initialHP);
}
const walk = read('mm1-walk');
const hits = walk.filter((r,i) => i && r.ram[0x6a] < walk[i-1].ram[0x6a]);
assert.deepEqual(hits.map(r => r.t), [110, 222, 334]);
assert.equal(hits[0].ram[0x55], 111);
console.log('All measured contact, recoil, facing, timer and spike assertions passed.');
