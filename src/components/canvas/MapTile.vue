<template>
  <g class="MapTile" transform-origin="0.5 0.5">
    <component :is="tileToComponentMap[tile.type]" :tile="tile" ref="content" />
  </g>
</template>

<script>
import anime from 'animejs'

import tileToComponentMap from 'utils/tileToComponentMap'

export default {
  props: {
    tile: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      tileToComponentMap
    }
  },

  methods: {
    animateDestruction() {
      return anime({
        targets: this.$el,
        scale: 0,
        easing: 'linear',
        duration: 150
      }).finished
    },

    async animateFall(waypoints) {
      const keyframes = waypoints
        // Relativize waypoints
        .map(({ x, y }) => ({
          translateX: x - this.tile.x,
          translateY: y - this.tile.y
        }))

      // Force starting position without animaition
      await anime({
        targets: this.$el,
        ...keyframes[0],
        easing: 'linear',
        duration: 0
      }).finished

      await anime({
        targets: this.$el,
        easing: 'linear',
        duration: 500 * keyframes.length,
        keyframes,
      }).finished

      return anime({
        targets: this.$el,
        easing: 'easeInQuad',
        direction: 'alternate',
        translateY: -0.125 * keyframes.length,
        duration: 50
      }).finished
    },
  },

  mounted() {
    anime({
      targets: this.$el,
      opacity: [0, 1],
      easing: 'linear',
      duration: 50
    })
  }
}
</script>
