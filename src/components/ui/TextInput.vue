<template>
  <div class="TextInput">
    <input class="input" :class="{ 'input-invalid': error }" :type="type" v-bind="$attrs" v-on="listeners" />

    <div class="text-sm text-red-600 mt-px" v-if="error">
      {{ error }}
    </div>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,

  props: {
    type: {
      type: String,
      default: 'text',
      validator: value => [
          'tel',
          'text',
          'number',
          'password',
          'email'
        ].includes(value)
    },

    error: {
      type: String
    }
  },

  computed: {
    listeners() {
      return {
        ...this.$listeners,
        input: e => this.$emit('input', e.target.value)
      }
    }
  }
}
</script>
