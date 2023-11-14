<script setup lang="ts">
import type { onMounted } from 'vue';
import NxWelcome from './NxWelcome.vue';
import {Counter} from '@acme/counter'
</script>

<template>
  <NxWelcome title="frontend" />
  <Counter></Counter>
</template>
