<template>
  <g>
    <rect x="0" y="0" width="100%" height="100%" fill="transparent" class="pointer-events-none" ref="placeholder" />
    <polyline :points="points" :stroke="hexColor" stroke-width=".12" fill="none" stroke-linecap="round" />
  </g>
</template>

<script>
import { isSelectionClosed } from 'utils/selection'

export default {
  props: {
    theme: {
      type: Object
    },

    size: {
      type: Object
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
      const { top, left, width, height } = this.boundingBox

      const relativePosition = {
        x: (clientX - left) / width * this.size.width,
        y: (clientY - top) / height * this.size.height
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
        .map(tile => `${tile.position.x + 0.5},${tile.position.y + 0.5}`)

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
