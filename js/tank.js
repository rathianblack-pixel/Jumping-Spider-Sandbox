let UID=1;
function makeTank(i){return {id:i,name:'Tank '+(i+1),sub:'sand',decor:[],spiders:[],prey:[],husks:[],drops:[],fx:[],bgKey:'',bg:null,coinT:0};}
function addDecor(t,type,x,z,rot=0,seed){const D=DECOR[type];seed=seed||((rand()*1e9)|0);let w=D.w,d=D.d;if(rot&&D.kind==='plat'){[w,d]=[d,w];}
 const it={id:UID++,type,x,z,rot,seed,w,d,h:D.h||0,x0:x-w/2,x1:x+w/2,z0:z-d/2,z1:z+d/2,perches:[],cache:null};
 const R=rng(seed);
 if(type==='fern'){it.fronds=[];for(let i=0;i<9;i++){const a=-Math.PI/2+(i/8-0.5)*2.4+rr(-.1,.1)*0;const L=D.h*(0.6+R()*0.45);it.fronds.push({a:(i/8-0.5)*2.6+(R()-.5)*.3,L,dz:(R()-.5)*D.d*.6});}
  for(const f of it.fronds){const q=fernFrond(it,f)[12];it.perches.push(v3(q[0],q[1]+1,q[2]));}}
 if(D.attract){it.heads=[];const n=type==='lav'?6:7;for(let i=0;i<n;i++){const hx=(R()-.5)*D.w*.8,hh=D.h*(0.55+R()*0.45),hz=(R()-.5)*D.d*.6;it.heads.push({hx,hh,hz,lean:(R()-.5)*4});it.perches.push(v3(x+hx,hh+1.5,z+hz));}}
 if(type==='grass'){it.blades=[];for(let i=0;i<14;i++){const L=D.h*(0.45+R()*0.55);it.blades.push({bx:(R()-.5)*D.w*.7,bz:(R()-.5)*D.d*.6,L,bend:(R()-.5)*14});}
  for(let i=0;i<4;i++){const b=it.blades[i];it.perches.push(v3(x+b.bx+b.bend*.8,b.L*.9,z+b.bz));}}
 if(type==='tree'||type==='bonsai'){it.blobs=[];const top=type==='tree'?D.h:D.ph;const n=type==='tree'?9:6;for(let i=0;i<n;i++)it.blobs.push({bx:(R()-.5)*(type==='tree'?34:26),by:top*(0.75+R()*0.25)-(type==='tree'?6:4),bz:(R()-.5)*10,r:type==='tree'?7+R()*5:5+R()*4});
  {const tb=treeBlobs(it);for(let i=0;i<3;i++){const b=tb[i];it.perches.push(v3(b.x,b.y+b.r*.8,b.z));}}}
 if(!NOCLAMP)for(const p of it.perches){p.x=clamp(p.x,1.5,TW-1.5);p.z=clamp(p.z,1.5,TD-1.5);p.y=Math.min(p.y,TH-3);}
 t.decor.push(it);t.bgKey='';return it;}
const plats=t=>t.decor.filter(d=>DECOR[d.type].kind==='plat');
function platById(t,id){return t.decor.find(d=>d.id===id);}
function groundAt(t,x,z){let h=0,p=null;for(const d of t.decor){if(DECOR[d.type].kind!=='plat')continue;if(x>=d.x0&&x<=d.x1&&z>=d.z0&&z<=d.z1&&d.h>h){h=d.h;p=d;}}return {h,p};}
function inCover(t,x,z,y=0){for(const d of t.decor){const D=DECOR[d.type];if(!D.cover)continue;if(y>(D.ph||D.h||4)+2&&D.kind!=='flat')continue;if(D.kind==='flat'&&y>2)continue;const dx=(x-d.x)/(d.w/2),dz=(z-d.z)/(d.d/2);if(dx*dx+dz*dz<1)return true;}return false;}
const S_FLOOR={t:'floor'};
const sameSurf=(a,b)=>a&&b&&a.t===b.t&&(a.t!=='plat'||a.id===b.id)&&(a.t!=='wall'||a.w===b.w);
const elevated=s=>s.t==='plat'||s.t==='wall';
function wallClamp(w,p){const q=vc(p);q.y=clamp(q.y,0,TH-4);if(w==='z0'||w==='zD'){q.z=w==='z0'?0.3:TD-0.3;q.x=clamp(q.x,1,TW-1);}else{q.x=w==='x0'?0.3:TW-0.3;q.z=clamp(q.z,1,TD-1);}return q;}
function wallNormal(w){return w==='z0'?v3(0,0,1):w==='zD'?v3(0,0,-1):w==='x0'?v3(1,0,0):v3(-1,0,0);}
function wallBase(w,p){const q=wallClamp(w,p);q.y=0;const n=wallNormal(w);return v3(q.x+n.x*1.5,0,q.z+n.z*1.5);}
function clampSurf(t,e){const s=e.surf,p=e.pos;if(s.t==='floor'){p.y=0;p.x=clamp(p.x,1.5,TW-1.5);p.z=clamp(p.z,1.5,TD-1.5);}
 else if(s.t==='plat'){const d=platById(t,s.id);if(!d){e.surf=S_FLOOR;p.y=0;return;}p.y=d.h;p.x=clamp(p.x,d.x0+.5,d.x1-.5);p.z=clamp(p.z,d.z0+.5,d.z1-.5);}
 else if(s.t==='wall'){const q=wallClamp(s.w,p);p.x=q.x;p.y=q.y;p.z=q.z;}}
function randFloorPt(t){for(let i=0;i<20;i++){const p=v3(rr(6,TW-6),0,rr(6,TD-6));if(groundAt(t,p.x,p.z).h===0)return p;}return v3(rr(6,TW-6),0,rr(6,TD-6));}
function randSurfPoint(t,o={}){const r=rand(),ps=plats(t);const pw=o.plat??0.35,ww=o.wall??0.3;
 if(r<pw&&ps.length){const d=pick(ps);return {surf:{t:'plat',id:d.id},pt:v3(rr(d.x0+1.5,d.x1-1.5),d.h,rr(d.z0+1.5,d.z1-1.5))};}
 if(r<pw+ww){const w=pick(['z0','x0','xW','zD']);const p=wallClamp(w,v3(rr(4,TW-4),rr(4,o.maxY||TH-10),rr(4,TD-4)));return {surf:{t:'wall',w},pt:p};}
 return {surf:S_FLOOR,pt:randFloorPt(t)};}
function edgePt(d,p,out=0){ // nearest point on rect boundary to p
 let x=clamp(p.x,d.x0,d.x1),z=clamp(p.z,d.z0,d.z1);const inside=p.x>d.x0&&p.x<d.x1&&p.z>d.z0&&p.z<d.z1;
 if(inside){const dl=[x-d.x0,d.x1-x,z-d.z0,d.z1-z];const m=dl.indexOf(Math.min(...dl));if(m===0)x=d.x0;else if(m===1)x=d.x1;else if(m===2)z=d.z0;else z=d.z1;}
 let ox=0,oz=0;if(x<=d.x0+1e-6)ox=-out;else if(x>=d.x1-1e-6)ox=out;if(z<=d.z0+1e-6)oz=-out;else if(z>=d.z1-1e-6)oz=out;
 return {fl:v3(clamp(x+ox,1.5,TW-1.5),0,clamp(z+oz,1.5,TD-1.5)),top:v3(clamp(x,d.x0+.6,d.x1-.6),d.h,clamp(z,d.z0+.6,d.z1-.6)),side:v3(x,0,z)};}
function segHitsPlat(t,a,b,skip){for(const d of plats(t)){if(skip&&d.id===skip)continue;for(let i=1;i<10;i++){const x=lerp(a.x,b.x,i/10),z=lerp(a.z,b.z,i/10);if(x>d.x0&&x<d.x1&&z>d.z0&&z<d.z1)return d;}}return null;}
function segHitsRect(d,a,b){for(let i=1;i<16;i++){const f=i/16,x=lerp(a.x,b.x,f),z=lerp(a.z,b.z,f);if(x>d.x0&&x<d.x1&&z>d.z0&&z<d.z1)return true;}return false;}
function floorRoute(t,a,b,segs,depth=0){const d=segHitsPlat(t,a,b);if(!d||depth>8){segs.push({surf:S_FLOOR,pt:b});return;}
 // Stay on the substrate when merely passing decor. Only climb when the decor itself is the destination.
 const m=2.4,cs=[v3(clamp(d.x0-m,1.5,TW-1.5),0,clamp(d.z0-m,1.5,TD-1.5)),v3(clamp(d.x0-m,1.5,TW-1.5),0,clamp(d.z1+m,1.5,TD-1.5)),v3(clamp(d.x1+m,1.5,TW-1.5),0,clamp(d.z0-m,1.5,TD-1.5)),v3(clamp(d.x1+m,1.5,TW-1.5),0,clamp(d.z1+m,1.5,TD-1.5))];
 let best=null,score=1e9;for(const q of cs){if(segHitsRect(d,a,q)||segHitsRect(d,q,b))continue;const sc=hdist(a,q)+hdist(q,b);if(sc<score){score=sc;best=[q];}}
 if(!best){for(let i=0;i<cs.length;i++)for(let j=i+1;j<cs.length;j++){const q=cs[i],r=cs[j];if(segHitsRect(d,a,q)||segHitsRect(d,q,r)||segHitsRect(d,r,b))continue;const sc=hdist(a,q)+hdist(q,r)+hdist(r,b);if(sc<score){score=sc;best=[q,r];}}}
 if(!best){const e1=edgePt(d,a,1.8),e2=edgePt(d,b,1.8);best=[e1.fl,e2.fl];}
 let p=a;for(const q of best){if(hdist(p,q)>0.2){const hit=segHitsPlat(t,p,q,d.id);if(hit)floorRoute(t,p,q,segs,depth+1);else segs.push({surf:S_FLOOR,pt:q});p=q;}}
 const hit=segHitsPlat(t,p,b,d.id);if(hit)floorRoute(t,p,b,segs,depth+1);else segs.push({surf:S_FLOOR,pt:b});}
function route(t,e,toS,toP,hopRange=0){const segs=[];const from=e.surf;let p=vc(e.pos);
 if(sameSurf(from,toS)){if(from.t==='floor')floorRoute(t,p,toP,segs);else segs.push({surf:toS,pt:toP});return segs;}
 if(hopRange>0&&from.t!=='floor'&&vdist(p,toP)<hopRange&&toS.t!=='floor'){segs.push({surf:toS,pt:toP,hop:true});return segs;}
 if(from.t==='plat'){const d=platById(t,from.id);if(d){const ep=edgePt(d,toP,1.2);segs.push({surf:from,pt:ep.top});segs.push({surf:{t:'climb',id:d.id},pt:v3(ep.side.x,0,ep.side.z),climb:true});p=ep.fl;segs.push({surf:S_FLOOR,pt:ep.fl});}}
 else if(from.t==='wall'){// Leave glass toward the destination's projected lateral position instead of dropping straight down first.
  // This lets stalking spiders descend diagonally with moving prey rather than rotate/down/rotate/down.
  const b=wallClamp(from.w,toP);b.y=0;segs.push({surf:from,pt:b,wallExit:true});p=wallBase(from.w,b);segs.push({surf:S_FLOOR,pt:p});}
 if(toS.t==='plat'){const d=platById(t,toS.id);if(d){const ep=edgePt(d,p,1.2);floorRoute(t,p,ep.fl,segs);segs.push({surf:{t:'climb',id:d.id},pt:v3(ep.side.x,d.h,ep.side.z),climb:true});}}
 else if(toS.t==='wall'){const b=wallBase(toS.w,toP);floorRoute(t,p,b,segs);const wb=wallClamp(toS.w,toP);wb.y=0;segs.push({surf:toS,pt:wb});}
 else if(toS.t==='floor'){floorRoute(t,p,toP,segs);return segs;}
 segs.push({surf:toS,pt:toP});return segs;}
function routeLen(e,segs){let L=0,p=e.pos;for(const s of segs){L+=vdist(p,s.pt);p=s.pt;}return L;}
function LOS(t,a,b){for(const d of plats(t)){for(let i=1;i<12;i++){const f=i/12;const x=lerp(a.x,b.x,f),y=lerp(a.y,b.y,f),z=lerp(a.z,b.z,f);if(x>d.x0+1&&x<d.x1-1&&z>d.z0+1&&z<d.z1-1&&y<d.h-1.5)return false;}}return true;}
function faceToward(e,target,rate,dt){let d=vsub(target,e.pos);if(e.surf.t==='floor'||e.surf.t==='plat'||e.surf.t==='perch'){d.y=0;}else if(e.surf.t==='wall'){const n=wallNormal(e.surf.w);const k=vdot(d,n);d=vsub(d,vmul(n,k));}
 if(vlen(d)<0.01)return;d=vnorm(d);const f=e.face;const nf=vnorm(v3(lerp(f.x,d.x,clamp(rate*dt,0,1)),lerp(f.y,d.y,clamp(rate*dt,0,1)),lerp(f.z,d.z,clamp(rate*dt,0,1))));if(vlen(nf)>0.01)e.face=nf;}
function turnFaceFlat(e,d,rate,dt){d=v3(d.x,0,d.z);if(vlen(d)<0.01)return;d=vnorm(d);const a=Math.atan2(e.face.z,e.face.x),b=Math.atan2(d.z,d.x);let da=(b-a+Math.PI*3)%(Math.PI*2)-Math.PI;const na=a+da*clamp(rate*dt,0,1);e.face=v3(Math.cos(na),0,Math.sin(na));}
function wallPlaneDir(w,v){const n=wallNormal(w),q=vsub(v,vmul(n,vdot(v,n)));return vlen(q)>.001?vnorm(q):null;}
function turnFaceWall(e,d,rate,dt,dead=0.035){if(!e.surf||e.surf.t!=='wall')return;const w=e.surf.w,n=wallNormal(w),want=wallPlaneDir(w,d);if(!want)return;let cur=wallPlaneDir(w,e.face);if(!cur)cur=want;const up=v3(0,1,0),lat=(w==='z0'||w==='zD')?v3(1,0,0):v3(0,0,1);const a=Math.atan2(vdot(cur,up),vdot(cur,lat)),b=Math.atan2(vdot(want,up),vdot(want,lat));let da=(b-a+Math.PI*3)%(Math.PI*2)-Math.PI;if(Math.abs(da)<dead)return;const na=a+da*clamp(rate*dt,0,1);e.face=vnorm(vadd(vmul(lat,Math.cos(na)),vmul(up,Math.sin(na))));}
function preyRearFactor(p,s){if(!p||!s||(p.kind!=='spider'&&p.type==='mealworm'))return 0;let f=vc(p.face||v3(1,0,0)),to=vsub(s.pos,p.pos);if(p.surf&&p.surf.t==='wall'){const n=wallNormal(p.surf.w);f=vsub(f,vmul(n,vdot(f,n)));to=vsub(to,vmul(n,vdot(to,n)));}else{f.y=0;to.y=0;}if(vlen(f)<.01||vlen(to)<.01)return 0;const rear=-vdot(vnorm(f),vnorm(to));let x=clamp((rear-.08)/.82,0,1);return x*x*(3-2*x);}
function angleTo(e,target){let d=vsub(target,e.pos);d.y=e.surf.t==='wall'?d.y:0;const l=vlen(d)||1;return Math.acos(clamp(vdot(e.face,vmul(d,1/l)),-1,1));}
// follow route; returns true when finished
function followRoute(t,e,spd,dt,lockFace){if(!e.route||!e.route.length)return true;const seg=e.route[0];
 if(seg.hop){if(!e.jump)startJump(e,seg.pt,seg.surf,Math.max(5,vdist(e.pos,seg.pt)*0.25),spd*4.5);return false;}
 if(!sameSurf(e.surf,seg.surf))e.surf=seg.surf;
 const d=vsub(seg.pt,e.pos);const L=vlen(d);const step=spd*dt*(seg.climb?0.7:1);
 if(L<=step+0.01){e.pos=vc(seg.pt);if(e.surf.t==='plat'){const pd=platById(t,e.surf.id);if(pd)e.pos.y=platTopY(pd,e.pos.x,e.pos.z);}e.route.shift();if(!e.route.length){if(seg.surf.t!=='climb')clampSurf(t,e);return true;}return false;}
 const nd=vmul(d,1/L);e.pos=vadd(e.pos,vmul(nd,step));if(e.surf.t==='plat'){const pd=platById(t,e.surf.id);if(pd)e.pos.y=platTopY(pd,e.pos.x,e.pos.z);}e.moved+=step;if(!lockFace||seg.climb||e.surf.t==='wall'){if(e.kind==='spider'&&!seg.climb&&(e.surf.t==='floor'||e.surf.t==='plat'))turnFaceFlat(e,nd,8,dt);else e.face=vnorm(d);}return false;}
function startJump(e,to,surfTo,apex,spd){const d=vdist(e.pos,to);e.jump={from:vc(e.pos),to:vc(to),surfTo,t:0,T:Math.max(0.18,d/spd),apex,anchor:vc(e.pos),fromSurf:e.surf};e.surf={t:'air'};const f=vsub(to,e.pos);f.y=0;if(vlen(f)>0.1)e.face=vnorm(f);}
function stepJump(e,dt){const j=e.jump;j.t+=dt;const f=Math.min(1,j.t/j.T);const p=v3(lerp(j.from.x,j.to.x,f),lerp(j.from.y,j.to.y,f)+Math.sin(f*Math.PI)*j.apex,lerp(j.from.z,j.to.z,f));e.vel=vmul(vsub(p,e.pos),1/Math.max(dt,1e-3));e.pos=p;return f>=1;}
const NAMES=['Pip','Biscuit','Bean','Mochi','Pebble','Fuzz','Bolt','Peanut','Juniper','Nugget','Pepper','Sprout','Hopper','Boba','Tofu','Clover','Mango','Ziggy','Pixel','Noodle','Button','Olive','Kiwi','Toast','Sesame','Maple','Waffle','Ember','Dot','Velvet'];
const G={coins:400,clock:480*0.36,day:1,timeMode:0,catches:0,unlocked:{audax:1,regius:1,otiosus:1},cur:0,tanks:[],sel:null,mouse:null,mouseScr:null};
const DAYLEN=480;
function tod(){if(G.timeMode===1)return 0.5;if(G.timeMode===2)return 0.95;return (G.clock%DAYLEN)/DAYLEN;}
function isNight(){const t=tod();return t<0.25||t>0.8;}
function lightLevel(){const t=tod();if(t>0.29&&t<0.76)return 1;if(t<0.21||t>0.84)return 0;if(t<=0.29)return (t-0.21)/0.08;return 1-(t-0.76)/0.08;}
const spSize=s=>SPEC[s.sp].size*(0.4+0.1*s.stage);
// v11: jump reach is continuous and meaningfully individual/species-dependent.
// High-jump individuals gain a noticeably wider pounce envelope without changing normal walk speed.
const jumpRange=s=>{const z=spSize(s),q=clamp((s.tr&&s.tr.jump!=null?s.tr.jump:SPEC[s.sp].st.jump),0.1,1);return (13+z*2.3)*(0.78+q*0.72);};
// Head-on prey inside this distance is too close for a passive freeze: commit to the jump instead.
const pounceCommitRange=s=>jumpRange(s)*(0.54+clamp((s.tr&&s.tr.jump)||0.5,0.1,1)*0.12);
function stalkingSpeed(s,p,walk,d){
 const P_=targetProfile(p),R=jumpRange(s),z=spSize(s);
 const rel=clamp((p.spd||0)/Math.max(1,P_.walk||8),0,2),motion=1-Math.exp(-rel*1.05),rear=preyRearFactor(p,s);
 // v21: keep the approach brisk until the final pre-pounce setup. The slowdown
 // now lives in a narrow band immediately outside crouch range instead of
 // bleeding speed away through the whole middle of the stalk.
 const slowStart=R*1.38, slowEnd=R*1.03;
 const q=clamp((d-slowEnd)/Math.max(1,slowStart-slowEnd),0,1),ease=q*q*(3-2*q);
 const careful=Math.max(2.0+z*.10,walk*(.22+.06*s.tr.patience));
 const approach=walk*(.70+.16*motion);
 let v=lerp(careful,approach,ease);
 v*=1.10-s.tr.stealth*.18;
 // Rear approaches stay confidently faster until the same final setup band,
 // then the bonus softens so the spider still settles before launching.
 v*=1+rear*(.18+.30*ease);
 const cap=walk*(.90+.08*rear);
 return Math.min(cap,Math.max(1.8,v));
}
const eyePos=s=>v3(s.pos.x,s.pos.y+spSize(s)*0.3,s.pos.z);
function setSt(e,st,mood){e.state=st;e.st=0;if(mood!==undefined)e.mood=mood;}
