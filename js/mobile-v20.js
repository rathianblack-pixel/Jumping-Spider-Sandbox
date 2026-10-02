// ================= v20 mobile usability =================
(function(){
 const mq=matchMedia('(max-width:700px),(pointer:coarse)');let panel=null,more=null;
 function ensureMobile20(){if(panel)return;more=document.createElement('button');more.id='mobileMoreBtn20';more.textContent='••• More';more.type='button';$('bar').appendChild(more);panel=document.createElement('div');panel.id='mobileMorePanel20';panel.innerHTML=`<div class="mobileSheetHead20"><b>Terrarium controls</b><button id="mobileClose20">×</button></div><div class="mobileGrid20">
 <button data-act="sub">🏜 Substrate</button><button data-act="presets">🏡 Presets</button><button data-act="journalBtn">📓 Journal</button><button data-act="mistBtn">💧 Mist</button><button data-act="cleanBtn">🧹 Clean</button><button data-act="removeBtn">✖ Remove</button><button data-act="obsBtn">📹 Observe</button>
 <button data-act="cam1">1 Iso</button><button data-act="cam2">2 Observer</button><button data-act="cam3">3 Follow</button><button data-act="cam4">4 Reverse</button><button data-act="timeBtn">⏱ Time</button><button data-act="sndBtn">🎵 Sound</button><button data-act="setBtn">⚙ Settings</button><button data-act="helpBtn">? Help</button></div>`;document.body.appendChild(panel);
 more.onclick=()=>panel.classList.toggle('open');$('mobileClose20').onclick=()=>panel.classList.remove('open');panel.addEventListener('click',e=>{const b=e.target.closest('button[data-act]');if(!b)return;const a=b.dataset.act;if(a==='sub'){document.querySelector('#bar button[data-d="sub"]')?.click();}else if(a==='presets')$('presetBtn15')?.click();else $(a)?.click();if(a!=='removeBtn')panel.classList.remove('open');});
 document.addEventListener('pointerdown',e=>{if(panel.classList.contains('open')&&!panel.contains(e.target)&&e.target!==more)panel.classList.remove('open');});
 }
 function applyMobile20(){ensureMobile20();document.body.classList.toggle('mobile20',mq.matches);if(!mq.matches)panel.classList.remove('open');}
 mq.addEventListener?.('change',applyMobile20);window.addEventListener('resize',applyMobile20,{passive:true});applyMobile20();
 // Large finger-friendly canvas selection/placement without requiring hover.
 const _showPB20=showPB;showPB=function(pl){_showPB20(pl);if(mq.matches&&pl)$('placeBar').classList.add('mobilePlace20');};
 window.__JT20_MOBILE={applyMobile20};
})();
// ================= end v20 mobile usability =================
