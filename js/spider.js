function newSpider(spid,t){const S=SPEC[spid];const j=()=>rr(-0.08,0.08);
 const s={kind:'spider',id:UID++,sp:spid,name:(()=>{const used=new Set(G.tanks.flatMap(x=>x.spiders.map(o=>o.name)));const f=NAMES.filter(n=>!used.has(n));return pick(f.length?f:NAMES);})(),stage:spid==='regius'?2:(S.size<8?4:3),meals:0,sat:65,thirst:0.2,
  tr:{stealth:clamp(S.st.stealth+j(),0.1,1),patience:clamp(S.st.patience+j(),0.1,1),jump:clamp(S.st.jump+j(),0.1,1),bold:clamp(S.st.bold+j(),0.1,1),tactic:S.st.tactic||clamp(0.45+S.st.patience*0.4+j(),0,1)},
  pos:randFloorPt(t),surf:S_FLOOR,face:vnorm(v3(rr(-1,1),0,rr(-1,1))),state:'wander',st:0,route:null,jump:null,hunt:null,anim:rand()*10,moved:0,spd:0,catches:0,seed:(rand()*1e9)|0,retreat:null,ignore:{},mood:'Exploring its new home',pauseT:0,scanT:0,lookA:0};
 return s;}
// ---------- spider ----------
function scanPrey(t,s){let best=null,bs=-1;const sz=spSize(s);const sight=90+sz*3.5;const eye=eyePos(s);
 for(const p of t.prey){if(p.dead||p.owner||p.buried||PREY[p.type]?.huntable===false)continue;if((s.ignore[p.id]||0)>G.clock)continue;const d=vdist(eye,p.pos);if(d>sight)continue;if(!LOS(t,eye,p.pos))continue;
  const ang=angleTo(s,p.pos);const moving=p.spd>2;let pr=moving?1.6:0.5;if(ang>1.1)pr*=moving?0.55:0.08;if(ang>2.3)pr*=moving?0.35:0;
  if(inCover(t,p.pos.x,p.pos.z,p.pos.y)&&!moving)pr*=0.3;if(p.surf.t==='air')pr*=0.35;pr*=(1-d/sight)*1.4+0.25;
  if(rand()<pr*0.3){const sc=PREY[p.type].food/(d+15);if(sc>bs){bs=sc;best=p;}}}
 return best;}
function planAmbush(t,s,p){const R=jumpRange(s),sz=spSize(s);const cands=[];const pp=p.pos;
 for(let i=0;i<14;i++){const a=i/14*Math.PI*2+rand()*0.3,d=R*rr(0.4,0.8);const q=v3(pp.x+Math.cos(a)*d,0,pp.z+Math.sin(a)*d);if(q.x<3||q.x>TW-3||q.z<3||q.z>TD-3)continue;const g=groundAt(t,q.x,q.z);if(g.p){q.y=g.h;cands.push({surf:{t:'plat',id:g.p.id},pt:q});}else cands.push({surf:S_FLOOR,pt:q});}
 for(const d of plats(t)){const q=v3(clamp(pp.x,d.x0+1,d.x1-1),d.h,clamp(pp.z,d.z0+1,d.z1-1));cands.push({surf:{t:'plat',id:d.id},pt:q});
  for(let i=0;i<3;i++)cands.push({surf:{t:'plat',id:d.id},pt:v3(rr(d.x0+1,d.x1-1),d.h,rr(d.z0+1,d.z1-1))});}
 for(const w of ['z0','x0','xW','zD']){for(const dy of [6,14,26]){const q=wallClamp(w,v3(pp.x+rr(-12,12),pp.y+dy,pp.z+rr(-12,12)));cands.push({surf:{t:'wall',w},pt:q});}}
 const pf=p.face;let best=null,bs=-1e9;
 for(const c of cands){const d=vdist(c.pt,pp);if(d>R*0.92||d<sz*1.3)continue;if(!LOS(t,v3(c.pt.x,c.pt.y+sz*.3,c.pt.z),pp))continue;
  const segs=route(t,s,c.surf,c.pt);const L=routeLen(s,segs);let sc=-L*0.12*(1.25-s.tr.patience);
  const elev=c.pt.y-pp.y;if(elev>3)sc+=Math.min(elev,30)*0.55*(0.4+s.tr.tactic);
  const dir=vnorm(vsub(c.pt,pp));sc+=-vdot(pf,dir)*12*(0.3+s.tr.stealth)*(PREY[p.type].flyer?0.3:1);
  if(inCover(t,c.pt.x,c.pt.z,c.pt.y))sc+=7*s.tr.stealth;
  for(let i=1;i<segs.length;i++){const q=segs[i].pt;if(vdist(q,pp)<PREY[p.type].sense*0.55){sc-=6*(0.5+s.tr.tactic);}}
  sc-=Math.abs(d-R*0.6)*0.2;sc+=rand()*3;if(sc>bs){bs=sc;best={surf:c.surf,pt:c.pt,segs,L};}}
 return best;}
function giveUp(s,msg){if(s.hunt&&s.hunt.prey)s.ignore[s.hunt.prey.id]=G.clock+12;s.hunt=null;s.route=null;setSt(s,'look',msg||'Lost interest');}
function startHunt(t,s,p){const a=planAmbush(t,s,p);const same=s.hunt&&s.hunt.prey===p;const keep={replans:same?(s.hunt.replans||0):0,t0:same&&s.hunt.t0?s.hunt.t0:G.clock};if(!a){s.hunt={prey:p,amb:null,plan:vc(p.pos),lost:0,burst:0,creep:true,cool:2,...keep};s.route=route(t,s,p.surf.t==='perch'||p.surf.t==='air'?S_FLOOR:p.surf,p.surf.t==='perch'?v3(p.pos.x,0,p.pos.z):p.pos);}
 else{s.hunt={prey:p,amb:a,plan:vc(p.pos),lost:0,burst:0,creep:true,cool:2.5,...keep};s.route=a.segs;}
 const nm=PREY[p.type].one;const detour=a&&a.L>vdist(s.pos,p.pos)*1.4;const high=a&&a.pt.y>p.pos.y+4;
 setSt(s,'stalk',detour?`Taking the long way around to the ${nm}`:high?`Climbing for a high angle on the ${nm}`:`Stalking the ${nm}`);}
function preyWatching(p,s){if(p.type==='mealworm')return false;const d=vsub(s.pos,p.pos);d.y=0;if(vlen(d)<0.01)return true;const pf=v3(p.face.x,0,p.face.z);if(vlen(pf)<0.01)return false;return Math.acos(clamp(vdot(vnorm(pf),vnorm(d)),-1,1))<=25*Math.PI/180;}
function holdPrey(s){const p=s.hunt&&s.hunt.prey;if(!p||p.owner!==s)return;const sz=spSize(s);let f=s.face;p.pos=vadd(s.pos,vmul(f,sz*0.55));if(s.surf.t==='wall'){p.pos=vadd(p.pos,vmul(wallNormal(s.surf.w),0.5));}else p.pos.y=s.pos.y+sz*0.15;p.surf=s.surf;p.face=vmul(f,-1);}
function catchPrey(t,s,p){p.owner=s;p.state='caught';p.jump=null;p.route=null;s.jump=null;s.drag=null;const nm=PREY[p.type].one;
 addFx(t,'bite',p.pos);addFx(t,'text',vadd(p.pos,v3(0,8,0)),'GOT IT!');SFX.catch();s.hunt.subT=PREY[p.type].struggle;
 const okSurf=p.surf.t==='floor'||p.surf.t==='plat'||p.surf.t==='wall';
 if(okSurf){s.surf=p.surf;s.pos=vsub(p.pos,vmul(s.face,spSize(s)*0.5));clampSurf(t,s);setSt(s,'subdue',`Got the ${nm}! Holding on tight...`);}
 else{s.surf={t:'air'};s.vel=v3(0,0,0);s.after='subdue';setSt(s,'fall',`Snatched the ${nm} mid-air!`);}}
function safeSpot(t,s){let best=null,bd=1e9;for(const d of plats(t)){const q=v3(clamp(s.pos.x,d.x0+2,d.x1-2),d.h,clamp(s.pos.z,d.z0+2,d.z1-2));const dd=vdist(q,s.pos);if(dd<bd){bd=dd;best={surf:{t:'plat',id:d.id},pt:q};}}
 for(const w of ['z0','x0','xW','zD']){const q=wallClamp(w,v3(s.pos.x,24,s.pos.z));const dd=vdist(q,s.pos)+10;if(dd<bd){bd=dd;best={surf:{t:'wall',w},pt:q};}}return best;}
function pickRetreat(t,s){const opts=[];for(const w of ['z0','x0','xW']){for(const c of [12,TW-12,TD-12]){const q=wallClamp(w,v3(c,TH-14-rand()*10,c));opts.push({surf:{t:'wall',w},pt:q});}}
 const used=t.spiders.filter(o=>o!==s&&o.retreat).map(o=>o.retreat.pt);let best=null,bs=-1;for(const o of opts){let m=1e9;for(const u of used)m=Math.min(m,vdist(u,o.pt));const sc=Math.min(m,200)+rand()*20;if(sc>bs){bs=sc;best=o;}}s.retreat=best;s.retreat.silk=0;}
function updSpider(t,s,dt){const sz=spSize(s);s.anim+=dt;s.st+=dt;const prev=vc(s.pos);s.moved=0;s._stalkFrozen=false;
 if(s.state!=='sleep'&&s.state!=='molt')s.sat=Math.max(0,s.sat-dt*0.2);s.thirst=Math.min(1,s.thirst+dt/420);
 const walk=16+sz*0.9,night=isNight();const idle=['wander','look','rest','watch'].includes(s.state);
 if(idle&&night){if(!s.retreat)pickRetreat(t,s);s.route=route(t,s,s.retreat.surf,s.retreat.pt);setSt(s,'toRetreat','Heading to its silk retreat for the night');}
 if(idle&&!night&&s.meals>=3+s.stage&&s.stage<6&&s.sat>55){if(!s.retreat)pickRetreat(t,s);s.route=route(t,s,s.retreat.surf,s.retreat.pt);setSt(s,'toMolt','Feeling tight... preparing to molt');}
 if(idle&&!night&&t.drops.length&&s.thirst>0.45&&s.state!=='watch'){let b=null,bd=1e9;for(const d of t.drops){if(d.surf.t==='perch')continue;const dd=vdist(d.pos,s.pos);if(dd<bd){bd=dd;b=d;}}if(b){s.route=route(t,s,b.surf,b.pos);s.dropT=b;setSt(s,'toDrink','Thirsty - heading for a water droplet');}}
 if(idle&&!night&&s.sat<82&&s.state!=='watch'){s.scanT-=dt;if(s.scanT<=0){s.scanT=0.25;const p=scanPrey(t,s);if(p){s.hunt={prey:p};s.route=null;setSt(s,'notice',`Spotted a ${PREY[p.type].one}!`);}}}
 if(idle&&G.cur===t.id&&G.mouseScr&&s.state!=='watch'&&!s.jump&&s.surf.t!=='climb'){const sp=Pv(s.pos);if(Math.hypot(sp[0]-G.mouseScr[0],sp[1]-G.mouseScr[1])<45*(cam.k/RS/2)*RS+20*RS){s.route=null;setSt(s,'watch','Watching you curiously 👀');}}
 if(s.jump&&s.state!=='pounce'){if(stepJump(s,dt)){s.surf=s.jump.surfTo;s.pos=vc(s.jump.to);s.jump=null;if(s.route&&s.route.length)s.route.shift();clampSurf(t,s);addFx(t,'dust',s.pos);}}
 else switch(s.state){
  case 'wander':{if(!s.route){let d,tries=0;do{d=randSurfPoint(t,{plat:.4,wall:.35});tries++;}while(tries<6&&t.spiders.some(o=>o!==s&&vdist(o.pos,d.pt)<35));s.route=route(t,s,d.surf,d.pt,jumpRange(s)*0.55);}
    if(s.pauseT>0){s.pauseT-=dt;break;}if(rand()<dt*0.35)s.pauseT=rr(0.3,1.6);
    if(followRoute(t,s,walk,dt)){s.route=null;s.lookA=Math.atan2(s.face.z,s.face.x);setSt(s,rand()<0.2?'groom':'look',rand()<0.5?'Looking around':'Surveying the tank');}if(s.st>30){s.route=null;setSt(s,'look');}break;}
  case 'look':{if(s.surf.t!=='wall'&&s.surf.t!=='climb'){const a=s.lookA+Math.sin(s.st*1.3)*0.9*(Math.sin(s.st*0.37)>0?1:-1);s.face=v3(Math.cos(a),0,Math.sin(a));}
    if(s.st>(s.lookT||(s.lookT=rr(2,5)))){s.lookT=0;setSt(s,'wander','Exploring');}break;}
  case 'watch':{const vd=viewDir();let tgt=vadd(s.pos,vmul(vd,30));if(G.mouse)tgt=vadd(tgt,vmul(vsub(G.mouse,s.pos),0.4));if(s.surf.t!=='wall')faceToward(s,tgt,5,dt);
    const sp=Pv(s.pos);const near=G.mouseScr&&G.cur===t.id&&Math.hypot(sp[0]-G.mouseScr[0],sp[1]-G.mouseScr[1])<55*(cam.k/RS/2)*RS+30*RS;if(near)s.st=Math.min(s.st,0.1);if(s.st>1.5)setSt(s,'look','Back to exploring');
    if(near&&G.mouse&&s.surf.t==='floor'&&vdist(G.mouse,s.pos)>sz*3&&rand()<dt*0.6){s.route=[{surf:S_FLOOR,pt:vadd(s.pos,vmul(vnorm(vsub(v3(G.mouse.x,0,G.mouse.z),s.pos)),6))}];}
    if(s.route&&s.route.length){const f=vc(s.face);followRoute(t,s,walk*0.6,dt);s.face=f;}break;}
  case 'groom':if(s.st>2.5)setSt(s,'look','Cleaning its eyes and palps');break;
  case 'rest':if(s.st>(s.restT||(s.restT=rr(3,8)))){s.restT=0;setSt(s,'look','Rested and alert');}break;
  case 'notice':{const p=s.hunt.prey;if(!p||p.dead||p.owner||!t.prey.includes(p)){giveUp(s);break;}faceToward(s,p.pos,6,dt);
    if(s.st>0.5+s.tr.patience*0.9){const P_=PREY[p.type];const nm=P_.one;
     if(p.size>sz*(1.15+s.tr.bold*0.9)||(P_.danger&&rand()>s.tr.bold*0.9+0.15)){s.ignore[p.id]=G.clock+25;s.hunt=null;setSt(s,'look',`Sized up the ${nm}... too risky`);}
     else startHunt(t,s,p);}break;}
  case 'stalk':{const h=s.hunt,p=h.prey;if(!p||p.dead||p.owner||!t.prey.includes(p)){giveUp(s,'Prey got away');break;}
    const R=jumpRange(s);h.cool-=dt;if(G.clock-h.t0>40+s.tr.patience*35){giveUp(s,'Too slippery - taking a break');s.ignore[p.id]=G.clock+30;break;}const eye=eyePos(s);const d=vdist(s.pos,p.pos);const vis=!p.buried&&LOS(t,eye,p.pos)&&d<160;
    const nm=PREY[p.type].one;
    if(vis)h.lost=0;else{h.lost+=dt;if(h.lost>9){giveUp(s,`Lost track of the ${nm}`);break;}}
    const watched=vis&&preyWatching(p,s);
    if(watched){s._stalkFrozen=true;s.mood=`Frozen – the ${nm} is looking right at it`;break;}
    if(p.surf.t==='air'){faceToward(s,p.pos,4,dt);h.air=(h.air||0)+dt;s.mood=`Tracking the flying ${nm}...`;if(h.air>6){giveUp(s,`The ${nm} flew off`);}break;}h.air=0;
    if(h.cool<=0&&vdist(p.pos,h.plan)>22){h.replans++;if(h.replans>5){giveUp(s,'Too slippery, giving up');break;}startHunt(t,s,p);s.mood='Prey moved - recalculating route';break;}
    h.burst-=dt;if(h.burst<=0){h.creep=!h.creep;h.burst=h.creep?rr(0.4,1.2):rr(0.15,0.7)*(0.5+s.tr.patience);}
    const crouchOK=vis&&d<R&&!s.jump&&s.surf.t!=='climb'&&p.surf.t!=='air';
    const done=!s.route||!s.route.length;
    if(crouchOK&&(done||d<R*0.62)){s.route=null;setSt(s,'crouch',`Lining up the jump... calculating`);break;}
    if(h.creep&&!done){const P_=PREY[p.type],rel=clamp(p.spd/Math.max(1,P_.walk||8),0,2),motion=1-Math.exp(-rel*1.15);let stalk=lerp(3.0+sz*0.12,walk*0.72,motion);stalk*=1.12-s.tr.stealth*0.24;stalk=Math.min(walk*0.82,Math.max(2.2,stalk));followRoute(t,s,stalk,dt,vis);if(vis&&s.surf.t!=='wall'&&s.surf.t!=='climb')faceToward(s,p.pos,5,dt);}
    else if(vis&&s.surf.t!=='climb')faceToward(s,p.pos,4,dt);
    if(done&&!crouchOK&&s.st>1){h.replans++;if(h.replans>5){giveUp(s,'Could not find an angle');break;}startHunt(t,s,p);}
    break;}
  case 'crouch':{const p=s.hunt&&s.hunt.prey;if(!p||p.dead||p.owner||!t.prey.includes(p)){giveUp(s);break;}faceToward(s,p.pos,8,dt);const d=vdist(s.pos,p.pos);
    if(d>jumpRange(s)*1.05||p.surf.t==='air'||p.buried){s.hunt.cool=0;startHunt(t,s,p);break;}
    if(s.st>0.45+s.tr.patience*1.1){setSt(s,'pounce','POUNCE!');}break;}
  case 'pounce':{const p=s.hunt&&s.hunt.prey;
    if(!s.jump){if(!p){giveUp(s);break;}const d=vdist(s.pos,p.pos);const spd=95+s.tr.jump*80;const T=d/spd;const lead=0.3+s.tr.tactic*0.6;
     let tg=vadd(p.pos,vmul(p.vel||v3(),T*lead*(p.spd>1?1:0)));let surfTo=p.surf;
     if(p.surf.t==='wall')tg=wallClamp(p.surf.w,tg);else if(p.surf.t==='floor'||p.surf.t==='plat'){const g=groundAt(t,tg.x,tg.z);tg.y=g.h;surfTo=g.p?{t:'plat',id:g.p.id}:S_FLOOR;tg.x=clamp(tg.x,2,TW-2);tg.z=clamp(tg.z,2,TD-2);}else surfTo=null;
     const from=s.surf;startJump(s,tg,surfTo,3+d*0.2,spd);s.jump.fromSurf=from;s.drag={a:vc(s.pos)};addFx(t,'text',vadd(s.pos,v3(0,10,0)),'POUNCE!');SFX.pounce();preyDodge(t,p,s);break;}
    const end=stepJump(s,dt);
    if(p&&!p.owner&&!p.dead&&t.prey.includes(p)&&vdist(s.pos,p.pos)<sz*0.45+p.size*0.5+1.5){s.drag.b=null;catchPrey(t,s,p);break;}
    if(end){const j=s.jump;s.jump=null;if(p)s.ignore[p.id]=G.clock+2;
     if(j.surfTo){s.surf=j.surfTo;s.pos=vc(j.to);clampSurf(t,s);s.drag=null;addFx(t,'dust',s.pos);s.hunt=null;setSt(s,'missed','Missed! Regrouping...');}
     else if(j.anchor.y>12){s.dg={a:j.anchor,surf:j.fromSurf,len:Math.min(vdist(j.anchor,s.pos),j.anchor.y-groundAt(t,s.pos.x,s.pos.z).h-3)};s.hunt=null;setSt(s,'dangle','Missed - dangling on its safety line!');}
     else{s.vel=v3();s.after='missed';s.hunt=null;s.drag=null;setSt(s,'fall','Missed!');}}
    break;}
  case 'dangle':{const g=s.dg;const sw=Math.sin(s.st*3)*Math.max(0,4-s.st*1.5);if(s.st>1.6)g.len=Math.max(0,g.len-dt*14);
    s.pos=v3(g.a.x+sw,g.a.y-Math.max(0,g.len),g.a.z);s.face=v3(0,1,0);s.surf={t:'silk'};s.drag={a:g.a};
    if(s.st>1.6&&g.len<=0.5){s.surf=g.surf;s.pos=vc(g.a);clampSurf(t,s);s.drag=null;s.face=v3(1,0,0);setSt(s,'missed','Climbed back up its dragline');}break;}
  case 'fall':{s.vel.y-=260*dt;s.pos=vadd(s.pos,vmul(s.vel,dt));const g=groundAt(t,s.pos.x,s.pos.z);if(s.pos.y<=g.h){s.pos.y=g.h;s.surf=g.p?{t:'plat',id:g.p.id}:S_FLOOR;clampSurf(t,s);s.drag=null;addFx(t,'dust',s.pos);s.face=vnorm(v3(s.face.x||1,0,s.face.z));setSt(s,s.after||'missed',s.after==='subdue'?s.mood:'Landed');}
    break;}
  case 'missed':if(s.st>1.3)setSt(s,'look','Watching carefully');break;
  case 'subdue':{const h=s.hunt,p=h.prey;const P_=PREY[p.type];h.subT-=dt;
    if(P_.strong&&sz<p.size*0.95&&rand()<dt*0.07){p.owner=null;p.state='idle';p.alert=1;preyFlee(t,p,s);s.hunt=null;setSt(s,'missed',`The ${P_.one} kicked free!`);break;}
    if(h.subT<=0){p.dead=true;G.catches++;s.catches++;G.coins+=P_.value;addFx(t,'text',vadd(s.pos,v3(0,12,0)),'+'+P_.value);toast(`${s.name} caught a ${P_.one}! +${P_.value} 🪙`);SFX.coin();checkUnlocks();
     if(s.surf.t==='floor'){const sp=safeSpot(t,s);if(sp&&vdist(sp.pt,s.pos)<70){s.route=route(t,s,sp.surf,sp.pt);setSt(s,'carry','Carrying its meal somewhere safe');break;}}
     setSt(s,'feed','Feeding...');h.feedT=0;}
    break;}
  case 'carry':if(followRoute(t,s,walk*0.55,dt)){setSt(s,'feed','Feeding...');s.hunt.feedT=0;}break;
  case 'feed':{const h=s.hunt,p=h.prey;const P_=PREY[p.type];const dur=8+p.size*1.1;h.feedT+=dt;p.feed=Math.min(1,h.feedT/dur);s.sat=Math.min(100,s.sat+P_.food*dt/dur*clamp(14/sz,0.7,2));
    if(h.feedT>=dur){t.prey.splice(t.prey.indexOf(p),1);const g=groundAt(t,p.pos.x,p.pos.z);t.husks.push({type:p.type,pos:v3(clamp(p.pos.x,2,TW-2),g.h,clamp(p.pos.z,2,TD-2)),size:p.size,seed:p.seed,face:p.face});s.meals++;s.hunt=null;setSt(s,'groom','Finished eating - cleaning up');}break;}
  case 'toRetreat':case 'toMolt':case 'toDrink':{if(followRoute(t,s,walk,dt)){s.route=null;if(s.state==='toRetreat')setSt(s,'sleep','Sleeping in its silk retreat 💤');else if(s.state==='toMolt')setSt(s,'molt','Molting... please do not disturb');else setSt(s,'drink','Sipping a water droplet');}
    if(s.state==='toRetreat'&&!night)setSt(s,'wander','Good morning!');break;}
  case 'sleep':s.retreat.silk=Math.min(1,s.retreat.silk+dt*0.02);if(!night&&s.st>(s.wakeD||(s.wakeD=rr(2,25)))){s.wakeD=0;setSt(s,'wander','Woke up - good morning!');}break;
  case 'molt':s.retreat.silk=Math.min(1,s.retreat.silk+dt*0.05);if(s.st>14){t.husks.push({type:'exuvia',sp:s.sp,pos:vc(s.pos),size:spSize(s),surf:s.surf,face:vc(s.face),seed:s.seed});s.stage++;s.meals=0;toast(`✨ ${s.name} molted! Now stage ${s.stage}/6`);SFX.molt();setSt(s,'rest','Fresh from molting - resting');}break;
  case 'drink':if(s.st>3){s.thirst=0;if(s.dropT){s.dropT.v-=0.6;}setSt(s,'look','Refreshed');}break;
  default:setSt(s,'wander');
 }
 holdPrey(s);s.spd=vdist(prev,s.pos)/Math.max(dt,1e-3);}
function addFx(t,type,pos,text){t.fx.push({type,pos:vc(pos),text,t:0});}
function updTank(t,dt){for(const s of t.spiders)updSpider(t,s,dt);for(const p of t.prey.slice())updPrey(t,p,dt);
 for(const f of t.fx)f.t+=dt;t.fx=t.fx.filter(f=>f.t<1.6);for(const d of t.drops)d.v-=dt/120;t.drops=t.drops.filter(d=>d.v>0);
 if(t.spiders.length){t.coinT+=dt;if(t.coinT>20){t.coinT=0;G.coins+=t.spiders.length;}}}
