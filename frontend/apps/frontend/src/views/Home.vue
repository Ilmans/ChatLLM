<script lang="ts" setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue';

import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import MenuItem from "@/components/ui/menu-item/MenuItem.vue"
import { MessageCircle, BookA, ChefHat, Plus, AlignLeft, FileOutput, Settings } from 'lucide-vue-next'
import { useChatStore } from '../store/chat';
import { useDb } from '../composables/useDb';
import { useLLM } from '../composables/useLLM';
import {} from '@/components/ui/text'
import { type Bot, type ChatRole, type IChatMessage } from '@/types';
import ChatMessage from '@/components/ui/chat/ChatMessage.vue';


const params = reactive({
  top_p: [0.8],
  top_k: [0.2],
  temperature: [0.4],
  max_length: [400],
})
const chatStore = useChatStore()
const db = useDb()
const activeBotId = db.getActiveBotId()
const activeBot = ref<Bot>()
const messages = ref<IChatMessage[]>([])
const newMessageText = ref('')
const loading = ref(true)
// The loading state when user sent a message / inferencing
const isBotThinking = ref(false)

const model = useLLM()
const loadingProgress = ref(0)

onMounted(async () => {
  activeBot.value = await db.getActiveBot()
  setTimeout(() => {
    loading.value = false 
    messages.value = dbMessages
    console.log(messages.value)
  },200)
  // const chat = ref(new ChatModule())
  const dbMessages = await db.getMessages(activeBotId.value)

  await model.loadModel("RedPajama-INCITE-Chat-3B-v1-q4f16_1", (progress) => {
    console.log(progress.progress)
    loadingProgress.value = Math.round(progress.progress * 100) 
  })

  // db.insertMessage(1, "user", "Write a literature review about React!")
  // db.insertMessage(1, "bot", "You are welcome. Please let me know if you need any more help!")
})
onUnmounted(() => {
  model.unloadModel()
})

const insertMessage = (role: ChatRole, message: string) => {
  db.insertMessage(activeBotId.value, role,  message)

  // Insert the message to the very first index
  messages.value.unshift({
    botId: activeBotId.value,
    date: Date.now(),
    message: message,
    role: role
  })

}
const currentResponse = ref('')
const sendMessage = () => {
  // Insert user message
  insertMessage("user", newMessageText.value)
  
  // Get response from LLM
  model.infer(newMessageText.value, (step, currentMessage) => {
    console.log('step', step, currentResponse.value)
    if (step == 2 && currentResponse.value == '') {
      // Create new message
      messages.value.unshift({
        botId: activeBotId.value,
        date: Date.now(),
        message: currentResponse.value,
        role: "bot"
      })
    }
    currentResponse.value = currentMessage
    messages.value[0].message = currentMessage
  }).then(()=> {
    db.insertMessage(activeBotId.value, "bot",  currentResponse.value)
    currentResponse.value = ""
  })
}
const textareaKeydown = (e: KeyboardEvent) => {
  if((e.ctrlKey || e.metaKey) && e.key == 'Enter') sendMessage()
}
</script>
<template>
  <main class="py-10 px-8 lg:px-8 xl:px-12 flex-grow flex flex-col">
    <!-- Chat messages area -->
    <div class="messages flex-grow relative">
      <div class="loading-screen text-center items-center" v-if="loadingProgress < 100">
        <Text type="h4">Loading model:</Text>
        <p>{{ loadingProgress }}%</p>
      </div>
      <div class="chat-messages px-5 overflow-y-scroll flex flex-col-reverse absolute inset-0" >
        <ChatMessage v-if="isBotThinking" role="bot" :loading="isBotThinking"></ChatMessage>
        <ChatMessage v-if="loading" role="user" :loading="loading"></ChatMessage>
  
        <ChatMessage v-else v-for="message in messages" :role="message.role" :loading="false">
          {{ message.message }}
        </ChatMessage>
        <div class="time mb-8">
          <p class="text-gray-500 text-center">Today 10:36 AM</p>
        </div>
      </div>
    </div>
    <div class="message-box bg-slate-900 rounded-lg py-3 px-5 flex items-start gap-3">
      <div class="w-10 h-10 bg-gradient-to-r flex-shrink-0 from-red-500 to-orange-500 mt-2 rounded-full"></div>
      <div class="w-full">
        <form @submit.prevent="sendMessage">
          <Textarea placeholder="Ask me anything" rows="3" @keydown="textareaKeydown" v-model="newMessageText"/>
          <div class="flex justify-end mt-3">
            <Button size="sm" variant="ghost">Send</Button>
          </div>
        </form>
      </div>
    </div>
  </main>

  <!-- Parameter Adjust -->
  <aside class="py-3 px-10 xl:w-96 w-72 flex-shrink-0">
    <div class="menu">
      <ul>
        <li class="mb-8">
          <div class="flex justify-between">
            <Text type="p" class="mb-3">Top P</Text>
            <Text type="p" class="mb-3">{{ params.top_p[0] }}</Text>
          </div>
          <Slider v-model="params.top_p" :min="0" :max="1" :step="0.1"></Slider>
        </li>
        <li class="mb-8">
          <div class="flex justify-between">
            <Text type="p" class="mb-3">Temperature</Text>
            <Text type="p" class="mb-3">{{ params.temperature[0] }}</Text>
          </div>
          <Slider v-model="params.temperature" :min="0" :max="1" :step="0.1"></Slider>
        </li>
        <li class="mb-8">
          <div class="flex justify-between">
            <Text type="p" class="mb-3">Maximum Length</Text>
            <Text type="p" class="mb-3">{{ params.max_length[0] }}</Text>
          </div>
          <Slider v-model="params.max_length" :step="5" :max="4000"></Slider>
        </li>
      </ul>
    </div>
    <div class="about-bot">
      <Card>
        <CardHeader>
          <div class="flex justify-between items-center mb-3">
            <div class="flex items-center gap-3 ">
              <div class="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
              <Text type="h4">{{ activeBot.name }}</Text>
            </div>
            <a href="#">
              <Settings></Settings>
            </a>
          </div>
          <Text type="p">{{ activeBot.description }}</Text>
        </CardHeader>
      </Card>
    </div>
  </aside>
</template>