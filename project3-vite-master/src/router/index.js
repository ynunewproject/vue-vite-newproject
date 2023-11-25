import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import register from "../views/Register.vue";
import index from "../views/index.vue"
import UserInfo from "../views/UserInfo.vue";
import introduce from "../views/introduce.vue"
import MushroomList from "../components/MushroomList.vue";
import search from "../components/search.vue"

import preview from "../components/preview.vue";

import chat from "../views/chat.vue";
import Moments from "../views/Moments.vue";



const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: register },
  { path: '/index', component: index },
  { path: '/UserInfo', component: UserInfo },
  { path: '/historyRecord', component: ()=>import("../views/History.vue") },
  { path: '/chat',component: chat },
  { path: '/moments', component: Moments },
  { path: '/moments/momentDetail/:pk',props:true, component:()=>import("../components/momentDetails.vue")},
  {path: '/index/resultDetail', component:()=>import('../components/ResultDetail.vue')},
  { path:'/introduce',component:introduce,redirect: '/MushroomList',
    children:[{
      path:'/search',
      component:search
    },
      {
        path: '/MushroomList',
        component: MushroomList
      }
    ]
   },

  { path: '/test', component: preview },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

//没有后端登录注册代码就把下面的这段注释掉
router.beforeEach((to, from, next) => {
  // to: 要访问的路径，next 一个函数，控制本次访问是否能放行
   if (to.path === '/login' || to.path === '/register') return next();
  // 判断用户是否登录
  const currentToken = window.sessionStorage.getItem("token");
  if (!currentToken) return next('./login'); // 放行到登录页面
  return next();
});

export default router;
