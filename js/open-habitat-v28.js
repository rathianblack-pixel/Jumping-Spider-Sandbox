// ================= v28 universal open-display + physical surface graph =================
(function(){
'use strict';
const isOpen=t=>!!(t&&t.owned!==false);
const baseRoute=route,baseFollow=followRoute,baseClamp=clampSurf,baseRandSurf=randSurfPoint,baseUpdPrey=updPrey,basePickRetreat=pickRetreat,baseUpdSpider=updSpider,baseSafeSpot=safeSpot;
const baseBuildBG=buildBG,baseBuildFG=buildFG,baseGlassFx=glassFx,baseAddDecor=addDecor,baseCamKey=camKey,baseViewFor=viewFor;
const baseMist=$('mistBtn').onclick;

function preyCanClimb25(e){return e?.kind==='spider'||!!PREY[e?.type]?.decorClimb;}
function decor25(t,id){return t.decor.find(d=>d.id===id)||null;}
function topOf25(d,p){return v3(clamp(p?.x??d.x,d.x0+.7,d.x1-.7),d.h,clamp(p?.z??d.z,d.z0+.7,d.z1-.7));}
function nearestEdge25(d,p,out=1.8){const q=edgePt(d,p,out);return q;}
function stemBase25(d){return v3(d.x,0,d.z);}
function plantTop25(d){const D=DECOR[d.type],h=Math.min(TH-3,D.h||D.ph||18);return v3(d.x,h*.82,d.z);}
function ensureNav25(t,d){if(!d)return d;if(d._nav25)return d._nav25;const D=DECOR[d.type],anchors=[];
 if(D.kind==='plat'){
  anchors.push({surf:{t:'plat',id:d.id},pt:v3(d.x,d.h,d.z),normal:v3(0,1,0)});
  for(const sx of [-1,1])anchors.push({surf:{t:'climb',id:d.id},pt:v3(sx<0?d.x0:d.x1,d.h*.55,d.z),normal:v3(sx,0,0)});
  for(const sz of [-1,1])anchors.push({surf:{t:'climb',id:d.id},pt:v3(d.x,d.h*.55,sz<0?d.z0:d.z1),normal:v3(0,0,sz)});
 } else if(D.kind==='plant'){
  anchors.push({surf:{t:'climb',id:d.id},pt:plantTop25(d),normal:vnorm(v3(.4,0,.6))});
  for(const p of d.perches||[])anchors.push({surf:{t:'perch',id:d.id},pt:vc(p),normal:v3(0,1,0)});
 }
 return d._nav25={anchors};
}
addDecor=function(t,type,x,z,rot=0,seed){const d=baseAddDecor(t,type,x,z,rot,seed);if(!d)return d;const D=DECOR[type];
 if(D.perch&&(d.perches||[]).length<2){const h=Math.min(TH-4,(D.h||D.ph||14)*.72);d.perches=d.perches||[];d.perches.push(v3(d.x,h,d.z));d.perches.push(v3(clamp(d.x+(D.w||16)*.22,2,TW-2),Math.min(TH-4,h+Math.max(2,(D.h||10)*.12)),d.z));}
 ensureNav25(t,d);return d;};
for(const t of G.tanks||[])for(const d of t.decor||[])ensureNav25(t,d);

// Every owned habitat uses an invisible containment volume, never a climbable glass surface.
randSurfPoint=function(t,o={}){if(!isOpen(t))return baseRandSurf(t,o);const q=Object.assign({},o,{wall:0});return baseRandSurf(t,q);};
clampSurf=function(t,e){if(isOpen(t)&&e?.surf?.t==='wall'){e.surf=S_FLOOR;e.pos.y=0;clampTankXZ(t,e.pos,3);return;}return baseClamp(t,e);};

function routeToPerch25(t,e,toS,toP){const d=decor25(t,toS.id);if(!d)return [{surf:S_FLOOR,pt:randFloorPt(t)}];
 const can=preyCanClimb25(e);if(!can){if(PREY[e.type]?.flyer)return [{surf:toS,pt:vc(toP)}];return baseRoute(t,e,S_FLOOR,v3(clamp(d.x,3,TW-3),0,clamp(d.z,3,TD-3)),0);}
 const out=nearestEdge25(d,e.pos,2),segs=[];
 if(e.surf.t==='perch'&&e.surf.id===d.id){segs.push({surf:toS,pt:vc(toP),surface25:true});return segs;}
 if(e.surf.t!=='climb'||e.surf.id!==d.id){const start=e.surf.t==='floor'?e.pos:v3(e.pos.x,0,e.pos.z);if(e.surf.t!=='floor'){const down=baseRoute(t,e,S_FLOOR,v3(clamp(e.pos.x,2,TW-2),0,clamp(e.pos.z,2,TD-2)),0);segs.push(...down);}else floorRoute(t,start,out.fl,segs);segs.push({surf:{t:'climb',id:d.id},pt:v3(d.x,Math.min(5,(DECOR[d.type].h||20)*.15),d.z),climb:true,surface25:true});}
 segs.push({surf:{t:'climb',id:d.id},pt:v3(toP.x,Math.max(2,toP.y-2),toP.z),climb:true,surface25:true});
 segs.push({surf:toS,pt:vc(toP),surface25:true});return segs;
}
function leaveDecor25(t,e,toS,toP,hopRange){const d=decor25(t,e.surf.id);if(!d)return baseRoute(t,e,toS,toP,hopRange);if(!preyCanClimb25(e)){
  if(PREY[e.type]?.hop){const g=groundAt(t,toP.x,toP.z),q=v3(clamp(toP.x,3,TW-3),g.h,clamp(toP.z,3,TD-3));return [{surf:g.p?{t:'plat',id:g.p.id}:S_FLOOR,pt:q,hop:true}];}
  return [];
 }
 const ep=nearestEdge25(d,toP,2),segs=[{surf:{t:'climb',id:d.id},pt:v3(ep.side.x,Math.min(e.pos.y,d.h),ep.side.z),climb:true,surface25:true},{surf:{t:'climb',id:d.id},pt:v3(ep.side.x,0,ep.side.z),climb:true,surface25:true},{surf:S_FLOOR,pt:ep.fl}];
 if(toS.t==='floor')floorRoute(t,ep.fl,toP,segs);else segs.push(...baseRoute(t,{surf:S_FLOOR,pos:ep.fl,kind:e.kind,type:e.type},toS,toP,hopRange));return segs;
}
route=function(t,e,toS,toP,hopRange=0){
 if(isOpen(t)&&toS?.t==='wall')toS=S_FLOOR,toP=v3(clamp(toP.x,3,TW-3),0,clamp(toP.z,3,TD-3));
 if(isOpen(t)&&e.surf?.t==='wall'){e.surf=S_FLOOR;e.pos=v3(clamp(e.pos.x,3,TW-3),0,clamp(e.pos.z,3,TD-3));}
 if(toS?.t==='perch'||toS?.t==='climb')return routeToPerch25(t,e,toS,toP);
 if(e.surf?.t==='perch'||e.surf?.t==='climb')return leaveDecor25(t,e,toS,toP,hopRange);
 if(e.kind==='prey'&&toS?.t==='plat'&&!preyCanClimb25(e)){
  const d=decor25(t,toS.id);if(d&&PREY[e.type]?.hop&&d.h<=Math.max(18,e.size*2)&&vdist(e.pos,toP)<Math.max(35,hopRange||40))return [{surf:toS,pt:topOf25(d,toP),hop:true}];
  if(d){const ep=nearestEdge25(d,e.pos,2.3);return baseRoute(t,e,S_FLOOR,ep.fl,0);}return [];
 }
 return baseRoute(t,e,toS,toP,hopRange);
};

// Keep feet/body aligned to the support direction and recover from impossible routes.
followRoute=function(t,e,spd,dt,lockFace){const before=vc(e.pos),seg=e.route&&e.route[0];const r=baseFollow(t,e,spd,dt,lockFace);const moved=vdist(before,e.pos);
 if(seg&&(seg.climb||seg.surface25||e.surf?.t==='climb'||e.surf?.t==='perch')){
  const d=vsub(seg.pt||e.pos,before);if(vlen(d)>.01)e.face=vnorm(d);e._surface25={id:e.surf?.id||seg.surf?.id,normal:seg.normal||v3(0,1,0),tangent:vc(e.face)};
 }
 if(e.route&&e.route.length&&!e.jump){e._stuck25=(moved<.003)?(e._stuck25||0)+dt:0;if(e._stuck25>2.2){e._stuck25=0;e.route=null;if(e.kind==='spider'){if(e.state==='carry'&&e.hunt?.prey&&e.hunt.prey.owner===e){e.hunt.feedT=0;setSt(e,'feed','Could not reach the perch — feeding here instead');return true;}if(e.state==='toDrink')e.dropT=null;if(e.hunt&&['stalk','notice','crouch'].includes(e.state))e.hunt=null;setSt(e,'look','Reconsidering an unreachable route');}else setSt(e,'idle');return true;}}else e._stuck25=0;return r;};

// Flyers turn smoothly before each habitat’s invisible boundary instead of bouncing off it.
updPrey=function(t,p,dt){if(isOpen(t)&&p.state==='fly'){
  const mx=Math.max(12,TW*.12),mz=Math.max(10,TD*.14),my=Math.max(10,TH*.1);let steer=v3();
  if(p.pos.x<mx)steer.x+=(mx-p.pos.x)/mx;else if(p.pos.x>TW-mx)steer.x-=(p.pos.x-(TW-mx))/mx;
  if(p.pos.z<mz)steer.z+=(mz-p.pos.z)/mz;else if(p.pos.z>TD-mz)steer.z-=(p.pos.z-(TD-mz))/mz;
  if(p.pos.y>TH-my)steer.y-=(p.pos.y-(TH-my))/my;if(p.pos.y<4)steer.y+=(4-p.pos.y)/4;
  if(vlen(steer)>.01){const P_=PREY[p.type],inw=vnorm(steer),force=(P_.fly||40)*1.15;p.vel=vadd(vmul(p.vel,.84),vmul(inw,force*.16));if(p.fl&&vlen(steer)>.3)p.fl.pt=v3(clamp(p.fl.pt.x,mx*.55,TW-mx*.55),clamp(p.fl.pt.y,8,TH-8),clamp(p.fl.pt.z,mz*.55,TD-mz*.55));}
 }
 const r=baseUpdPrey(t,p,dt);if(isOpen(t)){clampTankXZ(t,p.pos,p.surf?.t==='air'?1.5:3);if(p.surf?.t==='wall'){const pp=PREY[p.type];p.surf=pp?.flyer?{t:'air'}:S_FLOOR;p.pos.y=p.surf.t==='floor'?0:p.pos.y;}if((p.surf?.t==='climb'||p.surf?.t==='perch')&&!preyCanClimb25(p)&&!PREY[p.type]?.flyer){p.surf=S_FLOOR;p.pos.y=0;p.route=null;setSt(p,'idle');}}
 return r;};


// Carrying prey may choose real decor, never a nonexistent wall.
safeSpot=function(t,s){if(!isOpen(t))return baseSafeSpot(t,s);let best=null,bd=1e9;for(const d of plats(t)){const q=v3(clamp(s.pos.x,d.x0+2,d.x1-2),d.h,clamp(s.pos.z,d.z0+2,d.z1-2)),dd=vdist(q,s.pos);if(dd<bd){bd=dd;best={surf:{t:'plat',id:d.id},pt:q};}}for(const d of t.decor){ensureNav25(t,d);for(const a of d._nav25?.anchors||[])if(a.surf.t==='perch'){const dd=vdist(a.pt,s.pos)+6;if(dd<bd){bd=dd;best={surf:a.surf,pt:vc(a.pt)};}}}return best;};

// Preserve body-to-surface alignment after behavior code performs gaze/idle updates.
updSpider=function(t,s,dt){const r=baseUpdSpider(t,s,dt);if((s.surf?.t==='perch'||s.surf?.t==='climb')&&s._surface25?.tangent&&vlen(s._surface25.tangent)>.01){const want=vnorm(s._surface25.tangent);s.face=vnorm(v3(lerp(s.face.x,want.x,clamp(dt*10,0,1)),lerp(s.face.y,want.y,clamp(dt*10,0,1)),lerp(s.face.z,want.z,clamp(dt*10,0,1))));}if(isOpen(t)&&s.surf?.t==='wall'){s.surf=S_FLOOR;s.pos.y=0;s.route=null;}return r;};

// Retreats are real decor/perch locations, never invisible walls.
pickRetreat=function(t,s){if(!isOpen(t))return basePickRetreat(t,s);const opts=[];for(const d of t.decor){ensureNav25(t,d);for(const a of d._nav25?.anchors||[])if(a.pt.y>8&&preyCanClimb25(s))opts.push({surf:a.surf,pt:vc(a.pt)});}if(!opts.length){s.retreat={surf:S_FLOOR,pt:randFloorPt(t),silk:0};return;}const q=opts.sort((a,b)=>b.pt.y-a.pt.y)[Math.floor(rand()*Math.min(5,opts.length))];s.retreat={surf:q.surf,pt:q.pt,silk:0};};

// Mist lands only on real decor/plant surfaces.
$('mistBtn').onclick=function(){const t=cur();if(!isOpen(t))return baseMist&&baseMist();SFX.mist();t.humidity=Math.min(1,(t.humidity??.38)+.42);let anchors=[];
 for(const d of t.decor){ensureNav25(t,d);for(const a of d._nav25?.anchors||[])if(a.pt.y>1)anchors.push(a);for(const p of d.perches||[])anchors.push({surf:{t:'perch',id:d.id},pt:p});}
 if(!anchors.length){for(let i=0;i<10;i++)t.drops.push({pos:randFloorPt(t),surf:S_FLOOR,v:rr(.45,.7)});}else for(let i=0;i<Math.min(24,Math.max(12,anchors.length*2));i++){const a=pick(anchors);t.drops.push({pos:vc(a.pt),surf:a.surf,v:rr(.55,.95)});}for(const p of t.prey){p.alert=clamp((p.alert||0)+.12,0,1);}for(const sp of t.spiders)if(!sp.owner&&['wander','look','rest','watch','bask'].includes(sp.state)&&rand()<.35){sp.route=null;setSt(sp,'mistReact','A droplet landed on nearby decor');}toast('💧 Misted habitat • droplets settled on decor');};


// Cache/render identity and surface-aligned body orientation.
camKey=function(c){return baseCamKey(c)+'|open28';};
viewFor=function(e,c){if(e?.surf?.t==='perch'&&e._surface25?.tangent){const a=Pv(e.pos,c),b=Pv(vadd(e.pos,vmul(e._surface25.tangent,5)),c),ang=Math.atan2(b[1]-a[1],b[0]-a[0]),hf=v3(e._surface25.tangent.x,0,e._surface25.tangent.z),front=vlen(hf)>.01?clamp(vdot(vnorm(hf),viewDir(c)),-1,1):0;return {view:'free',ang,front,flip:Math.cos(ang)<0};}return baseViewFor(e,c);};

// Open presets always receive a physical centerpiece so the vertical movement
// network has a real trunk/canopy instead of relying on invisible walls.
const baseApplyPreset25=applyPreset15;
applyPreset15=function(t,id,free=false,rollInc=false){const r=baseApplyPreset25(t,id,free,rollInc);if(['beachTree','forestIsland','jungleDiorama'].includes(id)&&!t.decor.some(d=>d.type==='grandtree')){const T=tankType(t),x=T.w*.5,z=T.d*.5,D=DECOR.grandtree;t.decor=t.decor.filter(d=>Math.abs(d.x-x)>(D.w+d.w)*.55||Math.abs(d.z-z)>(D.d+d.d)*.55);const q=fitDecorPos15(t,'grandtree',x,z,0);if(canPlaceDecor15(t,'grandtree',q.x,q.z,0)){const d=addDecor(t,'grandtree',q.x,q.z,0);ensureNav25(t,d);clearTankCaches15(t);}}return r;};

// Remove visible glass/front-frame rendering only for the open display. The floor remains.
function openBG25(t,c){const PL=plats(t),SM=tankShadow(t),flat=t.decor.filter(d=>DECOR[d.type].kind==='flat'),round=isRoundTank(t);return makeSprite(c,boxPts(-4,-4,TW+4,TD+4,-SUB-5,TH+4),cp=>{const pp=(x,y,z)=>P(x,y,z,cp);
  ppoly([pp(0,0,0),pp(TW,0,0),pp(TW,0,TD),pp(0,0,TD)],(sx,sy)=>{const q=invFloor(sx+.5,sy+.5,0,cp);if(round&&!insideTankXZ(t,q.x,q.z,.25))return 0;let cc=subTex(t.sub,q.x,q.z);cc=shd(cc,1-.4*shadowAt(SM,q.x,q.z));for(const d of PL){const dx=Math.max(d.x0-q.x,0,q.x-d.x1),dz=Math.max(d.z0-q.z,0,q.z-d.z1),dd=Math.hypot(dx,dz);if(dd<6)cc=shd(cc,.62+.38*sst(0,6,dd));}return cc;});
  for(const d of flat)ppoly([pp(d.x0,0,d.z0),pp(d.x1,0,d.z0),pp(d.x1,0,d.z1),pp(d.x0,0,d.z1)],(sx,sy)=>{const q=invFloor(sx+.5,sy+.5,0,cp);if(round&&!insideTankXZ(t,q.x,q.z,.25))return 0;return flatColor(d,q.x,q.z);});
  if(!round){const zf=cp.mode===4?0:TD;ppoly([pp(0,0,zf),pp(TW,0,zf),pp(TW,-SUB,zf),pp(0,-SUB,zf)],(sx,sy)=>{const q=invPlane(sx+.5,sy+.5,'z',zf,cp);return shd(subTex(t.sub,q.x,0,q.y),.8);});}
 });}
buildBG=function(t,c){return isOpen(t)?openBG25(t,c):baseBuildBG(t,c);};
buildFG=function(c){if(!isOpen(cur()))return baseBuildFG(c);return makeSprite(c,boxPts(-2,-2,TW+2,TD+2,-SUB-2,TH+2),()=>{});};
glassFx=function(s,c){if(isOpen(cur()))return;return baseGlassFx(s,c);};

// Repair an open tank that was converted from a glass enclosure.
function repairOpen25(t){if(!isOpen(t))return;for(const d of t.decor)ensureNav25(t,d);for(const e of [...t.spiders,...t.prey]){if(e.surf?.t==='wall'){e.surf=S_FLOOR;e.pos.y=0;e.route=null;}clampTankXZ(t,e.pos,3);}t.drops=(t.drops||[]).filter(d=>d.surf?.t!=='wall');const nearWall=p=>p&&(p.x<2||p.x>TW-2||p.z<2||p.z>TD-2)&&p.y>1;t.silk=(t.silk||[]).filter(l=>!nearWall(l.a)&&!nearWall(l.b));clearTankCaches15(t);}
for(const t of G.tanks||[])repairOpen25(t);
const oldSwitch=switchTank15;switchTank15=function(i){const r=oldSwitch(i);repairOpen25(G.tanks[i]);return r;};
const oldChange=changeTankType15;changeTankType15=function(t,id){const r=oldChange(t,id);repairOpen25(t);return r;};


// v28 migration: there is no dedicated Open habitat anymore. Every existing tank type is open.
function migrateDedicatedOpen28(){
  for(const t of G.tanks||[]){
    if(!t)continue;
    const legacyOpen=t.tankType==='open'||t.name==='Open Nature Display';
    if(!legacyOpen)continue;
    const seedSet=['mangroveroot','rockmesa','monstera','redbromeliad','maidenhair','jungleorchid','moss','litter','pebbles'];const exactSeed=t.name==='Open Nature Display'&&t.lastPreset==='beachTree'&&!(t.spiders||[]).length&&!(t.prey||[]).length&&seedSet.every(id=>(t.decor||[]).some(d=>d.type===id));
    if(exactSeed){t.owned=false;t.tankType='standard';t.name=`Habitat ${(t.id||0)+1}`;t.decor=[];t.prey=[];t.spiders=[];t.husks=[];t.drops=[];t.silk=[];t.fx=[];t.lastPreset=null;t.presetRoll=0;continue;}
    t.tankType='standard';if(t.name==='Open Nature Display')t.name='Standard Habitat';
  }
  if(!G.tanks?.[G.cur]?.owned){const i=G.tanks.findIndex(t=>t?.owned);G.cur=Math.max(0,i);}
  for(const t of G.tanks||[])if(t?.owned)withTankDims(t,()=>repairOpen25(t));
  if(G.tanks?.[G.cur]){setTankDims(G.tanks[G.cur]);setCam(cam.mode||1);VIEW.z=1;clampView();}
  try{localStorage.removeItem('jtOpenDisplay26Seen');save();}catch(_){}
}

// Habitat Shelf previews now show every enclosure as an open substrate display with no glass frame.
const baseHabitatPreview26=habitatPreview15;
habitatPreview15=function(t){
  if(!t?.owned&&t?.tankType==='open')return baseHabitatPreview26(t);
  const c=document.createElement('canvas');c.width=380;c.height=116;c.style.width='100%';c.style.height='58px';c.style.borderRadius='5px';c.style.margin='4px 0 6px';
  const x=c.getContext('2d'),T=tankType(t),sub=SUBS[t.sub]?.c?.[0]||'#ead7aa';
  x.fillStyle='#2b1c12';x.fillRect(0,0,c.width,c.height);x.save();x.translate(12,8);const w=356,h=96;
  x.fillStyle=sub;if(T.shape==='round'){x.beginPath();x.ellipse(w*.5,h*.72,w*.43,h*.20,0,0,Math.PI*2);x.fill();}else{x.beginPath();x.roundRect?.(w*.06,h*.56,w*.88,h*.28,10);if(x.roundRect)x.fill();else x.fillRect(w*.06,h*.56,w*.88,h*.28);}
  x.fillStyle='rgba(20,12,7,.25)';x.beginPath();x.ellipse(w*.5,h*.82,w*.44,h*.10,0,0,Math.PI*2);x.fill();
  for(const d of (t.decor||[]).slice(0,32)){const D=DECOR[d.type];if(!D)continue;const px=18+d.x/T.w*(w-36),py=h*.67-(D.h||D.ph||3)/T.h*h*.50;x.fillStyle=D.cat==='plants'?'#6da04e':D.kind==='flat'?'#b79861':'#806044';x.beginPath();x.arc(px,py,Math.max(2,Math.min(8,3+(D.w||10)/16)),0,Math.PI*2);x.fill();}
  x.restore();return c;
};

// Tactical hunting is also forbidden from choosing invisible-wall ambush points.
const basePlanAmbush28=planAmbush;
planAmbush=function(t,s,p){const a=basePlanAmbush28(t,s,p);if(!a||a.surf?.t!=='wall')return a;const q=v3(clamp(a.pt.x,3,TW-3),0,clamp(a.pt.z,3,TD-3)),g=groundAt(t,q.x,q.z);q.y=g.h;const surf=g.p?{t:'plat',id:g.p.id}:S_FLOOR,segs=route(t,s,surf,q);return Object.assign({},a,{surf,pt:q,segs,L:routeLen(s,segs),src:'ground'});};

// Meal integrity guard: carrying/feeding prey stays attached until feeding really completes.
const baseUpdSpider28=updSpider;
updSpider=function(t,s,dt){
  const beforeMeal=s.hunt?.prey;
  if(beforeMeal&&['carry','feed'].includes(s.state))beforeMeal.owner=s;
  const r=baseUpdSpider28(t,s,dt);
  const p=s.hunt?.prey;
  if(p&&['carry','feed'].includes(s.state)){p.owner=s;p.dead=true;holdPrey(s);}
  return r;
};

migrateDedicatedOpen28();
requestAnimationFrame(()=>{renderTabs();resize();toast('🌿 All habitats are now open displays • invisible containment, no climbable glass');});
window.__JT25={isOpen,preyCanClimb25,ensureNav25,repairOpen25};
window.__JT28={isOpen,preyCanClimb25,ensureNav25,repairOpen25,migrateDedicatedOpen28};
})();
// ================= end v28 universal open-display + physical surface graph =================
