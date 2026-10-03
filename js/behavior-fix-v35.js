// ================= v35 clean base landing / climb-to-flat handoff =================
(function(){
'use strict';
const PHYS35=window.__JT31_PHYS,BEH33=window.__JT33_BEHAVIOR,BEH32=window.__JT32_BEHAVIOR;
if(!PHYS35||!BEH33||!BEH32)return;
const {surf31}=PHYS35;
const BASE_ROUTE35=route,BASE_FOLLOW35=followRoute,BASE_UPD35=updSpider;

function decor35(t,id){return id==null?null:t.decor.find(d=>d.id===id)||null;}
function bodyPad35(e){if(e?.kind==='spider')return Math.max(.7,spSize(e)*.42);return Math.max(.55,(e?.size||1.2)*.35);}
function pathWidthNear35(S,p){let best=1e9,w=1.2;for(const path of S?.paths||[])for(let i=1;i<path.pts.length;i++){const a=path.pts[i-1],b=path.pts[i],ab=vsub(b,a),L2=vdot(ab,ab)||1,u=clamp(vdot(vsub(p,a),ab)/L2,0,1),q=vadd(a,vmul(ab,u)),dd=vdist(p,q);if(dd<best){best=dd;w=path.width||1.2;}}return w;}
function flatDir35(e,d,root){let v=null,p=e?.hunt?.prey;if(p&&!p.dead&&!p.owner)v=v3(p.pos.x-root.x,0,p.pos.z-root.z);if(!v||vlen(v)<.05){const f=e?.face||v3(1,0,0);v=v3(f.x,0,f.z);}if(vlen(v)<.05)v=v3(root.x-d.x,0,root.z-d.z);if(vlen(v)<.05){const a=((d.seed||d.id||1)%628)*.01;v=v3(Math.cos(a),0,Math.sin(a));}return vnorm(v);}
function supportAt35(t,d,p){const parent=decor35(t,d?.parent31);if(parent)return {surf:{t:'plat',id:parent.id},y:parent.h,parent};const g=groundAt(t,p.x,p.z);return {surf:g.p?{t:'plat',id:g.p.id}:S_FLOOR,y:g.h,parent:g.p||null};}
function landing35(t,e,d,root){
  if(!d)return null;const S=surf31(t,d),w=pathWidthNear35(S,root),pad=Math.max(1.15,w*.55+bodyPad35(e)+.55),dir=flatDir35(e,d,root);
  const dirs=[dir,vmul(dir,-1),v3(-dir.z,0,dir.x),v3(dir.z,0,-dir.x)];
  let best=null;
  for(const qd of dirs){let x=clamp(root.x+qd.x*pad,1.5,TW-1.5),z=clamp(root.z+qd.z*pad,1.5,TD-1.5),sup=supportAt35(t,d,v3(x,0,z));
    if(d.parent31){const p=sup.parent;if(!p||p.id!==d.parent31)continue;x=clamp(x,p.x0+.7,p.x1-.7);z=clamp(z,p.z0+.7,p.z1-.7);sup={surf:{t:'plat',id:p.id},y:p.h,parent:p};}
    const dist=Math.hypot(x-root.x,z-root.z),score=dist+(qd===dir?2:0);if(!best||score>best.score)best={surf:sup.surf,pt:v3(x,sup.y,z),score};
  }
  return best||{surf:S_FLOOR,pt:v3(clamp(root.x+dir.x*pad,1.5,TW-1.5),0,clamp(root.z+dir.z*pad,1.5,TD-1.5))};
}

function lowestPhysical35(t,d){const S=surf31(t,d);let low=null,score=1e9;for(const path of S?.paths||[])for(const p0 of path.pts){const p=vc(p0),sc=p.y*100+Math.hypot(p.x-d.x,p.z-d.z)*.01;if(sc<score){score=sc;low=p;}}return low;}
function physicalExit35(t,e,d,toS,toP,hopRange){
  const low=lowestPhysical35(t,d);if(!low)return null;let down=[];try{down=BEH32.physicalRoute32(t,e,d,{t:'climb',id:d.id},low,0)||[];}catch(_){down=[];}
  const land=landing35(t,e,d,low);if(!land)return null;
  if(!down.length&&vdist(e.pos,low)>2.2)return null;
  if(!down.length||vdist(down[down.length-1].pt,land.pt)>.2||!sameSurf(down[down.length-1].surf,land.surf))down.push({surf:land.surf,pt:vc(land.pt),surface32:true,exit35:true,fromDecor35:d.id});
  const proxy=Object.assign({},e,{pos:vc(land.pt),surf:Object.assign({},land.surf),route:null});let tail=[];try{tail=BASE_ROUTE35(t,proxy,toS,toP,hopRange)||[];}catch(_){tail=[];}
  for(const q of tail){if(down.length&&vdist(down[down.length-1].pt,q.pt)<.2&&sameSurf(down[down.length-1].surf,q.surf))continue;down.push(q);}return down;
}

// General physical-surface exit: a creature leaving a plant/tree must finish the
// visible climb, step onto flat support beside the base, then continue its route.
route=function(t,e,toS,toP,hopRange=0){
  if(e&&['climb','perch'].includes(e.surf?.t)&&!(toS&&['climb','perch'].includes(toS.t)&&toS.id===e.surf.id)){
    const d=decor35(t,e.surf.id);if(d&&DECOR[d.type]?.kind==='plant'){const r=physicalExit35(t,e,d,toS,toP,hopRange);if(r?.length)return r;}
  }
  return BASE_ROUTE35(t,e,toS,toP,hopRange);
};

function baseY35(d){return d?.baseY31||0;}
function nearBase35(d,p){return !!(d&&p&&p.y<=baseY35(d)+2.2);}
function appendLanding35(t,e,d,root){const L=landing35(t,e,d,root);if(!L)return false;e.route=e.route||[];e.route.push({surf:L.surf,pt:L.pt,surface32:true,exit35:true,fromDecor35:d.id});e._baseExit35={decorId:d.id,pt:vc(L.pt)};return true;}
function ensureExitSegment35(t,e){
  if(!e?.route?.length)return;const seg=e.route[0];
  // Repair v33's old exit point, which was directly under the trunk/stem and left
  // the animal standing inside the object's base footprint.
  if(seg.exit33&&!seg.exit35){const id=['climb','perch'].includes(e.surf?.t)?e.surf.id:(e._baseExit35?.decorId);const d=decor35(t,id);if(d){const root=vc(seg.pt),L=landing35(t,e,d,root);if(L){seg.surf=L.surf;seg.pt=L.pt;seg.exit35=true;seg.fromDecor35=d.id;seg.climb=true;e._baseExit35={decorId:d.id,pt:vc(L.pt)};}}}
  // A locked hunt descent can also finish on the lowest path node with no explicit
  // floor segment. Add one before the route is allowed to complete.
  if(e.route.length===1&&e.hunt?._descentLock34&&['climb','perch'].includes(e.surf?.t)&&sameSurf(e.surf,seg.surf)){
    const d=decor35(t,e.surf.id);if(d&&nearBase35(d,seg.pt)&&!seg.exit35)appendLanding35(t,e,d,seg.pt);
  }
}

followRoute=function(t,e,spd,dt,lockFace){ensureExitSegment35(t,e);return BASE_FOLLOW35(t,e,spd,dt,lockFace);};

function armEmergencyLanding35(t,s,d,p){const root=vc(s.pos),L=landing35(t,s,d,root);if(!L)return false;s.route=[{surf:L.surf,pt:L.pt,surface32:true,exit35:true,fromDecor35:d.id}];if(s.hunt&&p){s.hunt._descentLock34={preyId:p.id,startY:s.pos.y,bestY:s.pos.y,bestRem:vdist(s.pos,L.pt),stall:0,retries:0,mode:'egress35'};s.hunt.cool=999;s.hunt.liveT=999;s.hunt.lost=0;s.hunt.t0=G.clock;s.hunt.plan=vc(p.pos);}s._baseExit35={decorId:d.id,pt:vc(L.pt)};s.mood=p?`Stepping clear of the ${DECOR[d.type]?.name||'structure'} before continuing the hunt`:'Stepping onto the flat surface';return true;}

updSpider=function(t,s,dt){
  // Any selected hunt route that leaves a plant/tree is one committed transition.
  // Lock it so the normal stalk planner cannot rebuild the route halfway down.
  if(s.state==='stalk'&&s.hunt&&!s.hunt._descentLock34&&s.route?.some(q=>q.exit35)&&['climb','perch'].includes(s.surf?.t)){
    const p=s.hunt.prey,rem=BEH33.routeRemaining33?BEH33.routeRemaining33(s):routeLen(s,s.route);s.hunt._descentLock34={preyId:p?.id,startY:s.pos.y,bestY:s.pos.y,bestRem:rem,stall:0,retries:0,mode:'egress35'};s.hunt.cool=999;s.hunt.liveT=999;s.hunt.lost=0;s.hunt.t0=G.clock;if(p)s.hunt.plan=vc(p.pos);
  }
  // Prevent v34's emergency settle from converting a climber to floor at the exact
  // trunk/stem center. Give it a short, visible step onto clear flat support first.
  const lock=s.hunt?._descentLock34,p=s.hunt?.prey;
  if(lock&&s.state==='stalk'&&!s.route?.length&&['climb','perch'].includes(s.surf?.t)){
    const d=decor35(t,s.surf.id);if(d&&nearBase35(d,s.pos))armEmergencyLanding35(t,s,d,p);
  }
  const beforeSurf=s.surf?Object.assign({},s.surf):null,beforePos=vc(s.pos),beforeDecor=['climb','perch'].includes(beforeSurf?.t)?decor35(t,beforeSurf.id):null,hadLock=!!s.hunt?._descentLock34;
  const r=BASE_UPD35(t,s,dt);
  // Safety net for a base transition completed entirely inside one update tick.
  if(hadLock&&beforeDecor&&['floor','plat'].includes(s.surf?.t)&&!s.route?.length&&nearBase35(beforeDecor,beforePos)){
    const radial=Math.hypot(s.pos.x-beforeDecor.x,s.pos.z-beforeDecor.z),w=pathWidthNear35(surf31(t,beforeDecor),beforePos),need=Math.max(1.15,w*.55+bodyPad35(s)+.35);
    if(radial<need*.72&&s.hunt?.prey)armEmergencyLanding35(t,s,beforeDecor,s.hunt.prey);
  }
  return r;
};

window.__JT35_BEHAVIOR={landing35,pathWidthNear35};
})();
// ================= end v35 =================
