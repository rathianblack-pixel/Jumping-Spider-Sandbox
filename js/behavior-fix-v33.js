// ================= v33 surface pose + descent hunting + robust feeding/molting =================
(function(){
'use strict';
const PHYS33=window.__JT31_PHYS,BEH32=window.__JT32_BEHAVIOR,SMART33=window.__JT30_SMART;
if(!PHYS33||!BEH32)return;
const {surf31,supportFrame31}=PHYS33;
const BASE_VIEW33=viewFor,BASE_FOLLOW33=followRoute,BASE_START_HUNT33=startHunt,BASE_UPD33=updSpider,BASE_PREY_WATCH33=preyWatching;

function decor33(t,id){return id==null?null:t.decor.find(d=>d.id===id)||null;}
function targetSize33(p){return p?.kind==='spider'?spSize(p):(p?.size||0);}
function copySurf33(s){return s?Object.assign({},s):S_FLOOR;}
function surfKey33(s,p){return `${s?.t||'floor'}:${s?.id??s?.w??''}:${Math.round((p?.x||0)*2)}:${Math.round((p?.y||0)*2)}:${Math.round((p?.z||0)*2)}`;}
function routeRemaining33(s){if(!s.route?.length)return 0;let L=0,p=s.pos;for(const q of s.route){L+=vdist(p,q.pt);p=q.pt;}return L;}
function validRoute33(t,s,surf,pt,hop=.2){let r;try{r=route(t,s,surf,pt,jumpRange(s)*hop)||[];}catch(_){return null;}if(!r.length&&vdist(s.pos,pt)>2.2)return null;return {route:r,L:routeLen(s,r)};}
function quiet33(t,s,p){let a=95,b=72;for(const o of t.spiders)if(o!==s&&!o.owner&&!o._gone)a=Math.min(a,vdist(p,o.pos));for(const q of t.prey)if(!q.owner&&!q.dead)b=Math.min(b,vdist(p,q.pos));return Math.min(95,a)*.42+Math.min(72,b)*.12;}
function failMap33(s,k){return s[k]||(s[k]=Object.create(null));}
function failed33(s,k,key){const M=failMap33(s,k),v=M[key]||0;return v>G.clock;}
function markFailed33(s,k,key,ttl=18){failMap33(s,k)[key]=G.clock+ttl;}

// ----- 1) unified surface-relative movement direction for every climbing critter -----
followRoute=function(t,e,spd,dt,lockFace){
  const before=e?.pos?vc(e.pos):null,seg=e?.route?.[0]||null;
  const r=BASE_FOLLOW33(t,e,spd,dt,lockFace);
  if(!e||!before)return r;
  const delta=vsub(e.pos,before),moved=vlen(delta);
  if(['climb','perch'].includes(e.surf?.t)){
    let dir=moved>.003?vnorm(delta):null;
    if(!dir&&seg&&seg.pt){const d=vsub(seg.pt,e.pos);if(vlen(d)>.03)dir=vnorm(d);}
    if(!dir&&e.face&&vlen(e.face)>.03)dir=vnorm(e.face);
    if(dir){e._motionTangent33=dir;e.face=vc(dir);if(e._surface25)e._surface25.tangent=vc(dir);}
  }
  return r;
};

// Side sprites are intrinsically horizontal, so a vertical trunk made climbers look
// as if they were sliding sideways. On an actual climb surface use the dorsal/ventral
// renderer, which honors the projected movement angle, and orient it with the real
// movement tangent (including the sign, so descending faces head-down).
viewFor=function(e,c){
  if(!e||!['climb','perch'].includes(e.surf?.t))return BASE_VIEW33(e,c);
  const t=cur(),f=supportFrame31(t,e);if(!f)return BASE_VIEW33(e,c);
  let dir=null,seg=e.route?.[0];
  if(seg&&seg.pt&&sameSurf(e.surf,seg.surf)){const d=vsub(seg.pt,e.pos);if(vlen(d)>.04)dir=vnorm(d);}
  if(!dir&&e._motionTangent33&&vlen(e._motionTangent33)>.03)dir=vnorm(e._motionTangent33);
  if(!dir&&e.face&&vlen(e.face)>.03)dir=vnorm(e.face);
  if(!dir)dir=vnorm(f.tangent||v3(1,0,0));
  // For a stopped critter, choose the path tangent sign closest to its last facing.
  if(f.tangent&&vlen(f.tangent)>.03&&Math.abs(dir.y)<.08&&Math.abs(f.tangent.y)>.2){let q=vnorm(f.tangent);if(e.face&&vdot(q,e.face)<0)q=vmul(q,-1);dir=q;}
  const a=Pv(e.pos,c),b=Pv(vadd(e.pos,vmul(dir,5)),c),ang=Math.atan2(b[1]-a[1],b[0]-a[0]);
  let sight=viewDir(c);if(vlen(sight)<.01)sight=v3(.6,0,.6);sight=vnorm(v3(sight.x,.62,sight.z));
  const normal=f.normal&&vlen(f.normal)>.02?vnorm(f.normal):v3(0,1,0),front=clamp(vdot(normal,sight),-1,1);
  const steep=e.surf.t==='climb'||Math.abs(dir.y)>.18;
  if(!steep)return BASE_VIEW33(e,c);
  return {view:front<-.38?'belly':'top',ang,front,flip:false,surface33:true};
};

// ----- 2) explicit descent staging before hunts that begin too high above prey -----
function physicalLowerCandidates33(t,s,p){
  const same=[],hops=[],routes=[],seen=new Set(),minDrop=Math.max(6,(s.pos.y-p.pos.y)*.18),maxY=s.pos.y-minDrop,idealY=p.pos.y+Math.min(12,jumpRange(s)*.2);
  const d=decor33(t,s.surf?.id),onPhysicalPlant=['climb','perch'].includes(s.surf?.t)&&!!d;
  if(d&&['climb','perch','plat'].includes(s.surf?.t)){
    const S=surf31(t,d);
    for(const path of S?.paths||[])for(const q0 of path.pts){const q=vc(q0);if(q.y>maxY||q.y<Math.max(1,p.pos.y-4))continue;const key=`same:${Math.round(q.x)}:${Math.round(q.y)}:${Math.round(q.z)}`;if(seen.has(key))continue;seen.add(key);let rr0;try{rr0=route(t,s,{t:'climb',id:d.id},q,jumpRange(s)*.08)||[];}catch(_){continue;}if(!rr0.length&&vdist(s.pos,q)>2.2)continue;const sc=Math.hypot(q.x-p.pos.x,q.z-p.pos.z)*.32+Math.abs(q.y-idealY)*.38+routeLen(s,rr0)*.06;same.push({surf:{t:'climb',id:d.id},pt:q,route:rr0,score:sc,mode:'climb'});}
  }
  for(const n of SMART33?.habitatNodes30?.(t,s,p?.pos)||[]){
    if(n.pt.y>maxY||n.pt.y<Math.max(0,p.pos.y-3))continue;
    const key=`node:${surfKey33(n.surf,n.pt)}`;if(seen.has(key))continue;seen.add(key);
    if(SMART33?.hopPossible30?.(t,s,s.pos,n.pt)){
      const rr0=[{surf:n.surf,pt:vc(n.pt),hop:true,smartHop30:true,surface33:true}],sc=Math.hypot(n.pt.x-p.pos.x,n.pt.z-p.pos.z)*.55+Math.abs(n.pt.y-idealY)*.24+vdist(s.pos,n.pt)*.08;
      hops.push({surf:n.surf,pt:vc(n.pt),route:rr0,score:sc,mode:'hop'});continue;
    }
    // From a branch/stem, never use the old generic leave-decor route as the first
    // descent step: it contains an air-line to a decor edge that the physical snapper
    // correctly rejects. Climb down the current structure first, then re-plan.
    if(onPhysicalPlant)continue;
    let rr0=null;try{rr0=route(t,s,n.surf,n.pt,jumpRange(s)*.12)||[];}catch(_){rr0=null;}
    if(!rr0||(!rr0.length&&vdist(s.pos,n.pt)>2.2))continue;const supportPenalty=n.surf?.t==='floor'?16:(n.plant?0:3),sc=Math.hypot(n.pt.x-p.pos.x,n.pt.z-p.pos.z)*.68+Math.abs(n.pt.y-idealY)*.28+routeLen(s,rr0)*.1+supportPenalty;routes.push({surf:n.surf,pt:vc(n.pt),route:rr0,score:sc,mode:'route'});
  }
  same.sort((a,b)=>a.score-b.score);hops.sort((a,b)=>a.score-b.score);routes.sort((a,b)=>a.score-b.score);
  // A clean downward jump to another support is natural; otherwise descend on the
  // structure currently under the animal before considering a substrate route.
  if(hops.length&&(!same.length||hops[0].score<same[0].score*.82))return [hops[0],...same,...hops.slice(1),...routes];
  if(same.length)return [...same,...hops,...routes];
  if(routes.length)return [...hops,...routes];
  // Last resort: intentionally climb/step down to substrate near the current support.
  const q=v3(clamp(s.pos.x,3,TW-3),0,clamp(s.pos.z,3,TD-3));try{const rr0=route(t,s,S_FLOOR,q,jumpRange(s)*.08)||[];if(rr0.length)return [{surf:S_FLOOR,pt:q,route:rr0,score:999,mode:'climb'}];}catch(_){}
  return [];
}
function chooseDescent33(t,s,p,steps=0){
  if(!p||steps>=4||s.pos.y<=p.pos.y+11)return null;
  const R=typeof effectiveJumpRange31==='function'?effectiveJumpRange31(s,p):jumpRange(s),d=vdist(s.pos,p.pos),los=LOS(t,vadd(s.pos,v3(0,spSize(s)*.18,0)),p.pos);
  // Keep a genuinely useful high ambush; descend only when height is preventing a sensible attack.
  if(los&&d<=R*.88)return null;
  return physicalLowerCandidates33(t,s,p)[0]||null;
}
function physicalExitToBase33(t,s){
  const d=decor33(t,s.surf?.id),S=d&&surf31(t,d);if(!d||!S?.paths?.length)return null;
  let low=null,score=1e9;for(const path of S.paths)for(const q0 of path.pts){const q=vc(q0),sc=q.y*100+Math.hypot(q.x-s.pos.x,q.z-s.pos.z)*.04;if(sc<score){score=sc;low=q;}}
  if(!low)return null;let r=[];try{r=BEH32.physicalRoute32(t,s,d,{t:'climb',id:d.id},low,0)||[];}catch(_){r=[];}
  let baseSurf=S_FLOOR,basePt=v3(low.x,0,low.z),parent=decor33(t,d.parent31);
  if(parent){baseSurf={t:'plat',id:parent.id};basePt=v3(clamp(low.x,parent.x0+.6,parent.x1-.6),parent.h,clamp(low.z,parent.z0+.6,parent.z1-.6));}
  else{const g=groundAt(t,low.x,low.z);baseSurf=g.p?{t:'plat',id:g.p.id}:S_FLOOR;basePt=v3(low.x,g.h,low.z);}
  const tailDist=vdist(low,basePt);if(tailDist>.25||!sameSurf({t:'climb',id:d.id},baseSurf))r.push({surf:baseSurf,pt:basePt,climb:true,surface32:true,exit33:true});
  return r.length?r:null;
}
startHunt=function(t,s,p){
  const prevSteps=s.hunt?._descentSteps33||0,r=BASE_START_HUNT33(t,s,p);if(!s.hunt||!p)return r;
  const down=chooseDescent33(t,s,p,prevSteps);if(down&&down.route?.length){s.route=down.route;s.hunt._descentSteps33=prevSteps+1;s.hunt._descentGoal33={surf:down.surf,pt:vc(down.pt)};const nm=targetName(p);setSt(s,'stalk',down.mode==='hop'?`Jumping down to a lower perch before stalking ${nm}`:`Climbing down for a better hunting angle on ${nm}`);s.mood=s.state==='stalk'?s.mood:s.mood;}
  else s.hunt._descentSteps33=prevSteps;
  return r;
};

// During an intentional descent the prey noticing the spider should not freeze the
// animal halfway down a trunk. The spider has already committed to repositioning.
preyWatching=function(p,s){if(s?.hunt?._descentGoal33&&s.route?.length&&s.state==='stalk')return false;return BASE_PREY_WATCH33(p,s);};

// ----- 3) safe feeding candidates with real support quality + fail-safe completion -----
function nearestPathWidth33(S,p){let best=1e9,w=1;for(const path of S?.paths||[])for(let i=1;i<path.pts.length;i++){const a=path.pts[i-1],b=path.pts[i],ab=vsub(b,a),L2=vdot(ab,ab)||1,u=clamp(vdot(vsub(p,a),ab)/L2,0,1),q=vadd(a,vmul(ab,u)),d=vdist(p,q);if(d<best){best=d;w=path.width||1;}}return w;}
function anchorQuality33(a,D,width,meal,spider){let q=6;if(a.kind==='branchTip')q=21;else if(a.kind==='leafTip')q=16;else if(a.kind==='top'||a.kind==='rendererPerch')q=18;else if(a.kind==='perch')q=13;else if(a.kind==='flower')q=2;else if(a.kind==='bladeTip')q=1;q+=Math.min(8,width*1.5);const large=meal>spider*.55;if(large&&(a.kind==='flower'||a.kind==='bladeTip'))q-=28;if(D?.cover)q+=8;return q;}
function feedCandidates33(t,s,p){
  const out=[],meal=targetSize33(p),ss=spSize(s);
  for(const d of t.decor){const D=DECOR[d.type],S=surf31(t,d);if(!D||!S)continue;
    if(D.kind==='plat'){const pad=Math.min(2.5,Math.max(.8,Math.min(d.w,d.d)*.15)),q=v3(clamp(s.pos.x,d.x0+pad,d.x1-pad),d.h,clamp(s.pos.z,d.z0+pad,d.z1-pad));out.push({surf:{t:'plat',id:d.id},pt:q,quality:24+(D.cover?8:0),kind:'platform'});}
    const A=(S.anchors||[]).slice().sort((a,b)=>b.pt.y-a.pt.y).slice(0,8);for(const a of A){const width=nearestPathWidth33(S,a.pt),quality=anchorQuality33(a,D,width,meal,ss);out.push({surf:{t:'perch',id:d.id},pt:vc(a.pt),quality,kind:a.kind||'perch'});}
  }
  return out;
}
function quietFloorSpot33(t,s){const pts=[v3(6,0,6),v3(TW-6,0,6),v3(6,0,TD-6),v3(TW-6,0,TD-6),v3(TW*.5,0,6),v3(TW*.5,0,TD-6),v3(TW*.5,0,TD*.5)];let best=null,bs=-1e9;for(const p of pts){const g=groundAt(t,p.x,p.z);if(g.p)continue;let sc=quiet33(t,s,p)+(inCover(t,p.x,p.z,0)?12:0)-hdist(s.pos,p)*.05;if(sc>bs){bs=sc;best={surf:S_FLOOR,pt:p};}}return best||{surf:S_FLOOR,pt:randFloorPt(t)};}
function safeFeedSpot33(t,s,p){
  let best=null,bs=-1e9;for(const c of feedCandidates33(t,s,p)){const key=surfKey33(c.surf,c.pt);if(failed33(s,'_carryFails33',key))continue;const rr0=validRoute33(t,s,c.surf,c.pt,.30);if(!rr0||rr0.L>170)continue;let sc=c.quality+c.pt.y*.42+quiet33(t,s,c.pt)-rr0.L*.07;if(c.pt.y>s.pos.y+6)sc+=4;if(sc>bs){bs=sc;best={surf:c.surf,pt:c.pt,route33:rr0.route,key,score:sc};}}
  const q=quietFloorSpot33(t,s),qr=validRoute33(t,s,q.surf,q.pt,.16);if(qr){const sc=quiet33(t,s,q.pt)-qr.L*.055+(inCover(t,q.pt.x,q.pt.z,0)?12:0);if(sc>bs)best={surf:q.surf,pt:q.pt,route33:qr.route,key:surfKey33(q.surf,q.pt),score:sc};}
  return best;
}
function startFeedingHere33(s,msg='Feeding at the nearest safe supported spot'){
  s.route=null;s._carryGoal33=null;s._carryWatch33=null;if(s.hunt){s.hunt.feedT=0;setSt(s,'feed',msg);}
}
function initCarry33(t,s){const p=s.hunt?.prey;if(!p||p.owner!==s)return startFeedingHere33(s,'Feeding here');const q=safeFeedSpot33(t,s,p);if(!q||vdist(q.pt,s.pos)<2.0||!q.route33?.length)return startFeedingHere33(s,'Feeding at a safe supported spot');s.route=q.route33;s._carryGoal33={surf:q.surf,pt:vc(q.pt),key:q.key};s._carryWatch33={elapsed:0,stalled:0,best:routeRemaining33(s),replans:0};s.mood=q.pt.y>s.pos.y+4?'Carrying its meal to a secure feeding perch':'Carrying its meal somewhere quiet and safe';}
function monitorCarry33(t,s,dt){
  if(s.state!=='carry'){s._carryWatch33=null;s._carryGoal33=null;return;}
  if(!s.hunt?.prey||s.hunt.prey.owner!==s)return startFeedingHere33(s,'Feeding here');
  if(!s._carryGoal33)initCarry33(t,s);if(s.state!=='carry')return;
  const W=s._carryWatch33||(s._carryWatch33={elapsed:0,stalled:0,best:routeRemaining33(s),replans:0}),rem=routeRemaining33(s);W.elapsed+=dt;
  if(rem<W.best-.25){W.best=rem;W.stalled=0;}else W.stalled+=dt;
  if(!s.route?.length)return startFeedingHere33(s,'Reached a safe feeding spot');
  if(W.stalled>2.0||W.elapsed>11){const goal=s._carryGoal33;if(goal)markFailed33(s,'_carryFails33',goal.key,20);W.replans++;
    if(W.replans<=1){const q=safeFeedSpot33(t,s,s.hunt.prey);if(q&&q.route33?.length){s.route=q.route33;s._carryGoal33={surf:q.surf,pt:vc(q.pt),key:q.key};W.elapsed=0;W.stalled=0;W.best=routeRemaining33(s);s.mood='Re-routing its meal to a reachable feeding refuge';return;}}
    startFeedingHere33(s,'Could not improve the route — feeding safely here instead');
  }
}

// ----- 4) latched molt readiness + guaranteed retreat/fallback -----
function moltLatched33(s){return !!(s&&!s.owner&&s.stage<6&&s.meals>=3+s.stage);}
function moltCandidates33(t,s){
  const out=[];for(const d of t.decor){const D=DECOR[d.type],S=surf31(t,d);if(!D||!S)continue;
    if(D.kind==='plat'){const p=v3(d.x,d.h,d.z);out.push({surf:{t:'plat',id:d.id},pt:p,quality:18+(D.cover?12:0),kind:'platform'});}
    for(const a of (S.anchors||[]).slice().sort((x,y)=>y.pt.y-x.pt.y).slice(0,7)){let q=a.kind==='branchTip'?20:a.kind==='leafTip'?17:a.kind==='top'||a.kind==='rendererPerch'?18:a.kind==='perch'?13:a.kind==='flower'?2:a.kind==='bladeTip'?1:8;if(D.cover)q+=12;out.push({surf:{t:'perch',id:d.id},pt:vc(a.pt),quality:q,kind:a.kind});}
  }return out;
}
function moltSpot33(t,s){
  let best=null,bs=-1e9;for(const c of moltCandidates33(t,s)){const key=surfKey33(c.surf,c.pt);if(failed33(s,'_moltFails33',key))continue;const rr0=validRoute33(t,s,c.surf,c.pt,.24);if(!rr0)continue;let sc=c.pt.y*1.25+c.quality+quiet33(t,s,c.pt)-rr0.L*.035;if(sc>bs){bs=sc;best={surf:c.surf,pt:c.pt,route33:rr0.route,key};}}
  if(best)return best;const q=quietFloorSpot33(t,s),rr0=validRoute33(t,s,q.surf,q.pt,.12);return {surf:q.surf,pt:q.pt,route33:rr0?.route||[],key:surfKey33(q.surf,q.pt)};
}
function beginMolt33(t,s,replan=false){
  if(s.hunt?.prey?.kind==='spider'&&s.hunt.prey._huntedBy===s)s.hunt.prey._huntedBy=null;s.hunt=null;s.attn=null;s._targetLock31=0;s._resumeTarget=null;
  const q=moltSpot33(t,s);s.retreat={surf:q.surf,pt:vc(q.pt),silk:s.retreat?.silk||0};s.route=q.route33||[];s._moltGoal33={surf:q.surf,pt:vc(q.pt),key:q.key};s._moltWatch33={elapsed:0,stalled:0,best:routeRemaining33(s),replans:replan?1:0};
  if(!s.route.length||vdist(s.pos,q.pt)<1.8){s.route=null;setSt(s,'premolt','Pre-molt — secured a safe retreat and stopped all activity');}
  else setSt(s,'toMolt',q.pt.y>s.pos.y+4?'Pre-molt — climbing to a secure high retreat':'Pre-molt — moving to a quiet secure retreat');
}
function monitorMolt33(t,s,dt){
  if(!s._moltLatched33)return;
  if(s.state==='premolt'||s.state==='molt')return;
  if(s.state!=='toMolt')return beginMolt33(t,s,false);
  const W=s._moltWatch33||(s._moltWatch33={elapsed:0,stalled:0,best:routeRemaining33(s),replans:0}),rem=routeRemaining33(s);W.elapsed+=dt;if(rem<W.best-.22){W.best=rem;W.stalled=0;}else W.stalled+=dt;
  if(!s.route?.length){setSt(s,'premolt','Pre-molt — sealed into its retreat');return;}
  if(W.stalled>2.2||W.elapsed>14){if(s._moltGoal33)markFailed33(s,'_moltFails33',s._moltGoal33.key,30);if(W.replans<1){beginMolt33(t,s,true);return;}
    // Biology wins over navigation perfection: a supported current position is a valid emergency retreat.
    s.route=null;s.retreat={surf:copySurf33(s.surf),pt:vc(s.pos),silk:s.retreat?.silk||0};setSt(s,'premolt','Pre-molt — using the safest reachable supported spot');
  }
}

updSpider=function(t,s,dt){
  const oldStage=s.stage;
  // Preserve a deliberate down-route long enough to complete it. Older stalk logic
  // periodically replans toward the prey and can otherwise overwrite the descent or
  // give up because line-of-sight is briefly lost behind the trunk/decor.
  if(s.state==='stalk'&&s.hunt?._descentGoal33){
    if(s.route?.length){
      s.hunt.lost=0;s.hunt.liveT=Math.max(s.hunt.liveT||0,.45);s.hunt.cool=Math.max(s.hunt.cool||0,.45);
      // Deliberate repositioning is part of one hunt, not time spent failing to find prey.
      // Keep the hunt budget fresh while the animal is physically descending.
      s.hunt.t0=G.clock;
    }else{
      // The staged descent finished. Immediately re-plan from the new lower support
      // instead of letting the legacy stalk loop accrue lost-LOS time behind the trunk.
      const p=s.hunt.prey,steps=s.hunt._descentSteps33||0;
      if(targetValid(t,s,p)&&['climb','perch'].includes(s.surf?.t)&&s.pos.y>p.pos.y+2){
        const ex=physicalExitToBase33(t,s);if(ex?.length){s.route=ex;s.hunt.lost=0;s.hunt.t0=G.clock;s.hunt.liveT=.5;s.hunt._descentSteps33=steps;s.mood=`Climbing all the way down before continuing the hunt for ${targetName(p)}`;}
        else delete s.hunt._descentGoal33;
      }else{
        delete s.hunt._descentGoal33;
        if(targetValid(t,s,p)){s.hunt.lost=0;s.hunt.t0=G.clock;s.hunt._descentSteps33=steps;startHunt(t,s,p);}
      }
    }
  }
  // Occlusion by the very terrain being used for a stalk must not make the hunter
  // forget a still-valid target while it is demonstrably progressing along a route.
  if(s.state==='stalk'&&s.hunt?.prey&&s.route?.length&&targetValid(t,s,s.hunt.prey)){
    const rem=routeRemaining33(s),W=s.hunt._routeProgress33||(s.hunt._routeProgress33={best:rem,t:G.clock});
    if(rem<W.best-.22){W.best=rem;W.t=G.clock;}
    if(G.clock-W.t<3.2)s.hunt.lost=Math.min(s.hunt.lost||0,.12);
  }
  if(moltLatched33(s))s._moltLatched33=true;
  if(s._moltLatched33&&!['subdue','carry','feed'].includes(s.state)&&!['toMolt','premolt','molt'].includes(s.state))beginMolt33(t,s,false);
  // Guard the molt route before the older behavior layers can replace it with hunting/wandering.
  if(s._moltLatched33&&s.state==='toMolt'&&!s.retreat)beginMolt33(t,s,false);
  const before=s.state,r=BASE_UPD33(t,s,dt);
  // Replace the older first-choice carry destination with a clearance-aware physical refuge.
  if(s.state==='carry'&&!s._carryGoal33)initCarry33(t,s);
  monitorCarry33(t,s,dt);
  // A completed molt resets meals inside the base lifecycle. Clear the latch before
  // the post-update monitor can accidentally start a second pre-molt retreat.
  if(s.stage>oldStage){s._moltLatched33=false;s._moltWatch33=null;s._moltGoal33=null;s._moltFails33=Object.create(null);}
  else monitorMolt33(t,s,dt);
  return r;
};

window.__JT33_BEHAVIOR={safeFeedSpot33,moltSpot33,chooseDescent33,routeRemaining33};
})();
// ================= end v33 =================
