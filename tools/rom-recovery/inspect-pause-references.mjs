// Natural boot/Start reference captures for supplied MM4 and MM6 USA ROMs.
import {NES,Controller} from 'jsnes';import {PNG} from 'pngjs';import fs from 'node:fs';
import {mesenRgbFromJsnes} from './mesen-palette.mjs';
const root=new URL('../../',import.meta.url),work=new URL('./.work/',import.meta.url);
for(const game of [4,6]){
 let frame;const n=new NES({onFrame:p=>frame=p.slice()});n.loadROM(fs.readFileSync(new URL(`Mega Man ${game} (USA).nes`,root),'binary'));
 function tick(count){for(let i=0;i<count;i++)n.frame();}
 function press(){n.buttonDown(1,Controller.BUTTON_START);tick(1);n.buttonUp(1,Controller.BUTTON_START);}
 function save(name){const p=new PNG({width:256,height:240});for(let i=0;i<frame.length;i++){const v=mesenRgbFromJsnes(frame[i]);p.data.set([v&255,v>>8&255,v>>16&255,255],i*4);}fs.writeFileSync(new URL(`mm${game}-${name}.png`,work),PNG.sync.write(p));}
 tick(900);save('boot');press();tick(300);save('start');press();tick(600);save('start2');press();tick(900);save('start3');
 fs.writeFileSync(new URL(`mm${game}-reference.json`,work),JSON.stringify(n.toJSON()));
 n.buttonDown(1,Controller.BUTTON_RIGHT);tick(1);n.buttonUp(1,Controller.BUTTON_RIGHT);tick(3);press();tick(900);save('stage-reference');press();tick(100);save('pause-reference');
 fs.writeFileSync(new URL(`mm${game}-pause-reference.json`,work),JSON.stringify(n.toJSON()));
}
