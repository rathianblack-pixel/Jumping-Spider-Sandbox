// ================= v30 habitat-aware tactical route intelligence =================
// Jumpers reason over real supported decor/perch surfaces, use intermediate decor
// as stepping stones, and select elevated/rear/covered approach positions before
// the final pounce. Open-display boundaries remain non-climbable.
(function(){
'use strict';
const BASE_PLAN30=planAmbush;
const BASE_START30=startHunt;

function surfKey30(s){
  if(!s)return 'floor';
  if(s.t==='plat'||s.t==='perch'||s.t==='climb')return s.t+':'+(s.id??'');
  return s.t||'floor';
}
function sameSupport30(a,b){return surfKey30(a)===surfKey30(b);}
function smartTrait30(s){
  const b=speciesBehavior20(s),t=clamp(s.tr?.tactic??.5,0,1),p=clamp(s.tr?.patience??.5,0,1);
  return clamp(.58+t*.28+p*.08+(s.sp==='portia'?.12:0),.55,1);
}
function validSupportPt30(pt){return pt&&Number.isFinite(pt.x)&&Number.isFinite(pt.y)&&Number.isFinite(pt.z)&&pt.x>1&&pt.x<TW-1&&pt.z>1&&pt.z<TD-1&&pt.y>=0&&pt.y<TH+2;}
function pushNode30(out,seen,n){
  if(!validSupportPt30(n.pt))return;
  const k=surfKey30(n.surf)+':'+Math.round(n.pt.x*2)+':'+Math.round(n.pt.y*2)+':'+Math.round(n.pt.z*2);
  if(seen.has(k))return;seen.add(k);n.key=k;out.push(n);
}
function habitatNodes30(t,s,target){
  const out=[],seen=new Set(),tp=target?.pos||s.pos;
  for(const d of t.decor){
    const D=DECOR[d.type];if(!D)continue;
    if(D.kind==='plat'){
      const pad=Math.min(2.2,Math.max(.8,Math.min(d.w,d.d)*.12));
      const pts=[
        v3(clamp(tp.x,d.x0+pad,d.x1-pad),d.h,clamp(tp.z,d.z0+pad,d.z1-pad)),
        v3(d.x,d.h,d.z)
      ];
      // Long branches/mesas expose multiple useful launch pads rather than one center.
      if(d.w>38||d.d>28){
        if(d.w>=d.d)pts.push(v3(lerp(d.x0+pad,d.x1-pad,.22),d.h,d.z),v3(lerp(d.x0+pad,d.x1-pad,.78),d.h,d.z));
        else pts.push(v3(d.x,d.h,lerp(d.z0+pad,d.z1-pad,.22)),v3(d.x,d.h,lerp(d.z0+pad,d.z1-pad,.78)));
      }
      for(const q of pts)pushNode30(out,seen,{surf:{t:'plat',id:d.id},pt:q,decor:d,plant:false,cover:!!D.cover,kind:'platform'});
    }
    // Real authored plant/decor perches are preferred launch/ambush locations.
    const pp=d.perches||[];
    for(let i=0;i<pp.length;i++){
      const q=pp[i];
      pushNode30(out,seen,{surf:{t:'perch',id:d.id},pt:vc(q),decor:d,plant:D.kind==='plant',cover:!!D.cover,kind:'perch'});
    }
    // Tall plants without many generated perches still get a stable upper support node.
    if(D.kind==='plant'&&pp.length<2&&(D.h||D.ph||0)>22){
      const h=Math.min(TH-3,(D.h||D.ph||22)*.72);
      pushNode30(out,seen,{surf:{t:'perch',id:d.id},pt:v3(d.x,h,d.z),decor:d,plant:true,cover:!!D.cover,kind:'perch'});
    }
  }
  // Keep graph bounded on very dense layouts: retain nodes most relevant to spider/target.
  if(out.length>44){
    // Preserve both ends of the problem: nearby launch surfaces and target-side
    // ambush surfaces. This keeps the graph smart without turning every hunt into
    // a large all-pairs pathfinding spike on decoration-heavy habitats.
    out.sort((a,b)=>{const as=Math.min(vdist(a.pt,s.pos)*.92,vdist(a.pt,tp)),bs=Math.min(vdist(b.pt,s.pos)*.92,vdist(b.pt,tp));return as-bs;});
    out.length=44;
  }
  return out;
}
function hopPossible30(t,s,a,b){
  const R=(typeof effectiveJumpRange31==='function'&&b.y<a.y)?effectiveJumpRange31(s,{pos:b}):jumpRange(s),d=vdist(a,b);if(d<4||d>R*.94)return false;
  const dy=b.y-a.y,hd=Math.hypot(b.x-a.x,b.z-a.z);
  if(dy>R*.62||hd>R*.92)return false;
  if(dy<-R*.9||!LOS(t,vadd(a,v3(0,spSize(s)*.18,0)),vadd(b,v3(0,spSize(s)*.12,0))))return false;
  return true;
}
function routeFromNode30(t,s,a,b){
  const fake={kind:'spider',type:null,sp:s.sp,surf:a.surf,pos:vc(a.pt),face:vc(s.face),tr:s.tr,persona:s.persona};
  try{return route(t,fake,b.surf,b.pt,jumpRange(s)*.16)||[];}catch(_){return [];}
}
function edge30(t,s,a,b){
  // If both nodes belong to the same object, stay on that object. Jumping from the
  // edge to the center of the same branch/rock looks silly and wastes energy.
  if(a.decor&&b.decor&&a.decor.id===b.decor.id){
    const segs=routeFromNode30(t,s,a,b);if(segs.length){const L=routeLen({pos:a.pt},segs);return {cost:L*1.02,segs,hop:0};}
  }
  if(hopPossible30(t,s,a.pt,b.pt)){
    const d=vdist(a.pt,b.pt),up=Math.max(0,b.pt.y-a.pt.y);
    return {cost:d*(.67+up/Math.max(1,jumpRange(s))*.18),segs:[{surf:b.surf,pt:vc(b.pt),hop:true,smartHop30:true}],hop:1};
  }
  return null;
}
function startEdge30(t,s,n){
  const curDecor=s.surf?.id!=null?t.decor.find(d=>d.id===s.surf.id):null;
  // Walk across the current object first instead of doing a pointless hop on the same decor.
  if(curDecor&&n.decor&&curDecor.id===n.decor.id){
    let segs=[];try{segs=route(t,s,n.surf,n.pt,jumpRange(s)*.12)||[];}catch(_){return null;}
    if(!segs.length&&vdist(s.pos,n.pt)>2)return null;
    return {cost:routeLen(s,segs)*1.02,segs,hop:0};
  }
  if(hopPossible30(t,s,s.pos,n.pt))return {cost:vdist(s.pos,n.pt)*.67,segs:[{surf:n.surf,pt:vc(n.pt),hop:true,smartHop30:true}],hop:1};
  let segs=[];try{segs=route(t,s,n.surf,n.pt,jumpRange(s)*.18)||[];}catch(_){return null;}
  if(!segs.length&&vdist(s.pos,n.pt)>2)return null;
  const L=routeLen(s,segs);
  // Descending from a good elevated perch just to walk across the substrate is a
  // fallback, not the preferred solution when connected decor is available.
  const elevatedNow=s.pos.y>5||['plat','perch','climb'].includes(s.surf?.t);
  const groundPenalty=elevatedNow&&segs.some(x=>x.surf?.t==='floor')?24:0;
  return {cost:L*1.12+groundPenalty,segs,hop:segs.filter(x=>x.hop).length};
}
function targetRear30(p,q){
  const f=vc(p.face||v3(1,0,0)),to=vsub(q,p.pos);f.y=0;to.y=0;
  if(vlen(f)<.01||vlen(to)<.01)return 0;
  return clamp((-vdot(vnorm(f),vnorm(to))+.15)/1.15,0,1);
}
function stageScore30(t,s,p,n,pred,pathCost,hops){
  const b=speciesBehavior20(s),R=jumpRange(s),d=vdist(n.pt,pred),rear=targetRear30(p,n.pt),elev=n.pt.y-p.pos.y;
  let sc=-pathCost*.085-Math.abs(d-R*.58)*.20;
  sc+=rear*(5+10*b.rear);
  if(elev>1)sc+=Math.min(36,elev)*(.16+.36*b.height);
  if(n.plant)sc+=2.3*b.plants;
  if(n.cover||inCover(t,n.pt.x,n.pt.z,n.pt.y))sc+=3.6*(s.tr?.stealth??.5);
  // Smart jumpers deliberately exploit one or more stepping-stone jumps, but don't
  // zig-zag forever just because more hops are available.
  if(hops>0)sc+=Math.min(3,hops)*1.9*smartTrait30(s)-Math.max(0,hops-4)*2.8;
  const directBlocked=!LOS(t,vadd(s.pos,v3(0,spSize(s)*.25,0)),p.pos);
  if(directBlocked&&hops>0)sc+=5.5;
  if(s.sp==='portia')sc+=rear*3+(n.cover?2:0)+hops*.7;
  return sc;
}
function buildSmartPath30(t,s,p,pred){
  const nodes=habitatNodes30(t,s,pred),N=nodes.length;if(!N)return null;
  const dist=new Array(N).fill(Infinity),prev=new Array(N).fill(null),startSeg=new Array(N),hops=new Array(N).fill(0),used=new Array(N).fill(false);
  // Only connect the spider into the graph through physically nearby surfaces.
  // Far-away nodes are reached by graph hops, not by doing dozens of expensive
  // floor-route probes before the search even begins.
  const order=nodes.map((n,i)=>({i,d:vdist(s.pos,n.pt),same:s.surf?.id!=null&&n.decor?.id===s.surf.id})).sort((a,b)=>(b.same-a.same)||a.d-b.d);
  const R0=jumpRange(s),starts=new Set(order.filter((x,j)=>x.same||x.d<Math.max(58,R0*1.32)||j<10).slice(0,16).map(x=>x.i));
  for(const i of starts){const e=startEdge30(t,s,nodes[i]);if(e){dist[i]=e.cost;startSeg[i]=e.segs;hops[i]=e.hop;}}
  for(let iter=0;iter<N;iter++){
    let u=-1,bd=Infinity;for(let i=0;i<N;i++)if(!used[i]&&dist[i]<bd){bd=dist[i];u=i;}if(u<0)break;used[u]=true;
    for(let v=0;v<N;v++)if(!used[v]&&v!==u){const e=edge30(t,s,nodes[u],nodes[v]);if(!e)continue;const nd=dist[u]+e.cost;if(nd<dist[v]){dist[v]=nd;prev[v]={u,e};hops[v]=hops[u]+e.hop;}}
  }
  const R=(typeof effectiveJumpRange31==='function'?effectiveJumpRange31(s,p):jumpRange(s)),sz=spSize(s);let bi=-1,bs=-1e9;
  for(let i=0;i<N;i++){
    if(!Number.isFinite(dist[i]))continue;const n=nodes[i],d=vdist(n.pt,pred);if(d>R*.98||d<sz*1.08)continue;
    if(!LOS(t,vadd(n.pt,v3(0,sz*.25,0)),p.pos))continue;
    const sc=stageScore30(t,s,p,n,pred,dist[i],hops[i]);if(sc>bs){bs=sc;bi=i;}
  }
  if(bi<0)return null;
  const chain=[];let k=bi;while(prev[k]){chain.push({to:k,from:prev[k].u,e:prev[k].e});k=prev[k].u;}chain.reverse();
  let segs=(startSeg[k]||[]).map(x=>Object.assign({},x,{pt:vc(x.pt)}));
  for(const c of chain)for(const sg of c.e.segs)segs.push(Object.assign({},sg,{pt:vc(sg.pt)}));
  const stage=nodes[bi],strategy=hops[bi]>=2?'stepping':stage.pt.y>p.pos.y+5?'high':targetRear30(p,stage.pt)>.68?'rear':'intercept';
  return {surf:stage.surf,pt:vc(stage.pt),segs,L:routeLen(s,segs),strategy,pred:vc(pred),score:bs,hops:hops[bi],stage,smart30:true};
}

planAmbush=function(t,s,p){
  if(!p)return BASE_PLAN30(t,s,p);
  const speed=Math.max(0,p.spd||0),lead=clamp(.16+speed/115,.16,.72),pred=typeof predictedTarget20==='function'?predictedTarget20(p,lead):vc(p.pos);
  pred.x=clamp(pred.x,2,TW-2);pred.z=clamp(pred.z,2,TD-2);pred.y=clamp(pred.y,0,TH-2);
  let smart=null;
  // Use graph reasoning most aggressively when elevated, obstructed, far from prey,
  // or when the habitat offers several usable perches.
  const nodes=habitatNodes30(t,s,pred),obstructed=!LOS(t,vadd(s.pos,v3(0,spSize(s)*.25,0)),p.pos),far=vdist(s.pos,p.pos)>(typeof effectiveJumpRange31==='function'?effectiveJumpRange31(s,p):jumpRange(s))*1.18,elev=s.pos.y>5||p.pos.y>5;
  if(nodes.length>=2&&(far||elev||obstructed||smartTrait30(s)>.7))smart=buildSmartPath30(t,s,p,pred);
  // The older planner remains the robust fallback when the habitat graph cannot
  // produce a supported tactical route. Avoid running both full planners when the
  // smarter graph already has a valid answer.
  const fallback=smart?null:BASE_PLAN30(t,s,p);
  let best=smart||fallback;
  if(best){
    s._plan20=best;
    s._smartPlan30=best.smart30?{hops:best.hops,stage:best.stage?.decor?.type||best.stage?.kind,strategy:best.strategy,score:best.score}:null;
  }else{s._smartPlan30=null;s._plan20=null;}
  return best;
};

startHunt=function(t,s,p){
  const r=BASE_START30(t,s,p),q=s._smartPlan30;
  if(s.hunt&&q&&q.hops>0){
    s.hunt.smart30=Object.assign({},q);
    const nm=targetName(p);
    if(q.hops>=2)s.mood=`Using ${q.hops} habitat surfaces as stepping stones toward ${nm}`;
    else if(q.strategy==='high')s.mood=`Jumping to a higher launch point above ${nm}`;
    else if(q.strategy==='rear')s.mood=`Using nearby decor to get behind ${nm}`;
    else s.mood=`Using the habitat to close on ${nm}`;
    recordJournal('ambush');
  }
  return r;
};

// Add small hunt memory for successful habitat-assisted approaches. This does not
// replace the normal state machine; it only makes later replans less repetitive.
const BASE_UPD30=updSpider;
updSpider=function(t,s,dt){
  const was=s.state,smart=s.hunt?.smart30;const r=BASE_UPD30(t,s,dt);
  if(was==='stalk'&&s.state==='crouch'&&smart?.hops){
    s.huntMemory=s.huntMemory||{};s.huntMemory.smartApproaches=(s.huntMemory.smartApproaches||0)+1;
  }
  return r;
};

window.__JT30_SMART={habitatNodes30,buildSmartPath30,hopPossible30,smartTrait30};
})();
// ================= end v30 =================
