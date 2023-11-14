<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { Text } from "./components/ui/text"
import { Slider } from "./components/ui/slider"
import MenuItem from "./components/ui/menu-item/MenuItem.vue"
import { MessageCircle, BookA, ChefHat, Plus, AlignLeft, FileOutput } from 'lucide-vue-next'
import { reactive } from "vue"

const params = reactive({
  top_p: [0.8],
  top_k: [0.2],
  temperature: [0.4],
  max_length: [400],
})

</script>

<template>
  <div class="main h-screen flex flex-col">
    <header class="py-5 px-8 flex justify-between mb-5 ">
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
            <MenuItem to="/prompts-collection">
              <ChefHat width="20" />
              Prompts 
            </MenuItem>
          </ul>
          <Text type="p" class="mb-3">Your Bots</Text>
          <ul>
            <MenuItem to="/">
              <AlignLeft width="20" />
              English Helper Bot
            </MenuItem>
            <MenuItem to="/models">
              <AlignLeft width="20" />
              Travel Expert
            </MenuItem>
            <MenuItem to="/prompts-collection">
              <AlignLeft width="20" />
              Gaming Advisor
            </MenuItem>
            <MenuItem to="/create" class="border mt-10 rounded-md border-dashed border-gray-500 hover:border-gray-200 transition duration-200">
              <Plus width="20" />
              Create new bot 
            </MenuItem>
          </ul>
        </div>
      </aside>
      <main class="py-10 px-24 flex-grow flex flex-col">
        <div class="messages flex-grow">
          <div class="time mb-8">
            <p class="text-gray-500 text-center">Today 10:36 AM</p>
          </div>
          <div class="message mb-10">
            <div class="avatar flex gap-5">
              <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              <Text type="h3" class="flex-1">Write a literature review about React!</Text>
            </div>
          </div>
          <div class="message mb-10">
            <div class="avatar flex gap-5">
              <div class="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
              <Text type="p" class="flex-1 text-gray-400">This literature review provides an overview of React, a popular JavaScript library for building user interfaces. The review examines the evolution of React, its key features, and various applications across different domains. It also explores the advantages and limitations of using React in web development, highlighting its impact on the industry and future trends.</Text>
            </div>
          </div>
        </div>
        <div class="message-box bg-slate-900 rounded-lg py-3 px-5 flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
          Ask me anything..
        </div>
      </main>
      <aside class="py-3 px-10  w-80 flex-shrink-0">
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
                <Text type="p" class="mb-3">Top K</Text>
                <Text type="p" class="mb-3">{{ params.top_k[0]}}</Text>
              </div>
              <Slider v-model="params.top_k" :min="0" :max="1" :step="0.1"></Slider>
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
      </aside>
    </div>
  </div>
</template>