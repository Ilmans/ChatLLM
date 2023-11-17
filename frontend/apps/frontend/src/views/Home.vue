<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';

import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import MenuItem from "@/components/ui/menu-item/MenuItem.vue"
import { MessageCircle, BookA, ChefHat, Plus, AlignLeft, FileOutput, Settings } from 'lucide-vue-next'
import { useChatStore } from '../store/chat';
import { useDb } from '../composables/useDb';
import {} from '@/components/ui/text'
import type { IChatMessage } from '@/types';
import ChatMessage from '@/components/ui/chat/ChatMessage.vue';


const params = reactive({
  top_p: [0.8],
  top_k: [0.2],
  temperature: [0.4],
  max_length: [400],
})
const chatStore = useChatStore()
const db = useDb()
const activeBot = db.getActiveBot()
const messages = ref<IChatMessage[]>([])
const newMessageText = ref('')
const loading = ref(true)

// The loading state when user sent a message / inferencing
const isBotThinking = ref(false)


onMounted(async () => {
  const dbMessages = await db.getMessages(activeBot.value)
  setTimeout(() => {
    loading.value = false 
    messages.value = dbMessages
    console.log(messages.value)
  },200)

  // db.insertMessage(1, "user", "Write a literature review about React!")
  // db.insertMessage(1, "bot", "You are welcome. Please let me know if you need any more help!")
})
const sendMessage = () => {
  db.insertMessage(activeBot.value, "user", newMessageText.value)

  // Insert message to the very first index
  messages.value.unshift({
    botId: activeBot.value,
    date: Date.now(),
    message:newMessageText.value,
    role: "user"
  })
}
const textareaKeydown = (e: KeyboardEvent) => {
  if((e.ctrlKey || e.metaKey) && e.key == 'Enter') sendMessage()
}
</script>
<template>
  <main class="py-10 px-8 lg:px-8 xl:px-24 flex-grow flex flex-col">
    <div class="messages flex-grow relative">
      <div class="overflow-y-scroll flex flex-col-reverse absolute inset-0">
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
              <Text type="h4">English Helper Bot</Text>
            </div>
            <a href="#">
              <Settings></Settings>
            </a>
          </div>
          <Text type="p">Lorem ipsum dolor sit amet consectetur adipisicing elit.</Text>
        </CardHeader>
      </Card>
    </div>
  </aside>
</template>