// Coloured selection states adapted from KindlyPatrick's supplied artwork.
// Source positions preserved, explicit NES palette maps; existing grey files read-only.
import{PNG}from'pngjs';import fs from'node:fs';import assert from'node:assert/strict';import{createHash}from'node:crypto';
const root=new URL('../../',import.meta.url),base=new URL('Assets/Mega Man/MM5/Pause Menu/',root),grayDir=new URL('Adapted Weapon Icons/',base),dir=new URL('Selected/',grayDir);
fs.mkdirSync(dir,{recursive:true});
const palette=JSON.parse(fs.readFileSync(new URL('./palettes/mesen-0.9.9-default.json',import.meta.url))).colors;
const rgba=index=>{let v=parseInt(palette[index],16);return[v>>16&255,v>>8&255,v&255,255];};
const sheet=PNG.sync.read(fs.readFileSync(new URL('Weapon Icon References/kindlypatrick-user-supplied-sheet.png',base)));
const specs=[
 ['rolling_cutter','R. CUTTER',8,0x3d,{'112,112,112':0x00,'184,184,184':0x3d,'255,255,255':0x30,'0,0,0':0x0f}],
 ['ice_slasher','I. SLASHER',2,0x31,{'87,145,248':0x21,'255,255,255':0x30,'0,0,0':0x0f}],
 ['hyper_bomb','H. BOMB',1,0x1b,{'0,144,56':0x1b,'176,248,200':0x3b,'255,255,255':0x30,'0,0,0':0x0f}],
 ['fire_storm','F. STORM',3,0x27,{'216,40,0':0x16,'248,151,56':0x27,'248,216,168':0x37,'0,0,0':0x0f}],
 ['thunder_beam','T. BEAM',5,0x27,{'112,112,112':0x00,'240,183,56':0x27,'255,255,255':0x30,'0,0,0':0x0f}],
 ['super_arm','S. ARM',7,0x27,{'200,72,8':0x16,'248,216,168':0x37,'0,0,0':0x0f}],
 ['magnet_beam','M. BEAM',9,0x21,{'0,113,232':0x11,'55,185,248':0x21,'255,255,255':0x30,'0,0,0':0x0f}]
];
const casing=(x,y)=>x===0||x===15||y===0||y===15||((x===1||x===14)&&(y===1||y===14));
const hash=b=>createHash('sha256').update(b).digest('hex'),originalHashes=[],grays=[],selected=[],manifest=[];
const strip=new PNG({width:112,height:16}),states=new PNG({width:224,height:16});
for(const[i,[id,label,column,accent,map]]of specs.entries()){
 if(id==='rolling_cutter'){assert.equal(accent,0x3d,'Original Cutter casing must remain grey');assert.deepEqual(map,{'112,112,112':0x00,'184,184,184':0x3d,'255,255,255':0x30,'0,0,0':0x0f},'Original source greys, not gold or removed fill');}
 const path=new URL(`spr_mm1_menu_${id}.png`,grayDir),data=fs.readFileSync(path),gray=PNG.sync.read(data),color=new PNG({width:16,height:16});originalHashes.push([path,hash(data)]);
 assert.equal(gray.width,16);assert.equal(gray.height,16);
 for(let y=0;y<16;y++)for(let x=0;x<16;x++){
  let k=(y*16+x)*4,expected;
  if(casing(x,y))expected=gray.data[k]===0?rgba(0x0f):rgba(accent);
  else{let s=((4+y)*sheet.width+13+17*column+x)*4,key=Array.from(sheet.data.subarray(s,s+3)).join(',');assert.ok(key in map,id+' source color '+key);expected=rgba(map[key]);if(id==='rolling_cutter'&&key==='112,112,112')assert.notDeepEqual(expected,rgba(0x0f),'Original filled background must not be removed');}
  color.data.set(expected,k);assert.deepEqual(Array.from(color.data.subarray(k,k+4)),expected);
  color.data.copy(strip.data,(y*112+i*16+x)*4,k,k+4);
  gray.data.copy(states.data,(y*224+i*32+x)*4,k,k+4);color.data.copy(states.data,(y*224+i*32+16+x)*4,k,k+4);
 }
 const used=new Set(Array.from({length:256},(_,k)=>color.data.subarray(k*4,k*4+4).toString('hex')));
 assert.ok(used.size<=4,'One4-colour NES-style palette per icon');assert.notDeepEqual(color.data,gray.data);
 for(let k=0;k<256;k++){assert.equal(color.data[k*4+3],gray.data[k*4+3]);assert.ok(palette.some((_,i)=>rgba(i).every((v,j)=>v===color.data[k*4+j])));}
 fs.writeFileSync(new URL(`spr_mm1_menu_${id}_selected.png`,dir),PNG.sync.write(color));grays.push(gray);selected.push(color);
 manifest.push({id,label,accentNES:accent,sourceColumn:column,sourceColorToNES:map,uniqueColors:used.size,grayFrame:i*2,selectedFrame:i*2+1});
}
for(const[path,digest]of originalHashes)assert.equal(hash(fs.readFileSync(path)),digest,'Existing grey files unchanged');
assert.equal(new Set(selected.map(p=>p.data.toString('hex'))).size,7);
fs.writeFileSync(new URL('spr_mm1_menu_weapons_selected_strip7.png',dir),PNG.sync.write(strip));
fs.writeFileSync(new URL('spr_mm1_menu_weapons_states_strip14.png',dir),PNG.sync.write(states));
const font=PNG.sync.read(fs.readFileSync(new URL('Reference/mm5-original-complete-font-reference.png',base))),chars=JSON.parse(fs.readFileSync(new URL('Reference/mm5-original-complete-font-reference.json',base))).chars;
const review=new PNG({width:256,height:192});for(let i=0;i<256*192;i++)review.data.set(rgba(0x0f),i*4);
function text(s,x,y){assert.ok(x+s.length*8<=256);for(let i=0;i<s.length;i++){let f=chars.indexOf(s[i]);assert.ok(f>=0);for(let j=0;j<8;j++)for(let k=0;k<8;k++)if(font.data[(j*font.width+f*8+k)*4+3])review.data.set(rgba(0x30),((y+j)*256+x+i*8+k)*4);}}
function blit(p,x,y){for(let j=0;j<16;j++)p.data.copy(review.data,((y+j)*256+x)*4,j*64,(j+1)*64);}
text('WEAPON SELECTION STATES',8,8);text('GRAY',16,26);text('COLOUR',72,26);text('WEAPON',128,26);
for(let i=0;i<7;i++){let y=40+i*18;blit(grays[i],24,y);blit(selected[i],80,y);text(manifest[i].label,128,y+4);}
text('ADAPTED FROM KINDLYPATRICK',8,176);
fs.writeFileSync(new URL('weapon-states-review.png',dir),PNG.sync.write(review));
const large=new PNG({width:1024,height:768});for(let y=0;y<768;y++)for(let x=0;x<1024;x++){let k=(Math.floor(y/4)*256+Math.floor(x/4))*4;large.data.set(review.data.subarray(k,k+4),(y*1024+x)*4);}
fs.writeFileSync(new URL('weapon-states-review-4x.png',dir),PNG.sync.write(large));
// Verify final combined image pairs byte-for-byte, not just dimensions.
const decoded=PNG.sync.read(fs.readFileSync(new URL('spr_mm1_menu_weapons_states_strip14.png',dir)));
for(let i=0;i<7;i++)for(let y=0;y<16;y++){assert.deepEqual(decoded.data.subarray((y*224+i*32)*4,(y*224+i*32+16)*4),grays[i].data.subarray(y*64,(y+1)*64));assert.deepEqual(decoded.data.subarray((y*224+i*32+16)*4,(y*224+i*32+32)*4),selected[i].data.subarray(y*64,(y+1)*64));}
fs.writeFileSync(new URL('selected-manifest.json',dir),JSON.stringify({credit:'Weapon-menu icons adapted from artwork by KindlyPatrick',status:'Selected colour draft pending approval. Grey designated unhighlighted by user. No GMS imports/code changes.',paletteSource:'Mesen0.9.9 default2C02, pinned local palette',classification:'Custom palette adaptation of supplied artwork, NOT original GB/NES selected sprites',dimensions:[16,16],statesOrder:'Per weapon: gray,selected; seven weapons in listed order',icons:manifest},null,2));
console.log('PASS:7 selected states, native Mesen colors only,max4 colors per icon; original gray files unchanged; casing/alpha preserved; same-position source mapping;14-frame PNG pairs verified.');
