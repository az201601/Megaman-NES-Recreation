// Independent native close with held vs tapped Start/A; no patching.
import{NES,Controller as C}from'jsnes';import fs from'node:fs';
const root=new URL('../../',import.meta.url),work=new URL('./.work/',import.meta.url);
const rom=fs.readFileSync(new URL('Mega Man 5 (USA).nes',root),'binary');
let n=new NES();n.loadROM(rom);n.fromJSON(JSON.parse(fs.readFileSync(new URL('mm5-stage.json',work))));for(let b=0;b<8;b++)n.buttonUp(1,b);for(let i=0;i<30;i++)n.frame();n.buttonDown(1,C.BUTTON_START);n.frame();n.buttonUp(1,C.BUTTON_START);for(let i=0;i<119;i++)n.frame();
const snap=structuredClone(n.toJSON()),results=[];
for(const mode of['heldA','heldStart','tapA','tapStart']){
 const a=new NES();a.loadROM(rom);a.fromJSON(structuredClone(snap));const rows=[],b=mode.endsWith('A')?C.BUTTON_A:C.BUTTON_START;
 for(let f=1;f<=45;f++){if(f===1)a.buttonDown(1,b);if(f===2&&mode.startsWith('tap'))a.buttonUp(1,b);a.frame();if(f>=35)rows.push({frame:f,x:a.cpu.mem[0x330],y:a.cpu.mem[0x378],state:a.cpu.mem[0x30]});}
 results.push({mode,rows});
}
fs.writeFileSync(new URL('mm5-menu-transitions/held-confirm-probes.json',work),JSON.stringify(results,null,2));console.log(JSON.stringify(results));
