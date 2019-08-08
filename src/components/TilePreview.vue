<template>
  <svg viewBox="0 0 1 1">
    <component :is="component" :tile="tile" />
  </svg>
</template>

<script>
import config from 'config'

import DotTile from 'components/canvas/tiles/DotTile'

export default {
  components: {
    DotTile
  },

  props: {
    tile: {
      type: Object,
      required: true
    }
  },

  computed: {
    component() {
      const tileToComponentMap = {
        [config.tileTypes.DOT]: DotTile
      }

      return tileToComponentMap[this.tile.type]
    }
  }
}
</script>
