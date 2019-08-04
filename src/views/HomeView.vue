<template>
  <div class="HomeView">
    <div class="py-16 text-3xl text-center text-5xl">
      DOTS
    </div>

    <div class="">
      <div v-for="level in levels" :key="level.id" class="my-3">
        <router-link :to="{ name: 'level', params: { level: level.id } }" class="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-white text-gray-500 border-4 text-lg relative font-semibold" :class="{'border-red-500 text-gray-700': user.level >= level.id, 'pointer-events-none': user.level < level.id}">
          <div class="absolute top-0 inset-x-0 text-center leading-none text-sm pt-px" v-if="user.level > level.id">
            <Icon name="star" size="xs" />
          </div>

          {{ level.id }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import levels from 'levels'

import Icon from 'components/Icon'

export default {
  components: {
    Icon
  },

  data() {
    return {
      levels
    }
  },

  computed: {
    user() {
      return this.$store.getters.user
    }
  }
}
</script>
