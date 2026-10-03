// ================= HD-2D compositor =================
function pbCanvas(pb){const c=document.createElement('canvas');c.width=pb.w;c.height=pb.h;c.getContext('2d').putImageData(new ImageData(new Uint8ClampedArray(pb.d.buffer),pb.w,pb.h),0,0);return c;}
function woodTex(){if(woodTex.c)return woodTex.c;const w=256,h=512,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d'),id=x.createImageData(w,h),d=id.data;
 for(let y=0;y<h;y++)for(let i=0;i<w;i++){const warp=fbm(i*0.012,y*0.004,3)*9;const g=0.5+0.5*Math.sin(i*0.16+warp*2.2);const fine=hash3(i,y>>2,9);let v=0.72+0.2*g*g+fbm(i*0.05,y*0.01,5)*0.12-(fine<0.08?0.08:0);
  if(fbm(i*0.03,y*0.03,7)>0.78)v-=0.12*sst(0.78,0.86,fbm(i*0.03,y*0.03,7));const k=(y*w+i)*4;d[k]=d[k+1]=d[k+2]=Math.max(0,Math.min(255,v*255));d[k+3]=255;}
 x.putImageData(id,0,0);woodTex.c=c;return c;}
const WIN={x:24,y:26,w:120,h:110};
const ROOMC={};
function roomC(mode){if(ROOMC[mode])return ROOMC[mode];const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');x.scale(RS,RS);
 const pat=x.createPattern(woodTex(),'repeat');const planks=['#5a3a24','#4e3220','#63412a','#553722','#5d3c25'];
 for(let i=0;i*26<640;i++){const px=i*26;const g=x.createLinearGradient(px,0,px+26,0);const b=planks[i%5];g.addColorStop(0,shade(b,0.82));g.addColorStop(0.15,b);g.addColorStop(0.85,b);g.addColorStop(1,shade(b,0.78));x.fillStyle=g;x.fillRect(px,0,26,360);}
 x.save();x.globalCompositeOperation='multiply';x.globalAlpha=0.7;const m=new DOMMatrix();m.scaleSelf(0.5,0.9);pat.setTransform(m);x.fillStyle=pat;x.fillRect(0,0,640,360);x.restore();
 for(let i=1;i*26<640;i++){x.fillStyle='rgba(20,10,4,.75)';x.fillRect(i*26-0.6,0,1.2,360);x.fillStyle='rgba(255,210,150,.08)';x.fillRect(i*26+0.6,0,0.6,360);}
 let g=x.createLinearGradient(0,0,0,360);g.addColorStop(0,'rgba(10,5,2,.55)');g.addColorStop(0.35,'rgba(10,5,2,0)');g.addColorStop(1,'rgba(10,5,2,.2)');x.fillStyle=g;x.fillRect(0,0,640,360);
 // curtains + rod
 const {x:wx,y:wy,w:ww,h:wh}=WIN;
 x.save();x.shadowColor='rgba(0,0,0,.55)';x.shadowBlur=8;x.shadowOffsetY=3;x.fillStyle='#e2d2b2';x.fillRect(wx-7,wy-7,ww+14,wh+14);x.restore();
 g=x.createLinearGradient(wx-7,wy-7,wx+ww+7,wy+wh+7);g.addColorStop(0,'#efe2c6');g.addColorStop(1,'#bfa983');x.fillStyle=g;x.fillRect(wx-7,wy-7,ww+14,wh+14);
 x.fillStyle='rgba(60,40,20,.45)';x.fillRect(wx-1.2,wy-1.2,ww+2.4,wh+2.4);
 x.clearRect(wx,wy,ww,wh);
 const mull=(rx,ry,rw,rh)=>{const gg=x.createLinearGradient(rx,ry,rx+rw,ry+rh);gg.addColorStop(0,'#f2e6cc');gg.addColorStop(1,'#b89f78');x.fillStyle=gg;x.fillRect(rx,ry,rw,rh);};
 mull(wx+ww/2-2,wy,4,wh);mull(wx,wy+wh/2-2,ww,4);
 x.save();x.shadowColor='rgba(0,0,0,.5)';x.shadowBlur=6;x.shadowOffsetY=3;g=x.createLinearGradient(0,wy+wh+4,0,wy+wh+12);g.addColorStop(0,'#f4e8d0');g.addColorStop(1,'#a88f68');x.fillStyle=g;x.fillRect(wx-12,wy+wh+5,ww+24,7);x.restore();
 const curtain=(cx0,cw,dir)=>{x.save();x.shadowColor='rgba(0,0,0,.5)';x.shadowBlur=10;x.shadowOffsetX=dir*3;const gg=x.createLinearGradient(cx0,0,cx0+cw,0);for(let k=0;k<=8;k++){const f=k/8;gg.addColorStop(f,k%2?'#8a9a78':'#a9b894');}
  x.fillStyle=gg;x.beginPath();x.moveTo(cx0,wy-12);x.lineTo(cx0+cw,wy-12);x.bezierCurveTo(cx0+cw+dir*2,wy+60,cx0+cw-dir*6,wy+120,cx0+cw-dir*4,wy+wh+30);x.lineTo(cx0,wy+wh+30);x.closePath();x.fill();x.restore();
  const sh=x.createLinearGradient(0,wy-12,0,wy+wh+30);sh.addColorStop(0,'rgba(20,10,0,.35)');sh.addColorStop(0.5,'rgba(0,0,0,0)');sh.addColorStop(1,'rgba(20,10,0,.3)');x.fillStyle=sh;x.fillRect(cx0-4,wy-12,cw+8,wh+42);};
 curtain(wx-22,26,1);curtain(wx+ww-4,26,-1);
 x.fillStyle='#3a2a1a';x.fillRect(wx-28,wy-16,ww+56,3.5);x.fillStyle='rgba(255,220,160,.35)';x.fillRect(wx-28,wy-16,ww+56,1);
 // shelf
 x.save();x.shadowColor='rgba(0,0,0,.6)';x.shadowBlur=9;x.shadowOffsetY=5;g=x.createLinearGradient(0,92,0,101);g.addColorStop(0,'#a8754a');g.addColorStop(0.5,'#7a5232');g.addColorStop(1,'#4a2e1a');x.fillStyle=g;x.fillRect(496,92,128,8);x.restore();
 x.save();x.globalCompositeOperation='multiply';x.fillStyle=pat;x.globalAlpha=0.5;x.fillRect(496,92,128,8);x.restore();
 // pot + plant
 for(let i=0;i<16;i++){const a=-2.6+i*0.13+Math.sin(i*7)*0.1,L=20+Math.sin(i*3.1)*8;const bx=531,by=69;const ex=bx+Math.cos(a)*L,ey=by+Math.sin(a)*L;const lg=x.createLinearGradient(bx,by,ex,ey);lg.addColorStop(0,'#2f5a22');lg.addColorStop(1,i%2?'#8cc05a':'#6aa04f');x.strokeStyle=lg;x.lineWidth=2.2;x.lineCap='round';x.beginPath();x.moveTo(bx,by);x.quadraticCurveTo(bx+Math.cos(a)*L*0.4,by+Math.sin(a)*L*0.7-4,ex,ey);x.stroke();}
 g=x.createLinearGradient(518,0,544,0);g.addColorStop(0,'#8a4022');g.addColorStop(0.35,'#d07a4a');g.addColorStop(1,'#7a3a1e');x.fillStyle=g;x.beginPath();x.moveTo(518,72);x.lineTo(544,72);x.lineTo(541,92);x.lineTo(521,92);x.closePath();x.fill();x.fillStyle='#d8865a';x.fillRect(516.5,68,29,5);x.fillStyle='rgba(255,230,200,.3)';x.fillRect(516.5,68,29,1);
 // mug
 g=x.createLinearGradient(570,0,586,0);g.addColorStop(0,'#c8bca8');g.addColorStop(0.3,'#fbf6ec');g.addColorStop(1,'#a89c88');x.fillStyle=g;x.beginPath();x.roundRect(570,76,16,16,2);x.fill();x.strokeStyle='#d8cfc0';x.lineWidth=2.4;x.beginPath();x.arc(587,84,4,-1.3,1.3);x.stroke();x.fillStyle='#4a2c18';x.beginPath();x.ellipse(578,77.5,6.5,1.6,0,0,6.283);x.fill();
 x.strokeStyle='rgba(255,255,255,.18)';x.lineWidth=1.2;for(let k=0;k<3;k++){x.beginPath();x.moveTo(575+k*3,73);x.bezierCurveTo(572+k*3,66,580+k*3,62,576+k*3,54);x.stroke();}
 // books
 const book=(bx,bw,bh,c1)=>{const gg=x.createLinearGradient(bx,0,bx+bw,0);gg.addColorStop(0,shade(c1,0.6));gg.addColorStop(0.4,c1);gg.addColorStop(1,shade(c1,0.55));x.fillStyle=gg;x.fillRect(bx,92-bh,bw,bh);x.fillStyle='rgba(240,200,110,.7)';x.fillRect(bx+1,92-bh+4,bw-2,1);x.fillRect(bx+1,92-6,bw-2,1);};
 book(596,8,30,'#4a6a9a');book(604.5,8,34,'#9a4a3a');book(613,6,27,'#5a7a4a');
 // desk
 const dy=mode===1?300:338;x.save();g=x.createLinearGradient(0,dy,0,360);g.addColorStop(0,'#a06c40');g.addColorStop(0.06,'#7a5232');g.addColorStop(1,'#4a2e1a');x.fillStyle=g;x.fillRect(0,dy,640,360-dy);
 x.globalCompositeOperation='multiply';const m2=new DOMMatrix();m2.rotateSelf(90);m2.scaleSelf(0.5,1.4);pat.setTransform(m2);x.fillStyle=pat;x.globalAlpha=0.6;x.fillRect(0,dy,640,360-dy);x.restore();
 x.fillStyle='rgba(255,220,170,.35)';x.fillRect(0,dy,640,1.2);x.fillStyle='rgba(0,0,0,.35)';x.fillRect(0,dy-2,640,2);
 // tank contact shadow (screen space)
 x.setTransform(1,0,0,1,0,0);const tc={};setupCam(tc,mode);const pp=(a,b,cc)=>P(a,-SUB-5,b,tc);const poly=[pp(0,0),pp(TW,0),pp(TW,TD),pp(0,TD)];x.filter=`blur(${10*RS}px)`;x.fillStyle='rgba(8,4,2,.6)';x.beginPath();poly.forEach((p,i)=>i?x.lineTo(p[0]+6*RS,p[1]+5*RS):x.moveTo(p[0]+6*RS,p[1]+5*RS));x.closePath();x.fill();x.filter='none';
 ROOMC[mode]=c;return c;}
function shade(hex,f){const n=parseInt(hex.slice(1),16);const r=Math.min(255,((n>>16)&255)*f)|0,g=Math.min(255,((n>>8)&255)*f)|0,b=Math.min(255,(n&255)*f)|0;return `rgb(${r},${g},${b})`;}
function drawSky(s,now){const L=lightLevel();const {x:wx,y:wy,w:ww,h:wh}=WIN;const X=wx*RS,Y=wy*RS,Wd=ww*RS,Hd=wh*RS;s.save();s.beginPath();s.rect(X,Y,Wd,Hd);s.clip();
 const g=s.createLinearGradient(0,Y,0,Y+Hd);const mixh=(a,b,t)=>{const A=parseInt(a.slice(1),16),B_=parseInt(b.slice(1),16);const f=k=>Math.round(((A>>k)&255)*(1-t)+((B_>>k)&255)*t);return `rgb(${f(16)},${f(8)},${f(0)})`;};const nt=1-L;
 g.addColorStop(0,mixh('#6f9cc8','#070b1e',nt));g.addColorStop(0.65,mixh('#e9c9a0','#1c2244',nt));g.addColorStop(1,mixh('#f6b878','#2a2a48',nt));s.fillStyle=g;s.fillRect(X,Y,Wd,Hd);
 if(nt>0.4){s.fillStyle=`rgba(240,240,255,${(nt-0.4)*1.5})`;for(let i=0;i<26;i++){const r=(0.5+hash3(i,3,2))*RS*0.7;s.fillRect(X+hash3(i,1,2)*Wd,Y+hash3(i,2,2)*Hd*0.6,r,r);}const mg=s.createRadialGradient(X+Wd*0.72,Y+Hd*0.22,0,X+Wd*0.72,Y+Hd*0.22,22*RS);mg.addColorStop(0,`rgba(250,248,230,${nt})`);mg.addColorStop(0.25,`rgba(240,240,220,${nt*0.9})`);mg.addColorStop(0.3,`rgba(200,210,255,${nt*0.25})`);mg.addColorStop(1,'rgba(200,210,255,0)');s.fillStyle=mg;s.fillRect(X,Y,Wd,Hd);}
 else{const sg=s.createRadialGradient(X+Wd*0.3,Y+Hd*0.62,0,X+Wd*0.3,Y+Hd*0.62,50*RS);sg.addColorStop(0,`rgba(255,240,200,${L*0.95})`);sg.addColorStop(0.2,`rgba(255,220,150,${L*0.6})`);sg.addColorStop(1,'rgba(255,200,120,0)');s.fillStyle=sg;s.fillRect(X,Y,Wd,Hd);}
 const t=now*0.001;s.fillStyle=`rgba(255,255,255,${0.35*L+0.05})`;for(let i=0;i<4;i++){const cx=X+(((i*41+t*1.5*(1+i*0.3))%170)-25)*RS,cy=Y+(14+i*9)*RS;for(let k=0;k<4;k++){s.beginPath();s.ellipse(cx+k*7*RS,cy+Math.sin(k*2)*2*RS,9*RS,4*RS,0,0,6.283);s.fill();}}
 const hill=(base,amp,f,ph,c)=>{s.fillStyle=c;s.beginPath();s.moveTo(X,Y+Hd);for(let i=0;i<=40;i++){const xx=i/40;s.lineTo(X+xx*Wd,Y+Hd*base-Math.sin(xx*f+ph)*amp*RS-Math.sin(xx*f*2.7+ph*2)*amp*0.4*RS);}s.lineTo(X+Wd,Y+Hd);s.fill();};
 hill(0.72,6,5,1,mixh('#8aa0a8','#1a1f38',nt));hill(0.8,5,8,3,mixh('#5f7a5a','#141a2a',nt));
 s.fillStyle=mixh('#3f5a38','#0e1220',nt);for(let i=0;i<9;i++){const tx=X+(8+i*13+hash3(i,5,5)*6)*RS,ty=Y+Hd*0.86,th=(10+hash3(i,6,5)*12)*RS;s.beginPath();s.moveTo(tx,ty-th);s.lineTo(tx+4*RS,ty);s.lineTo(tx-4*RS,ty);s.fill();}
 if(SND.rain){s.strokeStyle=`rgba(210,225,255,${0.25+0.2*nt})`;s.lineWidth=0.7*RS;s.beginPath();for(let i=0;i<60;i++){const rx=X+((i*37.7)%ww)*RS,ry=Y+(((i*53+now*0.16*(1+i%3)))%(wh+10)-10)*RS;s.moveTo(rx,ry);s.lineTo(rx-1.2*RS,ry+7*RS);}s.stroke();
  for(let i=0;i<22;i++){const dx=X+hash3(i,7,1)*Wd,sp=0.004+hash3(i,8,1)*0.01,dy_=Y+((hash3(i,9,1)*Hd+now*sp)%Hd),r=(0.8+hash3(i,10,1)*1.4)*RS;s.fillStyle='rgba(20,30,50,.25)';s.beginPath();s.arc(dx,dy_,r,0,6.283);s.fill();s.fillStyle='rgba(255,255,255,.55)';s.beginPath();s.arc(dx-r*0.3,dy_-r*0.3,r*0.35,0,6.283);s.fill();}}
 s.fillStyle='rgba(255,255,255,.06)';s.beginPath();s.moveTo(X+Wd*0.1,Y);s.lineTo(X+Wd*0.35,Y);s.lineTo(X+Wd*0.05,Y+Hd);s.lineTo(X-Wd*0.2,Y+Hd);s.fill();
 s.restore();}
function wall3(s,c){const g=s.createLinearGradient(0,0,0,H);g.addColorStop(0,'#2a1a0e');g.addColorStop(0.6,'#4a3020');g.addColorStop(1,'#3a2416');s.fillStyle=g;s.fillRect(0,0,W,H);
 const pat=s.createPattern(woodTex(),'repeat');const m=new DOMMatrix();m.translateSelf(c.ox*0.25,0);m.scaleSelf(RS*1.2,RS*1.4);pat.setTransform(m);s.save();s.globalCompositeOperation='multiply';s.globalAlpha=0.6;s.fillStyle=pat;s.fillRect(0,0,W,H);s.restore();
 const pw=60*RS;for(let x=((c.ox*0.25)%pw+pw)%pw-pw;x<W;x+=pw){s.fillStyle='rgba(15,8,3,.6)';s.fillRect(x,0,2*RS,H);}}
function selRing(s,t,c,now){const sp=G.sel;if(!sp||!t.spiders.includes(sp)||!sp._dp)return;const q=Pv(sp._dp,c);const r=spSize(sp)*c.k*0.75*CSf(c);const fl=c.mode===1?0.5:0.38;const pulse=0.55+0.25*Math.sin(now*0.004);
 s.save();s.globalCompositeOperation='lighter';const rg=s.createRadialGradient(q[0],q[1],r*0.2,q[0],q[1],r*1.3);rg.addColorStop(0,`rgba(255,210,110,${0.18*pulse})`);rg.addColorStop(1,'rgba(255,210,110,0)');s.fillStyle=rg;s.beginPath();s.ellipse(q[0],q[1],r*1.3,r*1.3*fl,0,0,6.283);s.fill();
 s.strokeStyle=`rgba(255,215,120,${pulse})`;s.lineWidth=Math.max(1,0.9*RS);s.shadowColor='rgba(255,200,90,.9)';s.shadowBlur=6*RS;s.beginPath();s.ellipse(q[0],q[1],r,r*fl,0,0,6.283);s.stroke();s.restore();}
function lampPos(c){return c.mode===1?P(TW*0.55,TH+2,TD*0.5,c):P(TW*0.5,TH+2,c.mode===4?TD*0.88:TD*0.12,c);}
function glassFx(s,c){if(c.mode===1){const l=[P(0,TH,0,c),P(TW,TH,0,c),P(TW,TH,TD,c),P(0,TH,TD,c)];s.save();s.fillStyle='rgba(18,18,20,.16)';s.beginPath();l.forEach((p,i)=>i?s.lineTo(p[0],p[1]):s.moveTo(p[0],p[1]));s.closePath();s.fill();s.strokeStyle='rgba(30,30,32,.22)';s.lineWidth=Math.max(0.6,0.35*RS);s.beginPath();for(let x=4;x<TW;x+=4){const a=P(x,TH,0,c),b=P(x,TH,TD,c);s.moveTo(a[0],a[1]);s.lineTo(b[0],b[1]);}for(let z=4;z<TD;z+=4){const a=P(0,TH,z,c),b=P(TW,TH,z,c);s.moveTo(a[0],a[1]);s.lineTo(b[0],b[1]);}s.stroke();s.restore();}const FZ=c.mode===4?0:TD;const a=P(0,-SUB,FZ,c),b=P(TW,TH,FZ,c),a2=P(TW,-SUB,FZ,c),b2=P(0,TH,FZ,c);s.save();s.globalCompositeOperation='screen';
 const g=s.createLinearGradient(b2[0],b2[1],a2[0],a2[1]);g.addColorStop(0,'rgba(255,255,255,.10)');g.addColorStop(0.18,'rgba(255,255,255,0)');g.addColorStop(0.42,'rgba(255,250,235,.06)');g.addColorStop(0.47,'rgba(255,255,255,0)');g.addColorStop(0.85,'rgba(220,240,255,.04)');g.addColorStop(1,'rgba(255,255,255,.08)');
 s.fillStyle=g;s.beginPath();s.moveTo(a[0],a[1]);s.lineTo(a2[0],a2[1]);s.lineTo(b[0],b[1]);s.lineTo(b2[0],b2[1]);s.closePath();s.fill();
 s.strokeStyle='rgba(255,240,210,.35)';s.lineWidth=Math.max(1,0.4*RS);s.beginPath();s.moveTo(b2[0],b2[1]+1.5*RS);s.lineTo(b[0],b[1]+1.5*RS);s.stroke();s.restore();}
function lamp(s,c,L){const lp=lampPos(c);const k=c.k;const cw=k*24,chh=k*8;const on=0.85+0.15*L;s.save();
 // cone of light
 s.globalCompositeOperation='lighter';const bot=c.mode===1?P(TW*0.55,0,TD*0.5,c):P(TW*0.5,0,c.mode===4?TD*0.6:TD*0.4,c);const cg=s.createLinearGradient(lp[0],lp[1],lp[0],bot[1]);cg.addColorStop(0,`rgba(255,215,150,${0.13*on})`);cg.addColorStop(1,'rgba(255,215,150,0)');s.fillStyle=cg;s.beginPath();s.moveTo(lp[0]-cw*0.42,lp[1]);s.lineTo(lp[0]+cw*0.42,lp[1]);s.lineTo(lp[0]+cw*2.2,bot[1]);s.lineTo(lp[0]-cw*2.2,bot[1]);s.closePath();s.fill();
 s.globalCompositeOperation='source-over';s.shadowColor='rgba(0,0,0,.6)';s.shadowBlur=8*RS;s.shadowOffsetY=3*RS;
 s.strokeStyle='#161514';s.lineWidth=Math.max(1,k*0.5);s.beginPath();s.moveTo(lp[0],lp[1]-chh*1.9);s.bezierCurveTo(lp[0]+cw*0.1,lp[1]-chh*4,lp[0]+cw*0.6,lp[1]-chh*5,lp[0]+cw*0.7,-10);s.stroke();s.fillStyle='#262422';s.fillRect(lp[0]-k*1.6,lp[1]-chh*2.05,k*3.2,chh*0.6);
 const g=s.createLinearGradient(lp[0]-cw/2,0,lp[0]+cw/2,0);g.addColorStop(0,'#141413');g.addColorStop(0.3,'#4a4844');g.addColorStop(0.42,'#7a7670');g.addColorStop(0.6,'#2a2927');g.addColorStop(1,'#0e0e0d');s.fillStyle=g;
 s.beginPath();s.moveTo(lp[0]-cw/2,lp[1]);s.bezierCurveTo(lp[0]-cw*0.46,lp[1]-chh*1.1,lp[0]-cw*0.2,lp[1]-chh*1.6,lp[0],lp[1]-chh*1.6);s.bezierCurveTo(lp[0]+cw*0.2,lp[1]-chh*1.6,lp[0]+cw*0.46,lp[1]-chh*1.1,lp[0]+cw/2,lp[1]);s.closePath();s.fill();
 s.shadowBlur=0;s.shadowOffsetY=0;s.fillStyle='#2a2826';s.beginPath();s.ellipse(lp[0],lp[1],cw/2,chh*0.32,0,0,6.283);s.fill();
 const bg=s.createRadialGradient(lp[0],lp[1],0,lp[0],lp[1],cw*0.48);bg.addColorStop(0,`rgba(255,252,235,${on})`);bg.addColorStop(0.4,`rgba(255,226,160,${on*0.95})`);bg.addColorStop(1,`rgba(220,140,60,${on*0.4})`);s.fillStyle=bg;s.beginPath();s.ellipse(lp[0],lp[1],cw*0.44,chh*0.26,0,0,6.283);s.fill();
 s.globalCompositeOperation='lighter';const gl=s.createRadialGradient(lp[0],lp[1],0,lp[0],lp[1],cw*0.9);gl.addColorStop(0,`rgba(255,220,150,${0.22*on})`);gl.addColorStop(1,'rgba(255,220,150,0)');s.fillStyle=gl;s.fillRect(lp[0]-cw*1.4,lp[1]-cw*1.4,cw*2.8,cw*2.8);s.restore();}
function motes(s,c,now,L){const n=c.mode===3?30:55;s.save();s.globalCompositeOperation='lighter';const t=now*0.001;const cx=c.mode===1?TW*0.55:TW*0.5,cz=c.mode===1?TD*0.5:c.mode===4?TD*0.6:TD*0.4;
 for(let i=0;i<n;i++){const h1=hash3(i,1,77),h2=hash3(i,2,77),h3=hash3(i,3,77);const y=((h1*TH*1.1-t*(0.6+h2*1.2))%(TH*1.1)+TH*1.1)%(TH*1.1);const spread=(1-y/TH)*45+10;
  const x=cx+(h2-0.5)*spread*2+Math.sin(t*0.4+i)*3,z=cz+(h3-0.5)*spread+Math.cos(t*0.33+i*1.7)*3;const q=P(x,y,z,c);const tw=0.5+0.5*Math.sin(t*2+i*3);const a=(0.18+0.35*tw)*(0.35+0.65*L)*Math.min(1,(TH-y)/20);
  s.fillStyle=`rgba(255,236,190,${a})`;s.beginPath();s.arc(q[0],q[1],(0.35+h3*0.6)*RS*(c.mode===3?2:1),0,6.283);s.fill();}s.restore();}
let SKY=null;function skyC(s,now){const X=Math.floor(WIN.x*RS),Y=Math.floor(WIN.y*RS),w=Math.ceil(WIN.w*RS)+2,h=Math.ceil(WIN.h*RS)+2;if(w<2||h<2)return;if(!SKY||SKY.cv.width!==W||SKY.cv.height!==H){const cv=document.createElement('canvas');cv.width=W;cv.height=H;SKY={cv,x:cv.getContext('2d'),t:-1e9,k:''};}const k=X+','+Y+','+w+','+h;if(now-SKY.t>250||SKY.k!==k){SKY.t=now;SKY.k=k;SKY.x.setTransform(1,0,0,1,0,0);SKY.x.clearRect(0,0,W,H);drawSky(SKY.x,now);}s.drawImage(SKY.cv,X,Y,w,h,X,Y,w,h);}
function compose(t,c,now){const s=ctx;s.setTransform(1,0,0,1,0,0);s.globalCompositeOperation='source-over';s.globalAlpha=1;
 if(c.mode===3)wall3(s,c);else{skyC(s,now);}
 // v10 containment guard: cached substrate/static decor must never paint beyond
 // the currently projected terrarium volume in Close-up, even during a cache refresh.
 if(c.mode===3){s.save();tankClip(s,c);s.drawImage(t.stat.cv,0,0);s.restore();}else s.drawImage(t.stat.cv,0,0);
 selRing(s,t,c,now);
 s.save();tankClip(s,c);drawDL(s);if(DLX)DLX(s);s.restore();
 const fg=FGC[camKey(c)];s.drawImage(fg.cv,Math.round(c.ox+fg.offX),Math.round(c.oy+fg.offY));
 glassFx(s,c);lamp(s,c,lightLevel());}
// ---------- WebGL post-processing ----------
let _pfxSaved8={};try{_pfxSaved8=JSON.parse(localStorage.getItem('jtFX')||'{}')||{};}catch(_){}
const PFX=Object.assign({post:true,tilt:true,bloom:true,grain:true},_pfxSaved8);
let GLP=null,cv2d=null;
const POST8={lost:false,noGL:false,errs:0,fb:null,fx:null};
function syncFallback8(){const f=POST8.fb;if(!f)return;if(f.width!==W)f.width=W;if(f.height!==H)f.height=H;if(f.style.width!==cv.style.width)f.style.width=cv.style.width;if(f.style.height!==cv.style.height)f.style.height=cv.style.height;const l=cv.offsetLeft+'px',t=cv.offsetTop+'px';if(f.style.left!==l)f.style.left=l;if(f.style.top!==t)f.style.top=t;}
function fallbackCtx8(){if(!POST8.fb){const f=document.createElement('canvas');f.width=W;f.height=H;f.style.position='absolute';f.style.pointerEvents='none';f.style.display='none';f.style.zIndex='0';$('stage').insertBefore(f,ov);ov.style.zIndex='1';POST8.fb=f;POST8.fx=f.getContext('2d');window.__jtSyncFallback=syncFallback8;}syncFallback8();POST8.fb.style.display='block';return POST8.fx;}
function drawFallback8(){const x=fallbackCtx8();x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,W,H);x.drawImage(src,VIEW.cx-W/2/VIEW.z,VIEW.cy-H/2/VIEW.z,W/VIEW.z,H/VIEW.z,0,0,W,H);}
function hideFallback8(){if(POST8.fb)POST8.fb.style.display='none';}
cv.addEventListener('webglcontextlost',e=>{e.preventDefault();POST8.lost=true;GLP=null;try{drawFallback8();}catch(_){}console.warn('WebGL display context lost; using 2D fallback');});
cv.addEventListener('webglcontextrestored',()=>{POST8.lost=false;POST8.noGL=false;POST8.errs=0;GLP=null;try{localStorage.removeItem('jtNoGL');}catch(e){}console.info('WebGL display context restored');});
function initGL(){if(SOFTGL||QUAL<2)return null;try{if(!localStorage.getItem('jtForceGPU')){if(localStorage.getItem('jtNoGL'))return null;if(localStorage.getItem('jtGLBusy')){localStorage.setItem('jtNoGL','1');localStorage.removeItem('jtGLBusy');return null;}}localStorage.setItem('jtGLBusy','1');setTimeout(()=>localStorage.removeItem('jtGLBusy'),1500);}catch(e){}let gl=null;try{gl=cv.getContext('webgl',{alpha:false,antialias:false,depth:false,stencil:false,premultipliedAlpha:false,powerPreference:'high-performance'});}catch(e){gl=null;}if(!gl)return null;
 const VS='attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
 const FS={bright:'precision mediump float;varying vec2 uv;uniform sampler2D t0;uniform float thr;void main(){vec3 c=texture2D(t0,uv).rgb;float l=max(c.r,max(c.g,c.b));gl_FragColor=vec4(c*smoothstep(thr,thr+.22,l),1.);}',
  blur:'precision mediump float;varying vec2 uv;uniform sampler2D t0;uniform vec2 d;void main(){vec3 c=texture2D(t0,uv).rgb*.227027;c+=texture2D(t0,uv+d*1.3846).rgb*.3162162;c+=texture2D(t0,uv-d*1.3846).rgb*.3162162;c+=texture2D(t0,uv+d*3.2307).rgb*.0702703;c+=texture2D(t0,uv-d*3.2307).rgb*.0702703;gl_FragColor=vec4(c,1.);}',
  fin:`precision mediump float;varying vec2 uv;uniform sampler2D t0,t1,t2;uniform vec2 res,focus,ray,zc;uniform float zm;uniform float tilt,radial,bloom,rays,grain,grade,time,night;
float hsh(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
void main(){vec2 q=uv-.5;vec2 U=zc+(uv-.5)/zm;vec2 ca=q*.0016*grade/zm;vec3 s=vec3(texture2D(t0,U+ca).r,texture2D(t0,U).g,texture2D(t0,U-ca).b);
 vec3 b=texture2D(t2,U).rgb;float dd=radial>.5?length((U-focus)*vec2(res.x/res.y*.55,1.)):abs(U.y-focus.y);float m=smoothstep(radial>.5?.1:.14,radial>.5?.42:.5,dd)*tilt;vec3 c=mix(s,b,m);
 c+=texture2D(t1,U).rgb*bloom;
 if(rays>0.){vec2 dl=(U-ray)/12.;vec2 p=U;float dec=1.;vec3 g=vec3(0.);for(int i=0;i<12;i++){p-=dl;g+=texture2D(t1,p).rgb*dec;dec*=.9;}c+=g*rays*vec3(1.,.86,.62)/10.;}
 if(grade>0.){float l=dot(c,vec3(.299,.587,.114));c=mix(vec3(l),c,1.1);c+=vec3(-.012,.022,.04)*(1.-smoothstep(0.,.45,l))*(1.+night);c+=vec3(.055,.028,-.025)*smoothstep(.45,1.,l);c=mix(c,c*c*(3.-2.*c),.35);
  c*=1.-dot(q,q)*.9*grade;c+=(hsh(uv*res+fract(time)*91.)-.5)*grain;}
 gl_FragColor=vec4(c,1.);}`};
 const sh=(type,src)=>{const o=gl.createShader(type);gl.shaderSource(o,src);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(o));return o;};
 const P_={};try{for(const k in FS){const p=gl.createProgram();gl.attachShader(p,sh(gl.VERTEX_SHADER,VS));gl.attachShader(p,sh(gl.FRAGMENT_SHADER,FS[k]));gl.bindAttribLocation(p,0,'p');gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error('link');P_[k]={p,u:{}};}}catch(e){console.warn('post fx disabled',e);return null;}
 const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
 const tex=(w,h)=>{const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);if(w)gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,w,h,0,gl.RGBA,gl.UNSIGNED_BYTE,null);return t;};
 const fbo=(w,h)=>{w=Math.max(1,Math.round(w));h=Math.max(1,Math.round(h));const t=tex(w,h),f=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,f);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,t,0);return {t,f,w,h};};
 const G_={gl,P:P_,src:tex(0,0),q1:fbo(W/8,H/8),q2:fbo(W/8,H/8),h1:fbo(W/4,H/4),h2:fbo(W/4,H/4)};gl.bindFramebuffer(gl.FRAMEBUFFER,null);return G_;}
function gpass(name,target,texs,un){const gl=GLP.gl,pr=GLP.P[name];gl.bindFramebuffer(gl.FRAMEBUFFER,target?target.f:null);gl.viewport(0,0,target?target.w:W,target?target.h:H);gl.useProgram(pr.p);
 const U=n=>pr.u[n]!==undefined?pr.u[n]:(pr.u[n]=gl.getUniformLocation(pr.p,n));texs.forEach((t,i)=>{gl.activeTexture(gl.TEXTURE0+i);gl.bindTexture(gl.TEXTURE_2D,t);gl.uniform1i(U('t'+i),i);});
 for(const k in un){const v=un[k];if(typeof v==='number')gl.uniform1f(U(k),v);else gl.uniform2f(U(k),v[0],v[1]);}gl.drawArrays(gl.TRIANGLE_STRIP,0,4);}
function post(t,c,now,L){try{
 if(POST8.lost){drawFallback8();return;}
 if(GLP===null&&!POST8.noGL){GLP=initGL();if(!GLP)POST8.noGL=true;}if(!GLP){drawFallback8();return;}
 const gl=GLP.gl;if(!gl||gl.isContextLost()){POST8.lost=true;GLP=null;drawFallback8();return;}
 gl.bindTexture(gl.TEXTURE_2D,GLP.src);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,src);
 const on=PFX.post;const {q1,q2,h1,h2}=GLP;let fx=W/2,fy=H/2;const sp=(G.sel&&t.spiders.includes(G.sel))?G.sel:(c.mode===3?t.spiders.find(x=>!x.owner):null);if(sp&&sp._dp){const q=Pv(sp._dp,c);fx=q[0];fy=q[1];}else{const q=P(TW/2,15,TD/2,c);fx=q[0];fy=q[1];}if(c.mode!==3){const q=P(TW/2,15,TD/2,c);fy=lerp(q[1],fy,0.35);}
 if(post._fy===undefined){post._fx=fx;post._fy=fy;}post._fx+=(fx-post._fx)*0.08;post._fy+=(fy-post._fy)*0.08;const tiltA=on&&PFX.tilt&&PG.lvl<1?(c.mode===1?1:c.mode===3?0.9:0.55)/Math.sqrt(VIEW.z):0,bloomA=on&&PFX.bloom&&PG.lvl<2?0.42:0;
 if(bloomA>0){gpass('bright',q1,[GLP.src],{thr:0.82});gpass('blur',q2,[q1.t],{d:[1/q1.w,0]});gpass('blur',q1,[q2.t],{d:[0,1/q1.h]});}if(tiltA>0){gpass('blur',h1,[GLP.src],{d:[3/W,0]});gpass('blur',h2,[h1.t],{d:[0,1.2/h1.h]});}
 let ray=[0.5,0.9],rays=0;if(bloomA>0){if(c.mode!==3){ray=[(WIN.x+WIN.w*0.5)*RS/W,1-(WIN.y+WIN.h*0.55)*RS/H];rays=0.32*L+0.06;}else{const lp=lampPos(c);ray=[lp[0]/W,1-lp[1]/H];rays=0.2;}}
 gpass('fin',null,[GLP.src,q1.t,h2.t],{res:[W,H],focus:[post._fx/W,1-post._fy/H],ray,tilt:tiltA,radial:c.mode===3?1:0,bloom:bloomA,rays,grain:on&&PFX.grain?0.035:0,grade:on?(PFX.grain?1:0.6):0,time:now*0.001,night:1-L,zc:[VIEW.cx/W,1-VIEW.cy/H],zm:VIEW.z});POST8.errs=0;hideFallback8();
 }catch(e){POST8.errs++;console.warn('post-processing frame failed; using 2D fallback',e);try{drawFallback8();}catch(_){}if(POST8.errs>=2){GLP=null;POST8.lost=true;POST8.noGL=true;try{localStorage.setItem('jtNoGL','1');}catch(_){}}}}
// settings
$('setBtn').onclick=()=>{$('qSel').value=String(QUAL>=3?3:QUAL>=2?2:1);$('fxPost').checked=PFX.post;$('fxTilt').checked=PFX.tilt;$('fxBloom').checked=PFX.bloom;$('fxGrain').checked=PFX.grain;$('setModal').style.display='flex';};
$('qSel').onchange=e=>{localStorage.setItem('jtQ',e.target.value);['jtNoSDF','jtNoGL','jtSdfBusy','jtGLBusy'].forEach(k=>localStorage.removeItem(k));save();location.reload();};
for(const [id,k] of [['fxPost','post'],['fxTilt','tilt'],['fxBloom','bloom'],['fxGrain','grain']])$(id).onchange=e=>{PFX[k]=e.target.checked;localStorage.setItem('jtFX',JSON.stringify(PFX));};


