<template>
  <svg viewBox="0 0 1 1">
    <component :is="component" :tile="tile" :theme="theme" />
  </svg>
</template>

<script>
import tilePreviewToComponentMap from 'utils/tilePreviewToComponentMap'

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
      return tilePreviewToComponentMap[this.tile.type]
    }
  }
}
</script>
