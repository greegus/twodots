<template>
  <div class="GoalItem relative text-center text-center w-16" :class="{isCompleted}">
    <div class="GoalItem__counter pt-2">
      <TilePreview class="mx-auto -mt-2" :class="small ? 'w-10 h-10' : 'w-14 h-14'" :tile="goal.tile" />

      <div class="-mt-2 mb-2 font-normal pt-px" :class="small ? 'text-xs' : ''">
        <span v-if="showCurrent">{{ goal.current || 0 }} /</span> {{ goal.target }}
        </div>
    </div>

    <div class="GoalItem__check absolute inset-0 flex items-center justify-center">
      <TilePreview class="w-12 h-12 mx-auto" :tile="goal.tile" />

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
    },

    showCurrent: {
      type: Boolean
    },

    small: {
      type: Boolean
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
