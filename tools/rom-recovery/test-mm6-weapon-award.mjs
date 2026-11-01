// Scene-specific ROM/export checks; not GMS runtime or natural final-hit acceptance.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const root=new URL('../../',import.meta.url);
const base=new URL('Assets/Bosses/MM1/Cut Man/Victory/',root);
const report=JSON.parse(fs.readFileSync(new URL('Reference/mm6-weapon-award.json',base)));
const rom=fs.readFileSync(new URL('Mega Man 6 (USA).nes',root));
const hash=b=>createHash('sha256').update(b).digest('hex');
assert.equal(hash(rom),report.romSha256);
for(const s of report.spans){const a=parseInt(s.address,16),b=parseInt(s.bank,16),v=Buffer.from(s.hex,'hex');assert.deepEqual(rom.subarray(16+b*8192+(a&8191),16+b*8192+(a&8191)+v.length),v);}
for(const f of report.files)assert.equal(hash(fs.readFileSync(new URL(f.file,base))),f.sha256);
const approval=JSON.parse(fs.readFileSync(new URL('Reference/weapon-get-approval.json',base)));
assert.equal(approval.userConfirmation,'this is the one');
assert.equal(hash(fs.readFileSync(new URL(approval.file,base))),approval.sha256);
assert.equal(approval.sha256,report.files[0].sha256);
assert.equal(report.events.find(e=>e.kind==='audio-dispatch').command,0x16);
assert.ok(!report.events.some(e=>e.kind==='audio-dispatch'&&e.command===0x10));
assert.equal(report.frames,782);
console.log('PASS: weapon-award ROM spans, screenshot/audio hashes and archived scene dispatch; music listening approved; loop/integration pending.');
