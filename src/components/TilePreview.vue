<template>
  <svg viewBox="0 0 1 1">
    <component :is="component" :tile="tile" :theme="theme" />
  </svg>
</template>

<script>
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

  computed: {
    component() {
      return tileToComponentMap[this.tile.type]
    }
  }
}
</script>
