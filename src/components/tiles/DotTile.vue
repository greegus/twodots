<template>
  <g transform-origin="0.5 0.5">
    <circle class="DotTile" cx="0.5" cy="0.5" r="0.32" :fill="color" />
    <circle ref="beacon" cx="0.5" cy="0.5" r="0.32" :fill="color" transform-origin="0.5 0.5" class="pointer-events-none" />
  </g>
</template>

<script>
import anime from 'animejs'
import config from 'config'

export default {
  name: 'DotTile',

  props: {
    dot: {
      type: Object,
      required: true
    },

    isSelected: {
      type: Boolean
    }
  },

  computed: {
    color() {
      return config.colorsMap[this.dot.color]
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

    animateBeacon() {
      return anime({
        targets: this.$refs.beacon,
        scale: [1, 2],
        opacity: [1, 0],
        easing: 'linear',
        duration: 250
      }).finished
    },

    async animateFall(depth) {
      await anime({
        targets: this.$el,
        easing: 'linear',
        translateY: [-1 * depth, 0],
        duration: 50 * depth
      }).finished

      return anime({
        targets: this.$el,
        easing: 'easeInQuad',
        direction: 'alternate',
        translateY: -0.125,
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
