// ================= v34 locked descent + stable surface facing =================
(function(){
'use strict';
const PHYS34=window.__JT31_PHYS,BEH33=window.__JT33_BEHAVIOR,SMART34=window.__JT30_SMART;
if(!PHYS34||!BEH33)return;
const {surf31,supportFrame31}=PHYS34;
const BASE_FOLLOW34=followRoute,BASE_VIEW34=viewFor,BASE_UPD34=updSpider,BASE_START_HUNT34=startHunt,BASE_PREY_WATCH34=preyWatching;

function decor34(t,id){return id==null?null:t.decor.find(d=>d.id===id)||null;}
function validTarget34(t,s,p){return !!(p&&!p.dead&&!p.owner&&!p.buried&&t.prey.includes(p));}
function remaining34(s){return BEH33.routeRemaining33?BEH33.routeRemaining33(s):0;}
function highAbove34(s,p){return !!(p&&s.pos.y>p.pos.y+10);}
function goodHighShot34(t,s,p){if(!p)return false;const R=typeof effectiveJumpRange31==='function'?effectiveJumpRange31(s,p):jumpRange(s),d=vdist(s.pos,p.pos);return d<=R*.86&&LOS(t,vadd(s.pos,v3(0,spSize(s)*.18,0)),p.pos);}

// Surface-facing hysteresis. A route/nearest-path tangent is not allowed to flip a
// nearly stationary critter 180 degrees. Facing follows actual displacement.
function setMotionFacing34(e,raw,moved){
  if(!e||!raw||vlen(raw)<.01)return;
  raw=vnorm(raw);let prev=e._surfaceFacing34&&vlen(e._surfaceFacing34)>.01?vnorm(e._surfaceFacing34):(e.face&&vlen(e.face)>.01?vnorm(e.face):raw);
  const dot=vdot(prev,raw);
  if(dot<-.55){
    const sameCandidate=e._turnCandidate34&&vdot(e._turnCandidate34,raw)>.88;
    if(!sameCandidate){e._turnCandidate34=vc(raw);e._turnTravel34=0;}else e._turnTravel34=(e._turnTravel34||0)+moved;
    if((e._turnTravel34||0)<.8){e.face=vc(prev);e._surfaceFacing34=vc(prev);return;}
    e._turnCandidate34=null;e._turnTravel34=0;prev=raw;
  }else{e._turnCandidate34=null;e._turnTravel34=0;const k=clamp(.34+moved*.18,.34,.82);const mix=v3(lerp(prev.x,raw.x,k),lerp(prev.y,raw.y,k),lerp(prev.z,raw.z,k));if(vlen(mix)>.02)prev=vnorm(mix);}
  e._surfaceFacing34=vc(prev);e.face=vc(prev);
}

followRoute=function(t,e,spd,dt,lockFace){
  const before=e?.pos?vc(e.pos):null,r=BASE_FOLLOW34(t,e,spd,dt,lockFace);
  if(e&&before&&['climb','perch'].includes(e.surf?.t)){
    const d=vsub(e.pos,before),m=vlen(d);if(m>.004)setMotionFacing34(e,d,m);else if(e._surfaceFacing34)e.face=vc(e._surfaceFacing34);
  }
  return r;
};

// v33 intentionally uses the next route waypoint as a render direction. That makes
// path changes visible as rapid up/down flips. v34 uses stable physical movement.
viewFor=function(e,c){
  if(!e||!['climb','perch'].includes(e.surf?.t))return BASE_VIEW34(e,c);
  const t=cur(),f=supportFrame31(t,e);if(!f)return BASE_VIEW34(e,c);
  let dir=e._surfaceFacing34&&vlen(e._surfaceFacing34)>.02?vnorm(e._surfaceFacing34):(e._motionTangent33&&vlen(e._motionTangent33)>.02?vnorm(e._motionTangent33):(e.face&&vlen(e.face)>.02?vnorm(e.face):vnorm(f.tangent||v3(1,0,0))));
  const a=Pv(e.pos,c),b=Pv(vadd(e.pos,vmul(dir,5)),c),ang=Math.atan2(b[1]-a[1],b[0]-a[0]);
  let sight=viewDir(c);if(vlen(sight)<.01)sight=v3(.6,0,.6);sight=vnorm(v3(sight.x,.62,sight.z));
  const normal=f.normal&&vlen(f.normal)>.02?vnorm(f.normal):v3(0,1,0),front=clamp(vdot(normal,sight),-1,1),steep=e.surf.t==='climb'||Math.abs(dir.y)>.18;
  if(!steep)return BASE_VIEW34(e,c);
  return {view:front<-.38?'belly':'top',ang,front,flip:false,surface34:true};
};

function armDescent34(t,s,p){
  if(!s.hunt||!validTarget34(t,s,p)||!highAbove34(s,p)||goodHighShot34(t,s,p))return false;
  let down=null;try{down=BEH33.chooseDescent33(t,s,p,s.hunt._descentSteps33||0);}catch(_){down=null;}
  if(!down?.route?.length)return false;
  s.route=down.route.map(q=>Object.assign({},q,{pt:vc(q.pt)}));
  delete s.hunt._descentGoal33; // v34 owns this route until the stage is complete.
  s.hunt._descentLock34={preyId:p.id,startY:s.pos.y,bestY:s.pos.y,bestRem:remaining34(s),stall:0,retries:0,mode:down.mode||'climb'};
  s.hunt.cool=999;s.hunt.liveT=999;s.hunt.lost=0;s.hunt.t0=G.clock;s.hunt.plan=vc(p.pos);s.hunt.creep=true;s.hunt.burst=1;s._awareT=Math.max(s._awareT||0,999);
  setSt(s,'stalk',down.mode==='hop'?`Jumping down to a lower perch before stalking ${targetName(p)}`:`Climbing down before continuing the hunt for ${targetName(p)}`);
  return true;
}

function lowestRoute34(t,s,p){
  const d=decor34(t,s.surf?.id),S=d&&surf31(t,d);if(!d||!S?.paths?.length)return null;
  const pts=[];for(const path of S.paths)for(const q0 of path.pts){const q=vc(q0);if(q.y<s.pos.y-4)pts.push(q);}
  if(!pts.length)return null;pts.sort((a,b)=>a.y-b.y||Math.hypot(a.x-p.pos.x,a.z-p.pos.z)-Math.hypot(b.x-p.pos.x,b.z-p.pos.z));
  for(const q of pts.slice(0,10)){
    let r=null;try{r=route(t,s,{t:'climb',id:d.id},q,jumpRange(s)*.06)||[];}catch(_){r=null;}if(!r?.length)continue;
    let y=s.pos.y,ok=true;for(const sg of r){if(!sg.hop&&sg.pt.y>y+3.0){ok=false;break;}y=sg.pt.y;}if(ok)return r.map(x=>Object.assign({},x,{pt:vc(x.pt)}));
  }
  return null;
}

function settleBase34(t,s){
  if(!['climb','perch'].includes(s.surf?.t)||s.pos.y>3.5)return false;
  const g=groundAt(t,s.pos.x,s.pos.z);s.surf=g.p?{t:'plat',id:g.p.id}:S_FLOOR;s.pos.y=g.h;s._surface31=null;s._surface25=null;return true;
}

function replanDescent34(t,s,p,forced=false){
  if(!validTarget34(t,s,p))return false;
  s.hunt._descentSteps33=(s.hunt._descentSteps33||0)+1;
  if(!forced&&armDescent34(t,s,p))return true;
  const r=lowestRoute34(t,s,p);if(r?.length){s.route=r;delete s.hunt._descentGoal33;s.hunt._descentLock34={preyId:p.id,startY:s.pos.y,bestY:s.pos.y,bestRem:remaining34(s),stall:0,retries:1,mode:'climb'};s.hunt.cool=999;s.hunt.liveT=999;s.hunt.lost=0;s.hunt.t0=G.clock;s._awareT=Math.max(s._awareT||0,999);s.mood=`Climbing down the current structure before stalking ${targetName(p)}`;return true;}
  return false;
}

startHunt=function(t,s,p){
  const r=BASE_START_HUNT34(t,s,p);if(!s.hunt||!p)return r;
  // v33 may already have selected a descent; replace it with the locked equivalent.
  if(s.hunt._descentGoal33&&s.route?.length){const mode=s.route.some(q=>q.hop)?'hop':'climb',lock={preyId:p.id,startY:s.pos.y,bestY:s.pos.y,bestRem:remaining34(s),stall:0,retries:0,mode};delete s.hunt._descentGoal33;s.hunt._descentLock34=lock;s.hunt.cool=999;s.hunt.liveT=999;s.hunt.lost=0;s.hunt.t0=G.clock;s.hunt.plan=vc(p.pos);s.hunt.creep=true;s.hunt.burst=1;s._awareT=Math.max(s._awareT||0,999);return r;}
  if(highAbove34(s,p)&&!goodHighShot34(t,s,p))armDescent34(t,s,p);
  return r;
};

preyWatching=function(p,s){if(s?.hunt?._descentLock34)return false;return BASE_PREY_WATCH34(p,s);};

updSpider=function(t,s,dt){
  const before=vc(s.pos),lock0=s.hunt?._descentLock34,p0=s.hunt?.prey;
  if(lock0&&validTarget34(t,s,p0)&&s.state==='stalk'){
    // Do not let ordinary stalk replanning steal a committed descent route.
    s.hunt.cool=Math.max(s.hunt.cool||0,999);s.hunt.liveT=999;s.hunt.lost=0;s.hunt.t0=G.clock;s.hunt.plan=vc(p0.pos);s.hunt.creep=true;s.hunt.burst=Math.max(s.hunt.burst||0,.7);s._awareT=Math.max(s._awareT||0,999);
    if(!s.route?.length){
      settleBase34(t,s);delete s.hunt._descentLock34;
      BASE_START_HUNT34(t,s,p0);if(s.hunt){delete s.hunt._descentGoal33;if(highAbove34(s,p0)&&!goodHighShot34(t,s,p0))armDescent34(t,s,p0);}
    }
  }
  const r=BASE_UPD34(t,s,dt),delta=vsub(s.pos,before),moved=vlen(delta);
  // Undo older unsigned path-tangent facing after the full update stack returns.
  if(['climb','perch'].includes(s.surf?.t)){
    if(moved>.004)setMotionFacing34(s,delta,moved);else if(s._surfaceFacing34)s.face=vc(s._surfaceFacing34);
  }
  const lock=s.hunt?._descentLock34,p=s.hunt?.prey;
  if(lock&&validTarget34(t,s,p)&&s.state==='stalk'){
    const rem=remaining34(s),down=s.pos.y<lock.bestY-.18||rem<lock.bestRem-.22;
    if(down){lock.bestY=Math.min(lock.bestY,s.pos.y);lock.bestRem=Math.min(lock.bestRem,rem);lock.stall=0;}else lock.stall+=dt;
    // A non-hop descent should not climb materially upward. Rebuild if it does.
    if(lock.mode!=='hop'&&s.pos.y>before.y+3.0)lock.stall=99;
    if(!s.route?.length){
      settleBase34(t,s);delete s.hunt._descentLock34;
      if(validTarget34(t,s,p)){BASE_START_HUNT34(t,s,p);if(s.hunt){delete s.hunt._descentGoal33;if(highAbove34(s,p)&&!goodHighShot34(t,s,p))armDescent34(t,s,p);}}
    }else if(lock.stall>2.0){
      const retries=(lock.retries||0)+1;delete s.hunt._descentLock34;
      if(!replanDescent34(t,s,p,retries>1)){
        // Do not oscillate forever: abandon the bad high route and continue from the
        // nearest legitimate support the navigation system can actually reach.
        settleBase34(t,s);BASE_START_HUNT34(t,s,p);if(s.hunt)delete s.hunt._descentGoal33;
      }else if(s.hunt?._descentLock34)s.hunt._descentLock34.retries=retries;
    }
  }else if(s.hunt&&!validTarget34(t,s,p))delete s.hunt._descentLock34;
  return r;
};

window.__JT34_BEHAVIOR={armDescent34,lowestRoute34,setMotionFacing34};
})();
// ================= end v34 =================
