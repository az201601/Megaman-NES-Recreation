// Original custom 16x16 pixel art; NOT recovered MM1 weapon/menu icons.
// Shared casing/background/palette sampled from actual unselected MM5 R.Coil icon.
import{PNG}from'pngjs';import fs from'node:fs';import assert from'node:assert/strict';
const root=new URL('../../',import.meta.url),dir=new URL('Assets/Mega Man/MM5/Pause Menu/Custom Weapon Icons/',root);
fs.mkdirSync(dir,{recursive:true});
const native=PNG.sync.read(fs.readFileSync(new URL('docs/pause-menu-reference/mm5-initial-menu.png',root)));
const colors={'.':[0,0,0,255],d:[102,102,102,255],g:[173,173,173,255],W:[255,254,255,255]};
const source=new PNG({width:16,height:16});for(let y=0;y<16;y++)for(let x=0;x<16;x++)source.data.set(native.data.subarray(((96+y)*256+144+x)*4,((96+y)*256+144+x)*4+4),(y*16+x)*4);
const sprites=[
 {id:'rolling_cutter',label:'R. CUTTER',art:[
 '....WWWW....','..WWgggWW...','.WggWWW.....','WggW........','WgW.........','WgW.........','WgW.........','WggW........','.WggWWW.....','..WWgggWW...','....WWWW....','............']},
 {id:'ice_slasher',label:'I. SLASHER',art:[
 '.....W......','..W..W..W...','...WgWgW....','....WWW.....','WWWWgggWWWWW','...WgggW....','...WgggW....','WWWWgggWWWWW','....WWW.....','...WgWgW....','..W..W..W...','.....W......']},
 {id:'hyper_bomb',label:'H. BOMB',art:[
 '........W.W.','.......WgW..','......W..W..','.....WW.....','...WWggWW...','..WggWgggW..','.WggWWggggW.','.WggggggggW.','.WggggggggW.','..WggggggW..','...WggggW...','....WWWW....']},
 {id:'fire_storm',label:'F. STORM',art:[
 '......W.....','.....WgW....','.....WgW....','..W.WggW....','..WWgggWW...','.WgggggggW..','.WgggWgggW..','WgggWgWgggW.','WggWgggWggW.','WggWgggWggW.','.WggWWWggW..','..WWgggWW...']},
 {id:'thunder_beam',label:'T. BEAM',art:[
 '.....WWWWW..','....WgggW...','...WgggW....','..WgggW.....','.WggggWWWW..','.WWWWgggW...','....WggW....','...WggW.....','..WggW......','.WggW.......','..WW........','..W.........']},
 {id:'super_arm',label:'S. ARM',art:[
 '..WWWWWWWW..','.WggWggWggW.','.WggWggWggW.','.WggWggWggW.','.WWWWWWWWWW.','.WggggggggW.','WggWWWWgggW.','WggWggggggW.','.WgWggggggW.','..WggggggW..','...WggggW...','...WWWWWW...']},
 {id:'magnet_beam',label:'M. BEAM',art:[
 'WW...WW.....','WgW.WgW.....','WgW.WgW.....','WgggggW.....','.WWWWW......','............','WWWWWWWWWWWW','WggWggWggWgW','WWWWWWWWWWWW','............','..W......W..','.WWWWWWWWWW.']}
];
const casing=new PNG({width:16,height:16});source.data.copy(casing.data);
for(let k=0;k<256;k++)if(casing.data[k*4]===255)casing.data.set(colors['.'],k*4); // remove original R/C lettering only
const strip=new PNG({width:112,height:16});
for(const [i,s]of sprites.entries()){
 assert.equal(s.art.length,12);assert.ok(s.art.every(r=>r.length===12));const p=new PNG({width:16,height:16});casing.data.copy(p.data);
 for(let y=0;y<12;y++)for(let x=0;x<12;x++){const c=s.art[y][x];assert.ok(c in colors);p.data.set(colors[c],((y+2)*16+x+2)*4);}
 for(let y=0;y<16;y++)for(let x=0;x<16;x++){
  const k=(y*16+x)*4;assert.ok(Object.values(colors).some(c=>c.every((v,j)=>v===p.data[k+j])));
  if(x<2||x>=14||y<2||y>=14)assert.deepEqual(p.data.subarray(k,k+4),source.data.subarray(k,k+4),'Original casing untouched');
  p.data.copy(strip.data,(y*112+i*16+x)*4,k,k+4);
 }
 s.pixels=p;fs.writeFileSync(new URL('spr_mm1_menu_'+s.id+'.png',dir),PNG.sync.write(p));
}
assert.equal(new Set(sprites.map(s=>s.pixels.data.toString('hex'))).size,7);
fs.writeFileSync(new URL('spr_mm1_menu_custom_weapons_strip7.png',dir),PNG.sync.write(strip));
const font=PNG.sync.read(fs.readFileSync(new URL('Assets/Mega Man/MM5/Pause Menu/Reference/mm5-original-complete-font-reference.png',root)));
const chars=JSON.parse(fs.readFileSync(new URL('Assets/Mega Man/MM5/Pause Menu/Reference/mm5-original-complete-font-reference.json',root))).chars;
const sheet=new PNG({width:256,height:176});for(let k=0;k<256*176;k++)sheet.data.set(colors['.'],k*4);
function text(str,x,y){for(let i=0;i<str.length;i++){let f=chars.indexOf(str[i]);assert.ok(f>=0);for(let j=0;j<8;j++)for(let k=0;k<8;k++)if(font.data[(j*font.width+f*8+k)*4+3])sheet.data.set(colors.W,((y+j)*256+x+i*8+k)*4);}}
function blit(p,x,y){for(let j=0;j<16;j++)p.data.copy(sheet.data,((y+j)*256+x)*4,j*64,(j+1)*64);}
text('WEAPON ICON REVIEW',16,10);
for(let i=0;i<8;i++){let x=i%2?136:16,y=36+Math.floor(i/2)*28;blit(i===7?source:sprites[i].pixels,x,y);text(i===7?'ORIG. COIL':sprites[i].label,x+20,y+4);}
text('DRAFT . NO GMS IMPORT',16,160);
fs.writeFileSync(new URL('custom-weapon-icons-review.png',dir),PNG.sync.write(sheet));
const big=new PNG({width:1024,height:704});for(let y=0;y<704;y++)for(let x=0;x<1024;x++){let k=(Math.floor(y/4)*256+Math.floor(x/4))*4;big.data.set(sheet.data.subarray(k,k+4),(y*1024+x)*4);}
fs.writeFileSync(new URL('custom-weapon-icons-review-4x.png',dir),PNG.sync.write(big));
fs.writeFileSync(new URL('icon-manifest.json',dir),JSON.stringify({status:'Custom draft. User approval pending. Not original ROM weapon art.',size:[16,16],order:sprites.map(({id,label})=>({id,label})),palette:colors,sourceCasing:'Original MM5 unselected R.Coil cropped at144,96 from docs/pause-menu-reference/mm5-initial-menu.png',selectedStates:'Not yet prepared; shapes reviewed first.'},null,2));
console.log('PASS:7 unique16x16 icons, four native colours, original casing unchanged,112x16 strip order verified; native/4x review with original Coil reference.');
