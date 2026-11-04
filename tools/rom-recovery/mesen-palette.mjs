// Colour-only adapter: JSNES default/no-emphasis packed BBGGRR -> Mesen 0.9.9.
// This does not turn JSNES into Mesen or alter emulation timing.
import {NES} from 'jsnes';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const target=JSON.parse(fs.readFileSync(new URL('./palettes/mesen-0.9.9-default.json',import.meta.url)));
const n=new NES();
const map=new Map();
export const mesenRgbColors=new Set(target.colors.map(v=>parseInt(v,16)));
for(let i=0;i<64;i++){
 const from=n.ppu.palTable.curTable[i];
 const rgb=parseInt(target.colors[i],16);
 const to=((rgb&255)<<16)|(rgb&0xff00)|((rgb>>16)&255);
 if(map.has(from))assert.equal(map.get(from),to,'Ambiguous source palette RGB');
 map.set(from,to);
}
export function mesenRgbFromJsnes(packed){
 assert.ok(map.has(packed),'Unknown/non-default JSNES RGB; use original NES indices rather than guessing');
 return map.get(packed);
}
