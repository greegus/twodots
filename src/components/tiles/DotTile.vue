<template>
  <g transform-origin="0.5 0.5">
    <circle class="DotTile" cx="0.5" cy="0.5" r="0.32" :fill="color" />
    <circle class="DotTile__selectionHaze" :class="{ isSelected }" cx="0.5" cy="0.5" r="0.32" :fill="color" transform-origin="0.5 0.5" />
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
    destroy() {
      this.destructionAnimation.restart()
      return this.destructionAnimation.finished
    }
  },

  mounted() {
    this.destructionAnimation = anime({
      targets: this.$el,
      scale: 0,
      autoplay: false,
      easing: 'linear',
      duration: 150
    })
  }
}
</script>

<style lang="postcss">
  .DotTile__selectionHaze {
    opacity: 0;

    &.isSelected {
      animation: DotTile__selectionHaze .5s;
      /* transform-origin: 0.5 0.5; */
    }
  }

  @keyframes DotTile__selectionHaze {
    0% {opacity: 1}
    100% {opacity: 0; transform: scale(2)}
  }
</style>

