import{p as k,a as f,e as i,o as a,f as o,g as e,F as g,h as y,j as _,i as l,k as r,w as I}from"./vendor.a7e3494f.js";const u={props:{mvList:Array,num:Number,loading:Boolean},setup(){}},t=I();k("data-v-d7a1aa4a");const N={class:"item"},x={class:"ske-info"},b={class:"mv"},w=e("i",{class:"iconfont icon-play"},null,-1),C=e("div",{slot:"placeholder",class:"image-slot"},[e("i",{class:"iconfont icon-placeholder"})],-1),L={class:"info"},S={class:"mv-playCount"},T=e("i",{class:"iconfont icon-video"},null,-1),q={key:1,class:"mv-time"};f();const B=t((m,V,c,F,$,j)=>{const n=i("el-skeleton-item"),p=i("el-image"),d=i("router-link"),v=i("el-skeleton");return a(),o(v,{loading:c.loading,animated:"",count:c.num,throttle:500},{template:t(()=>[e("div",N,[e(n,{class:"ske-img",variant:"h3"}),e("div",x,[e(n,{variant:"h3",class:"ske-name"}),e(n,{variant:"h4",class:"ske-txt",style:{width:"50%"}}),e(n,{variant:"h5",class:"ske-txt"})])])]),default:t(()=>[e("div",b,[(a(!0),o(g,null,y(c.mvList,(s,h)=>(a(),o("div",{class:"item",key:""+s.id+h},[e(d,{to:{path:"/mv",query:{id:s.id}},class:"faceImg"},{default:t(()=>[w,e(p,{src:s.cover||s.imgurl},{default:t(()=>[C]),_:2},1032,["src"])]),_:2},1032,["to"]),e("div",L,[e(d,{to:{path:"/mv",query:{id:s.id}},class:"mv-name"},{default:t(()=>[_(l(s.name),1)]),_:2},1032,["to"]),s.publishTime?r("",!0):(a(),o(d,{key:0,to:{path:"/singer",query:{id:s.artistId}},class:"mv-author"},{default:t(()=>[_(l(s.artistName),1)]),_:2},1032,["to"])),e("div",S,[T,_(" "+l(m.$utils.formartNum(s.playCount)),1)]),s.publishTime?(a(),o("div",q,"\u53D1\u5E03\u65F6\u95F4\uFF1A"+l(s.publishTime),1)):r("",!0)])]))),128))])]),_:1},8,["loading","count"])});u.render=B;u.__scopeId="data-v-d7a1aa4a";export{u as _};