const PREY={
 fruitfly:{one:'fruit fly',name:'Fruit Flies',pack:5,price:5,size:2.6,food:5,value:3,walk:9,fly:45,sense:28,sens:.8,reflex:.5,flyer:true,wall:true,struggle:1.0},
 housefly:{one:'house fly',name:'House Fly',pack:1,price:4,size:6.5,food:14,value:8,walk:16,fly:95,sense:55,sens:1.3,reflex:.75,flyer:true,wall:true,struggle:1.8},
 bluebottle:{one:'bluebottle',name:'Bluebottle',pack:1,price:6,size:9,food:18,value:12,walk:14,fly:85,sense:50,sens:1.1,reflex:.65,flyer:true,wall:true,struggle:2.2},
 moth:{one:'moth',name:'Moth',pack:1,price:6,size:10,food:18,value:10,walk:5,fly:38,sense:36,sens:.8,reflex:.4,flyer:true,wall:true,night:true,struggle:2.8},
 cricket:{one:'cricket',name:'Crickets',pack:2,price:7,size:13,food:26,value:12,walk:18,hop:100,sense:45,sens:1.0,reflex:.5,danger:.5,strong:true,struggle:3.6},
 mealworm:{one:'mealworm',name:'Mealworms',pack:3,price:6,size:16,food:22,value:7,walk:3.5,sense:16,sens:.5,reflex:0,burrow:true,struggle:2.6},
 roach:{one:'dubia nymph',name:'Dubia Nymphs',pack:2,price:6,size:8,food:16,value:8,walk:11,sense:30,sens:.7,reflex:.25,hide:true,struggle:2.2},
 sjumper:{one:'tiny jumper',name:'Tiny Jumper',pack:1,price:12,size:4.5,food:14,value:15,walk:20,hop:120,sense:65,sens:1.2,reflex:.6,danger:.3,smart:true,wall:true,struggle:2.8},
 springtail:{one:'springtail',name:'Springtail Colony',pack:12,price:5,size:1.35,food:0,value:0,walk:10,sense:16,sens:.35,reflex:.8,cleanup:true,huntable:false,moisture:true,struggle:.2},
 isopod:{one:'dwarf isopod',name:'Dwarf Isopods',pack:4,price:8,size:6.8,food:7,value:3,walk:6.5,sense:23,sens:.5,reflex:.16,hide:true,cleanup:true,moisture:true,strong:true,struggle:1.6},
 waxworm:{one:'waxworm',name:'Waxworms',pack:2,price:8,size:14,food:24,value:8,walk:3.8,sense:15,sens:.4,reflex:.05,burrow:true,struggle:2.5},
 beetle:{one:'darkling beetle',name:'Darkling Beetles',pack:2,price:9,size:7.2,food:11,value:5,walk:9.5,sense:31,sens:.65,reflex:.28,hide:true,strong:true,struggle:2.3},
};
function newPrey(type,t,pos){const P_=PREY[type];const p={kind:'prey',id:UID++,type,pos:pos?vc(pos):randFloorPt(t),surf:S_FLOOR,face:vnorm(v3(rr(-1,1),0,rr(-1,1))),state:'idle',st:0,route:null,jump:null,alert:0,vel:v3(),anim:rand()*10,moved:0,spd:0,dead:false,feed:0,owner:null,buried:false,seed:(rand()*1e9)|0,fl:null,size:P_.size*rr(0.85,1.15)};
 if(pos&&pos.y>0){p.surf={t:'air'};p.vel=v3(0,-20,0);p.state=P_.flyer?'fly':'drop';if(P_.flyer)p.fl=flyTarget(t,p,null);}
 return p;}
// ---------- prey ----------
function nearestSpider(t,p){let b=null,bd=1e9;for(const s of t.spiders){const d=vdist(s.pos,p.pos);if(d<bd){bd=d;b=s;}}return [b,bd];}
function flyTarget(t,p,thr){const P_=PREY[p.type];let best=null,bs=-1e9;
 for(let i=0;i<6;i++){let c;const r=rand();const per=t.decor.filter(d=>d.perches.length);
  if(r<0.3&&per.length){const d=pick(per);const att=DECOR[d.type].attract?1:0;if(att||rand()<0.5){c={surf:{t:'perch',id:d.id},pt:vc(pick(d.perches))};}}
  if(!c)c=randSurfPoint(t,{plat:0.15,wall:0.55});
  let sc=rand()*10;if(thr)sc+=Math.min(80,vdist(c.pt,thr.pos))*0.5;if(c.surf.t==='perch'&&DECOR[platById(t,c.surf.id).type].attract)sc+=12;
  if(P_.night&&isNight())sc+=c.pt.y*0.2;if(sc>bs){bs=sc;best=c;}}
 return {surf:best.surf,pt:best.pt,t:0};}
function takeOff(t,p,thr){const P_=PREY[p.type];p.state='fly';p.st=0;p.surf={t:'air'};p.fl=flyTarget(t,p,thr);
 const away=thr?vnorm(vsub(p.pos,thr.pos)):v3(rr(-1,1),0,rr(-1,1));p.vel=vadd(vmul(away,P_.fly*0.8),v3(0,P_.fly*0.4,0));p.route=null;}
function preyFlee(t,p,thr,urgent){const P_=PREY[p.type];p.st=0;
 if(P_.flyer&&p.surf.t!=='air'){takeOff(t,p,thr);return;}
 if(P_.burrow&&t.sub!=='gravel'){p.state='burrow';p.buried=true;p.burT=rr(8,20);return;}
 const away=thr?vsub(p.pos,thr.pos):v3(rr(-1,1),0,rr(-1,1));away.y=0;const dir=vnorm(away);
 if(P_.hop&&(p.surf.t==='floor'||p.surf.t==='plat')){let tp=v3(clamp(p.pos.x+dir.x*rr(25,45),4,TW-4),0,clamp(p.pos.z+dir.z*rr(25,45),4,TD-4));const g=groundAt(t,tp.x,tp.z);tp.y=g.h;
  startJump(p,tp,g.p?{t:'plat',id:g.p.id}:S_FLOOR,6+rand()*10,P_.hop);p.state='hop';return;}
 if(P_.hop&&p.surf.t==='wall'){startJump(p,(()=>{const q=randFloorPt(t);return q;})(),S_FLOOR,8,P_.hop);p.state='hop';return;}
 let dest;if(P_.hide){const cov=t.decor.filter(d=>DECOR[d.type].cover);if(cov.length){const c=cov.reduce((a,b)=>vdist(v3(a.x,0,a.z),p.pos)<vdist(v3(b.x,0,b.z),p.pos)?a:b);dest={surf:S_FLOOR,pt:v3(c.x,0,c.z)};}}
 if(!dest){if(p.surf.t==='wall'){const q=wallClamp(p.surf.w,vadd(p.pos,vmul(vnorm(vsub(p.pos,thr?thr.pos:p.pos)),40)));dest={surf:p.surf,pt:q};}else dest={surf:S_FLOOR,pt:v3(clamp(p.pos.x+dir.x*50,4,TW-4),0,clamp(p.pos.z+dir.z*50,4,TD-4))};}
 p.route=route(t,p,dest.surf,dest.pt);p.state='flee';}
function preyDodge(t,p,s){const P_=PREY[p.type];if(p.buried||p.owner)return;const ch=P_.reflex*(0.3+p.alert*0.7)*(1-s.tr.stealth*0.3);if(rand()<ch){p.alert=1;preyFlee(t,p,s,true);p.dodged=true;}}
function updPrey(t,p,dt){const P_=PREY[p.type];p.anim+=dt;p.st+=dt;if(p.owner)return;const prev=vc(p.pos);
 const [thr,td]=nearestSpider(t,p);
 if(thr&&td<P_.sense&&!p.buried&&thr.state!=='sleep'){let f=thr.spd>4?1:0.15;if(thr.state==='crouch')f=0.3;if(inCover(t,thr.pos.x,thr.pos.z,thr.pos.y))f*=0.45;
  const d=vsub(thr.pos,p.pos);d.y=0;const a=Math.acos(clamp(vdot(p.face,vnorm(d)),-1,1));if(!P_.flyer&&a>1.9)f*=0.3;if(thr.pos.y-p.pos.y>8&&!P_.flyer)f*=0.5;f*=1-thr.tr.stealth*0.45;
  p.alert+=f*P_.sens*(1-td/P_.sense)*dt*2.4;}else p.alert-=dt*0.1;
 p.alert=clamp(p.alert,0,1);
 if(p.alert>0.78&&!['flee','fly','hop','burrow','drop'].includes(p.state)&&p.st>0.3)preyFlee(t,p,thr);
 if(P_.smart&&thr&&p.alert>0.35&&p.alert<=0.78&&['idle','walk'].includes(p.state)&&td<P_.sense){setSt(p,'standoff');}
 if(p.jump){if(stepJump(p,dt)){p.surf=p.jump.surfTo;p.pos=vc(p.jump.to);p.jump=null;if(p.route&&p.route.length&&p.route[0].hop)p.route.shift();clampSurf(t,p);if(p.state==='hop')setSt(p,'idle');}}
 else switch(p.state){
  case 'drop':{p.vel.y-=250*dt;p.pos=vadd(p.pos,vmul(p.vel,dt));const g=groundAt(t,p.pos.x,p.pos.z);if(p.pos.y<=g.h){p.pos.y=g.h;p.surf=g.p?{t:'plat',id:g.p.id}:S_FLOOR;setSt(p,'idle');}break;}
  case 'idle':{if(p.st>(p.idleT||(p.idleT=rr(0.8,4)))){p.idleT=0;
    if(P_.flyer&&rand()<(P_.night?(isNight()?0.5:0.06):0.25)){takeOff(t,p,null);break;}
    if(p.surf.t==='perch'){p.st=0;break;}
    if(P_.burrow&&rand()<0.25&&t.sub!=='gravel'){p.state='burrow';p.buried=true;p.burT=rr(6,22);p.st=0;break;}
    if(P_.hop&&rand()<0.25&&p.surf.t!=='wall'){const tp=randFloorPt(t);if(vdist(tp,p.pos)<60){startJump(p,tp,S_FLOOR,6+rand()*8,P_.hop*0.7);p.state='hop';break;}}
    let dest;if(p.surf.t==='wall'&&rand()<0.7){dest={surf:p.surf,pt:wallClamp(p.surf.w,vadd(p.pos,v3(rr(-25,25),rr(-25,25),rr(-25,25))))};}
    else if(P_.flyer||P_.wall)dest=randSurfPoint(t,{plat:.2,wall:P_.wall?.4:0});else dest=randSurfPoint(t,{plat:.25,wall:0});
    if(P_.hide&&!isNight()&&rand()<0.6){const cov=t.decor.filter(d=>DECOR[d.type].cover&&DECOR[d.type].kind!=='plant');if(cov.length){const c=pick(cov);dest={surf:S_FLOOR,pt:v3(c.x+rr(-5,5),0,c.z+rr(-4,4))};if(groundAt(t,dest.pt.x,dest.pt.z).h>0)dest.pt=randFloorPt(t);}}
    if(thr&&p.alert>0.2&&vdist(dest.pt,thr.pos)<40)dest=randSurfPoint(t,{plat:.2,wall:P_.wall?.4:0});
    p.route=route(t,p,dest.surf,dest.pt,P_.hop?40:0);if(p.route.length&&p.route[0].hop&&!P_.hop)p.route=route(t,p,dest.surf,dest.pt);setSt(p,'walk');}break;}
  case 'walk':case 'flee':{const sp=P_.walk*(p.state==='flee'?2.2:1)*(P_.night&&!isNight()?0.5:1);
    if(p.state==='walk'&&rand()<dt*0.5){p.pauseT=rr(0.3,1.5);}if(p.pauseT>0){p.pauseT-=dt;break;}
    if(followRoute(t,p,sp,dt)){setSt(p,'idle');}if(p.st>25)setSt(p,'idle');break;}
  case 'standoff':{if(!thr){setSt(p,'idle');break;}faceToward(p,thr.pos,6,dt);if(p.alert<0.25)setSt(p,'idle');
    else if(p.st>1.2&&rand()<dt*0.8){const away=vsub(p.pos,thr.pos);away.y=0;const dd=vnorm(away);const q=v3(clamp(p.pos.x+dd.x*12,3,TW-3),p.pos.y,clamp(p.pos.z+dd.z*12,3,TD-3));if(p.surf.t==='wall')q.y=p.pos.y;p.route=[{surf:p.surf,pt:p.surf.t==='wall'?wallClamp(p.surf.w,q):q}];p.st=0;}
    if(p.route&&p.route.length){const f=vc(p.face);followRoute(t,p,P_.walk*0.4,dt);p.face=f;}break;}
  case 'burrow':{if(p.st>p.burT&&p.alert<0.4){p.buried=false;setSt(p,'idle');}break;}
  case 'fly':{const fl=p.fl;fl.t+=dt;let tgt=fl.pt;if(P_.night&&isNight()&&fl.t<4){tgt=v3(TW/2+Math.sin(p.anim*2)*25,TH-10+Math.sin(p.anim*3)*5,TD/2+Math.cos(p.anim*1.7)*20);}
    const want=vnorm(vsub(tgt,p.pos));const sp=P_.fly*(P_.night?1:1);const wob=p.type==='moth'?1.4:0.6;
    const des=vadd(vmul(want,sp),v3(Math.sin(p.anim*7.3+p.seed)*sp*wob,Math.cos(p.anim*9.1)*sp*wob*0.6,Math.sin(p.anim*6.1+1)*sp*wob));
    p.vel=v3(lerp(p.vel.x,des.x,clamp(dt*3,0,1)),lerp(p.vel.y,des.y,clamp(dt*3,0,1)),lerp(p.vel.z,des.z,clamp(dt*3,0,1)));
    p.pos=vadd(p.pos,vmul(p.vel,dt));p.pos.x=clamp(p.pos.x,2,TW-2);p.pos.z=clamp(p.pos.z,2,TD-2);const g=groundAt(t,p.pos.x,p.pos.z);p.pos.y=clamp(p.pos.y,g.h+1,TH-2);
    if(vlen(p.vel)>1){const f=v3(p.vel.x,0,p.vel.z);if(vlen(f)>0.5)p.face=vnorm(f);}
    if(vdist(p.pos,fl.pt)<3&&fl.t>0.6){p.pos=vc(fl.pt);p.surf=fl.surf;clampSurf(t,p);p.vel=v3();setSt(p,'idle');p.alert*=0.6;}
    if(fl.t>7)p.fl=flyTarget(t,p,thr);break;}
 }
 p.spd=vdist(prev,p.pos)/Math.max(dt,1e-3);}
