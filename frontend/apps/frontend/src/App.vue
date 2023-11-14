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
  <div class="main">
    <header class="p-3 flex justify-between">
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
    <div class="body-content flex">
      <aside class="p-3  h-screen w-60">
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
      <main class="p-10 flex-grow">
        <router-view></router-view>
      </main>

      <aside class="py-3 px-10  h-screen w-80">
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