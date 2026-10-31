// Adapted from artwork by KindlyPatrick, from the user-supplied reference sheet.
// Interior shape pixels unchanged in position; explicit palette remap and MM5 casing.
import{PNG}from'pngjs';import fs from'node:fs';import assert from'node:assert/strict';
const root=new URL('../../',import.meta.url),base=new URL('Assets/Mega Man/MM5/Pause Menu/',root),dir=new URL('Adapted Weapon Icons/',base);
fs.mkdirSync(dir,{recursive:true});
const src=PNG.sync.read(fs.readFileSync(new URL('Weapon Icon References/kindlypatrick-user-supplied-sheet.png',base)));
const native=PNG.sync.read(fs.readFileSync(new URL('docs/pause-menu-reference/mm5-initial-menu.png',root)));
const colors=[[0,0,0,255],[102,102,102,255],[173,173,173,255],[255,254,255,255]];
const definitions=[
 ['rolling_cutter','R. CUTTER',8,{'112,112,112':1,'184,184,184':2,'255,255,255':3,'0,0,0':0}],
 ['ice_slasher','I. SLASHER',2,{'87,145,248':1,'255,255,255':3,'0,0,0':0}],
 ['hyper_bomb','H. BOMB',1,{'0,144,56':1,'176,248,200':2,'255,255,255':3,'0,0,0':0}],
 ['fire_storm','F. STORM',3,{'216,40,0':1,'248,151,56':2,'248,216,168':3,'0,0,0':0}],
 ['thunder_beam','T. BEAM',5,{'112,112,112':1,'240,183,56':2,'255,255,255':3,'0,0,0':0}],
 ['super_arm','S. ARM',7,{'200,72,8':2,'248,216,168':3,'0,0,0':0}],
 ['magnet_beam','M. BEAM',9,{'0,113,232':1,'55,185,248':2,'255,255,255':3,'0,0,0':0}]
];
const originals=[],adapted=[],manifest=[],strip=new PNG({width:112,height:16});
function isCasing(x,y){return x===0||x===15||y===0||y===15||((x===1||x===14)&&(y===1||y===14));}
for(const [i,[id,label,index,map]]of definitions.entries()){
 const p=new PNG({width:16,height:16}),q=new PNG({width:16,height:16}),sx=13+17*index,sy=4;
 for(let y=0;y<16;y++)for(let x=0;x<16;x++){
  const k=(y*16+x)*4,s=((sy+y)*src.width+sx+x)*4;q.data.set(src.data.subarray(s,s+4),k);
  if(isCasing(x,y)){let n=((96+y)*256+144+x)*4;p.data.set(native.data.subarray(n,n+4),k);assert.deepEqual(p.data.subarray(k,k+4),native.data.subarray(n,n+4));}
  else{let key=Array.from(q.data.subarray(k,k+3)).join(',');assert.ok(key in map,`${id} unknown ${key}`);p.data.set(colors[map[key]],k);assert.deepEqual(Array.from(p.data.subarray(k,k+4)),colors[map[key]],'Same source position, no scaling');}
  assert.ok(colors.some(c=>c.every((v,j)=>v===p.data[k+j])),'Only native MM5 grey palette');
  p.data.copy(strip.data,(y*112+i*16+x)*4,k,k+4);
 }
 fs.writeFileSync(new URL(`spr_mm1_menu_${id}.png`,dir),PNG.sync.write(p));
 originals.push(q);adapted.push(p);manifest.push({id,label,sourceRect:[sx,sy,16,16],colorMap:map,geometry:'14x14 interior preserved in place except four casing inset corners; no scaling/redrawing',state:'unselected'});
}
assert.equal(new Set(adapted.map(p=>p.data.toString('hex'))).size,7);
fs.writeFileSync(new URL('spr_mm1_menu_weapons_adapted_strip7.png',dir),PNG.sync.write(strip));
const font=PNG.sync.read(fs.readFileSync(new URL('Reference/mm5-original-complete-font-reference.png',base))),chars=JSON.parse(fs.readFileSync(new URL('Reference/mm5-original-complete-font-reference.json',base))).chars;
const sheet=new PNG({width:256,height:192});for(let k=0;k<256*192;k++)sheet.data.set(colors[0],k*4);
function text(s,x,y){assert.ok(x+s.length*8<=256);for(let i=0;i<s.length;i++){let f=chars.indexOf(s[i]);assert.ok(f>=0);for(let j=0;j<8;j++)for(let k=0;k<8;k++)if(font.data[(j*font.width+f*8+k)*4+3])sheet.data.set(colors[3],((y+j)*256+x+i*8+k)*4);}}
function blit(p,x,y){for(let j=0;j<16;j++)for(let k=0;k<16;k++){if((j===0||j===15)&&(k===0||k===15))continue;let s=(j*16+k)*4;sheet.data.set(p.data.subarray(s,s+4),((y+j)*256+x+k)*4);}}
text('KINDLYPATRICK ADAPTATION',8,8);text('SOURCE',8,26);text('MM5',64,26);text('WEAPON',112,26);
for(let i=0;i<7;i++){let y=40+i*18;blit(originals[i],24,y);blit(adapted[i],72,y);text(manifest[i].label,112,y+4);}
text('SPRITES BY KINDLYPATRICK',8,176);
fs.writeFileSync(new URL('kindlypatrick-adaptation-review.png',dir),PNG.sync.write(sheet));
const zoom=new PNG({width:1024,height:768});for(let y=0;y<768;y++)for(let x=0;x<1024;x++){let k=(Math.floor(y/4)*256+Math.floor(x/4))*4;zoom.data.set(sheet.data.subarray(k,k+4),(y*1024+x)*4);}
fs.writeFileSync(new URL('kindlypatrick-adaptation-review-4x.png',dir),PNG.sync.write(zoom));
fs.writeFileSync(new URL('adaptation-manifest.json',dir),JSON.stringify({credit:'Sprites by KindlyPatrick',source:'Unmodified user-supplied sheet preserved in Weapon Icon References',classification:'External artwork adaptation, NOT original GB/NES ROM extraction',palette:colors,icons:manifest,status:'Grey icons approved. Selected states provided in Selected/. Manual GMS import not confirmed.'},null,2));
console.log('PASS: seven unique16x16 adaptations;14x14 source-pixel positions and explicit remaps, native casing unchanged, native4-colour palette,112x16 strip, source comparison with credit.');
