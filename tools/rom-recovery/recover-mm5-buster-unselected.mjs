// Natural pause Right selects Coil, exposing original unselected Buster. No RAM patches.
import{NES,Controller}from'jsnes';import{PNG}from'pngjs';import fs from'node:fs';import assert from'node:assert/strict';import{mesenRgbFromJsnes}from'./mesen-palette.mjs';
const root=new URL('../../',import.meta.url);let frame;const n=new NES({onFrame:p=>frame=p.slice()});n.loadROM(fs.readFileSync(new URL('Mega Man 5 (USA).nes',root),'binary'));
n.fromJSON(structuredClone(JSON.parse(fs.readFileSync(new URL('./.work/mm5-pause-reference.json',import.meta.url)))));for(let b=0;b<8;b++)n.buttonUp(1,b);n.frame();n.buttonDown(1,Controller.BUTTON_RIGHT);n.frame();n.buttonUp(1,Controller.BUTTON_RIGHT);for(let t=0;t<30;t++)n.frame();
const p=new PNG({width:16,height:16});for(let y=0;y<16;y++)for(let x=0;x<16;x++){let v=mesenRgbFromJsnes(frame[(32+y)*256+32+x]);p.data.set([v&255,v>>8&255,v>>16&255,255],(y*16+x)*4);}
const palette=new Set(['000000','666666','adadad','fffeff']);for(let k=0;k<256;k++)assert.ok(palette.has(p.data.subarray(k*4,k*4+3).toString('hex')));
fs.writeFileSync(new URL('Assets/Mega Man/MM5/Pause Menu/Reference/mm5-buster-unselected-original.png',root),PNG.sync.write(p));
console.log('PASS: original16x16 unselected Buster from natural Coil selection; native grey palette, no recolour.');
