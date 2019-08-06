<template>
  <svg class="absolute top-0 left-0 w-screen h-screen pointer-events-none z-10">
    <g v-for="(corner, $index) in corners" :key="$index" :style="`transform-origin: 25% 25%; transform: ${corner}`">
      <polyline
        stroke-width="30"
        style="transition: stroke-dasharray .15s"
        :points="points" height="100" fill="none" :stroke="hexColor"
        :style="style"
      />
    </g>

    <rect x="0" y="0" width="100%" height="100%" :fill="hexColor" :style="`opacity: ${selection.length && isSelectionClosed ? .15 : 0}; transition: opacity .15s;`" />
  </svg>
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
        'translate(0, 0)',
        'translate(50%, 0) rotateY(180deg)',
        'translate(50%, 50%) rotateX(180deg) rotateY(180deg)',
        'translate(0%, 50%) rotateX(180deg)'
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

      this.points = `${clientWidth / 2},0 0,0 0,${clientHeight / 2}`
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
