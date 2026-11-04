// Static icon-grid + selected-item description concept. Not GMS input/inventory code.
import{PNG}from'pngjs';import fs from'node:fs';import assert from'node:assert/strict';
const root=new URL('../../',import.meta.url),base=new URL('Assets/Mega Man/MM5/Pause Menu/',root),dir=new URL('Layout Review/',base);
const source=PNG.sync.read(fs.readFileSync(new URL('mm1-custom-pause-layout-v2-cutter-selected.png',dir))),out=new PNG({width:256,height:240});source.data.copy(out.data);
const font=PNG.sync.read(fs.readFileSync(new URL('Reference/mm5-original-complete-font-reference.png',base))),chars=JSON.parse(fs.readFileSync(new URL('Reference/mm5-original-complete-font-reference.json',base))).chars;
const black=[0,0,0,255],white=[255,254,255,255],blue=[21,95,217,255],cyan=[100,176,255,255];
function px(x,y,c){assert.ok(x>=0&&x<256&&y>=0&&y<240);out.data.set(c,(y*256+x)*4);}
function line(x,y,w,h,c){for(let j=0;j<h;j++)for(let i=0;i<w;i++)px(x+i,y+j,c);}
function box(x,y,w,h,c){line(x+2,y,w-4,1,c);line(x+2,y+h-1,w-4,1,c);line(x,y+2,1,h-4,c);line(x+w-1,y+2,1,h-4,c);for(const [i,j]of[[1,1],[w-2,1],[1,h-2],[w-2,h-2]])px(x+i,y+j,c);}
function text(s,x,y,c=white){assert.ok(x+s.length*8<=240);for(let i=0;i<s.length;i++){let f=chars.indexOf(s[i]);assert.ok(f>=0);for(let j=0;j<8;j++)for(let k=0;k<8;k++)if(font.data[(j*font.width+f*8+k)*4+3])px(x+i*8+k,y+j,c);}}
// Retain exact header and outer frame; clear all weapon/tank contents for separate page.
line(11,35,234,194,black);text('UPGRADES',96,39);
const item={state:'selected',iconSource:'Adapted Upgrade Icons/spr_mm6_menu_energy_balancer_selected.png',id:'energy_balancer',name:'ENERGY BALANCER',icon:[32,64,16,16],selection:[24,56,32,32],description:['ROUTES SPARE WEAPON','ENERGY TO THE WEAPON','WITH THE LOWEST ENERGY.']};
const eb=PNG.sync.read(fs.readFileSync(new URL('Adapted Upgrade Icons/spr_mm6_menu_energy_balancer_selected.png',base)));
box(...item.selection,cyan);for(let y=0;y<16;y++)eb.data.copy(out.data,((64+y)*256+32)*4,y*64,(y+1)*64);
box(16,112,224,84,blue);text(item.name,24,122,cyan);item.description.forEach((s,i)=>text(s,24,146+i*14));
line(11,202,234,1,blue);line(11,204,234,1,white);box(80,208,96,18,cyan);text('WEAPONS',100,214);
for(let y=0;y<16;y++)assert.deepEqual(out.data.subarray(((64+y)*256+32)*4,((64+y)*256+48)*4),eb.data.subarray(y*64,(y+1)*64),'Exact selected-state PNG, custom palette on original MM6 shape');
for(let y=0;y<35;y++)assert.deepEqual(out.data.subarray(y*1024,(y+1)*1024),source.data.subarray(y*1024,(y+1)*1024),'Header unchanged');
for(let y=229;y<240;y++)assert.deepEqual(out.data.subarray(y*1024,(y+1)*1024),source.data.subarray(y*1024,(y+1)*1024),'Bottom frame unchanged');
fs.writeFileSync(new URL('mm1-custom-upgrades-layout-v1.png',dir),PNG.sync.write(out));const big=new PNG({width:1024,height:960});for(let y=0;y<960;y++)for(let x=0;x<1024;x++){let k=((y>>2)*256+(x>>2))*4;big.data.set(out.data.subarray(k,k+4),(y*1024+x)*4);}fs.writeFileSync(new URL('mm1-custom-upgrades-layout-v1-4x.png',dir),PNG.sync.write(big));
fs.writeFileSync(new URL('upgrades-layout-v1.json',dir),JSON.stringify({size:[256,240],selectedItem:item.id,items:[item],descriptionPanel:[16,112,224,84],status:'Static review only. Cursor-driven descriptions proposed, not implemented. Description copy draft, not final gameplay specification. No speculative upgrades added.',navigation:'UPGRADES on main page; WEAPONS on upgrades page; input keys undecided.'},null,2));console.log('PASS: separate256x240 upgrades page, selected blue/cyan icon exact, same header, selected-item description fits approved MM5 font, exact4x review.');
