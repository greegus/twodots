import Vue from 'vue'
import VueRouter from 'vue-router'

import store from 'store'
import levels from 'levels'

import HomeView from 'views/HomeView'
import LevelView from 'views/LevelView'

Vue.use(VueRouter)

const loadLevel = (levelId) => {
  const level = levels.find(level => level.id === levelId)

  return {
    ...level,
    theme: level.theme ?? {}
  }
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
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
        : next({ name: 'home' })
    },

    props: (route) => ({
      level: loadLevel(Number(route.params.level))
    }),
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
