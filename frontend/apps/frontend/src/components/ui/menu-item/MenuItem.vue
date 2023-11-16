<script lang="ts" setup>
const props = defineProps<{
    to: string
}>()
</script>
<template>
    <li class="menu-item mb-1">
        <router-link :to="to" class="menu-link px-3 py-2 bg-transparent text-gray-500 hover:text-gray-200 transition duration-200 rounded-md flex gap-2"><slot/></router-link>
    </li>
</template>
<style>
.menu-link.router-link-active {
    color: white;
    background: #222
}
</style>