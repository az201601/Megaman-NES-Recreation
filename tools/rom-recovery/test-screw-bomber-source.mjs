// Static source evidence only; gameplay/art/integration are checked by the separate Screw suites, not by this test.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const root=new URL('../../',import.meta.url);
const rom=fs.readFileSync(new URL('Mega Man (USA).nes',root));
const r=JSON.parse(fs.readFileSync(new URL('Assets/Enemies/MM1/Screw Bomber/Reference/native-screw-bomber-source.json',root)));
assert.equal(createHash('sha256').update(rom).digest('hex'),r.romSha256);
let bytes=0;
for(const s of r.spans){const b=Buffer.from(s.hex,'hex');assert.deepEqual(rom.subarray(s.offset,s.offset+b.length),b);bytes+=b.length;}
assert.equal(bytes,230);assert.equal(r.verifiedBytes,bytes);
const fixed=a=>rom[16+0x1c000+a-0xc000];
for(const row of r.tables)assert.deepEqual(row,{type:row.type,normalDamage:fixed(0xfc51+row.type),contact:fixed(0xfe89+row.type),halfWidth:fixed(0xfb38+row.type),halfHeight:fixed(0xfc06+row.type)});
assert.deepEqual(r.tables.map(v=>[v.type,v.normalDamage,v.contact,v.halfWidth,v.halfHeight]),[[5,7,1,8,8],[22,7,2,8,8],[45,0,2,1,1]]);
const records=JSON.parse(fs.readFileSync(new URL('Assets/Enemies/MM1/Blader/Reference/native-blader-combat.json',root))).records.filter(v=>[5,22].includes(v.type));
assert.deepEqual(r.records,records);assert.deepEqual(records.map(v=>[v.index,v.page,v.x,v.y,v.type]),[[45,20,216,160,5],[46,21,200,96,22],[47,22,80,160,5]]);
console.log('PASS Screw Bomber static reference:230USA bytes/3records/floor-ceiling-bullet tables. Separate native/art/integration suites required; NOT GMS runtime.');
