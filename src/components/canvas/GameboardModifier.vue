<template>
  <component
    :is="modifierToComponentMap[modifier.type]"
    :modifier="modifier"
    :theme="theme"
    ref="content"
  />
</template>

<script>
import modifierToComponentMap from 'utils/modifierToComponentMap'

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

  data() {
    return {
      modifierToComponentMap
    }
  }
}
</script>