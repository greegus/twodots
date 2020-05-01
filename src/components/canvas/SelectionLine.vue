<template>
  <svg x="0" y="0" width="100%" height="100%">
    <rect x="0" y="0" width="100%" height="100%" fill="transparent" class="pointer-events-none" ref="placeholder" />
    <polyline :points="points" :stroke="hexColor" stroke-width=".12" fill="none" stroke-linecap="round" />
  </svg>
</template>

<script>
import config from 'config'

import { isSelectionClosed } from 'utils/selection'

export default {
  props: {
    theme: {
      Object
    },

    selection: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      relativeMousePosition: undefined,
      boundingBox: undefined
    }
  },

  methods: {
    updateMousePosition({ clientX, clientY }) {
      const { top, left } = this.boundingBox

      const relativePosition = {
        x: (clientX - left) / config.tileSize,
        y: (clientY - top) / config.tileSize
      }

      this.relativeMousePosition = relativePosition
    },
  },

  computed: {
    points() {
      if (!this.selection.length || !this.relativeMousePosition) {
        return
      }

      const points = this.selection
        .map(tile => `${tile.x + 0.5},${tile.y + 0.5}`)

      if (!isSelectionClosed(this.selection)) {
        points.push(`${this.relativeMousePosition.x},${this.relativeMousePosition.y}`)
      }

      return points.join(' ')
    },

    hexColor() {
      return this.theme.colorMap.dots[this.selection[0].color]
    }
  },

  mounted() {
    this.boundingBox = this.$refs.placeholder.getBoundingClientRect()
    window.addEventListener('pointermove', this.updateMousePosition)
  },

  beforeDestroy() {
    window.removeEventListener('pointermove', this.updateMousePosition)
  }
}
</script>
