<template>
  <svg viewBox="0 0 1 1">
    <component :is="component" :tile="tile" />
  </svg>
</template>

<script>
import tileToComponentMap from 'utils/tileToComponentMap'

export default {
  props: {
    tile: {
      type: Object,
      required: true
    }
  },

  computed: {
    component() {
      return tileToComponentMap[this.tile.type]
    }
  }
}
</script>
