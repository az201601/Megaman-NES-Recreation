// Natural original MM1 opening replay; references only, no ROM/RAM patches.
// Uses mm1-hurtwalk stage snapshot and same explicit input sequence.
import {NES,Controller} from 'jsnes';
import {PNG} from 'pngjs';
import fs from 'node:fs';
import {mesenRgbFromJsnes} from './mesen-palette.mjs';
const root=new URL('../../',import.meta.url),work=new URL('./.work/',import.meta.url);
const out=new URL('./.work/cutman-opening/',import.meta.url);fs.mkdirSync(out,{recursive:true});
let pixels;const n=new NES({onFrame:p=>pixels=p.slice(),emulateSound:false});
n.loadROM(fs.readFileSync(new URL('Mega Man (USA).nes',root),'binary'));
n.fromJSON(JSON.parse(fs.readFileSync(new URL('mm1-stage.json',work))));
for(let b=0;b<8;b++)n.buttonUp(1,b);
const captures=new Set([1,40,70,100,109,110,140,180,222]),rows=[];
n.buttonDown(1,Controller.BUTTON_RIGHT);
for(let t=1;t<=222;t++){
 if(t%70===1)n.buttonDown(1,Controller.BUTTON_A);
 if(t%70===25)n.buttonUp(1,Controller.BUTTON_A);
 const hp=n.cpu.mem[0x6a];n.frame();
 if(captures.has(t)){
  // Omit top32 original HUD/score rows, not an in-game background asset.
  const png=new PNG({width:256,height:208});
  for(let y=32;y<240;y++)for(let x=0;x<256;x++){
   const rgb=mesenRgbFromJsnes(pixels[y*256+x]);png.data.set([rgb&255,(rgb>>8)&255,(rgb>>16)&255,255],((y-32)*256+x)*4);
  }
  fs.writeFileSync(new URL(`opening-${String(t).padStart(3,'0')}.png`,out),PNG.sync.write(png));
 }
 if(captures.has(t)||n.cpu.mem[0x6a]!==hp)rows.push({update:t,healthBefore:hp,healthAfter:n.cpu.mem[0x6a]});
}
fs.writeFileSync(new URL('observations.json',out),JSON.stringify({source:'Supplied MM1 USA; natural Right + A pressed1/released25 every70 updates; starts from mm1-hurtwalk stage snapshot. JSNES2.1.0 + pinned Mesen0.9.9 RGB, NOT Mesen execution. No RAM/ROM patches.',images:'256x208 crops: original frame rows32..239; original top HUD/score excluded. Reference only, not scenery/import art.',rows},null,2));
console.log(JSON.stringify(rows));
