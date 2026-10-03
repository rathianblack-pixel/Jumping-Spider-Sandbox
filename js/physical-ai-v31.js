// ================= v31 physical surfaces + strategic vertical AI =================
(function(){
'use strict';
const BASE_ROUTE31=route,BASE_FOLLOW31=followRoute,BASE_VIEW31=viewFor,BASE_UPD31=updSpider,BASE_AWARE31=awarenessV7,BASE_DO_PLACE31=doPlace,BASE_PLACE_OK31=placeOK,BASE_DRAW_PLAT31=drawPlat,BASE_DRAW_PLANT31=drawPlant,BASE_PLANT_BOX31=plantBox,BASE_SAFE31=safeSpot,BASE_SAVE31=save,BASE_LOAD31=load;
const TAU=Math.PI*2;
function rot31(p,d){if(!d?.rot)return vc(p);const dx=p.x-d.x,dz=p.z-d.z;return v3(d.x-dz,p.y,d.z+dx);}
function unrot31(p,d){if(!d?.rot)return vc(p);const dx=p.x-d.x,dz=p.z-d.z;return v3(d.x+dz,p.y,d.z-dx);}
function decorBy31(t,id){return t?.decor?.find(d=>d.id===id)||null;}
function segNear31(p,a,b){const ab=vsub(b,a),L2=vdot(ab,ab)||1,t=clamp(vdot(vsub(p,a),ab)/L2,0,1),q=vadd(a,vmul(ab,t));return {q,t,d:vdist(p,q),tan:vnorm(ab)};}
function addPath31(paths,pts,width=1.3,kind='stem',normal=null){if(!pts||pts.length<2)return;paths.push({pts:pts.map(vc),width,kind,normal});}
function addAnchor31(anchors,pt,tan,normal,kind='perch'){anchors.push({pt:vc(pt),tan:vnorm(tan||v3(1,0,0)),normal:vnorm(normal||v3(0,1,0)),kind});}
function buildSurface31(t,d){
  const D=DECOR[d.type],paths=[],anchors=[],faces=[];if(!D)return d._surf31={paths,anchors,faces};const by=d.baseY31||0;
  if(D.kind==='plat'){
    const top=d.h;
    const cx=d.x,cz=d.z;
    addAnchor31(anchors,v3(cx,top,cz),v3(1,0,0),v3(0,1,0),'top');
    const sides=[
      {axis:'x',val:d.x0,n:v3(-1,0,0),u0:d.z0,u1:d.z1},
      {axis:'x',val:d.x1,n:v3(1,0,0),u0:d.z0,u1:d.z1},
      {axis:'z',val:d.z0,n:v3(0,0,-1),u0:d.x0,u1:d.x1},
      {axis:'z',val:d.z1,n:v3(0,0,1),u0:d.x0,u1:d.x1}
    ];
    for(const f of sides){faces.push({kind:'boxSide',axis:f.axis,val:f.val,u0:f.u0,u1:f.u1,y0:by,y1:top,normal:f.n});const mid=f.axis==='x'?v3(f.val,(by+top)/2,(f.u0+f.u1)/2):v3((f.u0+f.u1)/2,(by+top)/2,f.val);addAnchor31(anchors,mid,v3(0,1,0),f.n,'side');}
    // Long decor exposes real top-surface travel along its visible long axis.
    if(d.w>=d.d)addPath31(paths,[v3(d.x0+1.2,top,cz),v3(d.x1-1.2,top,cz)],Math.max(1.2,d.d*.45),'top',v3(0,1,0));
    else addPath31(paths,[v3(cx,top,d.z0+1.2),v3(cx,top,d.z1-1.2)],Math.max(1.2,d.w*.45),'top',v3(0,1,0));
  }else if(D.kind==='plant'){
    const addLocalPath=(pts,w,k,n)=>addPath31(paths,pts.map(p=>{const q=rot31(v3(p[0],p[1]+by,p[2]),d);return q;}),w,k,n?rot31(vadd(v3(d.x,0,d.z),n),d):null);
    if((D.renderAs==='tree'||d.type==='tree'||d.type==='grandtree'||d.type==='ficus'||d.type==='palmetto')&&d.blobs){
      const top=(D.h||70)*.80,r=Math.max(1.8,Math.min(D.w,D.d)*.10);const trunk=[];for(let i=0;i<=12;i++){const s=i/12;trunk.push(rot31(v3(d.x+Math.sin(s*3+d.seed%5)*3,by+s*top,d.z),d));}addPath31(paths,trunk,r*2,'trunk');
      const blobs=treeBlobs(d);for(const b0 of blobs.slice(0,Math.min(8,blobs.length))){const b=rot31(v3(b0.x,b0.y+by,b0.z),d),idx=Math.min(trunk.length-1,7+Math.abs(((b0.x*3)|0)%4)),st=trunk[idx];addPath31(paths,[st,b],Math.max(1.2,r*.75),'branch');addAnchor31(anchors,b,vsub(b,st),v3(0,1,0),'branchTip');}
    }else if((D.renderAs==='fern'||d.type==='fern')&&d.fronds){
      for(const f of d.fronds){const pts=fernFrond(d,f).map(p=>rot31(v3(p[0],p[1]+by,p[2]),d));addPath31(paths,pts,1.2,'frond');const n=pts.length-1;addAnchor31(anchors,pts[n],vsub(pts[n],pts[n-1]),v3(0,1,0),'leafTip');}
    }else if((D.renderAs==='grass'||d.type==='grass')&&d.blades){
      for(const b of d.blades.slice(0,8)){const pts=[];for(let q=0;q<=10;q++){const s=q/10;pts.push(rot31(v3(d.x+b.bx+b.bend*s*s,by+b.L*s*(1-.06*s),d.z+b.bz),d));}addPath31(paths,pts,.85,'blade');const n=pts.length-1;addAnchor31(anchors,pts[n],vsub(pts[n],pts[n-1]),v3(0,1,0),'bladeTip');}
    }else if(D.attract&&d.heads){
      for(const h of d.heads){const a=rot31(v3(d.x+h.hx*.3,by,d.z+h.hz),d),b=rot31(v3(d.x+h.hx,by+h.hh,d.z+h.hz),d);addPath31(paths,[a,b],1.0,'stem');addAnchor31(anchors,b,vsub(b,a),v3(0,1,0),'flower');}
    }else if((D.renderAs==='succ'||d.type==='succ'||d.type==='redbromeliad'||d.type==='waterleaf')){
      const c=rot31(v3(d.x,by+1,d.z),d),len=Math.max(4,Math.min(D.w,D.d)*.38);for(let i=0;i<8;i++){const a=i/8*TAU+((d.seed%7)*.13),b=rot31(v3(d.x+Math.cos(a)*len,by+Math.max(2,D.h*.35),d.z+Math.sin(a)*len*.85),d);addPath31(paths,[c,b],1.4,'leaf');addAnchor31(anchors,b,vsub(b,c),v3(0,1,0),'leafTip');}
    }else{
      // Generic authored plant: use only real generated perches and stems linking them to the root.
      const root=rot31(v3(d.x,by,d.z),d);for(const p0 of d.perches||[]){const p=vc(p0);addPath31(paths,[root,p],1.0,'stem');addAnchor31(anchors,p,vsub(p,root),v3(0,1,0),'perch');}
    }
  }
  // Existing renderer-authored perches remain valid, but only if close to a visible physical path.
  for(const p of d.perches||[]){let best=1e9,bt=v3(1,0,0);for(const path of paths)for(let i=1;i<path.pts.length;i++){const n=segNear31(p,path.pts[i-1],path.pts[i]);if(n.d<best){best=n.d;bt=n.tan;}}if(best<=Math.max(3,Math.min(d.w,d.d)*.22))addAnchor31(anchors,p,bt,v3(0,1,0),'rendererPerch');}
  d._surf31={paths,anchors,faces};return d._surf31;
}
function surf31(t,d){return d?d._surf31||buildSurface31(t,d):null;}
function nearestPhysical31(t,d,p,noAnchors=false){const S=surf31(t,d);let best=null,bd=1e9;if(!S)return null;
  for(const f of S.faces||[]){let q;if(f.axis==='x')q=v3(f.val,clamp(p.y,f.y0+.15,f.y1-.15),clamp(p.z,f.u0+.15,f.u1-.15));else q=v3(clamp(p.x,f.u0+.15,f.u1-.15),clamp(p.y,f.y0+.15,f.y1-.15),f.val);const dd=vdist(p,q);if(dd<bd){best={pt:q,tangent:v3(0,1,0),normal:vc(f.normal),dist:dd,face:f};bd=dd;}}
  for(const path of S.paths){for(let i=1;i<path.pts.length;i++){const n=segNear31(p,path.pts[i-1],path.pts[i]);if(n.d<bd){let normal=path.normal,pt=n.q;if(!normal){const tan=n.tan;let rad=vsub(p,n.q);rad=vsub(rad,vmul(tan,vdot(rad,tan)));if(vlen(rad)<.05){rad=v3(-tan.z,0,tan.x);if(vlen(rad)<.05)rad=v3(1,0,0);}normal=vnorm(rad);const rr=(path.kind==='frond'||path.kind==='leaf')?Math.max(.28,path.width*.24):Math.max(.45,path.width*.5);pt=vadd(n.q,vmul(normal,rr));}best={pt,tangent:n.tan,normal:vnorm(normal),dist:vdist(p,pt),path};bd=vdist(p,pt);}}}
  if(!noAnchors)for(const a of S.anchors){const dd=vdist(p,a.pt);if(dd<bd){best={pt:vc(a.pt),tangent:vc(a.tan),normal:vc(a.normal),dist:dd,path:null};bd=dd;}}
  return best;
}
function supportFrame31(t,e){if(!e?.surf)return null;if(e.surf.t==='floor'||e.surf.t==='plat')return {normal:v3(0,1,0),tangent:vnorm(v3(e.face?.x||1,0,e.face?.z||0)),pt:vc(e.pos)};if(!['perch','climb'].includes(e.surf.t))return null;const d=decorBy31(t,e.surf.id);return d?nearestPhysical31(t,d,e.pos,e.surf.t==='climb'):null;}
function snapPhysical31(t,e){if(!e||!['perch','climb'].includes(e.surf?.t))return;const d=decorBy31(t,e.surf.id);if(!d){e.surf=S_FLOOR;e.pos.y=0;e.route=null;return;}const f=nearestPhysical31(t,d,e.pos,e.surf.t==='climb');if(!f||f.dist>Math.max(7,Math.min(d.w,d.d)*.40)){// Never permit invisible support far away from visible geometry.
    const g=groundAt(t,e.pos.x,e.pos.z);e.surf=g.p?{t:'plat',id:g.p.id}:S_FLOOR;e.pos.y=g.h;e.route=null;e._surface31=null;return;
  }e.pos=vc(f.pt);e._surface31=f;e._surface25={id:d.id,normal:vc(f.normal),tangent:vc(f.tangent)};
}
for(const t of G.tanks||[])for(const d of t.decor||[])buildSurface31(t,d);

// Correct same-object transitions so a climber reaches the visible top edge instead
// of falling back into a generic floor route.
route=function(t,e,toS,toP,hopRange=0){
  if(e?.surf?.t==='climb'&&toS?.t==='plat'&&e.surf.id===toS.id){const d=decorBy31(t,toS.id);if(d){const f=nearestPhysical31(t,d,e.pos);let edge=f?vc(f.pt):v3(clamp(e.pos.x,d.x0,d.x1),e.pos.y,clamp(e.pos.z,d.z0,d.z1));edge.y=Math.max((d.baseY31||0)+.2,d.h-.18);return [{surf:{t:'climb',id:d.id},pt:edge,climb:true,surface31:true},{surf:toS,pt:v3(clamp(toP.x,d.x0+.6,d.x1-.6),d.h,clamp(toP.z,d.z0+.6,d.z1-.6)),surface31:true}];}}
  return BASE_ROUTE31(t,e,toS,toP,hopRange);
};

// Rebuild physical geometry after any decor is added.
const BASE_ADD31=addDecor;
addDecor=function(t,type,x,z,rot=0,seed){const d=BASE_ADD31(t,type,x,z,rot,seed);if(d)buildSurface31(t,d);return d;};

// ----- stackable, physically supported decor -----
function childFoot31(id,rot){const D=DECOR[id];return rot?{w:D.d,d:D.w}:{w:D.w,d:D.d};}
function stackSupport31(t,id,x,z,rot){const D=DECOR[id];if(!D||D.kind==='flat')return null;const f=childFoot31(id,!!rot);let best=null;for(const p of plats(t)){if(p.baseY31!=null&&p.h>TH-8)continue;const pad=1.2;if(x-f.w/2<p.x0+pad||x+f.w/2>p.x1-pad||z-f.d/2<p.z0+pad||z+f.d/2>p.z1-pad)continue;let blocked=false;for(const o of t.decor){if(o===p||o.parent31!==p.id)continue;if(x-f.w/2<o.x1&&x+f.w/2>o.x0&&z-f.d/2<o.z1&&z+f.d/2>o.z0){blocked=true;break;}}if(blocked)continue;if(!best||p.h>best.h)best=p;}return best;}
function applyStack31(t,d,parent){if(!d||!parent)return d;const D=DECOR[d.type],base=parent.h;d.parent31=parent.id;d.parentSeed31=parent.seed;d.baseY31=base;d.localH31=D.h||0;if(D.kind==='plat')d.h=base+(D.h||0);for(const p of d.perches||[])p.y+=base;d._nav25=null;d._surf31=null;buildSurface31(t,d);d.cache=null;d._cache8=Object.create(null);d._cache8Order=[];d._sdfRefresh=true;t.bgKey='';t.stat=null;return d;}
function validStack31(t,pl,x,z){return pl?.kind==='decor'?stackSupport31(t,pl.id,x,z,UI.rot):null;}
placeOK=function(t,pl,x,z){if(pl?.kind==='decor'&&validStack31(t,pl,x,z))return true;return BASE_PLACE_OK31(t,pl,x,z);};
doPlace=function(t,m){const pl=UI.place,sup=pl?.kind==='decor'?validStack31(t,pl,m.x,m.z):null;if(!sup)return BASE_DO_PLACE31(t,m);const D=DECOR[pl.id];if(G.coins<D.price){toast('Not enough coins');return;}G.coins-=D.price;const d=addDecor(t,pl.id,m.x,m.z,UI.rot);applyStack31(t,d,sup);SFX.place();toast(`${D.name} placed on ${DECOR[sup.type].name}`);};
// Render stacked objects from the true support height rather than from the substrate.
drawPlat=function(cp,d){if(!d?.baseY31)return BASE_DRAW_PLAT31(cp,d);const P0=P,proxy=Object.assign({},d,{h:d.localH31||DECOR[d.type].h||0});P=function(x,y,z,c=cam){return P0(x,y+d.baseY31,z,c);};try{return BASE_DRAW_PLAT31(cp,proxy);}finally{P=P0;}};
drawPlant=function(cp,d){if(!d?.baseY31)return BASE_DRAW_PLANT31(cp,d);const P0=P;P=function(x,y,z,c=cam){return P0(x,y+d.baseY31,z,c);};try{return BASE_DRAW_PLANT31(cp,d);}finally{P=P0;}};
plantBox=function(d,D){const b=BASE_PLANT_BOX31(d,D);if(!d?.baseY31)return b;return b.map(p=>[p[0],p[1]+d.baseY31,p[2]]);};

// Save stack relationships independently so it survives the existing canonical/portrait save format.
function saveStack31(){try{const rows=(G.tanks||[]).map(t=>t.decor.filter(d=>d.parent31!=null).map(d=>({seed:d.seed,type:d.type,parentSeed:d.parentSeed31,baseY:d.baseY31})));localStorage.setItem('jtStack31',JSON.stringify(rows));}catch(_){}}
function restoreStack31(){try{const rows=JSON.parse(localStorage.getItem('jtStack31')||'[]');for(let ti=0;ti<(G.tanks||[]).length;ti++){const t=G.tanks[ti],r=rows[ti]||[];for(const x of r){const d=t.decor.find(o=>o.seed===x.seed&&o.type===x.type),p=t.decor.find(o=>o.seed===x.parentSeed);if(d&&p)applyStack31(t,d,p);}for(const d of t.decor)buildSurface31(t,d);}}catch(e){console.warn('stack31 restore',e);}}
save=function(){const r=BASE_SAVE31();saveStack31();return r;};
load=function(){const r=BASE_LOAD31();if(r)restoreStack31();return r;};
restoreStack31();

// ----- true surface-relative pose -----
function cameraSight31(c){let h=viewDir(c);if(vlen(h)<.01)h=v3(.6,0,.6);return vnorm(v3(h.x,.62,h.z));}
viewFor=function(e,c){const t=cur(),f=supportFrame31(t,e);if(!f||!['perch','climb'].includes(e?.surf?.t))return BASE_VIEW31(e,c);e._surface31=f;const sight=cameraSight31(c),dot=vdot(f.normal,sight),a=Pv(e.pos,c),b=Pv(vadd(e.pos,vmul(f.tangent,5)),c),ang=Math.atan2(b[1]-a[1],b[0]-a[0]);let view;if(dot>.42)view='top';else if(dot<-.34)view='belly';else view='side';return {view,ang,front:dot,flip:screenDX(f.tangent,c)<0,surface31:true};};

// Route completion is constrained back onto the physical visible support every frame.
followRoute=function(t,e,spd,dt,lockFace){const r=BASE_FOLLOW31(t,e,spd,dt,lockFace);if(['perch','climb'].includes(e?.surf?.t))snapPhysical31(t,e);return r;};

// ----- smarter target commitment + vertical escape from indecision -----
awarenessV7=function(t,s,dt,walk){
  // While an existing hunt is strategically healthy, do not thrash between similar prey.
  const cur=s.hunt&&targetValid(t,s,s.hunt.prey)?s.hunt.prey:null;
  if(cur&&['notice','stalk','crouch'].includes(s.state)){
    s._targetLock31=(s._targetLock31||0)-dt;const d=vdist(s.pos,cur.pos),healthy=d<185&&(!s.hunt.lost||s.hunt.lost<5);
    if(healthy&&s._targetLock31>0)return;
    if(healthy){s._targetLock31=.75+1.4*(s.tr?.patience??.5);return BASE_AWARE31(t,s,dt*.18,walk);}
  }
  return BASE_AWARE31(t,s,dt,walk);
};
function bestDescent31(t,s,p){const nodes=window.__JT30_SMART?.habitatNodes30?.(t,s,p?.pos)||[];let best=null,bs=1e9;for(const n of nodes){if(n.pt.y>=s.pos.y-2)continue;const horiz=Math.hypot(n.pt.x-p.pos.x,n.pt.z-p.pos.z),drop=s.pos.y-n.pt.y,dist=vdist(s.pos,n.pt);if(dist>jumpRange(s)*1.02)continue;const sc=horiz+dist*.35-drop*.18;if(sc<bs){bs=sc;best=n;}}return best;}

// Height advantage increases practical pounce reach, bounded so it stays believable.
window.effectiveJumpRange31=function(s,p){const base=jumpRange(s);if(!p)return base;const drop=Math.max(0,s.pos.y-p.pos.y),rise=Math.max(0,p.pos.y-s.pos.y);let bonus=1+clamp(drop/Math.max(18,base),0,.48)*.72;bonus*=1-clamp(rise/Math.max(20,base),0,.25);return base*bonus;};

// Molt readiness is an immediate behavioral override, with a deliberately safe retreat search.
function moltReady31(s){return s&&!s.owner&&s.stage<6&&s.meals>=3+s.stage&&s.sat>45&&!['toMolt','premolt','molt','rest'].includes(s.state);}
function moltSpot31(t,s){let best=null,bs=-1e9;for(const d of t.decor){const S=surf31(t,d);for(const a of S?.anchors||[]){if(a.pt.y<Math.max(10,TH*.18))continue;let nearest=1e9;for(const o of t.spiders)if(o!==s&&!o.owner)nearest=Math.min(nearest,vdist(a.pt,o.pos));let preyD=1e9;for(const p of t.prey)if(!p.owner)preyD=Math.min(preyD,vdist(a.pt,p.pos));const D=DECOR[d.type],cover=(D.cover?18:0)+a.pt.y*.48+Math.min(30,nearest)*.32+Math.min(24,preyD)*.18-vdist(s.pos,a.pt)*.06;if(cover>bs){bs=cover;best={surf:{t:'perch',id:d.id},pt:vc(a.pt)};}}}return best||BASE_SAFE31(t,s)||{surf:S_FLOOR,pt:randFloorPt(t)};}

const PRE_BASE_UPD31=updSpider;
updSpider=function(t,s,dt){
  if(moltReady31(s)){
    if(s.hunt?.prey?.kind==='spider'&&s.hunt.prey._huntedBy===s)s.hunt.prey._huntedBy=null;s.hunt=null;s.route=null;s.attn=null;s._targetLock31=0;
    s.retreat=moltSpot31(t,s);s.retreat.silk=0;s.route=route(t,s,s.retreat.surf,s.retreat.pt,jumpRange(s)*.25);setSt(s,'toMolt','Pre-molt — heading directly to a high, sheltered retreat');
  }
  // If an elevated hunter has many targets below and no useful path, descend strategically instead of pacing.
  if(s.state==='stalk'&&s.hunt?.prey&&s.pos.y>s.hunt.prey.pos.y+18&&(!s.route||!s.route.length||s.hunt.replans>2)){
    const n=bestDescent31(t,s,s.hunt.prey);if(n){s.route=[{surf:n.surf,pt:vc(n.pt),hop:true,smartHop30:true,surface31:true}];s.hunt.replans=0;s.mood=`Dropping to a lower launch point for ${targetName(s.hunt.prey)}`;}
  }
  const r=PRE_BASE_UPD31(t,s,dt);if(['perch','climb'].includes(s.surf?.t)&&!s._surfaceRoute32)snapPhysical31(t,s);return r;
};

// ----- springtail cleanup intelligence -----
PREY.springtail.decorClimb=true;
const BASE_PREY31=updPrey;
function cleanupTarget31(t,p){let best=null,bs=1e9;for(const h of t.husks||[]){if(h.type==='exuvia')continue;const d=vdist(p.pos,h.pos);if(d<bs){bs=d;best=h;}}return best;}
updPrey=function(t,p,dt){
  if(p.type==='springtail'&&!p.owner){p._cleanThink31=(p._cleanThink31||0)-dt;if(p._cleanThink31<=0){p._cleanThink31=.45+rand()*.4;const h=cleanupTarget31(t,p);if(h){p._clean31=h;const surf=h.surf||S_FLOOR;p.route=route(t,p,surf,vc(h.pos),32);if(p.route?.length)setSt(p,'walk');}}
    if(p._clean31&&t.husks.includes(p._clean31)&&vdist(p.pos,p._clean31.pos)<3.5){p._feedClean31=(p._feedClean31||0)+dt;if(p._feedClean31>4.5){const i=t.husks.indexOf(p._clean31);if(i>=0)t.husks.splice(i,1);p._clean31=null;p._feedClean31=0;setSt(p,'idle');}}else p._feedClean31=0;
  }
  const r=BASE_PREY31(t,p,dt);
  if(p.type==='springtail'&&p._clean31&&t.husks.includes(p._clean31)&&vdist(p.pos,p._clean31.pos)>=3.5){const end=p.route?.[p.route.length-1];if(!end||vdist(end.pt,p._clean31.pos)>2.5){p.route=route(t,p,p._clean31.surf||S_FLOOR,vc(p._clean31.pos),32);if(p.route?.length)setSt(p,'walk');}}
  if(['perch','climb'].includes(p.surf?.t))snapPhysical31(t,p);return r;
};

window.__JT31_PHYS={buildSurface31,surf31,nearestPhysical31,supportFrame31,snapPhysical31,stackSupport31,applyStack31,moltSpot31,effectiveJumpRange31};
})();
// ================= end v31 physical surfaces + strategic vertical AI =================
