const $=id=>document.getElementById(id);
const UI={drawer:null,place:null,rot:0,remove:false,infoMini:(()=>{try{return matchMedia('(max-width:820px),(max-height:520px)').matches;}catch(e){return false;}})()};
const cv=$('cv');cv.width=W;cv.height=H;const ov=$('ov');ov.width=W;ov.height=H;const octx=ov.getContext('2d');
const src=document.createElement('canvas');src.width=W;src.height=H;const ctx=src.getContext('2d');const fc=document.createElement('canvas');fc.width=W;fc.height=H;const fctx=fc.getContext('2d');
function toast(msg){const el=document.createElement('div');el.className='toast';el.textContent=msg;$('toasts').appendChild(el);setTimeout(()=>el.remove(),5000);while($('toasts').children.length>5)$('toasts').firstChild.remove();}
function hint(msg){const h=$('hint');if(!msg){h.style.display='none';return;}h.textContent=msg;h.style.display='block';}
function closeModal(id){$(id).style.display='none';}
function cur(){return G.tanks[G.cur];}
function resize(){const st=$('stage');const s=Math.min(st.clientWidth/W,st.clientHeight/H);cv.style.width=Math.floor(W*s)+'px';cv.style.height=Math.floor(H*s)+'px';ov.style.width=cv.style.width;ov.style.height=cv.style.height;ov.style.left=cv.offsetLeft+'px';ov.style.top=cv.offsetTop+'px';if(window.__jtSyncFallback)window.__jtSyncFallback();}
window.addEventListener('resize',resize);
function setCam(m){setupCam(cam,m);['cam1','cam2','cam3','cam4'].forEach((id,i)=>$(id).classList.toggle('on',i+1===m));if(typeof VIEW!=='undefined'){VIEW.z=1;clampView();}}
$('cam1').onclick=()=>setCam(1);$('cam2').onclick=()=>setCam(2);$('cam4').onclick=()=>setCam(4);$('cam3').onclick=()=>setCam(3);
$('timeBtn').onclick=()=>{G.timeMode=(G.timeMode+1)%3;$('timeBtn').textContent=['⏱ Auto','☀ Day','🌙 Night'][G.timeMode];};
$('sndBtn').onclick=()=>{$('sndModal').style.display='flex';};$('helpBtn').onclick=()=>{$('helpModal').style.display='flex';};
for(const [id,k] of [['vMusic','music'],['vAmb','amb'],['vSfx','sfx']])$(id).oninput=e=>{SND.vol[k]=e.target.value/100;applyVol();};
$('rainChk').onchange=e=>SND.rain=e.target.checked;$('roomChk').onchange=e=>SND.room=e.target.checked;
function renderTabs(){const el=$('tabs');el.innerHTML='';G.tanks.forEach((t,i)=>{const b=document.createElement('button');b.textContent=`${t.name} (${t.spiders.length}🕷)`;b.className=i===G.cur?'on':'';b.onclick=()=>{G.cur=i;G.sel=null;renderTabs();SFX.click();};el.appendChild(b);});}
// ----- icons -----
function iconCanvas(drawFn,w=72,h=56){w*=ICS;h*=ICS;const c=document.createElement('canvas');c.width=w;c.height=h;const pb=new PB(w,h);const old=B;B=pb;drawFn(pb);B=old;c.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(pb.d.buffer),w,h),0,0);return c;}
const ICONC={};function decorIcon(type){if(ICONC[type])return ICONC[type];NOCLAMP=true;ICONMODE=true;try{return ICONC[type]=iconCanvas(pb=>{const D=DECOR[type];const k=D.kind==='flat'?Math.min(2.6,60/D.w):Math.min(1.3,40/Math.max(D.ph||D.h||10,D.w));const d={id:0,type,x:0,z:0,seed:12345,w:D.w,d:D.d,h:D.h||0,x0:-D.w/2,x1:D.w/2,z0:-D.d/2,z1:D.d/2,perches:[]};
  const t={decor:[]};const it=addDecor(t,type,0,0,0,12345);const cp={mode:2,k:k*ICS,ox:36*ICS,oy:(D.kind==='flat'?48:50)*ICS};
  if(D.kind==='flat'){ppoly([P(it.x0,0,it.z0,cp),P(it.x1,0,it.z0,cp),P(it.x1,0,it.z1,cp),P(it.x0,0,it.z1,cp)].map(p=>[p[0],p[1]-14*ICS]),(sx,sy)=>{const q=invFloor(sx+0.5,sy+14*ICS+0.5,0,cp);return flatColor(it,q.x,q.z);});}
  else if(D.kind==='plat')drawPlat(cp,it);else drawPlant(cp,it);});}finally{NOCLAMP=false;ICONMODE=false;}}
function subIcon(id){return iconCanvas(pb=>{for(let y=0;y<56*ICS;y++)for(let x=0;x<72*ICS;x++)pset(x,y,subTex(id,x*0.5/ICS,y*0.5/ICS));});}
function preyIcon(type){return iconCanvas(()=>{const p={type,size:PREY[type].size,seed:7,anim:1,surf:S_FLOOR,spd:0};const u=Math.min(4,40/p.size/1.0);drawPrey(p,36*ICS,40*ICS,u*ICS,'side',false,0,{});});}
function spiderPortrait(id,w,h,lock){return iconCanvas(()=>{const S=SPEC[id];const pal=lock?Object.fromEntries(Object.keys(S.pal).map(k=>[k,'#3a2c20'])):S.pal;drawJumper({x:w*ICS/2,y:h*ICS*0.86,u:h*ICS/11,view:'front',pal,pat:S.pat,seed:42,as:1,raise:0.5});},w,h);}
// ----- drawer -----
function openDrawer(kind){if(UI.drawer===kind){closeDrawer();return;}UI.drawer=kind;cancelPlace();const dr=$('drawer');dr.innerHTML='';dr.style.display='block';
 document.querySelectorAll('#bar button').forEach(b=>b.classList.toggle('on',b.dataset.d===kind));
 setTimeout(resize,0);const add=(icon,title,price,on)=>{const c=document.createElement('div');c.className='card';c.appendChild(icon);const a=document.createElement('div');a.textContent=title;const p=document.createElement('div');p.className='pr';p.textContent=price;c.append(a,p);c.onclick=()=>{document.querySelectorAll('.card').forEach(x=>x.classList.remove('sel'));c.classList.add('sel');on();};dr.appendChild(c);};
 if(kind==='decor'||kind==='plants'){for(const id in DECOR){const D=DECOR[id];if(D.cat!==kind)continue;add(decorIcon(id),D.name,D.price?`🪙 ${D.price}`:'free',()=>startPlace({kind:'decor',id}));}
  add(iconCanvas(()=>{}),'✨ Starter layout','🪙 60',()=>starterLayout());add(iconCanvas(()=>{}),'🗑 Clear all decor','refund 50%',()=>{if(confirm('Remove all decor from this tank?')){const t=cur();for(const d of t.decor)G.coins+=Math.floor(DECOR[d.type].price/2);t.decor=[];t.bgKey='';for(const e of [...t.spiders,...t.prey]){e.surf=S_FLOOR;e.pos.y=0;e.route=null;}}});}
 if(kind==='sub'){for(const id in SUBS)add(subIcon(id),SUBS[id].name,SUBS[id].price?`🪙 ${SUBS[id].price}`:'free',()=>{const t=cur();if(t.sub===id)return;if(G.coins<SUBS[id].price){toast('Not enough coins');return;}G.coins-=SUBS[id].price;t.sub=id;t.bgKey='';SFX.place();toast(`Substrate changed to ${SUBS[id].name}`);});}
 if(kind==='prey'){for(const id in PREY){const P_=PREY[id];add(preyIcon(id),`${P_.name}${P_.pack>1?' ×'+P_.pack:''}`,`🪙 ${P_.price}`,()=>startPlace({kind:'prey',id}));}
  add(iconCanvas(()=>{}),'🎲 Random mix','🪙 15',()=>{if(G.coins<15)return toast('Not enough coins');G.coins-=15;const t=cur();for(const id of ['fruitfly','fruitfly','fruitfly','housefly','cricket','mealworm','moth'])t.prey.push(newPrey(id,t,v3(rr(20,TW-20),TH-5,rr(15,TD-15))));SFX.buy();});}}
function closeDrawer(){UI.drawer=null;$('drawer').style.display='none';setTimeout(resize,0);document.querySelectorAll('#bar button').forEach(b=>b.classList.remove('on'));cancelPlace();}
document.querySelectorAll('#bar button[data-d]').forEach(b=>b.onclick=()=>{SFX.click();openDrawer(b.dataset.d);});
function startPlace(pl){UI.place=pl;UI.remove=false;$('removeBtn').classList.remove('on');hint(pl.kind==='prey'?`${TOUCH?'Tap':'Click'} in the tank to release ${PREY[pl.id].name}${TOUCH?'':' (Esc to stop)'}`:`${TOUCH?'Drag & lift':'Click'} to place ${DECOR[pl.id].name}${TOUCH?'':'  •  R / wheel rotates  •  Esc to stop'}`);showPB(pl);}
function cancelPlace(){UI.place=null;hint(null);showPB(null);document.querySelectorAll('.card').forEach(x=>x.classList.remove('sel'));}
function placeOK(t,pl,x,z){if(pl.kind==='prey')return x>2&&x<TW-2&&z>2&&z<TD-2;const D=DECOR[pl.id];let w=D.w,d=D.d;if(UI.rot&&D.kind==='plat')[w,d]=[d,w];
 if(x-w/2<1||x+w/2>TW-1||z-d/2<1||z+d/2>TD-1)return false;if(D.kind==='plat'){for(const o of plats(t)){if(x-w/2<o.x1&&x+w/2>o.x0&&z-d/2<o.z1&&z+d/2>o.z0)return false;}}return true;}
function doPlace(t,m){const pl=UI.place;if(!placeOK(t,pl,m.x,m.z)){toast("Can't place that there");return;}
 if(pl.kind==='decor'){const D=DECOR[pl.id];if(G.coins<D.price){toast('Not enough coins');return;}G.coins-=D.price;const it=addDecor(t,pl.id,m.x,m.z,UI.rot);SFX.place();
  for(const e of [...t.spiders,...t.prey]){if(D.kind==='plat'&&e.surf.t==='floor'&&e.pos.x>it.x0&&e.pos.x<it.x1&&e.pos.z>it.z0&&e.pos.z<it.z1){e.surf={t:'plat',id:it.id};e.pos.y=it.h;e.route=null;}}}
 else{const P_=PREY[pl.id];if(t.prey.length>=40){toast('The tank is full of critters!');return;}if(G.coins<P_.price){toast('Not enough coins');return;}if(!releasePreyAt(t,pl.id,m.x,m.z))return;}}
function starterLayout(){const t=cur();if(G.coins<60)return toast('Not enough coins');G.coins-=60;t.decor=[];const L=[['moss',40,60],['litter',150,65],['pebbles',100,75],['dish',170,25],['bark',60,30],['tower',165,40],['drift',105,55],['fern',30,20],['pinkfl',125,25],['grass',190,75],['succ',80,78],['shroom',140,80],['stone',25,75]];
 for(const [ty,x,z] of L){const it={kind:'decor',id:ty};if(placeOK(t,it,x,z))addDecor(t,ty,x,z);}for(const e of [...t.spiders,...t.prey]){const g=groundAt(t,e.pos.x,e.pos.z);if(g.p&&e.surf.t==='floor'){e.surf={t:'plat',id:g.p.id};e.pos.y=g.h;}e.route=null;}SFX.place();toast('Starter layout placed ✨');}
function clearEntityRefs(t,target){
 for(const sp of t.spiders){
  if(sp===target)continue;
  if(sp.hunt&&sp.hunt.prey===target){sp.hunt=null;sp.route=null;if(!sp.owner)setSt(sp,'wander','Target disappeared - reassessing');}
  if(sp._huntedBy===target)sp._huntedBy=null;
 }
 if(target&&target.owner){const o=target.owner;if(o.hunt&&o.hunt.prey===target){o.hunt=null;o.route=null;if(!o.owner)setSt(o,'groom','Prey was removed');}target.owner=null;}
}
function removeAt(t,s,fr){
 const cand=[];const add=(kind,obj,x,y,r,prio=0)=>{const d=Math.hypot(x-s[0],y-s[1]);if(d<=Math.max(r,fr))cand.push({kind,obj,d,score:d-Math.min(r,fr)*0.12-prio});};
 // Animals get precise hit radii and are considered before large decor centers when overlapping.
 for(const sp of t.spiders){const dp=sp._dp||sp.pos,q=Pv(dp),r=Math.max(14,spSize(sp)*cam.k*CSf(cam)*0.9);add('spider',sp,q[0],q[1]-spSize(sp)*cam.k*CSf(cam)*0.28,r,4);}
 for(const p of t.prey){if(p.owner)continue;const dp=p._dp||p.pos,q=Pv(dp),r=Math.max(10,p.size*cam.k*PSf(cam)*0.8);add('prey',p,q[0],q[1]-p.size*cam.k*PSf(cam)*0.18,r,5);}
 for(const h of t.husks){const q=Pv(h.pos),r=Math.max(9,h.size*cam.k*CSf(cam)*0.65);add('husk',h,q[0],q[1],r,2);}
 for(const d of t.drops){const q=Pv(d.pos),r=Math.max(7,cam.k*2.4);add('drop',d,q[0],q[1],r,1);}
 for(const d of t.decor){const D=DECOR[d.type],q=P(d.x,(D.ph||D.h||0)*0.5,d.z),r=Math.max(18,Math.min(65,cam.k*Math.max(d.w,d.d,D.h||0)*0.42));add('decor',d,q[0],q[1],r,0);}
 // Silk strands can also be cleaned directly when clicked near a visible segment.
 if(t.silk)for(const l of t.silk){const a=Pv(l.a),b=Pv(l.b);const vx=b[0]-a[0],vy=b[1]-a[1],den=vx*vx+vy*vy||1,u=clamp(((s[0]-a[0])*vx+(s[1]-a[1])*vy)/den,0,1),x=a[0]+vx*u,y=a[1]+vy*u;const d=Math.hypot(x-s[0],y-s[1]);if(d<=Math.max(6,fr*.55))cand.push({kind:'silk',obj:l,d,score:d+3});}
 if(!cand.length)return false;cand.sort((a,b)=>a.score-b.score);const c=cand[0];
 if(c.kind==='decor'){
  const d=c.obj;t.decor.splice(t.decor.indexOf(d),1);t.bgKey='';G.coins+=Math.floor(DECOR[d.type].price/2);SFX.place();
  for(const e2 of [...t.spiders,...t.prey])if(((e2.surf.t==='plat'||e2.surf.t==='climb')&&e2.surf.id===d.id)||(e2.surf.t==='perch'&&e2.surf.id===d.id)){e2.surf=S_FLOOR;e2.pos.y=0;e2.route=null;e2.jump=null;if(e2.state==='pounce'||e2.state==='dangle')setSt(e2,'wander');}
  for(const sp of t.spiders)if(sp.retreat&&sp.retreat.surf.id===d.id)sp.retreat=null;t.drops=t.drops.filter(q=>q.surf.t!=='perch');toast(`Removed ${DECOR[d.type].name} • refunded 🪙 ${Math.floor(DECOR[d.type].price/2)}`);return true;
 }
 if(c.kind==='prey'){const p=c.obj;clearEntityRefs(t,p);const i=t.prey.indexOf(p);if(i>=0)t.prey.splice(i,1);toast(`Removed ${PREY[p.type].one}`);SFX.click();return true;}
 if(c.kind==='spider'){const sp=c.obj;clearEntityRefs(t,sp);if(sp.hunt&&sp.hunt.prey&&sp.hunt.prey.owner===sp){const p=sp.hunt.prey;p.owner=null;p.dead=false;p.feed=0;if(p.kind!=='spider')p.state='idle';}const i=t.spiders.indexOf(sp);if(i>=0)t.spiders.splice(i,1);if(G.sel===sp)G.sel=null;renderTabs();toast(`Returned ${sp.name} to the collection`);SFX.click();return true;}
 if(c.kind==='husk'){const i=t.husks.indexOf(c.obj);if(i>=0)t.husks.splice(i,1);toast('Removed remains');SFX.click();return true;}
 if(c.kind==='drop'){const i=t.drops.indexOf(c.obj);if(i>=0)t.drops.splice(i,1);SFX.click();return true;}
 if(c.kind==='silk'){const i=t.silk.indexOf(c.obj);if(i>=0)t.silk.splice(i,1);toast('Removed silk strand');SFX.click();return true;}
 return false;
}
$('removeBtn').onclick=()=>{UI.remove=!UI.remove;cancelPlace();$('removeBtn').classList.toggle('on',UI.remove);hint(UI.remove?'Click anything in the tank to remove it. Decor refunds 50%. Esc to stop':null);};
$('mistBtn').onclick=()=>{const t=cur();SFX.mist();for(let i=0;i<16;i++){const w=pick(['z0','x0','xW','zD']);const p=wallClamp(w,v3(rr(5,TW-5),rr(8,TH-10),rr(5,TD-5)));t.drops.push({pos:p,surf:{t:'wall',w},v:rr(0.7,1)});}
 for(const d of t.decor)for(const pp of d.perches)if(rand()<0.4)t.drops.push({pos:vc(pp),surf:{t:'perch'},v:rr(0.5,0.9)});toast('💧 Misted the tank');};
$('cleanBtn').onclick=()=>{const t=cur();const n=t.husks.length;t.husks=[];toast(n?`🧹 Cleaned up ${n} leftovers`:'Already spotless!');SFX.click();};
// ----- collection -----
let colSel=null;
function checkUnlocks(){for(const S of SPECIES){if(S.req&&!G.unlocked[S.id]&&G.catches>=S.req){G.unlocked[S.id]=1;toast(`🏆 ${S.name} unlocked for ${S.req} catches!`);}}}
function openCollection(){$('colModal').style.display='flex';renderCol();}
$('colBtn').onclick=()=>{SFX.click();openCollection();};
function renderCol(){const g=$('colgrid');g.innerHTML='';for(const S of SPECIES){const un=!!G.unlocked[S.id];const c=document.createElement('div');c.className='scard'+(un?'':' lock')+(colSel===S.id?' sel':'');c.appendChild(spiderPortrait(S.id,120,90,!un));
  const n=document.createElement('div');n.innerHTML=`<b>${S.name}</b><br>${un?'✅ Unlocked':S.req?`🔒 ${G.catches}/${S.req} catches`:`🔒 🪙 ${S.price}`}`;c.appendChild(n);c.onclick=()=>{colSel=S.id;renderCol();};g.appendChild(c);}
 const det=$('coldet');if(!colSel){det.innerHTML='<p>Select a jumper to see details.</p>';return;}const S=SPEC[colSel];const un=!!G.unlocked[S.id];det.innerHTML='';det.appendChild(spiderPortrait(S.id,200,150,!un));
 const info=document.createElement('div');info.style.flex='1';const bar=(l,v,c)=>`<div class="st"><div class="row"><span>${l}</span><span>${Math.round(v*10)}/10</span></div><div class="bar"><i style="width:${v*100}%;background:${c}"></i></div></div>`;
 info.innerHTML=`<h3 style="margin:0">${S.name}</h3><i>${S.lat}</i><p>${S.desc}</p><p>Adult size: ~${S.size} mm</p>`+bar('Stealth',S.st.stealth,'#9a6ad8')+bar('Patience',S.st.patience,'#4a9ae8')+bar('Jump power',S.st.jump,'#e8c24a')+bar('Boldness',S.st.bold,'#e85a4a');
 const btn=document.createElement('button');const t=cur();
 if(un){btn.textContent=`Place in ${t.name}`;btn.disabled=t.spiders.length>=tankCapacity(t);if(t.spiders.length>=tankCapacity(t))btn.textContent=`${t.name} is full (${tankCapacity(t)} max)`;btn.onclick=()=>{const s=newSpider(S.id,t);t.spiders.push(s);G.sel=s;renderTabs();closeModal('colModal');SFX.place();toast(`Welcome ${s.name} the ${S.name}! 🕷`);};}
 else if(S.req){btn.textContent=`Catch ${S.req-G.catches} more prey to unlock`;btn.disabled=true;}
 else{btn.textContent=`Unlock for 🪙 ${S.price}`;btn.disabled=G.coins<S.price;btn.onclick=()=>{G.coins-=S.price;G.unlocked[S.id]=1;SFX.buy();toast(`Unlocked ${S.name}!`);renderCol();};}
 info.appendChild(btn);det.appendChild(info);}
// ----- info panel -----
const STAGES=['','Tiny sling','Sling','Juvenile','Sub-adult','Young adult','Adult'];
let infoBuilt=null;
function renderInfo(){const el=$('info');const s=G.sel;const t=cur();if(!s||!t.spiders.includes(s)){el.style.display='none';infoBuilt=null;return;}el.style.display='block';const S=SPEC[s.sp];
 if(infoBuilt!==s){infoBuilt=s;el.innerHTML=`<div class="row"><h3 id="iName" title="Click to rename" style="cursor:pointer">${s.name}</h3><span style="white-space:nowrap"><button id="iMini" title="Compact / details" style="padding:1px 8px">${UI.infoMini?'+':'–'}</button> <button id="iClose" style="padding:1px 7px">×</button></span></div><div class="lat">${S.name} • ${S.lat}</div>
  <div class="row"><span>Fullness</span><span id="iSatT"></span></div><div class="bar"><i id="iSat" style="background:#7fc46a"></i></div>
  <div class="row"><span>Hydration</span></div><div class="bar"><i id="iHyd" style="background:#5ab4e8"></i></div>
  <div class="row"><span id="iStage"></span><span id="iMeals"></span></div><div class="bar"><i id="iGrow" style="background:#e8c24a"></i></div>
  <div id="state"></div><div class="row"><span>Stealth ${Math.round(s.tr.stealth*10)} • Patience ${Math.round(s.tr.patience*10)}</span></div><div class="row"><span>Jump ${Math.round(s.tr.jump*10)} • Bold ${Math.round(s.tr.bold*10)}</span></div>
  <div class="row" style="margin:4px 0 8px"><span id="iCatch"></span></div><div class="grp"><button id="iFollow">🎥 Follow</button><button id="iRel">↩ Collection</button></div>`;
  $('iClose').onclick=()=>{G.sel=null;};el.classList.toggle('mini',!!UI.infoMini);$('iMini').onclick=()=>{UI.infoMini=!UI.infoMini;el.classList.toggle('mini',UI.infoMini);$('iMini').textContent=UI.infoMini?'+':'–';};$('iFollow').onclick=()=>setCam(3);$('iName').onclick=()=>{const n=prompt('Rename your jumper:',s.name);if(n&&n.trim()){s.name=n.trim().slice(0,16);infoBuilt=null;}};
  $('iRel').onclick=()=>{if(!confirm(`Return ${s.name} to the collection? (It will leave this tank)`))return;const p=s.hunt&&s.hunt.prey;if(p&&p.owner===s){p.owner=null;p.dead=false;p.state='idle';}t.spiders.splice(t.spiders.indexOf(s),1);G.sel=null;renderTabs();};}
 $('iSat').style.width=s.sat+'%';$('iSatT').textContent=s.sat>85?'Full & round':s.sat>55?'Content':s.sat>30?'Peckish':'Hungry!';$('iHyd').style.width=(1-s.thirst)*100+'%';
 $('iStage').textContent=`${STAGES[s.stage]} (${s.stage}/6)`;$('iMeals').textContent=s.stage<6?`next molt ${s.meals}/${3+s.stage}`:'fully grown';$('iGrow').style.width=(s.stage<6?s.meals/(3+s.stage)*100:100)+'%';
 $('state').textContent='💭 '+(s.mood||s.state);$('iCatch').textContent=`🏹 ${s.catches} catches • ${spSize(s).toFixed(1)} mm`;}
// ----- input -----
// ----- input (v3: pointer, touch, zoom & pan) -----
const VIEW={z:1,cx:W/2,cy:H/2};
function clampView(){const z=VIEW.z=clamp(VIEW.z,1,4);const hw=W/(2*z),hh=H/(2*z);VIEW.cx=clamp(VIEW.cx,hw,W-hw);VIEW.cy=clamp(VIEW.cy,hh,H-hh);}
function zoomAt(f,sx,sy){const z0=VIEW.z;const z1=clamp(z0*f,1,4);if(sx===undefined){sx=VIEW.cx;sy=VIEW.cy;}VIEW.cx=sx-(sx-VIEW.cx)*z0/z1;VIEW.cy=sy-(sy-VIEW.cy)*z0/z1;VIEW.z=z1;clampView();}
function evToScr(e){const r=cv.getBoundingClientRect();const nx=(e.clientX-r.left)/r.width,ny=(e.clientY-r.top)/r.height;return [VIEW.cx+(nx-0.5)*W/VIEW.z,VIEW.cy+(ny-0.5)*H/VIEW.z];}
function srcPerCss(){const r=cv.getBoundingClientRect();return W/(r.width||W)/VIEW.z;}
function hoverAt(e){const s=evToScr(e);G.mouseScr=s;const m=invFloor(s[0],s[1],0);G.mouse=(m.x>=0&&m.x<=TW&&m.z>=0&&m.z<=TD)?m:null;}
function tapAt(s){const t=cur();const m=invFloor(s[0],s[1],0);const inside=m.x>=0&&m.x<=TW&&m.z>=0&&m.z<=TD;const fr=(TOUCH?24:10)*srcPerCss();
 if(UI.place){if(inside)doPlace(t,m);return;}
 if(UI.remove){removeAt(t,s,fr);return;}
 let best=null,bd=1e9;for(const sp of t.spiders){const p=Pv(sp._dp||sp.pos);const dd=Math.hypot(p[0]-s[0],p[1]-spSize(sp)*cam.k*CSf(cam)*0.3-s[1]);if(dd<bd){bd=dd;best=sp;}}
 if(best&&bd<Math.max(14,spSize(best)*cam.k*CSf(cam)*0.9,fr)){G.sel=best;SFX.click();}else if(!inside)G.sel=null;}
const PTR=new Map();let GEST=null;
cv.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button>0)return;try{cv.setPointerCapture(e.pointerId);}catch(_){}PTR.set(e.pointerId,{x:e.clientX,y:e.clientY});
 if(PTR.size===1){GEST={type:'one',x0:e.clientX,y0:e.clientY,moved:false,touch:e.pointerType!=='mouse'};if(GEST.touch&&UI.place)hoverAt(e);}
 else if(PTR.size===2){const [a,b]=[...PTR.values()];GEST={type:'pinch',d0:Math.hypot(a.x-b.x,a.y-b.y)||1,z0:VIEW.z,m0:evToScr({clientX:(a.x+b.x)/2,clientY:(a.y+b.y)/2})};}
 e.preventDefault();});
cv.addEventListener('pointermove',e=>{const p=PTR.get(e.pointerId);if(!p){if(e.pointerType==='mouse')hoverAt(e);return;}const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;const r=cv.getBoundingClientRect();
 if(GEST&&GEST.type==='pinch'&&PTR.size>=2){const [a,b]=[...PTR.values()];const d=Math.hypot(a.x-b.x,a.y-b.y)||1;VIEW.z=clamp(GEST.z0*d/GEST.d0,1,4);const mx=((a.x+b.x)/2-r.left)/r.width,my=((a.y+b.y)/2-r.top)/r.height;VIEW.cx=GEST.m0[0]-(mx-0.5)*W/VIEW.z;VIEW.cy=GEST.m0[1]-(my-0.5)*H/VIEW.z;clampView();return;}
 if(GEST&&GEST.type==='one'){if(Math.hypot(e.clientX-GEST.x0,e.clientY-GEST.y0)>8)GEST.moved=true;
  if(UI.place){hoverAt(e);return;}
  if(GEST.moved&&VIEW.z>1.01){VIEW.cx-=dx/r.width*W/VIEW.z;VIEW.cy-=dy/r.height*H/VIEW.z;clampView();cv.style.cursor='grabbing';}
  if(e.pointerType==='mouse')hoverAt(e);}});
function endPtr(e,cancel){if(!PTR.has(e.pointerId))return;PTR.delete(e.pointerId);const g=GEST;cv.style.cursor='';
 if(g&&g.type==='one'&&!cancel){if(!g.moved||(g.touch&&UI.place))tapAt(evToScr(e));if(g.touch){G.mouse=null;G.mouseScr=null;}}
 if(PTR.size===0)GEST=null;else if(g&&g.type==='pinch')GEST={type:'none'};}
cv.addEventListener('pointerup',e=>endPtr(e,false));cv.addEventListener('pointercancel',e=>endPtr(e,true));
cv.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'&&!PTR.size){G.mouseScr=null;G.mouse=null;}});
cv.addEventListener('wheel',e=>{e.preventDefault();if(UI.place){const n=performance.now();if(n-(UI._wr||0)>250){UI._wr=n;UI.rot=UI.rot?0:1;}return;}zoomAt(Math.exp(-e.deltaY*0.0016),...evToScr(e));},{passive:false});
cv.addEventListener('contextmenu',e=>e.preventDefault());
$('zIn').onclick=()=>zoomAt(1.35);$('zOut').onclick=()=>zoomAt(1/1.35);$('zRst').onclick=()=>{VIEW.z=1;clampView();};
function showPB(pl){$('placeBar').style.display=pl?'flex':'none';$('pbRot').style.display=pl&&pl.kind==='decor'&&DECOR[pl.id].kind==='plat'?'':'none';}
$('pbRot').onclick=()=>{UI.rot=UI.rot?0:1;};$('pbDone').onclick=()=>cancelPlace();
window.addEventListener('orientationchange',()=>setTimeout(resize,300));if(window.visualViewport)visualViewport.addEventListener('resize',()=>setTimeout(resize,50));
window.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT')return;if(e.key==='1')setCam(1);if(e.key==='2')setCam(2);if(e.key==='3')setCam(3);if(e.key==='4')setCam(4);if(e.key==='+'||e.key==='=')zoomAt(1.25);if(e.key==='-'||e.key==='_')zoomAt(0.8);if(e.key==='0'){VIEW.z=1;clampView();}if(e.key==='r'||e.key==='R'){UI.rot=UI.rot?0:1;}
 if(e.key==='Escape'){cancelPlace();UI.remove=false;$('removeBtn').classList.remove('on');hint(null);['colModal','sndModal','helpModal'].forEach(closeModal);}if(e.key==='f'||e.key==='F'){if(G.sel)setCam(3);}});
// ----- save -----
function save(){try{const data={coins:G.coins,clock:G.clock,catches:G.catches,unlocked:G.unlocked,cur:G.cur,tanks:G.tanks.map(t=>({sub:t.sub,decor:t.decor.map(d=>[d.type,d.x,d.z,d.rot,d.seed]),spiders:t.spiders.map(s=>({sp:s.sp,name:s.name,stage:s.stage,meals:s.meals,sat:s.sat,tr:s.tr,catches:s.catches,seed:s.seed})),prey:t.prey.filter(p=>!p.owner).map(p=>p.type),husks:t.husks.length}))};localStorage.setItem('jumperTerrarium1',JSON.stringify(data));}catch(e){}}
function load(){try{const d=JSON.parse(localStorage.getItem('jumperTerrarium1')||'null');if(!d)return false;G.coins=d.coins;G.clock=d.clock;G.catches=d.catches||0;G.unlocked=d.unlocked;G.cur=d.cur||0;
 G.tanks=d.tanks.map((td,i)=>{const t=makeTank(i);t.sub=td.sub;for(const [ty,x,z,rot,seed] of td.decor)if(DECOR[ty])addDecor(t,ty,x,z,rot,seed);
  for(const sd of td.spiders){const s=newSpider(sd.sp,t);Object.assign(s,{name:sd.name,stage:sd.stage,meals:sd.meals,sat:sd.sat,tr:sd.tr,catches:sd.catches,seed:sd.seed});const g=groundAt(t,s.pos.x,s.pos.z);if(g.p){s.surf={t:'plat',id:g.p.id};s.pos.y=g.h;}t.spiders.push(s);}
  for(const ty of td.prey)if(PREY[ty]){const p=newPrey(ty,t);const g=groundAt(t,p.pos.x,p.pos.z);if(g.p){p.surf={t:'plat',id:g.p.id};p.pos.y=g.h;}t.prey.push(p);}return t;});return true;}catch(e){console.warn(e);return false;}}
function initNew(){G.tanks=[makeTank(0),makeTank(1),makeTank(2)];const t=G.tanks[0];G.cur=0;
 const L=[['moss',40,60],['litter',150,65],['dish',172,24],['bark',60,30],['tower',165,42],['drift',105,58],['fern',28,20],['pinkfl',125,25],['grass',192,76],['succ',82,80],['shroom',142,82],['stone',25,76]];for(const [ty,x,z] of L)addDecor(t,ty,x,z);
 const s=newSpider('audax',t);s.name='Bolt';t.spiders.push(s);for(let i=0;i<5;i++)t.prey.push(newPrey('fruitfly',t));t.prey.push(newPrey('housefly',t));t.prey.push(newPrey('cricket',t));
 for(const e of t.prey){const g=groundAt(t,e.pos.x,e.pos.z);if(g.p){e.surf={t:'plat',id:g.p.id};e.pos.y=g.h;}}G.sel=s;}
function ensureFloor(t){for(const e of [...t.spiders,...t.prey]){if(e.surf.t==='floor'){const g=groundAt(t,e.pos.x,e.pos.z);if(g.p){e.surf={t:'plat',id:g.p.id};e.pos.y=g.h;e.route=null;}}}}

// v18 placement helper: shared by UI and tests/debugging.
function releasePreyAt(t,type,x,z){const P_=PREY[type];if(!P_)return false;if(t.prey.length>=40)return false;if(G.coins<P_.price)return false;G.coins-=P_.price;for(let i=0;i<P_.pack;i++){const q=v3(clamp(x+rr(-5,5),3,TW-3),TH-6,clamp(z+rr(-4,4),3,TD-3));if(typeof clampTankXZ==='function')clampTankXZ(t,q,3);t.prey.push(newPrey(type,t,q));}SFX.buy();return true;}
