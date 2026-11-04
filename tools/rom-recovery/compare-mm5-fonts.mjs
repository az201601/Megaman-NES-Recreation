// Natural MM5 password-screen validation of other original font; no redrawn letters.
import{NES,Controller}from'jsnes';import{PNG}from'pngjs';import fs from'node:fs';import assert from'node:assert/strict';
import{mesenRgbFromJsnes}from'./mesen-palette.mjs';
const root=new URL('../../',import.meta.url),work=new URL('./.work/',import.meta.url),rom=fs.readFileSync(new URL('Mega Man 5 (USA).nes',root)),chr=16+rom[4]*16384;
let frame;const n=new NES({onFrame:p=>frame=p.slice()});n.loadROM(rom.toString('binary'));
const tick=k=>{for(let i=0;i<k;i++)n.frame();};const press=b=>{n.buttonDown(1,b);tick(1);n.buttonUp(1,b);};
tick(900);press(Controller.BUTTON_START);tick(300);press(Controller.BUTTON_DOWN);tick(3);press(Controller.BUTTON_START);tick(90);
const screen=new PNG({width:256,height:240});for(let k=0;k<frame.length;k++){const v=mesenRgbFromJsnes(frame[k]);screen.data.set([v&255,v>>8&255,v>>16&255,255],k*4);}fs.writeFileSync(new URL('mm5-password-font.png',work),PNG.sync.write(screen));
const bits=t=>Array.from({length:64},(_,k)=>((rom[chr+t*16+(k>>3)]|rom[chr+t*16+8+(k>>3)])&(128>>(k&7)))?1:0);
const matches={};for(const c of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'){
 const data=bits(0x3400+c.charCodeAt(0));matches[c]=Array.from({length:512},(_,i)=>i).filter(i=>Array.from(n.ppu.ptTile[i].pix,v=>v?1:0).every((v,k)=>v===data[k]));
}
console.log('Password loaded matches:',matches);
const nts=n.ppu.nameTable.map(nt=>Array.from(nt.tile));
console.log('F candidates used in nametables:',matches.F.filter(i=>i<256).map(i=>({tile:i,count:nts.flat().filter(t=>t===i).length})));
fs.writeFileSync(new URL('mm5-password-font-match.json',work),JSON.stringify({matches,nts},null,2));
// All26 original larger glyphs are loaded at ASCII41..5A in natural password PPU.
for(const c of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')assert.ok(matches[c].includes(c.charCodeAt(0)));
const raw=t=>bits(t);for(const [i,c]of[...'WEAPONSGYR'].entries())assert.deepEqual(raw(0x3360+i),raw(0x3400+c.charCodeAt(0)),'Larger alphabet matches original pause-heading '+c);
const compactOrder='ABCDEGHIJKLMNORSTUWYVP',compact=Object.fromEntries([...compactOrder].map((c,i)=>[c,0x33e0+i]));
const complete=Object.fromEntries([...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map(c=>[c,0x3400+c.charCodeAt(0)]));
for(let i=0;i<10;i++){compact[String(i)]=complete[String(i)]=0x33b0+i;}
compact[' ']=complete[' ']=0x3300;assert.ok(raw(0x3300).every(v=>v===0));
compact['.']=complete['.']=0x335e;
const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .';
const font=new PNG({width:8*chars.length,height:8});const white=[255,254,255,255];
function plot(target,x,y,rgba){assert.ok(x>=0&&x<target.width&&y>=0&&y<target.height);target.data.set(rgba,(y*target.width+x)*4);}
function text(target,str,x,y,map){for(const [i,c]of[...str].entries()){assert.ok(c in map,'Unmapped original character '+c);const data=raw(map[c]);for(let k=0;k<64;k++)if(data[k])plot(target,x+i*8+k%8,y+(k>>3),white);}}
for(const [i,c]of[...chars].entries())text(font,c,i*8,0,complete);
const preview=new PNG({width:256,height:176});for(let k=0;k<256*176;k++)preview.data.set([0,0,0,255],k*4);
function line(x,y,w,h,col){for(let j=0;j<h;j++)for(let i=0;i<w;i++)plot(preview,x+i,y+j,col);}
const blue=[21,95,217,255],cyan=[100,176,255,255];line(8,8,240,1,cyan);line(8,8,1,160,blue);line(247,8,1,160,blue);line(8,167,240,1,blue);
text(preview,'MM5 FONT COMPARISON',16,16,complete);
text(preview,'COMPACT MENU LETTERS',16,36,complete);
text(preview,'M. BUSTER',24,52,compact);text(preview,'R. CUTTER',136,52,compact);
text(preview,'ABC E  M  R  W',24,68,compact);
line(16,86,224,1,blue);
text(preview,'OTHER ORIGINAL MM5 SET',16,98,complete);
text(preview,'M. BUSTER',24,114,complete);text(preview,'R. CUTTER',136,114,complete);
text(preview,'F. STORM',24,132,complete);text(preview,'EQUIPMENT',136,132,complete);
text(preview,'NO CUSTOM GLYPHS',24,150,complete);
const dir=new URL('Assets/Mega Man/MM5/Pause Menu/Reference/',root);
fs.writeFileSync(new URL('mm5-font-comparison.png',dir),PNG.sync.write(preview));
const zoom=new PNG({width:1024,height:704});for(let y=0;y<zoom.height;y++)for(let x=0;x<zoom.width;x++){const i=(Math.floor(y/4)*256+Math.floor(x/4))*4;zoom.data.set(preview.data.subarray(i,i+4),(y*1024+x)*4);}
fs.writeFileSync(new URL('mm5-font-comparison-4x.png',dir),PNG.sync.write(zoom));
fs.writeFileSync(new URL('mm5-original-complete-font-reference.png',dir),PNG.sync.write(font));
const bounds=t=>{const p=raw(t),xs=p.map((v,k)=>v?k%8:-1).filter(v=>v>=0),ys=p.map((v,k)=>v?k>>3:-1).filter(v=>v>=0);return {left:Math.min(...xs),top:Math.min(...ys),width:Math.max(...xs)-Math.min(...xs)+1,height:Math.max(...ys)-Math.min(...ys)+1};};
const report={chars,cell:[8,8],compactA:bounds(compact.A),largerA:bounds(complete.A),missingOriginalSources:Object.fromEntries([...'FQXZ'].map(c=>[c,{chrTile:complete[c],romOffset:chr+16*complete[c],bounds:bounds(complete[c])}])),complete:Object.fromEntries([...chars].map(c=>[c,{chrTile:complete[c],romOffset:chr+16*complete[c]}])),note:'All original MM5 masks. Larger letters match pause heading and password-loaded alphabet. Digits/space/period from original compact-menu/counter data. Different from compact labels: user review before adoption.'};
fs.writeFileSync(new URL('mm5-original-complete-font-reference.json',dir),JSON.stringify(report,null,2));
console.log('PASS: complete original uppercase alphabet loaded on password screen;10 menu-heading glyphs exact match; F/Q/X/Z original ROM sources. CompactA',report.compactA,'largerA',report.largerA);
