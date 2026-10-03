// ================= v36 opportunistic pounce during locked descent =================
(function(){
'use strict';
const BASE_UPD36=updSpider;

function validTarget36(t,s,p){
  try{return targetValid(t,s,p);}catch(_){return !!(p&&p!==s&&!p.dead&&!p.owner&&!p.buried);}
}
function pounceRange36(s,p){
  return typeof effectiveJumpRange31==='function'?effectiveJumpRange31(s,p):jumpRange(s);
}
function canDescentPounce36(t,s,p){
  if(!s||!p||s.jump||s.state!=='stalk'||!s.hunt?._descentLock34)return false;
  if(!['climb','perch'].includes(s.surf?.t)||!validTarget36(t,s,p))return false;
  if(p.surf?.t==='air')return false;
  const R=pounceRange36(s,p),d=vdist(s.pos,p.pos);
  // Use almost the full practical range while descending; elevation is already
  // accounted for by effectiveJumpRange31, so this stays bounded and believable.
  if(d>R*.96)return false;
  // This interrupt is for level/downward attacks. Tiny numerical height differences
  // are tolerated, but a meaningful upward attack should use the normal hunt planner.
  if(p.pos.y>s.pos.y+Math.max(2.5,R*.08))return false;
  const eye=typeof eyePos==='function'?eyePos(s):vadd(s.pos,v3(0,spSize(s)*.18,0));
  if(!LOS(t,eye,p.pos))return false;
  return true;
}
function beginDescentPounce36(s,p){
  const h=s.hunt;if(!h)return false;
  s.route=null;s._stalkFrozen=false;s.attn={kind:p.kind,id:p.id,pos:vc(p.pos)};
  delete h._descentLock34;delete h._descentGoal33;delete s._baseExit35;
  h._descentSteps33=0;h.forceCommit=true;h.aimStart=G.clock;h.aimPos=vc(p.pos);h.lastSeen=vc(p.pos);h.plan=vc(p.pos);h.lost=0;h.cool=0;h.liveT=.2;
  let aim=vsub(p.pos,s.pos);if(vlen(aim)>.02){aim=vnorm(aim);s.face=vc(aim);s._surfaceFacing34=vc(aim);s._motionTangent33=vc(aim);}
  setSt(s,'crouch',`Pounce opportunity — ${targetName(p)} is in range below`);
  return true;
}

updSpider=function(t,s,dt){
  // A locked descent owns the route, but not the hunting opportunity. If the prey
  // enters a clean, reachable pounce envelope, interrupt the descent and commit.
  const p=s?.hunt?.prey;
  if(canDescentPounce36(t,s,p))beginDescentPounce36(s,p);
  return BASE_UPD36(t,s,dt);
};

window.__JT36_BEHAVIOR={canDescentPounce36,beginDescentPounce36};
})();
// ================= end v36 =================
