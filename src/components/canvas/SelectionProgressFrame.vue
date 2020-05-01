<template>
  <div class="fixed inset-0 pointer-events-none z-10">
    <svg v-for="(corner, $index) in corners" :key="$index" class="absolute will-transform" :style="corner" viewBox="0 0 1 1" preserveAspectRatio="none">
      <polyline
        stroke-width="20"
        class="transition-all duration-200"
        points="1,0 0,0 0,1" height="100" fill="none" :stroke="color"
        vector-effect="non-scaling-stroke"
        :style="style"
      />
    </svg>

    <svg class="absolute w-full h-full will-transform" viewBox="0 0 1 1" preserveAspectRatio="none">
      <rect
        x="0"
        y="0"
        width="1"
        height="1"
        :fill="color"
        class="tranform transition-opacity duration-200"
        :style="{ opacity: selection.length && isSelectionClosed ? .15 : 0 }"
      />
    </svg>
  </div>
</template>

<script>
import { isSelectionClosed } from 'utils/selection'

export default {
  props: {
    selection: {
      type: Array,
      default: () => []
    },

    isActive: {
      type: Boolean
    },

    theme: {
      type: Object
    }
  },

  data() {
    const size = 'width: calc(50% + 1px); height: calc(50% + 1px);'

    return {
      points: '',
      style: '',
      corners: [
        `${size} top: 0; left: 0;`,
        `${size} top: 0; right: 0; transform: rotateY(180deg)`,
        `${size} bottom: 0; right: 0; transform: rotateX(180deg) rotateY(180deg)`,
        `${size} bottom: 0; left: 0; transform: rotateX(180deg)`
      ]
    }
  },

  computed: {
    isSelectionClosed() {
      return isSelectionClosed(this.selection)
    },

    color() {
      return this.theme.colorMap.dots[this.selection[0]?.color]
    },


  },

  methods: {
    render() {
      const selectionLength = Math.max(0, this.selection.length - 1)
      const fullLength = (this.$el.clientWidth + this.$el.clientHeight + 2) / 2
      const progress = selectionLength && this.isSelectionClosed ? 1 : Math.min(.95, selectionLength / 10)

      this.style = {
        'stroke-dasharray': `${progress * fullLength} ${fullLength}`
      }
    }
  },

  watch: {
    'selection.length': 'render'
  }
}
</script>
