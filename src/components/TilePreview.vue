<template>
  <svg viewBox="0 0 1 1">
    <component :is="component" :tile="tile" :theme="theme" />
  </svg>
</template>

<script>
import { getTilePreviewComponent } from 'utils/tiles'

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
      return getTilePreviewComponent(this.tile.type)
    }
  }
}
</script>
