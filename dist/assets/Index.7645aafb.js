var C=Object.defineProperty,w=Object.defineProperties;var $=Object.getOwnPropertyDescriptors;var h=Object.getOwnPropertySymbols;var S=Object.prototype.hasOwnProperty,T=Object.prototype.propertyIsEnumerable;var y=(s,t,e)=>t in s?C(s,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[t]=e,g=(s,t)=>{for(var e in t||(t={}))S.call(t,e)&&y(s,e,t[e]);if(h)for(var e of h(t))T.call(t,e)&&y(s,e,t[e]);return s},I=(s,t)=>w(s,$(t));import{_ as D}from"./MvList.a2d1f490.js";import{_ as V}from"./Loading.ed48931e.js";import{r as b,x as B,ab as F,t as N,p as q,a as E,e as L,a7 as R,o as i,f as r,g as a,F as _,h as p,i as m,q as j,k as z,w as A,m as G}from"./vendor.a7e3494f.js";const k={name:"Mvlist",components:{MvList:D,Loading:V},setup(s){const{proxy:t}=G(),e=b({area:["\u5168\u90E8","\u5185\u5730","\u6E2F\u53F0","\u6B27\u7F8E","\u65E5\u672C","\u97E9\u56FD"],type:["\u5168\u90E8","\u5B98\u65B9\u7248","\u539F\u751F","\u73B0\u573A\u7248","\u7F51\u6613\u51FA\u54C1"],order:["\u4E0A\u5347\u6700\u5FEB","\u70ED\u95E8","\u6700\u65B0"],areaIndex:0,typeIndex:0,orderIndex:0,params:{area:"",type:"",order:"",limit:30,offset:0},list:[],mv_count:20,mv_loading:!0,isLoading:!0,isLoadMv:!0}),l=async d=>{const{data:n}=await t.$http.mv(d);if(n.code!==200)return t.$msg.error("\u6570\u636E\u8BF7\u6C42\u5931\u8D25");e.list=e.params.offset!==0?[...e.list,...n.data]:n.data,e.isLoadMv=!n.hasMore,e.isLoading=n.hasMore,e.mv_loading=!1},v=(d,n)=>{e[d+"Index"]=n,e.list=[],e.params.offset=0,e.params[d]=e[d][n],e.mv_loading=!0},f=()=>{e.isLoadMv=!0,e.params.offset=e.list.length};return B(()=>{e.params.area=e.area[e.areaIndex],e.params.type=e.type[e.typeIndex],e.params.order=e.order[e.orderIndex]}),F(()=>{l(e.params)}),I(g({},N(e)),{selectType:v,loadMv:f})}},H=A();q("data-v-4084186d");const J={class:"mv"},K={class:"w1200"},O={class:"filter"},P={class:"filter-item"},Q=a("span",null,"\u533A\u57DF",-1),U={class:"filter-item"},W=a("span",null,"\u7C7B\u578B",-1),X={class:"list-container"},Y={class:"list-head"},Z=a("h2",null,"\u5168\u90E8MV",-1),x={class:"type"},ee={class:"wrapper infinite-list","infinite-scroll-disabled":"isLoadMv","infinite-scroll-distance":"50"};E();const se=H((s,t,e,l,v,f)=>{const d=L("mv-list"),n=L("Loading"),M=R("infinite-scroll");return i(),r("div",J,[a("div",K,[a("div",O,[a("div",P,[Q,(i(!0),r(_,null,p(s.area,(c,o)=>(i(),r("em",{class:o===s.areaIndex?"active":"",key:o,onClick:u=>l.selectType("area",o)},m(c),11,["onClick"]))),128))]),a("div",U,[W,(i(!0),r(_,null,p(s.type,(c,o)=>(i(),r("em",{class:o===s.typeIndex?"active":"",key:o,onClick:u=>l.selectType("type",o)},m(c),11,["onClick"]))),128))])]),a("div",X,[a("div",Y,[Z,a("div",x,[(i(!0),r(_,null,p(s.order,(c,o)=>(i(),r("span",{class:o===s.orderIndex?"active":"",key:o,onClick:u=>l.selectType("order",o)},m(c),11,["onClick"]))),128))])]),j(a("div",ee,[a(d,{mvList:s.list,loading:s.mv_loading,num:s.mv_count},null,8,["mvList","loading","num"]),s.isLoading?(i(),r(n,{key:0})):z("",!0)],512),[[M,l.loadMv]])])])])});k.render=se;k.__scopeId="data-v-4084186d";export{k as default};
