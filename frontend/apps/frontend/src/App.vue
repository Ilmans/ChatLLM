<script setup lang="ts">
import { Button } from "@/components/ui/button"
import { Text } from "./components/ui/text"
import MenuItem from "./components/ui/menu-item/MenuItem.vue"
import { MessageCircle, BookA, ChefHat, Plus, AlignLeft, FileOutput } from 'lucide-vue-next'

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
    <div class="body-content">
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
      <main class="p-10">
        <router-view></router-view>
      </main>
      <footer class="text-center">
        Copyright &copy; 2023 - All rights reserved
      </footer>
    </div>
  </div>
</template>