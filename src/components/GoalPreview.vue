<template>
  <component :is="component" :theme="theme" v-bind="attrs" />
</template>

<script>
import TilePreview from 'components/TilePreview'
import ModifierPreview from 'components/ModifierPreview'

export default {
  components: {
    TilePreview,
    ModifierPreview
  },

  props: {
    goal: {
      type: Object
    },

    theme: {
      type: Object
    }
  },

  computed: {
    component() {
      return this.goal.modifier ? ModifierPreview : TilePreview
    },

    attrs() {
      const { modifier, tile } = this.goal
      return modifier ? { modifier } : { tile }
    }
  },
}
</script>