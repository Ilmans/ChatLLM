<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { Text } from "./components/ui/text"
import { Input } from "./components/ui/input"
import { Slider } from "./components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import ChatMessage from "./components/ui/chat/ChatMessage.vue"
import { Textarea } from "./components/ui/textarea"
import MenuItem from "./components/ui/menu-item/MenuItem.vue"
import { MessageCircle, BookA, ChefHat, Plus, AlignLeft, FileOutput, Settings } from 'lucide-vue-next'
import { onMounted, reactive, ref } from "vue"
import { useChatStore } from '@/store/chat'
import CreateBotForm from "@/components/domain/bot/CreateBotForm.vue"
import { useDb } from "./composables/useDb"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./components/ui/dialog"
import Toaster from '@/components/ui/toast/Toaster.vue'
import { cn } from "./lib/utils"
import {useWebGPU} from '@/composables/useWebGPU'

const chatStore = useChatStore()
const bots = ref([])
const db = useDb()
const activeBot = ref()

const webGPU = useWebGPU()

onMounted(async () => {

  // Check whether WebGPU is supported

  if(!await webGPU.isWebGPUSupported()) {
    const message = `This project runs models in the browser with WebGPU and only works in Google Chrome v113 and above on Desktop with supported GPUs.\n\nExperimental support may be available for desktop Firefox and Safari Tech Preview.`
    alert(message)
    throw Error(message)
  }


  bots.value = await db.getBots()
  db.getActiveBot()
    .then((v) => {
      activeBot.value = v
      console.log()
    })
    .catch(err => console.log('arst'))

})


</script>

<template>
  <div class="main h-screen flex flex-col">
    <header class="py-5 px-8 flex justify-between">
      <div class="header-left">
        <Text type="h2">ChatLLM</Text>
      </div>
      <div class="header-right">
        <Button>
          <div class="flex items-center gap-2">
            <FileOutput width="20"></FileOutput>
            Export Chat
          </div>
        </Button>
      </div>
    </header>
    <div class="body-content flex flex-grow">
      <aside class="p-3 px-8  w-72 flex-shrink-0">
        <div class="menu">
          <ul>
            <MenuItem to="/">
              <MessageCircle width="20" />
              Chat 
            </MenuItem>
            <MenuItem to="/models">
              <BookA width="20" />
              Models
            </MenuItem>
            <MenuItem to="/prompts">
              <ChefHat width="20" />
              Prompts 
            </MenuItem>
          </ul>
          <template v-if="$route.name == 'home'">
            <Text type="p" class="my-3">Your Bots</Text>
            <ul>
              <li class="menu-item mb-1" v-for="bot in bots">
                  <button @click="db.setActiveBot(bot.id)" :class="cn(activeBot.id == bot.id ? 'text-white' : 'text-gray-500','menu-link px-3 py-2 bg-transparent  hover:text-gray-200 transition duration-200 rounded-md flex gap-2')">
                    <AlignLeft width="20" />
                    {{bot.name}}
                  </button>
              </li>
              <li class="border mt-10 rounded-md border-dashed border-gray-500 hover:border-gray-200 transition duration-200">
                <!-- Create new bot modal -->
                <Dialog>
                  <DialogTrigger class="menu-link w-full px-3 py-2 bg-transparent text-gray-500 hover:text-gray-200 transition duration-200 rounded-md flex gap-2">
                    <Plus width="20" />
                    Create new bot 
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create new bot</DialogTitle>
                      <DialogDescription>
                        Create your own bot profile
                      </DialogDescription>
                    </DialogHeader>
                    <CreateBotForm/>
                  </DialogContent>
                </Dialog>
              </li>
            </ul>
          </template>
        </div>
      </aside>
      <router-view/>
    </div>
  </div>
  <Toaster />

</template>