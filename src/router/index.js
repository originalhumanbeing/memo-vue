import Vue from 'vue'
import Router from 'vue-router'
import Notepad from '@/components/Notepad'
import Signup from '@/components/Signup'

Vue.use(Router);

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'Memomemo',
      component: Notepad
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    },
  ]
});

export default router