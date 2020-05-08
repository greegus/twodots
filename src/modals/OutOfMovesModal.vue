<template>
  <modal-layout class="select-none font-sans font-light" width="480" hide-closer>
    <div class="absolute w-full inset-x-0 t-0 flex items-end justify-center text-red-600" style="transform: translateY(-4rem)">
      <Icon name="heart-broken" size="5x" />
    </div>

    <div class="font-light text-5xl text-center my-5">
      Out of moves
    </div>

    <div class="pt-2">
      <Button class="w-full" @click="$emit('close')" primary>
        Continue
      </Button>
    </div>
  </modal-layout>
</template>
