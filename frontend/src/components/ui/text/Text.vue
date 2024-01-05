<script setup lang="ts">
const classes = {
    h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
    h2: 'scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0',
    h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
    h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
    p: 'leading-7',
    small: 'text-sm font-medium leading-none',
    blockquote: 'mt-6 border-l-2 pl-6 italic',
}
const props = defineProps<{
    type: keyof typeof classes
}>()
</script>
<template>
    <component :is="type" :class="classes[type]">
        <slot/>
    </component>
</template>