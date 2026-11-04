// Natural camera input branches + explicitly CONTROLLED position/protection PPU upload test.
import fs from'node:fs';import assert from'node:assert/strict';import{NES,Controller as C}from'jsnes';
const root=new URL('../../',import.meta.url),work=new URL('./.work/',import.meta.url),rom=fs.readFileSync(new URL('Mega Man (USA).nes',root),'binary'),snap=JSON.parse(fs.readFileSync(new URL('mm1-stage.json',work)));
const results={};let checked=0,playerMatches=0,entries=0;
for(const mode of['right','right-jump','reverse','controlled-upper-traverse']){
 const n=new NES({emulateSound:false});n.loadROM(rom);n.fromJSON(structuredClone(snap));for(let b=0;b<8;b++)n.buttonUp(1,b);n.buttonDown(1,C.BUTTON_RIGHT);
 let target=null;const emulate=n.cpu.emulate.bind(n.cpu);n.cpu.emulate=()=>{if(n.cpu.REG_PC===0x988e)target=n.cpu.mem[0x20]*256+n.cpu.mem[0x22];return emulate();};
 const rows=[],pages=[];
 for(let t=1;t<=(mode.startsWith('controlled')?900:240);t++){
  if(mode==='right-jump'){if(t%70===1)n.buttonDown(1,C.BUTTON_A);if(t%70===25)n.buttonUp(1,C.BUTTON_A);}
  if(mode==='reverse'&&t===71){n.buttonUp(1,C.BUTTON_RIGHT);n.buttonDown(1,C.BUTTON_LEFT);}
  if(mode.startsWith('controlled')){n.cpu.mem[0x600]=36;n.cpu.mem[0x620]=0;n.cpu.mem[0x660]=0;n.cpu.mem[0x680]=0;n.cpu.mem[0x55]=100;}
  target=null;n.frame();const m=n.cpu.mem,x=m[0x480]+256*m[0x460],camera=m[0x1a]+256*m[0x1b];
  if(target!==null){assert.equal(camera,Math.max(m[0x27]*256,Math.min(m[0x28]*256,target-128)));entries++;if(camera===Math.max(0,Math.min(768,x-128)))playerMatches++;}
  rows.push({update:t,x,xfraction:m[0x4a0],camera,target,min:m[0x27]*256,max:m[0x28]*256});
  if(mode.startsWith('controlled'))for(const page of[2,3])if(camera>=page*256&&camera<page*256+16&&!pages.includes(page)){
   const nt=n.ppu.nameTable[n.ppu.ntable1[page%2]],cells=JSON.parse(fs.readFileSync(new URL('cutman-route/cells.json',work))).filter(c=>Math.floor(c.x/256)===page);
   for(const c of cells)for(let sy=0;sy<2;sy++)for(let sx=0;sx<2;sx++){
    const k=(c.y/8+sy)*32+(c.x%256)/8+sx;assert.equal(nt.tile[k],(c.raw&63)*4+sx*2+sy,`page${page}tile${k}`);assert.equal(nt.attrib[k],c.palette*4);checked++;
   }
   pages.push(page);
  }
 }
 if(mode.startsWith('controlled'))assert.deepEqual(pages,[2,3]);results[mode]=rows;
}
fs.mkdirSync(new URL('cutman-route/',work),{recursive:true});fs.writeFileSync(new URL('cutman-route/camera.json',work),JSON.stringify({source:'MM1 USA+JSNES; right/right-jump/reverse natural. controlled-upper-traverse pins playerY36/subpixel0/verticalspeed0/protection100 every update ONLY to validate native scrolling PPU uploads; no ROM/code patches. Not natural traversal or collision certification.',entries,playerMatches,checkedTileAndPalettePairs:checked,results},null,2));
console.log({entries,playerMatches,checkedTileAndPalettePairs:checked});
