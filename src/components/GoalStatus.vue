<template>
  <div class="GoalStatus relative text-center text-center w-16" :class="{isCompleted}">
    <div class="GoalStatus__counter pt-2">
      <TilePreview class="w-8 h-8 mx-auto" :tile="goal.tile" />

      <div class="text-xs -mt-1 mb-1">{{ goal.current }} / {{ goal.target }}</div>
    </div>

    <div class="GoalStatus__check absolute inset-0 flex items-center justify-center">
      <TilePreview class="w-10 h-10 mx-auto grayscale" :tile="goal.tile" />

      <div class="absolute inset-0 flex items-center justify-center text-white">
        <Icon name="check" />
      </div>
    </div>
  </div>
</template>

<script>
import config from 'config'

import Icon from 'components/Icon'

import TilePreview from 'components/TilePreview'

export default {
  components: {
    Icon,

    TilePreview
  },

  props: {
    goal: {
      type: Object
    }
  },

  computed: {
    mappedColor() {
      return config.colorsMap[this.goal.color]
    },

    isCompleted() {
      return this.goal.current >= this.goal.target
    }
  }
}
</script>

<style lang="postcss">
.GoalStatus__counter {
  transition: transform .25s;

  .GoalStatus.isCompleted & {
    transform: scale(0);
  }
}

.GoalStatus__check {
  transform: scale(0);
  transition: transform .25s;

  .GoalStatus.isCompleted & {
    transform: scale(1);
  }
}
</style>
