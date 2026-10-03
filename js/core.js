'use strict';
// Jumper Terrarium v11 adaptive stalking + close-range commitment + variable jump reach patch.
// Builds on v8 stability safeguards. Held prey now uses a true fang/mouth anchor in every camera,
// with prey-specific grip geometry so insects, mealworms, tiny jumpers and cannibal victims stay attached.
const QUAL=(()=>{
  try{
    const saved=+(localStorage.getItem('jtQ')||0)||0;
    const coarse=matchMedia('(pointer:coarse)').matches;
    const portrait=matchMedia('(orientation: portrait)').matches || innerHeight>innerWidth;
    const auto=coarse?(portrait?3:2):2;
    return Math.max(saved,auto);
  }catch(e){
    return 2;
  }
})(), RS=QUAL>=3?2:QUAL>=2?1.5:1, ICS=2;
const W=Math.round(640*RS),H=Math.round(360*RS), SUB=8; let TW=200, TD=90, TH=100;
class PB{constructor(w,h){this.w=Math.max(1,w|0);this.h=Math.max(1,h|0);this.d=new Uint32Array(this.w*this.h);}}
let B=null;
const _cc=new Map();
function col(hex){let c=_cc.get(hex);if(c===undefined){const n=parseInt(hex.slice(1),16);c=(0xff000000|((n&255)<<16)|(n&0xff00)|((n>>16)&255))>>>0;_cc.set(hex,c);}return c;}
function rgb(r,g,b,a=255){return (((a&255)<<24)|((b&255)<<16)|((g&255)<<8)|(r&255))>>>0;}
const cr=c=>c&255, cg=c=>(c>>>8)&255, cb=c=>(c>>>16)&255;
function mixc(a,b,t){return rgb(cr(a)+(cr(b)-cr(a))*t,cg(a)+(cg(b)-cg(a))*t,cb(a)+(cb(b)-cb(a))*t);}
function shd(c,f){return rgb(Math.min(255,cr(c)*f),Math.min(255,cg(c)*f),Math.min(255,cb(c)*f));}
function hash3(x,y,s){let h=Math.imul(x|0,374761393)^Math.imul(y|0,668265263)^Math.imul((s|0)+7,1442695041);h=Math.imul(h^(h>>>13),1274126177);h^=h>>>16;return (h>>>0)/4294967296;}
function rng(seed){let a=seed>>>0;return function(){a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return ((t^(t>>>14))>>>0)/4294967296;};}
const rand=Math.random, rr=(a,b)=>a+Math.random()*(b-a), clamp=(v,a,b)=>v<a?a:v>b?b:v, lerp=(a,b,t)=>a+(b-a)*t;
const pick=a=>a[Math.floor(Math.random()*a.length)];
// vectors
const v3=(x=0,y=0,z=0)=>({x,y,z}), vc=v=>({x:v.x,y:v.y,z:v.z});
const vsub=(a,b)=>v3(a.x-b.x,a.y-b.y,a.z-b.z), vadd=(a,b)=>v3(a.x+b.x,a.y+b.y,a.z+b.z), vmul=(a,s)=>v3(a.x*s,a.y*s,a.z*s);
const vlen=a=>Math.hypot(a.x,a.y,a.z), vdist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z), vdot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;
const vnorm=a=>{const l=vlen(a)||1;return v3(a.x/l,a.y/l,a.z/l);};
const hdist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
// ---- smooth noise ----
function vnz(x,y,s){const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi;const u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);const a=hash3(xi,yi,s),b=hash3(xi+1,yi,s),c=hash3(xi,yi+1,s),d=hash3(xi+1,yi+1,s);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v;}
function fbm(x,y,s){return vnz(x,y,s)*0.57+vnz(x*2.03,y*2.03,s+17)*0.29+vnz(x*4.1,y*4.1,s+31)*0.14;}
const sst=(a,b,x)=>{const t=Math.min(1,Math.max(0,(x-a)/(b-a)));return t*t*(3-2*t);};
// per-pixel volume lighting for shaded ellipsoids (key light from upper-left lamp)
let LIT=true,GLOSS=0.18;
function litc(c,u,v,r2,ca,sa){const sx=u*ca-v*sa,sy=u*sa+v*ca,nz=Math.sqrt(Math.max(0,1-r2));const d=-0.42*sx-0.62*sy+0.66*nz;
 let f=(0.5+0.62*Math.max(0,d))*(0.78+0.22*nz)+Math.max(0,0.25*sx+0.2*sy)*0.18;const sp=Math.max(0,-0.23*sx-0.34*sy+0.91*nz);const s2=sp*sp,s4=s2*s2,s8=s4*s4;const sh=s8*s8*s2*GLOSS*255;
 return rgb(Math.min(255,cr(c)*f+sh),Math.min(255,cg(c)*f+sh*0.97),Math.min(255,cb(c)*f+sh*0.9));}
// ---- raster ----
function pset(x,y,c){x|=0;y|=0;if(x<0||y<0||x>=B.w||y>=B.h)return;B.d[y*B.w+x]=c;}
function pblend(x,y,c,a){x|=0;y|=0;if(x<0||y<0||x>=B.w||y>=B.h||a<=0)return;const i=y*B.w+x,o=B.d[i],oa=o>>>24;
 if(oa===0){B.d[i]=(((a*255)&255)<<24|(c&0xffffff))>>>0;return;}
 B.d[i]=rgb(cr(o)+(cr(c)-cr(o))*a,cg(o)+(cg(c)-cg(o))*a,cb(o)+(cb(c)-cb(o))*a,Math.max(oa,a*255));}
function prect(x,y,w,h,c){let x0=Math.max(0,x|0),y0=Math.max(0,y|0),x1=Math.min(B.w,(x+w)|0),y1=Math.min(B.h,(y+h)|0);for(let j=y0;j<y1;j++){const r=j*B.w;for(let i=x0;i<x1;i++)B.d[r+i]=c;}}
function pell(cx,cy,rx,ry,c){let any=false;const y0=Math.floor(cy-ry),y1=Math.ceil(cy+ry);for(let y=y0;y<=y1;y++){const dy=(y+0.5-cy)/ry;if(dy<-1||dy>1)continue;const w=rx*Math.sqrt(1-dy*dy);const x0=Math.round(cx-w),x1=Math.round(cx+w);for(let x=x0;x<x1;x++){pset(x,y,c);any=true;}}if(!any)pset(cx,cy,c);}
function pellB(cx,cy,rx,ry,c,a){const y0=Math.floor(cy-ry),y1=Math.ceil(cy+ry);for(let y=y0;y<=y1;y++){const dy=(y+0.5-cy)/ry;if(dy<-1||dy>1)continue;const w=rx*Math.sqrt(1-dy*dy);for(let x=Math.round(cx-w);x<Math.round(cx+w);x++)pblend(x,y,c,a);}}
function pshade(cx,cy,rx,ry,ang,fn){rx=Math.max(rx,0.6);ry=Math.max(ry,0.6);const R=Math.max(rx,ry)+1,ca=Math.cos(ang),sa=Math.sin(ang);const rim=1-Math.min(0.6,1.3/Math.max(1,Math.min(rx,ry)));const rim2=rim*rim;let any=false;
 for(let y=Math.floor(cy-R);y<=Math.ceil(cy+R);y++)for(let x=Math.floor(cx-R);x<=Math.ceil(cx+R);x++){const dx=x+0.5-cx,dy=y+0.5-cy;const u=(dx*ca+dy*sa)/rx,v=(-dx*sa+dy*ca)/ry;const r2=u*u+v*v;if(r2>1)continue;let c=fn(u,v,r2,r2>rim2,x,y);if(c){if(LIT)c=litc(c,u,v,r2,ca,sa);pset(x,y,c);any=true;}}
 if(!any){const c=fn(0,0,0,false,cx|0,cy|0);if(c)pset(cx,cy,c);}}
function pline(x0,y0,x1,y1,t,c){const dx=x1-x0,dy=y1-y0;if(t>=2.6){const r=t/2,L=Math.hypot(dx,dy),n2=Math.max(1,Math.ceil(L/Math.max(0.8,r*0.45)));for(let i=0;i<=n2;i++)pell(x0+dx*i/n2,y0+dy*i/n2,r,r,c);return;}const n=Math.max(1,Math.ceil(Math.max(Math.abs(dx),Math.abs(dy))));const s=Math.max(1,Math.round(t)),h=(s-1)/2;for(let i=0;i<=n;i++){const x=Math.round(x0+dx*i/n-h),y=Math.round(y0+dy*i/n-h);if(s===1)pset(x,y,c);else prect(x,y,s,s,c);}}
function plineB(x0,y0,x1,y1,c,a){const dx=x1-x0,dy=y1-y0;const n=Math.max(1,Math.ceil(Math.max(Math.abs(dx),Math.abs(dy))));for(let i=0;i<=n;i++)pblend(Math.round(x0+dx*i/n),Math.round(y0+dy*i/n),c,a);}
function ppoly(pts,fn){let minY=1e9,maxY=-1e9;for(const p of pts){if(p[1]<minY)minY=p[1];if(p[1]>maxY)maxY=p[1];}
 minY=Math.max(0,Math.floor(minY));maxY=Math.min(B.h-1,Math.ceil(maxY));const n=pts.length,xs=[];
 for(let y=minY;y<=maxY;y++){const yc=y+0.5;xs.length=0;for(let i=0;i<n;i++){const a=pts[i],b=pts[(i+1)%n];if((a[1]<=yc&&b[1]>yc)||(b[1]<=yc&&a[1]>yc)){xs.push(a[0]+(yc-a[1])/(b[1]-a[1])*(b[0]-a[0]));}}
  xs.sort((p,q)=>p-q);for(let k=0;k+1<xs.length;k+=2){const x0=Math.max(0,Math.round(xs[k])),x1=Math.min(B.w,Math.round(xs[k+1]));for(let x=x0;x<x1;x++){const c=typeof fn==='number'?fn:fn(x,y);if(c)B.d[y*B.w+x]=c;}}}}
function ppolyB(pts,c,a){let minY=1e9,maxY=-1e9;for(const p of pts){minY=Math.min(minY,p[1]);maxY=Math.max(maxY,p[1]);}minY=Math.max(0,Math.floor(minY));maxY=Math.min(B.h-1,Math.ceil(maxY));const n=pts.length,xs=[];
 for(let y=minY;y<=maxY;y++){const yc=y+0.5;xs.length=0;for(let i=0;i<n;i++){const p=pts[i],q=pts[(i+1)%n];if((p[1]<=yc&&q[1]>yc)||(q[1]<=yc&&p[1]>yc))xs.push(p[0]+(yc-p[1])/(q[1]-p[1])*(q[0]-p[0]));}xs.sort((p,q)=>p-q);for(let k=0;k+1<xs.length;k+=2)for(let x=Math.round(xs[k]);x<Math.round(xs[k+1]);x++)pblend(x,y,c,a);}}
function blit(src,dx,dy){dx=Math.round(dx);dy=Math.round(dy);const x0=Math.max(0,dx),y0=Math.max(0,dy),x1=Math.min(B.w,dx+src.w),y1=Math.min(B.h,dy+src.h);const s=src.d,d=B.d;
 for(let y=y0;y<y1;y++){const sr=(y-dy)*src.w-dx,dr=y*B.w;for(let x=x0;x<x1;x++){const c=s[sr+x];const a=c>>>24;if(a===255)d[dr+x]=c;else if(a){const o=d[dr+x];if(!(o>>>24)){d[dr+x]=c;continue;}const t=a/255;d[dr+x]=rgb(cr(o)+(cr(c)-cr(o))*t,cg(o)+(cg(c)-cg(o))*t,cb(o)+(cb(c)-cb(o))*t);}}}}
// ---- projection ----
const cam={mode:1,k:1.35,ox:0,oy:0,fx:100,fy:30,fz:45};
function setupCam(c,mode){c.mode=mode;if(mode===1){c.k=1.35*RS;c.ox=W/2-((TW-TD)/2)*0.866*c.k;c.oy=H/2+(TH*c.k-(TW+TD)*0.5*c.k-SUB*c.k)/2+2*RS;}
 else if(mode===2||mode===4){c.k=2.4*RS;c.ox=W/2-TW/2*c.k;c.oy=H/2+(TH*c.k-TD*0.35*c.k-SUB*c.k)/2+4*RS;}
 else {c.k=5.5*RS;c.ox=W/2-c.fx*c.k;c.oy=H/2+30*RS-(c.fz*0.35*c.k-c.fy*c.k);}}
function P(x,y,z,c=cam){if(c.mode===4)return[c.ox+(TW-x)*c.k,c.oy+(TD-z)*0.35*c.k-y*c.k];if(c.mode===1)return[c.ox+(x-z)*0.866*c.k,c.oy+(x+z)*0.5*c.k-y*c.k];return[c.ox+x*c.k,c.oy+z*0.35*c.k-y*c.k];}
function Pv(v,c=cam){return P(v.x,v.y,v.z,c);}
function depthOf(x,y,z,c=cam){return c.mode===1?x+z:c.mode===4?TD-z:z;}
function invFloor(sx,sy,y=0,c=cam){if(c.mode===1){const a=(sx-c.ox)/(0.866*c.k),b=(sy-c.oy+y*c.k)/(0.5*c.k);return v3((a+b)/2,y,(b-a)/2);}if(c.mode===4)return v3(TW-(sx-c.ox)/c.k,y,TD-(sy-c.oy+y*c.k)/(0.35*c.k));return v3((sx-c.ox)/c.k,y,(sy-c.oy+y*c.k)/(0.35*c.k));}
function invPlane(sx,sy,axis,val,c=cam){ // axis 'z' or 'x' constant
 if(c.mode===1){if(axis==='z'){const x=(sx-c.ox)/(0.866*c.k)+val;return v3(x,(c.oy+(x+val)*0.5*c.k-sy)/c.k,val);}const z=val-(sx-c.ox)/(0.866*c.k);return v3(val,(c.oy+(val+z)*0.5*c.k-sy)/c.k,z);}
 if(axis==='z'){if(c.mode===4)return v3(TW-(sx-c.ox)/c.k,(c.oy+(TD-val)*0.35*c.k-sy)/c.k,val);return v3((sx-c.ox)/c.k,(c.oy+val*0.35*c.k-sy)/c.k,val);}return v3(val,0,0);}
function viewDir(c=cam){return c.mode===1?v3(0.7071,0,0.7071):c.mode===4?v3(0,0,-1):v3(0,0,1);}
function screenDX(f,c=cam){return c.mode===1?(f.x-f.z)*0.866:c.mode===4?-f.x:f.x;}
