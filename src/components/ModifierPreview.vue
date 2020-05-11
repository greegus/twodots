<template>
  <component :is="component" :modifier="modifier" :theme="theme" />
</template>

<script>
import modifierPreviewToComponentMap from 'utils/modifierPreviewToComponentMap'

export default {
  props: {
    modifier: {
      type: Object,
      required: true
    },

    theme: {
      type: Object
    }
  },

  computed: {
    component() {
      return modifierPreviewToComponentMap[this.modifier.type]
    }
  }
}
</script>
