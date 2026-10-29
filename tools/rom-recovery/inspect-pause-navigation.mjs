// Independent natural initial-inventory menu input samples; no unlock/inventory patches.
import{NES,Controller}from'jsnes';import{PNG}from'pngjs';import fs from'node:fs';import{mesenRgbFromJsnes}from'./mesen-palette.mjs';
const root=new URL('../../',import.meta.url),work=new URL('./.work/',import.meta.url);
for(const game of[4,5,6])for(const key of['RIGHT','DOWN','START']){
 let frame;const n=new NES({onFrame:p=>frame=p.slice()});n.loadROM(fs.readFileSync(new URL(`Mega Man ${game} (USA).nes`,root),'binary'));
 n.fromJSON(structuredClone(JSON.parse(fs.readFileSync(new URL(`mm${game}-pause-reference.json`,work)))));
 for(let b=0;b<8;b++)n.buttonUp(1,b);for(let t=0;t<2;t++)n.frame();
 n.buttonDown(1,Controller['BUTTON_'+key]);n.frame();n.buttonUp(1,Controller['BUTTON_'+key]);for(let t=0;t<90;t++)n.frame();
 const p=new PNG({width:256,height:240});for(let i=0;i<frame.length;i++){const v=mesenRgbFromJsnes(frame[i]);p.data.set([v&255,v>>8&255,v>>16&255,255],i*4);}
 fs.writeFileSync(new URL(`mm${game}-menu-${key.toLowerCase()}.png`,work),PNG.sync.write(p));
}
