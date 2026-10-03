// ================= v29 exact decor thumbnails + universal quarter-turn placement =================
(function(){
'use strict';
const BASE_ADD_DECOR29=addDecor;
const BASE_DRAW_PLANT29=drawPlant;
const BASE_DRAW_TREE_TOP29=drawTreeTop;
const BASE_FLAT_COLOR29=flatColor;
const BASE_PLANT_BOX29=plantBox;
const BASE_START_PLACE29=startPlace;
const BASE_CANCEL_PLACE29=cancelPlace;
const BASE_PLACE_OK29=placeOK;

function rotXZ29(x,z,cx,cz,rot){
  if(!rot)return [x,z];
  const dx=x-cx,dz=z-cz;
  return [cx-dz,cz+dx]; // 90 degrees clockwise in habitat X/Z space
}
function invRotXZ29(x,z,cx,cz,rot){
  if(!rot)return [x,z];
  const dx=x-cx,dz=z-cz;
  return [cx+dz,cz-dx];
}
function rotatedFoot29(D,rot){return rot?{w:D.d,d:D.w}:{w:D.w,d:D.d};}
function resetDecorCache29(d){
  d.cache=null;d._cache8=Object.create(null);d._cache8Order=[];d._sdfRefresh=true;
}
function rotatePerches29(d){
  if(!d.rot||!d.perches)return;
  for(const p of d.perches){const q=rotXZ29(p.x,p.z,d.x,d.z,1);p.x=q[0];p.z=q[1];}
}

// v28 already builds physical navigation anchors. v29 extends its addDecor result
// so plants and flat decor have the same 90-degree footprint semantics as platforms.
addDecor=function(t,type,x,z,rot=0,seed){
  rot=rot?1:0;
  const d=BASE_ADD_DECOR29(t,type,x,z,rot,seed);if(!d)return d;
  const D=DECOR[type],f=rotatedFoot29(D,rot);
  d.rot=rot;d.w=f.w;d.d=f.d;d.x0=x-f.w/2;d.x1=x+f.w/2;d.z0=z-f.d/2;d.z1=z+f.d/2;
  if(rot&&D.kind!=='plat')rotatePerches29(d);
  d._nav25=null;
  if(window.__JT28?.ensureNav25)window.__JT28.ensureNav25(t,d);
  resetDecorCache29(d);t.bgKey='';t.stat=null;
  return d;
};

// Rotate painted/vector plants in world space before the normal renderer projects
// them. This keeps their exact existing art renderer rather than making a second
// simplified rotated version.
function withPlantRotation29(d,fn){
  if(!d?.rot)return fn();
  const P0=P,D0=depthOf;
  P=function(x,y,z,c=cam){const q=rotXZ29(x,z,d.x,d.z,1);return P0(q[0],y,q[1],c);};
  depthOf=function(x,y,z,c=cam){const q=rotXZ29(x,z,d.x,d.z,1);return D0(q[0],y,q[1],c);};
  try{return fn();}finally{P=P0;depthOf=D0;}
}
drawPlant=function(cp,d){return withPlantRotation29(d,()=>BASE_DRAW_PLANT29(cp,d));};
drawTreeTop=function(cp,d,bonsai){return withPlantRotation29(d,()=>BASE_DRAW_TREE_TOP29(cp,d,bonsai));};

// Flat decor is painted by sampling world coordinates. Inverse-rotate the sample
// into the item's unrotated local texture space so leaf litter, moss, dishes, etc.
// visually rotate with the placement footprint.
flatColor=function(d,x,z){
  if(!d?.rot)return BASE_FLAT_COLOR29(d,x,z);
  const D=DECOR[d.type],q=invRotXZ29(x,z,d.x,d.z,1);
  const proxy=Object.assign({},d,{rot:0,w:D.w,d:D.d,x0:d.x-D.w/2,x1:d.x+D.w/2,z0:d.z-D.d/2,z1:d.z+D.d/2});
  return BASE_FLAT_COLOR29(proxy,q[0],q[1]);
};

// Keep sprite bounds correct after rotating a plant with an asymmetric footprint.
plantBox=function(d,D){
  const pts=BASE_PLANT_BOX29(d,D);if(!d?.rot)return pts;
  return pts.map(p=>{const q=rotXZ29(p[0],p[2],d.x,d.z,1);return [q[0],p[1],q[1]];});
};

// Habitat placement bounds must honor rotation for plants and ground decor too.
canPlaceDecor15=function(t,id,x,z,rot=0){
  const D=DECOR[id];if(!D||!tankAllowsDecor(t,id))return false;const f=rotatedFoot29(D,!!rot),w=f.w,d=f.d;
  const pts=[[x-w/2,z-d/2],[x+w/2,z-d/2],[x+w/2,z+d/2],[x-w/2,z+d/2]];
  if(!pts.every(q=>insideTankXZ(t,q[0],q[1],1)))return false;
  if(D.kind==='plat'){for(const o of plats(t))if(x-w/2<o.x1&&x+w/2>o.x0&&z-d/2<o.z1&&z+d/2>o.z0)return false;}
  return true;
};
fitDecorPos15=function(t,id,x,z,rot=0){const D=DECOR[id],f=rotatedFoot29(D,!!rot),p=v3(x,0,z);clampTankXZ(t,p,Math.max(f.w,f.d)*.55+1);return p;};
placeOK=function(t,pl,x,z){if(pl.kind==='prey')return insideTankXZ(t,x,z,2);return canPlaceDecor15(t,pl.id,x,z,UI.rot);};

// ----- exact renderer thumbnails -----
const THUMB29=new Map();
function copyCanvas29(src){const c=document.createElement('canvas');c.width=src.width;c.height=src.height;const x=c.getContext('2d');x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';x.drawImage(src,0,0);return c;}
function seedFor29(type){let h=2166136261>>>0;for(let i=0;i<type.length;i++){h^=type.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0)||12345;}
function canvasFromPB29(pb){const c=document.createElement('canvas');c.width=pb.w;c.height=pb.h;c.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(pb.d.buffer),pb.w,pb.h),0,0);return c;}
function renderFlatSprite29(c,d){
  return makeSprite(c,[[d.x0,0,d.z0],[d.x1,0,d.z0],[d.x1,0,d.z1],[d.x0,0,d.z1]],cp=>{
    const pts=[[d.x0,d.z0],[d.x1,d.z0],[d.x1,d.z1],[d.x0,d.z1]].map(q=>P(q[0],0,q[1],cp));
    ppoly(pts,(sx,sy)=>{const q=invFloor(sx+.5,sy+.5,0,cp);return flatColor(d,q.x,q.z);});
  });
}
function exactDecorCanvas29(type,rot=0){
  const key=type+'|'+(rot?1:0)+'|'+QUAL;const cached=THUMB29.get(key);if(cached)return copyCanvas29(cached);
  const D=DECOR[type],seed=seedFor29(type),tmp={decor:[]},cx=TW*.5,cz=TD*.5;
  const oldNo=NOCLAMP,oldIcon=ICONMODE;NOCLAMP=true;ICONMODE=false;
  let out=document.createElement('canvas');out.width=180;out.height=140;
  try{
    const d=addDecor(tmp,type,cx,cz,rot,seed);let pts,mode=1;
    if(D.kind==='plat'&&type!=='bonsai')pts=boxPts(d.x0-3,d.z0-3,d.x1+3,d.z1+3,0,Math.max(5,d.h+5));
    else if(D.kind==='flat')pts=[[d.x0,0,d.z0],[d.x1,0,d.z0],[d.x1,0,d.z1],[d.x0,0,d.z1]];
    else pts=plantBox(d,D);
    const unit={mode,k:1,ox:0,oy:0};let mnx=1e9,mny=1e9,mxx=-1e9,mxy=-1e9;
    for(const p of pts){const s=P(p[0],p[1],p[2],unit);mnx=Math.min(mnx,s[0]);mny=Math.min(mny,s[1]);mxx=Math.max(mxx,s[0]);mxy=Math.max(mxy,s[1]);}
    const fit=Math.min(4.6,Math.max(.8,Math.min(150/Math.max(1,mxx-mnx),108/Math.max(1,mxy-mny))));
    const c={mode,k:fit,ox:0,oy:0};
    let sp;
    if(D.kind==='flat')sp=renderFlatSprite29(c,d);
    else sp=makeSprite(c,pts,cp=>D.kind==='plat'?drawPlat(cp,d):drawPlant(cp,d));
    if(D.kind==='plat'&&type!=='bonsai'&&D.tex!=='pot'&&!d._sdf)roughen(sp.pb,d.seed%997,Math.max(3,Math.round(c.k*(D.tex==='cork'?2.2:1.5))),D.tex==='stone'?.5:D.tex==='cork'?1.2:.8);
    const src29=canvasFromPB29(sp.pb),x=out.getContext('2d');x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';
    const scale=Math.min(156/src29.width,116/src29.height,1.9),dw=Math.max(1,src29.width*scale),dh=Math.max(1,src29.height*scale);
    x.drawImage(src29,(out.width-dw)/2,out.height-dh-8,dw,dh);
  }catch(e){console.warn('v29 thumbnail fallback',type,e);out=iconCanvas(()=>{},90,70);}finally{NOCLAMP=oldNo;ICONMODE=oldIcon;tmp.decor.length=0;}
  THUMB29.set(key,out);return copyCanvas29(out);
}
decorIcon=function(type){return exactDecorCanvas29(type,0);};

function syncSelectedThumb29(){
  if(!UI.place||UI.place.kind!=='decor')return;const c=document.querySelector('#drawer .card.sel canvas');if(!c)return;
  const fresh=exactDecorCanvas29(UI.place.id,UI.rot);c.width=fresh.width;c.height=fresh.height;const x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);x.drawImage(fresh,0,0);
}
function setRotation29(v){UI.rot=v?1:0;syncSelectedThumb29();G.mouse&&typeof render==='function'&&requestAnimationFrame(()=>{});}
startPlace=function(pl){UI.rot=0;const r=BASE_START_PLACE29(pl);if(pl?.kind==='decor')syncSelectedThumb29();return r;};
cancelPlace=function(){const r=BASE_CANCEL_PLACE29();UI.rot=0;return r;};
showPB=function(pl){$('placeBar').style.display=pl?'flex':'none';$('pbRot').style.display=pl&&pl.kind==='decor'?'':'none';};
$('pbRot').onclick=()=>setRotation29(!UI.rot);

// Existing keyboard/wheel handlers change UI.rot before these listeners fire.
// Keep the selected thumbnail synchronized with that actual placement state.
window.addEventListener('keydown',e=>{if((e.key==='r'||e.key==='R')&&UI.place?.kind==='decor')queueMicrotask(syncSelectedThumb29);});
cv.addEventListener('wheel',()=>{if(UI.place?.kind==='decor')queueMicrotask(syncSelectedThumb29);},{passive:true});

// Refresh drawer icons when a camera/quality-sensitive redraw would otherwise reuse
// an old simplified icon cache. Drawer creation calls decorIcon dynamically.
window.__JT29={exactDecorCanvas:exactDecorCanvas29,rotatedFoot:rotatedFoot29,rotXZ:rotXZ29};
})();
// ================= end v29 exact decor thumbnails + universal rotation =================
