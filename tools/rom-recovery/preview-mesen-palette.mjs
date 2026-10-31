// Palette matching, NOT a Mesen emulator capture. Writes the review copy only.
// Reject unknown colours/ambiguous RGB -> index mappings instead of guessing.
import {NES} from 'jsnes';
import {execFileSync} from 'node:child_process';
import {PNG} from 'pngjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../../',import.meta.url);
const target=JSON.parse(fs.readFileSync(new URL('./palettes/mesen-0.9.9-default.json',import.meta.url)));
assert.equal(target.colors.length,64);
const n=new NES();
const mapping=new Map();
for(let i=0;i<64;i++){
 const packed=n.ppu.palTable.curTable[i];
 const from=[packed&255,(packed>>8)&255,(packed>>16)&255].join(',');
 const rgb=target.colors[i].match(/../g).map(v=>parseInt(v,16));
 if(!mapping.has(from))mapping.set(from,new Set());
 mapping.get(from).add(rgb.join(','));
}
const source=new URL('Assets/Mega Man/MM5/Standing/spr_mm5_megaman_idle.png',root);
// Pin the original pre-migration image; canonical artwork is now Mesen-coloured.
const p=PNG.sync.read(execFileSync('git',['show','daf1d40:Assets/Mega Man/MM5/Standing/spr_mm5_megaman_idle.png'],{cwd:root}));
assert.equal(p.width,32);assert.equal(p.height,32);
const original=Buffer.from(p.data);let opaque=0,changed=0;
for(let i=0;i<p.data.length;i+=4){
 if(!p.data[i+3])continue;
 assert.equal(p.data[i+3],255,'Unexpected partial transparency');
 const key=Array.from(p.data.subarray(i,i+3)).join(',');
 const matches=mapping.get(key);
 assert.ok(matches,'Unknown source RGB '+key);
 assert.equal(matches.size,1,'Ambiguous source RGB '+key);
 const rgb=[...matches][0].split(',').map(Number);
 if(key!==rgb.join(','))changed++;
 p.data.set(rgb,i);opaque++;
}
for(let i=3;i<p.data.length;i+=4)assert.equal(p.data[i],original[i]);
assert.ok(opaque>150);assert.ok(changed>0);
const dir=new URL('Assets/Palette Review/Mesen 0.9.9/',root);
fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(new URL('spr_mm5_megaman_idle.png',dir),PNG.sync.write(p));
console.log(`Standing preview: ${opaque} opaque pixels, ${changed} recoloured. Dimensions/alpha unchanged; every source RGB mapped unambiguously.`);
