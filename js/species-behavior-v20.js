// ================= v20 species identity =================
const SPEC_BEHAVIOR20={
 audax:{label:'fearless generalist',wall:.26,height:.34,plants:.18,direct:.86,rear:.38,display:.10,activity:1.06},
 regius:{label:'patient observer',wall:.22,height:.34,plants:.28,direct:.48,rear:.55,display:.10,activity:.90},
 otiosus:{label:'canopy hunter',wall:.50,height:.84,plants:.82,direct:.52,rear:.58,display:.12,activity:.98},
 zebra:{label:'twitchy wall runner',wall:.88,height:.50,plants:.14,direct:.70,rear:.46,display:.10,activity:1.18},
 gray:{label:'glass ambusher',wall:.92,height:.56,plants:.10,direct:.55,rear:.66,display:.08,activity:1.03},
 plex:{label:'confident patrol hunter',wall:.48,height:.42,plants:.20,direct:.74,rear:.46,display:.10,activity:1.05},
 evarcha:{label:'meadow stalker',wall:.20,height:.20,plants:.54,direct:.66,rear:.48,display:.12,activity:1.08},
 emerald:{label:'foliage hunter',wall:.34,height:.62,plants:.76,direct:.54,rear:.60,display:.10,activity:1.02},
 peacock:{label:'ground dancer',wall:.12,height:.12,plants:.34,direct:.42,rear:.48,display:.92,activity:1.10},
 twin:{label:'careful specialist',wall:.42,height:.30,plants:.26,direct:.38,rear:.78,display:.18,activity:.96},
 putnami:{label:'patient woodland hunter',wall:.34,height:.46,plants:.42,direct:.58,rear:.62,display:.10,activity:.98},
 cardinal:{label:'bold ground hunter',wall:.20,height:.22,plants:.26,direct:.80,rear:.40,display:.12,activity:1.08},
 apache:{label:'fast confident hunter',wall:.24,height:.28,plants:.24,direct:.84,rear:.38,display:.10,activity:1.12},
 johnsoni:{label:'active pursuit hunter',wall:.30,height:.34,plants:.22,direct:.82,rear:.42,display:.10,activity:1.12},
 imperial:{label:'measured foliage hunter',wall:.36,height:.58,plants:.62,direct:.52,rear:.60,display:.18,activity:.98},
 lysso:{label:'leaf-top specialist',wall:.34,height:.76,plants:.94,direct:.38,rear:.72,display:.08,activity:.92},
 ant:{label:'low-profile mimic',wall:.18,height:.16,plants:.18,direct:.40,rear:.82,display:.06,activity:1.04},
 habro:{label:'restless display hunter',wall:.16,height:.20,plants:.38,direct:.52,rear:.50,display:.86,activity:1.16},
 hyllus:{label:'powerful deliberate hunter',wall:.34,height:.46,plants:.28,direct:.92,rear:.30,display:.16,activity:.88},
 portia:{label:'calculating route planner',wall:.72,height:.76,plants:.52,direct:.18,rear:.98,display:.05,activity:.82},
 regadult:{label:'mature patient powerhouse',wall:.28,height:.44,plants:.34,direct:.72,rear:.52,display:.10,activity:.90}
};
function speciesBehavior20(s){return SPEC_BEHAVIOR20[s?.sp]||{label:'adaptable hunter',wall:.3,height:.3,plants:.3,direct:.6,rear:.5,display:.1,activity:1};}
function ensureSpecies20(s){if(!s)return;s.behavior20=s.behavior20||speciesBehavior20(s);}
const _newSpiderSpecies20=newSpider;
newSpider=function(spid,t){const s=_newSpiderSpecies20(spid,t);ensureSpecies20(s);return s;};
for(const t of G.tanks||[])for(const s of t.spiders||[])ensureSpecies20(s);
function preferredWander20(t,s){const b=speciesBehavior20(s),r=rand();
 if(r<b.plants){const ds=t.decor.filter(d=>d.perches&&d.perches.length&&DECOR[d.type]?.kind==='plant');if(ds.length){const d=pick(ds),pt=vc(pick(d.perches)),jr=jumpRange(s)*.82;
   // Never make a spider 'walk through air' toward a plant perch. If the perch is
   // genuinely reachable, use a real jump segment; otherwise investigate the plant
   // from supported substrate and let later behavior choose a climb/jump opportunity.
   if(vdist(s.pos,pt)<=jr&&LOS(t,s.pos,pt))return {surf:{t:'perch',id:d.id},pt,hop:true};
   const q=v3(clamp(d.x+rr(-Math.max(3,d.w*.35),Math.max(3,d.w*.35)),2,TW-2),0,clamp(d.z+rr(-Math.max(3,d.d*.35),Math.max(3,d.d*.35)),2,TD-2));
   if(groundAt(t,q.x,q.z).h===0)return {surf:S_FLOOR,pt:q};}}
 if(r<b.plants+b.wall*.55)return randSurfPoint(t,{plat:.15,wall:clamp(b.wall,.08,.92),maxY:TH*(.35+b.height*.58)});
 if(b.height>.58){const ps=plats(t).filter(d=>d.h>TH*.16);if(ps.length){const d=pick(ps);return {surf:{t:'plat',id:d.id},pt:v3(rr(d.x0+1,d.x1-1),d.h,rr(d.z0+1,d.z1-1))};}}
 return randSurfPoint(t,{plat:.18+b.height*.22,wall:b.wall*.22,maxY:TH*.75});
}
const _updSpiderSpecies20=updSpider;
updSpider=function(t,s,dt){ensureSpecies20(s);const b=speciesBehavior20(s);s._speciesClock20=(s._speciesClock20||rr(.2,1))-dt;
 if(s._speciesClock20<=0){s._speciesClock20=rr(.7,1.8)/b.activity;if(s.state==='wander'&&!s.route&&!s.jump){const d=preferredWander20(t,s);if(d){s.route=d.hop?[{surf:d.surf,pt:d.pt,hop:true}]:route(t,s,d.surf,d.pt,jumpRange(s)*.45);s.mood=b.height>.65&&d.pt.y>TH*.35?'Heading for a higher lookout':b.wall>.7&&d.surf.t==='wall'?'Patrolling the glass':d.hop?'Jumping onto nearby foliage':'Exploring in its own way';}}
  if((s.sp==='peacock'||s.sp==='habro')&&s.state==='look'&&rand()<b.display*.18){let r=null,bd=44;for(const o of t.spiders){if(o===s||o.owner)continue;const d=vdist(s.pos,o.pos);if(d<bd){bd=d;r=o;}}if(r){s.rival=r;setSt(s,'display',s.sp==='peacock'?'Showing off its fan':'A quick display toward the other jumper');}}
 }
 return _updSpiderSpecies20(t,s,dt);
};
window.__JT20_SPECIES={SPEC_BEHAVIOR20,speciesBehavior20};
// ================= end v20 species identity =================
