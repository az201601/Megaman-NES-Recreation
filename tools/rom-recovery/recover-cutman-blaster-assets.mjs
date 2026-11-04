// Original supplied USA ROM. Controlled traversal/render and real B-button collision trials.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import {NES,Controller as C} from 'jsnes';import {PNG} from 'pngjs';import {mesenRgbFromJsnes} from './mesen-palette.mjs';
const root=new URL('../../',import.meta.url),work=new URL('./.work/',import.meta.url),out=new URL('Assets/Enemies/MM1/Blaster/',root);
const rom=fs.readFileSync(new URL('Mega Man (USA).nes',root)),initial=JSON.parse(fs.readFileSync(new URL('mm1-stage.json',work)));
const hash=b=>createHash('sha256').update(b).digest('hex');
let pixels;const n=new NES({emulateSound:false,onFrame:p=>pixels=p.slice()});n.loadROM(rom.toString('binary'));n.fromJSON(initial);for(let b=0;b<8;b++)n.buttonUp(1,b);n.buttonDown(1,C.BUTTON_RIGHT);
const poses=new Map(),bulletPoses=new Map(),soundRequests=[],driverRequests=[];let frame=0,stopped=false,closed,open;
const em=n.cpu.emulate.bind(n.cpu);n.cpu.emulate=()=>{if(n.cpu.REG_PC===0xc476)soundRequests.push({frame,sound:n.cpu.REG_ACC,source:n.cpu.mem[0x2f]});if(n.cpu.REG_PC===0x9002)driverRequests.push({frame,sound:n.cpu.REG_ACC});return em();};
function decode(cells,width,height,ox,oy){const p=new PNG({width,height});
 for(const c of [...cells].reverse())for(let y=0;y<8;y++)for(let x=0;x<8;x++){
  const v=n.ppu.ptTile[c.tile+256*n.ppu.f_spPatternTable].pix[(c.attr&128?7-y:y)*8+(c.attr&64?7-x:x)];if(!v)continue;
  const dx=c.x+x-ox,dy=c.y+1+y-oy;assert.ok(dx>=0&&dx<width&&dy>=0&&dy<height);
  const rgb=mesenRgbFromJsnes(n.ppu.sprPalette[(c.attr&3)*4+v]);p.data.set([rgb&255,rgb>>8&255,rgb>>16&255,255],(dy*width+dx)*4);
 }
 return p;
}
function matches(p,ox,oy){if(ox<8||ox+p.width>248||oy<8||oy+p.height>232)return false;
 for(let y=0;y<p.height;y++)for(let x=0;x<p.width;x++){const i=(y*p.width+x)*4;if(!p.data[i+3])continue;const rgb=mesenRgbFromJsnes(pixels[(oy+y)*256+ox+x]);if(p.data[i]!=(rgb&255)||p.data[i+1]!=(rgb>>8&255)||p.data[i+2]!=(rgb>>16&255))return false;}return true;
}
for(frame=1;frame<=850;frame++){
 const m=n.cpu.mem;m[0x600]=36;m[0x620]=m[0x660]=m[0x680]=0;m[0x55]=100;
 if(!stopped&&m[0x480]+256*m[0x460]>=760){n.buttonUp(1,C.BUTTON_RIGHT);stopped=true;}
 n.frame();if(frame===500)closed=n.toJSON();if(frame===550)open=n.toJSON();if(!stopped)continue;
 const camera=m[0x1a]+256*m[0x1b],sx=824-camera,cells=[];
 for(let i=0;i<64;i++){const[y,tile,attr,x]=n.ppu.spriteMem.slice(i*4,i*4+4);if(y>=240)continue;
  if(tile>=0xb0&&tile<=0xba&&x>=sx-8&&x<sx+8&&y>=64&&y<80)cells.push({x,y,tile,attr});
  if(tile===0x6a&&y>20&&y<220&&x>=8&&x<240){const c={x,y,tile,attr},p=decode([c],8,8,x,y+1);if(matches(p,x,y+1))bulletPoses.set(hash(p.data),{p,frame,cell:c});}
 }
 if(cells.length>=2){const p=decode(cells,16,16,sx-8,65);if(matches(p,sx-8,65)){
   const key=hash(p.data);if(!poses.has(key))poses.set(key,{p,frame,cells});
 }}
}
assert.equal(poses.size,4,'Four distinct native shell poses');assert.equal(bulletPoses.size,1,'One bullet pose');
const strip=new PNG({width:64,height:16});let i=0;const art=[];
for(const {p,frame,cells}of poses.values()){for(let y=0;y<16;y++)p.data.copy(strip.data,(y*64+i*16)*4,y*16*4,(y+1)*16*4);art.push({index:i,frame,cells,rgbaSha256:hash(p.data)});i++;}
fs.mkdirSync(new URL('Reference/',out),{recursive:true});fs.writeFileSync(new URL('spr_mm1_blaster_strip4.png',out),PNG.sync.write(strip));
const bullet=[...bulletPoses.values()][0];fs.writeFileSync(new URL('spr_mm1_blaster_bullet.png',out),PNG.sync.write(bullet.p));
const hits=[];
for(const [mode,snap]of[['closed',closed],['open',open]]){
 const h=new NES({emulateSound:false});h.loadROM(rom.toString('binary'));h.fromJSON(structuredClone(snap));for(let b=0;b<8;b++)h.buttonUp(1,b);
 let tick=0;const events=[];const run=h.cpu.emulate.bind(h.cpu);h.cpu.emulate=()=>{const pc=h.cpu.REG_PC+1;
  if([0x9003,0xc477,0xbf52,0xbec2,0xbeee].includes(pc))events.push({tick,pc:pc.toString(16),a:h.cpu.REG_ACC,slot:h.cpu.REG_X,enemyType:h.cpu.mem[0x6f0],state:h.cpu.mem[0x450],life:h.cpu.mem[0x6d0]});return run();};
 const m=h.cpu.mem;m[0x480]=12;m[0x460]=3;m[0x4a0]=0;m[0x420]|=64;h.buttonDown(1,C.BUTTON_B);
 for(tick=0;tick<25;tick++){m[0x600]=72;m[0x620]=m[0x660]=m[0x680]=0;m[0x55]=100;if(tick===1)h.buttonUp(1,C.BUTTON_B);h.frame();}
 if(mode==='closed'){assert.ok(events.some(e=>e.pc==='bf52'));assert.ok(events.some(e=>e.pc==='9003'&&e.a===0x1d));assert.equal(m[0x6f0],0x0b);assert.equal(m[0x6d0],20);}
 else{assert.ok(events.some(e=>e.pc==='bec2'));assert.ok(events.some(e=>e.pc==='beee'));assert.equal(m[0x6f0],0x1b);}
 hits.push({mode,fixture:'Original first Blaster state snapshot; player placed X780/Y72, facingright, real one-frame B press. Y/speed/protection pinned for25frames. No forced hit flags or enemy HP/state edits.',events,afterType:m[0x6f0],afterLife:m[0x6d0]});
}
const fire=soundRequests.filter(e=>e.source===16&&e.sound===0x15);assert.ok(fire.length>=8);for(const e of fire)assert.ok(driverRequests.some(d=>d.sound===0x15&&d.frame>=e.frame&&d.frame<=e.frame+2));
// Exact instruction references used to establish sound semantics.
const spans=[[0x1f663,'48c91af004c92dd005a9152077c4'],[0x17f52,'bd2004297f9d2004'],[0x17f6b,'a91d9d8005']].map(([offset,hex])=>{assert.equal(rom.subarray(offset+16,offset+16+hex.length/2).toString('hex'),hex);return{offset:offset+16,hex};});
const report={method:'Supplied USA ROM/JSNES2.1.0, Mesen0.9.9 RGB adaptation. Controlled safeY/protection approach toX760 then stationary observation; source-ROM code unchanged. All4shell poses and bullet match opaque pixels in actual native render. Native OAM pipeline can lag logic; observed art is not inferred solely from high animation nibble.',romSha256:hash(rom),art,bullet:{frame:bullet.frame,cell:bullet.cell,rgbaSha256:hash(bullet.p.data)},spriteSettings:{shell:{cell:[16,16],frames:4,origin:[8,7],canonical:'left'},bullet:{cell:[8,8],frames:1,origin:[4,3]}},spans,sounds:{fire:0x15,blocked:0x1d,fireRequests:fire,driverRequests:driverRequests.filter(v=>v.sound===0x15)},hits};
fs.writeFileSync(new URL('Reference/native-blaster-assets.json',out),JSON.stringify(report,null,2)+'\n');
console.log('PASS: 4 native-render-matched shell poses, 1 bullet; natural AI firing request15; real B press closed ding1D/no HP loss and open one-shot kill. Controlled positioning disclosed.');
