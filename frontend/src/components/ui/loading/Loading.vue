<script setup lang="ts">
const props = defineProps<{
    name: "spinner"
}>()
</script>
<template>
    <div class="loading">
        <span :class="['loader', `loader-${name}`]"></span>
    </div>
</template>
<style>
.loader-spinner {
    width: 48px;
    height: 48px;
    border: 5px solid var(--primary);
    border-bottom-color: transparent;
    display: inline-block;
    border-radius: 50%;
    animation: rotate 1s linear infinite;
}
@keyframes rotate {
    0% {
        rotate: 0 
    }
    100% {
        rotate: 360deg
    }
}
</style>