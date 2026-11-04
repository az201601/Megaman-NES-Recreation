// Natural MM6 boot and stage entry, followed by natural Right/fire inputs.
import fs from'node:fs';import{NES,Controller as C}from'jsnes';import{PNG}from'pngjs';import{mesenRgbFromJsnes}from'./mesen-palette.mjs';
const root=new URL('../../',import.meta.url),w=new URL('./.work/mm6-hit/',import.meta.url);fs.mkdirSync(w,{recursive:true});let pixels;
const n=new NES({onFrame:p=>pixels=p.slice()});n.loadROM(fs.readFileSync(new URL('Mega Man 6 (USA).nes',root),'binary'));
const tick=count=>{while(count--)n.frame();},press=key=>{n.buttonDown(1,key);tick(1);n.buttonUp(1,key);};
tick(900);press(C.BUTTON_START);tick(300);press(C.BUTTON_START);tick(600);press(C.BUTTON_START);tick(900);press(C.BUTTON_RIGHT);tick(3);press(C.BUTTON_START);tick(900);
fs.writeFileSync(new URL('stage.json',w),JSON.stringify(n.toJSON()));
function save(name){const p=new PNG({width:256,height:240});for(let i=0;i<pixels.length;i++){const v=mesenRgbFromJsnes(pixels[i]);p.data.set([v&255,v>>8&255,v>>16&255,255],i*4);}fs.writeFileSync(new URL(name,w),PNG.sync.write(p));}
save('stage.png');let frame=0;const events=[],em=n.cpu.emulate.bind(n.cpu);n.cpu.emulate=()=>{if([0xe9fa,0xea43,0xeb0b,0xeb24,0xef9a].includes(n.cpu.REG_PC)){const m=n.cpu.mem,x=n.cpu.REG_X;events.push({frame,pc:(n.cpu.REG_PC+1).toString(16),slot:x,command:n.cpu.REG_ACC,hp:m[0x3e5+x],pending:m[0x56c+x],damage:m[0]});fs.writeFileSync(new URL(`before-hit-${events.length}.json`,w),JSON.stringify(n.toJSON()));}return em();};
n.buttonDown(1,C.BUTTON_RIGHT);for(frame=1;frame<=900;frame++){if(frame%18===1)n.buttonDown(1,C.BUTTON_B);if(frame%18===2)n.buttonUp(1,C.BUTTON_B);if(frame%70===1)n.buttonDown(1,C.BUTTON_A);if(frame%70===25)n.buttonUp(1,C.BUTTON_A);n.frame();if(frame%120===0)save(`walk-${frame}.png`);}
fs.writeFileSync(new URL('hits.json',w),JSON.stringify({method:'Natural boot/stage entry followed by Right with periodic fresh B and A presses. No placement, HP or shot RAM patches.',events},null,2));console.log(events);
