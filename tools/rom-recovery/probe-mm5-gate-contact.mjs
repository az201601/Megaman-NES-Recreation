// Original supplied MM5 USA: controlled room-render lead-in, then real Right-only gates.
// Never redirect the gate routine or force a gate flag during measured approaches.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {NES, Controller as C} from 'jsnes';
import {PNG} from 'pngjs';
const root=new URL('../../',import.meta.url),out=new URL('docs/mm5-gate-contact-reference/',root);
const rom=fs.readFileSync(new URL('Mega Man 5 (USA).nes',root));
const hash=b=>createHash('sha256').update(b).digest('hex');
assert.equal(hash(rom),'32bd2b4ecd2129aa5337afe9171696ef35646d3fd597339aebba19221764521c');
fs.mkdirSync(out,{recursive:true});
function make(){const e=new NES({emulateSound:false});e.loadROM(rom.toString('binary'));return e;}
// Fresh boot and original stage selection; no dependence on lost/foreign savestates.
const boot=make(),tick=k=>{for(let i=0;i<k;i++)boot.frame();},press=b=>{boot.buttonDown(1,b);tick(1);boot.buttonUp(1,b);};
tick(900);press(C.BUTTON_START);tick(300);press(C.BUTTON_START);tick(600);
press(C.BUTTON_RIGHT);tick(3);press(C.BUTTON_START);tick(900);
assert.equal(boot.cpu.mem[0x26],6);
const n=make();n.fromJSON(boot.toJSON());for(let b=0;b<8;b++)n.buttonUp(1,b);
let setupFrame=0,redirected=false,ready=false;
const lead=n.cpu.emulate.bind(n.cpu);
n.cpu.emulate=()=>{
 const pc=n.cpu.REG_PC+1,m=n.cpu.mem;
 if(!redirected&&pc===0xc9dd){
  redirected=true;
  // Select actual last approach screen/section, then invoke native full-room renderer
  // once through the existing camera-call stack. This is setup, NOT measured contact.
  for(const[a,v]of [[0xf9,26],[0xfc,0],[0xfa,0],[0xfb,0],[0x29,12],[0x330,192],[0x348,26],[0x318,0],[0x378,208],[0x390,0],[0x360,0],[0x3d8,0],[0x3f0,0],[0x30,0]])m[a]=v;
  n.cpu.REG_PC=0xd45f;
 }
 if(redirected&&!ready&&pc===0xd469){ready=true;m[0x2b]=2;}
 return lead();
};
for(setupFrame=1;setupFrame<=120&&!ready;setupFrame++)n.frame();
assert.ok(ready);n.cpu.emulate=lead;
const room=n.toJSON(),trials=[];
// Fraction160 covers an alternative alignment with six rather than seven updates
// between body-edge/door-face crossing and the original boundary trigger.
for(const fraction of [0,160]){
 const e=make();e.fromJSON(structuredClone(room));e.ppu.clipToTvSize=false;
 for(let b=0;b<8;b++)e.buttonUp(1,b);
 const m=e.cpu.mem;
 // One supported placement on the native Y192 approach ledge. Protection is set
 // ONCE against existing enemies; no per-frame position/velocity/protection pins.
 for(const[a,v]of [[0x330,208],[0x318,fraction],[0x378,180],[0x360,0],[0x390,0],[0x3d8,0],[0x3f0,0],[0x30,0],[0x5b8,120]])m[a]=v;
 let pixels=null,frame=0,active=null;
 e.ui.writeFrame=p=>{pixels=p.slice();};
 e.frame();e.frame();
 const gates=[],faces=new Map(),rows=[],sound=[],writes=[],captures=new Map();
 const emulate=e.cpu.emulate.bind(e.cpu);
 const position=()=>m[0x348]*256+m[0x330]+m[0x318]/256;
 const camera=()=>m[0xf9]*256+m[0xfc];
 e.cpu.emulate=()=>{
  const pc=e.cpu.REG_PC+1;
  if(pc===0xcb5f)rows.push({frame,event:'boundary-handler',x:position(),camera:camera(),section:m[0x29],screenOffset:m[0x2b],guard55:m[0x55]});
  if(pc===0xd0fc){active={index:gates.length,page:m[0xf9],start:frame,x:position(),faceFrame:faces.get(m[0xf9]),edits:[],ppuWrites:[],visibleChanges:[],scrollFrames:[]};gates.push(active);}
  if(pc===0xec5d&&e.cpu.REG_ACC===0x25)sound.push({frame,id:37});
  if(pc===0xd128&&active&&!active.returnFrame){
   const address=m[0x7d0]*256+m[0x7d1];
   active.edits.push({frame,address,tiles:[address,address+1,address+32,address+33]});
  }
  if(pc===0xd16a&&active&&!active.returnFrame)active.returnFrame=frame;
  if(pc===0xcbb4&&active&&active.returnFrame)active.scrollFrames.push(frame);
  return emulate();
 };
 const write=e.ppu.mirroredWrite.bind(e.ppu);
 e.ppu.mirroredWrite=(address,value)=>{
  if(active&&!active.scrollFrames.length){
   const edit=active.edits.find(q=>q.tiles.includes(address));
   if(edit){const w={frame,address,value,editFrame:edit.frame};active.ppuWrites.push(w);writes.push(w);}
  }
  return write(address,value);
 };
 const stripPixels=strip=>{
  // Actual displayed rightmost four columns avoid the player's overlapping sprite.
  // JSNES TV-crop is OFF solely to observe these edge pixels; no emulated timing,
  // palette, ROM instruction, gate flag or Mesen setting is changed.
  const b=Buffer.alloc(4*16*4);let k=0;
  for(let y=144+strip*16;y<160+strip*16;y++)for(let x=252;x<256;x++){b.writeUInt32LE(e.ppu.bgbuffer[y*256+x]>>>0,k);k+=4;}
  return hash(b);
 };
 let previous=null,previousBg=null,previousPixels=null;
 e.buttonDown(1,C.BUTTON_RIGHT);
 for(frame=1;frame<=410;frame++){
  e.frame();assert.ok(pixels);
  const page=m[0xf9];
  // A geometric marker, NOT a claimed collision callback: approved MM5 numeric
  // side probe is floor(centerX)+8; door's rendered left edge is screenX240.
  if((page===26||page===27)&&m[0xfc]===0&&m[0x348]===page&&Math.floor(position()-page*256)+8>=240&&!faces.has(page))faces.set(page,frame);
  const strips=[0,1,2].map(stripPixels);
  if(active&&!active.scrollFrames.length){
   if(previous)for(let i=0;i<3;i++)if(strips[i]!==previous[i]){
    let unoccludedChangedPixels=0;
    for(let y=144+i*16;y<160+i*16;y++)for(let x=252;x<256;x++){
     const k=y*256+x,bg=e.ppu.bgbuffer[k];
     if(bg!==previousBg[k]&&pixels[k]===bg&&pixels[k]!==previousPixels[k])unoccludedChangedPixels++;
    }
    assert.ok(unoccludedChangedPixels>0);
    active.visibleChanges.push({frame,stripTopToBottom:i,sha256:strips[i],unoccludedChangedPixels});
   }
  }
  rows.push({frame,event:'frame-end',x:position(),y:m[0x378]+m[0x360]/256,camera:camera(),section:m[0x29],sideProbeX:Math.floor(position())+8,strips});
  if(fraction===0){
   const pageCapture=captures.get(page)??[];
   if(m[0xfc]===0&&(page===26||page===27)){
    const png=new PNG({width:16,height:48});
    for(let y=0;y<48;y++)for(let x=0;x<16;x++){const rgb=pixels[(144+y)*256+240+x];png.data.set([rgb&255,rgb>>8&255,rgb>>16&255,255],(y*16+x)*4);}
    pageCapture.push({frame,png});captures.set(page,pageCapture);
   }
  }
  previous=strips;previousBg=e.ppu.bgbuffer.slice();previousPixels=pixels.slice();
  if(gates.length===2&&active.returnFrame&&frame>active.returnFrame+2)break;
 }
 assert.equal(gates.length,2);
 for(const g of gates){
  assert.equal(g.faceFrame,faces.get(g.page));
  assert.ok([6,7].includes(g.start-g.faceFrame));
  assert.deepEqual(g.edits.map(r=>r.frame-g.start),[0,4,8]);
  assert.equal(g.returnFrame-g.start,12);
  assert.deepEqual(g.visibleChanges.map(r=>[r.frame-g.start,r.stripTopToBottom]),[[1,2],[5,1],[9,0]]);
  assert.deepEqual([...new Set(g.ppuWrites.map(w=>w.frame-g.start))],[1,5,9]);
  assert.equal(g.ppuWrites.length,12);
  assert.equal(g.scrollFrames[0]-g.start,12);
  assert.ok(sound.some(s=>s.frame===g.start));
  g.summary={edgeToTrigger:g.start-g.faceFrame,edgeToFirstVisible:g.visibleChanges[0].frame-g.faceFrame,triggerToFirstVisible:1,fullyVisiblyOpen:g.visibleChanges[2].frame-g.start,scrollStart:g.scrollFrames[0]-g.start};
  if(fraction===0){
   const selected=[g.faceFrame,g.start,g.start+1,g.start+5,g.start+9];
   const sheet=new PNG({width:16*selected.length,height:48});
   for(let i=0;i<selected.length;i++){
    const src=captures.get(g.page).find(c=>c.frame===selected[i]);assert.ok(src);
    for(let y=0;y<48;y++)src.png.data.copy(sheet.data,(y*sheet.width+i*16)*4,y*64,(y+1)*64);
   }
   fs.writeFileSync(new URL('native-door-'+(g.index+1)+'-five-frames.png',out),PNG.sync.write(sheet));
   g.contactSheet={file:'native-door-'+(g.index+1)+'-five-frames.png',frames:selected,cell:[16,48],method:'Raw onFrame crop x240..255/y144..191; includes actual player-sprite occlusion. No redraw or background-only substitution.'};
  }
 }
 trials.push({initialFraction:fraction,gates,sound,rows});
}
const span=(cpu,hex)=>{const offset=16+30*8192+cpu-0xc000;assert.equal(rom.subarray(offset,offset+hex.length/2).toString('hex'),hex);return{cpu,offset,hex};};
const spans=[span(0xc8e2,'00'),span(0xc912,'0208f7090b'),span(0xcad1,'a9f0cd3003b00a8d3003a90085fc4c5fcb'),span(0xcb8d,'b968a948100320fcd0'),span(0xd11c,'a9038511a925205dec'),span(0xd133,'2022ffe695e69da59d2903d0ef')];
const current=new URL('Assets/Cut Man/Stage/Jumping Gate Entry/',root),start=fs.readFileSync(new URL('scr_mm1_cutman_gate_start.gml',current),'utf8'),begin=fs.readFileSync(new URL('obj_mm1_cutman_camera_begin_step.gml',current),'utf8');
assert.ok(start.includes('route_gate.gate_open_rows = 1;'));assert.ok(begin.includes('route_gate.gate_open_rows = min(4, 1 + floor(route_tick / 6));'));assert.ok(begin.includes('if (route_tick >= 24)'));
const result={method:'Supplied original MM5USA/JSNES2.1.0 fresh boot/Napalm selection. SETUP ONLY: one camera-call redirection C9DD to original full-room renderer D460 with page26/section12; restore native section offset2 at renderer return. Then one supported X208/Y180 placement, flash120 once, two neutral frames. MEASURED: Right held only, original player/terrain/camera/gate/opening/PPU/scroll code untouched; no per-frame pins/forced gate flags/opening-call redirection. Two sequential real gates per trial; fraction0/160. This is controlled relocated approach, not a natural start-to-boss playthrough. JSNES TV crop off solely to inspect right-edge displayed pixels; default raw JSNES palette in PNGs, no Mesen configuration changed. Geometric floor(center)+8 marker is not a claimed blocking gate collision: native code permits walking into door artwork before boundary handler. Actual PPU writes and rendered-background strip hashes with nonzero unoccluded changed pixels in actual onFrame output corroborate first-visible latency independently. Player sprite overlap alone is not counted as a door edit.',romSha256:hash(rom),source:{repository:'refreshing-lemonade/megaman5-disassembly',commit:'03e59a6855c1aca85d063bd2973005dc3ffd02ef',file:'bank1B_1F.asm'},spans,sideProbeEvidence:{selectorAddress:0xc8e2,selector:0,tableAddress:0xc912,bytes:[2,8,247,9,11],meaning:"Normal rightward player terrain-probe set: X+8; firstY-9, increments9 then11. Used only as geometric face marker, not forced collision."},setupFrames:setupFrame-1,trials,currentProject:{method:'Source schedule only, NOT installed GMS event/GPU/audio latency certification. No gameplay file changed. Trigger at standing right-side wall contact, rather than native center-boundary crossing. Physical Step contact to next cameraBeginStep normally adds one update; not measured here in GMS.',gateStartSha256:hash(Buffer.from(start)),beginSha256:hash(Buffer.from(begin)),openRowsAtTrigger:1,editsAtTriggerAges:[0,6,12,18],scrollAtAge:24,stripHeight:16,doorHeight:64,mm5DoorHeight:48},conclusion:'Native boundary-trigger-to-first-visible opening is1frame, edits4frames apart. The new finding is6–7updates walking from numeric side-probe/door-face crossing to native boundary trigger, versus project triggering at the face. Thus immediate first-strip activation can feel earlier even though project per-strip animation is slower. Do not add a claimed native6–7frame fixed wait: native waits for position, not a timer. Project changes require user choice.'};
fs.writeFileSync(new URL('native-mm5-gate-contact.json',out),JSON.stringify(result,null,2)+'\n');
console.log('PASS actual native gates:',trials.map(t=>({fraction:t.initialFraction,gates:t.gates.map(g=>g.summary)})));
