// Original-ROM dispenser/launch research. Controlled positioning is explicit.
import fs from'node:fs';import assert from'node:assert/strict';import{createHash}from'node:crypto';import{NES}from'jsnes';
const root=new URL('../../',import.meta.url),work=new URL('./.work/',import.meta.url),out=new URL('Assets/Enemies/MM1/Super Cutter/Reference/',root),rom=fs.readFileSync(new URL('Mega Man (USA).nes',root));
const spans=[];for(const[file,lo,hi]of[['mm1-bank5.s',0x176c3,0x176c6],['mm1-bank5.s',0x17ec8,0x17ee8],['mm1-bank7.s',0x1da19,0x1da1b],['mm1-bank5.s',0x176cf,0x1770e],['mm1-bank7.s',0x1c5ac,0x1c5d4],['mm1-bank7.s',0x1f63b,0x1f662]])for(const m of fs.readFileSync(new URL(file,work),'utf8').matchAll(/\/\* ([0-9A-F]{5}): ([0-9A-F ]+) \*\//g)){const a=parseInt(m[1],16);if(a<lo||a>hi)continue;const hex=m[2].trim().replaceAll(' ','').toLowerCase();assert.equal(rom.subarray(a+16,a+16+hex.length/2).toString('hex'),hex);spans.push({offset:a+16,hex});}
assert.equal(spans.reduce((n,s)=>n+s.hex.length/2,0),4+35+3+64+41+40);
const snap=JSON.parse(fs.readFileSync(new URL('cutman-fourth-scroll/after-continuation.json',work))),trials=[];
for(const delta of[-81,-80,-79,-40,0,40,79,80,81]){
 const n=new NES({emulateSound:false});n.loadROM(rom.toString('binary'));n.fromJSON(structuredClone(snap));for(let b=0;b<8;b++)n.buttonUp(1,b);
 const m=n.cpu.mem;assert.equal(m[0x6f0],28);assert.equal(m[0x490]+256*m[0x470],1936);assert.equal(m[0x610],180);
 const launches=[],initialized=[],sounds=[],driver=[],rows=[],cutters=[],born=new Map();let f=0;const em=n.cpu.emulate.bind(n.cpu);
 n.cpu.emulate=()=>{const pc=n.cpu.REG_PC+1,x=n.cpu.REG_X;
 if(pc===0xf663&&n.cpu.REG_ACC===17)launches.push({f,timer:m[0x650],flags:m[0x430],aimSpeed:m[4]+256*m[5]});
 if(pc===0xb701){const i=n.cpu.REG_X;born.set(i,f);initialized.push({f,slot:i,x:m[0x480+i]+256*m[0x460+i],xf:m[0x4a0+i],y:m[0x600+i],yf:m[0x620+i],flags:m[0x420+i],vx:m[0x4c0+i]*256+m[0x4e0+i],vy:(m[0x680+i]*256+m[0x660+i])<<16>>16,hp:m[0x6c0+i]});}
 if(pc===0xb6c3&&m[0x6e0+x]===17)cutters.push({f,born:born.get(x),slot:x,x:m[0x480+x]+256*m[0x460+x]+m[0x4a0+x]/256,y:m[0x600+x]+m[0x620+x]/256,vx:m[0x4c0+x]*256+m[0x4e0+x],vy:(m[0x680+x]*256+m[0x660+x])<<16>>16,state:m[0x440+x],flags:m[0x420+x],hp:m[0x6c0+x]});
 if(pc===0xc477)sounds.push({f,id:n.cpu.REG_ACC,source:m[0x2f]});
 if(pc===0x9003&&n.mmap.load(0x9003)===0xc9&&n.mmap.load(0x9004)===0xfc)driver.push({f,id:n.cpu.REG_ACC});
 return em();};
 for(f=1;f<=160;f++){const px=1936+delta;m[0x480]=px&255;m[0x460]=px>>8;m[0x4a0]=0;m[0x600]=36;m[0x620]=m[0x660]=m[0x680]=0;m[0x55]=100;n.frame();rows.push({f,timer:m[0x650]});}
 if(Math.abs(delta)>=80)assert.equal(launches.length,0);else{assert.deepEqual(launches.map(v=>v.f),[1,33,65,97,129]);for(const c of initialized){assert.equal(c.vx,Math.floor(Math.abs(delta)*256/51));assert.equal(c.vy,1254);assert.equal(c.x,1936);assert.equal(c.y,180);assert.equal(c.hp,20);assert.equal((c.flags&64)!==0,delta>=0);}}
 let moves=0;const first=cutters.filter(v=>v.slot===17&&v.born===1);
 for(let i=1;i<first.length;i++){const a=first[i-1],b=first[i];if(b.f!==a.f+1)continue;
 assert.equal(b.x-a.x,(a.flags&64?1:-1)*a.vx/256);assert.equal(b.y-a.y,-a.vy/256);assert.equal(b.vy,Math.max(-3072,a.vy-64));moves++;}
 if(Math.abs(delta)<80)assert.ok(moves>35);
 assert.equal(sounds.length,0);assert.equal(driver.length,0);
 trials.push({delta,moves,launches,initialized,sounds,driver,firstCutter:cutters.filter(v=>v.slot===17&&v.born===1)});
}
const fixed=a=>rom[16+7*16384+a-0xc000];const tables=[17,28].map(type=>({type,halfWidth:fixed(0xfb38+type),halfHeight:fixed(0xfc06+type),contact:fixed(0xfe89+type),normalDamage:fixed(0xfc51+type)}));assert.deepEqual(tables[0],{type:17,halfWidth:8,halfHeight:8,contact:4,normalDamage:4});
const r={method:'Supplied MM1USA/JSNES2.1.0, source label spans independently matched. Native page7/firstdispenser snapshot reached via existing controlled four ladder probes. PlayerX pinned to dispenserX+delta, Y36/fraction0/verticalspeed0/protection100 everyupdate; neutral inputs. Original dispenser/enemy/shot/sound code unmodified. No injected launches or sounds. Not an unassisted stage traversal, GMSruntime or hardware certification.',romSha256:createHash('sha256').update(rom).digest('hex'),verifiedBytes:187,spans,originalRecords:[{page:7,x:144,y:180,type:28},{page:13,x:144,y:180,type:28}],hybridAnchors:[{x:912,y:1140,band:960,buildingX:864,buildingY:1088},{x:1424,y:180,band:0,buildingX:1376,buildingY:128}],tables,trials};
fs.writeFileSync(new URL('native-super-cutter.json',out),JSON.stringify(r,null,2)+'\n');console.log(trials.map(t=>({delta:t.delta,launches:t.launches.map(v=>v.f),sounds:t.sounds,driver:t.driver})),tables);
