// ================= v22 portrait-first mobile revamp =================
(function(){
'use strict';
const JT22={ver:23,portrait:false,canonical:false,initialized:false};
const BASE_START_PLACE22=startPlace;
const BASE_TAP_AT22=tapAt;
const BASE_TANK_TYPE22=tankType;
const BASE_SET_DIMS22=setTankDims;
const BASE_SAVE22=save;
const BASE_LOAD22=load;
const BASE_INIT22=initNew;
const BASE_SETUP_CAM22=setupCam;
const BASE_RESIZE22=resize;
const BASE_OPEN_DRAWER22=openDrawer;
const BASE_CLOSE_DRAWER22=closeDrawer;
const BASE_CHANGE_TANK22=changeTankType15;
const BASE_BUY_SLOT22=buySlot15;

const PORTRAIT22={
 standard:{w:120,d:84,h:160,label:'Portrait Standard'},
 arboreal:{w:104,d:74,h:188,label:'Portrait Arboreal'},
 wide:{w:136,d:82,h:166,label:'Portrait Display'},
 nano:{w:86,d:64,h:126,label:'Portrait Nano'},
 cube:{w:120,d:98,h:176,label:'Portrait Large'},
 acrylic:{w:92,d:66,h:146,label:'Portrait Breeder'},
 panoramic:{w:146,d:88,h:184,label:'Portrait Showcase'},
 jar:{w:106,d:106,h:190,label:'Tall Portrait Jar'}
};
const mq22=matchMedia('(max-width:700px) and (orientation: portrait)');

function portraitWanted22(){return !!mq22.matches;}
function baseType22(t){return BASE_TANK_TYPE22(t);}
function portraitType22(t){const b=baseType22(t),p=PORTRAIT22[t?.tankType]||PORTRAIT22.standard;return Object.assign({},b,p,{desktopW:b.w,desktopD:b.d,desktopH:b.h,portrait:true});}
function dims22(t,portrait){const b=baseType22(t);if(!portrait)return {w:b.w,d:b.d,h:b.h};const p=PORTRAIT22[t?.tankType]||PORTRAIT22.standard;return {w:p.w,d:p.d,h:p.h};}

tankType=function(t){if(JT22.canonical||!t||!t._portrait22)return BASE_TANK_TYPE22(t);return portraitType22(t);};

function shiftDecor22(d,ox,oz,nx,nz){const dx=nx-ox,dz=nz-oz;d.x=nx;d.z=nz;d.x0+=dx;d.x1+=dx;d.z0+=dz;d.z1+=dz;if(d.perches)for(const p of d.perches){p.x+=dx;p.z+=dz;}if(d.heads){}if(d.blobs){} }
function scalePoint22(p,rx,rz,ry){if(!p)return;p.x*=rx;p.z*=rz;if(Number.isFinite(p.y))p.y*=ry;}
function remapEntity22(t,e,rx,rz,ry){if(!e||!e.pos)return;const surf=e.surf||S_FLOOR;e.pos.x*=rx;e.pos.z*=rz;if(surf.t==='wall'||surf.t==='air'||surf.t==='silk'||surf.t==='perch')e.pos.y*=ry;e.route=null;
 if(e.jump){if(e.jump.a)scalePoint22(e.jump.a,rx,rz,ry);if(e.jump.b)scalePoint22(e.jump.b,rx,rz,ry);if(e.jump.from)scalePoint22(e.jump.from,rx,rz,ry);if(e.jump.to)scalePoint22(e.jump.to,rx,rz,ry);}
 if(e.retreat?.pt)scalePoint22(e.retreat.pt,rx,rz,ry);
}
function settleEntity22(t,e){if(!e||!e.pos)return;clampTankXZ(t,e.pos,e.surf?.t==='air'?.6:1.3);if(e.surf?.t==='wall'){const q=wallClamp(e.surf.w,e.pos);e.pos.x=q.x;e.pos.y=q.y;e.pos.z=q.z;return;}if(e.surf?.t==='plat'){const d=platById(t,e.surf.id);if(d){e.pos.y=d.h;e.pos.x=clamp(e.pos.x,d.x0+.5,d.x1-.5);e.pos.z=clamp(e.pos.z,d.z0+.5,d.z1-.5);return;}e.surf=S_FLOOR;}if(e.surf?.t==='floor'){const g=groundAt(t,e.pos.x,e.pos.z);if(g.p){e.surf={t:'plat',id:g.p.id};e.pos.y=g.h;}else e.pos.y=0;}else e.pos.y=clamp(e.pos.y,-1,TH-2);}
function remapTank22(t,toPortrait){if(!t||!t.owned||!!t._portrait22===toPortrait)return;const from=dims22(t,!!t._portrait22),to=dims22(t,toPortrait),rx=to.w/from.w,rz=to.d/from.d,ry=to.h/from.h;t._portrait22=toPortrait;
 // Decor remains the same physical size, but its normalized layout is preserved.
 for(const d of t.decor||[]){const ox=d.x,oz=d.z,nx=clamp(ox*rx,1,to.w-1),nz=clamp(oz*rz,1,to.d-1);shiftDecor22(d,ox,oz,nx,nz);}
 const old=[TW,TD,TH],oldActive=JT15.activeTank;TW=to.w;TD=to.d;TH=to.h;JT15.activeTank=t;
 try{
  for(const e of [...(t.spiders||[]),...(t.prey||[])])remapEntity22(t,e,rx,rz,ry);
  for(const e of [...(t.spiders||[]),...(t.prey||[])])settleEntity22(t,e);
  for(const l of t.silk||[]){scalePoint22(l.a,rx,rz,ry);scalePoint22(l.b,rx,rz,ry);}
  for(const h of t.husks||[])if(h.pos)scalePoint22(h.pos,rx,rz,ry);
  for(const d of t.drops||[])if(d.pos)scalePoint22(d.pos,rx,rz,ry);
 } finally {TW=old[0];TD=old[1];TH=old[2];JT15.activeTank=oldActive;}
 clearTankCaches15(t);t._bgAccum=0;
}
function syncGeometry22(force){const want=portraitWanted22();if(!force&&want===JT22.portrait&&JT22.initialized)return;JT22.portrait=want;for(const t of G.tanks||[])if(t?.owned)remapTank22(t,want);if(G.tanks?.[G.cur])BASE_SET_DIMS22(G.tanks[G.cur]);JT22.initialized=true;try{setCam(cam.mode||1);VIEW.z=1;clampView();}catch(e){}requestAnimationFrame(()=>{resize();renderTabs();});}

setTankDims=function(t){const q=tankType(t);TW=q.w;TD=q.d;TH=q.h;JT15.activeTank=t||null;return q;};

// Existing saves are canonical desktop-space. Load there first, then map to portrait.
load=function(){JT22.canonical=true;let ok=false;try{ok=BASE_LOAD22();}finally{JT22.canonical=false;}if(ok){for(const t of G.tanks||[])t._portrait22=false;JT22.initialized=false;syncGeometry22(true);}return ok;};
initNew=function(){JT22.canonical=true;try{BASE_INIT22();}finally{JT22.canonical=false;}for(const t of G.tanks||[])t._portrait22=false;JT22.initialized=false;syncGeometry22(true);};

function canonPoint22(t,p){if(!p)return p;const cur=dims22(t,!!t._portrait22),base=dims22(t,false),rx=base.w/cur.w,rz=base.d/cur.d,ry=base.h/cur.h;return {x:p.x*rx,y:(p.y||0)*ry,z:p.z*rz};}
function canonHusk22(t,h){if(!h||!h.pos)return h;const o=Object.assign({},h);o.pos=canonPoint22(t,h.pos);return o;}
save=function(){try{const data={v:23,coins:G.coins,clock:G.clock,catches:G.catches,unlocked:G.unlocked,cur:G.cur,journal:G.journal||{},customPresets:G.customPresets||[],tanks:G.tanks.map(t=>{const curD=dims22(t,!!t._portrait22),baseD=dims22(t,false),rx=baseD.w/curD.w,rz=baseD.d/curD.d;return {name:t.name,tankType:t.tankType,owned:t.owned,sub:t.sub,humidity:t.humidity,age:t.age,presetRoll:t.presetRoll||0,lastPreset:t.lastPreset||null,decor:t.decor.map(d=>[d.type,d.x*rx,d.z*rz,d.rot,d.seed]),silk:(t.silk||[]).slice(-80).map(l=>({a:canonPoint22(t,l.a),b:canonPoint22(t,l.b),kind:l.kind,alpha:l.alpha,age:l.age})),spiders:t.spiders.filter(s=>!s.owner).map(s=>({sp:s.sp,name:s.name,stage:s.stage,meals:s.meals,sat:s.sat,thirst:s.thirst,tr:s.tr,persona:s.persona,mem:s.mem,catches:s.catches,seed:s.seed,obsPts:s.obsPts,softT:s.softT,life:s.life||null,huntMemory:s.huntMemory||null})),prey:t.prey.filter(p=>!p.owner).map(p=>p.type),husks:(t.husks||[]).slice(-40).map(h=>canonHusk22(t,h))};})};localStorage.setItem('jumperTerrarium1',JSON.stringify(data));}catch(e){console.warn('save22',e);}};

// Enclosure replacement/buying still uses the v15 canonical geometry internally.
changeTankType15=function(t,id){const was=!!t?._portrait22;if(was)remapTank22(t,false);const before=t?.tankType;let r;try{r=BASE_CHANGE_TANK22(t,id);}finally{if(was&&t?.owned)remapTank22(t,true);if(G.tanks?.[G.cur]){setTankDims(G.tanks[G.cur]);setCam(cam.mode||1);resize();}}return r;};
buySlot15=function(i,type){const r=BASE_BUY_SLOT22(i,type);const t=G.tanks?.[i];if(JT22.portrait&&t?.owned&&!t._portrait22){remapTank22(t,true);if(G.cur===i){setTankDims(t);setCam(cam.mode||1);resize();}}return r;};

function visibleInternalWidth22(){const st=$('stage');if(!st)return W;const sw=Math.max(1,st.clientWidth),sh=Math.max(1,st.clientHeight);return clamp(H*sw/sh,110*RS,W);}
function fitPortraitCam22(c,mode){if(!JT22.portrait)return;const visW=visibleInternalWidth22(),oldK=c.k||1;let mnx=1e9,mny=1e9,mxx=-1e9,mxy=-1e9;for(const x of [0,TW])for(const y of [-SUB,TH])for(const z of [0,TD]){const q=P(x,y,z,c);const rx=(q[0]-c.ox)/oldK,ry=(q[1]-c.oy)/oldK;mnx=Math.min(mnx,rx);mxx=Math.max(mxx,rx);mny=Math.min(mny,ry);mxy=Math.max(mxy,ry);}const rw=Math.max(1,mxx-mnx),rh=Math.max(1,mxy-mny);
 if(mode===3){c.k=Math.min(oldK,2.35*RS);const t=cur(),sp=(G.sel&&t?.spiders.includes(G.sel))?G.sel:t?.spiders.find(s=>!s.owner);if(sp){const q0=P(sp.pos.x,sp.pos.y,sp.pos.z,c),rawX=(q0[0]-c.ox)/oldK,rawY=(q0[1]-c.oy)/oldK;c.ox=W*.5-rawX*c.k;c.oy=H*.54-rawY*c.k;}return;}
 const desired=Math.min((visW*.88)/rw,(H*.88)/rh,oldK*1.2);c.k=Math.max(.45*RS,desired);c.ox=W*.5-(mnx+mxx)*.5*c.k;c.oy=H*.51-(mny+mxy)*.5*c.k;
}
setupCam=function(c,mode){BASE_SETUP_CAM22(c,mode);fitPortraitCam22(c,mode);};

resize=function(){if(!JT22.portrait)return BASE_RESIZE22();const st=$('stage');if(!st)return;const s=Math.max(st.clientHeight/H,st.clientWidth/W);const ww=Math.ceil(W*s),hh=Math.ceil(H*s);for(const el of [cv,ov]){el.style.width=ww+'px';el.style.height=hh+'px';el.style.position='absolute';el.style.left=Math.round((st.clientWidth-ww)/2)+'px';el.style.top=Math.round((st.clientHeight-hh)/2)+'px';}if(window.__jtSyncFallback)window.__jtSyncFallback();};

let dock22=null,sheet22=null,more22=null,drawerHome22=null,infoExpanded22=false;
function ensureUI22(){if(dock22)return;const app=$('app'),drawer=$('drawer'),bar=$('bar');drawerHome22={parent:drawer.parentNode,next:drawer.nextSibling};
 dock22=document.createElement('div');dock22.id='mobileDock22';dock22.innerHTML='<button data-m22="build">🪴<span>Build</span></button><button data-m22="food">🪰<span>Food</span></button><button data-m22="jumpers">🕷<span>Jumpers</span></button><button data-m22="observe">📹<span>Observe</span></button><button data-m22="more">•••<span>More</span></button>';app.appendChild(dock22);
 sheet22=document.createElement('div');sheet22.id='mobileSheet22';sheet22.innerHTML='<div class="sheetHandle22"></div><div class="sheetHead22"><b id="sheetTitle22">Build</b><button id="sheetClose22">×</button></div><div id="buildTabs22"><button data-kind="decor">Decor</button><button data-kind="plants">Plants</button><button data-kind="sub">Substrate</button><button data-kind="presets">Presets</button></div><div id="sheetBody22"></div>';document.body.appendChild(sheet22);
 more22=document.createElement('div');more22.id='mobileMore22';more22.innerHTML='<div class="sheetHandle22"></div><div class="sheetHead22"><b>Terrarium</b><button id="moreClose22">×</button></div><div class="moreGrid22"><button data-act="mistBtn">💧<span>Mist</span></button><button data-act="cleanBtn">🧹<span>Clean</span></button><button data-act="removeBtn">✖<span>Remove</span></button><button data-act="journalBtn">📓<span>Journal</span></button><button data-act="cam1">1<span>Iso</span></button><button data-act="cam2">2<span>Observer</span></button><button data-act="cam3">3<span>Follow</span></button><button data-act="cam4">4<span>Reverse</span></button><button data-act="timeBtn">⏱<span>Time</span></button><button data-act="sndBtn">🎵<span>Sound</span></button><button data-act="setBtn">⚙<span>Settings</span></button><button data-act="helpBtn">?<span>Help</span></button><button data-act="hab">🏠<span>Habitats</span></button></div>';document.body.appendChild(more22);
 $('sheetClose22').onclick=()=>closeDrawer();$('moreClose22').onclick=()=>more22.classList.remove('open');
 dock22.addEventListener('click',e=>{const b=e.target.closest('button[data-m22]');if(!b)return;const a=b.dataset.m22;SFX.click();if(a==='build'){more22.classList.remove('open');if(UI.drawer&&['decor','plants','sub','presets'].includes(UI.drawer)){sheet22.classList.toggle('open');}else openDrawer('decor');}else if(a==='food'){more22.classList.remove('open');openDrawer('prey');}else if(a==='jumpers'){$('colBtn').click();}else if(a==='observe'){$('obsBtn').click();}else if(a==='more'){if(sheet22.classList.contains('open'))closeDrawer();more22.classList.toggle('open');}});
 $('buildTabs22').addEventListener('click',e=>{const b=e.target.closest('button[data-kind]');if(!b)return;if(UI.drawer===b.dataset.kind){sheet22.classList.add('open');return;}openDrawer(b.dataset.kind);});
 more22.addEventListener('click',e=>{const b=e.target.closest('button[data-act]');if(!b)return;const a=b.dataset.act;if(a==='hab'){renderHabitats15();$('habModal15').style.display='flex';}else $(a)?.click();if(a!=='removeBtn')more22.classList.remove('open');});
 const info=$('info');info.addEventListener('click',()=>{if(!JT22.portrait)return;infoExpanded22=!infoExpanded22;info.classList.toggle('portraitExpanded22',infoExpanded22);info.classList.toggle('mini',!infoExpanded22);});
}
function attachDrawer22(){ensureUI22();const dr=$('drawer');if(JT22.portrait){$('sheetBody22').appendChild(dr);}else if(drawerHome22){drawerHome22.parent.insertBefore(dr,drawerHome22.next);sheet22.classList.remove('open');more22.classList.remove('open');}}
function setSheetFor22(kind){if(!JT22.portrait)return;ensureUI22();const build=['decor','plants','sub','presets'].includes(kind);$('buildTabs22').style.display=build?'grid':'none';$('sheetTitle22').textContent=build?'Build':kind==='prey'?'Live Food':'Inventory';for(const b of document.querySelectorAll('#buildTabs22 button'))b.classList.toggle('on',b.dataset.kind===kind);sheet22.classList.add('open');}
openDrawer=function(kind){const r=BASE_OPEN_DRAWER22(kind);if(JT22.portrait&&UI.drawer){attachDrawer22();setSheetFor22(UI.drawer);}return r;};
closeDrawer=function(){const r=BASE_CLOSE_DRAWER22();if(sheet22)sheet22.classList.remove('open');return r;};

// v23: choosing a placeable item in portrait immediately gives the terrarium
// back to the player. Keeping the inventory sheet over the lower half of a
// tall tank hid the usable floor and made otherwise-valid placement taps map
// outside the enclosure.
startPlace=function(pl){
 const r=BASE_START_PLACE22(pl);
 if(JT22.portrait&&pl){
  if(sheet22)sheet22.classList.remove('open');
  if(more22)more22.classList.remove('open');
  document.body.classList.add('placing23');
  if(pl.kind==='prey')hint(`Tap in the tank to release ${PREY[pl.id].name}`);
  else hint(`Tap in the tank to place ${DECOR[pl.id].name} • drag to aim`);
  requestAnimationFrame(()=>{try{resize();}catch(_){}});
 }
 return r;
};
const BASE_CANCEL_PLACE22=cancelPlace;
cancelPlace=function(){const r=BASE_CANCEL_PLACE22();document.body.classList.remove('placing23');return r;};

// Slightly forgiving touch placement for portrait. The regular inverse-floor
// projection is kept, but points just beyond an edge due to perspective/crop
// rounding are clamped back into the enclosure instead of being discarded.
tapAt=function(s){
 if(!(JT22.portrait&&UI.place))return BASE_TAP_AT22(s);
 const t=cur();let m=invFloor(s[0],s[1],0);
 const pad=Math.max(5,Math.min(TW,TD)*.08);
 const near=m.x>=-pad&&m.x<=TW+pad&&m.z>=-pad&&m.z<=TD+pad;
 if(!near)return;
 m=v3(clamp(m.x,1.5,TW-1.5),0,clamp(m.z,1.5,TD-1.5));
 doPlace(t,m);
};

function applyPortraitUI22(){ensureUI22();const active=portraitWanted22();document.body.classList.toggle('portrait22',active);JT22.portrait=active;attachDrawer22();const info=$('info');if(active){infoExpanded22=false;info.classList.add('mini');info.classList.remove('portraitExpanded22');}else{info.classList.remove('portraitExpanded22');}document.querySelector('#mobileMorePanel20')?.classList.remove('open');syncGeometry22(true);resize();}

mq22.addEventListener?.('change',()=>setTimeout(applyPortraitUI22,80));window.addEventListener('orientationchange',()=>setTimeout(applyPortraitUI22,260));window.addEventListener('resize',()=>{if(JT22.portrait)setTimeout(()=>{setCam(cam.mode||1);resize();},40);},{passive:true});
ensureUI22();
// Boot will call load/initNew after this module. Keep initial mode ready without touching an empty G.tanks.
JT22.portrait=portraitWanted22();document.body.classList.toggle('portrait22',JT22.portrait);attachDrawer22();
// habitats.js performs initial load before this module is evaluated, so remap that already-loaded world now.
if(typeof G!=='undefined'&&G.tanks?.length)syncGeometry22(true);
window.__JT22=JT22;
})();
// ================= end v22 portrait-first mobile revamp =================
