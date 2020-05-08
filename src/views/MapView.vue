<template>
  <div class="MapView">
    <div class="mt-10 mb-5 text-center">
      <Logo class="text-4xl" />

      <div>
        <div>{{ user.name }}</div>
        <div>{{ user.totalScore }}</div>
      </div>
    </div>

    <div class="">
      <div v-for="(region, $index) in regions" :key="$index" class="py-10" :style="{ background: region.background }">
        <div class="max-w-sm mx-auto">
          <div v-for="level in region.levels" :key="level.id" class="my-3">
            <div class="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-white text-gray-500 border-4 text-lg relative cursor-pointer" :class="{'border-red-500 text-gray-700': user.level >= level.id, 'pointer-events-none': user.level < level.id}" @click="selectLevel(level.id)">
              <div class="absolute top-0 inset-x-0 text-center leading-none text-sm pt-px" v-if="user.level > level.id">
                <Icon name="star" size="xs" />
              </div>

              {{ level.id }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import regions from 'regions'

import loadLevel from 'utils/loadLevel'

import Logo from 'components/Logo';

import LevelPreviewModal from 'modals/LevelPreviewModal';

export default {
  components: {
    Logo
  },

  data() {
    return {
      regions
    }
  },

  computed: {
    user() {
      return this.$store.getters.user
    }
  },

  methods: {
    selectLevel(levelId) {
      const level = loadLevel(levelId)

      this.$modal(LevelPreviewModal, { level })
        .then(confirmed => confirmed && this.$router.push({ name: 'level', params: { level: levelId } }))
    }
  }
}
</script>
