<script lang="ts" setup>
import { player } from '@/player'

import { regions } from '@/regions'

import { loadLevel } from '@/utils/loadLevel'

import Logo from '@/components/Logo.vue';

import LevelPreviewModal from '@/modals/LevelPreviewModal.vue';
import { Icon, useModal } from 'vuiii';
import { useRouter } from 'vue-router';

const modal = useModal()

const router = useRouter()

const selectLevel = async (levelId: number) => {
  const level = loadLevel(levelId)

  const confirmed = await modal.open(LevelPreviewModal, { level })

  if (confirmed) {
    router.push({ name: 'level', params: { level: levelId } })
  }
}
</script>

<template>
  <div class="MapView">
    <div class="mt-10 mb-5 text-center">
      <Logo class="text-4xl" />

      <div>
        <div>{{ player.name }}</div>
        <div>{{ player.totalScore }}</div>
      </div>
    </div>

    <div class="">
      <div v-for="(region, $index) in regions" :key="$index" class="py-10" :style="{ background: region.background }">
        <div class="max-w-sm mx-auto">
          <div v-for="level in region.levels" :key="level.id" class="my-3">
            <div
              class="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-white text-gray-500 border-4 text-lg relative cursor-pointer"
              :class="{ 'border-red-500 text-gray-700': player.level >= level.id, 'pointer-events-none': player.level < level.id }"
              @click="selectLevel(level.id)">
              
              <div class="absolute top-0 inset-x-0 text-center leading-none text-sm pt-px" v-if="player.level > level.id">
                <Icon name="star" size="small" />
              </div>

              {{ level.id }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div></template>
