<script lang="ts" setup>
import { reactive, ref } from 'vue';

import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ChatMessage from "@/components/ui/chat/ChatMessage.vue"
import { Textarea } from "@/components/ui/textarea"
import MenuItem from "@/components/ui/menu-item/MenuItem.vue"
import { MessageCircle, BookA, ChefHat, Plus, AlignLeft, FileOutput, Settings } from 'lucide-vue-next'
import { useChatStore } from '../store/chat';
import { useDb } from '../composables/useDb';

const params = reactive({
  top_p: [0.8],
  top_k: [0.2],
  temperature: [0.4],
  max_length: [400],
})
const chatStore = useChatStore()
const db = useDb()
const messages = ref([])
const fetchMessages = () => {
}

</script>
<template>
  <main class="py-10 px-24 flex-grow flex flex-col">
    <div class="messages flex-grow">
      <div class="time mb-8">
        <p class="text-gray-500 text-center">Today 10:36 AM</p>
      </div>
      <ChatMessage :user="false">
        Write a literature review about React!
      </ChatMessage>
      <ChatMessage :loading="true" :user="false">
        Write a literature review about React!
      </ChatMessage>
      <div class="message mb-10">
        <div class="avatar flex gap-5">
          <div class="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
          <Text type="p" class="flex-1 text-gray-400">This literature review provides an overview of React, a popular
            JavaScript library for building user interfaces. The review examines the evolution of React, its key features,
            and various applications across different domains. It also explores the advantages and limitations of using
            React in web development, highlighting its impact on the industry and future trends.</Text>
        </div>
      </div>
    </div>
    <div class="message-box bg-slate-900 rounded-lg py-3 px-5 flex items-center gap-3">
      <div class="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
      <Textarea placeholder="Ask me anything" />
    </div>
  </main>
  <aside class="py-3 px-10 w-96 flex-shrink-0">
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