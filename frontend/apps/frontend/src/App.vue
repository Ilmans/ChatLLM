<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { Text } from "./components/ui/text"
import { Slider } from "./components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import ChatMessage from "./components/ui/chat/ChatMessage.vue"
import { Textarea } from "./components/ui/textarea"
import MenuItem from "./components/ui/menu-item/MenuItem.vue"
import { MessageCircle, BookA, ChefHat, Plus, AlignLeft, FileOutput, Settings } from 'lucide-vue-next'
import { reactive } from "vue"

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
            <MenuItem to="/prompts">
              <ChefHat width="20" />
              Prompts 
            </MenuItem>
          </ul>
          <template v-if="$route.name == 'home'">
            <Text type="p" class="my-3">Your Bots</Text>
            <ul>
              <li class="menu-item mb-1">
                  <button class="menu-link px-3 py-2 bg-transparent text-gray-500 hover:text-gray-200 transition duration-200 rounded-md flex gap-2">
                    <AlignLeft width="20" />
                    English Helper Bot
                  </button>
              </li>
              <li class="menu-item mb-1">
                  <button class="menu-link px-3 py-2 bg-transparent text-gray-500 hover:text-gray-200 transition duration-200 rounded-md flex gap-2">
                    <AlignLeft width="20" />
                    Travel Expert
                  </button>
              </li>
              <li class="menu-item mb-1">
                  <button class="menu-link px-3 py-2 bg-transparent text-gray-500 hover:text-gray-200 transition duration-200 rounded-md flex gap-2">
                    <AlignLeft width="20" />
                   Gaming Advisor
                  </button>
              </li>
              <li class="border mt-10 rounded-md border-dashed border-gray-500 hover:border-gray-200 transition duration-200">
                  <button class="menu-link px-3 py-2 bg-transparent text-gray-500 hover:text-gray-200 transition duration-200 rounded-md flex gap-2">
                      <Plus width="20" />
                      Create new bot 
                  </button>
              </li>
            </ul>
          </template>
        </div>
      </aside>
      <router-view/>
    </div>
  </div>
</template>