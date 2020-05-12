<template>
  <svg viewBox="0 0 1 1">
    <circle cx="0.5" cy="0.5" r="0.5" :fill="hexColor" class="will-transform" ref="dot" />
  </svg>
</template>

<script>
import mixin from 'components/canvas/tiles/mixin'

export default {
  mixins: [mixin],

  computed: {
    hexColor() {
      return this.theme.colorMap.dots[this.tile.color]
    }
  }
}
</script>
