<template>
  <component :is="component" :modifier="modifier" :theme="theme" ref="content" />
</template>

<script>
import { getModifierComponent } from 'utils/modifiers'

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
      return getModifierComponent(this.modifier.type)
    }
  }
}
</script>