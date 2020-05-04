<template>
  <component :is="tagName" class="Button button" :class="{ 'button-primary': primary, 'button-mall': small }" v-on="listeners" v-bind="$attrs">
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
    },

    listeners() {
      return {
        ...this.$listeners,

        pointerdown: (e) => {
          playClick()
          this.$emit('pointerdown', e)
        },

        click: (e) => {
          setTimeout(() => this.$emit('click', e), 100)
        }
      }
    }
  }
}
</script>
