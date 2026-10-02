// ================= v17 compact tank selector =================
(function(){
  const JT17={ver:18};
  let picker=null;
  function ensureTankPicker17(){
    if(picker)return picker;
    const st=document.createElement('style');
    st.textContent=`
      #tabs{flex:0 0 auto;min-width:0}
      #tankTab17{display:flex;align-items:center;gap:6px;min-width:150px;max-width:235px;white-space:nowrap}
      #tankTab17 .tankName17{overflow:hidden;text-overflow:ellipsis;min-width:0;max-width:155px;display:inline-block;vertical-align:bottom}
      #habBtn15{display:none!important}
      #tankPicker17{position:fixed;z-index:50;display:none;width:min(330px,calc(100vw - 16px));max-height:min(72vh,560px);overflow:auto;padding:7px;background:linear-gradient(rgba(50,30,16,.985),rgba(29,17,9,.985));border:1px solid #c09343;box-shadow:0 10px 34px rgba(0,0,0,.68);border-radius:7px;color:#f8ead0}
      #tankPicker17 .tankHead17{display:flex;justify-content:space-between;align-items:center;padding:4px 5px 8px;border-bottom:1px solid rgba(216,172,92,.35);margin-bottom:5px;font-size:13px;color:#e9c979}
      #tankPicker17 .tankRow17{display:flex;width:100%;align-items:center;justify-content:space-between;text-align:left;padding:8px 9px;margin:3px 0;border-radius:5px;background:linear-gradient(#684325,#422816);border:1px solid #28170b;color:#f8ead0;min-height:48px}
      #tankPicker17 .tankRow17:hover{background:linear-gradient(#815630,#50301a)}
      #tankPicker17 .tankRow17.on{background:linear-gradient(#d5aa52,#946423);color:#241407;border-color:#e5c273}
      #tankPicker17 .tankRow17 .main17{min-width:0;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:bold}
      #tankPicker17 .tankRow17 .sub17{display:block;font-size:11px;font-weight:normal;opacity:.78;margin-top:2px;white-space:nowrap}
      #tankPicker17 .count17{font-size:12px;white-space:nowrap;margin-left:10px}
      #tankManage17{width:100%;margin-top:7px;padding:8px 10px}
      @media(max-width:600px){#tankTab17{min-width:120px;max-width:165px}#tankTab17 .tankName17{max-width:95px}#tankPicker17{max-height:68vh}}
    `;
    document.head.appendChild(st);
    picker=document.createElement('div');picker.id='tankPicker17';picker.setAttribute('role','menu');picker.setAttribute('aria-label','Choose habitat');document.body.appendChild(picker);
    document.addEventListener('pointerdown',e=>{if(picker.style.display!=='block')return;const b=$('tankTab17');if(!picker.contains(e.target)&&e.target!==b&&!b?.contains(e.target))closeTankPicker17();});
    window.addEventListener('resize',()=>{if(picker.style.display==='block')positionTankPicker17();});
    window.addEventListener('scroll',()=>{if(picker.style.display==='block')positionTankPicker17();},{passive:true});
    window.addEventListener('keydown',e=>{if(e.key==='Escape')closeTankPicker17();});
    return picker;
  }
  function positionTankPicker17(){
    const p=ensureTankPicker17(),b=$('tankTab17');if(!b)return;
    const r=b.getBoundingClientRect(),pw=Math.min(330,innerWidth-16);
    let left=Math.max(8,Math.min(innerWidth-pw-8,r.left));
    let top=r.bottom+6;if(top+p.offsetHeight>innerHeight-8)top=Math.max(8,r.top-p.offsetHeight-6);
    p.style.left=left+'px';p.style.top=top+'px';p.style.width=pw+'px';
  }
  function closeTankPicker17(){if(picker)picker.style.display='none';const b=$('tankTab17');if(b)b.setAttribute('aria-expanded','false');}
  function renderTankPicker17(){
    const p=ensureTankPicker17();p.innerHTML='';
    const head=document.createElement('div');head.className='tankHead17';head.innerHTML='<span><b>Choose Tank</b></span><span>Habitat Shelf</span>';p.appendChild(head);
    for(const t of G.tanks||[]){if(!t||!t.owned)continue;const T=tankType(t),b=document.createElement('button');b.className='tankRow17'+(t.id===G.cur?' on':'');b.setAttribute('role','menuitem');
      const txt=document.createElement('span');txt.style.minWidth='0';txt.innerHTML=`<span class="main17">${T.icon} ${t.name}</span><span class="sub17">${T.short||T.name} • ${T.w}×${T.d}×${T.h}</span>`;
      const ct=document.createElement('span');ct.className='count17';ct.textContent=`${t.spiders.filter(s=>!s.owner).length}/${T.cap} 🕷`;
      b.append(txt,ct);b.onclick=()=>{if(t.id!==G.cur)switchTank15(t.id);closeTankPicker17();renderTabs();};p.appendChild(b);
    }
    const manage=document.createElement('button');manage.id='tankManage17';manage.textContent='🏠 Manage Habitats…';manage.onclick=()=>{closeTankPicker17();renderHabitats15();$('habModal15').style.display='flex';};p.appendChild(manage);
    return p;
  }
  function toggleTankPicker17(){const p=renderTankPicker17(),open=p.style.display==='block';if(open){closeTankPicker17();return;}p.style.display='block';const b=$('tankTab17');if(b)b.setAttribute('aria-expanded','true');requestAnimationFrame(positionTankPicker17);}

  // Replace the expanding bank of per-tank buttons with one compact selector.
  renderTabs=function(){
    ensureHabitatUI15();
    const hb=$('habBtn15');if(hb)hb.style.display='none';
    const el=$('tabs');if(!el)return;el.innerHTML='';
    let t=G.tanks&&G.tanks[G.cur];if(!t||!t.owned){const i=(G.tanks||[]).findIndex(x=>x&&x.owned);if(i>=0){G.cur=i;t=G.tanks[i];}}
    if(!t)return;
    const T=tankType(t),b=document.createElement('button');b.id='tankTab17';b.className='on';b.type='button';b.setAttribute('aria-haspopup','menu');b.setAttribute('aria-expanded','false');b.title='Choose tank';
    const count=t.spiders.filter(s=>!s.owner).length;
    b.innerHTML=`<span>${T.icon}</span><span class="tankName17">${t.name}</span><span>${count}/${T.cap}🕷</span><span aria-hidden="true">▾</span>`;
    b.onclick=e=>{e.stopPropagation();SFX.click();toggleTankPicker17();};el.appendChild(b);
  };

  const _switchTank17=switchTank15;
  switchTank15=function(i){const r=_switchTank17(i);closeTankPicker17();renderTabs();return r;};
  const _renderHabitats17=renderHabitats15;
  renderHabitats15=function(){const r=_renderHabitats17();const hb=$('habBtn15');if(hb)hb.style.display='none';renderTabs();return r;};

  ensureTankPicker17();renderTabs();
  window.__JT17=JT17; window.__JT18={ver:18,modular:true};
})();
// ================= end v17 compact tank selector =================
