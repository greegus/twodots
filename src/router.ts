// src/router/index.ts

import { createRouter, createWebHistory } from 'vue-router';

import { player } from '@/player';
import { levels } from '@/regions';
import { loadLevel } from '@/utils/loadLevel';

export const router = createRouter({
  history: createWebHistory(process.env.NODE_ENV === 'production' ? '/twodots/' : '/'),

  routes:
    [
      {
        path: '/',
        name: 'map',
        component: () => import('@/views/MapView.vue'),
      },

      {
        path: '/level/:level',
        name: 'level',
        component: () => import('@/views/LevelView.vue'),

        beforeEnter: (to, from, next) => {
          const level = Number(to.params.level);
          const levelExists = levels.some(({ id }) => id === level);
          const userCanAccessLevel = player.value.level >= level;

          levelExists && userCanAccessLevel
            ? next()
            : next({ name: 'map' });
        },

        props: (route) => ({
          level: loadLevel(Number(route.params.level)),
        }),
      },
    ]
});