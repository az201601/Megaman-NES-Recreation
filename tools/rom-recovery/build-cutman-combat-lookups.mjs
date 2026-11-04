import fs from'node:fs';
const base=new URL('../../Assets/Bosses/MM1/Cut Man/Combat/',import.meta.url),r=JSON.parse(fs.readFileSync(new URL('Reference/combat-art.json',base)));
let s='// Generated from verified combat-art.json. Effective pose includes fire high nibble.\nvar native_pose;\nnative_pose = argument0;\nswitch (native_pose)\n{\n';
for(const a of r.animations)if(!a.hurt)s+=`    case ${a.pose}: return ${a.header};\n`;
fs.writeFileSync(new URL('Scripts/scr_mm1_cutman_animation_header.gml',base),s+'}\nreturn 0;\n');
s='// Verified native facing/frame mapping. args: pose, pre-advance frame, right, hurt.\nvar native_pose, frame_number, face_right;\nnative_pose = argument0;\nframe_number = argument1;\nface_right = argument2;\nif (argument3)\n{\n';
const h=r.animations.find(a=>a.hurt).frames[0];s+=`    if (face_right) return ${h.right};\n    return ${h.left};\n}\nswitch (native_pose)\n{\n`;
for(const a of r.animations){if(a.hurt)continue;s+=`    case ${a.pose}:\n        switch (frame_number)\n        {\n`;a.frames.forEach((f,i)=>{s+=`            case ${i}:\n                if (face_right) return ${f.right};\n                return ${f.left};\n`;});s+='        }\n        break;\n';}
fs.writeFileSync(new URL('Scripts/scr_mm1_cutman_animation_sprite.gml',base),s+'}\nreturn 0;\n');
console.log('Generated original-ROM animation header/frame lookups.');
