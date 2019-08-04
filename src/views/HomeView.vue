<template>
  <div class="HomeView py-16">
    <div class="mb-16 text-center">
      <div class="text-5xl">
        DOTS
      </div>

      <div>
        <div>{{ user.name }}</div>
        <div>{{ user.totalScore }}</div>
      </div>
    </div>

    <div class="">
      <div v-for="level in levels" :key="level.id" class="my-3">
        <div class="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-white text-gray-500 border-4 text-lg relative cursor-pointer" :class="{'border-red-500 text-gray-700': user.level >= level.id, 'pointer-events-none': user.level < level.id}" @click="selectLevel(level)">
          <div class="absolute top-0 inset-x-0 text-center leading-none text-sm pt-px" v-if="user.level > level.id">
            <Icon name="star" size="xs" />
          </div>

          {{ level.id }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import levels from 'levels'

import Icon from 'components/Icon'

import LevelPreviewModal from 'modals/LevelPreviewModal';

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
  },

  methods: {
    selectLevel(level) {
      this.$modal(LevelPreviewModal, { level })
        .then(confirmed => confirmed && this.$router.push({ name: 'level', params: { level: level.id } }))
    }
  }
}
</script>
