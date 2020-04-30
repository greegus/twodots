<template>
  <svg x="0" y="0" width="100%" height="100%">
    <rect x="0" y="0" width="100%" height="100%" fill="transparent" class="pointer-events-none" />
    <polyline :points="points" :stroke="hexColor" stroke-width=".12" fill="none" stroke-linecap="round" v-if="isActive" />
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
    },

    isActive: {
      type: Boolean
    }
  },

  data() {
    return {
      relativeMousePosition: undefined
    }
  },

  methods: {
    updateMousePosition(e) {
      const { clientX, clientY } = e instanceof TouchEvent ? e.touches[0] : e
      const { top, left } = this.$el.getBoundingClientRect()

      const relativePosition = {
        x: (clientX - left) / config.tileSize,
        y: (clientY - top) / config.tileSize
      };

      this.relativeMousePosition = relativePosition;
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

      return points.join(' ');
    },

    hexColor() {
      return this.theme.colorMap.dots[this.selection[0].color]
    }
  },

  mounted() {
    window.addEventListener('mousemove', this.updateMousePosition);
    window.addEventListener('touchmove', this.updateMousePosition);
  },

  beforeDestroy() {
    window.removeEventListener('mousemove', this.updateMousePosition);
    window.removeEventListener('touchmove', this.updateMousePosition);
  }
}
</script>
