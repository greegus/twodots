<template>
  <g class="pointer-events-none">
    <IceModifier v-for="modifier in modifiers" :key="modifier.id" :modifier="modifier" :theme="theme" :x="modifier.position.x" :y="modifier.position.y" />
  </g>
</template>

<script>
import IceModifier from 'components/canvas/modifiers/IceModifier'

export default {
  components: {
    IceModifier
  },

  props: {
    modifiers: Array,
    theme: Object
  }
}
</script>