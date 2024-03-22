<script lang="ts" setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';

import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import MenuItem from "@/components/ui/menu-item/MenuItem.vue"
import { Settings, Trash } from 'lucide-vue-next'
import { useChatStore } from '../store/chat';
import { useDb } from '../composables/useDb';
import { useLLM } from '../composables/useLLM';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog/index'
import { type Bot, type ChatRole, type IChatMessage } from '@/types';
import ChatMessage from '@/components/ui/chat/ChatMessage.vue';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from '@/components/ui/toast';
import UpdateBotForm from '@/components/domain/bot/UpdateBotForm.vue'
import Loading from '@/components/ui/loading/Loading.vue';
import type { ChatCompletionMessageParam } from 'web-llm';
// import { getPrompt } from '@/composables/useDocument'

const params = reactive({
  top_p: [0.8],
  top_k: [0.2],
  temperature: [0.4],
  max_length: [400],
})
const chatStore = useChatStore()
const db = useDb()
const activeBotId = db.getActiveBotId()
const activeBot = ref<Bot|null>()
const inputText = ref('')
const inputTextarea = ref<HTMLTextAreaElement>()
const loading = ref(true)
// The loading state when user sent a message / inferencing
const isBotThinking = ref(false)
const llm = useLLM()
const loadingProgress = ref(0)

onMounted(async () => {
  try {
    activeBot.value = await db.getActiveBot()
    llm.activeBot.value = activeBot.value
  }catch(e){
    activeBot.value = null
  }
  const dbMessages = await db.getMessages(activeBotId.value)

  if (activeBot.value) {
    llm.messages.value = dbMessages || []
    console.log(llm.messages.value);
    
    await llm.loadModel(activeBot.value.botId || "RedPajama-INCITE-Chat-3B-v1-q4f32_1", (progress) => {
      loadingProgress.value = Math.round(progress.progress * 100) 
      console.log(loadingProgress.value)
    })
    loading.value = false 
  }
})

onUnmounted(() => {
  // Unload the model on leave
  llm.unloadModel()
})

/**
 * Insert the message to database and send it to LLM
 * @param role The role who send the message
 * @param message The content
 */
const insertMessage = (role: ChatRole, message: string) => {
  db.insertMessage(activeBotId.value, role,  message)
  llm.insertMessage(activeBotId.value, role, message)
}



const currentResponse = ref('')


const sendMessage = async () => {

  if (loading.value) {
    alert("Model still loading")
    return 
  }
  console.log('active bot: ', llm.messages.value)
  
  // Insert user message
  insertMessage("user", inputText.value)
  inputText.value = ""

  const allMessagesCombined: ChatCompletionMessageParam[] = llm.messages.value.slice().reverse().map(msg => ({
    role: msg.role === 'bot' ? 'assistant' : msg.role,
    content: msg.message
  }))

  console.log({allMessagesCombined})
  // Get response from LLM
  let i = 0;
  llm.infer(allMessagesCombined, (msg) => {
    if(i === 0) {
      // Create new message
      insertMessage("bot", currentResponse.value)
    }
    let response = msg.choices.map(choice => choice.delta.content).join('')
    currentResponse.value += response
    llm.messages.value[0].message = currentResponse.value
    // inputTextarea.value.focus()
    i++
  
  }).then(()=> {
    i=0
    // Only insert to database, not the state
    db.insertMessage(activeBotId.value, "bot",  currentResponse.value)
    currentResponse.value = ""

  })
}

const { toast } = useToast()
const emptyChat = () => {
  llm.messages.value = []
  db.clearCurrentBotChat()
    .then(() => {
      toast({
        title: "Messages deleted successfully"
      })
    })
}

// Send message on win/ctrl + enter
const textareaKeydown = (e: KeyboardEvent) => {
  if((e.ctrlKey || e.metaKey) && e.key == 'Enter') sendMessage()
}

const isModelLoading = computed(() => loadingProgress.value < 100)

</script>
<template>
  <main class="py-10 px-8 lg:px-8 xl:px-12 flex-grow flex flex-col">
    <div class="text-center" v-if="activeBot === null">
      <Text type="p" >Create a bot to start chatting</Text>
    </div>
    <template v-else>
      <!-- Chat messages area -->
      <div class="messages flex-grow relative ">
        <div class="loading-screen text-center items-center mt-10" v-if="isModelLoading">
          <Loading name="spinner"></Loading>
          <Text type="h4">Loading model:</Text>
          <p>{{ loadingProgress }}%</p>
        </div>
        <div class="chat-messages px-5 overflow-y-auto flex flex-col-reverse absolute inset-0" v-else >
          <ChatMessage v-if="isBotThinking" role="bot" :loading="isBotThinking"></ChatMessage>
          <ChatMessage v-if="loading" role="user" :loading="loading"></ChatMessage>
    
          <ChatMessage v-else v-for="message in llm.messages.value" :role="message.role" :loading="false" >
            <div v-html="message.message"></div>
          </ChatMessage>
          <div class="time mb-8">
            <p class="text-gray-500 text-center">Today 10:36 AM</p>
          </div>
        </div>
      </div>
      <div class="message-box bg-slate-900 rounded-lg py-3 px-5 flex items-start gap-3"  v-if="!isModelLoading">
        <div class="w-10 h-10 bg-gradient-to-r flex-shrink-0 from-red-500 to-orange-500 mt-2 rounded-full"></div>
        <div class="w-full">
          <form @submit.prevent="sendMessage">
            <Textarea placeholder="Ask me anything" rows="3" @keydown="textareaKeydown" v-model="inputText" ref="inputTextarea"/>
            <div class="flex justify-end mt-3">
              <Button size="sm" variant="ghost">Send</Button>
            </div>
          </form>
        </div>
      </div>
    </template>
  </main>

  <!-- Parameter Adjust -->
  <div v-if="activeBot">
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
                <Text type="h4">{{ activeBot?.name }}</Text>
              </div>
              <Dialog>
                <DialogTrigger class="menu-link w-full px-3 py-2 bg-transparent text-gray-500 hover:text-gray-200 transition duration-200 rounded-md flex gap-2">
                  <Settings></Settings>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Bot Profile</DialogTitle>
                    <DialogDescription>
                      Change the bot data or feed with documents
                    </DialogDescription>
                  </DialogHeader>
                  <UpdateBotForm/>
                </DialogContent>
              </Dialog>
            </div>
            <Text type="p">{{ activeBot?.description }}</Text>
          </CardHeader>
        </Card>

        <AlertDialog>
          <AlertDialogTrigger as-child>
            <Button variant="outline-danger" class="w-full mt-5">
              <Trash width="16" class="mr-2"/>
              Empty Chat
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your chat from your device
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction @click="emptyChat">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </aside>
  </div>

</template>