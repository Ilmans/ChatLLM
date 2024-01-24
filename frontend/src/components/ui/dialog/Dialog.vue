<script setup lang="ts">
import { DialogRoot } from 'radix-vue'
import { provide, ref, toRef } from 'vue';

const props = defineProps<{
  open?: boolean
}>()

const open = ref(props.open)
const emit = defineEmits(['update:open']) 


const toggleOpen = (v: boolean) => {
  open.value = v
  emit('update:open',v)
}


provide('open',open)
</script>

<template>
  <DialogRoot :open="open" @update:open="toggleOpen">
    <slot />
  </DialogRoot>
</template>
