<template>
  <div class="GoalItem relative text-center w-9 lg:w-16">
    <div class="GoalItem__counter">
      <div class="relative w-6 h-6 mx-auto mt-1">
        <GoalPreview class="w-full h-full transition-all duration-150" :style="isCompleted ? 'filter: brightness(75%);' : ''" :goal="goal" :theme="theme" />

        <div class="absolute inset-0 flex text-white transform transition-transform duration-200" :class="{ 'opacity-0 scale-0': !isCompleted }">
          <Icon name="check" class="m-auto" />
        </div>
      </div>

      <div class="-mt-px pt-px text-2xs lg:text-xs transition-opacity duration-150" :class="{ 'opacity-0': isCompleted }">
        {{ goal.current || 0 }} / {{ goal.target }}
      </div>
    </div>
  </div>
</template>

<script>
import * as AudioService from 'services/AudioService'

import GoalPreview from 'components/GoalPreview'

export default {
  components: {
    GoalPreview
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
