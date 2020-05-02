<template>
  <component :is="tagName" class="Button button" :class="{ 'button-primary': primary, 'button-mall': small }" @pointerdown="playClick(); $emit('pointerdown', $event)" v-on="$listeners" v-bind="$attrs">
    <slot />
  </component>
</template>

<script>
import { playClick } from 'services/AudioService'

export default {
  props: {
    small: {
      type: Boolean
    },

    primary: {
      type: Boolean
    }
  },

  computed: {
    tagName() {
      return this.$attrs.href ? 'a' : 'button'
    }
  },

  methods: {
    playClick
  }
}
</script>
