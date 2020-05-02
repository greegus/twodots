<template>
  <div class="GoalItem relative text-center w-9 lg:w-16" :class="{ isCompleted }">
    <div class="GoalItem__counter">
      <TilePreview class="mx-auto -mt-2 w-9 h-9 transform scale-105" :tile="goal.tile" :theme="theme" />

      <div class="-mt-2 lg:-mt-1 pt-px text-2xs lg:text-xs">
        {{ goal.current || 0 }} / {{ goal.target }}
      </div>
    </div>

    <div class="GoalItem__check absolute inset-0 flex items-center justify-center">
      <TilePreview class="w-10 h-10 mx-auto transform scale-105" :tile="goal.tile" :theme="theme" />

      <div class="absolute inset-0 flex items-center justify-center text-white">
        <Icon name="check" />
      </div>
    </div>
  </div>
</template>

<script>
import * as AudioService from 'services/AudioService'

import TilePreview from 'components/TilePreview'

export default {
  components: {
    TilePreview
  },

  props: {
    goal: {
      type: Object
    },

    theme: {
      type: Object
    }
  },

  computed: {
    isCompleted() {
      return this.goal.current >= this.goal.target
    }
  },

  watch: {
    isCompleted(newValue, oldValue) {
      if (newValue && newValue !== oldValue) {
        AudioService.playGoalReachedThumb()
      }
    }
  }
}
</script>

<style lang="postcss">
.GoalItem__counter {
  transition: transform .25s;

  .GoalItem.isCompleted & {
    transform: scale(0);
  }
}

.GoalItem__check {
  transform: scale(0);
  transition: transform .25s;

  .GoalItem.isCompleted & {
    transform: scale(1);
  }
}
</style>
