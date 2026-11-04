// V2: approved adapted weapon states placed into the review layout. Original approved MM5 font + recovered crops.
// NOT gameplay/GMS resources. Placeholder slots are explicitly documented.
import{PNG}from'pngjs';import fs from'node:fs';import assert from'node:assert/strict';
const root=new URL('../../',import.meta.url),ref=new URL('Assets/Mega Man/MM5/Pause Menu/Reference/',root);
const glyphs=PNG.sync.read(fs.readFileSync(new URL('mm5-original-complete-font-reference.png',ref)));
const chars=JSON.parse(fs.readFileSync(new URL('mm5-original-complete-font-reference.json',ref))).chars;
const native=PNG.sync.read(fs.readFileSync(new URL('docs/pause-menu-reference/mm5-initial-menu.png',root)));
const selectedLabel=process.argv[2]||'R.CUTTER';
assert.ok(['R.CUTTER','M.BUSTER'].includes(selectedLabel));
const variant=selectedLabel==='R.CUTTER'?'cutter-selected':'buster-selected';
const iconBase=new URL('Assets/Mega Man/MM5/Pause Menu/Adapted Weapon Icons/',root);
const busterGray=PNG.sync.read(fs.readFileSync(new URL('mm5-buster-unselected-original.png',ref)));
const ids={'R.CUTTER':'rolling_cutter','I.SLASHER':'ice_slasher','H.BOMB':'hyper_bomb','F.STORM':'fire_storm','T.BEAM':'thunder_beam','S.ARM':'super_arm','M.BEAM':'magnet_beam'};
const out=new PNG({width:256,height:240});for(let k=0;k<256*240;k++)out.data.set([0,0,0,255],k*4);
const white=[255,254,255,255],blue=[21,95,217,255],cyan=[100,176,255,255],muted=[88,112,136,255];
function px(x,y,c){assert.ok(x>=0&&x<256&&y>=0&&y<240);out.data.set(c,(y*256+x)*4);}
function line(x,y,w,h,c){for(let j=0;j<h;j++)for(let i=0;i<w;i++)px(x+i,y+j,c);}
function box(x,y,w,h,c){line(x+2,y,w-4,1,c);line(x+2,y+h-1,w-4,1,c);line(x,y+2,1,h-4,c);line(x+w-1,y+2,1,h-4,c);px(x+1,y+1,c);px(x+w-2,y+1,c);px(x+1,y+h-2,c);px(x+w-2,y+h-2,c);}
function text(s,x,y,col=white){assert.ok(x+s.length*8<=248);for(let i=0;i<s.length;i++){const f=chars.indexOf(s[i]);assert.ok(f>=0,'Missing glyph '+s[i]);for(let j=0;j<8;j++)for(let k=0;k<8;k++){const a=glyphs.data[(j*glyphs.width+f*8+k)*4+3];if(a)px(x+i*8+k,y+j,col);}}}
function crop(sx,sy,w,h,dx,dy){for(let y=0;y<h;y++)for(let x=0;x<w;x++)px(dx+x,dy+y,Array.from(native.data.subarray(((sy+y)*256+sx+x)*4,((sy+y)*256+sx+x)*4+4)));}
function icon(p,x,y){assert.equal(p.width,16);assert.equal(p.height,16);for(let j=0;j<16;j++)for(let i=0;i<16;i++)px(x+i,y+j,Array.from(p.data.subarray((j*16+i)*4,(j*16+i)*4+4)));}
function placeholder(x,y){box(x,y,16,16,muted);line(x+4,y+7,8,1,muted);}
box(8,8,240,224,blue);box(10,10,236,220,white);
line(11,32,234,1,blue);line(11,34,234,1,white);
text('HEALTH',96,19);crop(176,104,56,8,152,18);
text('WEAPONS AND UTILITIES',16,39);
const left=['M.BUSTER','R.CUTTER','I.SLASHER','H.BOMB','F.STORM','T.BEAM'];
const right=['S.ARM','M.BEAM','R.COIL','R.JET','R.MARINE'];
const placements=[];
for(const [column,entries]of[left,right].entries())for(const [row,label]of entries.entries()){
 const x=column===0?16:136,y=52+row*18;placements.push({label,x,y});
 if(label==='M.BUSTER'){if(label===selectedLabel)crop(32,32,16,16,x,y);else icon(busterGray,x,y);}
 else if(ids[label]){const id=ids[label],file=label===selectedLabel?`Selected/spr_mm1_menu_${id}_selected.png`:`spr_mm1_menu_${id}.png`;icon(PNG.sync.read(fs.readFileSync(new URL(file,iconBase))),x,y);}
 else if(label==='R.COIL')crop(144,96,16,16,x,y);else if(label==='R.JET'||label==='R.MARINE'){const id=label==='R.JET'?'jet':'marine';icon(PNG.sync.read(fs.readFileSync(new URL(`../Recovered Utility Icons/spr_mm4_menu_rush_${id}.png`,iconBase))),x,y);}else placeholder(x,y);
 text(label,x+20,y,label===selectedLabel?cyan:white);crop(label===selectedLabel?64:176,label===selectedLabel?40:104,56,8,x+20,y+8);
 if(label===selectedLabel)box(x-3,y-1,111,18,cyan);
}
assert.ok(placements.every(p=>!p.label.includes('. ')),'Compact names without space after period');
assert.equal(placements.length,11);assert.equal(new Set(placements.map(p=>p.label)).size,11);
assert.equal(placements.filter(p=>p.label===selectedLabel).length,1);
// Selection must never paint over this row or its neighbours' icon pixels.
for(const {label,x,y}of placements){
 let expected;
 if(ids[label])expected=PNG.sync.read(fs.readFileSync(new URL(label===selectedLabel?`Selected/spr_mm1_menu_${ids[label]}_selected.png`:`spr_mm1_menu_${ids[label]}.png`,iconBase)));
 else if(label==='M.BUSTER'&&label!==selectedLabel)expected=busterGray;
 else if(label==='R.JET'||label==='R.MARINE')expected=PNG.sync.read(fs.readFileSync(new URL(`../Recovered Utility Icons/spr_mm4_menu_rush_${label==='R.JET'?'jet':'marine'}.png`,iconBase)));
 if(expected)for(let j=0;j<16;j++)assert.deepEqual(out.data.subarray(((y+j)*256+x)*4,((y+j)*256+x+16)*4),expected.data.subarray(j*64,(j+1)*64),'Exact approved icon, selection does not overlap');
}

// Lives belong in the header, NOT the weapons/utilities grid.03 is illustrative only.
crop(208,192,16,16,16,13);text('03',36,19);
for(let y=0;y<16;y++)assert.deepEqual(out.data.subarray(((13+y)*256+16)*4,((13+y)*256+32)*4),native.data.subarray(((192+y)*256+208)*4,((192+y)*256+224)*4),'Original life icon moved without repainting');
for(let y=0;y<8;y++)assert.deepEqual(out.data.subarray(((18+y)*256+152)*4,((18+y)*256+208)*4),native.data.subarray(((104+y)*256+176)*4,((104+y)*256+232)*4),'Health bar untouched');
// Exactly one selected row, not both Buster and Cutter.
line(11,163,234,1,blue);line(11,165,234,1,white);
text('TANKS',16,170);
crop(24,192,16,16,16,182);text('00',36,187);
// W tank: preserve original16x16 M casing, flip ONLY its8x8 letter cell.
const mTank=new PNG({width:16,height:16});for(let j=0;j<16;j++){let start=((192+j)*256+80)*4;native.data.copy(mTank.data,j*64,start,start+64);}
const wTank=new PNG({width:16,height:16});mTank.data.copy(wTank.data);
for(let j=4;j<12;j++)for(let i=4;i<12;i++){let from=((15-j)*16+i)*4;mTank.data.copy(wTank.data,(j*16+i)*4,from,from+4);}
let changed=0;for(let j=0;j<16;j++)for(let i=0;i<16;i++){let k=(j*16+i)*4;if(i<4||i>=12||j<4||j>=12)assert.deepEqual(wTank.data.subarray(k,k+4),mTank.data.subarray(k,k+4),'W casing unchanged');else{let from=((15-j)*16+i)*4;assert.deepEqual(wTank.data.subarray(k,k+4),mTank.data.subarray(from,from+4));}if(!wTank.data.subarray(k,k+4).equals(mTank.data.subarray(k,k+4)))changed++;}
assert.ok(changed>0);fs.writeFileSync(new URL('mm1-w-tank-letter-flip-draft.png',ref),PNG.sync.write(wTank));icon(wTank,88,182);text('00',108,187);
crop(80,192,16,16,160,182);text('00',180,187);
line(11,202,234,1,blue);line(11,204,234,1,white);
box(80,208,96,18,cyan);text('UPGRADES',96,214);
const dir=new URL('Assets/Mega Man/MM5/Pause Menu/Layout Review/',root);fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(new URL(`mm1-custom-pause-layout-v2-${variant}.png`,dir),PNG.sync.write(out));
const zoom=new PNG({width:1024,height:960});for(let y=0;y<960;y++)for(let x=0;x<1024;x++){const i=(Math.floor(y/4)*256+Math.floor(x/4))*4;zoom.data.set(out.data.subarray(i,i+4),(y*1024+x)*4);}
fs.writeFileSync(new URL(`mm1-custom-pause-layout-v2-${variant}-4x.png`,dir),PNG.sync.write(zoom));
fs.writeFileSync(new URL(`layout-v2-${variant}.json`,dir),JSON.stringify({size:[256,240],font:'User-approved larger original MM5 set',selectedLabel,livesDisplay:{icon:[16,13,16,16],count:[36,19],section:'header outside weapons and utilities',example:'03',note:'Illustrative count only; no starting-lives decision or gameplay wiring'},healthDisplay:{label:'HEALTH',labelPosition:[96,19],bar:[152,18,56,8]},placements,originalCrops:{buster:[32,32,16,16],coil:[144,96,16,16],eTank:[24,192,16,16],mTank:[80,192,16,16],life:[208,192,16,16],energy:[176,104,56,8]},placeholders:[],upgradeNavigation:{label:'UPGRADES',button:[80,208,96,18],note:'Visual navigation draft; actual page input not implemented'},scope:'Static layout review only. No inventory ownership, gameplay or controls implemented.'},null,2));
console.log('PASS:256x240 layout,11 unique labels within panel bounds, approved original MM5 glyphs only; approved custom icons placed, exactly one selection, W letter-only flip verified; original Rush icons placed, no placeholders.');
