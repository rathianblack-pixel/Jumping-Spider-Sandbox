// ================= v20 lifecycle =================
function defaultLife20(s){const r=rng(((s.seed||1)^0x20c0ffee)>>>0),base=Math.max(.2,(s.stage-1)*2.4+r()*1.6);return {ageDays:base,molts:Math.max(0,s.stage-1),adultDays:s.stage>=6?r()*5:0,adultAt:s.stage>=6?Math.max(0,base-r()*5):null,veteran:false};}
function ensureLife20(s){if(!s)return;s.life=s.life||defaultLife20(s);if(!Number.isFinite(s.life.ageDays))s.life.ageDays=defaultLife20(s).ageDays;if(!Number.isFinite(s.life.molts))s.life.molts=Math.max(0,s.stage-1);}
function lifePhase20(s){ensureLife20(s);if(s.stage<=2)return 'sling';if(s.stage===3)return 'juvenile';if(s.stage===4)return 'sub-adult';if(s.stage===5)return 'young adult';if((s.life.adultDays||0)>24)return 'older adult';return 'adult';}
function lifeMove20(s){ensureLife20(s);let m=s.stage<=2?.88:s.stage===3?.95:s.stage===4?1:s.stage===5?1.03:1;const ad=s.life.adultDays||0;if(ad>20)m*=lerp(1,.80,clamp((ad-20)/28,0,1));return m;}
function lifeConfidence20(s){ensureLife20(s);return s.stage<=2?.68:s.stage===3?.80:s.stage===4?.92:s.stage>=6?1.08:1;}
const _newSpiderLife20=newSpider;
newSpider=function(spid,t){const s=_newSpiderLife20(spid,t);ensureLife20(s);return s;};
for(const t of G.tanks||[])for(const s of t.spiders||[])ensureLife20(s);
if(typeof JOURNAL_DEF==='object'){JOURNAL_DEF.adult20=['Reached adulthood','A jumper completed its final growth molt.'];JOURNAL_DEF.veteran20=['Seasoned adult','An adult jumper has lived through many terrarium days.'];}
const _updSpiderLife20=updSpider;
updSpider=function(t,s,dt){ensureLife20(s);const oldStage=s.stage;s.life.ageDays+=dt/DAYLEN;if(s.stage>=6)s.life.adultDays=(s.life.adultDays||0)+dt/DAYLEN;const r=_updSpiderLife20(t,s,dt);
 if(s.stage>oldStage){s.life.molts=(s.life.molts||0)+(s.stage-oldStage);if(s.stage>=6&&oldStage<6){s.life.adultAt=s.life.ageDays;s.life.adultDays=0;if(typeof recordJournal==='function')recordJournal('adult20');}}
 if(s.stage>=6&&!s.life.veteran&&(s.life.adultDays||0)>24){s.life.veteran=true;if(typeof recordJournal==='function')recordJournal('veteran20');}
 return r;};
const _renderInfoLife20=renderInfo;
renderInfo=function(){_renderInfoLife20();const s=G.sel,t=cur();if(!s||!t.spiders.includes(s))return;ensureLife20(s);const st=$('state');if(!st||!st.parentNode)return;let row=$('iLife20');if(!row){row=document.createElement('div');row.id='iLife20';row.className='row';row.style.margin='3px 0 5px';st.parentNode.insertBefore(row,st);}const age=s.life.ageDays<1?`${(s.life.ageDays*24).toFixed(0)} h`:`${s.life.ageDays.toFixed(1)} d`;row.innerHTML=`<span>${lifePhase20(s)} • age ${age}</span><span>${s.life.molts||0} molts</span>`;};
window.__JT20_LIFE={ensureLife20,lifePhase20,lifeMove20,lifeConfidence20};
// ================= end v20 lifecycle =================
