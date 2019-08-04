<template>
  <modal-layout class="select-none font-sans font-light" width="480" hide-closer>
    <div class="absolute w-full inset-x-0 t-0 flex items-end justify-center text-yellow-500" style="transform: translateY(-4.5rem)">
      <Icon name="star" size="3x" style="transform: rotate(-25deg)" />
      <Icon name="star" size="5x" class="-mx-2 text-yellow-400" />
      <Icon name="star" size="3x" style="transform: rotate(25deg)" />
    </div>

    <div class="font-light text-5xl text-center mt-5">
      Genius
    </div>

    <div class="pt-2">
      <button class="btn btn-lg block w-full" @click="$emit('close')">
        Continue
      </button>
    </div>
  </modal-layout>
</template>

<script>
import Icon from 'components/Icon'

export default {
  components: {
    Icon
  }
}
</script>
