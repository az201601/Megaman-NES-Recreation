// Pixel-accurate custom layout study. Original approved MM5 font + recovered crops.
// NOT gameplay/GMS resources. Placeholder slots are explicitly documented.
import{PNG}from'pngjs';import fs from'node:fs';import assert from'node:assert/strict';
const root=new URL('../../',import.meta.url),ref=new URL('Assets/Mega Man/MM5/Pause Menu/Reference/',root);
const glyphs=PNG.sync.read(fs.readFileSync(new URL('mm5-original-complete-font-reference.png',ref)));
const chars=JSON.parse(fs.readFileSync(new URL('mm5-original-complete-font-reference.json',ref))).chars;
const native=PNG.sync.read(fs.readFileSync(new URL('./.work/mm5-pause-60.png',import.meta.url)));
const out=new PNG({width:256,height:240});for(let k=0;k<256*240;k++)out.data.set([0,0,0,255],k*4);
const white=[255,254,255,255],blue=[21,95,217,255],cyan=[100,176,255,255],muted=[88,112,136,255];
function px(x,y,c){assert.ok(x>=0&&x<256&&y>=0&&y<240);out.data.set(c,(y*256+x)*4);}
function line(x,y,w,h,c){for(let j=0;j<h;j++)for(let i=0;i<w;i++)px(x+i,y+j,c);}
function box(x,y,w,h,c){line(x+2,y,w-4,1,c);line(x+2,y+h-1,w-4,1,c);line(x,y+2,1,h-4,c);line(x+w-1,y+2,1,h-4,c);px(x+1,y+1,c);px(x+w-2,y+1,c);px(x+1,y+h-2,c);px(x+w-2,y+h-2,c);}
function text(s,x,y,col=white){assert.ok(x+s.length*8<=248);for(let i=0;i<s.length;i++){const f=chars.indexOf(s[i]);assert.ok(f>=0,'Missing glyph '+s[i]);for(let j=0;j<8;j++)for(let k=0;k<8;k++){const a=glyphs.data[(j*glyphs.width+f*8+k)*4+3];if(a)px(x+i*8+k,y+j,col);}}}
function crop(sx,sy,w,h,dx,dy){for(let y=0;y<h;y++)for(let x=0;x<w;x++)px(dx+x,dy+y,Array.from(native.data.subarray(((sy+y)*256+sx+x)*4,((sy+y)*256+sx+x)*4+4)));}
function placeholder(x,y){box(x,y,16,16,muted);line(x+4,y+7,8,1,muted);}
box(8,8,240,224,blue);box(10,10,236,220,white);
line(11,32,234,1,blue);line(11,34,234,1,white);
text('PAUSE',16,19);text('LIFE',112,19);crop(176,104,56,8,152,18);crop(208,192,16,16,224,13);
text('WEAPONS AND UTILITIES',16,39);
const left=['M. BUSTER','R. CUTTER','I. SLASHER','H. BOMB','F. STORM','T. BEAM'];
const right=['S. ARM','M. BEAM','R. COIL','R. JET','R. MARINE'];
const placements=[];
for(const [column,entries]of[left,right].entries())for(const [row,label]of entries.entries()){
 const x=column===0?16:136,y=52+row*18;placements.push({label,x,y});
 if(label==='M. BUSTER')crop(32,32,16,16,x,y);else if(label==='R. COIL')crop(144,96,16,16,x,y);else placeholder(x,y);
 text(label,x+20,y);crop(label==='M. BUSTER'?64:176,label==='M. BUSTER'?40:104,56,8,x+20,y+8);
}
assert.equal(placements.length,11);assert.equal(new Set(placements.map(p=>p.label)).size,11);
box(13,49,111,21,cyan); // selection does not replace any original font/icon pixels
line(11,163,234,1,blue);line(11,165,234,1,white);
text('TANKS',16,170);
crop(24,192,16,16,16,182);text('00',36,187);
placeholder(88,182);text('W',92,186);text('00',108,187);
crop(80,192,16,16,160,182);text('00',180,187);
line(11,202,234,1,blue);line(11,204,234,1,white);
text('E. BALANCER',16,214,muted);box(148,208,92,18,cyan);text('UPGRADES',160,214);
const dir=new URL('Assets/Mega Man/MM5/Pause Menu/Layout Review/',root);fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(new URL('mm1-custom-pause-layout-v1.png',dir),PNG.sync.write(out));
const zoom=new PNG({width:1024,height:960});for(let y=0;y<960;y++)for(let x=0;x<1024;x++){const i=(Math.floor(y/4)*256+Math.floor(x/4))*4;zoom.data.set(out.data.subarray(i,i+4),(y*1024+x)*4);}
fs.writeFileSync(new URL('mm1-custom-pause-layout-v1-4x.png',dir),PNG.sync.write(zoom));
fs.writeFileSync(new URL('layout-v1.json',dir),JSON.stringify({size:[256,240],font:'User-approved larger original MM5 set',placements,originalCrops:{buster:[32,32,16,16],coil:[144,96,16,16],eTank:[24,192,16,16],mTank:[80,192,16,16],life:[208,192,16,16],energy:[176,104,56,8]},placeholders:['six MM1 weapon icons','Magnet Beam icon','Rush Jet and Marine originals pending recovery','W tank original source not verified'],scope:'Static layout review only. No inventory ownership, gameplay or controls implemented.'},null,2));
console.log('PASS:256x240 layout,11 unique labels within panel bounds, approved original MM5 glyphs only; native available icon/bar crops, explicit placeholder metadata.');
