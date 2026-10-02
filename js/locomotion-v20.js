// ================= v20 physical locomotion =================
let JT20_DRAW_SPIDER=null;
function ensureLocomotion20(s){if(!s)return;s._walkPhase20=s._walkPhase20||0;s._land20=s._land20||0;s._launch20=s._launch20||0;s._probe20=s._probe20||0;s._turnLean20=s._turnLean20||0;}
const _followRoute20=followRoute;
followRoute=function(t,e,spd,dt,lockFace){if(e.kind!=='spider')return _followRoute20(t,e,spd,dt,lockFace);ensureLocomotion20(e);const seg=e.route&&e.route[0],old=vc(e.pos),oldFace=vc(e.face);let mod=typeof lifeMove20==='function'?lifeMove20(e):1;mod*=speciesBehavior20(e).activity||1;const L=seg&&seg.pt?vdist(e.pos,seg.pt):999;
 if(seg&&(seg.climb||!sameSurf(e.surf,seg.surf))&&L<Math.max(5,spSize(e)*1.3))e._probe20=Math.max(e._probe20,.95);
 const r=_followRoute20(t,e,spd*mod,dt,lockFace),m=vdist(old,e.pos);if(m>.001){e._walkPhase20+=m*(.48+spSize(e)*.012);e._probe20=Math.max(0,e._probe20-dt*4);if(typeof nudgeDecor20==='function')nudgeDecor20(t,e.pos,clamp(m/(dt||.016)/30,.15,1.2),e);}
 const f0=vnorm(oldFace),f1=vnorm(e.face),cross=f0.x*f1.z-f0.z*f1.x;e._turnLean20=lerp(e._turnLean20,clamp(cross*1.4,-.18,.18),clamp(dt*9,0,1));return r;};
const _startJump20=startJump;
startJump=function(e,to,surfTo,apex,spd){if(e.kind==='spider'){ensureLocomotion20(e);e._launch20=.22;e._probe20=0;}return _startJump20(e,to,surfTo,apex,spd);};
const _stepJump20=stepJump;
stepJump=function(e,dt){const was=e.jump,done=_stepJump20(e,dt);if(e.kind==='spider'){ensureLocomotion20(e);if(done&&was)e._land20=.30;}return done;};
const _updSpiderLoc20=updSpider;
updSpider=function(t,s,dt){ensureLocomotion20(s);s._land20=Math.max(0,s._land20-dt);s._launch20=Math.max(0,s._launch20-dt);s._probe20=Math.max(0,s._probe20-dt*.75);return _updSpiderLoc20(t,s,dt);};
const _drawSpiderEntLoc20=drawSpiderEnt;
drawSpiderEnt=function(t,s,c){JT20_DRAW_SPIDER=s;try{return _drawSpiderEntLoc20(t,s,c);}finally{JT20_DRAW_SPIDER=null;}};
const _drawJumperLoc20=drawJumper;
drawJumper=function(o){const s=JT20_DRAW_SPIDER;if(s){ensureLocomotion20(s);const land=clamp(s._land20/.30,0,1),launch=clamp(s._launch20/.22,0,1),probe=clamp(s._probe20,0,1);if(s.spd>1&&!s._stalkFrozen)o.phase=s._walkPhase20*2.2;o.crouch=Math.max(o.crouch||0,land*.42+launch*.18);o.raise=Math.max(o.raise||0,probe*.82);const stageShape=lerp(.92,1.06,clamp((s.stage-1)/5,0,1));o.as=(o.as||1)*stageShape*(1+land*.035);if((s.surf?.t==='wall'||s.surf?.t==='climb')&&Number.isFinite(o.ang))o.ang+=s._turnLean20*.28;if(s.life?.adultDays>25)o.phase*=.88;}return _drawJumperLoc20(o);};
window.__JT20_LOCOMOTION={ensureLocomotion20};
// ================= end v20 physical locomotion =================
