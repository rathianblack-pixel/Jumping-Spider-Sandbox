// ================= v13 tested camera revamp =================
(function(){
 const _baseSetup=setupCam,_baseP=P,_basePv=Pv,_baseDepth=depthOf,_baseInvFloor=invFloor,_baseInvPlane=invPlane,_baseViewDir=viewDir,_baseScreenDX=screenDX;
 const _baseMakeSprite=makeSprite,_baseBoxed=boxed,_baseDrawPlat=drawPlat,_baseBuildBG=buildBG,_baseBuildFG=buildFG,_baseFrontWall=frontWall,_baseEntDepth=entDepth,_baseViewFor=viewFor,_baseCamKey=camKey,_baseGlassFx=glassFx,_baseLampPos=lampPos;
 function obs(c){return !!(c&&c._obs13);}
 function obsCopy(c,ox=c.ox,oy=c.oy){return {mode:c.mode,k:c.k,ox,oy,fx:c.fx,fy:c.fy,fz:c.fz,_obs13:1,_obsSign:c._obsSign,pa:c.pa,pb:c.pb,pd:c.pd,pe:c.pe};}
 function wallN(w){return w==='x0'?v3(-1,0,0):w==='xW'?v3(1,0,0):w==='z0'?v3(0,0,-1):v3(0,0,1);}
 function obsRaw(c,x,y,z){return [c.pa*x+c.pb*z,c.pd*x+c.pe*z-y];}
 function obsBounds(c){let mnx=1e9,mny=1e9,mxx=-1e9,mxy=-1e9;for(const x of [0,TW])for(const y of [-SUB,TH])for(const z of [0,TD]){const q=obsRaw(c,x,y,z);mnx=Math.min(mnx,q[0]);mxx=Math.max(mxx,q[0]);mny=Math.min(mny,q[1]);mxy=Math.max(mxy,q[1]);}return {mnx,mny,mxx,mxy};}
 function setObsCoeffs(c,sign){c._obs13=1;c._obsSign=sign;c.pa=sign;c.pb=-.55*sign;c.pd=.13*sign;c.pe=.34*sign;}
 function centerWhole(c){const b=obsBounds(c);c.ox=W*.47-(b.mnx+b.mxx)*.5*c.k;c.oy=H*.52-(b.mny+b.mxy)*.5*c.k;}
 function setupObserver(c,mode,sign,k){c.mode=mode;setObsCoeffs(c,sign);c.k=k;centerWhole(c);}
 setupCam=function(c,mode){
   c._obs13=0;
   if(mode===1)return _baseSetup(c,1);
   if(mode===2){setupObserver(c,2,1,1.60*RS);return;}
   if(mode===4){setupObserver(c,4,-1,1.60*RS);return;}
   if(mode===3){
     c.mode=3;setObsCoeffs(c,1);c.k=3.20*RS;c._wildZoom=1;
     let fx=Number.isFinite(c.fx)?c.fx:TW*.5,fy=Number.isFinite(c.fy)?c.fy:20,fz=Number.isFinite(c.fz)?c.fz:TD*.5;
     const t=(typeof cur==='function')?cur():null,sp=(G.sel&&t&&t.spiders.includes(G.sel))?G.sel:null,hp=sp&&sp.hunt&&sp.hunt.prey&&!sp.hunt.prey.owner?sp.hunt.prey:null;
     if(hp){fx=lerp(fx,hp.pos.x,.28);fy=lerp(fy,hp.pos.y,.18);fz=lerp(fz,hp.pos.z,.28);}
     const q=obsRaw(c,fx,fy,fz),ay=clamp(.684-(fy/TH)*.18,.50,.684);c.ox=W*.45-q[0]*c.k;c.oy=H*ay-q[1]*c.k;
     return;
   }
   return _baseSetup(c,mode);
 };
 P=function(x,y,z,c=cam){if(!obs(c))return _baseP(x,y,z,c);const q=obsRaw(c,x,y,z);return [c.ox+q[0]*c.k,c.oy+q[1]*c.k];};
 Pv=function(v,c=cam){return P(v.x,v.y,v.z,c);};
 depthOf=function(x,y,z,c=cam){if(!obs(c))return _baseDepth(x,y,z,c);return c.pd*x+c.pe*z;};
 invFloor=function(sx,sy,y=0,c=cam){if(!obs(c))return _baseInvFloor(sx,sy,y,c);const u=(sx-c.ox)/c.k,v=(sy-c.oy)/c.k+y,det=c.pa*c.pe-c.pb*c.pd||1e-6;return v3((u*c.pe-c.pb*v)/det,y,(c.pa*v-u*c.pd)/det);};
 invPlane=function(sx,sy,axis,val,c=cam){if(!obs(c))return _baseInvPlane(sx,sy,axis,val,c);const u=(sx-c.ox)/c.k,sv=(sy-c.oy)/c.k;if(axis==='z'){const z=val,x=(u-c.pb*z)/(Math.abs(c.pa)<1e-6?1e-6:c.pa),y=c.pd*x+c.pe*z-sv;return v3(x,y,z);}const x=val,z=(u-c.pa*x)/(Math.abs(c.pb)<1e-6?1e-6:c.pb),y=c.pd*x+c.pe*z-sv;return v3(x,y,z);};
 viewDir=function(c=cam){if(!obs(c))return _baseViewDir(c);return vnorm(v3(c.pd,0,c.pe));};
 screenDX=function(f,c=cam){if(!obs(c))return _baseScreenDX(f,c);return c.pa*f.x+c.pb*f.z;};
 frontWall=function(w,c=cam){if(!obs(c))return _baseFrontWall(w,c);return vdot(wallN(w),viewDir(c))>.52;};
 camKey=function(c){if(!obs(c))return _baseCamKey(c);return `o13_${c.mode}_${c._obsSign}_${Math.round(c.k*1000)}`;};
 makeSprite=function(c,pts,draw){if(!obs(c))return _baseMakeSprite(c,pts,draw);const c0=obsCopy(c,0,0);let mnx=1e9,mny=1e9,mxx=-1e9,mxy=-1e9;for(const p of pts){const q=P(p[0],p[1],p[2],c0);mnx=Math.min(mnx,q[0]);mny=Math.min(mny,q[1]);mxx=Math.max(mxx,q[0]);mxy=Math.max(mxy,q[1]);}const pad=3,pb=new PB(Math.max(1,Math.ceil(mxx-mnx)+pad*2),Math.max(1,Math.ceil(mxy-mny)+pad*2)),cp=obsCopy(c,-mnx+pad,-mny+pad),old=B;B=pb;draw(cp);B=old;return {pb,offX:mnx-pad,offY:mny-pad};};
 boxed=function(g,c,qx,qy,R,fn){if(!obs(c))return _baseBoxed(g,c,qx,qy,R,fn);const S=Math.min(1024,Math.ceil((2*R+2)/32)*32),L=EBX[S]||(EBX[S]=[]),n=EBN[S]=(EBN[S]||0)+1;let e=L[n-1];if(!e){const cv=document.createElement('canvas');cv.width=cv.height=S;const pb=new PB(S,S);e=L[n-1]={cv,cx:cv.getContext('2d',{willReadFrequently:true}),pb,id:new ImageData(new Uint8ClampedArray(pb.d.buffer),S,S),dirty:true};}const x0=Math.round(qx-S/2),y0=Math.round(qy-S/2);if(x0>W||y0>H||x0+S<0||y0+S<0)return;const old=B;B=e.pb;const d=e.pb.d;if(e.dirty)d.fill(0);fn(obsCopy(c,c.ox-x0,c.oy-y0));B=old;let y1=-1,y2=-1,xa=S,xb=-1;for(let y=0;y<S;y++){const o=y*S;let any=false;for(let x=0;x<S;x++)if(d[o+x]){any=true;if(x<xa)xa=x;break;}if(any){if(y1<0)y1=y;y2=y;for(let x=S-1;x>xb;x--)if(d[o+x]){xb=x;break;}}}e.dirty=y1>=0;if(y1<0)return;const bw=xb-xa+1,bh=y2-y1+1;e.cx.putImageData(e.id,0,0,xa,y1,bw,bh);g.drawImage(e.cv,xa,y1,bw,bh,x0+xa,y0+y1,bw,bh);return [x0+xa-2,y0+y1-2,bw+4,bh+4];};
 drawPlat=function(cp,d){if(!obs(cp))return _baseDrawPlat(cp,d);const D=DECOR[d.type],{x0,x1,z0,z1,h}=d,pp=(x,y,z)=>P(x,y,z,cp),sg=cp._obsSign,xf=sg>0?x1:x0,zf=sg>0?z1:z0;
   const fx=[pp(xf,h,z0),pp(xf,h,z1),pp(xf,0,z1),pp(xf,0,z0)];ppoly(fx,(sx,sy)=>{const q=invPlane(sx+.5,sy+.5,'x',xf,cp);return texFn(D.tex,'x',q.x,q.y,q.z,d,d.seed);});
   const fz=[pp(x0,h,zf),pp(x1,h,zf),pp(x1,0,zf),pp(x0,0,zf)];ppoly(fz,(sx,sy)=>{const q=invPlane(sx+.5,sy+.5,'z',zf,cp);return texFn(D.tex,'z',q.x,q.y,q.z,d,d.seed);});
   const top=[pp(x0,h,z0),pp(x1,h,z0),pp(x1,h,z1),pp(x0,h,z1)];ppoly(top,(sx,sy)=>{const q=invFloor(sx+.5,sy+.5,h,cp);return texFn(D.tex,'top',q.x,h,q.z,d,d.seed);});if(d.type==='bonsai')drawTreeTop(cp,d,true);
 };
 buildBG=function(t,c){if(!obs(c))return _baseBuildBG(t,c);const flat=t.decor.filter(d=>DECOR[d.type].kind==='flat'),PL=plats(t),SM=tankShadow(t);return makeSprite(c,boxPts(-2,-2,TW+2,TD+2,-SUB-5,TH+2),cp=>{const pp=(x,y,z)=>P(x,y,z,cp),sg=cp._obsSign,zb=sg>0?0:TD,xb=sg>0?0:TW,zf=sg>0?TD:0,xf=sg>0?TW:0,glass=col('#bfe4ef');
   ppolyB([pp(0,0,zb),pp(TW,0,zb),pp(TW,TH,zb),pp(0,TH,zb)],glass,.13);ppolyB([pp(xb,0,0),pp(xb,0,TD),pp(xb,TH,TD),pp(xb,TH,0)],glass,.15);
   ppoly([pp(0,0,0),pp(TW,0,0),pp(TW,0,TD),pp(0,0,TD)],(sx,sy)=>{const q=invFloor(sx+.5,sy+.5,0,cp);let cc=subTex(t.sub,q.x,q.z);const edge=Math.min(q.x,TW-q.x,q.z,TD-q.z);cc=shd(cc,(1-.45*shadowAt(SM,q.x,q.z))*(.74+.26*sst(0,7,edge)));for(const d of PL){const dx=Math.max(d.x0-q.x,0,q.x-d.x1),dz=Math.max(d.z0-q.z,0,q.z-d.z1),dd=Math.hypot(dx,dz);if(dd<7)cc=shd(cc,.55+.45*sst(0,7,dd));}return cc;});
   for(const d of flat)ppoly([pp(d.x0,0,d.z0),pp(d.x1,0,d.z0),pp(d.x1,0,d.z1),pp(d.x0,0,d.z1)],(sx,sy)=>{const q=invFloor(sx+.5,sy+.5,0,cp);return flatColor(d,q.x,q.z);});
   const layer=(sx,sy,axis,val)=>{const q=invPlane(sx+.5,sy+.5,axis,val,cp);const cc=subTex(t.sub,axis==='z'?q.x:q.z,0,q.y);return shd(cc,.72+(q.y+SUB)/SUB*.2);};
   ppoly([pp(0,0,zf),pp(TW,0,zf),pp(TW,-SUB,zf),pp(0,-SUB,zf)],(sx,sy)=>layer(sx,sy,'z',zf));ppoly([pp(xf,0,0),pp(xf,0,TD),pp(xf,-SUB,TD),pp(xf,-SUB,0)],(sx,sy)=>shd(layer(sx,sy,'x',xf),.86));
   const fr=col('#1d1b1a'),L=(a,b)=>pline(a[0],a[1],b[0],b[1],Math.max(1,cp.k*.78),fr);L(pp(0,TH,zb),pp(TW,TH,zb));L(pp(0,-SUB,zb),pp(0,TH,zb));L(pp(TW,-SUB,zb),pp(TW,TH,zb));L(pp(xb,TH,0),pp(xb,TH,TD));L(pp(xb,-SUB,0),pp(xb,TH,0));L(pp(xb,-SUB,TD),pp(xb,TH,TD));
 });};
 buildFG=function(c){if(!obs(c))return _baseBuildFG(c);return makeSprite(c,boxPts(-2,-2,TW+2,TD+2,-SUB-6,TH+14),cp=>{const pp=(x,y,z)=>P(x,y,z,cp),sg=cp._obsSign,zf=sg>0?TD:0,xf=sg>0?TW:0,glass=col('#d8f0f8'),fr=col('#1d1b1a'),fr2=col('#3a3836');const zface=[pp(0,-SUB,zf),pp(TW,-SUB,zf),pp(TW,TH,zf),pp(0,TH,zf)],xface=[pp(xf,-SUB,0),pp(xf,-SUB,TD),pp(xf,TH,TD),pp(xf,TH,0)];ppolyB(zface,glass,.055);ppolyB(xface,glass,.045);
   for(let i=0;i<3;i++){const x0=30+i*55,a=pp(x0,TH-5,zf),b=pp(x0+18,TH-5,zf),c2=pp(x0-12,10,zf),d2=pp(x0-30,10,zf);ppolyB([a,b,c2,d2],0xffffffff,.045+i%2*.02);}
   const L=(a,b,w,cc)=>pline(a[0],a[1],b[0],b[1],Math.max(1,cp.k*w),cc);L(pp(0,TH,zf),pp(TW,TH,zf),1.05,fr);L(pp(0,-SUB,zf),pp(0,TH,zf),1,fr);L(pp(TW,-SUB,zf),pp(TW,TH,zf),1,fr);L(pp(xf,TH,0),pp(xf,TH,TD),1.05,fr);L(pp(xf,-SUB,0),pp(xf,TH,0),1,fr);L(pp(xf,-SUB,TD),pp(xf,TH,TD),1,fr);
   ppoly([pp(0,-SUB,zf),pp(TW,-SUB,zf),pp(TW,-SUB-5,zf),pp(0,-SUB-5,zf)],fr);ppoly([pp(xf,-SUB,0),pp(xf,-SUB,TD),pp(xf,-SUB-5,TD),pp(xf,-SUB-5,0)],fr2);
   for(let x=10;x<TW;x+=10)plineB(...pp(x,TH,0),...pp(x,TH,TD),0xff2a2826,.27);for(let z=10;z<TD;z+=10)plineB(...pp(0,TH,z),...pp(TW,TH,z),0xff2a2826,.22);
 });};
 entDepth=function(t,e,c){if(!obs(c))return _baseEntDepth(t,e,c);const p=e.pos,s=e.surf;let dp=depthOf(p.x,p.y,p.z,c);if(s&&s.t==='wall'){const fd=vdot(wallN(s.w),viewDir(c));if(fd<-.58)return -1000+p.y*.01;if(fd>.58)return 1e4;}if(s&&(s.t==='plat'||s.t==='climb')){const d=platById(t,s.id);if(d)dp=Math.max(dp,depthOf(d.x,0,d.z,c)+.5);if(s.t==='climb'&&d)dp=depthOf(p.x,0,p.z,c)+.6;}if(s&&s.t==='perch')dp+=.5;if(!s||s.t==='air'||s.t==='silk'){const g=groundAt(t,p.x,p.z);if(g.p)dp=Math.max(dp,depthOf(g.p.x,0,g.p.z,c)+.5);}return dp;};
 viewFor=function(e,c){if(!obs(c))return _baseViewFor(e,c);const s=e.surf;if(s&&s.t==='wall'){const a=Pv(e.pos,c),b=Pv(vadd(e.pos,vmul(e.face,5)),c),ang=Math.atan2(b[1]-a[1],b[0]-a[0]),fd=vdot(wallN(s.w),viewDir(c));if(Math.abs(fd)<.50)return {view:'side',flip:screenDX(e.face,c)<0,ang,front:0};return {view:fd>0?'belly':'top',ang,front:fd,flip:screenDX(e.face,c)<0};}if(s&&(s.t==='climb'||s.t==='silk')){const a=Pv(e.pos,c),b=Pv(vadd(e.pos,vmul(e.face,5)),c),ang=Math.atan2(b[1]-a[1],b[0]-a[0]);return {view:'top',ang};}const f=flatDir(e),a=Pv(e.pos,c),b=Pv(vadd(e.pos,vmul(f,5)),c),ang=Math.atan2(b[1]-a[1],b[0]-a[0]),front=clamp(vdot(f,viewDir(c)),-1,1);return {view:'free',ang,front,flip:Math.cos(ang)<0};};
 glassFx=function(s,c){if(!obs(c))return _baseGlassFx(s,c);const sg=c._obsSign,zf=sg>0?TD:0,xf=sg>0?TW:0,zface=[P(0,-SUB,zf,c),P(TW,-SUB,zf,c),P(TW,TH,zf,c),P(0,TH,zf,c)],xface=[P(xf,-SUB,0,c),P(xf,-SUB,TD,c),P(xf,TH,TD,c),P(xf,TH,0,c)];s.save();s.globalCompositeOperation='screen';s.fillStyle='rgba(235,248,255,.025)';for(const f of [zface,xface]){s.beginPath();f.forEach((p,i)=>i?s.lineTo(p[0],p[1]):s.moveTo(p[0],p[1]));s.closePath();s.fill();}s.strokeStyle='rgba(255,245,220,.26)';s.lineWidth=Math.max(1,.35*RS);s.beginPath();s.moveTo(zface[3][0],zface[3][1]);s.lineTo(zface[2][0],zface[2][1]);s.moveTo(xface[3][0],xface[3][1]);s.lineTo(xface[2][0],xface[2][1]);s.stroke();s.restore();};
 lampPos=function(c){if(!obs(c))return _baseLampPos(c);return P(TW*.55,TH+2,TD*.5,c);};
 if($('cam2'))$('cam2').textContent='2 Observer';if($('cam3'))$('cam3').textContent='3 Follow';if($('cam4'))$('cam4').textContent='4 Reverse';
})();
// ================= end v13 camera revamp =================


// ================= v14 wall-plane orientation fix =================
(function(){
 const _v13ViewFor=viewFor;
 viewFor=function(e,c){
   const v=_v13ViewFor(e,c),s=e&&e.surf;
   // In the observer/follow/reverse cameras, a wall seen edge-on used the legacy
   // fixed horizontal side sprite. That sprite ignores `ang`, making a jumper
   // climbing vertically appear to stick out of the glass. Use the continuous
   // angle-aware pose instead so the body axis remains inside the wall plane.
   if(c&&c._obs13&&s&&s.t==='wall'&&v&&v.view==='side'){
     const a=Pv(e.pos,c),b=Pv(vadd(e.pos,vmul(e.face,5)),c);
     const ang=Math.atan2(b[1]-a[1],b[0]-a[0]);
     return {view:'free',ang,front:0,flip:Math.cos(ang)<0,wallPlane:true};
   }
   return v;
 };
})();
// ================= end v14 wall-plane orientation fix =================


// ================= v15 enclosure rendering + camera fit =================
(function(){
 const _setup15=setupCam,_camKey15=camKey,_buildBG15=buildBG,_buildFG15=buildFG,_tankClip15=tankClip,_viewFor15=viewFor,_entDepth15=entDepth,_glassFx15=glassFx;
 function fitScale15(){const T=tankType(cur());return Math.min(1.18,200/T.w,92/T.d,105/T.h);}
 function recenterObs15(c){let mnx=1e9,mny=1e9,mxx=-1e9,mxy=-1e9;for(const x of [0,TW])for(const y of [-SUB,TH])for(const z of [0,TD]){const q=[c.pa*x+c.pb*z,c.pd*x+c.pe*z-y];mnx=Math.min(mnx,q[0]);mxx=Math.max(mxx,q[0]);mny=Math.min(mny,q[1]);mxy=Math.max(mxy,q[1]);}c.ox=W*.47-(mnx+mxx)*.5*c.k;c.oy=H*.52-(mny+mxy)*.5*c.k;}
 setupCam=function(c,mode){setTankDims(G.tanks[G.cur]||JT15.activeTank);_setup15(c,mode);const fs=fitScale15();if(mode===1){c.k=1.35*RS*fs;c.ox=W/2-((TW-TD)/2)*.866*c.k;c.oy=H/2+(TH*c.k-(TW+TD)*.5*c.k-SUB*c.k)/2+2*RS;}else if((mode===2||mode===4)&&c._obs13){c.k=1.60*RS*fs;recenterObs15(c);}else if(mode===3&&c._obs13){c.k=3.20*RS*Math.max(.66,Math.min(1.05,fs));const t=cur(),sp=(G.sel&&t.spiders.includes(G.sel))?G.sel:t.spiders.find(x=>!x.owner);let fx=sp?sp.pos.x:TW*.5,fy=sp?sp.pos.y:TH*.25,fz=sp?sp.pos.z:TD*.5,hp=sp&&sp.hunt&&sp.hunt.prey&&!sp.hunt.prey.owner?sp.hunt.prey:null;if(hp){fx=lerp(fx,hp.pos.x,.25);fy=lerp(fy,hp.pos.y,.15);fz=lerp(fz,hp.pos.z,.25);}c.fx=fx;c.fy=fy;c.fz=fz;const q=[c.pa*fx+c.pb*fz,c.pd*fx+c.pe*fz-fy],ay=clamp(.684-(fy/TH)*.18,.50,.684);c.ox=W*.45-q[0]*c.k;c.oy=H*ay-q[1]*c.k;}}
 camKey=function(c){const T=tankType(cur()),base=_camKey15(c);return `${base}|${cur().tankType}|${T.w}x${T.d}x${T.h}`;};
 function ringPts15(y,n=36){const T=tankType(cur()),a=[];for(let i=0;i<n;i++){const q=i/n*Math.PI*2;a.push([T.w*.5+Math.cos(q)*T.w*.5,y,T.d*.5+Math.sin(q)*T.d*.5]);}return a;}
 function hull15(pts){const p=pts.map(q=>[q[0],q[1]]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);if(p.length<3)return p;const cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]),lo=[],hi=[];for(const q of p){while(lo.length>1&&cr(lo[lo.length-2],lo[lo.length-1],q)<=0)lo.pop();lo.push(q);}for(let i=p.length-1;i>=0;i--){const q=p[i];while(hi.length>1&&cr(hi[hi.length-2],hi[hi.length-1],q)<=0)hi.pop();hi.push(q);}lo.pop();hi.pop();return lo.concat(hi);}
 tankClip=function(s,c){if(!isRoundTank(cur()))return _tankClip15(s,c);const pts=[...ringPts15(-SUB,40),...ringPts15(TH,40)].map(p=>P(p[0],p[1],p[2],c)),h=hull15(pts);s.beginPath();h.forEach((p,i)=>i?s.lineTo(p[0],p[1]):s.moveTo(p[0],p[1]));s.closePath();s.clip();};
 buildBG=function(t,c){if(!isRoundTank(t))return _buildBG15(t,c);return withTankDims(t,()=>makeSprite(c,[...ringPts15(-SUB),...ringPts15(TH)],cp=>{const top=ringPts15(0).map(p=>P(...p,cp)),SM=tankShadow(t),PL=plats(t);ppoly(top,(sx,sy)=>{const q=invFloor(sx+.5,sy+.5,0,cp);if(!insideTankXZ(t,q.x,q.z,.2))return 0;let cc=subTex(t.sub,q.x,q.z);for(const d of PL){const dx=Math.max(d.x0-q.x,0,q.x-d.x1),dz=Math.max(d.z0-q.z,0,q.z-d.z1),dd=Math.hypot(dx,dz);if(dd<7)cc=shd(cc,.58+.42*sst(0,7,dd));}return shd(cc,1-.42*shadowAt(SM,q.x,q.z));});for(const d of t.decor)if(DECOR[d.type].kind==='flat')ppoly([P(d.x0,0,d.z0,cp),P(d.x1,0,d.z0,cp),P(d.x1,0,d.z1,cp),P(d.x0,0,d.z1,cp)],(sx,sy)=>{const q=invFloor(sx+.5,sy+.5,0,cp);return insideTankXZ(t,q.x,q.z,0)?flatColor(d,q.x,q.z):0;});const rb=ringPts15(-SUB),rt=ringPts15(0),glass=col('#bfe4ef');for(let i=0;i<rb.length;i++){const j=(i+1)%rb.length,a=rt[i],b=rt[j],aa=rb[i],bb=rb[j],mid=v3((a[0]+b[0])/2,0,(a[2]+b[2])/2),n=vnorm(v3(mid.x-TW*.5,0,mid.z-TD*.5)),fd=vdot(n,viewDir(cp));if(fd>.05){ppoly([P(...a,cp),P(...b,cp),P(...bb,cp),P(...aa,cp)],(sx,sy)=>shd(subTex(t.sub,mid.x,0,(TH+sy)*.02),.68));}else ppolyB([P(...a,cp),P(...b,cp),P(a[0],TH,a[2],cp),P(b[0],TH,b[2],cp)],glass,.012);}const fr=col('#1d1b1a');for(const y of [0,TH]){const r=ringPts15(y);for(let i=0;i<r.length;i++){const j=(i+1)%r.length,A=P(...r[i],cp),B2=P(...r[j],cp);pline(A[0],A[1],B2[0],B2[1],Math.max(1,cp.k*.55),fr);}}}));};
 buildFG=function(c){if(!isRoundTank(cur()))return _buildFG15(c);return makeSprite(c,[...ringPts15(-SUB-5),...ringPts15(TH+5)],cp=>{const top=ringPts15(TH),bot=ringPts15(-SUB),glass=col('#d8f0f8'),fr=col('#1d1b1a');for(let i=0;i<top.length;i++){const j=(i+1)%top.length,mid=v3((top[i][0]+top[j][0])/2,0,(top[i][2]+top[j][2])/2),n=vnorm(v3(mid.x-TW*.5,0,mid.z-TD*.5)),fd=vdot(n,viewDir(cp));if(fd>.05)ppolyB([P(...bot[i],cp),P(...bot[j],cp),P(...top[j],cp),P(...top[i],cp)],glass,.028);for(const y of [TH,-SUB]){const A=P(...(y===TH?top[i]:bot[i]),cp),B2=P(...(y===TH?top[j]:bot[j]),cp);pline(A[0],A[1],B2[0],B2[1],Math.max(1,cp.k*.72),fr);}if(i%6===0&&fd>.05){const A=P(...bot[i],cp),B2=P(...top[i],cp);pline(A[0],A[1],B2[0],B2[1],Math.max(1,cp.k*.45),fr);}}});};
 function radialNormal15(p){return vnorm(v3((p.x-TW*.5)/(TW*.5),0,(p.z-TD*.5)/(TD*.5)));}
 viewFor=function(e,c){if(!isRoundTank(cur())||!e?.surf||e.surf.t!=='wall')return _viewFor15(e,c);const a=Pv(e.pos,c),b=Pv(vadd(e.pos,vmul(e.face,5)),c),ang=Math.atan2(b[1]-a[1],b[0]-a[0]),fd=vdot(radialNormal15(e.pos),viewDir(c));if(Math.abs(fd)<.5)return {view:'free',ang,front:0,flip:Math.cos(ang)<0,wallPlane:true};return {view:fd>0?'belly':'top',ang,front:fd,flip:screenDX(e.face,c)<0};};
 entDepth=function(t,e,c){if(!isRoundTank(t)||!e?.surf||e.surf.t!=='wall')return _entDepth15(t,e,c);const fd=vdot(radialNormal15(e.pos),viewDir(c));if(fd<-.58)return -1000+e.pos.y*.01;if(fd>.58)return 1e4;return depthOf(e.pos.x,e.pos.y,e.pos.z,c);};
 glassFx=function(s,c){if(!isRoundTank(cur()))return _glassFx15(s,c);s.save();s.globalCompositeOperation='screen';const top=ringPts15(TH,48).map(p=>P(...p,c));s.strokeStyle='rgba(255,245,220,.25)';s.lineWidth=Math.max(1,.35*RS);s.beginPath();top.forEach((p,i)=>i?s.lineTo(p[0],p[1]):s.moveTo(p[0],p[1]));s.closePath();s.stroke();s.restore();};
})();
// ================= end v15 enclosure rendering =================



