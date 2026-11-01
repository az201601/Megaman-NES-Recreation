// Recover real corridor graphics, NOT type-swapped enemies in the opening area's CHR set.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {NES, Controller as C} from 'jsnes';
import {PNG} from 'pngjs';
import {mesenRgbFromJsnes} from './mesen-palette.mjs';
const root=new URL('../../',import.meta.url), out=new URL('Assets/Enemies/MM1/Screw Bomber/',root);
const rom=fs.readFileSync(new URL('Mega Man (USA).nes',root));
const hash=b=>createHash('sha256').update(b).digest('hex');
assert.equal(hash(rom),'58fb9ef0c14c2947332929b9330d56c38a78040fd388274c39efd84e8d5446c7');
// Keep previously recorded real-B damage observations, explicitly separate from art evidence.
const previous=JSON.parse(fs.readFileSync(new URL('Reference/native-screw-bomber-art.json',out)));
let pixels;
const n=new NES({emulateSound:false,onFrame:p=>pixels=p.slice()});n.loadROM(rom.toString('binary'));
const m=n.cpu.mem,tick=k=>{for(let i=0;i<k;i++)n.frame();},press=b=>{n.buttonDown(1,b);tick(1);n.buttonUp(1,b);};
tick(180);press(C.BUTTON_START);tick(333);press(C.BUTTON_START);tick(899);
// Disclosed setup shortcut only: native death/restart from checkpoint-eligible page20.
// Native death handler resets its stack and reloads room CHR/palette/objects normally.
// No CHR/palette edits, type substitution, forced spawns, or further PC redirects.
m[0x460]=20;n.cpu.REG_PC=0xc218;tick(700);
assert.deepEqual([m[0x31],m[0x27],m[0x28],m[0x460],m[0x480],m[0x600],m[0x7a]],[0,20,22,20,128,148,55]);
for(let b=0;b<8;b++)n.buttonUp(1,b);
const palette=Array.from(n.ppu.vramMem.slice(0x3f1d,0x3f20));
assert.deepEqual(palette,[0x30,0x26,0x0f]);
const frames=[],encounters=[],bulletMatches=[];
function approach(x){n.buttonDown(1,C.BUTTON_RIGHT);let f=0;while(m[0x480]+256*m[0x460]<x){assert.ok(++f<500);m[0x55]=100;n.frame();}n.buttonUp(1,C.BUTTON_RIGHT);return f;}
for(const [type,worldX,baseY,stopX,label] of [[5,5336,160,5296,'floor'],[22,5576,96,5536,'ceiling'],[5,5712,160,5672,'floor-repeat']]){
 const approachFrames=approach(stopX),poses=new Map();
 const slot=Array.from({length:16},(_,i)=>i+16).find(s=>m[0x6e0+s]===type&&m[0x480+s]+256*m[0x460+s]===worldX&&m[0x600+s]<240);
 assert.notEqual(slot,undefined,'Original encounter must spawn normally');
 for(let frame=1;frame<=320;frame++){
  m[0x55]=100;n.frame();
  assert.equal(m[0x6e0+slot],type);assert.equal(m[0x480+slot]+256*m[0x460+slot],worldX);
  const sx=worldX-m[0x1a]-256*m[0x1b],enemyY=m[0x600+slot],cells=[];
  for(let i=0;i<64;i++){const[y,tile,attr,x]=n.ppu.spriteMem.slice(i*4,i*4+4);if(tile>=188&&tile<=207&&x>=sx-8&&x<sx+8&&y>=enemyY-16&&y<enemyY+16)cells.push({i,x,y,tile,attr});}
  if(![2,3,4].includes(cells.length)||cells.some(c=>c.x<sx-8||c.x+8>sx+8))continue;
  const index=cells.length===2?0:cells.length===4?1:cells.some(c=>c.tile===191)?2:cells.some(c=>c.tile===189)?3:4;
  // Require the COMPLETE native pose, not a clipped subset during a Y transition.
  const expectedTiles=[[188,207],[193,194,195,196],[191,192,206],[189,190,206],[188,206,207]][index];
  if(JSON.stringify(cells.map(c=>c.tile).sort((a,b)=>a-b))!==JSON.stringify(expectedTiles))continue;
  if(poses.has(index))continue;
  let top=Math.min(...cells.map(c=>c.y));if(type===22&&index===0)top-=8;
  // OAM can still contain the preceding pose on a state-transition update.
  if(top+1!==enemyY-7)continue;
  const p=new PNG({width:16,height:16});
  for(const c of [...cells].reverse())for(let y=0;y<8;y++)for(let x=0;x<8;x++){
   const v=n.ppu.ptTile[c.tile+256*n.ppu.f_spPatternTable].pix[(c.attr&128?7-y:y)*8+(c.attr&64?7-x:x)];if(!v)continue;
   const rgb=mesenRgbFromJsnes(n.ppu.sprPalette[(c.attr&3)*4+v]),px=c.x-(sx-8)+x,py=c.y-top+y;
   assert.ok(px>=0&&px<16&&py>=0&&py<16);
   p.data.set([rgb&255,rgb>>8&255,rgb>>16&255,255],(py*16+px)*4);
  }
  let opaquePixels=0,match=true;
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const k=(y*16+x)*4;if(!p.data[k+3])continue;const rgb=mesenRgbFromJsnes(pixels[(top+1+y)*256+sx-8+x]);if(![rgb&255,rgb>>8&255,rgb>>16&255].every((v,j)=>v===p.data[k+j]))match=false;opaquePixels++;}
  // Reject sprite-limit/occluded/transitional frames, rather than blessing partial matches.
  if(!match)continue;
  // Verify every used 16-byte NES pattern exists verbatim in supplied original ROM.
  const patterns=[...new Set(cells.map(c=>c.tile))].map(tile=>{const bytes=Buffer.from(n.ppu.vramMem.slice((tile+256*n.ppu.f_spPatternTable)*16,(tile+256*n.ppu.f_spPatternTable+1)*16));const offset=rom.indexOf(bytes,16);assert.ok(offset>=16);return{tile,hex:bytes.toString('hex'),romOffset:offset};});
  poses.set(index,{p,index,frame,slot,enemyY,left:sx-8,top:top+1,cells,patterns,opaquePixels,rgbaSha256:hash(p.data)});
  if(index===1){const shot=new PNG({width:256,height:208});for(let y=32;y<240;y++)for(let x=0;x<256;x++){const rgb=mesenRgbFromJsnes(pixels[y*256+x]);shot.data.set([rgb&255,rgb>>8&255,rgb>>16&255,255],((y-32)*256+x)*4);}fs.writeFileSync(new URL('Reference/native-'+label+'-encounter.png',out),PNG.sync.write(shot));}
 }
 assert.equal(poses.size,5,label+' must show every pose');
 if(label==='floor-repeat')for(const [index,p]of poses)assert.equal(p.rgbaSha256,frames.find(f=>f.type===5&&f.index===index).rgbaSha256);
 else{
  const strip=new PNG({width:80,height:16});
  for(const [index,{p,...meta}] of [...poses].sort((a,b)=>a[0]-b[0])){for(let y=0;y<16;y++)p.data.copy(strip.data,(y*80+index*16)*4,y*64,(y+1)*64);frames.push({type,...meta});}
  fs.writeFileSync(new URL('spr_mm1_screw_bomber_'+label+'_strip5.png',out),PNG.sync.write(strip));
  const preview=new PNG({width:640,height:128});for(let y=0;y<128;y++)for(let x=0;x<640;x++){const k=(Math.floor(y/8)*80+Math.floor(x/8))*4;preview.data.set(strip.data[k+3]?strip.data.subarray(k,k+4):[100,176,255,255],(y*640+x)*4);}
  fs.writeFileSync(new URL('Reference/'+label+'-strip-preview-8x.png',out),PNG.sync.write(preview));
 }
 encounters.push({type,worldX,baseY,stopX,label,approachFrames,slot,poses:[...poses.values()].map(({index,frame,rgbaSha256})=>({index,frame,rgbaSha256}))});
 const bullet=new PNG({width:8,height:8});for(let y=0;y<8;y++)for(let x=0;x<8;x++){const v=n.ppu.ptTile[106+256*n.ppu.f_spPatternTable].pix[y*8+x];if(!v)continue;const rgb=mesenRgbFromJsnes(n.ppu.sprPalette[12+v]);bullet.data.set([rgb&255,rgb>>8&255,rgb>>16&255,255],(y*8+x)*4);}
 if(bulletMatches.length)assert.equal(hash(bullet.data),bulletMatches[0]);
 fs.writeFileSync(new URL('spr_mm1_screw_bomber_bullet.png',out),PNG.sync.write(bullet));bulletMatches.push(hash(bullet.data));
}
fs.writeFileSync(new URL('Reference/native-screw-bomber-art.json',out),JSON.stringify({
 method:'CORRECTED: supplied USA/JSNES2.1.0 fresh boot. One disclosed page20 placement + PC C219 native death-handler redirect, then700native frames to checkpoint restart. Original restart loads corridor graphics and palette. Right-only approaches stop at5296/5536/5672, neutral320updates each, protection100 only; no enemy/type/CHR/palette edits. All THREE original corridor encounters spawn naturally after checkpoint setup. Fifteen COMPLETE poses native-render matched with exact tile-set checks; repeated floor independently matches first floor. Not natural whole-stage traversal, hardware/Mesen executable or GMS runtime certification.',
 correction:'Previous extraction substituted types05/16 atX824 in opening-area graphics. AI/OAM IDs were real but underlying CHR and palette were WRONG. Matching the same faulty fixture did not validate sprite identity. Superseded all ten previous art hashes. Existing damage observations below remain separate controlled AI-fixture evidence, not artwork evidence. Follow-up: first corrected frame0 had selected only C3/C4 from a transitional emerging pose after Y changed. Broadened Y selection plus exact COMPLETE tile sets now requires BC/CF for closed, rejecting partial OAM-transition captures. Other eight body poses unchanged.',
 romSha256:hash(rom),cell:[16,16],origin:[8,7],roomGraphicsIndex:55,spritePalette3:palette,
 bulletReuse:{resource:'spr_mm1_screw_bomber_bullet',tile:106,palette:3,rgbaSha256:bulletMatches[0],method:'Actual original corridor tile6A/palette3 agrees at all three encounters. Shape matches Blaster, but colour is native26 rather than opening-area14. Dedicated child object/Draw keeps accepted Blaster unchanged.'},
 encounters,frames,hits:previous.hits
},null,2)+'\n');
console.log('PASS correct corridor CHR/palette; 3 original spawns,15 native-render poses, repeat-floor equality, dedicated correctly coloured bullet.');
