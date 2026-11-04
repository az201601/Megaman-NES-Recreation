// Controlled placement at a real ladder, then original Up input and unmodified scroll code.
import fs from'node:fs';import{NES,Controller as C}from'jsnes';import{PNG}from'pngjs';import{mesenRgbFromJsnes}from'./mesen-palette.mjs';
const root=new URL('../../',import.meta.url),work=new URL('./.work/',import.meta.url),out=new URL('./.work/cutman-first-scroll/',import.meta.url);fs.mkdirSync(out,{recursive:true});
let pixels,frame=0;const n=new NES({onFrame:p=>pixels=p.slice()});n.loadROM(fs.readFileSync(new URL('Mega Man (USA).nes',root),'binary'));n.fromJSON(JSON.parse(fs.readFileSync(new URL('mm1-stage.json',work))));for(let b=0;b<8;b++)n.buttonUp(1,b);n.buttonDown(1,C.BUTTON_RIGHT);
for(let t=0;t<900;t++){n.cpu.mem[0x600]=36;n.cpu.mem[0x620]=0;n.cpu.mem[0x660]=0;n.cpu.mem[0x680]=0;n.cpu.mem[0x55]=100;n.frame();}
n.buttonUp(1,C.BUTTON_RIGHT);const m=n.cpu.mem;m[0x480]=216;m[0x460]=3;m[0x4a0]=0;m[0x600]=48;m[0x620]=0;m[0x660]=0;m[0x680]=0;m[0x400]=0;m[0x420]=0xc0;m[0x55]=100;
const events=[],emulate=n.cpu.emulate.bind(n.cpu);n.cpu.emulate=()=>{if([0x9fda,0xa071,0xa0ca].includes(n.cpu.REG_PC))events.push({frame,pc:(n.cpu.REG_PC+1).toString(16),x:n.cpu.REG_X,y:m[0x600],fraction:m[0x620],cameraY:m[0x1e],type:m[0x26]});return emulate();};
n.buttonDown(1,C.BUTTON_UP);const rows=[];
for(frame=1;frame<=360;frame++){
 n.frame();if(frame===59)fs.writeFileSync(new URL('before-up-trigger.json',out),JSON.stringify(n.toJSON()));const oam=[];for(let i=0;i<64;i++){const[y,tile,attr,x]=n.ppu.spriteMem.slice(i*4,i*4+4);if(y<240&&tile<0xf0)oam.push({x,y,tile,attr});}
 rows.push({frame,page:m[0x460],playerY:m[0x600]+m[0x620]/256,pose:m[0x400],flags:m[0x420],cameraX:m[0x1a]+256*m[0x1b],cameraY:m[0x1e],scrollRows:m[0x33],begin:m[0x27],end:m[0x28],order:m[0x29],type:m[0x26],oam});
 if(frame%10===0){const p=new PNG({width:256,height:208});for(let y=32;y<240;y++)for(let x=0;x<256;x++){const v=mesenRgbFromJsnes(pixels[y*256+x]);p.data.set([v&255,v>>8&255,v>>16&255,255],((y-32)*256+x)*4);}fs.writeFileSync(new URL(`up-${frame}.png`,out),PNG.sync.write(p));}
}
fs.writeFileSync(new URL('native-up.json',out),JSON.stringify({source:'Supplied MM1 USA+JSNES+Mesen palette. CONTROLLED prior traverse pins Y36/protection100, then one-time placement on original page3 ladder at localX216,Y48 with reset player state. Only Up thereafter; no scroll routine/ROM patches. NOT natural whole-stage traversal.',events,rows},null,2));fs.writeFileSync(new URL('after-up-state.json',out),JSON.stringify(n.toJSON()));console.log(events);console.log(rows.filter((r,i)=>!i||r.page!==rows[i-1].page||r.order!==rows[i-1].order||r.type!==rows[i-1].type).map(({oam,...r})=>r));
