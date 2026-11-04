// Native MM5 pause transitions: frame1=fresh input. No inventory/audio/APU patches.
import{NES,Controller}from'jsnes';import{PNG}from'pngjs';import fs from'node:fs';import{createHash}from'node:crypto';import{mesenRgbFromJsnes}from'./mesen-palette.mjs';
const root=new URL('../../',import.meta.url),work=new URL('./.work/mm5-menu-transitions/',import.meta.url);fs.mkdirSync(work,{recursive:true});
let pixels,t=0;const n=new NES({onFrame:p=>pixels=p.slice()});n.loadROM(fs.readFileSync(new URL('Mega Man 5 (USA).nes',root),'binary'));n.fromJSON(structuredClone(JSON.parse(fs.readFileSync(new URL('./.work/mm5-stage.json',import.meta.url)))));for(let b=0;b<8;b++)n.buttonUp(1,b);for(let i=0;i<30;i++)n.frame();
const sounds=[];const emulate=n.cpu.emulate.bind(n.cpu);let phase='open';n.cpu.emulate=()=>{if(n.cpu.REG_PC===0xec5c)sounds.push({phase,frame:t,command:n.cpu.REG_ACC});return emulate();};
const hash=p=>createHash('sha256').update(p).digest('hex');
const traces={};
for(phase of['open','close']){
 const rows=[];let previous;
 for(t=0;t<=120;t++){
  if(t===1)n.buttonDown(1,Controller.BUTTON_START);if(t===2)n.buttonUp(1,Controller.BUTTON_START);
  if(t>0)n.frame();
  const image=new PNG({width:256,height:240});let nonBlack=0,changed=0,max=0;
  for(let i=0;i<pixels.length;i++){const v=mesenRgbFromJsnes(pixels[i]);image.data.set([v&255,v>>8&255,v>>16&255,255],i*4);if(v!==0)nonBlack++;if(previous&&pixels[i]!==previous[i])changed++;max=Math.max(max,v&255,v>>8&255,v>>16&255);}
  const p=n.ppu,nt=p.nameTable[p.ntable1[p.regV*2+p.regH]];
  rows.push({frame:t,imageHash:hash(image.data),nonBlack,changed,maxChannel:max,palette:Array.from(p.vramMem.slice(0x3f00,0x3f20)),ntHash:hash(Buffer.from(nt.tile)),chrHash:hash(Buffer.from(p.vramMem.slice(0,0x2000))),bgVisible:p.f_bgVisibility,spritesVisible:p.f_spVisibility,scroll:{h:p.regH,v:p.regV,x:p.regHT,y:p.regVT,fineX:p.regFH},player:{state:n.cpu.mem[0x30],x:n.cpu.mem[0x330],y:n.cpu.mem[0x378],weapon:n.cpu.mem[0x32]}});
  fs.writeFileSync(new URL(`${phase}-${String(t).padStart(3,'0')}.png`,work),PNG.sync.write(image));previous=pixels.slice();
 }
 traces[phase]=rows;
}
fs.writeFileSync(new URL('trace.json',work),JSON.stringify({source:'Supplied MM5 USA, original Start input, no patches; JSNES2.1.0 with pinned Mesen palette, NOT Mesen execution',frameConvention:'Frame0 before input;1 fresh Start,2 released. Each phase120 updates; close from stable menu.',sounds,traces},null,2));
for(const phase of['open','close']){console.log(phase);const rows=traces[phase];for(let i=0;i<rows.length;i++){let r=rows[i],p=rows[i-1];if(!p||r.nonBlack!==p.nonBlack||JSON.stringify(r.palette)!==JSON.stringify(p.palette)||r.ntHash!==p.ntHash||r.bgVisible!==p.bgVisible)console.log(r.frame,'lit',r.nonBlack,'change',r.changed,'pal',r.palette.slice(0,16).map(v=>v.toString(16).padStart(2,'0')).join(' '),'bg',r.bgVisible,'nt',r.ntHash.slice(0,8));}}console.log('sounds',sounds);
