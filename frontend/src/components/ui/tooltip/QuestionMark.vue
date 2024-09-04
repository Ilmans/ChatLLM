<script setup lang="ts">
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from 'radix-vue'

</script>
<template>
    <TooltipProvider>
    <TooltipRoot>
      <TooltipTrigger
        class="inline-flex ml-2 h-[20px] w-[20px] items-center justify-center rounded-full dark:bg-gray-900 dark:border-gray-700 bg-white outline-none border-gray-300 hover:border-gray-600 border focus:shadow-black text-gray-500"
      >
      ?
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          class="max-w-[400px] z-[100]  leading-relaxed text-center data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-grass11 select-none rounded-[4px] bg-white dark:bg-gray-800  px-[15px] py-[10px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
          :side-offset="5"
        >
          <slot/>
          <TooltipArrow
            class="fill-white dark:fill-dark-800"
            :width="8"
          />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>