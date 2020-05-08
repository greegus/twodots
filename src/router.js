import Vue from 'vue'
import VueRouter from 'vue-router'

import store from 'store'
import { levels } from 'regions'

import MapView from 'views/MapView'
import LevelView from 'views/LevelView'

import loadLevel from 'utils/loadLevel'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'map',
    component: MapView
  },

  {
    path: '/level/:level',
    name: 'level',
    component: LevelView,

    beforeEnter(to, from, next) {
      const level = Number(to.params.level)
      const levelExists = levels.some(({ id }) => id === level)
      const userCanAccessLevel = store.getters.user.level >= level

      levelExists && userCanAccessLevel
        ? next()
        : next({ name: 'map' })
    },

    props: (route) => ({
      level: loadLevel(Number(route.params.level))
    }),
  }
]

const router = new VueRouter({
  routes,

  base: process.env.NODE_ENV === 'production'
    ? '/twodots/'
    : '/',
})

export default router
