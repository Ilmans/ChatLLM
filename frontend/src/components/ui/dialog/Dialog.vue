<script setup lang="ts">
import { DialogRoot } from 'radix-vue'
import { provide, ref } from 'vue';

const open = ref(false)

provide('open',open)
</script>

<template>
  <DialogRoot v-model:open="open">
    <slot />
  </DialogRoot>
</template>
