import fs from'node:fs';import assert from'node:assert/strict';import{NES}from'jsnes';
const root=new URL('../../',import.meta.url),out=new URL('Assets/Pickups/MM5/Recovered/',root),rom=fs.readFileSync(new URL('Mega Man 5 (USA).nes',root),'binary'),snap=JSON.parse(fs.readFileSync(new URL('.work/mm5-stage.json',import.meta.url))),results=[];
for(const [name,anim]of[['small_health',0x75],['large_health',0x74],['small_weapon',0x77],['large_weapon',0x76],['extra_life',0x78]]){
 const n=new NES();n.loadROM(rom);n.fromJSON(structuredClone(snap));const m=n.cpu.mem,s=16;for(let i=1;i<24;i++)m[0x300+i]=0;for(let b=0;b<8;b++)n.buttonUp(1,b);
 m[0xb0]=0x85;m[0xb1]=0x85;m[0xbf]=2;m[0x32]=name.includes('weapon')?1:0;
 Object.assign(m,{[0x300+s]:0xb7,[0x558+s]:anim,[0x540+s]:0,[0x570+s]:0,[0x588+s]:0xcc,[0x5a0+s]:0xad,[0x468+s]:[0x77,0x75].includes(anim)?0x13:0x23,[0x480+s]:255,[0x408+s]:0,[0x420+s]:0,[0x528+s]:0,[0x5b8+s]:0,[0x348+s]:m[0x348],[0x390+s]:m[0x390],[0x330+s]:m[0x330],[0x378+s]:m[0x378],[0x3d8+s]:0,[0x3f0+s]:0});
 const trace=[];for(let frame=1;frame<=120;frame++){n.frame();if(frame<4||trace.at(-1)?.health!==m[0xb0]||trace.at(-1)?.weapon!==m[0xb1]||trace.at(-1)?.lives!==m[0xbf])trace.push({frame,health:m[0xb0],weapon:m[0xb1],lives:m[0xbf],item:m[0x300+s]});}
 const result={name,animation:anim,start:{health:0x85,weapon:0x85,lives:2},end:{health:m[0xb0],weapon:m[0xb1],lives:m[0xbf]},trace};console.log(result);assert.equal(m[0x300+s],0);assert.equal(m[0xb0],0x85+(name==='small_health'?2:name==='large_health'?10:0));assert.equal(m[0xb1],0x85+(name==='small_weapon'?2:name==='large_weapon'?10:0));assert.equal(m[0xbf],name==='extra_life'?3:2);results.push(result);
}
fs.writeFileSync(new URL('pickup-effects.json',out),JSON.stringify({method:'Controlled original B7 pickup at player position, original collision/collection/refill handlers; selected weapon1 for ammo tests. Health/weapon internal encoding0x80+bars. 120 natural frames per branch.',results},null,2)+'\n');
