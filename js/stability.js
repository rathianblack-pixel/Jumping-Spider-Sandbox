// ================= v16 habitat stability + drawer navigation =================
(function(){
  const JT16={ver:16,simErrors:0};

  function finitePos16(p){return p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&Number.isFinite(p.z);}
  function safeFloor16(t,e){
    const T=tankType(t);
    if(!finitePos16(e.pos))e.pos=v3(T.w*.5,0,T.d*.5);
    clampTankXZ(t,e.pos,2);
    const g=groundAt(t,e.pos.x,e.pos.z);
    e.surf=g.p?{t:'plat',id:g.p.id}:S_FLOOR;
    e.pos.y=g.h;
    e.route=null;e.jump=null;e.vel=v3();
  }
  function releaseOwned16(s){
    const p=s&&s.hunt&&s.hunt.prey;
    if(p&&p.owner===s){p.owner=null;p.feed=0;if(p.kind!=='spider'){p.dead=false;p.state='idle';}else p._huntedBy=null;}
  }
  function resetSpider16(t,s,msg='Reorienting after the habitat changed'){
    releaseOwned16(s);
    s.hunt=null;s.route=null;s.jump=null;s.drag=null;s.dg=null;s.retreat=null;s._probeKey='';s._probeT=0;s.after=null;
    safeFloor16(t,s);
    try{setSt(s,'wander',msg);}catch(_){s.state='wander';s.st=0;s.mood=msg;}
  }
  function sanitizeSpider16(t,s){
    if(!s||s._gone)return;
    if(!finitePos16(s.pos)){resetSpider16(t,s,'Recovered from an invalid position');return;}
    const st=s.state||'wander';
    const retreatStates=['toRetreat','toMolt','premolt','molt','sleep'];
    if(retreatStates.includes(st)){
      const r=s.retreat, rs=r&&r.surf;
      let ok=!!(r&&r.pt&&finitePos16(r.pt));
      if(ok&&rs&&(rs.t==='plat'||rs.t==='climb')&&!platById(t,rs.id))ok=false;
      if(!ok){resetSpider16(t,s,'Its old retreat is gone — exploring again');return;}
    }
    if(['carry','feed','subdue'].includes(st)){
      const p=s.hunt&&s.hunt.prey;
      if(!p||p.owner!==s){resetSpider16(t,s,'Lost track of its meal — exploring again');return;}
    }
    if(['stalk','crouch','pounce'].includes(st)){
      const p=s.hunt&&s.hunt.prey;
      if(!p||!targetValid(t,s,p)){s.hunt=null;s.route=null;s.jump=null;try{setSt(s,'wander','The target is gone — searching again');}catch(_){s.state='wander';s.st=0;}return;}
    }
    if(Array.isArray(s.route)){
      for(const seg of s.route){
        if(!seg||!seg.pt||!finitePos16(seg.pt)){s.route=null;break;}
        if(seg.surf&&(seg.surf.t==='plat'||seg.surf.t==='climb')&&!platById(t,seg.surf.id)){s.route=null;break;}
      }
    }
  }
  function sanitizePrey16(t,p){
    if(!p)return;
    if(!finitePos16(p.pos)){safeFloor16(t,p);try{setSt(p,'idle');}catch(_){p.state='idle';p.st=0;}}
    if(Array.isArray(p.route))for(const seg of p.route){if(!seg||!seg.pt||!finitePos16(seg.pt)){p.route=null;break;}}
    if(p.owner&&!t.spiders.includes(p.owner)){p.owner=null;p.dead=false;p.feed=0;p.state='idle';}
  }

  const _updSpider16=updSpider;
  updSpider=function(t,s,dt){
    sanitizeSpider16(t,s);
    try{return _updSpider16(t,s,Math.min(.05,Math.max(0,dt)));}
    catch(e){JT16.simErrors++;console.warn('spider update recovered',s&&s.name,e);resetSpider16(t,s,'Recovered and resumed exploring');}
  };
  const _updPrey16=updPrey;
  updPrey=function(t,p,dt){
    sanitizePrey16(t,p);
    try{return _updPrey16(t,p,Math.min(.05,Math.max(0,dt)));}
    catch(e){JT16.simErrors++;console.warn('prey update recovered',p&&p.type,e);safeFloor16(t,p);p.owner=null;p.dead=false;p.route=null;p.jump=null;try{setSt(p,'idle');}catch(_){p.state='idle';p.st=0;}}
  };

  // Bypass v15's single coarse 0.35–0.55 s AI step. Background habitats still update
  // less often, but their elapsed time is subdivided into the same safe <=50 ms steps
  // used by the foreground simulation. One animal error is isolated and cannot freeze prey.
  updTank=function(t,dt){
    if(!t||t.owned===false)return;
    return withTankDims(t,()=>{
      const active=(G.tanks[G.cur]===t)||(t.id===G.cur);
      let total=dt;
      if(!active){
        t._bgAccum=(t._bgAccum||0)+dt;
        if(t._bgAccum<.30)return;
        total=Math.min(.60,t._bgAccum);t._bgAccum=0;
      }else t._bgAccum=0;
      let left=Math.max(0,total),guard=0;
      while(left>1e-5&&guard++<14){
        const step=Math.min(.05,left);left-=step;
        try{_updTank15(t,step);}catch(e){JT16.simErrors++;console.warn('habitat update recovered',t.id,e);}
      }
      try{enforceTankBounds15(t);}catch(e){JT16.simErrors++;console.warn('habitat bounds recovered',t.id,e);}
    });
  };

  function normalizeHabitatStates16(t){
    if(!t)return;
    withTankDims(t,()=>{
      for(const s of t.spiders)sanitizeSpider16(t,s);
      for(const p of t.prey)sanitizePrey16(t,p);
    });
  }
  const _clearDecor16=clearDecor15;
  clearDecor15=function(t,refund=false){const r=_clearDecor16(t,refund);normalizeHabitatStates16(t);return r;};
  const _changeTankType16=changeTankType15;
  changeTankType15=function(t,id){const r=_changeTankType16(t,id);normalizeHabitatStates16(t);return r;};
  const _switchTank16=switchTank15;
  switchTank15=function(i){const r=_switchTank16(i);const t=G.tanks[G.cur];if(t){t._bgAccum=0;normalizeHabitatStates16(t);setTankDims(t);setupCam(cam,cam.mode);}return r;};

  // Universal horizontal shelf controls for Decor / Plants / Live Food / Presets.
  const dr=$('drawer');
  let nav=$('drawerNav16');
  if(!nav){
    nav=document.createElement('div');nav.id='drawerNav16';
    nav.innerHTML='<button id="drawerPrev16" aria-label="Scroll inventory left">‹</button><button id="drawerNext16" aria-label="Scroll inventory right">›</button>';
    document.body.appendChild(nav);
    const st=document.createElement('style');st.textContent=`
      #drawer{position:relative;scroll-behavior:smooth;cursor:grab;padding-left:50px;padding-right:50px}
      #drawer.drag16{cursor:grabbing;scroll-behavior:auto}
      #drawerNav16{position:fixed;display:none;z-index:30;pointer-events:none;height:1px}
      #drawerNav16 button{position:absolute;top:0;transform:translateY(-50%);pointer-events:auto;width:40px;height:46px;padding:0;font:bold 28px/1 Georgia,serif;border-radius:7px;background:linear-gradient(rgba(70,43,22,.98),rgba(39,23,12,.98));border:1px solid #c89b4b;box-shadow:0 3px 10px rgba(0,0,0,.55);opacity:.94}
      #drawerPrev16{left:4px}#drawerNext16{right:4px}#drawerNav16 button:disabled{opacity:.25;transform:translateY(-50%);cursor:default}
      #drawer:before,#drawer:after{content:"";position:sticky;display:inline-block;width:1px;height:1px;z-index:2}
    `;document.head.appendChild(st);
  }
  const prev=$('drawerPrev16'),next=$('drawerNext16');
  function navPos16(){
    if(dr.style.display==='none'||!UI.drawer){nav.style.display='none';return;}
    const r=dr.getBoundingClientRect();nav.style.display='block';nav.style.left=r.left+'px';nav.style.top=(r.top+r.height*.5)+'px';nav.style.width=r.width+'px';
    const max=Math.max(0,dr.scrollWidth-dr.clientWidth);prev.disabled=dr.scrollLeft<=2;next.disabled=dr.scrollLeft>=max-2;nav.style.opacity=max>3?'1':'0';
  }
  function scrollDrawer16(dir){dr.scrollBy({left:dir*Math.max(220,dr.clientWidth*.72),behavior:'smooth'});setTimeout(navPos16,260);}
  prev.onclick=()=>scrollDrawer16(-1);next.onclick=()=>scrollDrawer16(1);
  dr.addEventListener('scroll',navPos16,{passive:true});
  dr.addEventListener('wheel',e=>{if(dr.scrollWidth<=dr.clientWidth+2)return;if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){e.preventDefault();dr.scrollLeft+=e.deltaY;navPos16();}},{passive:false});
  let drag=null,dragMoved=false;
  dr.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;drag={x:e.clientX,sl:dr.scrollLeft,id:e.pointerId,captured:false};dragMoved=false;});
  dr.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const dx=e.clientX-drag.x;if(!dragMoved&&Math.abs(dx)>5){dragMoved=true;dr.classList.add('drag16');try{dr.setPointerCapture(e.pointerId);drag.captured=true;}catch(_){}}if(!dragMoved)return;e.preventDefault();dr.scrollLeft=drag.sl-dx;navPos16();});
  const endDrag=e=>{if(!drag||e.pointerId!==drag.id)return;const wasCaptured=drag.captured;drag=null;dr.classList.remove('drag16');if(wasCaptured)try{dr.releasePointerCapture(e.pointerId);}catch(_){};setTimeout(()=>dragMoved=false,0);};
  dr.addEventListener('pointerup',endDrag);dr.addEventListener('pointercancel',endDrag);
  dr.addEventListener('click',e=>{if(dragMoved){e.preventDefault();e.stopPropagation();dragMoved=false;}},true);
  const _openDrawer16=openDrawer;
  openDrawer=function(kind){const r=_openDrawer16(kind);dr.scrollLeft=0;requestAnimationFrame(navPos16);setTimeout(navPos16,80);return r;};
  const _closeDrawer16=closeDrawer;
  closeDrawer=function(){nav.style.display='none';return _closeDrawer16();};
  window.addEventListener('resize',()=>setTimeout(navPos16,0));

  // Heal any state already corrupted in a v15 save/session immediately on boot.
  for(const t of G.tanks||[])if(t&&t.owned)normalizeHabitatStates16(t);
  window.__JT16=JT16;
})();
// ================= end v16 habitat stability + drawer navigation =================
