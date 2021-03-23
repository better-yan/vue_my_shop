import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'


Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/Home',
    name: 'Home',
    component: Home
  }
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to访问的路径
  if (to.path === '/login')
    return next();
  //获取token
  const tokenStr = window.sessionStorage.getItem('token');
  // next('/login')强制跳转的页面
  if (!tokenStr) return next('/login');
  next();
})
export default router