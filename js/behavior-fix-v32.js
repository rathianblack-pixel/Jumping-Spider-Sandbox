// ================= v32 climb + hunger + safe feeding/molting =================
(function(){
'use strict';
const BASE_ROUTE32=route,BASE_FOLLOW32=followRoute,BASE_ADD32=addDecor,BASE_UPD32=updSpider,BASE_SAFE32=safeSpot;
const PHYS32=window.__JT31_PHYS;
if(!PHYS32)return;
const {surf31,nearestPhysical31}=PHYS32;

function decor32(t,id){return id==null?null:t.decor.find(d=>d.id===id)||null;}
function inferDecor32(t,p){let best=null,bd=1e9;for(const d of t.decor){const S=surf31(t,d);if(!S)continue;for(const a of S.anchors||[]){const x=vdist(p,a.pt);if(x<bd){bd=x;best=d;}}for(const path of S.paths||[])for(const q of path.pts){const x=vdist(p,q);if(x<bd){bd=x;best=d;}}}return bd<10?best:null;}
function normalizeSurf32(t,s,p){if(!s||!['perch','climb'].includes(s.t)||s.id!=null)return s;const d=inferDecor32(t,p);return d?{t:s.t,id:d.id}:s;}

// Export renderer-authored physical anchors as navigation perches when a plant did
// not create enough of its own. This removes fake center-air nodes from smart hunts.
function syncPerches32(t,d){if(!d||d._perches32)return;const D=DECOR[d.type],S=surf31(t,d);if(!D||D.kind!=='plant'||!S)return;d._perches32=true;if((d.perches||[]).length>=2)return;const a=(S.anchors||[]).slice().sort((x,y)=>y.pt.y-x.pt.y);const add=[];for(const q of a){if(add.some(p=>vdist(p,q.pt)<2.2))continue;add.push(vc(q.pt));if(add.length>=4)break;}for(const q of add)d.perches.push(q);}
for(const t of G.tanks||[])for(const d of t.decor||[])syncPerches32(t,d);
addDecor=function(t,type,x,z,rot=0,seed){const d=BASE_ADD32(t,type,x,z,rot,seed);if(d)syncPerches32(t,d);return d;};

function graphPath32(S,start,goal){const nodes=[],adj=[];for(let pi=0;pi<(S.paths||[]).length;pi++){const path=S.paths[pi],ids=[];for(let j=0;j<path.pts.length;j++){ids.push(nodes.length);nodes.push({pt:path.pts[j],pi,j});adj.push([]);}for(let j=1;j<ids.length;j++){const a=ids[j-1],b=ids[j],w=vdist(nodes[a].pt,nodes[b].pt);adj[a].push([b,w]);adj[b].push([a,w]);}}
 if(!nodes.length)return [];
 // Physical paths often meet at a trunk/root without sharing the same array.
 for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){if(nodes[i].pi===nodes[j].pi)continue;const d=vdist(nodes[i].pt,nodes[j].pt);if(d<=2.4){adj[i].push([j,d+.05]);adj[j].push([i,d+.05]);}}
 let si=0,gi=0,sd=1e9,gd=1e9;for(let i=0;i<nodes.length;i++){let d=vdist(nodes[i].pt,start);if(d<sd){sd=d;si=i;}d=vdist(nodes[i].pt,goal);if(d<gd){gd=d;gi=i;}}
 const N=nodes.length,dist=new Array(N).fill(Infinity),prev=new Array(N).fill(-1),used=new Array(N).fill(false);dist[si]=0;
 for(let k=0;k<N;k++){let u=-1,b=Infinity;for(let i=0;i<N;i++)if(!used[i]&&dist[i]<b){b=dist[i];u=i;}if(u<0||u===gi)break;used[u]=true;for(const [v,w] of adj[u]){const nd=b+w;if(nd<dist[v]){dist[v]=nd;prev[v]=u;}}}
 if(!Number.isFinite(dist[gi]))return [];
 const ids=[];for(let u=gi;u>=0;u=prev[u]){ids.push(u);if(u===si)break;}ids.reverse();const pts=[];for(let k=0;k<ids.length;k++){if(k===0||k===ids.length-1||k%2===0)pts.push(vc(nodes[ids[k]].pt));}return pts;
}
function lowEntry32(S,goal){let best=null,bs=1e9;for(const path of S.paths||[])for(const p of path.pts){const sc=p.y*8+Math.hypot(p.x-goal.x,p.z-goal.z)*.08;if(sc<bs){bs=sc;best=p;}}return best?vc(best):null;}
function physicalRoute32(t,e,d,toS,toP,hopRange){const S=surf31(t,d);if(!S||!(S.paths||[]).length)return null;const frame=nearestPhysical31(t,d,toP,false),goal=frame?vc(frame.pt):vc(toP);let curSurf=normalizeSurf32(t,e.surf,e.pos);if(curSurf!==e.surf)e.surf=curSurf;
 const sameObj=['perch','climb'].includes(e.surf?.t)&&e.surf.id===d.id;
 if(!sameObj&&e.kind==='spider'&&hopRange>0&&vdist(e.pos,goal)<=hopRange*.96&&LOS(t,e.pos,goal))return [{surf:{t:'perch',id:d.id},pt:goal,hop:true,surface32:true}];
 const start=sameObj?vc(e.pos):lowEntry32(S,goal);if(!start)return null;const chain=graphPath32(S,start,goal);let out=[];
 if(!sameObj){let baseY=d.baseY31||0,baseSurf=S_FLOOR,basePt=v3(start.x,baseY,start.z);const parent=decor32(t,d.parent31);if(parent){baseSurf={t:'plat',id:parent.id};basePt.y=parent.h;basePt.x=clamp(basePt.x,parent.x0+.6,parent.x1-.6);basePt.z=clamp(basePt.z,parent.z0+.6,parent.z1-.6);}else{const g=groundAt(t,start.x,start.z);baseSurf=g.p?{t:'plat',id:g.p.id}:S_FLOOR;basePt.y=g.h;}
   out=BASE_ROUTE32(t,e,baseSurf,basePt,hopRange)||[];if(!out.length&&vdist(e.pos,basePt)>2)return null;
   if(vdist(basePt,start)>1.2)out.push({surf:{t:'climb',id:d.id},pt:vc(start),climb:true,surface32:true});
 }
 const pts=chain.length?chain:[goal];for(let i=0;i<pts.length;i++){const p=pts[i];if(toS.t!=='climb'&&i===pts.length-1&&vdist(p,goal)<1.1)continue;const f=nearestPhysical31(t,d,p,true),q=f?vc(f.pt):vc(p);if(out.length&&vdist(out[out.length-1].pt,q)<.35)continue;out.push({surf:{t:'climb',id:d.id},pt:q,climb:true,surface32:true});}
 if(toS.t==='climb'){const f=nearestPhysical31(t,d,goal,true),q=f?vc(f.pt):goal;if(!out.length||vdist(out[out.length-1].pt,q)>.25)out.push({surf:{t:'climb',id:d.id},pt:q,climb:true,surface32:true});return out;}
 out.push({surf:{t:'perch',id:d.id},pt:goal,surface32:true});return out;
}

route=function(t,e,toS,toP,hopRange=0){toS=normalizeSurf32(t,toS,toP);if(toS?.t==='perch'||toS?.t==='climb'){const d=decor32(t,toS.id);if(d){const r=physicalRoute32(t,e,d,toS,toP,hopRange);if(r)return r;}}return BASE_ROUTE32(t,e,toS,toP,hopRange);};

// v31's general snapper is ideal for keeping arbitrary entities on a surface, but
// a deliberate plant-climb route already consists of points on the visible stem/
// branch/frond. Walk those segments parametrically so snapping cannot pull the
// spider back to the previous point on a curved stalk.
followRoute=function(t,e,spd,dt,lockFace){const seg=e?.route&&e.route[0];if(!seg?.surface32||seg.hop){if(e)e._surfaceRoute32=false;return BASE_FOLLOW32(t,e,spd,dt,lockFace);}e._surfaceRoute32=true;if(!sameSurf(e.surf,seg.surf))e.surf=seg.surf;const d=vsub(seg.pt,e.pos),L=vlen(d),step=spd*dt*(seg.climb?.64:.78);if(L<=Math.max(step,.01)+.03){e.pos=vc(seg.pt);e.route.shift();const D=decor32(t,e.surf.id);if(D){const f=nearestPhysical31(t,D,e.pos,true);if(f){e._surface31=f;e._surface25={id:D.id,normal:vc(f.normal),tangent:vc(f.tangent)};}}return !e.route.length;}if(step<=0||L<1e-6)return false;const nd=vmul(d,1/L);e.pos=vadd(e.pos,vmul(nd,step));e.moved=(e.moved||0)+step;e.face=vnorm(d);const D=decor32(t,e.surf.id);if(D){const f=nearestPhysical31(t,D,e.pos,true);if(f){e._surface31=f;e._surface25={id:D.id,normal:vc(f.normal),tangent:vc(f.tangent)};}}if(e.kind==='spider'&&window.__JT20_LOCOMOTION){window.__JT20_LOCOMOTION.ensureLocomotion20(e);e._walkPhase20+=step*(.48+spSize(e)*.012);e._probe20=Math.max(e._probe20||0,.25);}return false;};

// Let plant-loving species actually climb distant foliage instead of only visiting its base.
if(typeof preferredWander20==='function'){
 const BASE_PREF32=preferredWander20;
 preferredWander20=function(t,s){const b=speciesBehavior20(s);if(rand()<Math.max(.12,b.plants*.78)){const ds=t.decor.filter(d=>DECOR[d.type]?.kind==='plant'&&(surf31(t,d)?.anchors||[]).length);if(ds.length){const d=pick(ds),A=surf31(t,d).anchors.slice().sort((a,b)=>b.pt.y-a.pt.y),pool=A.slice(0,Math.max(1,Math.ceil(A.length*.45))),a=pick(pool);return {surf:{t:'perch',id:d.id},pt:vc(a.pt)};}}return BASE_PREF32(t,s);};
}

function quietness32(t,s,p){let other=90;for(const o of t.spiders)if(o!==s&&!o.owner)other=Math.min(other,vdist(p,o.pos));let prey=70;for(const q of t.prey)if(!q.owner&&!q.dead)prey=Math.min(prey,vdist(p,q.pos));return Math.min(90,other)*.55+Math.min(70,prey)*.16;}
function reachable32(t,s,c,hop=.3){let r;try{r=route(t,s,c.surf,c.pt,jumpRange(s)*hop)||[];}catch(_){return null;}if(!r.length&&vdist(s.pos,c.pt)>2)return null;return {r,L:routeLen(s,r)};}
function decorCandidates32(t,highOnly=false){const out=[];for(const d of t.decor){const D=DECOR[d.type],S=surf31(t,d);if(!D||!S)continue;if(D.kind==='plat')out.push({surf:{t:'plat',id:d.id},pt:v3(d.x,d.h,d.z),d,D,kind:'decor'});const a=(S.anchors||[]).slice().sort((x,y)=>y.pt.y-x.pt.y);if(D.kind==='plant'){const n=highOnly?1:Math.min(4,a.length);for(let i=0;i<n;i++)out.push({surf:{t:'perch',id:d.id},pt:vc(a[i].pt),d,D,kind:'plant'});}else if(!highOnly){for(const q of a)if(q.kind==='top'||q.kind==='rendererPerch')out.push({surf:{t:'perch',id:d.id},pt:vc(q.pt),d,D,kind:'decor'});}}
 return out;
}
function quietFloor32(t,s){const pts=[v3(6,0,6),v3(TW-6,0,6),v3(6,0,TD-6),v3(TW-6,0,TD-6),v3(TW*.5,0,6),v3(TW*.5,0,TD-6)];let best=null,bs=-1e9;for(const p of pts){const g=groundAt(t,p.x,p.z);if(g.p)continue;let sc=quietness32(t,s,p);if(inCover(t,p.x,p.z,0))sc+=14;sc-=hdist(s.pos,p)*.06;if(sc>bs){bs=sc;best={surf:S_FLOOR,pt:p,kind:'quiet'};}}return best||{surf:S_FLOOR,pt:randFloorPt(t),kind:'quiet'};}
function safeFeedSpot32(t,s){let best=null,bs=-1e9;for(const c of decorCandidates32(t,false)){const rr0=reachable32(t,s,c,.34);if(!rr0)continue;const plant=c.kind==='plant',cover=!!c.D.cover;let sc=c.pt.y*.62+quietness32(t,s,c.pt)-rr0.L*.055+(plant?11:5)+(cover?16:0);if(c.pt.y>s.pos.y+8)sc+=8;if(sc>bs){bs=sc;best={surf:c.surf,pt:c.pt,route32:rr0.r};}}
 const q=quietFloor32(t,s),qr=reachable32(t,s,q,.22);if(qr){const sc=quietness32(t,s,q.pt)-qr.L*.055+(inCover(t,q.pt.x,q.pt.z,0)?14:0);if(sc>bs)best={surf:q.surf,pt:q.pt,route32:qr.r};}
 return best||BASE_SAFE32(t,s)||q;
}
safeSpot=function(t,s){return safeFeedSpot32(t,s);};

function moltSpot32(t,s){let best=null,bs=-1e9;const cs=decorCandidates32(t,true);for(const c of cs){const rr0=reachable32(t,s,c,.28);if(!rr0)continue;let sc=c.pt.y*1.2+quietness32(t,s,c.pt)-rr0.L*.035+(c.kind==='plant'?18:12)+(c.D.cover?24:0);if(sc>bs){bs=sc;best={surf:c.surf,pt:c.pt,route32:rr0.r};}}
 if(best)return best;
 // Open-display habitats intentionally have no climbable glass. With no usable
 // decor/tree, choose the quietest supported substrate refuge instead of routing
 // to an invisible wall that the containment layer will reject.
 const q=quietFloor32(t,s),rr0=reachable32(t,s,q,.22);return rr0?{surf:q.surf,pt:q.pt,route32:rr0.r}:q;
}
function moltReady32(s){return s&&!s.owner&&s.stage<6&&s.meals>=3+s.stage&&s.sat>45&&!['toMolt','premolt','molt','rest'].includes(s.state);}

function hungerTarget32(t,s){const sz=spSize(s),starve=(s.sat??65)<35;let best=null,bs=-1e9;for(const p of t.prey){const P=PREY[p.type];if(!P||P.huntable===false||p.dead||p.owner||p.buried)continue;if(!starve&&(s.ignore[p.id]||0)>G.clock)continue;const tooBig=p.size>sz*(1.35+s.tr.bold*.85);if(tooBig&&!starve)continue;if(P.danger&&!starve&&s.tr.bold<.42)continue;const d=vdist(s.pos,p.pos),visible=LOS(t,eyePos(s),p.pos),moving=(p.spd||0)>2;let sc=(P.food||10)*1.5-d*.12+(visible?18:0)+(moving?3:0);if(P.danger)sc-=8;if(sc>bs){bs=sc;best=p;}}return best;}
const BASE_SCAN32=scanPrey;
scanPrey=function(t,s){const p=BASE_SCAN32(t,s);if(p)return p;if((s.sat??65)<72)return hungerTarget32(t,s);return null;};

updSpider=function(t,s,dt){
 s._surfaceRoute32=!!(s.route&&s.route[0]&&s.route[0].surface32);
 // Molting has absolute priority: cancel hunts/curiosity and immediately seek the
 // highest reachable real support. The inner v31 molt hook sees toMolt and yields.
 if(moltReady32(s)){
   if(s.hunt?.prey?.kind==='spider'&&s.hunt.prey._huntedBy===s)s.hunt.prey._huntedBy=null;
   s.hunt=null;s.route=null;s.attn=null;s._targetLock31=0;const m=moltSpot32(t,s);m.silk=0;s.retreat=m;s.route=m.route32||route(t,s,m.surf,m.pt,jumpRange(s)*.28);setSt(s,'toMolt','Pre-molt — climbing to the safest high retreat');
 }else{
   // Hungry jumpers stop aimless wandering and deliberately acquire live prey.
   const hunger=(s.sat??65)<62,can=['wander','look','rest','watch','bask','anchor','investigate','inspect','display','toRetreat'].includes(s.state)||(s.state==='sleep'&&(s.sat??65)<32);
   if(hunger&&can&&!s.owner){const p=hungerTarget32(t,s);if(p){s.route=null;s.retreat=s.state==='toRetreat'?null:s.retreat;s.hunt={prey:p};s.attn={kind:p.kind,id:p.id,pos:vc(p.pos)};startHunt(t,s,p);s.mood=`Hungry — actively hunting ${targetName(p)}`;}}
 }
 const before=s.state,r=BASE_UPD32(t,s,dt);
 // Base behavior used to carry food only when the catch happened on the floor.
 // Redirect every successful catch to the best reachable feeding refuge.
 if(before==='subdue'&&s.state==='feed'&&s.hunt?.prey?.owner===s){const q=safeFeedSpot32(t,s);if(q&&vdist(q.pt,s.pos)>2.2){s.route=q.route32||route(t,s,q.surf,q.pt,jumpRange(s)*.34);if(s.route?.length)setSt(s,'carry',q.pt.y>s.pos.y+5?'Carrying its meal up to a safe feeding perch':'Carrying its meal somewhere quiet and safe');}}
 return r;
};

window.__JT32_BEHAVIOR={physicalRoute32,safeFeedSpot32,moltSpot32,hungerTarget32,syncPerches32};
})();
// ================= end v32 =================
