// Controlled original supplied USA ROM trials, no enemy-code/ROM patches.
import fs from'node:fs';import assert from'node:assert/strict';import{createHash}from'node:crypto';import{NES,Controller as C}from'jsnes';
const root=new URL('../../',import.meta.url),work=new URL('./.work/',import.meta.url),out=new URL('Assets/Enemies/MM1/Screw Bomber/Reference/',root),rom=fs.readFileSync(new URL('Mega Man (USA).nes',root));
fs.mkdirSync(work,{recursive:true});fs.mkdirSync(out,{recursive:true});
const make=()=>{const n=new NES({emulateSound:false});n.loadROM(rom.toString('binary'));return n;};
const n=make(),tick=k=>{for(let i=0;i<k;i++)n.frame();},press=b=>{n.buttonDown(1,b);tick(1);n.buttonUp(1,b);};tick(180);press(C.BUTTON_START);tick(333);press(C.BUTTON_START);tick(899);
n.buttonDown(1,C.BUTTON_RIGHT);let stopped=false;for(let i=0;i<500;i++){const m=n.cpu.mem;m[0x600]=36;m[0x620]=m[0x660]=m[0x680]=0;m[0x55]=100;if(!stopped&&m[0x480]+256*m[0x460]>=760){n.buttonUp(1,C.BUTTON_RIGHT);stopped=true;}n.frame();}assert.ok(stopped);const safe=n.toJSON();
const fixed=a=>rom[16+0x1c000+a-0xc000],bank6=a=>rom[16+0x18000+a-0x8000];const trials=[];
for(const type of[5,22])for(const delta of[-80,-79,0,79,80]){
 const e=make();e.fromJSON(structuredClone(safe));for(let b=0;b<8;b++)e.buttonUp(1,b);const m=e.cpu.mem;for(let i=17;i<32;i++)m[0x600+i]=248;
 m[0x6f0]=type;m[0x430]=bank6(0xa380+type);m[0x650]=bank6(0xa40c+type);m[0x450]=m[0x6b0]=m[0x4b0]=m[0x630]=m[0x4d0]=m[0x4f0]=m[0x670]=m[0x690]=m[0x590]=0;m[0x490]=56;m[0x470]=3;m[0x610]=type===5?160:96;m[0x6d0]=20;
 const initial=e.toJSON();if(delta===0)fs.writeFileSync(new URL('screw-'+type+'-initial.json',work),JSON.stringify(initial));
 let frame=0;const rows=[],posts=[],requests=[],bullets=[],choices=[],sounds=[],driver=[];const em=e.cpu.emulate.bind(e.cpu);function row(){return{frame,state:m[0x450],timer:m[0x650],y:m[0x610],hp:m[0x6d0],flags:m[0x430]};}
 e.cpu.emulate=()=>{const pc=e.cpu.REG_PC+1,x=e.cpu.REG_X;
 if(pc===(type===5?0xb2ca:0xb2d6)&&x===16)rows.push(row());
 if(pc===0xbe49&&x===16&&[5,22].includes(m[0x6f0]))posts.push(row());
 if(pc===0xb36a&&m[0x2f]===16)choices.push({frame,index:x,seed:m[0x46]});
 if(pc===0xf533&&m[0x6e0+x]===45&&m[0x2f]===16)requests.push({frame,slot:x,index:e.cpu.REG_Y,x:m[0x480+x]+256*m[0x460+x],y:m[0x600+x],flags:m[0x420+x]});
 if(pc===0xb6c3&&m[0x6e0+x]===45)bullets.push({frame,slot:x,x:m[0x480+x]+256*m[0x460+x]+m[0x4a0+x]/256,y:m[0x600+x]+m[0x620+x]/256,vx:m[0x4c0+x]*256+m[0x4e0+x],vy:(m[0x680+x]*256+m[0x660+x])<<16>>16,flags:m[0x420+x]});
 if(pc===0xc477)sounds.push({frame,id:e.cpu.REG_ACC,source:m[0x2f]});if(pc===0x9003)driver.push({frame,id:e.cpu.REG_ACC});return em();};
 for(frame=1;frame<=600;frame++){const px=824+delta;m[0x480]=px&255;m[0x460]=px>>8;m[0x4a0]=0;m[0x600]=36;m[0x620]=m[0x660]=m[0x680]=0;m[0x55]=100;e.frame();}
 assert.equal(rows.length,600);assert.equal(posts.length,600);if(Math.abs(delta)===80){assert.equal(requests.length,0);assert.ok(rows.every(r=>r.state<=1&&r.timer===0));}else{assert.equal(requests.length%5,0);assert.ok(requests.length>=30);}
 trials.push({type,delta,rows,posts,choices,requests,bullets,sounds:sounds.filter(s=>s.source===16),driver:driver.filter(s=>s.id===21)});
}
const speedIndices=[...new Set(trials.flatMap(t=>t.requests.map(r=>r.index)))].sort((a,b)=>a-b),speeds=speedIndices.map(index=>({index,vx:fixed(0xf54c+index+2)|fixed(0xf54c+index+3)<<8,vy:(fixed(0xf54c+index)|fixed(0xf54c+index+1)<<8)<<16>>16}));
const report={method:'Supplied USA/JSNES2.1.0; original boot/Start180+333+899 and controlled safeY36/protection100 Right approach to760 then stationary first-gun snapshot. Fixture replaces slot16 with native type05/16 flags/timer/speed defaults, state0,HP20,X824,Y160/96,zero fractions/lifecycle; other active enemy slots removed. Original AI,animation,RNG,projectile/sound code unchanged. Ten600update trials pin playerX824+delta,Y36/speed0/protection100 with neutral inputs. Other active slots cleared initially; unchanged spawn/camera code can introduce adjacent native enemies later. Requests filtered to owner16, bullet rows record the shared type2D movement routine (including any adjacent enemy bullets); driver observations are not source-tagged. This is controlled fixture research, NOT natural corridor traversal or native MM5 charged-shot rules.',romSha256:createHash('sha256').update(rom).digest('hex'),speeds,trials};fs.writeFileSync(new URL('native-screw-bomber-gameplay.json',out),JSON.stringify(report,null,2).replace(/\{\n\s+"frame": [^{}]*?\n\s*\}/g, row=>row.replace(/\n\s*/g,' '))+'\n');console.log('PASS6000 native Screw Bomber AI entries',trials.map(t=>[t.type,t.delta,t.requests.length,t.choices.map(c=>c.index),[...new Set(t.sounds.map(s=>s.id))]]),speeds);
