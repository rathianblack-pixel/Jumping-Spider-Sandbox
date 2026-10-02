// ================= v20 tactical hunting =================
function ensureHuntMemory20(s){s.huntMemory=s.huntMemory||{misses:0,catches:0,lastFail:null,lastStrategy:null};return s.huntMemory;}
function predictedTarget20(p,lead){const v=p.vel&&vlen(p.vel)>1?p.vel:(p.spd>1?vmul(vnorm(v3(p.face?.x||1,0,p.face?.z||0)),p.spd):v3());return vadd(p.pos,vmul(v,lead));}
function strategyFor20(s,p){const b=speciesBehavior20(s),m=ensureHuntMemory20(s),moving=(p.spd||0)>4;
 if(s.sp==='portia')return m.misses%3===1?'high':'rear';if(b.direct>.78&&m.misses<2)return moving?'intercept':'direct';if(m.misses>=2)return m.misses%2?'high':'rear';if(b.rear>.68)return 'rear';if(b.height>.65)return 'high';return moving&&s.tr.tactic>.55?'intercept':'direct';}
planAmbush=function(t,s,p){const R=jumpRange(s),sz=spSize(s),P_=targetProfile(p),b=speciesBehavior20(s),mem=ensureHuntMemory20(s),strategy=strategyFor20(s,p),speed=Math.max(0,p.spd||0),lead=clamp(speed/90,.12,.7),pp=predictedTarget20(p,lead),cands=[];
 const pf=vnorm(v3(p.face?.x||1,0,p.face?.z||0));
 for(let i=0;i<20;i++){let a=i/20*Math.PI*2+((s.seed||0)%31)*.017,d=R*rr(.38,.82);if(strategy==='rear'){const rear=Math.atan2(-pf.z,-pf.x);a=rear+rr(-.62,.62);}const q=v3(pp.x+Math.cos(a)*d,0,pp.z+Math.sin(a)*d);if(q.x<3||q.x>TW-3||q.z<3||q.z>TD-3)continue;const g=groundAt(t,q.x,q.z);q.y=g.h;cands.push({surf:g.p?{t:'plat',id:g.p.id}:S_FLOOR,pt:q,src:'floor'});}
 for(const d of plats(t)){const q=v3(clamp(pp.x,d.x0+1,d.x1-1),d.h,clamp(pp.z,d.z0+1,d.z1-1));cands.push({surf:{t:'plat',id:d.id},pt:q,src:'high'});}
 if(strategy==='high'||b.height>.58)for(const w of ['z0','x0','xW','zD'])for(const dy of [10,22,36])cands.push({surf:{t:'wall',w},pt:wallClamp(w,v3(pp.x+rr(-10,10),Math.min(TH-6,pp.y+dy),pp.z+rr(-10,10))),src:'wall'});
 // Repeated prey routes become useful waiting/interception points.
 if(p._trail20&&p._trail20.length>2&&s.tr.patience>.65){const q=vc(p._trail20[Math.floor(p._trail20.length*.45)]);const g=groundAt(t,q.x,q.z);q.y=g.h;cands.push({surf:g.p?{t:'plat',id:g.p.id}:S_FLOOR,pt:q,src:'wait'});}
 let best=null,bs=-1e9;
 for(const c of cands){const d=vdist(c.pt,p.pos);if(d>R*.96||d<sz*1.12)continue;if(!LOS(t,v3(c.pt.x,c.pt.y+sz*.28,c.pt.z),p.pos))continue;const segs=route(t,s,c.surf,c.pt),L=routeLen(s,segs);if(!segs.length&&vdist(s.pos,c.pt)>2)continue;const toHunter=vnorm(vsub(c.pt,p.pos)),rear=-vdot(pf,vnorm(v3(toHunter.x,0,toHunter.z)));let sc=-L*.105*(1.22-s.tr.patience*.28)-Math.abs(d-R*.58)*.17;
  sc+=rear*(7+11*b.rear);const elev=c.pt.y-p.pos.y;if(elev>2)sc+=Math.min(elev,34)*(.22+.42*b.height);if(c.src==='wait')sc+=s.tr.patience*7;if(c.src==='high'&&strategy==='high')sc+=7;if(strategy==='intercept')sc-=vdist(c.pt,pp)*.12;if(strategy==='direct')sc-=L*.06*b.direct;if(inCover(t,c.pt.x,c.pt.z,c.pt.y))sc+=4*s.tr.stealth;
  if(mem.lastFail){const fd=vdist(c.pt,mem.lastFail);if(fd<16)sc-=8;}
  sc+=rand()*1.5;if(sc>bs){bs=sc;best={surf:c.surf,pt:c.pt,segs,L,strategy,pred:vc(pp),score:sc};}}
 s._plan20=best;return best;};
const _startHunt20=startHunt;
startHunt=function(t,s,p){const r=_startHunt20(t,s,p),a=s._plan20,m=ensureHuntMemory20(s);if(s.hunt&&a){s.hunt.strategy=a.strategy;s.hunt.pred=a.pred;m.lastStrategy=a.strategy;const nm=targetName(p);if(a.strategy==='rear')s.mood=`Circling behind ${nm}`;else if(a.strategy==='high')s.mood=`Looking for a higher ambush on ${nm}`;else if(a.strategy==='intercept')s.mood=`Reading where ${nm} is heading`;else if(a.strategy==='direct')s.mood=`Closing directly on ${nm}`;if(a.src==='wait')s.mood=`Waiting where ${nm} keeps passing`; }return r;};
const _updSpiderHunt20=updSpider;
updSpider=function(t,s,dt){const before=s.state,target=s.hunt&&s.hunt.prey,failPos=target?vc(target.pos):null;const r=_updSpiderHunt20(t,s,dt);const m=ensureHuntMemory20(s);
 if(before==='pounce'&&['missed','dangle','fall'].includes(s.state)){m.misses++;m.lastFail=failPos;m.lastFailAt=G.clock;}
 if(before!=='subdue'&&s.state==='subdue'){m.catches++;m.misses=Math.max(0,m.misses-1);m.lastFail=null;}
 return r;};
window.__JT20_HUNT={strategyFor20,ensureHuntMemory20,predictedTarget20};
// ================= end v20 tactical hunting =================
