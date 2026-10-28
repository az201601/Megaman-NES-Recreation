// Exploratory ROM probe; see README.md for setup, sequence and limitations.
import {fileURLToPath} from 'node:url';
const root = fileURLToPath(new URL('../../', import.meta.url));
const work = fileURLToPath(new URL('./.work/', import.meta.url));
import{NES}from'jsnes';import fs from'node:fs';fs.mkdirSync(work,{recursive:true});let out=[];for(let flip of[false,true]){const n=new NES();n.loadROM(fs.readFileSync(root+'Mega Man 5 (USA).nes','binary'));n.fromJSON(JSON.parse(fs.readFileSync(work+'mm5-pre-hit.json')));for(let b=0;b<8;b++)n.buttonUp(1,b);if(flip)n.cpu.mem[0x528]^=0x20;let a=[];for(let t=0;t<5;t++){let m=n.cpu.mem;a.push({t,hp:m[0xb0]&31,x:m[0x330]+m[0x318]/256,face:m[0x528]&0x20,state:m[0x30]});n.frame();}out.push({flip,rows:a});console.log(flip,a);}fs.writeFileSync(work+'mm5-facing.json',JSON.stringify(out));
