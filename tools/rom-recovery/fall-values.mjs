// Controlled normal-fall velocity probe. Requires mm5-start then mm5-stage.
// Pin the player back to open air each frame to prevent landing; do not reset velocity.
import {NES} from 'jsnes';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const n = new NES();
n.loadROM(fs.readFileSync(new URL('../../Mega Man 5 (USA).nes', import.meta.url), 'binary'));
n.fromJSON(JSON.parse(fs.readFileSync(new URL('./.work/mm5-stage.json', import.meta.url))));
for (let b=0;b<8;b++) n.buttonUp(1,b);
n.cpu.mem[0x30]=1;
n.cpu.mem[0x3d8]=0;
n.cpu.mem[0x3f0]=0;
const rows=[];
for(let t=1;t<=40;t++) {
  n.cpu.mem[0x378]=80;
  n.cpu.mem[0x360]=0;
  n.frame();
  const m=n.cpu.mem;
  const engineVelocity=(m[0x3f0]>127?m[0x3f0]-256:m[0x3f0])+m[0x3d8]/256;
  const displacement=m[0x378]+m[0x360]/256-80;
  const downwardVelocity=-engineVelocity;
  assert.equal(displacement,Math.min((t-1)*0.25,7));
  assert.equal(downwardVelocity,Math.min(t*0.25,7));
  assert.equal(m[0x30],1);
  rows.push({update:t,displacement,downwardVelocity});
}
fs.writeFileSync(new URL('./.work/fall-values.json',import.meta.url),JSON.stringify(rows,null,2));
console.log('Normal fall: move using current velocity, then add 0.25; maximum downward speed 7. All 40 updates passed.');
