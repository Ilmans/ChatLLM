<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { Text } from "./components/ui/text"
import MenuItem from "./components/ui/menu-item/MenuItem.vue"
import { MessageCircle, BookA, ChefHat, Plus, AlignLeft,X, Menu } from 'lucide-vue-next'
import { computed, onMounted, provide, reactive, ref, watch } from "vue"
import { useChatStore } from '@/store/chat'
import CreateBotForm from "@/components/domain/bot/CreateBotForm.vue"
import { useDb } from "./composables/useDb"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./components/ui/dialog"
import DarkToggle from '@/components/dark-toggle/DarkToggle.vue'
import Toaster from '@/components/ui/toast/Toaster.vue'
import { cn } from "./lib/utils"
import {useWebGPU} from '@/composables/useWebGPU'
import { useWindowSize } from '@vueuse/core'
import { ChevronRight } from "lucide-vue-next"
import { useLLM } from "./composables/useLLM"

const chatStore = useChatStore()
const llm = useLLM()
const db = useDb()
const activeBotId = ref(db.getActiveBotId())
const isCreateBotDialogOpen = ref(false)

chatStore.fetchBots()

const bots = computed(() => chatStore.bots)
const webGPU = useWebGPU()

onMounted(async () => {

  // Check whether WebGPU is supported

  if(!await webGPU.isWebGPUSupported()) {
    const message = `This project runs models in the browser with WebGPU and only works in Google Chrome v113 and above on Desktop with supported GPUs.\n\nExperimental support may be available for desktop Firefox and Safari Tech Preview.`
    alert(message)
    throw Error(message)
  }

})

const setActiveBotId = (bot: number) => {
  db.setActiveBotId(bot)
  activeBotId.value = bot
}

const onBotCreated = (bot) => {
  isCreateBotDialogOpen.value = false
  setActiveBotId(bot.botId)
}

const { width } = useWindowSize()
const showSidebar = ref(true)
const showRightSidebar = ref(true)
const showHeader = computed(() => width.value >= 1024 ? false : true)
const checkWindowSize = () => {
  showSidebar.value = width.value >= 1024 ? true : false
  showRightSidebar.value = showSidebar.value
}
watch(width, () => {
  checkWindowSize()
})
onMounted(() => {
  checkWindowSize()
})
provide('showRightSidebar',showRightSidebar)
</script>

<template>
  <div class="main h-screen flex flex-col">
    <!-- <header class="py-5 px-8 flex justify-between">
      <div class="header-left flex items-center justify-between w-full pr-5">
        <Text type="h2">ChatLLM</Text>
        <DarkToggle/>
      </div>
      <div class="header-right">
        <Button>
          <div class="flex items-center gap-2">
            <FileOutput width="20"></FileOutput>
            Export Chat
          </div>
        </Button>
      </div>
    </header> -->
    <div class="body-content flex flex-grow">
      <aside v-show="showSidebar" class="p-3 px-8 fixed lg:static max-w-80 h-full min-w-72 flex-shrink-0 shadow-lg lg:shadow-none z-20 bg-background">
        <div class="header-left flex items-center justify-between w-full pr-5 py-10 relative">
          <Text type="h2">ChatLLM</Text>
          <button class="absolute top-11 right-0" @click="showSidebar = false"><X></X></button>
        </div>
        <div class="menu">
          <ul>
            <MenuItem to="/">
              <MessageCircle width="20" />
              Chat 
            </MenuItem>
            <MenuItem to="/model-list">
              <BookA width="20" />
              Models
            </MenuItem>
          </ul>
          <template v-if="$route.name == 'home'">
            <Text type="p" class="my-3">Your Bots</Text>
            <ul>
              <li class="menu-item mb-1" v-for="bot in bots">
                  <button @click="setActiveBotId(bot.id)" :class="cn(activeBotId == bot.id ? 'light:text-black dark:text-white' : 'text-gray-500','menu-link px-3 py-2 bg-transparent hover:text-primary dark:hover:text-gray-200 transition duration-200 rounded-md flex gap-2')">
                    <AlignLeft width="20" />
                    {{bot.name}}
                  </button>
              </li>
              <li class="border mt-10 rounded-md border-dashed border-gray-500 hover:border-primary transition duration-200">
                <!-- Create new bot modal -->
                <Dialog v-model:open="isCreateBotDialogOpen" >
                  <DialogTrigger class="menu-link w-full px-3 py-2 bg-transparent text-gray-500 dark:hover:text-gray-200 hover:text-primary transition duration-200 rounded-md flex gap-2">
                    <Plus width="20" />
                    Create new bot 
                  </DialogTrigger>
                  <DialogContent >
                    <DialogHeader>
                      <DialogTitle>Create new bot</DialogTitle>
                      <DialogDescription>
                        Create your own bot profile
                      </DialogDescription>
                    </DialogHeader>
                    <CreateBotForm @success="onBotCreated"/>
                  </DialogContent>
                </Dialog>
              </li>
            </ul>
          </template>
          <div class="dark-toggle mt-10 flex justify-between">
            <span>Dark Mode</span>
            <DarkToggle/>
          </div>

        </div>
      </aside>
      <div id="main-content" class="w-full z-1 flex">
        <header v-show="showHeader"class="fixed flex justify-between items-center py-4 px-8 border-b border-gray-200 bg-background w-full z-10">
          <button @click="() => showSidebar = !showSidebar">
            <Menu></Menu>
          </button>
          <button @click="() => showRightSidebar = !showRightSidebar" class="flex">
            <span>Model Options</span>
            <ChevronRight></ChevronRight>
          </button>
        </header>
        <router-view/>
      </div>
    </div>
  </div>
  <Toaster />

</template>