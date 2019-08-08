<template>
  <div class="fixed inset-0 pointer-events-none z-10">
    <div class="fixed inset-0" :style="`background: ${hexColor}; opacity: ${selection.length && isSelectionClosed ? .15 : 0}; transition: opacity .15s;`">
    </div>

    <svg class="absolute w-1/2 h-1/2" v-for="(corner, $index) in corners" :key="$index" :style="corner" viewBox="0 0 1 1" preserveAspectRatio="none">
      <polyline
        stroke-width="20"
        style="transition: stroke-dasharray .25s"
        points="1,0 0,0 0,1" height="100" fill="none" :stroke="hexColor"
        vector-effect="non-scaling-stroke"
        :style="style"
      />
    </svg>
  </div>
</template>

<script>
import config from 'config'

import { isSelectionClosed } from 'utils/selection'

export default {
  props: {
    selection: {
      type: Array,
      default: () => []
    },

    isActive: {
      type: Boolean
    }
  },

  data() {
    return {
      points: '',
      style: '',
      hexColor: undefined,
      corners: [
        'top: 0; left: 0;',
        'top: 0; right: 0; transform: rotateY(180deg)',
        'bottom: 0; right: 0; transform: rotateX(180deg) rotateY(180deg)',
        'bottom: 0; left: 0; transform: rotateX(180deg)'
      ]
    }
  },

  computed: {
    isSelectionClosed() {
      return isSelectionClosed(this.selection)
    }
  },

  methods: {
    render() {
      if (!this.$el) {
        return
      }

      const firstDot = this.selection[0]

      if (firstDot) {
        this.hexColor = config.colorsMap[firstDot.color]
      }

      const { clientWidth, clientHeight } = this.$el
      const length = Math.max(0, this.selection.length - 1)
      const fullLength = (clientWidth + clientHeight) / 2
      const progress = length && this.isSelectionClosed ? 1 : Math.min(.95, length / 10)
      const line = progress * fullLength
      const gap = Math.max(0, fullLength - line)

      this.style = `strokeDasharray: ${line} ${gap}`
    }
  },

  watch: {
    'selection.length': {
      immediate: true,
      handler: 'render'
    }
  }
}
</script>
