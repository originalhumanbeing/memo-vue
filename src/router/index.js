import Vue from 'vue'
import Router from 'vue-router'
import Notepad from '@/components/Notepad'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'Memomemo',
      component: Notepad
    }
  ]
})

export default router