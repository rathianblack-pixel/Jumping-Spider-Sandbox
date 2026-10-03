// ================= v31 natural presentation, camera framing, ambience =================
(function(){
'use strict';
const BASE_SETUP31=setupCam,BASE_MUSIC31=musicTick,BASE_SETCLICK31=$('setBtn').onclick,BASE_SAVE_P31=save,BASE_LOAD_P31=load;
const BG31={
 hollow:{name:'Ancient Tree Hollow',a:'#2b1b12',b:'#6f5134',c:'#7aa05b',m:'hollow'},
 moss:{name:'Mossy Forest Floor',a:'#1e3020',b:'#557245',c:'#a4b981',m:'forest'},
 meadow:{name:'Sunlit Meadow',a:'#86a8c4',b:'#a3ba75',c:'#e2d7a1',m:'meadow'},
 canopy:{name:'Rainforest Canopy',a:'#173c2a',b:'#3f7652',c:'#90b778',m:'canopy'},
 twilight:{name:'Twilight Woodland',a:'#10182b',b:'#283d4b',c:'#776c91',m:'twilight'},
 stone:{name:'Moss Stone Garden',a:'#39433d',b:'#778075',c:'#9ba68c',m:'stone'},
 log:{name:'Fallen Log Interior',a:'#251810',b:'#68442a',c:'#7c8d54',m:'log'}
};
function currentTheme31(){return cur()?.bgTheme31||'hollow';}
function loadThemes31(){try{const a=JSON.parse(localStorage.getItem('jtBg31')||'[]');for(let i=0;i<(G.tanks||[]).length;i++)if(BG31[a[i]])G.tanks[i].bgTheme31=a[i];}catch(_){}}
function saveThemes31(){try{localStorage.setItem('jtBg31',JSON.stringify((G.tanks||[]).map(t=>t.bgTheme31||'hollow')));}catch(_){}}
loadThemes31();
function blob31(x,cx,cy,rx,ry,fill,alpha=1,blur=0){x.save();x.globalAlpha=alpha;if(blur)x.filter=`blur(${blur}px)`;x.fillStyle=fill;x.beginPath();x.ellipse(cx,cy,rx,ry,0,0,Math.PI*2);x.fill();x.restore();}
function naturalCanvas31(id){const k=id+'|'+W+'x'+H;if(naturalCanvas31.c?.has(k))return naturalCanvas31.c.get(k);naturalCanvas31.c=naturalCanvas31.c||new Map();const d=BG31[id]||BG31.hollow,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');x.scale(RS,RS);const w=640,h=360;
  const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,d.a);g.addColorStop(.56,d.b);g.addColorStop(1,d.c);x.fillStyle=g;x.fillRect(0,0,w,h);
  if(d.m==='hollow'||d.m==='log'){
    // Soft bark tunnel around a luminous natural opening.
    blob31(x,320,175,300,195,'rgba(34,20,12,.55)',1,18);blob31(x,320,170,240,155,d.m==='hollow'?'rgba(104,132,78,.72)':'rgba(92,112,68,.60)',1,26);
    x.save();x.filter='blur(12px)';for(let i=0;i<9;i++){const y=i*48-15,th=24+hash3(i,2,31)*24;x.strokeStyle=`rgba(${70+i*3},${42+i*2},${24+i},.45)`;x.lineWidth=th;x.beginPath();x.moveTo(-30,y);x.bezierCurveTo(150,y+35,440,y-28,680,y+15);x.stroke();}x.restore();
    for(let i=0;i<14;i++)blob31(x,80+hash3(i,3,33)*490,70+hash3(i,4,33)*230,7+hash3(i,5,33)*18,4+hash3(i,6,33)*12,i%3?'rgba(130,160,82,.22)':'rgba(230,190,110,.18)',1,10);
  }else if(d.m==='meadow'){
    x.save();x.filter='blur(7px)';for(let i=0;i<75;i++){const px=hash3(i,1,42)*w,py=210+hash3(i,2,42)*150,ht=30+hash3(i,3,42)*95;x.strokeStyle=i%6===0?'rgba(225,215,130,.26)':'rgba(74,112,56,.32)';x.lineWidth=2+hash3(i,4,42)*4;x.beginPath();x.moveTo(px,h+10);x.quadraticCurveTo(px+10,py+ht*.4,px+(hash3(i,5,42)-.5)*28,py);x.stroke();}x.restore();
    for(let i=0;i<18;i++)blob31(x,40+hash3(i,6,43)*560,65+hash3(i,7,43)*210,7+hash3(i,8,43)*20,7+hash3(i,9,43)*20,i%3?'rgba(255,239,186,.20)':'rgba(245,190,145,.16)',1,12);
  }else if(d.m==='stone'){
    x.save();x.filter='blur(10px)';for(let i=0;i<14;i++){const px=30+hash3(i,10,31)*580,py=175+hash3(i,11,31)*180,rx=36+hash3(i,12,31)*75,ry=20+hash3(i,13,31)*42;blob31(x,px,py,rx,ry,i%2?'#6f786f':'#59645a',.55,0);blob31(x,px-rx*.18,py-ry*.35,rx*.65,ry*.35,'rgba(190,202,180,.20)',1,0);}x.restore();
  }else{
    // Forest/canopy/twilight: broad defocused foliage layers and shafts.
    x.save();x.filter='blur(15px)';for(let i=0;i<28;i++){const px=-30+hash3(i,1,51)*700,py=-20+hash3(i,2,51)*400,rx=25+hash3(i,3,51)*75,ry=14+hash3(i,4,51)*48;const fill=d.m==='twilight'?(i%3?'rgba(54,74,91,.35)':'rgba(104,90,126,.22)'):(i%3?'rgba(42,96,55,.38)':'rgba(118,151,83,.24)');blob31(x,px,py,rx,ry,fill,1,0);}x.restore();
    x.save();x.globalCompositeOperation='screen';for(let i=0;i<4;i++){const sx=80+i*150,gg=x.createLinearGradient(sx,0,sx+90,h);gg.addColorStop(0,d.m==='twilight'?'rgba(150,170,210,.06)':'rgba(255,244,190,.12)');gg.addColorStop(1,'rgba(255,240,180,0)');x.fillStyle=gg;x.beginPath();x.moveTo(sx,0);x.lineTo(sx+50,0);x.lineTo(sx+160,h);x.lineTo(sx+80,h);x.closePath();x.fill();}x.restore();
  }
  // Depth veil keeps the habitat itself dominant.
  const v=x.createRadialGradient(320,185,60,320,185,360);v.addColorStop(0,'rgba(255,255,255,.035)');v.addColorStop(.56,'rgba(10,15,12,.06)');v.addColorStop(1,'rgba(5,8,7,.34)');x.fillStyle=v;x.fillRect(0,0,w,h);
  naturalCanvas31.c.set(k,c);return c;
}
roomC=function(mode){return naturalCanvas31(currentTheme31());};
skyC=function(){/* natural background is already full-frame; no room window overlay */};
wall3=function(s,c){s.save();s.setTransform(1,0,0,1,0,0);s.drawImage(naturalCanvas31(currentTheme31()),0,0,W,H);s.restore();};
// Keep environmental light, remove the literal desk lamp fixture.
lamp=function(s,c,L){const q=P(TW*.52,TH*.74,TD*.45,c),r=Math.max(80*RS,c.k*Math.max(TW,TD)*.42);s.save();s.globalCompositeOperation='screen';const g=s.createRadialGradient(q[0],q[1],0,q[0],q[1],r);g.addColorStop(0,`rgba(255,226,170,${.08+.08*L})`);g.addColorStop(1,'rgba(255,220,160,0)');s.fillStyle=g;s.fillRect(q[0]-r,q[1]-r,r*2,r*2);s.restore();};

// Landscape showcase cameras: habitat fills the composition, backgrounds stay atmospheric.
function projectedBounds31(c,yTop=TH){let mnx=1e9,mny=1e9,mxx=-1e9,mxy=-1e9;for(const x of [0,TW])for(const y of [-SUB,yTop])for(const z of [0,TD]){const q=P(x,y,z,c);mnx=Math.min(mnx,q[0]);mxx=Math.max(mxx,q[0]);mny=Math.min(mny,q[1]);mxy=Math.max(mxy,q[1]);}return {mnx,mny,mxx,mxy,w:mxx-mnx,h:mxy-mny};}
function visibleTop31(t){let y=20;for(const d of t?.decor||[]){const D=DECOR[d.type];if(!D)continue;y=Math.max(y,D.kind==='plat'?d.h:(d.baseY31||0)+(D.ph||D.h||0));for(const p of d.perches||[])y=Math.max(y,p.y);}for(const e of [...(t?.spiders||[]),...(t?.prey||[])])if(!e.owner)y=Math.max(y,e.pos?.y||0);return clamp(y+8,24,TH);}
setupCam=function(c,mode){const r=BASE_SETUP31(c,mode);if(window.__JT22?.portrait||mode===3)return r;const yt=visibleTop31(cur()),b=projectedBounds31(c,yt),fw=(W*.91)/Math.max(1,b.w),fh=(H*.86)/Math.max(1,b.h),f=clamp(Math.min(fw,fh),1,1.34);c.k*=f;const b2=projectedBounds31(c,yt),cx=(b2.mnx+b2.mxx)/2,cy=(b2.mny+b2.mxy)/2;c.ox+=W*.5-cx;c.oy+=H*.51-cy;return r;};

// Background selector lives in Settings and is stored per habitat.
const sel=$('bgSel');if(sel){sel.innerHTML='';for(const [id,d] of Object.entries(BG31)){const o=document.createElement('option');o.value=id;o.textContent=d.name;sel.appendChild(o);}sel.value=currentTheme31();sel.onchange=e=>{cur().bgTheme31=BG31[e.target.value]?e.target.value:'hollow';saveThemes31();naturalCanvas31.c?.clear();for(const t of G.tanks||[]){t.stat=null;t.bgKey='';}toast(`🌿 Background: ${BG31[cur().bgTheme31].name}`);};}
$('setBtn').onclick=()=>{BASE_SETCLICK31&&BASE_SETCLICK31();if(sel)sel.value=currentTheme31();};

// Rain is gone. The ambience is sparse and generated from the critters themselves.
SND.rain=false;const rain=$('rainChk');if(rain){rain.checked=false;rain.disabled=true;rain.closest('label').style.display='none';}
bird=function(){};
function softWing31(){try{if(SND.ctx)nz(.055,'bandpass',1800,.012,2600);}catch(_){}}
function softScuttle31(){try{if(SND.ctx)nz(.045,'lowpass',900,.010,500);}catch(_){}}
musicTick=function(){const r=BASE_MUSIC31();try{SND.rain=false;if(SND.rainG)SND.rainG.gain.value=0;const t=cur();if(!SND.ctx||!t||!SND.room)return r;const flyers=t.prey.filter(p=>!p.owner&&PREY[p.type]?.flyer&&p.surf?.t==='air').length,walkers=t.prey.filter(p=>!p.owner&&!PREY[p.type]?.flyer&&p.spd>2).length;if(flyers&&rand()<.0008*Math.min(4,flyers))softWing31();if(walkers&&rand()<.0005*Math.min(5,walkers))softScuttle31();}catch(_){}return r;};

save=function(){const r=BASE_SAVE_P31();saveThemes31();return r;};
load=function(){const r=BASE_LOAD_P31();if(r){loadThemes31();naturalCanvas31.c?.clear();}return r;};
window.__JT31_PRESENT={BG31,naturalCanvas31,projectedBounds31,visibleTop31};
})();
// ================= end v31 presentation =================
