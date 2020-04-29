<template>
  <g class="MapTile will-transform" style="touch-action: manipulation;" transform-origin="0.5 0.5">
    <component
      :is="tileToComponentMap[tile.type]"
      :tile="tile"
      :theme="theme"
      ref="content"
    />
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
    },

    theme: {
      type: Object
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
        duration: 50 * keyframes.length,
        keyframes,
      }).finished

      await this.bounce(keyframes.length)
    },

    async bounce(speed) {
      const maxSpeed = 10
      speed = Math.min(maxSpeed, speed)

      return anime({
        targets: this.$el,
        easing: () => (x) => (-Math.pow(2 * x - 1, 2) + 1),
        duration: 150,
        translateY: -0.05 * (this.tile.y === 0 ? maxSpeed * 1.5 : speed),
      }).finished
    }
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
