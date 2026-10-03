// ================= v20 prey ecology =================
Object.assign(PREYCOL,{
 springtail:{b:'#e8e4d7',a:'#9c978b',e:'#2d261f'},isopod:{b:'#77766f',a:'#44443f',e:'#171714'},waxworm:{b:'#e5c98b',a:'#ae8a50',e:'#5a4529'},beetle:{b:'#28231f',a:'#0f0d0c',e:'#6e3424'}
});
function ensurePreyEco20(p){if(!p)return;p.eco20=p.eco20||{seek:rr(.4,1.4),trailT:0};p._trail20=p._trail20||[];}
const _newPreyEco20=newPrey;
newPrey=function(type,t,pos){const p=_newPreyEco20(type,t,pos);ensurePreyEco20(p);return p;};
for(const t of G.tanks||[])for(const p of t.prey||[])ensurePreyEco20(p);
function nearestMoistDecor20(t,p){let best=null,bd=1e9;for(const d of t.decor){const D=DECOR[d.type];if(!(D?.cover||D?.kind==='plant'||d.type==='moss'||d.type==='lichen'))continue;const dd=hdist(p.pos,v3(d.x,0,d.z));if(dd<bd){bd=dd;best=d;}}return best;}
const _updPreyEco20=updPrey;
updPrey=function(t,p,dt){ensurePreyEco20(p);p.eco20.trailT-=dt;if(p.eco20.trailT<=0){p.eco20.trailT=.65+rand()*.45;p._trail20.push(vc(p.pos));if(p._trail20.length>8)p._trail20.shift();}
 p.eco20.seek-=dt;if(p.eco20.seek<=0&&!p.owner){p.eco20.seek=rr(1.2,3.5);const P_=PREY[p.type];
  if((p.type==='springtail'||p.type==='isopod')&&['idle','walk'].includes(p.state)){const d=nearestMoistDecor20(t,p);if(d&&((t.humidity||.35)<.55||hdist(p.pos,v3(d.x,0,d.z))>22)){const q=v3(d.x+rr(-Dsafe20(d).w*.18,Dsafe20(d).w*.18),0,d.z+rr(-Dsafe20(d).d*.18,Dsafe20(d).d*.18));clampTankXZ(t,q,2);p.route=route(t,p,S_FLOOR,q);setSt(p,'walk');}}
  if(p.type==='waxworm'&&p.surf.t==='floor'&&t.sub!=='gravel'&&rand()<.48){p.state='burrow';p.buried=true;p.burT=rr(5,13);p.st=0;}
  if(p.type==='beetle'&&isNight()&&p.pauseT>0)p.pauseT*=.35;
 }
 return _updPreyEco20(t,p,dt);};
function Dsafe20(d){return DECOR[d.type]||{w:12,d:12};}
const _drawPreyEco20=drawPrey;
drawPrey=function(p,X,Y,u,view,flip,ang,o={}){if(!['springtail','isopod','waxworm','beetle'].includes(p.type))return _drawPreyEco20(p,X,Y,u,view,flip,ang,o);const C=PREYCOL[p.type],B_=col(C.b),A_=col(C.a),E_=col(C.e),s=Math.max(.8,p.size*u*(o.shrink||1)),a=view==='top'?ang:(flip?Math.PI:0),ca=Math.cos(a),sa=Math.sin(a),T=(f,l)=>[X+(ca*f-sa*l)*s,Y+(sa*f+ca*l)*s];
 if(p.type==='springtail'){const b=T(0,0);pline(b[0]-ca*s*.42,b[1]-sa*s*.42,b[0]+ca*s*.38,b[1]+sa*s*.38,Math.max(1,s*.13),B_);const h=T(.38,0);pell(h[0],h[1],Math.max(.5,s*.13),Math.max(.5,s*.11),A_);for(const sd of [-1,1]){const q=T(.44,sd*.05),r=T(.82,sd*.22);plineB(q[0],q[1],r[0],r[1],A_,.8);}return;}
 if(p.type==='isopod'){for(let i=-3;i<=3;i++){const q=T(i*.12,0),r=.23*(1-Math.abs(i)/5);pell(q[0],q[1],s*.12,s*r,i%2?A_:B_);}for(const sd of [-1,1])for(let i=-2;i<=2;i++){const q=T(i*.13,sd*.16),r=T(i*.11,sd*.34);pline(q[0],q[1],r[0],r[1],1,A_);}const h=T(.43,0);pset(h[0],h[1],E_);return;}
 if(p.type==='waxworm'){for(let i=0;i<9;i++){const f=(i/8-.5)*.88,w=Math.sin((p.anim||0)*3+i*.55)*.05,q=T(f,w);pell(q[0],q[1],s*.075,s*.095,i===8?E_:(i%2?B_:A_));}return;}
 if(p.type==='beetle'){for(const sd of [-1,1])for(let i=-1;i<=1;i++){const q=T(i*.13,sd*.12),r=T(i*.16,sd*.38);pline(q[0],q[1],r[0],r[1],1,A_);}const q=T(-.08,0);pshade(q[0],q[1],s*.38,s*.22,a,(uu,vv,r2,rim)=>rim?shd(B_,.55):(vv>0?B_:shd(B_,1.18)));const h=T(.35,0);pell(h[0],h[1],s*.14,s*.13,A_);pset(h[0]+ca*s*.05,h[1]+sa*s*.05,E_);return;}
};
// Cleanup crews gradually break down old feeder remains, but never exuviae or spider remains.
const _updTankEco20=updTank;
updTank=function(t,dt){const r=_updTankEco20(t,dt);if(!t||t.owned===false)return r;t._huskAge20=t._huskAge20||new Map();for(const h of t.husks||[])t._huskAge20.set(h,(t._huskAge20.get(h)||0)+dt);const cleaners=(t.prey||[]).filter(p=>!p.owner&&(p.type==='springtail'||p.type==='isopod')).length;if(false&&cleaners&&rand()<dt*cleaners*.004){for(let i=0;i<t.husks.length;i++){const h=t.husks[i];if(h.type==='exuvia'||h.type==='spiderMeal')continue;if((t._huskAge20.get(h)||0)>DAYLEN*.08){t.husks.splice(i,1);t._huskAge20.delete(h);break;}}}return r;};
window.__JT20_PREY={ensurePreyEco20};
// ================= end v20 prey ecology =================
