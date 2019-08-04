<template>
  <modal-layout class="select-none font-sans font-light" width="480" hide-closer>
    <div class="absolute w-full inset-x-0 t-0 flex items-end justify-center text-red-600" style="transform: translateY(-4rem)">
      <Icon name="heart-broken" size="5x" />
    </div>

    <div class="font-light text-5xl text-center my-5">
      Out of moves
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
