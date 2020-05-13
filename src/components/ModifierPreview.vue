<template>
  <component :is="component" :modifier="modifier" :theme="theme" />
</template>

<script>
import { getModifierPreviewComponent } from 'utils/modifiers'

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
      return getModifierPreviewComponent(this.modifier.type)
    }
  }
}
</script>
