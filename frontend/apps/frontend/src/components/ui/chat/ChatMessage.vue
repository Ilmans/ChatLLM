<script lang="ts" setup>
import { cn } from '@/lib/utils'
import { computed } from 'vue';
import { Text } from "@/components/ui/text"
import { Skeleton } from "@/components/ui/skeleton"

const props = defineProps<{
    user?: boolean, // 1 = user, 0 = bot
    loading?: boolean
}>()
const imageClass = computed(() => {
    if(props.user) return 'from-blue-500 to-indigo-500'
    return 'from-red-500 to-red-500'
})
</script>
<template>
    <div class="message mb-10">
        <div class="avatar flex gap-5">
            <div :class="cn('w-10 h-10 bg-gradient-to-r rounded-full', imageClass)"></div>
            <Text  v-if="loading" type="h3" class="flex-1"><slot></slot></Text>
            <div v-else class="flex-1">
                <Skeleton class="w-full mb-3 h-[15px] rounded-md" />
                <Skeleton class="w-full mb-3 h-[15px] rounded-md" />
                <Skeleton class="w-1/3 mb-3 h-[15px] rounded-md" />
            </div>
        </div>
    </div>
</template>