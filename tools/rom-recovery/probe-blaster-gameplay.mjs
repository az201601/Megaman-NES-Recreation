import fs from'node:fs';import assert from'node:assert/strict';import{NES,Controller as C}from'jsnes';import{createHash}from'node:crypto';
const root=new URL('../../',import.meta.url),work=new URL('./.work/',import.meta.url),out=new URL('Assets/Enemies/MM1/Blaster/Reference/',root),rom=fs.readFileSync(new URL('Mega Man (USA).nes',root));
const fixed=a=>rom[16+7*16384+a-0xc000],bank6=a=>rom[16+6*16384+a-0x8000];
function model(s){let {state,timer}=s,shot=-1;timer=(timer+1)&255;if(state<0x40){if(state<0x30){if(timer<77)state=0;}else{if(state===0x30)timer=0;if((timer&31)===0)shot=timer>>5;state=timer===96?0x40:0x31;}}else if(state>=0x60){state=0;timer=0;}if((state&15)<6)state++;else state=(state&240)<0x60?(state&240)+16:0;return{state,timer,shot};}
// Rebuild the controlled snapshot from the reproducible original stage state.
const approach=new NES({emulateSound:false});approach.loadROM(rom.toString('binary'));
approach.fromJSON(JSON.parse(fs.readFileSync(new URL('mm1-stage.json',work))));
for(let b=0;b<8;b++)approach.buttonUp(1,b);approach.buttonDown(1,C.BUTTON_RIGHT);let stopped=false;
for(let f=1;f<=500;f++){const m=approach.cpu.mem;m[0x600]=36;m[0x620]=m[0x660]=m[0x680]=0;m[0x55]=100;if(!stopped&&m[0x480]+256*m[0x460]>=760){approach.buttonUp(1,C.BUTTON_RIGHT);stopped=true;}approach.frame();}
const safeSnapshot=approach.toJSON();
const trials=[],spans=[];const add=(bank,cpu,length)=>{const offset=16+bank*16384+(cpu&(bank===7?0x3fff:0x3fff));spans.push({offset,hex:rom.subarray(offset,offset+length).toString('hex')});};
for(const type of[11,23,34,35]){
 const n=new NES({emulateSound:false});n.loadROM(rom.toString('binary'));n.fromJSON(structuredClone(safeSnapshot));for(let b=0;b<8;b++)n.buttonUp(1,b);
 const m=n.cpu.mem;m[0x6f0]=type;m[0x430]=bank6(0xa380+type);m[0x650]=bank6(0xa40c+type);m[0x450]=1;
 const rows=[],requests=[],bullets=[];let f=0;const em=n.cpu.emulate.bind(n.cpu);n.cpu.emulate=()=>{const pc=n.cpu.REG_PC+1,x=n.cpu.REG_X;
 if(pc===0xaf26&&x===16)rows.push({f,state:m[0x450],timer:m[0x650]});
 if(pc===0xf533&&m[0x6e0+x]===45)requests.push({f,index:n.cpu.REG_Y,x:m[0x480+x]+256*m[0x460+x],y:m[0x600+x],flags:m[0x420+x]});
 if(pc===0xb6c3&&m[0x6e0+x]===45)bullets.push({f,slot:x,x:m[0x480+x]+256*m[0x460+x]+m[0x4a0+x]/256,y:m[0x600+x]+m[0x620+x]/256,vx:m[0x4c0+x]+m[0x4e0+x]/256,vy:(m[0x680+x]*256+m[0x660+x])<<16>>16,flags:m[0x420+x]});return em();};
 for(f=0;f<600;f++){m[0x600]=36;m[0x620]=m[0x660]=m[0x680]=0;m[0x55]=100;n.frame();}
 let checked=0;for(let i=0;i<rows.length-1;i++){const p=model(rows[i]);assert.equal(p.state,rows[i+1].state);assert.equal(p.timer,rows[i+1].timer);if(p.shot>=0)assert.ok(requests.some(r=>r.f===rows[i].f&&r.index===12+p.shot*4));checked++;}
 let moves=0;const old=new Map();for(const b of bullets){const p=old.get(b.slot);if(p&&b.f===p.f+1&&b.flags===p.flags&&b.vx===p.vx&&b.vy===p.vy&&Math.abs(b.y-p.y)<100){assert.equal(b.x-p.x,(p.flags&64?1:-1)*p.vx);assert.equal(b.y-p.y,-p.vy/256);moves++;}old.set(b.slot,b);}
 assert.ok(checked>590&&moves>50);assert.equal(requests[0].flags&64,type===23||type===35?64:0);trials.push({type,flags:bank6(0xa380+type),initialTimer:bank6(0xa40c+type),checked,moves,firstFour:requests.slice(0,4),states:rows.slice(0,210)});
 add(6,0xa380+type,1);add(6,0xa40c+type,1);
}
const speeds=Array.from({length:4},(_,i)=>{const a=0xf54c+12+4*i;return{index:12+4*i,vyRaw:(fixed(a)|fixed(a+1)<<8)<<16>>16,vxRaw:fixed(a+2)|fixed(a+3)<<8};});assert.deepEqual(speeds.map(s=>[s.vxRaw,s.vyRaw]),[[556,556],[783,104],[783,-104],[556,-556]]);
const tables=[11,23,34,35,45].map(type=>({type,width:fixed(0xfb38+type),height:fixed(0xfc06+type),bodyDamage:fixed(0xfe89+type),basicDamage:fixed(0xfc51+type)}));for(const v of tables){assert.equal(v.width,v.type===45?1:2);assert.equal(v.height,v.type===45?1:8);assert.equal(v.bodyDamage,v.type===45?2:1);assert.equal(v.basicDamage,v.type===45?0:20);for(const a of[0xfb38,0xfc06,0xfe89,0xfc51])add(7,a+v.type,1);}add(7,0xf558,16);
fs.writeFileSync(new URL('native-blaster-gameplay.json',out),JSON.stringify({method:'Supplied USA ROM. Controlled safe stationary first-gun snapshot; variant type/flags/initialtimer assigned from original bank6 spawn defaults, state1. Original AI/bullet code unmodified.600updates pervariant. Exact fullanimationbyte/timer and successive bulletpositions compared against independent model. Tables are originalCPU half extents/damage, not GMS masks. MM5 player/charged shot adaptation remains separate.',romSha256:createHash('sha256').update(rom).digest('hex'),trials,speeds,tables,spans},null,2)+'\n');console.log('PASS',trials.map(t=>({type:t.type,AI:t.checked,projectileMoves:t.moves,firstShot:t.firstFour[0]})),speeds,tables);
