const DECOR={
 bark:{name:'Cork Bark',price:15,kind:'plat',w:44,d:22,h:16,tex:'cork',cat:'decor'},
 tower:{name:'Cork Tower',price:30,kind:'plat',w:24,d:18,h:52,tex:'cork',cat:'decor'},
 drift:{name:'Driftwood',price:25,kind:'plat',w:62,d:12,h:22,tex:'drift',cat:'decor'},
 stone:{name:'Flat Stone',price:8,kind:'plat',w:22,d:16,h:7,tex:'stone',cat:'decor'},
 slate:{name:'Slate Stack',price:14,kind:'plat',w:28,d:22,h:14,tex:'slate',cat:'decor'},
 bonsai:{name:'Mini Bonsai',price:45,kind:'plat',w:22,d:22,h:12,tex:'pot',cat:'plants',ph:46,cover:true},
 moss:{name:'Moss Patch',price:5,kind:'flat',w:36,d:26,cover:true,cat:'decor'},
 litter:{name:'Leaf Litter',price:4,kind:'flat',w:40,d:28,cover:true,cat:'decor'},
 dish:{name:'Water Dish',price:6,kind:'flat',w:18,d:14,cat:'decor'},
 pebbles:{name:'Pebbles',price:3,kind:'flat',w:26,d:18,cat:'decor'},
 fern:{name:'Fern',price:12,kind:'plant',w:26,d:16,h:40,cover:true,perch:true,cat:'plants'},
 pinkfl:{name:'Pink Flowers',price:14,kind:'plant',w:20,d:14,h:34,perch:true,attract:true,fc:'#f08bb4',fc2:'#ffd1e3',cat:'plants'},
 daisy:{name:'Daisies',price:14,kind:'plant',w:20,d:14,h:30,perch:true,attract:true,fc:'#fbfbf2',fc2:'#f6c834',cat:'plants'},
 lav:{name:'Lavender',price:16,kind:'plant',w:18,d:12,h:42,perch:true,attract:true,fc:'#9b7be0',fc2:'#c9b3ff',cat:'plants'},
 grass:{name:'Tall Grass',price:8,kind:'plant',w:18,d:12,h:48,cover:true,perch:true,cat:'plants'},
 succ:{name:'Succulent',price:10,kind:'plant',w:18,d:16,h:12,cover:true,cat:'plants'},
 shroom:{name:'Glow Mushrooms',price:12,kind:'plant',w:14,d:10,h:12,glow:true,cat:'plants'},
 tree:{name:'Tiny Tree',price:35,kind:'plant',w:22,d:18,h:70,cover:true,perch:true,cat:'plants'},
};

// v25 nature-display expansion. These pieces are authored as physical habitat terrain:
// spiders can use their tops, climbable faces and perch anchors through the v25 surface graph.
Object.assign(DECOR,{
 grandtree:{name:'Grand Habitat Tree',price:95,kind:'plant',w:44,d:38,h:135,cover:true,perch:true,cat:'plants',renderAs:'tree',groups:['wood','vertical','foliage'],nav25:'tree'},
 mangroveroot:{name:'Mangrove Root',price:38,kind:'plat',w:58,d:32,h:24,tex:'drift',cover:true,cat:'decor',groups:['wood','vertical','cozy'],nav25:'climb'},
 corkspire:{name:'Tall Cork Spire',price:40,kind:'plat',w:28,d:22,h:74,tex:'cork',cat:'decor',groups:['wood','vertical'],nav25:'climb'},
 canopybranch:{name:'Canopy Branch',price:34,kind:'plat',w:78,d:12,h:34,tex:'drift',cat:'decor',groups:['wood','vertical'],nav25:'climb'},
 rockmesa:{name:'Rock Mesa',price:32,kind:'plat',w:48,d:36,h:24,tex:'stone',cat:'decor',groups:['rock','cozy'],nav25:'climb'},
 slatepillar:{name:'Slate Pillar',price:30,kind:'plat',w:26,d:24,h:55,tex:'slate',cat:'decor',groups:['rock','vertical'],nav25:'climb'},
 vinebridge:{name:'Twisted Vine Bridge',price:30,kind:'plat',w:72,d:10,h:28,tex:'drift',cat:'decor',groups:['wood','vertical','foliage'],nav25:'climb'},
 coconutwood:{name:'Coconut Wood Hide',price:24,kind:'plat',w:44,d:22,h:18,tex:'cork',cover:true,cat:'decor',groups:['wood','cozy'],nav25:'climb'},
 leafshelter:{name:'Broad Leaf Shelter',price:18,kind:'plat',w:36,d:28,h:10,tex:'pot',cover:true,cat:'decor',groups:['foliage','cozy','small'],nav25:'climb'},
 dewstone:{name:'Dew Stone',price:16,kind:'plat',w:26,d:22,h:9,tex:'stone',cat:'decor',groups:['rock','utility','small'],nav25:'climb'},
 monstera:{name:'Mini Monstera',price:24,kind:'plant',w:30,d:24,h:52,cover:true,perch:true,cat:'plants',renderAs:'fern',groups:['foliage','vertical'],nav25:'plant'},
 calathea:{name:'Calathea',price:22,kind:'plant',w:28,d:22,h:44,cover:true,perch:true,cat:'plants',renderAs:'fern',groups:['foliage'],nav25:'plant'},
 maidenhair:{name:'Maidenhair Fern',price:18,kind:'plant',w:28,d:20,h:38,cover:true,perch:true,cat:'plants',renderAs:'fern',groups:['foliage'],nav25:'plant'},
 creepingfig:{name:'Creeping Fig',price:19,kind:'plant',w:22,d:18,h:62,cover:true,perch:true,cat:'plants',renderAs:'grass',groups:['foliage','vertical'],nav25:'plant'},
 redbromeliad:{name:'Red Bromeliad',price:24,kind:'plant',w:26,d:24,h:26,cover:true,perch:true,cat:'plants',renderAs:'succ',groups:['foliage','small'],nav25:'plant'},
 ficus:{name:'Mini Ficus',price:34,kind:'plant',w:30,d:26,h:72,cover:true,perch:true,cat:'plants',renderAs:'tree',groups:['foliage','vertical'],nav25:'tree'},
 palmetto:{name:'Dwarf Palmetto',price:30,kind:'plant',w:30,d:26,h:64,cover:true,perch:true,cat:'plants',renderAs:'tree',groups:['foliage','vertical'],nav25:'tree'},
 jungleorchid:{name:'Jungle Orchid',price:27,kind:'plant',w:22,d:18,h:46,perch:true,attract:true,fc:'#f29ad8',fc2:'#fff0c8',cat:'plants',groups:['flower','vertical'],nav25:'plant'},
 waterleaf:{name:'Dew Cup Plant',price:28,kind:'plant',w:28,d:24,h:30,cover:true,perch:true,cat:'plants',renderAs:'succ',groups:['foliage','utility'],nav25:'plant'}
});
const SUBS={sand:{name:'Desert Sand',price:0,c:['#dcc38f','#cdb27c','#e8d4a6','#bfa06a']},coco:{name:'Coco Soil',price:10,c:['#5b3a26','#4a2e1d','#6e4a32','#3a2416']},mossbed:{name:'Moss Bed',price:15,c:['#4f7a3a','#3f662e','#5f8f45','#6aa04f']},clay:{name:'Red Clay',price:10,c:['#b5714a','#a3613d','#c58058','#8f5232']},gravel:{name:'River Gravel',price:12,c:['#8d8a85','#6f6c68','#a7a39c','#5a5754']}};
Object.assign(SUBS,{
 beach:{name:'Pale Beach Sand',price:14,c:['#ead7aa','#dec48f','#f1e2bd','#c9ad76']},
 forestmix:{name:'Forest Floor Mix',price:18,c:['#493324','#37251b','#624733','#2c2119']},
 blacksoil:{name:'Rich Black Soil',price:16,c:['#332b25','#27221e','#44382f','#1f1b18']},
 sphagnum:{name:'Sphagnum Carpet',price:20,c:['#7b8a53','#667547','#93a867','#53613c']},
 limestone:{name:'Limestone Grit',price:15,c:['#c8c1ad','#aaa38f','#ddd6c5','#918a79']},
 junglefloor:{name:'Jungle Floor',price:22,c:['#55402b','#40301f','#74583a','#34271b']}
});

