// Original MM5 pause menu observation; natural Start input, no inventory/player patches.
import {NES,Controller} from 'jsnes';import {PNG} from 'pngjs';import fs from 'node:fs';import assert from 'node:assert/strict';
import {mesenRgbFromJsnes} from './mesen-palette.mjs';
const root=new URL('../../',import.meta.url),work=new URL('./.work/',import.meta.url);
let frame;const n=new NES({onFrame:p=>frame=p.slice()});n.loadROM(fs.readFileSync(new URL('Mega Man 5 (USA).nes',root),'binary'));
n.fromJSON(JSON.parse(fs.readFileSync(new URL('mm5-stage.json',work))));
for(let b=0;b<8;b++)n.buttonUp(1,b);for(let t=0;t<30;t++)n.frame();
let t=0;const sounds=[],rows=[];const emulate=n.cpu.emulate.bind(n.cpu);n.cpu.emulate=()=>{if(n.cpu.REG_PC===0xec5c)sounds.push({t,command:n.cpu.REG_ACC});return emulate();};
for(t=1;t<=100;t++){
 if(t===1)n.buttonDown(1,Controller.BUTTON_START);if(t===2)n.buttonUp(1,Controller.BUTTON_START);
 n.frame();const m=n.cpu.mem;rows.push({t,state:m[0x30],x:m[0x330],y:m[0x378]});
 if([1,15,30,60,100].includes(t)){
  const png=new PNG({width:256,height:240});for(let i=0;i<frame.length;i++){const v=mesenRgbFromJsnes(frame[i]);png.data.set([v&255,v>>8&255,v>>16&255,255],i*4);}
  fs.writeFileSync(new URL('mm5-pause-'+t+'.png',work),PNG.sync.write(png));
 }
}
fs.writeFileSync(new URL('mm5-pause-observations.json',work),JSON.stringify({sounds,rows},null,2));
assert.ok(frame);console.log(sounds);
