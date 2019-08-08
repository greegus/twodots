<template>
  <g class="MapTile" transform-origin="0.5 0.5">
    <component :is="tileToComponentMap[tile.type]" :tile="tile" ref="content" />
  </g>
</template>

<script>
import anime from 'animejs'
import config from 'config'

import DotTile from 'components/canvas/tiles/DotTile'
import WallTile from 'components/canvas/tiles/WallTile'
import BombTile from 'components/canvas/tiles/BombTile'

export default {
  components: {
    DotTile,
    WallTile,
    BombTile
  },

  props: {
    tile: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      tileToComponentMap: {
        [config.tileTypes.DOT]: DotTile,
        [config.tileTypes.WALL]: WallTile,
        [config.tileTypes.BOMB]: BombTile
      }
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
