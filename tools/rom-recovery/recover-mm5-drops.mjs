import fs from'node:fs';import assert from'node:assert/strict';import{NES}from'jsnes';import{PNG}from'pngjs';import{mesenRgbFromJsnes}from'./mesen-palette.mjs';
const root=new URL('../../',import.meta.url),w=new URL('./.work/',import.meta.url),out=new URL('Assets/Pickups/MM5/Recovered/',root);fs.mkdirSync(out,{recursive:true});
const rom=fs.readFileSync(new URL('Mega Man 5 (USA).nes',root)),snap=JSON.parse(fs.readFileSync(new URL('mm5-stage.json',w))),get=(bank,cpu)=>rom[16+bank*8192+(cpu&8191)];
const spans=[{bank:29,address:0xae59,hex:'bd4005c904d0f8a52f30f4a5e665e76500e59d85e66501e5e5659285e78500a93285012007f2a004a503d91baf90068810f84cc4f2b920af2098eaa9009d08049d2004b925af9d6804a9ff9d8004201eeaa9b79d0003a9cc9d8805a9ad9da00560'},{bank:29,address:0xaf1b,hex:'0e0a0803027774757876132313232300000a020a02000000000000000000242400000000242424242424242424bac4d8d8dcdcce0808080808080808aeaeaeaeaeaeaeafafafafafafafaf'},{bank:31,address:0xf207,hex:'a90085028503a5000501d003850260a00806022600260338a503e50190048503e60288d0ec60'}];for(const s of spans){s.offset=16+s.bank*8192+(s.address&8191);assert.equal(rom.subarray(s.offset,s.offset+s.hex.length/2).toString('hex'),s.hex);}
const thresholds=Array.from({length:5},(_,i)=>get(0x1d,0xaf1b+i)),animations=Array.from({length:5},(_,i)=>get(0x1d,0xaf20+i));assert.deepEqual(thresholds,[14,10,8,3,2]);assert.deepEqual(animations,[0x77,0x74,0x75,0x78,0x76]);
const kinds={119:'small_weapon',116:'large_health',117:'small_health',118:'large_weapon',120:'extra_life'},rolls=[],counts={none:0,small_health:0,large_health:0,small_weapon:0,large_weapon:0,extra_life:0};
const n=new NES();n.loadROM(rom.toString('binary'));n.fromJSON(structuredClone(snap));n.mmap.load8kRomBank(0x1d,0xa000);n.ppu.advanceDots=()=>{};n.cpu.nmiImmediate=false;n.cpu.nmiPending=false;n.cpu.nmiRaised=false;
for(let roll=0;roll<256;roll++){
 n.cpu.irqRequested=false;n.cpu.mem[0]=roll;n.cpu.mem[1]=50;n.cpu.REG_PC=0xf206;let steps=0;while(n.cpu.REG_PC!==0xf22b&&steps++<300)n.cpu.emulate();assert.ok(steps<300,JSON.stringify({roll,pc:n.cpu.REG_PC,code:n.cpu.mem.slice(0xf207,0xf218),rom:[...rom.subarray(16+31*8192+0x1207,16+31*8192+0x1218)]}));const remainder=n.cpu.mem[3];assert.equal(remainder,roll%50);
 n.cpu.REG_PC=0xae7e;steps=0;while(![0xae8a,0xae8d].includes(n.cpu.REG_PC)&&steps++<100)n.cpu.emulate();assert.ok(steps<100);let index=n.cpu.REG_PC===0xae8d?n.cpu.REG_Y:-1,kind=index<0?'none':kinds[animations[index]];counts[kind]++;rolls.push({roll,remainder,index,kind});
}
fs.writeFileSync(new URL('drop-selection.json',out),JSON.stringify({method:'Original USA divide helperF207 and selection loopAE7F executed instruction-by-instruction for all256 possible input bytes with bank1D mapped. No RNG uniformity claim; not a natural kill-frequency trial.',spans,thresholds,animations,counts,rolls},null,2)+'\n');
const items=[];
for(const [anim,name]of Object.entries(kinds)){
 let pixels;const a=new NES({onFrame:p=>pixels=p.slice()});a.loadROM(rom.toString('binary'));a.fromJSON(structuredClone(snap));for(let b=0;b<8;b++)a.buttonUp(1,b);const m=a.cpu.mem,s=16;
 for(let i=1;i<24;i++)m[0x300+i]=0;
 Object.assign(m,{[0x300+s]:0xb7,[0x558+s]:Number(anim),[0x540+s]:0,[0x570+s]:0,[0x588+s]:0xcc,[0x5a0+s]:0xad,[0x468+s]:[0x77,0x75].includes(Number(anim))?0x13:0x23,[0x480+s]:255,[0x408+s]:0,[0x420+s]:0,[0x528+s]:0,[0x5b8+s]:0,[0x348+s]:0,[0x390+s]:0});
 const poses=new Map(),trace=[];for(let frame=1;frame<=260;frame++){
  m[0x330+s]=184;m[0x318+s]=0;m[0x378+s]=80;m[0x360+s]=0;m[0x3d8+s]=0;m[0x3f0+s]=0;a.frame();
  const cells=[];for(let i=0;i<64;i++){const[y,tile,attr,x]=a.ppu.spriteMem.slice(i*4,i*4+4);if(x>=168&&x<200&&y>=64&&y<104)cells.push({x,y:y+1,tile,attr});}
  trace.push({frame,type:m[0x300+s],animation:m[0x558+s],pose:m[0x540+s],timer:m[0x480+s],cells:cells.length});if(!cells.length)continue;
  const left=Math.min(...cells.map(c=>c.x)),top=Math.min(...cells.map(c=>c.y)),right=Math.max(...cells.map(c=>c.x))+8,bottom=Math.max(...cells.map(c=>c.y))+8,p=new PNG({width:right-left,height:bottom-top});
  for(const c of [...cells].reverse())for(let y=0;y<8;y++)for(let x=0;x<8;x++){const tile=a.ppu.ptTile[a.ppu.f_spPatternTable*256+c.tile],v=tile.pix[(c.attr&128?7-y:y)*8+(c.attr&64?7-x:x)];if(!v)continue;const rgb=mesenRgbFromJsnes(a.ppu.sprPalette[(c.attr&3)*4+v]);p.data.set([rgb&255,rgb>>8&255,rgb>>16&255,255],((c.y-top+y)*p.width+c.x-left+x)*4);}
  let matched=true;for(let y=0;y<p.height;y++)for(let x=0;x<p.width;x++){let k=(y*p.width+x)*4;if(!p.data[k+3])continue;const rgb=mesenRgbFromJsnes(pixels[(top+y)*256+left+x]);if(p.data[k]!== (rgb&255)||p.data[k+1]!== (rgb>>8&255)||p.data[k+2]!== (rgb>>16&255))matched=false;}
  const key=p.data.toString('hex');trace[trace.length-1].palettePose=[...poses.keys()].includes(key)?[...poses.keys()].indexOf(key):poses.size;if(!poses.has(key))poses.set(key,{image:p,cells,left,top,matched});else if(matched)poses.get(key).matched=true;
 }
 console.log(name,trace.slice(1,33).map(t=>t.palettePose).join(''),[...poses.values()].map(v=>[v.image.width,v.image.height,v.matched]));
 assert.equal(trace.find(t=>t.type===0).frame,255);assert.ok(poses.size);assert.ok([...poses.values()].every(p=>p.matched));
 let i=0;const first=[...poses.values()][0],strip=new PNG({width:first.image.width*poses.size,height:first.image.height});for(const pose of poses.values()){fs.writeFileSync(new URL(`spr_mm5_pickup_${name}_${i}.png`,out),PNG.sync.write(pose.image));PNG.bitblt(pose.image,strip,0,0,pose.image.width,pose.image.height,i*pose.image.width,0);i++;}fs.writeFileSync(new URL(`spr_mm5_pickup_${name}_strip${poses.size}.png`,out),PNG.sync.write(strip));
 items.push({name,animation:Number(anim),poses:[...poses.values()].map(p=>({width:p.image.width,height:p.image.height,relativeLeft:p.left-184,relativeTop:p.top-80,matched:p.matched,cells:p.cells})),trace});
}
fs.writeFileSync(new URL('pickup-art.json',out),JSON.stringify({method:'Controlled original B7 item slot using native pickup handler and rendering; clear other actor slots, pin itemX184/Y80 and vertical speed0 for render isolation. Original CHR/OAM/palette data, Mesen colour mapping only. Each opaque pose verified against original rendered pixels. No artwork repaint.',items},null,2)+'\n');console.log(counts);
