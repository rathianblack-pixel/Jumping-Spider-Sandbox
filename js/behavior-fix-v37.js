// ================= v37 smart inter-object jumps + unified pounce-speed traversal =================
(function(){
'use strict';
const SMART37=window.__JT30_SMART,PHYS37=window.__JT31_PHYS;
const BASE_ROUTE37=route,BASE_START37=startHunt,BASE_UPD37=updSpider,BASE_START_JUMP37=startJump;

function objSurf37(s){return !!(s&&['plat','perch','climb'].includes(s.t)&&s.id!=null);}
function pounceSpeed37(s){const q=clamp((s?.tr?.jump!=null?s.tr.jump:SPEC[s.sp].st.jump),.1,1);return 95+q*80;}
function supportId37(s){return objSurf37(s)?s.id:null;}
function copySegs37(a){return (a||[]).map(q=>Object.assign({},q,{surf:q.surf?Object.assign({},q.surf):q.surf,pt:q.pt?vc(q.pt):q.pt}));}
function validTarget37(t,s,p){try{return targetValid(t,s,p);}catch(_){return !!(p&&p!==s&&!p.dead&&!p.owner&&!p.buried);} }
function effectiveAt37(s,p,from){
  const base=jumpRange(s),drop=Math.max(0,from.y-p.pos.y),rise=Math.max(0,p.pos.y-from.y);
  let bonus=1+clamp(drop/Math.max(18,base),0,.48)*.72;bonus*=1-clamp(rise/Math.max(20,base),0,.25);return base*bonus;
}
function clearShot37(t,s,p,from){return validTarget37(t,s,p)&&vdist(from,p.pos)<=effectiveAt37(s,p,from)*.96&&LOS(t,vadd(from,v3(0,spSize(s)*.18,0)),p.pos);}
function canHop37(t,s,a,b){
  if(!SMART37?.hopPossible30)return false;
  try{return SMART37.hopPossible30(t,s,a,b);}catch(_){return false;}
}

function decor37(t,id){return id==null?null:t.decor.find(d=>d.id===id)||null;}
function supportNodes37(t,d,toward){
  if(!d)return [];const D=DECOR[d.type],out=[],seen=new Set();
  const add=(surf,pt,kind)=>{if(!pt)return;const k=`${surf.t}:${surf.id}:${Math.round(pt.x*2)}:${Math.round(pt.y*2)}:${Math.round(pt.z*2)}`;if(seen.has(k))return;seen.add(k);out.push({surf,pt:vc(pt),kind});};
  if(D?.kind==='plat'){
    const pad=Math.max(.7,Math.min(2.2,Math.min(d.w,d.d)*.12)),x=toward?clamp(toward.x,d.x0+pad,d.x1-pad):d.x,z=toward?clamp(toward.z,d.z0+pad,d.z1-pad):d.z;
    add({t:'plat',id:d.id},v3(x,d.h,z),'top');add({t:'plat',id:d.id},v3(d.x,d.h,d.z),'top');
    if(d.w>=d.d){add({t:'plat',id:d.id},v3(d.x0+pad,d.h,d.z),'edge');add({t:'plat',id:d.id},v3(d.x1-pad,d.h,d.z),'edge');}
    else{add({t:'plat',id:d.id},v3(d.x,d.h,d.z0+pad),'edge');add({t:'plat',id:d.id},v3(d.x,d.h,d.z1-pad),'edge');}
  }else if(D?.kind==='plant'&&PHYS37?.surf31){
    const S=PHYS37.surf31(t,d);for(const a of S?.anchors||[])add({t:'perch',id:d.id},a.pt,'anchor');
    for(const path of S?.paths||[]){const pts=path.pts||[];if(!pts.length)continue;const picks=new Set([0,pts.length-1,Math.floor((pts.length-1)*.33),Math.floor((pts.length-1)*.66)]);for(const i of picks)if(pts[i])add({t:'climb',id:d.id},pts[i],'path');}
  }
  return out;
}
function routeOnSupport37(t,e,n){
  if(vdist(e.pos,n.pt)<.8)return [];
  let r=[];try{r=BASE_ROUTE37(t,e,n.surf,n.pt,jumpRange(e)*.08)||[];}catch(_){return null;}
  if(!r.length&&vdist(e.pos,n.pt)>2)return null;
  const id=supportId37(e.surf);if(r.some(q=>q.surf?.t==='floor'||q.exit35||(q.hop&&supportId37(q.surf)!==id)))return null;
  return copySegs37(r);
}
function crossObjectRoute37(t,e,toS,toP){
  if(!objSurf37(e.surf)||!objSurf37(toS)||supportId37(e.surf)===supportId37(toS)||!toP)return null;
  if(canHop37(t,e,e.pos,toP))return [{surf:Object.assign({},toS),pt:vc(toP),hop:true,smartHop30:true,terrainHop37:true}];
  const a=decor37(t,supportId37(e.surf)),b=decor37(t,supportId37(toS));if(!a||!b)return null;
  const launches=[{surf:Object.assign({},e.surf),pt:vc(e.pos),kind:'current'},...supportNodes37(t,a,toP)],lands=[{surf:Object.assign({},toS),pt:vc(toP),kind:'goal'},...supportNodes37(t,b,e.pos)];
  let best=null,bs=1e9;
  for(const L of launches){const pre=L.kind==='current'?[]:routeOnSupport37(t,e,L);if(pre==null)continue;for(const N of lands){if(!canHop37(t,e,L.pt,N.pt))continue;
      const proxy=Object.assign({},e,{pos:vc(N.pt),surf:Object.assign({},N.surf),route:null});let tail=[];try{tail=BASE_ROUTE37(t,proxy,toS,toP,jumpRange(e)*.06)||[];}catch(_){tail=[];}
      if(tail.some(q=>q.surf?.t==='floor'||q.exit35))continue;const sc=routeLen(e,pre)+vdist(L.pt,N.pt)*.72+routeLen(proxy,tail)+(N.kind==='goal'?-5:0);if(sc<bs){bs=sc;best=[...copySegs37(pre),{surf:Object.assign({},N.surf),pt:vc(N.pt),hop:true,smartHop30:true,terrainHop37:true},...copySegs37(tail)];}
  }}
  return best;
}

// Any supported spider-to-supported-object route can transfer directly, or walk to
// a launch point on its current object and then jump across. Plants and decor use
// the same rule in every direction.
route=function(t,e,toS,toP,hopRange=0){
  if(e?.kind==='spider'&&hopRange>0&&objSurf37(e.surf)&&objSurf37(toS)&&supportId37(e.surf)!==supportId37(toS)){
    const r=crossObjectRoute37(t,e,toS,toP);if(r?.length)return r;
  }
  return BASE_ROUTE37(t,e,toS,toP,hopRange);
};

// All jumper airborne movement uses the exact same speed formula as a hunting
// pounce. Route hops, escape jumps and habitat traversal therefore no longer look
// slow compared with attacks.
startJump=function(e,to,surfTo,apex,spd){
  if(e?.kind==='spider')spd=pounceSpeed37(e);
  const r=BASE_START_JUMP37(e,to,surfTo,apex,spd);if(e?.kind==='spider'){e._jumpSpeed37=spd;if(e.jump)e.jump.speed37=spd;}return r;
};

function directTransfer37(t,s,p){
  if(!objSurf37(s.surf)||!validTarget37(t,s,p))return null;
  const curId=supportId37(s.surf),cur=decor37(t,curId),targetId=supportId37(p.surf),now=vdist(s.pos,p.pos);if(!cur)return null;
  const launches=[{surf:Object.assign({},s.surf),pt:vc(s.pos),kind:'current'},...supportNodes37(t,cur,p.pos)];
  let lands=[];
  if(targetId!=null&&targetId!==curId){const d=decor37(t,targetId);lands=d?supportNodes37(t,d,p.pos):[];}
  if(!lands.length){
    for(const d of t.decor){if(d.id===curId)continue;for(const n of supportNodes37(t,d,p.pos)){const after=vdist(n.pt,p.pos);if(after<now-2||clearShot37(t,s,p,n.pt))lands.push(n);}}
    lands.sort((a,b)=>vdist(a.pt,p.pos)-vdist(b.pt,p.pos));lands=lands.slice(0,28);
  }
  let best=null,bs=-1e9;
  for(const L of launches){const pre=L.kind==='current'?[]:routeOnSupport37(t,s,L);if(pre==null)continue;for(const N of lands){const id=supportId37(N.surf);if(id==null||id===curId||!canHop37(t,s,L.pt,N.pt))continue;
      const after=vdist(N.pt,p.pos),progress=now-after,los=LOS(t,vadd(N.pt,v3(0,spSize(s)*.18,0)),p.pos),ready=clearShot37(t,s,p,N.pt),sameTarget=targetId!=null&&id===targetId;if(progress<2.5&&!ready&&!sameTarget)continue;
      const jumpD=vdist(L.pt,N.pt),preL=routeLen(s,pre),heightFit=Math.abs(N.pt.y-p.pos.y);let sc=progress*2.8-preL*.16-jumpD*.11-heightFit*.05+(los?8:0)+(ready?30:0)+(sameTarget?60:0)+(N.kind==='anchor'?2:0);if(N.pt.y<s.pos.y)sc+=Math.min(8,(s.pos.y-N.pt.y)*.16);
      if(sc>bs){bs=sc;best={node:N,launch:L,pre,segs:[...copySegs37(pre),{surf:Object.assign({},N.surf),pt:vc(N.pt),hop:true,smartHop30:true,terrainHop37:true}],score:sc,ready,sameTarget};}
  }}
  return best;
}
function twoHopTransfer37(t,s,p){
  if(!objSurf37(s.surf)||!validTarget37(t,s,p))return null;
  const curId=supportId37(s.surf),cur=decor37(t,curId),targetId=supportId37(p.surf);if(!cur)return null;
  let finals=[];
  if(targetId!=null&&targetId!==curId){const d=decor37(t,targetId);if(d)finals=supportNodes37(t,d,p.pos);}
  if(!finals.length){for(const d of t.decor){if(d.id===curId)continue;for(const n of supportNodes37(t,d,p.pos))if(clearShot37(t,s,p,n.pt))finals.push(n);}finals.sort((a,b)=>vdist(a.pt,p.pos)-vdist(b.pt,p.pos));finals=finals.slice(0,16);}
  if(!finals.length)return null;
  const launches=[{surf:Object.assign({},s.surf),pt:vc(s.pos),kind:'current'},...supportNodes37(t,cur,p.pos)].slice(0,18);
  let best=null,bs=1e9;
  for(const md of t.decor){if(md.id===curId||md.id===targetId)continue;const mids=supportNodes37(t,md,p.pos).slice(0,14);if(!mids.length)continue;
    for(const L of launches){const pre=L.kind==='current'?[]:routeOnSupport37(t,s,L);if(pre==null)continue;
      for(const M1 of mids){if(!canHop37(t,s,L.pt,M1.pt))continue;
        for(const M2 of mids){const proxy=Object.assign({},s,{pos:vc(M1.pt),surf:Object.assign({},M1.surf),route:null});let middle=[];if(vdist(M1.pt,M2.pt)>.8){try{middle=BASE_ROUTE37(t,proxy,M2.surf,M2.pt,jumpRange(s)*.06)||[];}catch(_){continue;}if(middle.some(q=>q.surf?.t==='floor'||q.exit35||q.hop))continue;}
          for(const N of finals){if(supportId37(N.surf)===md.id||!canHop37(t,s,M2.pt,N.pt))continue;const after=vdist(N.pt,p.pos),now=vdist(s.pos,p.pos);if(after>now-2&&!clearShot37(t,s,p,N.pt)&&supportId37(N.surf)!==targetId)continue;
            const cost=routeLen(s,pre)+vdist(L.pt,M1.pt)*.72+routeLen(proxy,middle)+vdist(M2.pt,N.pt)*.72+after*.08;if(cost<bs){bs=cost;best={segs:[...copySegs37(pre),{surf:Object.assign({},M1.surf),pt:vc(M1.pt),hop:true,smartHop30:true,terrainHop37:true},...copySegs37(middle),{surf:Object.assign({},N.surf),pt:vc(N.pt),hop:true,smartHop30:true,terrainHop37:true}],midId:md.id,targetId:supportId37(N.surf),score:cost};}
          }
        }
      }
    }
  }
  return best;
}
function uniqueHopSupports37(s,segs){const seen=new Set([supportId37(s.surf)]);for(const q of segs||[])if(q.hop&&objSurf37(q.surf)){const id=supportId37(q.surf);if(seen.has(id))return false;seen.add(id);}return true;}
function smartChain37(t,s,p){
  if(!objSurf37(s.surf)||!validTarget37(t,s,p)||!SMART37?.buildSmartPath30)return null;
  let plan=null;try{plan=SMART37.buildSmartPath30(t,s,p,vc(p.pos));}catch(_){plan=null;}
  if(!plan?.segs?.length||!(plan.hops>0))return null;
  const segs=copySegs37(plan.segs),hasFloor=segs.some(q=>q.surf?.t==='floor'||q.exit35),hasCrossHop=segs.some(q=>q.hop&&objSurf37(q.surf)&&supportId37(q.surf)!==supportId37(s.surf));
  if(hasFloor||!hasCrossHop||!uniqueHopSupports37(s,segs))return null;
  const final=plan.pt||segs[segs.length-1].pt;if(final&&vdist(final,p.pos)>vdist(s.pos,p.pos)+3&&!clearShot37(t,s,p,final))return null;
  return {plan,segs};
}
function armTerrainRoute37(t,s,p,segs,label){
  if(!s.hunt||!segs?.length)return false;
  s.route=copySegs37(segs);delete s.hunt._descentGoal33;
  s.hunt._descentLock34={preyId:p.id,startY:s.pos.y,bestY:s.pos.y,bestRem:routeLen(s,s.route),stall:0,retries:0,mode:'hop'};
  s.hunt._terrainTransfer37=true;s.hunt.cool=999;s.hunt.liveT=999;s.hunt.lost=0;s.hunt.t0=G.clock;s.hunt.plan=vc(p.pos);s.hunt.creep=true;s.hunt.burst=1;s._awareT=Math.max(s._awareT||0,999);
  setSt(s,'stalk',label);return true;
}
function chooseTerrainTransfer37(t,s,p){
  if(!validTarget37(t,s,p)||!objSurf37(s.surf)||clearShot37(t,s,p,s.pos))return false;
  const d=directTransfer37(t,s,p);
  if(d){const nm=targetName(p),dest=DECOR[t.decor.find(x=>x.id===supportId37(d.node.surf))?.type]?.name||'nearby habitat';return armTerrainRoute37(t,s,p,d.segs,`Jumping across to ${dest} to close on ${nm}`);}
  const two=twoHopTransfer37(t,s,p);
  if(two){const nm=targetName(p);return armTerrainRoute37(t,s,p,two.segs,`Using a nearby habitat surface as a stepping stone toward ${nm}`);}
  const c=smartChain37(t,s,p);
  if(c){const nm=targetName(p),hops=c.plan.hops||c.segs.filter(q=>q.hop).length;return armTerrainRoute37(t,s,p,c.segs,hops>1?`Using ${hops} habitat surfaces as stepping stones toward ${nm}`:`Jumping to a better perch for ${nm}`);}
  return false;
}

startHunt=function(t,s,p){
  const r=BASE_START37(t,s,p);if(!s?.hunt||!p)return r;
  // v34/v35 may have prepared a groundward descent. Prefer a useful cross-object
  // transfer when the habitat itself offers a faster route toward the prey.
  chooseTerrainTransfer37(t,s,p);
  return r;
};

updSpider=function(t,s,dt){
  const r=BASE_UPD37(t,s,dt);
  if(s?.hunt?._terrainTransfer37&&!s.jump&&!s.route?.length){delete s.hunt._terrainTransfer37;}
  return r;
};

window.__JT37_BEHAVIOR={pounceSpeed37,directTransfer37,twoHopTransfer37,smartChain37,chooseTerrainTransfer37};
})();
// ================= end v37 =================
