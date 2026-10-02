// ================= v20 wildlife observation mode =================
const OBS20={on:false,subject:null,hold:0,lastSwitch:0,prevCam:1,prevSel:null};
function observationScore20(s){if(!s||s.owner)return-1e9;let q=0;switch(s.state){case'pounce':q=12;break;case'subdue':q=11;break;case'crouch':q=9;break;case'stalk':q=7;break;case'notice':q=5;break;case'premolt':case'molt':q=9;break;case'display':case'threat':q=8;break;case'escape':q=7;break;case'drink':q=5;break;case'groom':q=2;break;case'watch':q=3;break;default:q=1;}if(s.hunt?.prey?.kind==='spider')q+=2;if(s.jump)q+=2;if(s.softT>0)q+=1.5;return q;}
function bestObservation20(t){let best=null,bs=-1e9;for(const s of t.spiders){const sc=observationScore20(s)+rand()*.18;if(sc>bs){bs=sc;best=s;}}return best;}
function ensureObsHud20(){let h=$('obsHud20');if(h)return h;h=document.createElement('div');h.id='obsHud20';h.innerHTML='<div><b id="obsTitle20">Observation Mode</b><span id="obsText20"></span></div><button id="obsExit20">Exit</button>';document.body.appendChild(h);$('obsExit20').onclick=()=>toggleObservation20(false);return h;}
function toggleObservation20(force){const on=force===undefined?!OBS20.on:!!force;if(on===OBS20.on)return;OBS20.on=on;ensureObsHud20();document.body.classList.toggle('observe20',on);$('obsBtn')?.classList.toggle('on',on);if(on){OBS20.prevCam=cam.mode;OBS20.prevSel=G.sel;try{cancelPlace();}catch(_){}UI.remove=false;$('removeBtn')?.classList.remove('on');const t=cur();OBS20.subject=G.sel&&t.spiders.includes(G.sel)?G.sel:bestObservation20(t);G.sel=OBS20.subject;OBS20.hold=5;OBS20.lastSwitch=G.clock;setCam(3);toast('📹 Observation Mode — watching the habitat');}else{const prev=OBS20.prevSel,t=cur();G.sel=prev&&t.spiders.includes(prev)?prev:null;setCam(OBS20.prevCam||1);OBS20.subject=null;}}
function updateObservation20(t,dt){if(!OBS20.on||!t||t.id!==G.cur)return;OBS20.hold=Math.max(0,OBS20.hold-dt);let curS=OBS20.subject;if(!curS||curS.owner||!t.spiders.includes(curS)){curS=bestObservation20(t);OBS20.subject=curS;OBS20.hold=4;}
 let best=curS,bs=observationScore20(curS);for(const s of t.spiders){const sc=observationScore20(s);if(sc>bs+1.7){best=s;bs=sc;}}
 if(best&&best!==curS&&OBS20.hold<=0){OBS20.subject=best;G.sel=best;OBS20.hold=rr(5.5,10);OBS20.lastSwitch=G.clock;curS=best;setCam(3);}else if(curS)G.sel=curS;
 const title=$('obsTitle20'),txt=$('obsText20');if(curS&&title&&txt){title.textContent=`📹 ${curS.name} • ${SPEC[curS.sp].name}`;const prey=curS.hunt?.prey;txt.textContent=`${curS.mood||curS.state}${prey?` • watching ${targetName(prey)}`:''}`;}}
const _updTankObs20=updTank;
updTank=function(t,dt){const r=_updTankObs20(t,dt);updateObservation20(t,dt);return r;};
$('obsBtn').onclick=()=>toggleObservation20();
window.addEventListener('keydown',e=>{if((e.key==='o'||e.key==='O')&&!/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))toggleObservation20();if(e.key==='Escape'&&OBS20.on)toggleObservation20(false);});
ensureObsHud20();
window.__JT20_OBS={OBS20,toggleObservation20};
// ================= end v20 wildlife observation mode =================
