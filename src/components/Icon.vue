<template>
  <FontAwesomeIcon :icon="name" v-bind="$attrs" />
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(fas)

export default {
  components: {
    FontAwesomeIcon
  },

  props: {
    name: {
      type: String
    }
  }
}
</script>
