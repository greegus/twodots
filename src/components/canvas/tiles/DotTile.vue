<template>
  <g class="DotTile" transform-origin="0.5 0.5">
    <circle ref="beacon" cx="0.5" cy="0.5" r="0.26" :fill="hexColor" transform-origin="0.5 0.5" class="pointer-events-none will-transform" />
    <circle cx="0.5" cy="0.5" r="0.26" :fill="hexColor" class="will-transform" ref="dot" />
    <circle class="opacity-0" cx="0.5" cy="0.5" r="0.4" fill="black" />
  </g>
</template>

<script>
import anime from 'animejs'
import config from 'config'

export default {
  name: 'DotTile',

  props: {
    tile: {
      type: Object,
      required: true
    }
  },

  computed: {
    hexColor() {
      return config.colorsMap[this.tile.color]
    }
  },

  methods: {
    animateBurn() {
      return anime({
        targets: this.$refs.dot,
        fill: '#333',
        easing: 'linear',
        duration: 150
      }).finished
    },

    animateBeacon() {
      return anime({
        targets: this.$refs.beacon,
        scale: [1, 2.5],
        opacity: [1, 0],
        easing: 'linear',
        duration: 400
      }).finished
    }
  }
}
</script>
