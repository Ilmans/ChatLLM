<script setup lang="ts">
import { useColorMode, useDark } from '@vueuse/core'
import { Switch } from '@/components/ui/switch'

const mode = useDark()

</script>

<template>
    <Switch v-model:checked="mode"/>
</template>