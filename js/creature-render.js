// ---------- creature art ----------
const frac=x=>x-Math.floor(x);
function abdShader(pal,pat,seed,fan){const A=col(pal.abd),A2=col(pal.abd2),A3=col(pal.abd3),F=col(pal.fuzz),RIM=shd(A,0.55);
 return (u,v,r2,rim,x,y)=>{const h=hash3(x,y,seed);if(rim)return h<0.12?F:RIM;let c=A;const av=Math.abs(v);
  switch(pat){
   case 'audax':if(((u+0.1)/0.3)**2+(v/0.22)**2<1)c=A2;else if(((u+0.5)/0.16)**2+((av-0.45)/0.14)**2<1)c=A3;else if(u>0.72)c=h<0.5?F:A;break;
   case 'regius':if(u>0.72)c=A3;else if(av<0.42){c=frac(u*3.2+av*1.6)<0.32?A:A2;}else if(frac(u*2+av)<0.15)c=A2;break;
   case 'otiosus':if(av<0.85&&frac(u*2.6+av*1.6)<0.36)c=A2;else if(av<0.15&&u>-0.2)c=A3;break;
   case 'zebra':c=Math.sin(u*8.5)>0.15?A2:A;break;
   case 'stripes':if(av<0.13)c=A2;else if(av>0.3&&av<0.62)c=A3;break;
   case 'irid':{c=mixc(A,A2,(v+1)/2);if(Math.abs(u*0.6+v+0.25)<0.17)c=A3;break;}
   case 'peacock':if(fan){c=r2<0.18?A3:r2<0.45?A2:r2<0.7?A:A3;if(av<0.08&&r2>0.18)c=A2;}else c=frac(u*2.2)<0.4?A2:A;break;
   case 'portia':{const q=hash3(x>>1,y>>1,seed+3);c=q<0.3?A:q<0.55?A2:q<0.8?A3:col(pal.body2);break;}
   case 'red':if(av<0.17&&u<0.65&&pal.abd2!==pal.abd)c=A2;break;
   case 'ant':if(Math.abs(u-0.35)<0.12)c=A2;break;
   case 'lysso':c=mixc(A,A2,(v+1)/2);if(h<0.05)c=A3;break;
   default:if(h<0.08)c=A3;}
  if(h>0.975)c=F;else if(h<0.04&&pat!=='lysso')c=shd(c,0.85);
  if(u<-0.1&&v<-0.45)c=shd(c,1.25);return c;};}
function carShader(pal,pat,seed){const Bc=col(pal.body),B2=col(pal.body2),F=col(pal.fuzz),RIM=shd(Bc,0.5);
 return (u,v,r2,rim,x,y)=>{const h=hash3(x,y,seed+11);if(rim)return h<0.3?F:RIM;let c=Bc;const av=Math.abs(v);
  if(pat==='regius'){if(av<0.38&&u<0.45&&u>-0.7)c=B2;}else if(pat==='stripes'){if(av>0.5)c=B2;}else if(pat==='otiosus'){if(av>0.6)c=B2;}
  else if(pat==='irid'){if(av<0.2)c=B2;}else if(pat==='lysso'){}else if(pat==='peacock'){if(av>0.55)c=B2;}else if(pat==='red'&&pal.body2!==pal.body){if(u<0.2)c=B2;}
  if(u>0.55)c=shd(c,0.75);if(h>0.975)c=F;if(u<0&&v<-0.4)c=shd(c,1.3);return c;};}
function drawEye(cx,cy,r,eyeC){const base=eyeC||0xff060606;const hl=0xffffffff;
 if(r>=2.2){pellB(cx,cy,r*1.3,r*1.3,0xffa89884,0.16);pellB(cx,cy,r*1.12,r*1.12,0xff000000,0.35);pell(cx,cy,r,r,base);pellB(cx,cy+r*0.28,r*0.78,r*0.62,0xff3b2a1a,0.45);pellB(cx+r*0.05,cy+r*0.42,r*0.5,r*0.32,0xff6a7a48,0.22);pellB(cx,cy+r*0.55,r*0.42,r*0.18,0xff8ab0c0,0.16);
  pellB(cx-r*0.36,cy-r*0.4,r*0.52,r*0.44,hl,0.16);pellB(cx-r*0.38,cy-r*0.42,r*0.27,r*0.22,hl,0.97);pellB(cx-r*0.18,cy-r*0.58,r*0.09,r*0.07,hl,0.8);pellB(cx+r*0.42,cy+r*0.4,r*0.14,r*0.1,hl,0.55);return;}
 pell(cx,cy,r,r,base);if(r>=1.2){pellB(cx,cy+r*0.3,r*0.6,r*0.45,0xff2a1c12,0.5);}pset(cx-r*0.45,cy-r*0.5,hl);if(r>=1.6)pblend(cx+r*0.35,cy+r*0.3,hl,0.5);}
function drawLeg(pts,t,lc,bc,tc){const lo=shd(lc,0.5),hi=mixc(lc,0xffffffff,0.3);const n=pts.length-1;const TT=i=>Math.max(1,t*(1-i*0.2));
 for(let i=0;i<n;i++){const a=pts[i],b=pts[i+1];const T=TT(i);if(T>=2.5)pline(a[0],a[1]+T*0.15,b[0],b[1]+T*0.15,T,lo);pline(a[0],a[1],b[0],b[1],T*(T>=2.5?0.8:1),lc);
  if(T>=3){plineB(a[0]-T*0.16,a[1]-T*0.2,b[0]-T*0.16,b[1]-T*0.2,hi,0.35);const dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L;const nh=Math.min(12,L/(T*0.8))|0;for(let k=1;k<nh;k++){const f=k/nh,px=a[0]+dx*f,py=a[1]+dy*f,sg=k%2?1:-1;plineB(px+nx*T*0.35*sg,py+ny*T*0.35*sg,px+nx*T*1.0*sg+dx/L*T*0.6,py+ny*T*1.0*sg+dy/L*T*0.6,k%3?hi:lo,0.45);}}}
 for(let i=1;i<n;i++){const a=pts[i-1],b=pts[i];const T=TT(i-1);const f=0.76;pline(a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f,b[0],b[1],T*0.82,bc);}
 const e=pts[n];pell(e[0],e[1],Math.max(0.5,t*0.32),Math.max(0.5,t*0.32),tc);}
// o: {x,y,u,view,flip,ang,pal,pat,seed,phase,crouch,wig,jump,groom,raise,as,fan,legsUp,pale}
function drawJumper(o){const pal=o.pal,u=o.u,X=o.x,Y=o.y;const L=col(pal.leg),LB=col(pal.band),LT=shd(L,0.6),F=col(pal.fuzz);
 const lt=Math.max(1,u*0.8);const as=o.as||1;const ph=o.phase||0,cr=o.crouch||0;const eyeC=pal.eye?col(pal.eye):0;
 const abd=abdShader(pal,o.pat,o.seed,o.fan),car=carShader(pal,o.pat,o.seed);const ant=o.pat==='ant'?0.65:1;
 const FD=0xff15100c;const fuzz=(cx,cy,rx,ry,n,s)=>{const N=Math.round(n*Math.min(5,Math.max(1,u/1.8)));for(let i=0;i<N;i++){const a=hash3(i,s,o.seed)*6.283,r0=0.7+hash3(i,s+2,o.seed)*0.2,r1=1.04+hash3(i,s+1,o.seed)*(hash3(i,s+4,o.seed)<0.12?0.6:0.24),cv_=(hash3(i,s+3,o.seed)-0.5)*0.6;
  if(u<2.2){pblend(cx+Math.cos(a)*rx*r1,cy+Math.sin(a)*ry*r1,F,0.7);continue;}plineB(cx+Math.cos(a)*rx*r0,cy+Math.sin(a)*ry*r0,cx+Math.cos(a+cv_)*rx*r1,cy+Math.sin(a+cv_)*ry*r1,i%5<2?F:FD,i%5<2?0.5:0.3);}};
 if(o.view==='belly'){const ca=Math.cos(o.ang),sa=Math.sin(o.ang);const T=(f,l)=>[X+(ca*f-sa*l)*u,Y+(sa*f+ca*l)*u];const A0=col(pal.abd),Bd=col(pal.body);const ven=mixc(mixc(A0,Bd,0.55),0xff4a5a6a,0.2),venL=mixc(ven,0xffb8c8d8,0.35),venD=shd(ven,0.55);const ap=T(-3.0-(o.wig||0)*0.3,0);pshade(ap[0],ap[1],3.0*as*u,2.4*as*u*ant,o.ang,(uu,vv,r2,rim,x,y)=>{if(rim)return venD;const h=hash3(x,y,o.seed);let c=ven;const av=Math.abs(vv);if(av>0.3&&av<0.44&&uu<0.35)c=venL;if(uu>0.52&&av>0.16&&av<0.6)c=mixc(venL,0xffc0dce8,0.3);if(Math.abs(uu-0.45)<0.045&&av<0.72)c=venD;if(uu<-0.8&&av<0.25)c=venD;if(h<0.1)c=shd(c,0.85);return c;});fuzz(ap[0],ap[1],3.0*as*u,2.4*as*u,8,1);for(const l of [-0.4,0,0.4]){const q=T(-3.0-2.85*as,l);pell(q[0],q[1],Math.max(0.5,0.38*u),Math.max(0.5,0.32*u),venD);}const cpp=T(1.1,0);pshade(cpp[0],cpp[1],2.6*u,2.2*u,o.ang,car);for(const sd of [-1,1])for(let i=0;i<4;i++){const q=T(1.75-i*0.72,sd*1.3);pell(q[0],q[1],0.55*u,0.45*u,shd(L,0.85));}const stp=T(1.0,0);GLOSS=0.55;pshade(stp[0],stp[1],1.75*u,1.25*u,o.ang,(uu,vv,r2,rim)=>rim?shd(Bd,0.5):mixc(Bd,ven,0.3));GLOSS=0.18;const lb=T(2.7,0);pell(lb[0],lb[1],0.45*u,0.42*u,shd(Bd,0.8));for(const sd of [-1,1]){const en=T(2.95,sd*0.62);pell(en[0],en[1],0.42*u,0.5*u,mixc(Bd,venL,0.25));}const ch=col(pal.chel),chh=col(pal.chelHi);GLOSS=1.1;for(const sd of [-1,1]){const q=T(3.65,sd*0.55);pshade(q[0],q[1],0.78*u,0.56*u,o.ang,(uu,vv,r2,rim)=>rim?shd(ch,0.6):(uu>0.2?chh:ch));}GLOSS=0.18;for(const sd of [-1,1]){const a=T(4.3,sd*0.62),b=T(4.05,sd*0.12);pline(a[0],a[1],b[0],b[1],Math.max(1,u*0.28),0xff1a0e0a);}if(o.held)o.held(...T(4.45,0),'belly',0,o.ang,Y);const gp=o.groom?Math.sin(o.groom*14)*0.4:0;for(const sd of [-1,1]){drawLeg([T(2.9,sd*0.95),T(3.9+gp,sd*1.6),T(4.6+gp,sd*1.2)],lt*0.85,L,LB,LT);const e=T(4.6+gp,sd*1.2);pell(e[0],e[1],0.5*u,0.5*u,F);}for(const sd of [-1,1])for(let i=0;i<4;i++){const w=Math.sin(ph+i*1.57+(sd>0?Math.PI:0))*0.5;drawLeg([T(1.75-i*0.72,sd*1.35),T(2.6-i*1.7+w*0.5,sd*3.4),T(3.6-i*2.7+w,sd*4.6)],i===0?lt*1.2:lt,L,LB,LT);}return;}
 if(o.view==='top'){const ca=Math.cos(o.ang),sa=Math.sin(o.ang);const T=(f,l)=>[X+(ca*f-sa*l)*u,Y+(sa*f+ca*l)*u];if(o.held)o.held(...T(4.3,0),'top',0,o.ang,Y);
  for(const sd of [-1,1])for(let i=0;i<4;i++){const w=Math.sin(ph+i*1.57+(sd>0?Math.PI:0))*0.5;const legs=[T(1.0-i*0.65,sd*1.3),T(2.6-i*1.7+w*0.5,sd*3.4),T(3.6-i*2.7+w,sd*4.6)];drawLeg(legs,i===0?lt*1.2:lt,L,LB,LT);}
  const ap=T(-3.0-(o.wig||0)*0.3,0);pshade(ap[0],ap[1],3.0*as*u,2.4*as*u*ant,o.ang,abd);const cp=T(1.1,0);pshade(cp[0],cp[1],2.6*u,2.2*u,o.ang,car);
  fuzz(ap[0],ap[1],3.0*as*u,2.4*as*u,10,1);for(const sd of [-1,1]){const e=T(3.0,sd*0.85);drawEye(e[0],e[1],Math.max(0.6,0.75*u),eyeC);const e2=T(2.4,sd*1.9);drawEye(e2[0],e2[1],Math.max(0.5,0.4*u),eyeC);const c=T(3.9,sd*0.6);pell(c[0],c[1],0.5*u,0.5*u,col(pal.chel));}
  return;}
 const by=-3.1+cr*0.9-(o.jump?1.2:0);
 if(o.view==='front3'||o.view==='back3'){const back=o.view==='back3',fl=o.flip?-1:1,tow=back?-1:1,far=shd(L,0.66);
  const T=(f,l)=>[X+fl*(f*0.56+l*0.72)*u,Y+(by+tow*f*0.42)*u],ba=Math.atan2(tow*0.42,fl*0.56);
  const leg=(i,sd)=>{const w=Math.sin(ph+i*1.57+(sd<0?Math.PI:0)),lift=Math.max(0,w)*0.75;let h=T(1.0-i*0.7,sd*(1.15+i*0.08)),k=T(2.15-i*1.45,sd*(2.6+i*0.42)),f=T(2.8-i*2.15,sd*(3.35+i*0.62));
   if(o.jump){k[1]+=u*0.7;f[0]+=fl*(i<2?1.5:-1.5)*u;f[1]=Y+(i<2?1.2:1.8)*u;}else f[1]=Y-lift*u;
   if(i===0&&o.raise){k[1]-=u*(1.2+o.raise*0.5);f[1]-=u*(0.5+o.raise);}return[h,k,f];};
  for(let i=3;i>=0;i--)drawLeg(leg(i,-1),lt*0.88,far,shd(LB,0.72),LT);
  const ap=T(-3.0-(o.wig||0)*0.35,0),cp=T(1.05,0);
  if(back){pshade(cp[0],cp[1],2.65*u,2.0*u,ba,car);fuzz(cp[0],cp[1],2.65*u,2.0*u,8,6);pshade(ap[0],ap[1],3.0*as*u*ant,2.45*as*u*(o.fan?1.25:1),ba,abd);fuzz(ap[0],ap[1],3.0*as*u,2.45*as*u,11,5);
   const e1=T(2.5,1.15),e2=T(2.35,-1.25);drawEye(e1[0],e1[1],Math.max(0.45,0.46*u),eyeC);drawEye(e2[0],e2[1],Math.max(0.4,0.36*u),eyeC);if(o.held){const h=T(3.5,0);o.held(h[0],h[1]+u*0.5,'side',fl,0,Y);}}
  else{pshade(ap[0],ap[1],2.85*as*u*ant,2.2*as*u*(o.fan?1.22:1),ba,abd);fuzz(ap[0],ap[1],2.85*as*u,2.2*as*u,9,5);pshade(cp[0],cp[1],2.8*u,2.12*u,ba,car);fuzz(cp[0],cp[1],2.8*u,2.12*u,10,6);
   const fc=T(2.45,0);GLOSS=0.07;pshade(fc[0],fc[1]+0.12*u,1.85*u,1.3*u,ba,()=>col(pal.face));GLOSS=0.18;
   const en=T(3.02,0.54),ef=T(2.95,-0.5),es=T(2.45,1.48);drawEye(en[0],en[1],Math.max(0.7,1.03*u),eyeC);drawEye(ef[0],ef[1],Math.max(0.6,0.82*u),eyeC);drawEye(es[0],es[1],Math.max(0.45,0.42*u),eyeC);
   const ch=col(pal.chel),chh=col(pal.chelHi);GLOSS=1.1;for(const sd of [-1,1]){const q=T(3.55,sd*0.48);pshade(q[0],q[1]+0.25*u,0.54*u,0.82*u,ba,(uu,vv,r2,rim)=>rim?shd(ch,0.6):(vv<-0.15?chh:ch));}GLOSS=0.18;
   const gp=o.groom?Math.sin(o.groom*14)*0.55:0;for(const sd of [-1,1]){const q=T(3.92,sd*0.78);pell(q[0],q[1]+(0.5-gp*(sd>0?1:-1))*u,0.52*u,0.58*u,F);}if(o.held){const h=T(4.25,0);o.held(h[0],h[1]+0.75*u,'side',fl,0,Y);}}
  for(let i=0;i<4;i++)drawLeg(leg(i,1),i===0?lt*1.22:lt,L,LB,LT);return;}
 if(o.view==='front'||o.view==='back'){const back=o.view==='back';
  const legs=[];for(const sd of [-1,1])for(let i=back?0:1;i<4;i++){const lift=Math.max(0,Math.sin(ph+i*1.57+(sd>0?Math.PI:0)))*0.9;const jx=o.jump?1.2:0;
   legs.push([[X+sd*(1.3+i*0.3)*u,Y+(by+0.6)*u],[X+sd*(3.1+i*0.9+jx)*u,Y+(by-1.7+i*0.3-cr*0.4)*u],[X+sd*(3.8+i*1.3+jx*1.5)*u,Y+(o.jump?by+1.8:-lift)*u]]);}
  for(const l of legs)drawLeg(l,lt,L,LB,LT);
  if(!back){pshade(X,Y+(by-2.3)*u,2.7*as*u*ant,2.0*as*u,Math.PI/2,abd);fuzz(X,Y+(by-2.3)*u,2.7*as*u,2.0*as*u,8,2);
   pshade(X,Y+by*u,3.0*u,2.3*u,Math.PI/2,car);fuzz(X,Y+by*u,3.0*u,2.3*u,12,3);
   GLOSS=0.08;pshade(X,Y+(by+0.75)*u,2.5*u,1.45*u,0,()=>col(pal.face));GLOSS=0.18;for(let i=0;i<(u>2.2?34:10);i++){const a=hash3(i,9,o.seed)*3.14+3.14,l=0.8+hash3(i,10,o.seed)*1.1;const bx=X+Math.cos(a)*2.3*u,byy=Y+(by+0.75)*u+Math.sin(a)*1.3*u;if(u>2.2)plineB(bx,byy,bx+Math.cos(a)*l*u*0.6,byy+Math.sin(a)*l*u*0.7-u*0.3,i%3?F:FD,0.5);else pblend(bx,byy,F,0.6);}
   for(const sd of [-1,1]){drawEye(X+sd*1.12*u,Y+(by+0.55)*u,Math.max(0.7,1.05*u),eyeC);drawEye(X+sd*2.3*u,Y+(by-0.15)*u,Math.max(0.5,0.48*u),eyeC);}
   if(o.held)o.held(X,Y+(by+2.6)*u,'front',0,0,Y);const ch=col(pal.chel),chh=col(pal.chelHi);GLOSS=1.1;for(const sd of [-1,1])pshade(X+sd*0.62*u,Y+(by+2.05)*u,0.62*u,1.0*u,0,(uu,vv,r2,rim)=>rim?shd(ch,0.6):(uu*sd<-0.1&&vv<0.2?chh:ch));
   GLOSS=0.18;const gp=o.groom?Math.sin(o.groom*14)*0.6:0;for(const sd of [-1,1])pell(X+sd*1.75*u,Y+(by+2.0-(sd>0?gp:-gp))*u,0.6*u,0.7*u,F);
   const rs=o.raise||0;for(const sd of [-1,1]){drawLeg([[X+sd*1.9*u,Y+(by+1.0)*u],[X+sd*3.2*u,Y+(by-0.5-rs)*u],[X+sd*(3.0-rs*0.5)*u,Y+(o.jump?by+1.5:-0.1-rs*1.4)*u]],lt*1.25,L,LB,LT);}}
  else{if(o.held)o.held(X,Y+(by+1.2)*u,'back',0,0,Y);pshade(X,Y+(by-1.9)*u,2.8*u,1.9*u,-Math.PI/2,car);pshade(X,Y+(by+0.1)*u,3.0*as*u*ant,2.7*as*u,-Math.PI/2,abd);fuzz(X,Y+(by+0.1)*u,3.0*as*u,2.7*as*u,12,4);
   for(const sd of [-1,1])drawEye(X+sd*2.4*u,Y+(by-2.6)*u,Math.max(0.5,0.4*u),eyeC);}
  return;}
 // side
 const fl=o.flip?-1:1;const SX=x=>X+x*fl*u,SY=y=>Y+y*u;const far=shd(L,0.65);
 const legGeo=(i,sd)=>{const hx=2.0-i*0.8;const w=Math.sin(ph+i*1.57+(sd?Math.PI:0));const lift=Math.max(0,w)*0.8;const kx=[1.6,0.7,-0.6,-1.6][i],fx=[3.4,1.8,-1.6,-3.6][i]+Math.cos(ph+i*1.57+(sd?Math.PI:0))*0.4;
  if(o.jump){return [[SX(hx),SY(by+0.8)],[SX(hx+kx*1.3),SY(by-0.4)],[SX(hx+(i<2?4.6:-4.6)),SY(by+(i<2?0.6:1.6))]];}
  if(i===0&&o.raise)return [[SX(hx),SY(by+0.8)],[SX(hx+1.6),SY(by-1.4)],[SX(hx+3.2),SY(by+1.0)]];
  return [[SX(hx),SY(by+0.8)],[SX(hx+kx),SY(by-2.0+i*0.2+cr*0.6)],[SX(hx+fx),SY(-lift)]];};
 for(let i=3;i>=0;i--){const g=legGeo(i,1).map(p=>[p[0]+fl*0.5*u,p[1]-0.3*u]);drawLeg(g,lt*0.9,far,shd(LB,0.7),LT);}
 const ax=-3.3-(o.wig||0)*0.4;pshade(SX(ax),SY(by-0.2-(o.fan?1.2:0)),3.1*as*u*ant,2.4*as*u*(o.fan?1.3:1),o.flip?Math.PI:0,abd);fuzz(SX(ax),SY(by-0.2),3.1*as*u,2.4*as*u,10,5);
 pshade(SX(1.3),SY(by-0.3),2.7*u,2.0*u,o.flip?Math.PI:0,car);fuzz(SX(1.3),SY(by-0.3),2.7*u,2.0*u,10,6);
 GLOSS=0.06;pshade(SX(3.0),SY(by+0.1),1.0*u,1.3*u,0,()=>col(pal.face));GLOSS=0.18;if(u>2.2)for(let i=0;i<14;i++){const a=-1.9+hash3(i,21,o.seed)*2.4,l=0.7+hash3(i,22,o.seed)*0.9;const bx=SX(3.0+Math.cos(a)*0.9),byy=SY(by+0.1+Math.sin(a)*1.2);plineB(bx,byy,bx+Math.cos(a)*fl*l*u*0.6,byy+Math.sin(a)*l*u*0.6,i%3?F:FD,0.45);}
 if(o.held)o.held(SX(4.3),SY(by+1.7),'side',fl,0,Y);
 for(let i=0;i<4;i++)drawLeg(legGeo(i,0),i===0?lt*1.25:lt,L,LB,LT);
 const ch=col(pal.chel),chh=col(pal.chelHi);GLOSS=1.1;pshade(SX(3.55),SY(by+1.35),0.55*u,0.9*u,0,(uu,vv,r2,rim)=>rim?shd(ch,0.6):(vv<-0.2?chh:ch));GLOSS=0.18;
 const gp=o.groom?Math.sin(o.groom*14)*0.6:0;pell(SX(4.05),SY(by+1.5-gp),0.55*u,0.6*u,F);
 drawEye(SX(3.5),SY(by-0.15),Math.max(0.7,0.95*u),eyeC);drawEye(SX(2.6),SY(by-1.45),Math.max(0.5,0.42*u),eyeC);drawEye(SX(0.7),SY(by-1.95),Math.max(0.4,0.3*u),eyeC);}
// ---------- prey art ----------
const PREYCOL={fruitfly:{b:'#c79a5a',a:'#5a3a1a',e:'#d0261a'},housefly:{b:'#4b4b4b',a:'#2e2e2e',e:'#7a1f14'},bluebottle:{b:'#2b3240',a:'#2d58c8',e:'#a3281c'},moth:{b:'#b8a487',a:'#8a7658',e:'#2a2018'},cricket:{b:'#7a5530',a:'#5a3c20',e:'#1a120a'},mealworm:{b:'#d9a54a',a:'#a8742e',e:'#4a2e14'},roach:{b:'#4a3022',a:'#2e1c12',e:'#1a100a'}};
const SJPAL={body:'#6a625a',body2:'#3a342e',abd:'#7a7268',abd2:'#3e3832',abd3:'#c9c0b2',fuzz:'#d0c8bc',leg:'#5a524a',band:'#a49a8e',chel:'#3a342e',chelHi:'#6a625a',face:'#7a7268'};
function drawPrey(p,X,Y,u,view,flip,ang,o={}){const rt=PREY[p.type]?.renderAs;if(rt)p=Object.assign({},p,{type:rt});const C=PREYCOL[p.type]||PREYCOL.roach;if(p.type==='sjumper'){drawJumper({x:X,y:Y,u:u*p.size/12*1.0,view,flip,ang,pal:o.husk?HUSKPAL:SJPAL,pat:'stripes',seed:p.seed,phase:p.anim*12*(p.spd>1?1:0)+(o.tw||0),as:1});return;}
 let B_=col(C.b),A_=col(C.a),E_=col(C.e);if(o.dark){B_=mixc(B_,0xff2a2018,o.dark);A_=mixc(A_,0xff2a2018,o.dark);}if(o.husk){B_=mixc(B_,0xff8a7a62,0.6);A_=mixc(A_,0xff6a5a46,0.6);}
 const s=p.size*u*(o.shrink||1);const fl=flip?-1:1;const tw=o.tw||0;
 const flying=p.surf&&p.surf.t==='air'&&!p.owner;
 if(p.type==='fruitfly'||p.type==='housefly'||p.type==='bluebottle'){
  if(view==='top'){const ca=Math.cos(ang),sa=Math.sin(ang);pshade(X,Y,s*0.5,s*0.22,ang,()=>A_);pell(X+ca*s*0.42,Y+sa*s*0.42,s*0.16,s*0.16,E_);
   for(const sd of [-1,1]){const wx=X-ca*s*0.1-sa*sd*s*0.3,wy=Y-sa*s*0.1+ca*sd*s*0.3;pellB(wx,wy,s*0.34,s*0.18,0xffe8f0ff,0.45);}return;}
  const by=-s*0.32;
  if(!flying)for(let i=0;i<3;i++){const lx=X+fl*(s*0.25-i*s*0.22);pline(lx,Y+by,lx+fl*(s*0.15-i*0.08*s)+Math.sin(tw*30+i)*s*0.15*(tw?1:0),Y,1,0xff1a1a1a);}
  pell(X-fl*s*0.28,Y+by,s*0.32,s*0.2,A_);if(p.type==='fruitfly'){for(let i=0;i<3;i++)pset(X-fl*(s*0.15+i*s*0.12),Y+by,0xff3a2410);}
  pell(X+fl*s*0.06,Y+by-s*0.03,s*0.22,s*0.2,B_);pell(X+fl*s*0.33,Y+by,s*0.15,s*0.15,E_);pset(X+fl*s*0.36,Y+by-s*0.06,0xffffb0a0);
  const flap=flying?Math.sin(p.anim*80)>0:false;if(o.dark>0.5&&!o.husk){pellB(X-fl*s*0.2,Y+by+s*0.08,s*0.35,s*0.1,0xffd8e0ee,0.35);return;}
  pellB(X-fl*s*0.18,Y+by-(flap?s*0.35:s*0.12),s*0.38,s*(flap?0.22:0.12),0xffe8f0ff,0.5);return;}
 if(p.type==='moth'){const W_=col('#d8c8a8'),D_=col('#7a6648');
  if(view==='top'||!flying){const a=view==='top'?ang:(flip?Math.PI:0);const ca=Math.cos(a),sa=Math.sin(a);
   const T=(f,l)=>[X+(ca*f-sa*l)*s,Y-(view==='top'?0:s*0.25)+(sa*f+ca*l)*s*(view==='top'?1:0.5)];
   const wing=[T(0.3,0),T(-0.5,0.55),T(-0.6,0.15),T(-0.6,-0.15),T(-0.5,-0.55)];ppoly(wing,(x,y)=>{const h=hash3(x,y,p.seed);return h<0.15?D_:h<0.3?A_:B_;});
   const b=T(0.2,0);pell(b[0],b[1],s*0.16,s*0.12,A_);for(const sd of [-1,1]){const a1=T(0.35,sd*0.05),a2=T(0.6,sd*0.25);pline(a1[0],a1[1],a2[0],a2[1],1,D_);}return;}
  const by=-s*0.4,fp=Math.sin(p.anim*18);pell(X,Y+by,s*0.3,s*0.12,A_);
  for(const sd of [-1,1]){const tip=[X+fl*sd*s*0.05,Y+by-fp*s*0.55*sd];ppoly([[X-s*0.2,Y+by],[X+s*0.25,Y+by],[tip[0]+s*0.5,tip[1]],[tip[0]-s*0.45,tip[1]]],(x,y)=>hash3(x,y,p.seed)<0.2?D_:B_);}return;}
 if(p.type==='cricket'){if(view==='top'){const ca=Math.cos(ang),sa=Math.sin(ang),T=(f,l)=>[X+(ca*f-sa*l)*s,Y+(sa*f+ca*l)*s],hop=p.jump||tw;let q1=T(-.1,0),q2=T(-.35,-.32),q3=T(-(hop?.75:.55),hop?-.15:0);pline(q1[0],q1[1],q2[0],q2[1],Math.max(1,s*.1),A_);pline(q2[0],q2[1],q3[0],q3[1],Math.max(1,s*.06),A_);for(const sd of [-1,1])for(let i=0;i<2;i++){const a=T(.15+i*.12,sd*.05),b=T(.21+i*.12,sd*(.22+(tw?Math.sin(tw*40+i)*.1:0)));pline(a[0],a[1],b[0],b[1],1,A_);}const b=T(-.05,0);pshade(b[0],b[1],s*.45,s*.14,ang,(uu,vv,r2,rim)=>rim?shd(B_,.6):(vv<-.3?shd(B_,1.25):B_));const hd=T(.42,-.02);pell(hd[0],hd[1],s*.12,s*.12,shd(B_,.75));pset(hd[0]+ca*s*.04,hd[1]+sa*s*.04,E_);const tail=T(-.45,0),tail2=T(-.62,-.08);pline(tail[0],tail[1],tail2[0],tail2[1],1,A_);const aw=Math.sin(p.anim*3)*s*.1,a1=T(.5,-.05),a2=T(1,-.5+aw/s),a3=T(.48,.05),a4=T(.9,.3-aw/s);plineB(a1[0],a1[1],a2[0],a2[1],shd(A_,.8),.8);plineB(a3[0],a3[1],a4[0],a4[1],shd(A_,.8),.8);return;}const by=-s*0.22;const hop=p.jump||tw;
  pline(X-fl*s*0.1,Y+by,X-fl*s*0.35,Y+by-s*0.32,Math.max(1,s*0.1),A_);pline(X-fl*s*0.35,Y+by-s*0.32,X-fl*s*(hop?0.75:0.55),Y-(hop?s*0.15:0),Math.max(1,s*0.06),A_);
  for(let i=0;i<2;i++){const lx=X+fl*(s*0.15+i*s*0.12);pline(lx,Y+by,lx+fl*s*0.06+(tw?Math.sin(tw*40+i)*s*0.1:0),Y,1,A_);}
  pshade(X-fl*s*0.05,Y+by,s*0.45,s*0.14,flip?Math.PI:0,(uu,vv,r2,rim)=>rim?shd(B_,0.6):(vv<-0.3?shd(B_,1.25):B_));pell(X+fl*s*0.42,Y+by-s*0.02,s*0.12,s*0.12,shd(B_,0.75));pset(X+fl*s*0.46,Y+by-s*0.05,E_);
  pline(X-fl*s*0.45,Y+by,X-fl*s*0.62,Y+by-s*0.08,1,A_);
  const aw=Math.sin(p.anim*3)*s*0.1;plineB(X+fl*s*0.5,Y+by-s*0.05,X+fl*s*1.0,Y+by-s*0.5+aw,shd(A_,0.8),0.8);plineB(X+fl*s*0.48,Y+by-s*0.05,X+fl*s*0.9,Y+by-s*0.3-aw,shd(A_,0.8),0.8);return;}
 if(p.type==='mealworm'){const n=8;const dir=view==='top'?ang:(flip?Math.PI:0);const ca=Math.cos(dir),sa=Math.sin(dir);
  for(let i=n-1;i>=0;i--){const f=(i/(n-1)-0.5)*s;const wv=Math.sin(p.anim*3+i*0.8)*s*0.04+(tw?Math.sin(tw*25+i)*s*0.06:0);const cx=X+ca*f-sa*wv,cy=Y-s*0.08+(view==='top'?sa*f+ca*wv:wv*0.5);pell(cx,cy,s*0.085,s*0.085,i===n-1?E_:(i%2?A_:B_));}return;}
 if(p.type==='roach'){if(view==='top'){const ca=Math.cos(ang),sa=Math.sin(ang),T=(f,l)=>[X+(ca*f-sa*l)*s,Y+(sa*f+ca*l)*s];for(let i=0;i<3;i++)for(const sd of [-1,1]){const a=T(.2-i*.2,sd*.1),b=T(.3-i*.2,sd*(.32+(tw?Math.sin(tw*30+i)*.1:0)));pline(a[0],a[1],b[0],b[1],1,A_);}pshade(X,Y,s*.5,s*.2,ang,(uu,vv,r2,rim,x,y)=>rim?col('#c9a98a'):(Math.abs(frac(uu*3)-.5)<.08?A_:B_));return;}const by=-s*0.15;for(let i=0;i<3;i++){const lx=X+fl*(s*0.2-i*s*0.2);pline(lx,Y+by,lx+fl*s*0.1+(tw?Math.sin(tw*30+i)*s*0.1:0),Y,1,A_);}
  pshade(X,Y+by,s*0.5,s*0.2,flip?Math.PI:0,(uu,vv,r2,rim,x,y)=>rim?col('#c9a98a'):(Math.abs(frac(uu*3)-0.5)<0.08?A_:B_));}}
const HUSKPAL={body:'#8a7a62',body2:'#6a5a46',abd:'#8f7e64',abd2:'#6a5a46',abd3:'#a89878',fuzz:'#b8a888',leg:'#7a6a52',band:'#9a8a70',chel:'#6a5a46',chelHi:'#8a7a62',face:'#8a7a62'};
function paleOf(pal){const o={};for(const k in pal){const c=col(pal[k]);const m=mixc(c,0xffeadfcf,0.65);o[k]='#'+[cr(m),cg(m),cb(m)].map(v=>v.toString(16).padStart(2,'0')).join('');}return o;}
