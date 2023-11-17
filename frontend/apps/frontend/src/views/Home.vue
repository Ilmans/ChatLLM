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
const loading = ref(true)
onMounted(async () => {
  const dbMessages = await db.getMessages(activeBot.value)
  setTimeout(() => {
    loading.value = false 
    messages.value = dbMessages
    console.log(messages.value)
  },200)

  // db.insertMessage(1, "user", "Write a literature review about React!")
  // db.insertMessage(1, "bot", "This literature review provides an overview of React, a popular JavaScript library for building user interfaces. The review examines the evolution of React, its key features, and various applications across different domains. It also explores the advantages and limitations of using React in web development, highlighting its impact on the industry and future trends.")
})
</script>
<template>
  <main class="py-10 px-24 flex-grow flex flex-col">
    <div class="messages flex-grow">
      <div class="time mb-8">
        <p class="text-gray-500 text-center">Today 10:36 AM</p>
      </div>
      
      <ChatMessage v-if="loading" role="user" :loading="loading"></ChatMessage>

      <ChatMessage v-else v-for="message in messages" :role="message.role" :loading="false">
        {{ message.message }}
      </ChatMessage>
      
    </div>
    <div class="message-box bg-slate-900 rounded-lg py-3 px-5 flex items-center gap-3">
      <div class="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
      <Textarea placeholder="Ask me anything" />
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