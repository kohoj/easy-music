import{p as a,a as s,e as t,o as l,f as e,g as i,F as n,h as o,i as c,j as r,w as d}from"./vendor.55e40976.js";const u={props:{playList:Array,num:Number,loading:Boolean},setup(a){}},m=d();a("data-v-384efcb2");const p={class:"item"},v={class:"ske-info"},y={class:"ske-tags"},f={class:"playlist"},g=i("div",{class:"image-slot"},[i("i",{class:"iconfont icon-placeholder"})],-1),k={class:"playCount"},h=i("i",{class:"iconfont icon-playnum"},null,-1),_={class:"info"},x={class:"tags"};s();const b=m(((a,s,d,u,b,q)=>{const C=t("el-skeleton-item"),I=t("el-image"),j=t("router-link"),w=t("el-skeleton");return l(),e(w,{loading:d.loading,animated:"",count:d.num,throttle:500},{template:m((()=>[i("div",p,[i(C,{class:"ske-img",variant:"image"}),i("div",v,[i(C,{variant:"h3",class:"ske-name"}),i(C,{variant:"h3",class:"ske-name",style:{width:"50%"}}),i("div",y,[i(C,{variant:"text"}),i(C,{variant:"text"}),i(C,{variant:"text"})])])])])),default:m((()=>[i("div",f,[(l(!0),e(n,null,o(d.playList,(s=>(l(),e("div",{class:"item",key:s.id},[i(j,{to:{path:"/playlist/detail",query:{id:s.id}},class:"faceImg"},{default:m((()=>[i(I,{src:s.coverImgUrl,lazy:""},{placeholder:m((()=>[g])),_:2},1032,["src"]),i("span",k,[h,i("em",null,c(a.$utils.formartNum(s.playCount)),1),r(" / "+c(s.trackCount+"首"),1)])])),_:2},1032,["to"]),i("div",_,[i(j,{to:{path:"/playlist/detail",query:{id:s.id}},class:"info_name"},{default:m((()=>[r(c(s.name),1)])),_:2},1032,["to"]),i("div",x,[(l(!0),e(n,null,o(s.tags,((a,s)=>(l(),e(j,{to:{path:"/playlist",query:{cat:a}},class:"tag",key:s},{default:m((()=>[r("#"+c(a),1)])),_:2},1032,["to"])))),128))])])])))),128))])])),_:1},8,["loading","count"])}));u.render=b,u.__scopeId="data-v-384efcb2";export{u as _};