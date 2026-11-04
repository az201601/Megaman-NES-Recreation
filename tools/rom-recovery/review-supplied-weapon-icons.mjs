// User-supplied sheet credited BY KINDLYPATRICK. Unmodified crops, NOT ROM extraction.
import{PNG}from'pngjs';import fs from'node:fs';import assert from'node:assert/strict';
const root=new URL('../../',import.meta.url),dir=new URL('Assets/Mega Man/MM5/Pause Menu/Weapon Icon References/',root);
const src=PNG.sync.read(fs.readFileSync(new URL('kindlypatrick-user-supplied-sheet.png',dir)));assert.equal(src.width,227);assert.equal(src.height,253);
const list=[['R. CUTTER',8],['I. SLASHER',2],['H. BOMB',1],['F. STORM',3],['T. BEAM',5],['S. ARM',7],['M. BEAM',9]];
const font=PNG.sync.read(fs.readFileSync(new URL('Assets/Mega Man/MM5/Pause Menu/Reference/mm5-original-complete-font-reference.png',root)));
const chars=JSON.parse(fs.readFileSync(new URL('Assets/Mega Man/MM5/Pause Menu/Reference/mm5-original-complete-font-reference.json',root))).chars;
const review=new PNG({width:256,height:176});for(let i=0;i<256*176;i++)review.data.set([0,0,0,255],i*4);
function text(s,x,y){for(let i=0;i<s.length;i++){let f=chars.indexOf(s[i]);assert.ok(f>=0);for(let j=0;j<8;j++)for(let k=0;k<8;k++)if(font.data[(j*font.width+f*8+k)*4+3])review.data.set([255,254,255,255],((y+j)*256+x+i*8+k)*4);}}
text('SUPPLIED ICON REVIEW',16,10);
const manifest=[];
for(const [i,[label,index]]of list.entries()){
 const x=13+index*17,y=4,icon=new PNG({width:16,height:16});
 for(let j=0;j<16;j++){let start=((y+j)*src.width+x)*4;src.data.copy(icon.data,j*64,start,start+64);assert.deepEqual(icon.data.subarray(j*64,(j+1)*64),src.data.subarray(start,start+64));}
 const rx=i%2?136:16,ry=36+Math.floor(i/2)*28;
 for(let j=0;j<16;j++)for(let k=0;k<16;k++){
  const start=(j*16+k)*4,c=icon.data.subarray(start,start+4);
  // Only review composition masks the four sheet-background corner pixels.
  if((j===0||j===15)&&(k===0||k===15))continue;
  review.data.set(c,((ry+j)*256+rx+k)*4);
 }
 text(label,rx+20,ry+4);
 manifest.push({label,sourceRect:[x,y,16,16],row:0,column:index,identification:'Proposed from sheet appearance; user confirmation pending'});
}
text('BY KINDLYPATRICK',16,156);
fs.writeFileSync(new URL('supplied-seven-icons-review.png',dir),PNG.sync.write(review));
const large=new PNG({width:1024,height:704});for(let y=0;y<704;y++)for(let x=0;x<1024;x++){let i=(Math.floor(y/4)*256+Math.floor(x/4))*4;large.data.set(review.data.subarray(i,i+4),(y*1024+x)*4);}
fs.writeFileSync(new URL('supplied-seven-icons-review-4x.png',dir),PNG.sync.write(large));
fs.writeFileSync(new URL('source-identification.json',dir),JSON.stringify({credit:'KindlyPatrick, as written on user-supplied sheet',source:'User attachment image-1.png',classification:'External supplied reference; game/ROM provenance NOT verified',status:'Review only, no game assets replaced',icons:manifest},null,2));
console.log('PASS: seven16x16 source crops byte-identical; source credit retained; labelled4x review only.');
