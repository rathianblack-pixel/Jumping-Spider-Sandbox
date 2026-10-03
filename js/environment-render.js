// ---------- environment rendering ----------
function camKey(c){return c.mode===3?'3_'+Math.round(c.k*1000):c.mode+'_'+c.k;}
function makeSprite(c,pts,draw){const c0={mode:c.mode,k:c.k,ox:0,oy:0};let mnx=1e9,mny=1e9,mxx=-1e9,mxy=-1e9;for(const p of pts){const s=P(p[0],p[1],p[2],c0);mnx=Math.min(mnx,s[0]);mny=Math.min(mny,s[1]);mxx=Math.max(mxx,s[0]);mxy=Math.max(mxy,s[1]);}
 const pad=3;const pb=new PB(Math.ceil(mxx-mnx)+pad*2,Math.ceil(mxy-mny)+pad*2);const cp={mode:c.mode,k:c.k,ox:-mnx+pad,oy:-mny+pad};const old=B;B=pb;draw(cp);B=old;return {pb,offX:mnx-pad,offY:mny-pad};}
function boxPts(x0,z0,x1,z1,y0,y1){return [[x0,y0,z0],[x1,y0,z0],[x0,y0,z1],[x1,y0,z1],[x0,y1,z0],[x1,y1,z0],[x0,y1,z1],[x1,y1,z1]];}
function subTex(sub,x,z,y){const S=SUBS[sub];const C=S._c||(S._c=S.c.map(col));const zz=z+(y!==undefined?y*1.9:0);
 const n=fbm(x*0.11,zz*0.11,7);
 if(sub==='gravel'){const gs=2.4;const jx=x/gs+vnz(x*0.3,zz*0.3,3)*0.6,jz=zz/gs+vnz(x*0.3,zz*0.3,4)*0.6;const cx=Math.floor(jx),cz=Math.floor(jz);const hh=hash3(cx,cz,9);const lx=jx-cx-0.5,lz=jz-cz-0.5;const r=lx*lx+lz*lz;
  if(r>0.2)return shd(C[3],0.5+n*0.2);const pc=C[Math.floor(hh*4)];return shd(pc,(1.08-r*2.2+(lx<-0.05&&lz<-0.05?0.18:0))*(0.9+n*0.2));}
 let c=mixc(C[1],C[0],sst(0.25,0.7,n));const m2=fbm(x*0.03,zz*0.05,11);c=mixc(c,C[2],sst(0.55,0.85,m2)*0.5);
 const g0=vnz(x*2.7,zz*2.7,sub.length),g=g0<0.27?g0*0.33:g0>0.75?0.94+(g0-0.75)*0.24:0.5;if(g<0.09)c=mixc(c,C[3],0.75);else if(g>0.935)c=mixc(c,C[2],0.85);else if(g>0.9)c=shd(c,1.08);
 if(sub==='mossbed'){const m=fbm(x*0.32,zz*0.32,5);c=shd(c,0.72+m*0.55);if(vnz(x*1.6,zz*1.6,6)>0.8)c=col('#a6dc6c');}
 if(sub==='coco'&&hash3(Math.floor(x*0.5),Math.floor(zz*2.4),3)<0.07)c=mixc(c,col('#8a5a3a'),0.8);
 if(sub==='sand'||sub==='clay'){const hp=hash3(Math.floor(x/1.4),Math.floor(zz/1.4),8);if(hp>0.985)c=shd(C[3],0.9);}
 return shd(c,0.86+n*0.26);}
function texFn(tex,face,X,Y,Z,d,seed){let a,b;if(face==='top'){a=X;b=Z;}else if(face==='z'){a=X;b=Y;}else{a=Z;b=Y;}const sd=seed%997;
 const n=fbm(a*0.18,b*0.18,sd),h0=vnz(a*3.1,b*3.1,sd),h=h0<0.3?h0*0.33:h0>0.72?0.94+(h0-0.72)*0.21:0.5;let c;
 if(tex==='cork'){const m=fbm(a*0.33,b*0.33,sd+9);
  if(face==='top'){c=mixc(col('#5e3c26'),col('#a87a52'),n);if(h<0.12)c=shd(c,0.68);const ed=Math.min(X-d.x0,d.x1-X,Z-d.z0,d.z1-Z);if((ed<4&&m>0.48)||m>0.74)c=mixc(col('#3f6e2a'),col('#9ccc62'),vnz(a*2.2,b*2.2,3)*0.8+m*0.2);}
  else{const w=fbm(a*0.07,b*0.045,sd+3)*7;const r=Math.abs(Math.sin(a*0.72+w));c=mixc(col('#3e2717'),col('#a0714a'),Math.min(1,r*1.15)*0.7+n*0.38);if(r<0.16)c=mixc(col('#1e120a'),c,r*3);if(h<0.1)c=shd(c,0.72);else if(h>0.955)c=shd(c,1.22);
   if((Y>d.h-3.4&&m>0.4)||(r<0.32&&m>0.68)||(Y<2.5&&m>0.62))c=mixc(col('#3f6e2a'),col('#8cc05a'),vnz(a*2.4,b*2.4,4)*0.8+m*0.2);}}
 else if(tex==='drift'){const g=Math.sin(b*1.5+fbm(a*0.05,b*0.13,sd)*10);c=mixc(col('#6e604e'),col('#cbbda4'),Math.min(1,Math.max(0,0.45+g*0.22+n*0.4-0.18)));if(g>0.93)c=shd(c,0.74);if(h<0.05)c=shd(c,0.78);if(face==='top'&&fbm(a*0.4,b*0.4,sd+2)>0.72)c=mixc(c,col('#7aa04c'),0.55);}
 else if(tex==='stone'){c=mixc(col('#66625d'),col('#b0aba4'),Math.min(1,n*1.15));const v2=fbm(a*0.6,b*0.6,sd+4);c=shd(c,0.9+v2*0.2);if(h<0.07)c=shd(c,0.8);else if(h>0.965)c=shd(c,1.16);if(face==='top'&&fbm(a*0.45,b*0.45,sd+2)>0.73)c=mixc(c,col('#6f8f48'),0.55);}
 else if(tex==='slate'){if(face==='top'){c=mixc(col('#40444b'),col('#6a6f78'),n);if(fbm(a*0.5,b*0.5,sd+6)>0.7)c=shd(c,1.15);}else{const yy=b+fbm(a*0.09,0.5,sd)*3;const ly=yy/3.5,fr=ly-Math.floor(ly);c=mixc(col('#3c4046'),col('#6a6f78'),hash3(Math.floor(ly),Math.floor(a/7+fbm(a*0.1,ly,sd)*2),sd)*0.55+n*0.45);if(fr<0.14)c=mixc(col('#1d1f22'),c,fr*3);else if(fr<0.24)c=shd(c,1.2);}if(h<0.06)c=shd(c,0.85);}
 else if(tex==='pot'){if(face==='top'){const ed=Math.min(X-d.x0,d.x1-X,Z-d.z0,d.z1-Z);c=ed<2?col('#b9643a'):mixc(col('#2e1c10'),col('#4e3020'),n);}else{c=Y>d.h-2.5?col('#c8744a'):mixc(col('#9a4e2c'),col('#c06a40'),n);}}
 let fs=face==='top'?1.1:face==='z'?0.88:0.7;
 if(face!=='top'){const e=face==='z'?Math.min(X-d.x0,d.x1-X):Math.min(Z-d.z0,d.z1-Z);fs*=0.62+0.38*sst(0,6,e);fs*=0.66+0.34*sst(0,5,Y);if(Y>d.h-1.4)fs*=1.14;}
 else{const e=Math.min(X-d.x0,d.x1-X,Z-d.z0,d.z1-Z);fs*=0.85+0.15*sst(0,4,e);}
 return shd(c,fs);}
function drawPlat(cp,d){if(sdfDraw(cp,d)){d._sdf=1;if(d.type==='bonsai')drawTreeTop(cp,d,true);return;}d._sdf=0;const D=DECOR[d.type];const {x0,x1,z0,z1,h}=d;const pp=(x,y,z)=>P(x,y,z,cp);const zf=cp.mode===4?z0:z1;
 if(cp.mode===1){const f=[pp(x1,h,z0),pp(x1,h,z1),pp(x1,0,z1),pp(x1,0,z0)];ppoly(f,(sx,sy)=>{const q=invPlane(sx+0.5,sy+0.5,'x',x1,cp);return texFn(D.tex,'x',q.x,q.y,q.z,d,d.seed);});}
 const fz=[pp(x0,h,zf),pp(x1,h,zf),pp(x1,0,zf),pp(x0,0,zf)];ppoly(fz,(sx,sy)=>{const q=invPlane(sx+0.5,sy+0.5,'z',zf,cp);return texFn(D.tex,'z',q.x,q.y,q.z,d,d.seed);});
 const top=[pp(x0,h,z0),pp(x1,h,z0),pp(x1,h,z1),pp(x0,h,z1)];ppoly(top,(sx,sy)=>{const q=invFloor(sx+0.5,sy+0.5,h,cp);return texFn(D.tex,'top',q.x,h,q.z,d,d.seed);});
 if(d.type==='bonsai')drawTreeTop(cp,d,true);}
function drawTreeTopOld(cp,d,bonsai){const k=cp.k;const by=bonsai?d.h:0;const base=P(d.x,by,d.z,cp);const R=rng(d.seed);const trunk=col('#6a4a32'),trunk2=col('#4a3222');const top=bonsai?DECOR.bonsai.ph-d.h:DECOR.tree.h;
 let px=base[0],py=base[1];const n=12;let lx=0;for(let i=1;i<=n;i++){const t=i/n;const x=base[0]+Math.sin(t*3+d.seed%5)*k*(bonsai?4:3),y=base[1]-t*top*k*0.8;pline(px,py,x,y,Math.max(1,k*(bonsai?2.4:3)*(1-t*0.6)),i%3?trunk:trunk2);px=x;py=y;}
 for(const b of d.blobs){const c=P(d.x+b.bx,b.by,d.z+b.bz,cp);pshade(c[0],c[1],b.r*k,b.r*k*0.75,0,(u,v,r2,rim,x,y)=>{const hh=hash3(x>>1,y>>1,d.seed);if(rim&&hh<0.5)return 0;const l=-u*0.5-v*0.7;let cc=l>0.3?col('#8cc95a'):l>-0.2?col('#5f9a3e'):col('#3f6e2a');if(hh<0.12)cc=col('#2f5a22');if(hh>0.92)cc=col('#a6dc6c');return cc;});}
 if(!bonsai)for(let i=0;i<6;i++){const b=d.blobs[i%d.blobs.length];const c=P(d.x+b.bx*0.6,b.by-2,d.z,cp);pline(px,py,c[0],c[1],Math.max(1,k*1.2),trunk);}}
function drawPlantOld(cp,d){const D=DECOR[d.type];const k=cp.k;const R=rng(d.seed);
 if(d.type==='fern'){for(const f of d.fronds){const b=P(d.x,0,d.z+f.dz,cp);let px=b[0],py=b[1];const N=Math.max(6,Math.round(f.L*k/2));const g1=col('#4f8a35'),g2=col('#6fae48'),g3=col('#3a6a28');
  for(let i=1;i<=N;i++){const t=i/N;const ang=f.a*(0.6+t*0.8);const x=b[0]+Math.sin(ang)*f.L*t*k,y=b[1]-Math.cos(ang)*f.L*t*k+t*t*Math.abs(Math.sin(f.a))*f.L*0.4*k;pline(px,py,x,y,Math.max(1,k*0.5),g3);
   const ll=(1-t*0.7)*4.5*k;const nx=Math.cos(ang),ny=Math.sin(ang);if(i%2===0){{const ca_=mixc(i%4?g1:g2,0xffc8e890,t*0.3),cb_=shd(i%4?g2:g1,0.8+t*0.2);for(let q=0;q<3;q++){const w=(1-q/3);pline(x,y,x+nx*ll*w,y+(ny*ll-ll*0.4)*w,Math.max(1,k*0.45*(1+q*0.4)),q?ca_:shd(ca_,0.75));pline(x,y,x-nx*ll*w,y+(-ny*ll-ll*0.4)*w,Math.max(1,k*0.45*(1+q*0.4)),q?cb_:shd(cb_,0.75));}}}px=x;py=y;}}}
 else if(D.attract){const stem=col('#4f8a35');const fc=col(D.fc),fc2=col(D.fc2);for(const hd of d.heads){const b=P(d.x+hd.hx*0.3,0,d.z+hd.hz,cp),t=P(d.x+hd.hx,hd.hh,d.z+hd.hz,cp);pline(b[0],b[1],t[0],t[1],Math.max(1,k*0.4),stem);
   const m=[(b[0]+t[0])/2,(b[1]+t[1])/2];pell(m[0]+k*1.5,m[1],k*1.6,k*0.6,col('#6fae48'));
   if(d.type==='lav'){for(let i=0;i<6;i++)pell(t[0]+(i%2?k*0.5:-k*0.5),t[1]+i*k*1.1-k*5,k*0.8,k*0.7,i%2?fc:fc2);}
   else{for(let i=0;i<6;i++){const a=i/6*6.283;pell(t[0]+Math.cos(a)*k*1.5,t[1]+Math.sin(a)*k*0.9,k*1.1,k*0.8,fc);}pell(t[0],t[1],k*0.8,k*0.6,fc2);}}}
 else if(d.type==='grass'){for(const bl of d.blades){const b=P(d.x+bl.bx,0,d.z+bl.bz,cp);let px=b[0],py=b[1];const N=10;const c=hash3(bl.bx*10|0,0,d.seed)<0.5?col('#6aa04f'):col('#8bbf5a');for(let i=1;i<=N;i++){const t=i/N;const x=b[0]+bl.bend*t*t*k,y=b[1]-bl.L*t*k;pline(px,py,x,y,Math.max(1,k*0.9*(1-t*0.6)),mixc(shd(c,0.5),mixc(c,0xffd8f0a0,0.25),t));px=x;py=y;}}}
 else if(d.type==='succ'){const b=P(d.x,0,d.z,cp);for(let r=2;r>=0;r--){const n=7-r;for(let i=0;i<n;i++){const a=i/n*6.283+r;const lx=b[0]+Math.cos(a)*(r+1)*2.6*k,ly=b[1]-k*2-Math.sin(a)*(r+1)*1.0*k-(2-r)*2*k;pshade(lx,ly,2.8*k,1.3*k,a*0.3,(u,v,r2,rim)=>rim?col('#4a7a5e'):(u>0.6?col('#d98fa0'):v<0?col('#a8d8b8'):col('#7fb894')));}}}
 else if(d.type==='shroom'){const pts=[[-4,0,7],[2,1,11],[5,-1,6]];for(const [dx,dz,hh] of pts){const b=P(d.x+dx,0,d.z+dz,cp),t=P(d.x+dx,hh,d.z+dz,cp);pline(b[0],b[1],t[0],t[1],Math.max(1,k*1.2),col('#e8dcc4'));
   pshade(t[0],t[1],k*3.2,k*1.8,0,(u,v,r2,rim,x,y)=>v>0.3?0:(rim?col('#2a6a7a'):hash3(x,y,d.seed)<0.12?col('#c8fff6'):col('#3fa8b8')));}}
 else if(d.type==='tree')drawTreeTop(cp,d,false);}
function flatColor(d,x,z){const dx=(x-d.x)/(d.w/2),dz=(z-d.z)/(d.d/2);const r=Math.hypot(dx,dz);
 if(d.type==='moss'){const n=fbm(x*0.25,z*0.25,d.seed%997);if(r+n*0.45>1.12)return 0;const f=fbm(x*0.7,z*0.7,d.seed%997+1),h=vnz(x*2.2,z*2.2,d.seed%997);let c=mixc(col('#2f5a22'),col('#8cc05a'),f);if(h>0.78)c=col('#b4e47a');else if(h<0.22)c=shd(c,0.7);return shd(c,0.75+0.35*(1-r));}
 if(d.type==='litter'){if(r>1)return 0;const cx=Math.floor(x/5),cz=Math.floor(z/5);const h=hash3(cx,cz,d.seed);if(h<0.25)return 0;const lx=(x/5-cx-0.5)*2,lz=(z/5-cz-0.5)*2;const a=h*6.28;const u=lx*Math.cos(a)+lz*Math.sin(a),v=-lx*Math.sin(a)+lz*Math.cos(a);if(u*u+v*v*4>1)return 0;
  const cs=['#8a5a2a','#a8692e','#6a4422','#b98a3a','#7a4a2a'];let c=col(cs[Math.floor(h*97)%5]);if(Math.abs(v)<0.08)c=shd(c,0.7);return c;}
 if(d.type==='dish'){if(r>1)return 0;if(r>0.78)return r>0.92?col('#8a8a8a'):col('#d8d8d4');const h=hash3(Math.floor(x),Math.floor(z),3);return (dx<-0.2&&dz<-0.2&&h<0.4)?col('#b8e4f2'):col('#4f9ec2');}
 if(d.type==='pebbles'){if(r>1)return 0;const g=3.4;const cx=Math.floor(x/g),cz=Math.floor(z/g);const h=hash3(cx,cz,d.seed);if(h<0.35)return 0;const lx=(x/g-cx-0.5)*2,lz=(z/g-cz-0.5)*2;if(lx*lx+lz*lz>0.8)return 0;const cs=['#9a948c','#c8c0b4','#7a746c','#b0a08a','#e0d8cc'];let c=col(cs[Math.floor(h*53)%5]);if(lx<-0.2&&lz<-0.2)c=shd(c,1.2);return c;}
 return 0;}
function buildBG(t,c){const flat=t.decor.filter(d=>DECOR[d.type].kind==='flat');
 const PL=plats(t);const SM=tankShadow(t);return makeSprite(c,boxPts(-2,-2,TW+2,TD+2,-SUB-5,TH+2),cp=>{const pp=(x,y,z)=>P(x,y,z,cp);const glass=col('#bfe4ef');const zb=cp.mode===4?TD:0,zf=cp.mode===4?0:TD;
  // back walls
  ppolyB([pp(0,0,zb),pp(TW,0,zb),pp(TW,TH,zb),pp(0,TH,zb)],glass,0.13);if(cp.mode===1)ppolyB([pp(0,0,0),pp(0,0,TD),pp(0,TH,TD),pp(0,TH,0)],glass,0.18);
  // floor
  ppoly([pp(0,0,0),pp(TW,0,0),pp(TW,0,TD),pp(0,0,TD)],(sx,sy)=>{const q=invFloor(sx+0.5,sy+0.5,0,cp);let c=subTex(t.sub,q.x,q.z);c=shd(c,(1-0.45*shadowAt(SM,q.x,q.z))*(0.74+0.26*sst(0,7,Math.min(cp.mode===4?TD-q.z:q.z,cp.mode===1?q.x:99,TW-q.x,cp.mode===4?q.z+4:TD-q.z+4))));for(const d of PL){const dx=Math.max(d.x0-q.x,0,q.x-d.x1),dz=Math.max(d.z0-q.z,0,q.z-d.z1);const dd=Math.hypot(dx,dz);if(dd<7)c=shd(c,0.55+0.45*sst(0,7,dd));}return c;});
  for(const d of flat){ppoly([pp(d.x0,0,d.z0),pp(d.x1,0,d.z0),pp(d.x1,0,d.z1),pp(d.x0,0,d.z1)],(sx,sy)=>{const q=invFloor(sx+0.5,sy+0.5,0,cp);return flatColor(d,q.x,q.z);});}
  // substrate cross-section through front glass
  const layer=(sx,sy,axis,val)=>{const q=invPlane(sx+0.5,sy+0.5,axis,val,cp);const c=subTex(t.sub,axis==='z'?q.x:q.z,0,q.y);return shd(c,0.72+(q.y+SUB)/SUB*0.2);};
  ppoly([pp(0,0,zf),pp(TW,0,zf),pp(TW,-SUB,zf),pp(0,-SUB,zf)],(sx,sy)=>layer(sx,sy,'z',zf));
  if(cp.mode===1)ppoly([pp(TW,0,0),pp(TW,0,TD),pp(TW,-SUB,TD),pp(TW,-SUB,0)],(sx,sy)=>shd(layer(sx,sy,'x',TW),0.85));
  const fr=col('#1d1b1a');const L=(a,b)=>pline(a[0],a[1],b[0],b[1],Math.max(1,cp.k*0.9),fr);
  L(pp(0,TH,zb),pp(TW,TH,zb));L(pp(0,-SUB,zb),pp(0,TH,zb));L(pp(TW,-SUB,zb),pp(TW,TH,zb));if(cp.mode===1){L(pp(0,TH,0),pp(0,TH,TD));L(pp(0,-SUB,TD),pp(0,TH,TD));}});}
function buildFG(c){return makeSprite(c,boxPts(-2,-2,TW+2,TD+2,-SUB-6,TH+14),cp=>{const pp=(x,y,z)=>P(x,y,z,cp);const ZF=cp.mode===4?0:TD;const glass=col('#d8f0f8'),fr=col('#1d1b1a'),fr2=col('#3a3836');
  const faces=cp.mode===1?[[pp(TW,-SUB,0),pp(TW,-SUB,ZF),pp(TW,TH,ZF),pp(TW,TH,0)],[pp(0,-SUB,ZF),pp(TW,-SUB,ZF),pp(TW,TH,ZF),pp(0,TH,ZF)]]:[[pp(0,-SUB,ZF),pp(TW,-SUB,ZF),pp(TW,TH,ZF),pp(0,TH,ZF)]];
  for(const f of faces)ppolyB(f,glass,0.07);
  // reflections
  for(let i=0;i<3;i++){const x0=30+i*55;const a=pp(x0,TH-5,ZF),b=pp(x0+18,TH-5,ZF),c2=pp(x0-12,10,ZF),d2=pp(x0-30,10,ZF);ppolyB([a,b,c2,d2],0xffffffff,0.05+i%2*0.03);}
  const L=(a,b,w,c)=>pline(a[0],a[1],b[0],b[1],Math.max(1,cp.k*w),c);
  L(pp(0,TH,ZF),pp(TW,TH,ZF),1.2,fr);L(pp(0,-SUB,ZF),pp(0,TH,ZF),1.1,fr);L(pp(TW,-SUB,ZF),pp(TW,TH,ZF),1.1,fr);
  if(cp.mode===1){L(pp(TW,TH,0),pp(TW,TH,ZF),1.2,fr);L(pp(TW,-SUB,0),pp(TW,TH,0),1.1,fr);L(pp(0,TH,0),pp(TW,TH,0),1.0,fr2);L(pp(0,TH,0),pp(0,TH,ZF),1.0,fr2);
   ppoly([pp(TW,-SUB,0),pp(TW,-SUB,ZF),pp(TW,-SUB-5,ZF),pp(TW,-SUB-5,0)],fr2);}
  ppoly([pp(0,-SUB,ZF),pp(TW,-SUB,ZF),pp(TW,-SUB-5,ZF),pp(0,-SUB-5,ZF)],fr);
  // mesh lid hint
  for(let x=10;x<TW;x+=10)plineB(...pp(x,TH,0),...pp(x,TH,TD),0xff2a2826,0.35);
  // lamp
  const lp=cp.mode===1?pp(TW*0.55,TH+2,TD*0.5):pp(TW*0.5,TH+2,TD*0.12);});}
function buildRoom(mode){const pb=new PB(W,H);const old=B;B=pb;const wood=['#5a3a24','#4e3220','#63412a','#553722'].map(col);
 for(let x=0;x<W;x+=26){const c=wood[(x/26)%4|0];prect(x,0,26,H,c);prect(x,0,1,H,col('#3a2416'));for(let y=0;y<H;y+=3)if(hash3(x,y,1)<0.25)prect(x+3+hash3(x,y,2)*20,y,4,1,shd(c,0.9));}
 // window (transparent hole)
 const wx=24,wy=26,ww=120,wh=110;for(let y=wy;y<wy+wh;y++)for(let x=wx;x<wx+ww;x++)B.d[y*W+x]=0;prect(wx-5,wy-5,ww+10,5,col('#d8c8a8'));prect(wx-5,wy+wh,ww+10,6,col('#d8c8a8'));prect(wx-5,wy,5,wh,col('#d8c8a8'));prect(wx+ww,wy,5,wh,col('#d8c8a8'));prect(wx+ww/2-2,wy,4,wh,col('#d8c8a8'));prect(wx,wy+wh/2-2,ww,4,col('#d8c8a8'));
 // shelf with plant & mug
 prect(500,92,120,6,col('#7a5232'));prect(500,98,120,3,col('#3a2416'));prect(520,70,22,22,col('#b5603a'));prect(518,68,26,5,col('#c8744a'));for(let i=0;i<9;i++)pline(531,68,515+i*4,40+hash3(i,1,1)*14,2,i%2?col('#5f9a3e'):col('#7aad4c'));
 prect(570,76,16,16,col('#e8e0d0'));prect(586,80,5,8,col('#e8e0d0'));prect(572,78,12,3,col('#6a4a32'));prect(596,62,8,30,col('#4a6a9a'));prect(605,58,8,34,col('#9a4a3a'));
 // desk
 const dy=mode===1?300:338;prect(0,dy,W,H-dy,col('#7a5232'));prect(0,dy,W,3,col('#94603a'));for(let y=dy+5;y<H;y+=7)prect(0,y,W,1,col('#6a4428'));
 B=old;return pb;}
function roughen(pb,seed,R,amt){const w=pb.w,h=pb.h,d=pb.d,N=w*h;const ds=new Uint8Array(N);for(let i=0;i<N;i++)ds[i]=(d[i]>>>24)?250:0;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x;if(!ds[i])continue;let m=ds[i];m=Math.min(m,x>0?ds[i-1]+1:1,y>0?ds[i-w]+1:1);ds[i]=m;}
 for(let y=h-1;y>=0;y--)for(let x=w-1;x>=0;x--){const i=y*w+x;if(!ds[i])continue;let m=ds[i];m=Math.min(m,x<w-1?ds[i+1]+1:1,y<h-1?ds[i+w]+1:1);ds[i]=m;}
 const fq=1/(R*0.9);for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x;const dd=ds[i];if(!dd||dd>R)continue;const n=fbm(x*fq,y*fq,seed);if(dd<(n-0.35)*R*amt*1.6){d[i]=0;continue;}if(dd<=Math.max(1.5,R*0.22))d[i]=shd(d[i],0.62+0.38*dd/Math.max(1.5,R*0.22));}}
// ================= v3: GPU signed-distance decor =================
const SOFTGL=(()=>{try{if(localStorage.getItem('jtForceGPU'))return false;const c=document.createElement('canvas');const g=c.getContext('webgl');if(!g)return true;const e=g.getExtension('WEBGL_debug_renderer_info');const r=e?String(g.getParameter(e.UNMASKED_RENDERER_WEBGL)):'';const lc=g.getExtension('WEBGL_lose_context');if(lc)lc.loseContext();return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(r);}catch(e){return true;}})();
const SDFT={cork:-1,drift:2,stone:3,slate:4,pot:5};
const SDFS=`precision highp float;
uniform vec2 uRes,uOff,uCen;uniform float uSS,uK,uMode,uRot,uType,uSeed,uTW,uTD;uniform vec3 uDim,uLamp,uBmin,uBmax;
float h31(vec3 p){p=fract(p*vec3(.1031,.1030,.0973));p+=dot(p,p.yxz+33.33);return fract((p.x+p.y)*p.z);}
float n3(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(mix(h31(i),h31(i+vec3(1.,0.,0.)),f.x),mix(h31(i+vec3(0.,1.,0.)),h31(i+vec3(1.,1.,0.)),f.x),f.y),mix(mix(h31(i+vec3(0.,0.,1.)),h31(i+vec3(1.,0.,1.)),f.x),mix(h31(i+vec3(0.,1.,1.)),h31(i+vec3(1.,1.,1.)),f.x),f.y),f.z);}
float fb(vec3 p){return n3(p)*.64+n3(p*2.03+7.1)*.36;}
float sq(vec3 q,vec3 e,float pw){vec3 a=abs(q)/e;float f=pow(pow(a.x,pw)+pow(a.y,pw)+pow(a.z,pw),1./pw);return (f-1.)*min(e.x,min(e.y,e.z));}
float sbox(vec3 p,vec3 b){vec3 q=abs(p)-b;return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.);}
vec3 toL(vec3 w){vec3 p=vec3(w.x-uCen.x,w.y,w.z-uCen.y);return uRot>.5?vec3(p.z,p.y,-p.x):p;}
float mapL(vec3 p){float W=uDim.x*.5,Dd=uDim.z*.5,Hh=uDim.y;vec3 sp=p+uSeed*7.;float d;
 if(uType<.5){
  float ex=W-2.4*n3(vec3(p.z*.3,p.y*.3,uSeed*3.));
  d=sq(p,vec3(ex,Hh,Dd),4.);
  float r=1.-abs(sin(p.x*.5+fb(sp*.12)*6.));d+=r*r*.8+(fb(sp*.35)-.5)*1.3;
  float inn=sq(p-vec3(0.,-1.,0.),vec3(W+4.,Hh*.62,Dd*.62),4.);d=max(d,-inn);
 }else if(uType<1.5){
  float ang=atan(p.z,p.x);float rr=length(p.xz/vec2(W,Dd));
  float taper=1.+.1*(1.-clamp(p.y/Hh,0.,1.));
  float fur=abs(sin(ang*6.+fb(vec3(ang*1.5,p.y*.06,uSeed))*4.));
  float rad=taper*(1.-.08*(1.-fur)-.05*fb(sp*.3));
  d=(rr-rad)*min(W,Dd);
  float top=Hh-3.*fb(vec3(cos(ang)*1.5,sin(ang)*1.5,uSeed*2.))+.6*rr;
  d=max(d,p.y-top);
 }else if(uType<2.5){
  float xn=clamp(p.x/W,-1.,1.);float r=Dd*.78*(1.-.22*xn*xn)+.5*sin(xn*9.+uSeed);
  float yc=mix(r*.55,Hh-r,1.-xn*xn);float zc=sin(xn*2.2+uSeed)*(Dd-r)*.9;
  float sl=abs((Hh-r-r*.55)*2.*xn/W);
  vec2 q=vec2(p.y-yc,p.z-zc);float ang=atan(q.x,q.y);
  d=(length(q)-r)/sqrt(1.+sl*sl);
  float g=abs(sin(ang*6.+p.x*.08+fb(vec3(p.x*.06,ang*.8,uSeed))*5.));d+=(1.-g)*(1.-g)*.5;
  d=max(d,abs(p.x)-W);
 }else if(uType<3.5){
  d=sq(p,vec3(W,Hh,Dd),2.5)+(fb(sp*.22)-.5)*1.3;
 }else if(uType<4.5){
  d=1e3;float hh=Hh/3.;
  for(int i=0;i<3;i++){float fi=float(i);vec2 c=vec2(sin(uSeed+fi*2.1)*2.4,cos(uSeed*1.3+fi*1.7)*1.8)*(fi>0.?1.:.3);float th=sin(uSeed*.7+fi*1.3)*.28;
   vec2 q=p.xz-c;q=vec2(q.x*cos(th)-q.y*sin(th),q.x*sin(th)+q.y*cos(th));
   float ch=(n3(vec3(q*.32,uSeed+fi*5.))-.35)*2.6;
   vec3 ext=vec3(W-1.-fi*1.7-ch,hh*.5-.3,Dd-1.-fi*1.4-ch);
   float b=sbox(vec3(q.x,p.y-(fi+.5)*hh,q.y),max(ext-.5,vec3(.5)))-.5;
   d=min(d,b);}
 }else{
  float R=W-.8;float ry=R*(.8+.2*clamp(p.y/Hh,0.,1.));float l=length(p.xz);
  d=max(l-ry,max(-p.y,p.y-Hh));
  float ring=length(vec2(l-(R+.2),p.y-(Hh-.9)))-1.1;d=min(d,ring);
  float cut=max(l-(R-1.3),Hh-1.4-p.y);d=max(d,-cut);
 }
 return max(d,-p.y);}
float map(vec3 w){return mapL(toL(w));}
vec3 nrm(vec3 p){vec2 e=vec2(.1,-.1);return normalize(e.xyy*map(p+e.xyy)+e.yyx*map(p+e.yyx)+e.yxy*map(p+e.yxy)+e.xxx*map(p+e.xxx));}
vec3 albedo(vec3 w,vec3 n,out float spec){vec3 p=toL(w);vec3 sp=p+uSeed*7.;vec3 c;spec=.08;
 if(uType<1.5){
  float r=abs(sin((uType<.5?p.x*.5:atan(p.z,p.x)*6.)+fb(sp*.12)*6.));float m=fb(sp*.5);
  c=mix(vec3(.16,.10,.06),vec3(.50,.35,.23),smoothstep(.05,.95,r)*(.55+.55*m));
  c=mix(c,vec3(.66,.50,.35),smoothstep(.72,.95,fb(sp*1.4))*.55);
  if(uType>.5&&n.y>.6){float rr=length(p.xz/vec2(uDim.x*.5,uDim.z*.5));c=mix(c,mix(vec3(.52,.36,.22),vec3(.32,.2,.12),.5+.5*sin(rr*28.)),smoothstep(.9,.6,rr));}
  float moss=smoothstep(.6,.74,fb(sp*.16+3.))*smoothstep(.45,.9,n.y);c=mix(c,vec3(.22,.40,.12)*(.7+.7*fb(sp*2.2)),moss);}
 else if(uType<2.5){float g=sin(p.x*.22+fb(vec3(p.x*.04,p.y*.4,p.z*.4)+uSeed)*9.);c=mix(vec3(.40,.36,.31),vec3(.80,.75,.66),.55+.45*g);c*=.85+.3*fb(sp*.6);
  c=mix(c,vec3(.25,.21,.17),smoothstep(.7,.9,fb(sp*vec3(.1,1.2,1.2)))*.6);spec=.14;}
 else if(uType<3.5){c=mix(vec3(.36,.35,.33),vec3(.70,.68,.64),fb(sp*.3));c*=.86+.28*h31(floor(sp*2.3));
  c=mix(c,vec3(.62,.66,.42),smoothstep(.68,.8,fb(sp*.25+9.))*.6);spec=.18;}
 else if(uType<4.5){c=mix(vec3(.19,.21,.24),vec3(.38,.41,.46),fb(sp*vec3(.25,1.4,.25)));c*=.88+.12*sin(p.y*6.);if(n.y>.7)c*=1.15;c=mix(c,vec3(.5,.55,.48),smoothstep(.72,.85,fb(sp*.3+4.))*.4);spec=.4;}
 else{float l=length(p.xz);if(p.y>uDim.y-1.7&&l<uDim.x*.5-1.9){c=vec3(.20,.13,.08)*(.65+.7*h31(floor(sp*3.)));spec=0.;}
  else{c=mix(vec3(.50,.22,.11),vec3(.80,.44,.25),.5+.4*n.x-.2*n.z)*(.9+.2*fb(sp*.5));if(abs(p.y-(uDim.y-.9))<1.2)c*=1.08;spec=.12;}}
 return c;}
void main(){vec3 col=vec3(0.);float cov=0.;
 vec3 vd=uMode<1.5?normalize(vec3(1.,1.,1.)):uMode<3.5?normalize(vec3(0.,.35,1.)):normalize(vec3(0.,.35,-1.));
 vec3 key=normalize(uMode>3.5?vec3(.45,.8,-.4):vec3(-.45,.8,.4));
 for(int s=0;s<4;s++){if(float(s)>=uSS)break;vec2 o=uSS<1.5?vec2(.5):uSS<2.5?vec2(.25+.5*float(s),.25+.5*float(s)):vec2(mod(float(s),2.),floor(float(s)/2.))*.5+.25;
  float sx=floor(gl_FragCoord.x)+o.x,sy=uRes.y-floor(gl_FragCoord.y)-1.+o.y;vec3 p0;float a=(sx-uOff.x)/uK;
  if(uMode<1.5){float aa=(sx-uOff.x)/(.866*uK),bb=(sy-uOff.y)/(.5*uK);p0=vec3((aa+bb)*.5,0.,(bb-aa)*.5);}
  else if(uMode<3.5){p0=vec3(a,0.,(sy-uOff.y)/(.35*uK));}else{p0=vec3(uTW-a,0.,uTD-(sy-uOff.y)/(.35*uK));}
  vec3 rd=-vd;vec3 ro=p0+vd*300.;vec3 inv=1./(rd+vec3(1e-6));vec3 t0=(uBmin-ro)*inv,t1=(uBmax-ro)*inv;vec3 tmn=min(t0,t1),tmx=max(t0,t1);
  float tn=max(max(tmn.x,tmn.y),tmn.z),tf=min(min(tmx.x,tmx.y),tmx.z);if(tf<max(tn,0.))continue;
  float t=tn;bool hit=false;for(int i=0;i<64;i++){float d=map(ro+rd*t);if(d<.06){hit=true;break;}t+=max(d*.7,.05);if(t>tf)break;}
  if(!hit)continue;
  vec3 p=ro+rd*t;vec3 n=nrm(p);float spec;vec3 al=albedo(p,n,spec);
  vec3 L=normalize(uLamp-p);float dif=max(dot(n,L),0.);
  float sh=.85+.15*dif;
  float ao=1.;for(int j=1;j<3;j++){float hh=float(j)*1.1;ao-=max(0.,hh-map(p+n*hh))*.2/float(j);}ao=clamp(ao,.25,1.);
  float hemi=.55+.45*n.y;float kd=max(dot(n,key),0.);
  vec3 c=al*(vec3(.40,.41,.46)*hemi+vec3(1.,.88,.7)*dif*(.35+.65*sh)*.72+vec3(1.,.95,.86)*kd*.48)*ao;
  vec3 hv=normalize(L+vd);c+=vec3(1.,.92,.8)*pow(max(dot(n,hv),0.),24.)*spec*sh;
  c*=.6+.4*smoothstep(0.,4.,p.y);c+=al*pow(1.-max(dot(n,vd),0.),3.)*.2;
  col+=c;cov+=1.;}
 if(cov<.5){gl_FragColor=vec4(0.);return;}
 gl_FragColor=vec4(clamp(col/cov,0.,1.),cov/uSS);}`;
let SDFG,ICONMODE=false;
let SDFP=null;
function sdfAllowed(){try{if(localStorage.getItem('jtForceGPU'))return true;if(SOFTGL||QUAL<2||localStorage.getItem('jtNoSDF'))return false;if(localStorage.getItem('jtSdfBusy')){localStorage.setItem('jtNoSDF','1');localStorage.removeItem('jtSdfBusy');return false;}}catch(e){return false;}return true;}
function sdfInit(){if(SDFG!==undefined)return SDFG;if(SDFP)return sdfPoll();if(ICONMODE||!sdfAllowed()){if(!ICONMODE)SDFG=null;return null;}
 try{const c=document.createElement('canvas');c.width=c.height=8;const gl=c.getContext('webgl',{alpha:true,premultipliedAlpha:false,antialias:false,depth:false,stencil:false,preserveDrawingBuffer:true,powerPreference:'low-power'});if(!gl){SDFG=null;return null;}
  const ext=gl.getExtension('KHR_parallel_shader_compile');localStorage.setItem('jtSdfBusy','1');
  const mk=(ty,s)=>{const o=gl.createShader(ty);gl.shaderSource(o,s);gl.compileShader(o);return o;};
  const vs=mk(gl.VERTEX_SHADER,'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}'),fs=mk(gl.FRAGMENT_SHADER,SDFS);const pr=gl.createProgram();gl.attachShader(pr,vs);gl.attachShader(pr,fs);gl.bindAttribLocation(pr,0,'p');gl.linkProgram(pr);
  SDFP={c,gl,pr,fs,ext,t:performance.now(),async:!!ext};}catch(e){console.warn('3D decor disabled',e);SDFG=null;localStorage.removeItem('jtSdfBusy');return null;}
 return sdfPoll();}
function sdfPoll(){const Q=SDFP,gl=Q.gl;try{if(Q.ext&&!gl.getProgramParameter(Q.pr,Q.ext.COMPLETION_STATUS_KHR)){if(performance.now()-Q.t>6000){SDFP=null;SDFG=null;localStorage.setItem('jtNoSDF','1');localStorage.removeItem('jtSdfBusy');console.warn('3D decor shader too slow to compile – using lightweight decor');}return null;}
  SDFP=null;if(!gl.getProgramParameter(Q.pr,gl.LINK_STATUS)){console.warn('3D decor disabled',gl.getShaderInfoLog(Q.fs));SDFG=null;localStorage.removeItem('jtSdfBusy');return null;}
  const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
  SDFG={c:Q.c,gl,pr:Q.pr,buf,u:{}};localStorage.removeItem('jtSdfBusy');
  // v8 stability: retain usable caches and refresh 3D decor lazily.
  if(Q.async&&typeof G!=='undefined')for(const t of G.tanks){for(const d of t.decor)if(sdfType(d)>=0)d._sdfRefresh=true;}
  return SDFG;}catch(e){SDFP=null;SDFG=null;localStorage.removeItem('jtSdfBusy');return null;}}
const sdfSeed=d=>((d.seed>>>0)%997)*0.013;
function sdfType(d){const D=DECOR[d.type];if(d.type==='bark')return 0;if(d.type==='tower')return 1;if(D.tex==='drift')return 2;if(D.tex==='stone')return 3;if(D.tex==='slate')return 4;if(D.tex==='pot')return 5;return -1;}
function sdfDraw(cp,d){if(ICONMODE)return false;const D=DECOR[d.type];const ty=sdfType(d);if(ty<0)return false;const S=sdfInit();if(!S)return false;
 const KM=3.0;let f=cp.k>KM?KM/cp.k:1;const W0=B.w,H0=B.h;const gl=S.gl;if(gl.isContextLost()){SDFG=null;return false;}localStorage.setItem('jtSdfBusy','1');try{
 const R=(f)=>{const w=Math.max(1,Math.ceil(W0*f)),h=Math.max(1,Math.ceil(H0*f));const t0=performance.now();S.c.width=w;S.c.height=h;gl.viewport(0,0,w,h);gl.useProgram(S.pr);const U=n=>S.u[n]||(S.u[n]=gl.getUniformLocation(S.pr,n));
 gl.uniform2f(U('uRes'),w,h);gl.uniform2f(U('uOff'),cp.ox*f,cp.oy*f);gl.uniform2f(U('uCen'),d.x,d.z);gl.uniform1f(U('uK'),cp.k*f);gl.uniform1f(U('uSS'),cp.k*f>=2.4?1:2);gl.uniform1f(U('uMode'),cp.mode);gl.uniform1f(U('uRot'),d.rot?1:0);gl.uniform1f(U('uType'),ty);gl.uniform1f(U('uSeed'),sdfSeed(d));gl.uniform1f(U('uTW'),TW);gl.uniform1f(U('uTD'),TD);
 gl.uniform3f(U('uDim'),D.w,D.h,D.d);const lp=NOCLAMP?[d.x+12,TH+6,d.z+50]:[TW*0.55,TH+6,TD*0.5];gl.uniform3f(U('uLamp'),lp[0],lp[1],lp[2]);
 gl.uniform3f(U('uBmin'),d.x0-0.6,-0.2,d.z0-0.6);gl.uniform3f(U('uBmax'),d.x1+0.6,D.h+2.6,d.z1+0.6);
 gl.bindBuffer(gl.ARRAY_BUFFER,S.buf);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
 const px=new Uint8Array(w*h*4);gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,px);const ms=performance.now()-t0;S.ppx=S.ppx===undefined?ms/(w*h):S.ppx*0.6+0.4*ms/(w*h);return {px,w,h,ms};};
 if(S.ppx===undefined){const pf=Math.min(f,Math.sqrt(16000/(W0*H0)));const r=R(pf);if(r.ms>65){SDFG=null;try{localStorage.setItem('jtNoSDF','1');}catch(e){}console.warn('3D decor too slow on this GPU – using lightweight decor');return false;}}
 {const est=S.ppx*W0*H0*f*f;if(est>55){f*=Math.sqrt(55/est);if(f<0.35){return false;}}}
 const r=R(f);const {px,w,h,ms}=r;let s=new Uint32Array(px.buffer);const fl=new Uint32Array(w*h);for(let y=0;y<h;y++)fl.set(s.subarray((h-1-y)*w,(h-y)*w),y*w);s=fl;
 if(f<1){const a=document.createElement('canvas');a.width=w;a.height=h;a.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(fl.buffer),w,h),0,0);const b2=document.createElement('canvas');b2.width=W0;b2.height=H0;const bx=b2.getContext('2d',{willReadFrequently:true});bx.imageSmoothingEnabled=true;bx.imageSmoothingQuality='high';bx.drawImage(a,0,0,w,h,0,0,w/f,h/f);s=new Uint32Array(bx.getImageData(0,0,W0,H0).data.buffer);}
 const o=B.d;for(let i=0;i<s.length&&i<o.length;i++){const c=s[i];const a=c>>>24;if(!a)continue;const q=o[i];if(a===255||!(q>>>24)){o[i]=c;continue;}const t=a/255;o[i]=rgb(cr(q)+(cr(c)-cr(q))*t,cg(q)+(cg(c)-cg(q))*t,cb(q)+(cb(c)-cb(q))*t,Math.max(q>>>24,a));}
 if(ms>90){SDFG=null;try{localStorage.setItem('jtNoSDF','1');}catch(e){}console.warn('3D decor too slow here ('+ms.toFixed(0)+'ms) – switching to lightweight decor');}
 return true;}finally{localStorage.removeItem('jtSdfBusy');}}
// visual surface height of curved platforms (for drawing creatures on top)
function platTopY(d,x,z){if(!d||!d._sdf)return d?d.h:0;const D=DECOR[d.type];let lx=x-d.x,lz=z-d.z;if(d.rot){const t=lx;lx=lz;lz=-t;}const W=D.w/2,Dd=D.d/2,H=D.h;
 if(d.type==='bark'){const v=1-Math.pow(Math.min(1,Math.abs(lx)/(W-1.2)),4)-Math.pow(Math.min(1,Math.abs(lz)/Dd),4);return Math.max(0.5,H*Math.pow(Math.max(1e-4,v),0.25));}
 if(D.tex==='drift'){const xn=clamp(lx/W,-1,1);const r=Dd*0.78*(1-0.22*xn*xn)+0.5*Math.sin(xn*9+sdfSeed(d));return lerp(r*0.55,H-r,1-xn*xn)+r;}
 if(D.tex==='stone'){const v=1-Math.pow(Math.min(1,Math.abs(lx)/W),2.5)-Math.pow(Math.min(1,Math.abs(lz)/Dd),2.5);return Math.max(0.5,H*Math.pow(Math.max(1e-4,v),0.4));}
 if(D.tex==='pot')return H-1.2;return H;}

// ================= v3: painted vector plants =================
let NOCLAMP=false;
const CLP=(x,y,z)=>NOCLAMP?[x,Math.max(0,y),z]:[clamp(x,1.2,TW-1.2),clamp(y,0,TH-1.5),clamp(z,1.2,TD-1.2)];
const rgbs=(a,f=1,al=1)=>`rgba(${Math.min(255,a[0]*f)|0},${Math.min(255,a[1]*f)|0},${Math.min(255,a[2]*f)|0},${al})`;
const mix3=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
const hex3=h=>{const n=parseInt(h.slice(1),16);return [(n>>16)&255,(n>>8)&255,n&255];};
function withCanvas(fn){const w=B.w,h=B.h;let c=withCanvas.c;if(!c){c=withCanvas.c=document.createElement('canvas');}c.width=w;c.height=h;const x=c.getContext('2d',{willReadFrequently:true});x.clearRect(0,0,w,h);x.lineCap='round';x.lineJoin='round';fn(x);
 const s=new Uint32Array(x.getImageData(0,0,w,h).data.buffer),D=B.d;
 for(let i=0;i<s.length;i++){const c2=s[i];const a=c2>>>24;if(!a)continue;const o=D[i];const oa=o>>>24;if(a===255||!oa){D[i]=c2;continue;}const t=a/255;D[i]=rgb(cr(o)+(cr(c2)-cr(o))*t,cg(o)+(cg(c2)-cg(o))*t,cb(o)+(cb(c2)-cb(o))*t,Math.min(255,oa+a*(1-oa/255)));}}
function leafPath(x,a,b,w,bul=0.5){const dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1,nx=-dy/L*w,ny=dx/L*w,m=0.25+bul*0.5;
 x.beginPath();x.moveTo(a[0],a[1]);x.bezierCurveTo(a[0]+dx*.22+nx,a[1]+dy*.22+ny,a[0]+dx*m+nx*.85,a[1]+dy*m+ny*.85,b[0],b[1]);x.bezierCurveTo(a[0]+dx*m-nx*.85,a[1]+dy*m-ny*.85,a[0]+dx*.22-nx,a[1]+dy*.22-ny,a[0],a[1]);x.closePath();}
function leaf(x,a,b,w,c0,c1,al=1,rib,bul){if(Math.hypot(b[0]-a[0],b[1]-a[1])<0.4)return;leafPath(x,a,b,w,bul);const g=x.createLinearGradient(a[0],a[1],b[0],b[1]);g.addColorStop(0,c0);g.addColorStop(1,c1);x.globalAlpha=al;x.fillStyle=g;x.fill();
 if(rib){x.strokeStyle=rib;x.lineWidth=Math.max(0.5,w*0.16);x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(a[0]+(b[0]-a[0])*.85,a[1]+(b[1]-a[1])*.85);x.stroke();}x.globalAlpha=1;}
function strokePath(x,pts,w0,w1,col){for(let i=1;i<pts.length;i++){const t=i/(pts.length-1);x.strokeStyle=col;x.lineWidth=Math.max(0.6,w0+(w1-w0)*t);x.beginPath();x.moveTo(pts[i-1][0],pts[i-1][1]);x.lineTo(pts[i][0],pts[i][1]);x.stroke();}}
function fernFrond(d,f){const sa=Math.sin(f.a),ca=Math.cos(f.a),L=f.L;const droop=L*(0.15+0.25*Math.abs(sa));const pts=[];const N=16;
 for(let i=0;i<=N;i++){const s=i/N;pts.push(CLP(d.x+sa*L*s,(ca*0.85+0.25)*L*s-droop*s*s,d.z+f.dz*0.3+f.dz*1.3*s));}return pts;}
function paintFern(x,cp,d){const k=cp.k;const pr=(p)=>P(p[0],p[1],p[2],cp);
 const fr=d.fronds.map((f,i)=>{const pts=fernFrond(d,f);const tp=pts[pts.length-1];return {f,pts,dp:depthOf(tp[0],tp[1],tp[2],cp)+i*0.01};}).sort((a,b)=>a.dp-b.dp);
 const gD=[38,78,30],gM=[78,140,52],gL=[150,204,98],gY=[188,222,120];
 fr.forEach((o,ri)=>{const sh=0.72+0.28*ri/Math.max(1,fr.length-1);const pts=o.pts,N=pts.length-1,L=o.f.L;const sp=pts.map(pr);
  const ux0=pts[N][0]-pts[0][0],uz0=pts[N][2]-pts[0][2];const hl=Math.hypot(ux0,uz0)||1;const ux=ux0/hl,uz=uz0/hl;const px=-uz,pz=ux;
  strokePath(x,sp,k*0.5,k*0.18,rgbs(gD,sh*0.9));
  for(let i=1;i<N;i++){const s=i/N;const b=pts[i];const ll=L*0.2*Math.pow(1-s,0.7)*Math.min(1,s*3+0.35);if(ll<0.4)continue;
   const tx=pts[i+1][0]-pts[i-1][0],ty=pts[i+1][1]-pts[i-1][1],tz=pts[i+1][2]-pts[i-1][2];const tl=Math.hypot(tx,ty,tz)||1;
   for(const side of [-1,1]){const tip=CLP(b[0]+(px*side*0.9+tx/tl*0.45)*ll,b[1]+(ty/tl*0.45-0.16)*ll,b[2]+(pz*side*0.9+tz/tl*0.45)*ll);
    const a=sp[i],e=pr(tip);const lit=side*(cp.mode===4?-1:1)<0?1.08:0.92;const c0=rgbs(mix3(gD,gM,0.5),sh*lit),c1=rgbs(mix3(gM,s>0.7?gY:gL,0.35+s*0.5),sh*lit);
    leaf(x,a,e,Math.max(0.6,ll*k*0.24),c0,c1,0.94,rgbs(gD,sh*0.8,0.45),0.42);
    if(k*ll>5)leaf(x,[a[0]+(e[0]-a[0])*0.15,a[1]+(e[1]-a[1])*0.15-0.3],[a[0]+(e[0]-a[0])*0.8,a[1]+(e[1]-a[1])*0.8-0.4],ll*k*0.07,rgbs(gL,sh,0),rgbs(gY,sh,0.35),1);}}
  const t=sp[N];x.fillStyle=rgbs(gL,sh);x.beginPath();x.arc(t[0],t[1],Math.max(0.6,k*0.35),0,6.283);x.fill();});}
function paintGrass(x,cp,d){const k=cp.k;const bl=[];d.blades.forEach((b,bi)=>{for(let j=0;j<3;j++){const hh=hash3(bi*7+1,j,d.seed);const h2=hash3(bi,j+9,d.seed);
  bl.push({bx:b.bx+(j?(hh-.5)*3.2:0),bz:b.bz+(j?(h2-.5)*3.2:0),L:b.L*(j?0.55+hh*0.4:1),bend:b.bend*(j?0.4+hh*0.9:1)*(j===2?-1:1),zl:(h2-.5)*7,c:hh,main:!j});}});
 for(const b of bl)b.dp=depthOf(d.x+b.bx,0,d.z+b.bz,cp)+b.c*0.01;bl.sort((a,b)=>a.dp-b.dp);
 const cB=[46,82,32],cM=[96,152,66],cT=[182,212,118],cY=[206,196,120];
 bl.forEach((b,i)=>{const N=10;const pts=[];for(let q=0;q<=N;q++){const s=q/N;pts.push(P(...CLP(d.x+b.bx+b.bend*s*s,b.L*s*(1-0.06*s),d.z+b.bz+b.zl*s*s),cp));}
  const sh=0.75+0.25*i/bl.length;const L=[],R=[];for(let q=0;q<=N;q++){const s=q/N;const a=pts[Math.max(0,q-1)],c=pts[Math.min(N,q+1)];const dx=c[0]-a[0],dy=c[1]-a[1],l=Math.hypot(dx,dy)||1;const w=k*(b.main?0.95:0.7)*Math.pow(1-s,0.85)+0.12;
   L.push([pts[q][0]-dy/l*w,pts[q][1]+dx/l*w]);R.push([pts[q][0]+dy/l*w,pts[q][1]-dx/l*w]);}
  x.beginPath();x.moveTo(L[0][0],L[0][1]);for(let q=1;q<=N;q++)x.lineTo(L[q][0],L[q][1]);for(let q=N;q>=0;q--)x.lineTo(R[q][0],R[q][1]);x.closePath();
  const g=x.createLinearGradient(pts[0][0],pts[0][1],pts[N][0],pts[N][1]);g.addColorStop(0,rgbs(cB,sh));g.addColorStop(0.45,rgbs(cM,sh));g.addColorStop(1,rgbs(b.c>0.8?cY:cT,sh));x.fillStyle=g;x.globalAlpha=0.96;x.fill();
  x.globalAlpha=0.28;x.strokeStyle='rgb(232,246,190)';x.lineWidth=Math.max(0.4,k*0.18);x.beginPath();x.moveTo(L[1][0],L[1][1]);for(let q=2;q<N;q++)x.lineTo(L[q][0],L[q][1]);x.stroke();x.globalAlpha=1;});}
function paintFlowers(x,cp,d,D){const k=cp.k;const R=rng(d.seed^0x2b1);const pr=p=>P(p[0],p[1],p[2],cp);const fc=hex3(D.fc),fc2=hex3(D.fc2);
 for(let i=0;i<7;i++){const a=i/7*6.283+R();const b=pr(CLP(d.x+Math.cos(a),0.4,d.z+Math.sin(a)*0.8)),t=pr(CLP(d.x+Math.cos(a)*D.w*0.42,D.h*0.12+R()*3,d.z+Math.sin(a)*D.d*0.42));leaf(x,b,t,k*1.0,'rgb(52,96,38)','rgb(122,178,80)',0.96,'rgba(40,70,28,.4)');}
 const hs=d.heads.map(h=>({h,dp:depthOf(d.x+h.hx,0,d.z+h.hz,cp)})).sort((a,b)=>a.dp-b.dp);
 for(const {h} of hs){const b3=CLP(d.x+h.hx*0.3,0,d.z+h.hz),t3=CLP(d.x+h.hx,h.hh,d.z+h.hz);const m3=CLP((b3[0]+t3[0])/2+h.lean*0.6,t3[1]*0.55,(b3[2]+t3[2])/2);const b=pr(b3),t=pr(t3),m=pr(m3);
  x.strokeStyle='rgb(70,128,48)';x.lineWidth=Math.max(0.7,k*0.42);x.beginPath();x.moveTo(b[0],b[1]);x.quadraticCurveTo(m[0],m[1],t[0],t[1]);x.stroke();
  x.strokeStyle='rgba(170,220,120,.35)';x.lineWidth=Math.max(0.4,k*0.15);x.beginPath();x.moveTo(b[0]-k*0.12,b[1]);x.quadraticCurveTo(m[0]-k*0.12,m[1],t[0]-k*0.12,t[1]);x.stroke();
  const sd=h.lean>0?1:-1;leaf(x,m,[m[0]+sd*k*3.2,m[1]-k*1.4],k*0.8,'rgb(64,116,44)','rgb(132,190,86)',0.95,'rgba(40,70,28,.35)');
  if(d.type==='daisy'){const n=13;const ps=[];for(let i=0;i<n;i++){const a=i/n*6.283+h.hx;ps.push(a);}ps.sort((a,b)=>Math.sin(a)-Math.sin(b));
   for(const a of ps){const tip=[t[0]+Math.cos(a)*k*2.7,t[1]+Math.sin(a)*k*1.3];const back=Math.sin(a)<0;leaf(x,t,tip,k*0.5,back?'rgb(200,198,186)':'rgb(232,230,220)',back?'rgb(226,224,214)':'rgb(255,255,250)',1,null,0.6);}
   const g=x.createRadialGradient(t[0]-k*0.3,t[1]-k*0.3,0,t[0],t[1],k*1.0);g.addColorStop(0,'#ffe27a');g.addColorStop(0.7,'#e8a820');g.addColorStop(1,'#a8700c');x.fillStyle=g;x.beginPath();x.ellipse(t[0],t[1],k*1.0,k*0.72,0,0,6.283);x.fill();}
  else if(d.type==='lav'){for(let j=8;j>=0;j--){const yy=t[1]+(j-1.2)*k*0.85,xx=t[0]+Math.sin(j*2.1+h.hx)*k*0.45+h.lean*0.05*j*k;const r=k*(0.5+0.06*j);const g=x.createRadialGradient(xx-r*0.3,yy-r*0.35,0,xx,yy,r);g.addColorStop(0,rgbs(fc2));g.addColorStop(1,rgbs(fc,0.82));x.fillStyle=g;x.beginPath();x.ellipse(xx,yy,r*0.85,r,0,0,6.283);x.fill();}}
  else{for(let i=0;i<5;i++){const a=i/5*6.283+h.hx*0.7;const cx=t[0]+Math.cos(a)*k*1.0,cy=t[1]+Math.sin(a)*k*0.55;const g=x.createRadialGradient(cx-k*0.2,cy-k*0.3,0,cx,cy,k*1.2);g.addColorStop(0,rgbs(fc2));g.addColorStop(0.75,rgbs(fc));g.addColorStop(1,rgbs(fc,0.75));x.fillStyle=g;x.beginPath();x.ellipse(cx,cy,k*1.15,k*0.85,a,0,6.283);x.fill();}
   x.fillStyle='rgb(150,40,80)';x.beginPath();x.arc(t[0],t[1],k*0.45,0,6.283);x.fill();x.fillStyle='#ffe08a';x.beginPath();x.arc(t[0],t[1],k*0.25,0,6.283);x.fill();}}}
function paintSucc(x,cp,d){const k=cp.k;const pr=p=>P(p[0],p[1],p[2],cp);const cen=CLP(d.x,0.8,d.z);const a0=pr(cen);const lv=[];
 for(const [n,len,up,ri] of [[9,7.6,0.12,0],[7,5.4,0.45,1],[5,3.2,0.95,2]])for(let i=0;i<n;i++){const a=i/n*6.283+len+d.seed%7;const tip=CLP(d.x+Math.cos(a)*len,1+len*up*0.95+0.6,d.z+Math.sin(a)*len*0.85);lv.push({tip,len,ri,dp:depthOf(tip[0],0,tip[2],cp)+ri*30});}
 lv.sort((a,b)=>a.dp-b.dp);
 for(const l of lv){const b=pr(l.tip);const sh=0.82+l.ri*0.1;leaf(x,a0,b,k*l.len*0.3,rgbs([120,176,146],sh),rgbs(l.ri?[176,216,180]:[214,150,160],sh),1,'rgba(60,110,80,.4)',0.35);
  x.strokeStyle='rgba(50,90,66,.5)';x.lineWidth=Math.max(0.4,k*0.14);leafPath(x,a0,b,k*l.len*0.3,0.35);x.stroke();
  x.fillStyle='rgba(225,120,140,.8)';x.beginPath();x.arc(b[0],b[1],Math.max(0.5,k*0.28),0,6.283);x.fill();}}
function paintShroom(x,cp,d){const k=cp.k;const pr=p=>P(p[0],p[1],p[2],cp);const ms=[[-4,0,7],[2,1,11],[5,-1,6]].map(([dx,dz,hh])=>({dx,dz,hh,dp:depthOf(d.x+dx,0,d.z+dz,cp)})).sort((a,b)=>a.dp-b.dp);
 for(const m of ms){const b=pr(CLP(d.x+m.dx,0,d.z+m.dz)),t=pr(CLP(d.x+m.dx,m.hh,d.z+m.dz));const sw=k*0.85,tw=k*0.55;
  const g=x.createLinearGradient(b[0]-sw,0,b[0]+sw,0);g.addColorStop(0,'#fbf3e2');g.addColorStop(1,'#bfae8e');x.fillStyle=g;x.beginPath();x.moveTo(b[0]-sw,b[1]);x.quadraticCurveTo((b[0]+t[0])/2-tw*1.2,(b[1]+t[1])/2,t[0]-tw,t[1]);x.lineTo(t[0]+tw,t[1]);x.quadraticCurveTo((b[0]+t[0])/2+tw*1.2,(b[1]+t[1])/2,b[0]+sw,b[1]);x.closePath();x.fill();
  const r=k*(2.6+m.hh*0.08);x.fillStyle='rgba(200,230,220,.9)';x.beginPath();x.ellipse(t[0],t[1]+k*0.2,r,r*0.28,0,0,6.283);x.fill();
  const cg=x.createRadialGradient(t[0]-r*0.35,t[1]-r*0.55,0,t[0],t[1],r*1.1);cg.addColorStop(0,'#9cf0f4');cg.addColorStop(0.45,'#3fb0c0');cg.addColorStop(1,'#1a5866');x.fillStyle=cg;x.beginPath();x.ellipse(t[0],t[1],r,r*0.72,0,Math.PI,0);x.quadraticCurveTo(t[0],t[1]+r*0.22,t[0]-r,t[1]);x.fill();
  x.fillStyle='rgba(220,255,250,.85)';for(let i=0;i<4;i++){const a=Math.PI+0.5+i*0.6;x.beginPath();x.arc(t[0]+Math.cos(a)*r*0.55,t[1]+Math.sin(a)*r*0.45,Math.max(0.5,k*0.3),0,6.283);x.fill();}}}
function treeBlobs(d){const D=DECOR[d.type];return d.blobs.map(b=>{const r=b.r;if(NOCLAMP)return {x:d.x+b.bx,y:b.by,z:d.z+b.bz,r};return {x:clamp(d.x+b.bx,r*1.05+1.2,TW-r*1.05-1.2),y:Math.min(b.by,TH-1.5-r*0.9),z:clamp(d.z+b.bz,r*0.8+1.2,TD-r*0.8-1.2),r};});}
function paintTree(x,cp,d,bonsai){const k=cp.k;const D=DECOR[d.type];const R=rng((d.seed^0x71)>>>0);const by=bonsai?d.h-1.2:0;const top=bonsai?D.ph-d.h:D.h;const s0=d.seed%5;
 const tp=[];for(let i=0;i<=10;i++){const s=i/10;tp.push(CLP(d.x+Math.sin(s*3+s0)*(bonsai?4:3),by+s*top*0.8,d.z));}const sp=tp.map(p=>P(p[0],p[1],p[2],cp));
 const blobs=treeBlobs(d);
 // branches
 for(const b of blobs){const st=sp[6+((b.x*3)|0)%4]||sp[8];const c=P(b.x,b.y-b.r*0.3,b.z,cp);x.strokeStyle='#4e3624';x.lineWidth=Math.max(0.8,k*(bonsai?1.0:1.2));x.beginPath();x.moveTo(st[0],st[1]);x.quadraticCurveTo((st[0]+c[0])/2,st[1]-(st[1]-c[1])*0.2,c[0],c[1]);x.stroke();}
 const L=[],Rr=[];for(let i=0;i<sp.length;i++){const s=i/(sp.length-1);const w=k*(bonsai?2.6:3.0)*(1-s*0.6);const a=sp[Math.max(0,i-1)],c=sp[Math.min(sp.length-1,i+1)];const dx=c[0]-a[0],dy=c[1]-a[1],l=Math.hypot(dx,dy)||1;L.push([sp[i][0]-dy/l*w,sp[i][1]+dx/l*w]);Rr.push([sp[i][0]+dy/l*w,sp[i][1]-dx/l*w]);}
 x.beginPath();x.moveTo(L[0][0]-k,L[0][1]);for(const p of L)x.lineTo(p[0],p[1]);for(let i=Rr.length-1;i>=0;i--)x.lineTo(Rr[i][0],Rr[i][1]);x.lineTo(Rr[0][0]+k,Rr[0][1]);x.closePath();
 const g=x.createLinearGradient(sp[0][0]-k*3,0,sp[0][0]+k*3,0);g.addColorStop(0,'#9a7a56');g.addColorStop(0.45,'#6a4a30');g.addColorStop(1,'#3a2618');x.fillStyle=g;x.fill();
 x.strokeStyle='rgba(40,24,14,.35)';x.lineWidth=Math.max(0.5,k*0.25);for(let j=0;j<4;j++){const f=(j+0.5)/4;x.beginPath();for(let i=0;i<sp.length;i++){const p=[L[i][0]+(Rr[i][0]-L[i][0])*f,L[i][1]+(Rr[i][1]-L[i][1])*f];i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]);}x.stroke();}
 const pal=[[40,80,30],[58,104,40],[88,146,58],[124,184,78],[166,214,108]];
 const bs=blobs.map(b=>({b,dp:depthOf(b.x,b.y,b.z,cp)+b.y*0.002})).sort((a,b)=>a.dp-b.dp);
 for(const {b} of bs){const c=P(b.x,b.y,b.z,cp);const rx=b.r*k,ry=b.r*k*0.8;const bg=x.createRadialGradient(c[0]-rx*0.35,c[1]-ry*0.4,0,c[0],c[1],rx*1.05);bg.addColorStop(0,'rgb(84,140,56)');bg.addColorStop(1,'rgb(30,62,24)');x.fillStyle=bg;x.globalAlpha=0.95;x.beginPath();x.ellipse(c[0],c[1],rx*0.92,ry*0.9,0,0,6.283);x.fill();x.globalAlpha=1;
  const n=Math.round(34+b.r*2.4);const lv=[];for(let i=0;i<n;i++){const a=R()*6.283,rr=Math.sqrt(R());const u=Math.cos(a)*rr,v=Math.sin(a)*rr;const l=-u*0.55-v*0.75+(R()-0.5)*0.6;lv.push({u,v,l,o:R()*6.283});}
  lv.sort((a,b)=>a.l-b.l);
  for(const q of lv){const px=c[0]+q.u*rx,py=c[1]+q.v*ry;const ci=clamp(Math.floor((q.l+1.1)/2.2*pal.length),0,pal.length-1);const len=k*(1.3+R()*0.9);const tip=[px+Math.cos(q.o)*len,py+Math.sin(q.o)*len*0.8];leaf(x,[px,py],tip,len*0.42,rgbs(pal[Math.max(0,ci-1)]),rgbs(pal[ci]),0.95,null,0.5);}}}
function drawPlant(cp,d){const D=DECOR[d.type];withCanvas(x=>{if(d.type==='fern')paintFern(x,cp,d);else if(D.attract)paintFlowers(x,cp,d,D);else if(d.type==='grass')paintGrass(x,cp,d);else if(d.type==='succ')paintSucc(x,cp,d);else if(d.type==='shroom')paintShroom(x,cp,d);else if(d.type==='tree')paintTree(x,cp,d,false);});}
function drawTreeTop(cp,d,bonsai){withCanvas(x=>paintTree(x,cp,d,bonsai));}

// ================= v3: misc helpers =================
const TOUCH=(()=>{try{return matchMedia('(pointer:coarse)').matches;}catch(e){return false;}})();
const CSf=c=>c.mode===3?1:1.3, PSf=c=>c.mode===3?1:1.25;
function frontWall(w,c){return c.mode===1?(w==='zD'||w==='xW'):c.mode===4?w==='z0':w==='zD';}
function blitA(src,dx,dy,al){dx=Math.round(dx);dy=Math.round(dy);const x0=Math.max(0,dx),y0=Math.max(0,dy),x1=Math.min(B.w,dx+src.w),y1=Math.min(B.h,dy+src.h);const s=src.d,d=B.d;
 for(let y=y0;y<y1;y++){const sr=(y-dy)*src.w-dx,dr=y*B.w;for(let x=x0;x<x1;x++){const c=s[sr+x];const a=(c>>>24)*al;if(a<1)continue;const o=d[dr+x];const oa=o>>>24;if(!oa){d[dr+x]=(((a|0)&255)<<24|(c&0xffffff))>>>0;continue;}const t=a/255;d[dr+x]=rgb(cr(o)+(cr(c)-cr(o))*t,cg(o)+(cg(c)-cg(o))*t,cb(o)+(cb(c)-cb(o))*t,Math.max(oa,a));}}}
function decorFade(t,d,c){let tg=1;const dd=decorDepth(d,c);const ca=d.cache;for(const s of t.spiders){if(!s._dp||s._dd===undefined||s._dd>=dd)continue;const q=Pv(s._dp,c);const sz=Math.max(3,spSize(s)*c.k*CSf(c)*0.5);
  const lx=Math.round(q[0]-(c.ox+ca.offX)),ly=Math.round(q[1]-sz*0.5-(c.oy+ca.offY));let hit=0;
  for(const [ox,oy] of [[0,0],[-0.8,0],[0.8,0],[0,-0.7],[0,0.6]]){const X=lx+Math.round(ox*sz),Y=ly+Math.round(oy*sz);if(X<0||Y<0||X>=ca.pb.w||Y>=ca.pb.h)continue;if((ca.pb.d[Y*ca.pb.w+X]>>>24)>150)hit++;}
  if(hit>=2){tg=0.38;break;}}
 d._fa=d._fa===undefined?1:d._fa+(tg-d._fa)*0.2;return d._fa;}
function plantBox(d,D){const tr=d.type==='tree'||d.type==='bonsai';const ex=tr?34:18,ez=tr?20:16;const y1=Math.min(TH,(D.ph||D.h||10)+(tr?16:12));
 if(NOCLAMP)return boxPts(d.x-ex,d.z-ez,d.x+ex,d.z+ez,0,y1);return boxPts(Math.max(0,d.x-ex),Math.max(0,d.z-ez),Math.min(TW,d.x+ex),Math.min(TD,d.z+ez),0,y1);}
function tankClip(s,c){const pts=[];for(const x of [0,TW])for(const y of [-SUB,TH])for(const z of [0,TD])pts.push(P(x,y,z,c));pts.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
 const X=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);const lo=[],up=[];for(const p of pts){while(lo.length>=2&&X(lo[lo.length-2],lo[lo.length-1],p)<=0)lo.pop();lo.push(p);}
 for(let i=pts.length-1;i>=0;i--){const p=pts[i];while(up.length>=2&&X(up[up.length-2],up[up.length-1],p)<=0)up.pop();up.push(p);}
 const h=lo.slice(0,-1).concat(up.slice(0,-1));s.beginPath();h.forEach((p,i)=>i?s.lineTo(p[0],p[1]):s.moveTo(p[0],p[1]));s.closePath();s.clip();}
function drawRetreat(r,c){const w=r.surf&&r.surf.w;if(!w)return;const sd=r._sd||(r._sd=(Math.random()*1e6)|0);const R=4+r.silk*7;const cen=r.pt;const zw=w==='z0'||w==='zD';
 const wv=w==='z0'?0.35:w==='zD'?TD-0.35:w==='x0'?0.35:TW-0.35;
 const W3=(du,dv)=>zw?[clamp(cen.x+du,0.6,TW-0.6),clamp(cen.y+dv,0.5,TH-0.4),wv]:[wv,clamp(cen.y+dv,0.5,TH-0.4),clamp(cen.z+du,0.6,TD-0.6)];
 const ring=sc=>{const pts=[];for(let i=0;i<16;i++){const a=i/16*6.283;const rr=R*sc*(0.72+0.45*hash3(i,3,sd));pts.push(P(...W3(Math.cos(a)*rr*1.35,Math.sin(a)*rr*0.85),c));}return pts;};
 ppolyB(ring(1),0xfff6f4f0,0.1+r.silk*0.2);ppolyB(ring(0.55),0xfffafafa,0.14+r.silk*0.3);
 for(let i=0;i<9;i++){const a=hash3(i,5,sd)*6.283;const p0=P(...W3(Math.cos(a)*R*0.9,Math.sin(a)*R*0.6),c);const a2=a+(hash3(i,6,sd)-0.5)*2;const L=R*(1.4+hash3(i,7,sd)*1.4);
  const p1=P(...W3(Math.cos(a2)*L*1.2,Math.sin(a2)*L*0.8+(i%3===0?TH:0)),c);plineB(p0[0],p0[1],p1[0],p1[1],0xffffffff,0.22*r.silk+0.05);}}
function drawHeldPrey(t,p,c,x,y,view,dir,ang,gy){const s=p.owner;if(!s)return;const struggle=s.hunt&&s.state==='subdue'?clamp(s.hunt.subT/PREY[p.type].struggle,0,1):0;
 const o={tw:struggle>0?s.anim*(0.5+struggle):0,dark:s.state==='subdue'?(1-struggle)*0.5:0.5+p.feed*0.4,shrink:1-p.feed*0.3};const u=c.k*PSf(c);const sz=p.size*u*o.shrink;const jit=struggle>0?Math.sin(s.anim*45)*struggle*1.2:0;
 if(view==='top'||view==='belly'){drawPrey(p,x+Math.cos(ang)*sz*0.36+jit,y+Math.sin(ang)*sz*0.36,u,view,false,ang+Math.PI,o);return;}
 const X=x+dir*sz*0.36+jit,Y=Math.min(y+sz*0.42,gy+u*0.4);drawPrey(p,X,Y,u,'side',dir>0,0,o);}
// lamp-cast soft shadows (world-space map on the floor)
function segBox(px,py,pz,L,a,b){let t0=0,t1=1;const p=[px,py,pz];for(let i=0;i<3;i++){const d=L[i]-p[i];if(Math.abs(d)<1e-9){if(p[i]<a[i]||p[i]>b[i])return false;continue;}let u=(a[i]-p[i])/d,v=(b[i]-p[i])/d;if(u>v){const q=u;u=v;v=q;}if(u>t0)t0=u;if(v<t1)t1=v;if(t0>t1)return false;}return true;}
function segSph(px,py,pz,L,c,r){const dx=L[0]-px,dy=L[1]-py,dz=L[2]-pz;const fx=px-c[0],fy=py-c[1],fz=pz-c[2];const A=dx*dx+dy*dy+dz*dz;const t=clamp(-(fx*dx+fy*dy+fz*dz)/A,0,1);const qx=fx+dx*t,qy=fy+dy*t,qz=fz+dz*t;return qx*qx+qy*qy+qz*qz<r*r;}
function tankShadow(t){const GW=TW+1,GD=TD+1;const L0=[TW*0.55,TH+6,TD*0.5];const offs=[[-5,-3],[5,3],[-3,4],[4,-4]];const occ=[];
 for(const d of t.decor){const D=DECOR[d.type];if(D.kind==='flat')continue;
  if(D.kind==='plat'){const h=d.type==='drift'?D.h*0.8:d.type==='bark'?D.h*0.85:d.type==='stone'?D.h*0.8:D.h;occ.push({t:0,a:[d.x0+0.8,0,d.z0+0.8],b:[d.x1-0.8,h,d.z1-0.8],o:0.8});}
  if(d.type==='tree'||d.type==='bonsai'){for(const b of treeBlobs(d))occ.push({t:1,c:[b.x,b.y,b.z],r:b.r*0.85,o:0.5});if(d.type==='tree')occ.push({t:0,a:[d.x-2,0,d.z-2],b:[d.x+2,D.h*0.6,d.z+2],o:0.6});}
  else if(D.kind==='plant'){const op=d.type==='fern'||d.type==='grass'?0.38:D.attract?0.22:0.3;occ.push({t:0,a:[d.x-D.w*0.38,0,d.z-D.d*0.45],b:[d.x+D.w*0.38,D.h*0.75,d.z+D.d*0.45],o:op});}}
 if(!occ.length)return null;const m=new Float32Array(GW*GD);
 for(let gz=0;gz<GD;gz++)for(let gx=0;gx<GW;gx++){let sum=0;for(const of of offs){const L=[L0[0]+of[0],L0[1],L0[2]+of[1]];let tr=1;for(const o of occ){if(o.t===0?segBox(gx,0.05,gz,L,o.a,o.b):segSph(gx,0.05,gz,L,o.c,o.r))tr*=1-o.o;}sum+=1-tr;}m[gz*GW+gx]=sum/offs.length;}
 const m2=new Float32Array(m.length);for(let gz=0;gz<GD;gz++)for(let gx=0;gx<GW;gx++){let s=0,n=0;for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){const X=gx+dx,Z=gz+dz;if(X<0||Z<0||X>=GW||Z>=GD)continue;s+=m[Z*GW+X];n++;}m2[gz*GW+gx]=s/n;}
 return m2;}
function shadowAt(m,x,z){if(!m)return 0;const GW=TW+1;const X=clamp(x,0,TW-0.001),Z=clamp(z,0,TD-0.001);const ix=X|0,iz=Z|0,fx=X-ix,fz=Z-iz;const i=iz*GW+ix;return (m[i]*(1-fx)+m[i+1]*fx)*(1-fz)+(m[i+GW]*(1-fx)+m[i+GW+1]*fx)*fz;}

// ---------- scene ----------
let ROOM={},FGC={},frameImg=null;const frame=new PB(1,1);
function decorDepth(d,c){return depthOf(d.x,0,d.z,c)+(DECOR[d.type].kind==='plant'?0.3:0);}
function entDepth(t,e,c){const p=e.pos;let dp=depthOf(p.x,p.y,p.z,c);const s=e.surf;
 if(s&&s.t==='wall'){const back=c.mode===1?(s.w==='z0'||s.w==='x0'):c.mode===4?s.w==='zD':s.w==='z0';const front=frontWall(s.w,c);if(back)return -1000+p.y*0.01;if(front)return 1e4;}
 if(s&&(s.t==='plat'||s.t==='climb')){const d=platById(t,s.id);if(d)dp=Math.max(dp,depthOf(d.x,0,d.z,c)+0.5+(s.t==='plat'?depthOf(p.x,0,p.z,c)*0.001:0));if(s.t==='climb'&&d){dp=depthOf(p.x,0,p.z,c)+0.6;}}
 if(s&&s.t==='perch'){dp+=0.5;}
 if(!s||s.t==='air'||s.t==='silk'){const g=groundAt(t,p.x,p.z);if(g.p)dp=Math.max(dp,depthOf(g.p.x,0,g.p.z,c)+0.5);}
 return dp;}
function viewFor(e,c){const s=e.surf;if(s&&(s.t==='wall'||s.t==='climb'||s.t==='silk')){const a=Pv(e.pos,c),b=Pv(vadd(e.pos,vmul(e.face,5)),c);return {view:(s.t==='wall'&&frontWall(s.w,c))?'belly':'top',ang:Math.atan2(b[1]-a[1],b[0]-a[0])};}
 const f=e.face;const vd=viewDir(c);const dt=vdot(v3(f.x,0,f.z),vd)/(Math.hypot(f.x,f.z)||1),dx=screenDX(f,c),flip=dx<0;
 // 8 camera-relative sectors: front, front-3/4, side, back-3/4, back (mirrored left/right).
 if(dt>0.92388)return {view:'front'};if(dt>0.38268)return {view:'front3',flip};if(dt<-0.92388)return {view:'back'};if(dt<-0.38268)return {view:'back3',flip};return {view:'side',flip};}
function dispPos(e,r,c){const p=vc(e.pos);const s=e.surf;const yTop=TH-r*0.9;
 if(s&&s.t==='wall'){if(s.w==='z0'||s.w==='zD'){p.x=clamp(p.x,r,TW-r);p.y=clamp(p.y,r*0.7,yTop);}else{p.z=clamp(p.z,r,TD-r);p.y=clamp(p.y,r*0.7,yTop);if(c.mode!==1)p.x=s.w==='x0'?r:TW-r;}return p;}
 p.x=clamp(p.x,r,TW-r);p.z=clamp(p.z,Math.min(r,TD/2),TD-Math.min(r,TD/2));p.y=Math.min(p.y,yTop);return p;}
function drawShadow(t,e,r,c,dp){dp=dp||e.pos;const g=groundAt(t,dp.x,dp.z);if(e.surf&&e.surf.t==='wall')return;const gy=g.p?platTopY(g.p,dp.x,dp.z):g.h;const p=P(dp.x,gy,dp.z,c);const hgt=dp.y-gy;const a=clamp(0.35-hgt*0.004,0.08,0.35);pellB(p[0],p[1],r*c.k,r*c.k*0.4,0xff000000,a);}
function drawSpiderEnt(t,s,c){const sz=spSize(s);const S=SPEC[s.sp];const v=viewFor(s,c);const CS=CSf(c);const dp=dispPos(s,sz*0.65*CS,c);if(s.surf.t==='plat'){const d=platById(t,s.surf.id);if(d)dp.y=platTopY(d,dp.x,dp.z);}s._dp=dp;const p=Pv(dp,c);if(s.surf.t!=='wall')drawShadow(t,s,sz*0.45*CS,c,dp);
 const moving=s.spd>2,frz=!!s._stalkFrozen,twitch=frz&&s.tr.patience<0.58;const st=s.state;const o={x:p[0],y:p[1],u:c.k*sz/9.5*CS,view:v.view,flip:v.flip,ang:v.ang,pal:S.pal,pat:S.pat,seed:s.seed,phase:frz?0:(moving?s.anim*16:0),crouch:st==='crouch'?1:(st==='stalk'?0.5:0),wig:frz?0:(st==='crouch'?Math.sin(s.anim*30):0),jump:!!(s.jump&&st==='pounce')||st==='fall',groom:frz?(twitch?s.anim:0):(st==='groom'?s.anim:0),raise:['stalk','crouch','watch','notice'].includes(st)?1:0,as:0.82+s.sat*0.0035,fan:S.pat==='peacock'&&(st==='look'&&Math.sin(s.st*2)>0.3)};
 if(v.view==='top'){o.y=p[1];}if(st==='sleep'||st==='molt'){o.phase=0;o.raise=0;}
 if(st==='molt'){o.pal=mixPalT(S.pal,Math.min(1,s.st/14));}
 const hp=s.hunt&&s.hunt.prey;if(hp&&hp.owner===s)o.held=(x,y,view,dir,ang,gy)=>drawHeldPrey(t,hp,c,x,y,view,dir,ang,gy);
 drawJumper(o);
 }
function mixPalT(pal,t){const pp=paleOf(pal);const o={};for(const k in pal){const a=col(pal[k]),b=col(pp[k]);const m=mixc(b,a,t);o[k]='#'+[cr(m),cg(m),cb(m)].map(v=>v.toString(16).padStart(2,'0')).join('');}return o;}
function drawPreyEnt(t,p,c){if(p.buried){const q=Pv(p.pos,c);pset(q[0],q[1],shd(col(SUBS[t.sub].c[0]),0.7));pset(q[0]+1,q[1],shd(col(SUBS[t.sub].c[0]),0.8));return;}
 const v=viewFor(p,c);const PS=PSf(c);let dp=dispPos(p,p.size*0.55*PS,c);if(p.surf&&p.surf.t==='plat'&&!p.owner){const d=platById(t,p.surf.id);if(d)dp.y=platTopY(d,dp.x,dp.z);}if(p.owner&&p.owner._dp)dp=vadd(dp,vsub(p.owner._dp,p.owner.pos));const q=Pv(dp,c);if(!p.owner&&p.surf.t!=='wall')drawShadow(t,p,p.size*0.35*PS,c,dp);
 const o={};if(p.owner){const s=p.owner;const struggle=s.hunt&&s.state==='subdue'?clamp(s.hunt.subT/PREY[p.type].struggle,0,1):0;o.tw=struggle>0?s.anim*(0.5+struggle):0;o.dark=s.state==='subdue'?(1-struggle)*0.5:0.5+p.feed*0.4;o.shrink=1-p.feed*0.3;
  if(struggle>0){q[0]+=Math.sin(s.anim*45)*struggle*1.2;}}
 drawPrey(p,q[0],q[1],c.k*PS,(v.view==='belly'?'belly':v.view==='top'?'top':'side'),v.flip??(v.view==='back'),v.ang||0,o);}
function drawHusk(t,h,c){const q=Pv(dispPos({pos:h.pos,surf:h.surf||S_FLOOR},h.size*0.6,c),c);if(h.type==='exuvia'){const S=SPEC[h.sp];const v=viewFor({surf:h.surf,pos:h.pos,face:h.face},c);drawJumper({x:q[0],y:q[1],u:c.k*h.size/9.5*CSf(c),view:v.view,flip:v.flip,ang:v.ang,pal:paleOf(S.pal),pat:S.pat,seed:h.seed,as:0.8});return;}
 drawPrey({type:h.type,size:h.size,seed:h.seed,anim:0,surf:S_FLOOR,spd:0},q[0],q[1],c.k*PSf(c),'side',false,0,{husk:true,shrink:0.75});}
let DL=[],DLX=null;const EBX={};let EBN={};
function boxed(g,c,qx,qy,R,fn){const S=Math.min(1024,Math.ceil((2*R+2)/32)*32);const L=EBX[S]||(EBX[S]=[]);const n=EBN[S]=(EBN[S]||0)+1;let e=L[n-1];
 if(!e){const cv=document.createElement('canvas');cv.width=cv.height=S;const pb=new PB(S,S);e=L[n-1]={cv,cx:cv.getContext('2d',{willReadFrequently:true}),pb,id:new ImageData(new Uint8ClampedArray(pb.d.buffer),S,S),dirty:true};}
 const x0=Math.round(qx-S/2),y0=Math.round(qy-S/2);if(x0>W||y0>H||x0+S<0||y0+S<0)return;const old=B;B=e.pb;const d=e.pb.d;if(e.dirty)d.fill(0);
 fn({mode:c.mode,k:c.k,ox:c.ox-x0,oy:c.oy-y0,fx:c.fx,fy:c.fy,fz:c.fz});B=old;
 let y1=-1,y2=-1,xa=S,xb=-1;for(let y=0;y<S;y++){const o=y*S;let any=false;for(let x=0;x<S;x++)if(d[o+x]){any=true;if(x<xa)xa=x;break;}if(any){if(y1<0)y1=y;y2=y;for(let x=S-1;x>xb;x--)if(d[o+x]){xb=x;break;}}}
 e.dirty=y1>=0;if(y1<0)return;const bw=xb-xa+1,bh=y2-y1+1;e.cx.putImageData(e.id,0,0,xa,y1,bw,bh);g.drawImage(e.cv,xa,y1,bw,bh,x0+xa,y0+y1,bw,bh);return [x0+xa-2,y0+y1-2,bw+4,bh+4];}
function ellF(g,x,y,rx,ry){g.beginPath();g.ellipse(x,y,Math.max(0.3,rx),Math.max(0.3,ry),0,0,6.283);g.fill();}
function drawRetreatC(g,r,c){const w=r.surf&&r.surf.w;if(!w)return;const sd=r._sd||(r._sd=(Math.random()*1e6)|0);const R=4+r.silk*7;const cen=r.pt;const zw=w==='z0'||w==='zD';
 const wv=w==='z0'?0.35:w==='zD'?TD-0.35:w==='x0'?0.35:TW-0.35;
 const W3=(du,dv)=>zw?[clamp(cen.x+du,0.6,TW-0.6),clamp(cen.y+dv,0.5,TH-0.4),wv]:[wv,clamp(cen.y+dv,0.5,TH-0.4),clamp(cen.z+du,0.6,TD-0.6)];
 const ring=sc=>{g.beginPath();for(let i=0;i<16;i++){const a=i/16*6.283;const rr=R*sc*(0.72+0.45*hash3(i,3,sd));const p=P(...W3(Math.cos(a)*rr*1.35,Math.sin(a)*rr*0.85),c);i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]);}g.closePath();g.fill();};
 g.fillStyle=`rgba(246,244,240,${0.1+r.silk*0.2})`;ring(1);g.fillStyle=`rgba(250,250,250,${0.14+r.silk*0.3})`;ring(0.55);
 g.strokeStyle=`rgba(255,255,255,${0.22*r.silk+0.05})`;g.lineWidth=Math.max(0.6,0.45*RS);g.beginPath();
 for(let i=0;i<9;i++){const a=hash3(i,5,sd)*6.283;const p0=P(...W3(Math.cos(a)*R*0.9,Math.sin(a)*R*0.6),c);const a2=a+(hash3(i,6,sd)-0.5)*2;const L=R*(1.4+hash3(i,7,sd)*1.4);
  const p1=P(...W3(Math.cos(a2)*L*1.2,Math.sin(a2)*L*0.8+(i%3===0?TH:0)),c);g.moveTo(p0[0],p0[1]);g.lineTo(p1[0],p1[1]);}g.stroke();}
function drawScene(t,c){const key=camKey(c);const T0=performance.now();EBN={};
 const bgk=key+t.sub+t.decor.map(d=>d.id+(DECOR[d.type].kind==='plat'?'p':'')).join(',');if(t.bgKey!==bgk||!t.bg){t.bg=buildBG(t,c);t.bg.cv=pbCanvas(t.bg.pb);t.bg.pb=null;t.bgKey=bgk;}
 const items=[];let built=0;
 for(const d of t.decor){const D=DECOR[d.type];if(D.kind==='flat')continue;
  // v8 keeps the two most recently used camera-specific decor sprites. Repeated
  // Close-up <-> Side switching can then reuse warm caches instead of regenerating them.
  if((!d.cache||d.cache.key!==key)&&d._cache8&&d._cache8[key])d.cache=d._cache8[key];
  const cacheReady=d.cache&&d.cache.key===key&&!d._sdfRefresh;
  if(!cacheReady){
   if(built>0&&performance.now()-T0>7){if(!d.cache||d.cache.key!==key)continue;}
   else{built++;
    try{const bb=(D.kind==='plat'&&d.type!=='bonsai')?boxPts(d.x0-1,d.z0-1,d.x1+1,d.z1+1,0,d.h+4):plantBox(d,D);
     const sp=makeSprite(c,bb,cp=>D.kind==='plat'?drawPlat(cp,d):drawPlant(cp,d));if(D.kind==='plat'&&d.type!=='bonsai'&&D.tex!=='pot'&&!d._sdf)roughen(sp.pb,d.seed%997,Math.max(3,Math.round(c.k*(D.tex==='cork'?2.2:1.5))),D.tex==='stone'?0.5:D.tex==='cork'?1.2:0.8);
     sp.cv=pbCanvas(sp.pb);d.cache={key,...sp};d._sdfRefresh=false;d._cache8=d._cache8||Object.create(null);d._cache8[key]=d.cache;d._cache8Order=(d._cache8Order||[]).filter(k=>k!==key);d._cache8Order.push(key);while(d._cache8Order.length>2){const oldKey=d._cache8Order.shift();delete d._cache8[oldKey];}
    }catch(e){console.warn('decor cache rebuild skipped',d.type,e);d._sdfRefresh=false;if(!d.cache||d.cache.key!==key)continue;}}
  }
  const ca=d.cache;if(!ca||ca.key!==key)continue;const fa=decorFade(t,d,c);const X=Math.round(c.ox+ca.offX),Y=Math.round(c.oy+ca.offY);items.push({dp:decorDepth(d,c),dec:1,id:d.id,dyn:fa<0.98,cv:ca.cv,bb:[X,Y,ca.cv.width,ca.cv.height],f:g=>{if(fa<0.98)g.globalAlpha=fa;g.drawImage(ca.cv,X,Y);g.globalAlpha=1;return fa<0.98?[X,Y,ca.cv.width,ca.cv.height]:null;}});}
 for(const s of t.spiders){const u=c.k*spSize(s)/9.5*CSf(c);const hp=s.hunt&&s.hunt.prey;const R=7*u+(hp&&hp.owner===s?hp.size*c.k*PSf(c)*0.9:0)+4;
  items.push({dp:(s._dd=entDepth(t,s,c)),f:g=>{const q=Pv(s._dp||s.pos,c);const b=boxed(g,c,q[0],q[1]-2.5*u,R,c2=>drawSpiderEnt(t,s,c2));if(b&&G.sel===s){const e=spSize(s)*c.k*CSf(c);return [Math.min(b[0],q[0]-e),Math.min(b[1],q[1]-e),Math.max(b[2],e*2+b[0]-Math.min(b[0],q[0]-e)+4),b[3]+e];}return b;}});
  if(s.retreat&&s.retreat.silk>0.02){const r=s.retreat;items.push({dp:entDepth(t,{pos:r.pt,surf:r.surf},c)-0.01,f:g=>{drawRetreatC(g,r,c);const q=P(r.pt.x,r.pt.y,r.pt.z,c);const e=(4+r.silk*7)*c.k*4;return [q[0]-e,q[1]-e*1.6,e*2,e*3.2];}});}}
 for(const p of t.prey)if(!p.owner){const sz=p.size*c.k*PSf(c);items.push({dp:entDepth(t,p,c),f:g=>{const q=Pv(p.pos,c);return boxed(g,c,q[0],q[1]-sz*0.3,sz*1.4+5,c2=>drawPreyEnt(t,p,c2));}});}
 for(const h of t.husks){const R=h.size*c.k*CSf(c)*0.8+6;items.push({dp:entDepth(t,{pos:h.pos,surf:h.surf||S_FLOOR},c)-0.05,f:g=>{const q=Pv(h.pos,c);return boxed(g,c,q[0],q[1]-R*0.3,R,c2=>drawHusk(t,h,c2));}});}
 for(const d of t.drops)items.push({dp:entDepth(t,{pos:d.pos,surf:d.surf},c),f:g=>{const q=Pv(dispPos({pos:d.pos,surf:d.surf},1.5,c),c);const r=Math.max(0.8,c.k*0.9*d.v);
  g.fillStyle='rgba(0,0,0,.18)';ellF(g,q[0],q[1]+r*0.15,r*1.05,r*1.2);g.fillStyle='rgba(240,226,192,.38)';ellF(g,q[0],q[1],r,r*1.1);g.fillStyle='rgba(255,255,255,.3)';ellF(g,q[0]+r*0.1,q[1]+r*0.35,r*0.55,r*0.4);g.fillStyle='rgba(255,255,255,.95)';ellF(g,q[0]-r*0.35,q[1]-r*0.42,r*0.28,r*0.24);return [q[0]-r*2,q[1]-r*2,r*4,r*4];}});
 items.sort((a,b)=>a.dp-b.dp);DL=items;
 const sk=bgk+'|m'+c.mode+'|'+W+'x'+H+'|'+Math.round(c.ox)+','+Math.round(c.oy)+'|'+items.filter(i=>i.dec&&!i.dyn).map(i=>i.id+':'+i.bb[2]).join(',');
 if(!t.stat||t.stat.k!==sk||t.stat.cv.width!==W||t.stat.cv.height!==H){let cv=t.stat&&t.stat.cv;if(!cv||cv.width!==W||cv.height!==H){cv=document.createElement('canvas');cv.width=W;cv.height=H;}const x=cv.getContext('2d');x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,W,H);
  if(c.mode!==3)x.drawImage(roomC(c.mode),0,0);x.drawImage(t.bg.cv,Math.round(c.ox+t.bg.offX),Math.round(c.oy+t.bg.offY));x.save();tankClip(x,c);for(const i of items)if(i.dec&&!i.dyn)x.drawImage(i.cv,i.bb[0],i.bb[1]);x.restore();t.stat={k:sk,cv};}
 DLX=g=>{g.lineWidth=Math.max(0.7,0.5*RS);for(const s of t.spiders){if(s.drag){const a=Pv(s.drag.a,c),b=Pv(s._dp||s.pos,c);g.strokeStyle='rgba(255,255,255,.55)';g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]-spSize(s)*c.k*0.25);g.stroke();}}
  for(const f of t.fx){const q=Pv(f.pos,c);if(f.type==='bite'&&f.t<0.8){const r=(2+f.t*14)*c.k*0.6;g.strokeStyle=`rgba(255,255,255,${0.8-f.t})`;g.setLineDash([RS*1.2,RS*2.2]);g.beginPath();g.ellipse(q[0],q[1],r,r*0.7,0,0,6.283);g.stroke();g.setLineDash([]);}
   if(f.type==='dust'&&f.t<0.5){g.fillStyle=SUBS[t.sub].c[2];g.globalAlpha=0.6-f.t;for(let i=0;i<6;i++){const a=i/6*6.283;g.fillRect(q[0]+Math.cos(a)*f.t*20*c.k*0.4,q[1]+Math.sin(a)*f.t*6*c.k*0.4-f.t*4,RS,RS);}g.globalAlpha=1;}}
  if(UI.place&&G.mouse){const m=G.mouse;const pl=UI.place;let w=10,d=10;if(pl.kind==='decor'){const D=DECOR[pl.id];w=D.w;d=D.d;if(UI.rot)[w,d]=[d,w];}
   const ok=placeOK(t,pl,m.x,m.z);const pts=[[m.x-w/2,m.z-d/2],[m.x+w/2,m.z-d/2],[m.x+w/2,m.z+d/2],[m.x-w/2,m.z+d/2]].map(q=>P(q[0],0,q[1],c));
   g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fillStyle=ok?'rgba(138,224,127,.18)':'rgba(255,90,90,.18)';g.fill();g.strokeStyle=ok?'rgba(138,224,127,.9)':'rgba(255,90,90,.9)';g.lineWidth=Math.max(1,RS);g.stroke();}};
 if(!FGC[key]){FGC[key]=buildFG(c);FGC[key].cv=pbCanvas(FGC[key].pb);FGC[key].pb=null;}}

function drawDL(s){const RC=[];for(const it of DL){if(it.dec&&!it.dyn){if(!RC.length)continue;const b=it.bb;for(const r of RC){const x1=Math.max(b[0],Math.floor(r[0])),y1=Math.max(b[1],Math.floor(r[1])),x2=Math.min(b[0]+b[2],Math.ceil(r[0]+r[2])),y2=Math.min(b[1]+b[3],Math.ceil(r[1]+r[3]));if(x2>x1&&y2>y1)s.drawImage(it.cv,x1-b[0],y1-b[1],x2-x1,y2-y1,x1,y1,x2-x1,y2-y1);}}else{const bb=it.f(s);if(bb)RC.push(bb);}}}
const SND={ctx:null,rain:true,room:true,vol:{music:.55,amb:.6,sfx:.7}};
function mkNoise(ac,sec,type){const n=ac.sampleRate*sec,b=ac.createBuffer(1,n,ac.sampleRate),d=b.getChannelData(0);let last=0,b0=0,b1=0,b2=0;
 for(let i=0;i<n;i++){const w=Math.random()*2-1;if(type==='brown'){last=(last+0.02*w)/1.02;d[i]=last*3.5;}else if(type==='pink'){b0=0.99765*b0+w*0.099;b1=0.963*b1+w*0.2965;b2=0.57*b2+w*1.0526;d[i]=(b0+b1+b2+w*0.1848)*0.18;}else if(type==='crackle'){d[i]=(Math.random()<0.0007?(Math.random()*2-1)*0.9:0)+w*0.012;}else d[i]=w;}return b;}
function audioInit(){if(SND.ctx)return;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;const ac=new AC();SND.ctx=ac;
 SND.master=ac.createGain();SND.master.gain.value=0.9;const comp=ac.createDynamicsCompressor();SND.master.connect(comp);comp.connect(ac.destination);
 SND.music=ac.createGain();SND.amb=ac.createGain();SND.sfxG=ac.createGain();
 const mlp=ac.createBiquadFilter();mlp.type='lowpass';mlp.frequency.value=2600;SND.music.connect(mlp);mlp.connect(SND.master);SND.amb.connect(SND.master);SND.sfxG.connect(SND.master);
 // music reverb-ish delay
 SND.dly=ac.createDelay(1);SND.dly.delayTime.value=0.42;const fb=ac.createGain();fb.gain.value=0.32;const dlp=ac.createBiquadFilter();dlp.frequency.value=1800;SND.dly.connect(dlp);dlp.connect(fb);fb.connect(SND.dly);dlp.connect(SND.music);
 SND.white=mkNoise(ac,2,'white');
 const loop=(buf,dest,g)=>{const s=ac.createBufferSource();s.buffer=buf;s.loop=true;const gg=ac.createGain();gg.gain.value=g;s.connect(gg);gg.connect(dest);s.start();return gg;};
 SND.crackle=loop(mkNoise(ac,4,'crackle'),SND.music,0.5);
 const rf=ac.createBiquadFilter();rf.type='lowpass';rf.frequency.value=260;rf.connect(SND.amb);SND.roomG=loop(mkNoise(ac,4,'brown'),rf,0.35);
 const rb=ac.createBiquadFilter();rb.type='bandpass';rb.frequency.value=1400;rb.Q.value=0.4;rb.connect(SND.amb);SND.rainG=loop(mkNoise(ac,4,'pink'),rb,0.0);
 // fly buzz
 SND.buzzO=ac.createOscillator();SND.buzzO.type='sawtooth';SND.buzzO.frequency.value=200;const bf=ac.createBiquadFilter();bf.type='bandpass';bf.frequency.value=420;bf.Q.value=2;SND.buzzG=ac.createGain();SND.buzzG.gain.value=0;SND.buzzO.connect(bf);bf.connect(SND.buzzG);SND.buzzG.connect(SND.amb);SND.buzzO.start();
 applyVol();SND.next=ac.currentTime+0.2;SND.step=0;setInterval(musicTick,50);}
function applyVol(){if(!SND.ctx)return;SND.music.gain.value=SND.vol.music*0.5;SND.amb.gain.value=SND.vol.amb;SND.sfxG.gain.value=SND.vol.sfx;}
