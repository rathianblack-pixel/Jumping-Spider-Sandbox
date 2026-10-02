// ================= v20 depth / contact lighting =================
const _drawShadowDepth20=drawShadow;
drawShadow=function(t,e,r,c,dp){_drawShadowDepth20(t,e,r,c,dp);dp=dp||e.pos;if(e.surf&&e.surf.t==='wall')return;const g=groundAt(t,dp.x,dp.z),gy=g.p?platTopY(g.p,dp.x,dp.z):g.h,h=Math.max(0,dp.y-gy),q=P(dp.x,gy+.02,dp.z,c);const contact=clamp(1-h/8,0,1);if(contact>0)pellB(q[0],q[1]+.3*c.k,r*c.k*.54,r*c.k*.16,0xff050302,.18+.22*contact);};
function wallContactShadow20(e,c,size){if(!e.surf||e.surf.t!=='wall')return;const q=Pv(e.pos,c),f=Math.max(1,size*c.k),off=1.2*RS;pellB(q[0]+off,q[1]+off*.65,f*.52,f*.23,0xff050302,.23);}
const _drawSpiderDepth20=drawSpiderEnt;
drawSpiderEnt=function(t,s,c){if(s.surf?.t==='wall')wallContactShadow20(s,c,spSize(s)*.48);const r=_drawSpiderDepth20(t,s,c);if(s._dp){const q=Pv(s._dp,c),front=clamp((entDepth(t,s,c)+TD*.25)/(TD*1.5),0,1);if(front>.65&&spSize(s)*c.k>5)pblend(q[0]-spSize(s)*c.k*.16,q[1]-spSize(s)*c.k*.24,0xffffffff,.08*front);}return r;};
const _drawPreyDepth20=drawPreyEnt;
drawPreyEnt=function(t,p,c){if(p.surf?.t==='wall')wallContactShadow20(p,c,p.size*.32);return _drawPreyDepth20(t,p,c);};
window.__JT20_DEPTH={wallContactShadow20};
// ================= end v20 depth =================
