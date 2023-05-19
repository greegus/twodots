<script lang="ts" setup>
import LevelMenuPanel from '@/components/LevelMenuPanel.vue'
import GoalItem from '@/components/GoalItem.vue'
import type { Goal, Theme } from '@/types.d';
import { computed, ref } from 'vue';
import { Icon } from 'vuiii';

const props =  defineProps<{
  movesLeft: number,
  goals: Goal[],
  theme: Theme,
  score: number
}>()

const menuRef = ref<typeof LevelMenuPanel>()

const isLowOnMovesLeft = computed(() => props.movesLeft <= 5)

const openMenu = () => {
  menuRef.value!.open()
}
</script>


<template>
  <div class="LevelInterface">
    <div class="header absolute top-0 inset-x-0 flex w-full align-center justify-center text-gray-700 space-x-2 lg:space-x-5 px-3 pt-5 lg:pt-10">
      <div class="panel flex-none px-0 w-12 lg:w-16">
        <div class="text-center leading-none">
          <div class="text-2xl lg:text-3xl -mb-px lg:mb-px" :class="{'text-red-500': isLowOnMovesLeft}">{{ movesLeft }}</div>
          <div class="uppercase text-2xs lg:text-xs font-normal">Moves</div>
        </div>
      </div>

      <div class="panel flex-auto flex justify-center lg:flex-none px-3 lg:px-5">
        <div v-for="(goal, $index) in goals" :key="$index" style="flex-basis: 33.333%;">
          <GoalItem :goal="goal" :theme="theme" show-current small class="mx-auto" />
        </div>
      </div>

      <button class="panel flex-none px-0 w-12 lg:w-16" @click="openMenu()">
        <Icon name="cog" class="text-2xl text-gray-600" />
      </button>
    </div>

    <div class="absolute bottom-0 inset-x-0 flex align-center justify-center w-full text-gray-700 px-3 pb-5 lg:pb-10">
      <div class="panel w-32 mx-auto">
        <div class="text-center leading-none">
          <div class="uppercase text-2xs lg:text-xs font-normal mb-1">Score</div>
          <div class="text-2xl">{{ score }}</div>
        </div>
      </div>
    </div>

    <LevelMenuPanel
      ref="menu"
      @restart-level="$emit('restart-level')"
      @exit-to-map="$emit('exit-to-map')"
    />
  </div>
</template>

<style lang="postcss" scoped>
.header {
  background: linear-gradient(to bottom, rgba(#000, .15), rgba(#000, .0) 1rem);
}

.panel {
  @apply flex items-center justify-center h-11 bg-gray-100 rounded-xl z-[1] md:h-14 md:rounded-2xl;;
  box-shadow: 0 4px 0 0 theme("colors.gray.400");

  @screen md {
    box-shadow: 0 6px 0 0 theme("colors.gray.400");
  }
}

button.panel {
  @apply outline-none transition-all duration-100 cursor-pointer hover:bg-gray-200;
 
  &:active {
    transform: translateY(2px);
    box-shadow: 0 2px 0 0 theme("colors.gray.400");

    @screen md {
      transform: translateY(3px);
      box-shadow: 0 3px 0 0 theme("colors.gray.400");
    }
  }
}
</style>