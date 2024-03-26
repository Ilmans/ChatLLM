<script setup lang="ts">
import { DialogRoot } from 'radix-vue'
import { computed, provide, ref, toRef } from 'vue';

const props = defineProps<{
  open?: boolean
}>()

const emit = defineEmits(['update:open']) 


const toggleOpen = (v: boolean) => {
  emit('update:open',v)
}

const open = computed(() => props.open)
provide('open',open)
</script>

<template>
  <DialogRoot :open="open" @update:open="toggleOpen">
    <slot />
  </DialogRoot>
</template>
