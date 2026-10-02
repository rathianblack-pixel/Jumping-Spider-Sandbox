// ================= v20 reactive decor =================
function flexibleDecor20(d){const D=DECOR[d.type];return D&&(D.kind==='plant'||['branch','forkbranch','grapevine','twigs','vine','spiderplant','grass','fern','pothos','ivy','palm'].includes(d.type));}
function nudgeDecor20(t,pos,strength=1,e=null){if(!t||!pos)return;let best=null,bd=1e9;for(const d of t.decor){if(!flexibleDecor20(d))continue;const D=DECOR[d.type],rad=Math.max(6,Math.min(24,(D.w+D.d)*.35)),dd=hdist(pos,v3(d.x,0,d.z));if(dd<rad&&dd<bd){bd=dd;best=d;}}if(best){best._sway20=clamp((best._sway20||0)+strength*.34,0,1.5);const dir=Math.sign((pos.x-best.x)+(pos.z-best.z)*.35)||1;best._swayVel20=(best._swayVel20||0)+dir*strength*1.6;best._swayAge20=0;}}
const _updTankDecor20=updTank;
updTank=function(t,dt){const r=_updTankDecor20(t,dt);if(!t||t.owned===false)return r;for(const d of t.decor){if(!flexibleDecor20(d))continue;d._sway20=d._sway20||0;d._swayVel20=d._swayVel20||0;d._swayAge20=(d._swayAge20||0)+dt;d._swayVel20+=(-d._sway20*11-d._swayVel20*4.4)*dt;d._sway20+=d._swayVel20*dt;if(Math.abs(d._sway20)<.002&&Math.abs(d._swayVel20)<.004){d._sway20=0;d._swayVel20=0;}}
 for(const p of t.prey||[])if(!p.owner&&p.spd>6&&rand()<dt*.8)nudgeDecor20(t,p.pos,Math.min(.5,p.size/15),p);return r;};
function drawReactiveDecor20(g,t,c){g.save();g.lineCap='round';for(const d of t.decor){const sw=d._sway20||0;if(Math.abs(sw)<.01)continue;const D=DECOR[d.type],base=P(d.x,0,d.z,c),top=P(d.x+sw*(D.h||18)*.16,Math.min(TH-3,D.h||D.ph||18),d.z,c);const alpha=clamp(Math.abs(sw)*.28,.04,.30);g.strokeStyle=`rgba(142,181,91,${alpha})`;g.lineWidth=Math.max(.7,c.k*.45);g.beginPath();g.moveTo(base[0],base[1]);g.quadraticCurveTo((base[0]+top[0])*.5+sw*8*c.k,(base[1]+top[1])*.5,top[0],top[1]);g.stroke();if(D.kind==='plant'){g.fillStyle=`rgba(166,205,110,${alpha*.8})`;g.beginPath();g.ellipse(top[0],top[1],Math.max(1,4*c.k),Math.max(.7,1.7*c.k),sw*.35,0,Math.PI*2);g.fill();}}
 g.restore();}
const _drawSceneDecor20=drawScene;
drawScene=function(t,c){_drawSceneDecor20(t,c);const base=DLX;DLX=g=>{if(base)base(g);drawReactiveDecor20(g,t,c);};};
window.nudgeDecor20=nudgeDecor20;window.__JT20_DECOR={nudgeDecor20};
// ================= end v20 reactive decor =================
