import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import HomeIndex from '../views/HomeIndex.vue'
import SelfCenter from '../views/SelfCenter.vue'
import BorrowList from '../views/BorrowList.vue'
import ReserveList from '../views/ReserveList.vue'
import CheckList from '../views/CheckList.vue'
import ManageList from '../views/ManageList.vue'
Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    component:Login
  },
  {
    path:'/login',
    name:'login',
    component:Login,
    props:true// props设置为true，$route.params将被设置为组件属性，刷新不会消失
  },
  {
    path:'/homeIndex',
    name:'homeIndex',
    component:HomeIndex,
    redirect:"/borrowList",
    children: [
      {
        path: '/borrowList',
        name: 'borrowList',
        component: BorrowList
      },
      {
        path:'/reserveList',
        name:'reserveList',
        component:ReserveList
      },
      {
        path:'/selfCenter',
        name:'selfCenter',
        component:SelfCenter
      },
      {
        path:'/checkList',
        name:'checkList',
        component:CheckList
      },
      {
        path:'/manageList',
        name:'manageList',
        component:ManageList
      }
      ]
  }
]

const router = new VueRouter({
  routes
})
// router.beforeEach((to,from,next)=>{
//   //检查session中是否有ukey
//   let path = to.fullPath
//   if (path=="/" || sessionStorage.getItem("ukey")!=null){
//     //已经登录了
//     next()
//   }else {
//     //如果没有登录,就跳到登录页面
//     next("/")
//   }
// })

export default router
