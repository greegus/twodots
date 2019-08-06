<template>
  <g class="DotTile" transform-origin="0.5 0.5">
    <circle cx="0.5" cy="0.5" r="0.26" :fill="color" />
    <circle class="opacity-0" cx="0.5" cy="0.5" r="0.4" fill="black" />
    <circle ref="beacon" cx="0.5" cy="0.5" r="0.26" :fill="color" transform-origin="0.5 0.5" class="pointer-events-none" />
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
    color() {
      return config.colorsMap[this.tile.color]
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
        scale: [1, 2.5],
        opacity: [1, 0],
        easing: 'linear',
        duration: 400
      }).finished
    }
  }
}
</script>
