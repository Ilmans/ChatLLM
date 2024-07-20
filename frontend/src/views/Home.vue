<script lang="ts" setup>
import {
  computed,
  inject,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  watch,
} from 'vue';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import MenuItem from '@/components/ui/menu-item/MenuItem.vue';
import { Settings, Trash } from 'lucide-vue-next';
import { useChatStore } from '../store/chat';
import { useDb } from '../composables/useDb';
import { useLLM } from '../composables/useLLM';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog/index';
import { type Bot, type ChatRole, type IChatMessage } from '@/types';
import ChatMessage from '@/components/ui/chat/ChatMessage.vue';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/toast';
import UpdateBotForm from '@/components/domain/bot/UpdateBotForm.vue';
import Loading from '@/components/ui/loading/Loading.vue';
import QuestionMark from '@/components/ui/tooltip/QuestionMark.vue';
import {
  prebuiltAppConfig,
  type ChatCompletionMessageParam,
} from '@mlc-ai/web-llm';
import Text from '@/components/ui/text/Text.vue';
import { Heading } from 'lucide-vue-next';
import { onBeforeRouteLeave } from 'vue-router';

const chatStore = useChatStore();
const db = useDb();
const activeBotId = computed(() => db.activeBotId.value);
const activeBot = ref<Bot | null>();
const inputText = ref('');
const inputTextarea = ref<HTMLTextAreaElement>();
const loading = ref(true);
// The loading state when user sent a message / inferencing
const isBotThinking = ref(false);
const llm = useLLM();
const loadingProgress = ref(0);
const isErrorLoadingModel = ref(false);
const updateBotFormOpen = ref(false);

const params = computed({
  get() {
    const p = activeBot.value.params;
    return {
      top_p: p.top_p,
      temperature: p.temperature,
      max_gen_len: p.max_gen_len,
      frequency_penalty: p.frequency_penalty,
    };
  },
  set() {},
});
const setActiveBot = async () => {
  try {
    llm.unloadModel();
    activeBot.value = await db.getActiveBot();
    llm.activeBot.value = activeBot.value;
  } catch (e) {
    activeBot.value = null;
  }
};

const loadModel = async () => {
  isErrorLoadingModel.value = false;
  loading.value = true;
  const dbMessages = await db.getMessages(activeBotId.value);

  if (activeBot.value) {
    llm.messages.value = dbMessages || [];
    console.log(llm.messages.value);
    llm
      .loadModel(
        activeBot.value.botId || 'RedPajama-INCITE-Chat-3B-v1-q4f32_1',
        (progress) => {
          loadingProgress.value = Math.round(progress.progress * 100);
          console.log(loadingProgress.value);
        }
      )
      .then(() => {
        loading.value = false;
      })
      .catch((err) => {
        loading.value = false;
        console.log(err);
        isErrorLoadingModel.value = true;
      });
  }
};
console.log(prebuiltAppConfig);

watch(activeBotId, async () => {
  await setActiveBot();
  await loadModel();
});

onMounted(async () => {
  await setActiveBot();
  await loadModel();
});

onUnmounted(() => {
  // Unload the model on leave
  llm.unloadModel();
});
// When the user leave the page in your Vue app
onBeforeRouteLeave(async () => {
  await llm.unloadModel();
});


/**
 * Insert the message to database and send it to LLM
 * @param role The role who send the message
 * @param message The content
 */
const insertMessage = (role: ChatRole, message: string) => {
  db.insertMessage(activeBotId.value, role, message);
  llm.insertMessage(activeBotId.value, role, message);
};

const currentResponse = ref('');

const sendMessage = async () => {
  if (loading.value) {
    alert('Model still loading');
    return;
  }
  // Insert user message
  insertMessage('user', inputText.value);
  inputText.value = '';

  const allMessagesCombined: ChatCompletionMessageParam[] = llm.messages.value
    .slice()
    .reverse()
    .map((msg) => ({
      role: msg.role === 'bot' ? 'assistant' : msg.role,
      content: msg.message,
    }));

  // Get response from LLM
  llm
    .infer(allMessagesCombined, (msg, i) => {
      if (i === 0) {
        // Create new message
        llm.insertMessage(activeBotId.value, 'bot', currentResponse.value);
      }
      console.log(msg);
      let response = msg.choices.map((choice) => choice.delta.content).join('');
      currentResponse.value += response;
      llm.messages.value[0].message = currentResponse.value;
      // inputTextarea.value.focus()
    })
    .then(() => {
      // Only insert to database, not the state
      db.insertMessage(activeBotId.value, 'bot', currentResponse.value);
      currentResponse.value = '';
    });
};

const { toast } = useToast();
const emptyChat = () => {
  llm.messages.value = [];
  db.clearCurrentBotChat().then(() => {
    toast({
      title: 'Messages deleted successfully',
    });
  });
};

// Send message on win/ctrl + enter
const textareaKeydown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key == 'Enter') sendMessage();
};

const isModelLoading = computed(() => loadingProgress.value < 100);
const showRightSidebar = inject('showRightSidebar');
</script>
<template>
  <main class="flex-grow flex flex-col h-full">
    <div class="text-center pt-24" v-if="activeBot === null">
      <Text type="p">Create a bot to start chatting</Text>
    </div>
    <template v-else>
      <!-- Chat messages area -->
      <div class="messages flex-grow relative">
        <div class="loading-screen text-center items-center mt-24">
          <template v-if="isErrorLoadingModel">
            <Badge variant="destructive" class="text-lg mb-3"
              >Error Loading Model</Badge
            >
            <Text type="h4">Please change to another model</Text>
          </template>
          <template v-else-if="isModelLoading">
            <Loading name="spinner"></Loading>
            <Text type="h4">Loading model:</Text>
            <p>{{ loadingProgress }}%</p>
          </template>
        </div>
        <div
          class="chat-messages py-10 px-8 lg:px-8 xl:px-24 overflow-y-auto flex flex-col-reverse absolute inset-0"
          v-if="!isModelLoading"
        >
          <ChatMessage
            v-if="isBotThinking"
            role="bot"
            :loading="isBotThinking"
          ></ChatMessage>
          <ChatMessage
            v-if="loading"
            role="user"
            :loading="loading"
          ></ChatMessage>

          <ChatMessage
            v-else
            v-for="message in llm.messages.value"
            :role="message.role"
            :loading="message.role === 'bot' && message.message == ''"
          >
            <div v-html="message.message"></div>
          </ChatMessage>
          <div class="time mb-8">
          </div>
        </div>
      </div>
      <div
        class="message-box rounded-lg py-3 px-5 xl:px-24 flex items-start gap-3"
        v-if="!isModelLoading"
      >
        <div class="w-full">
          <form @submit.prevent="sendMessage">
            <Textarea
              placeholder="Ask me anything"
              rows="3"
              @keydown="textareaKeydown"
              v-model="inputText"
              ref="inputTextarea"
            />
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
    <aside
      class="py-3 px-10 xl:w-96 w-72 flex-shrink-0"
      v-show="showRightSidebar"
    >
      <Text type="h3" class="mb-10 my-12">Parameters</Text>

      <div class="menu">

          <ul>
            <li class="mb-8">
              <div class="flex justify-between">
                <Text type="p" class="mb-3">
                  <span>Top P</span>
                  <QuestionMark>Control the probability of the output tokens. Higher Top P will output the high probability tokens. Lower Top P enable wider token output.</QuestionMark>
                </Text>
                <Text type="p" class="mb-3">{{ activeBot.params.top_p }}</Text>
              </div>  
              <Slider
                v-model="activeBot.params.top_p"
                :min="0"
                :max="1"
                :step="0.1"
              ></Slider>
            </li>
            <li class="mb-8">
              <div class="flex justify-between">
                <Text type="p" class="mb-3">
                  <span>Temperature</span>
                  <QuestionMark>Control randomness of the output. Higher value means more random and creative, lower value means more predictable.</QuestionMark>
                </Text>
                <Text type="p" class="mb-3">{{
                  activeBot.params.temperature
                }}</Text>
              </div>
              <Slider
                v-model="activeBot.params.temperature"
                :min="0"
                :max="1"
                :step="0.1"
              ></Slider>
            </li>
            <li class="mb-8">
              <div class="flex justify-between">
                <Text type="p" class="mb-3">
                  <span>Maximum Token Length</span>
                  <QuestionMark>Maximum tokens that will be generated by the model.</QuestionMark>
                </Text>
                <Text type="p" class="mb-3">{{
                  activeBot.params.max_gen_len
                }}</Text>
              </div>
              <Slider
                v-model="activeBot.params.max_gen_len"
                :step="5"
                :min="100"
                :max="4000"
              ></Slider>
            </li>
            <li class="mb-8">
              <div class="flex justify-between">
                <Text type="p" class="mb-3">
                  <span>Frequency Penalty</span>
                  <QuestionMark>Help the model to not using the same token too often.</QuestionMark>
                </Text>
                <Text type="p" class="mb-3">{{
                  activeBot.params.frequency_penalty
                }}</Text>
              </div>
              <Slider
                v-model="activeBot.params.frequency_penalty"
                :step="0.1"
                :min="-2"
                :max="2"
              ></Slider>
            </li>
          </ul>
      </div>
      <div class="about-bot">
        <Card class="bg-card border-primary ">
          <CardHeader>
            <div class="flex justify-between items-center mb-3">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                ></div>
                <Text type="h4">{{ activeBot?.name }}</Text>
              </div>
              <Dialog v-model:open="updateBotFormOpen">
                <DialogTrigger
                  class="menu-link px-3 py-2 bg-transparent text-gray-500 hover:text-gray-200 transition duration-200 rounded-md flex gap-2"
                >
                  <Settings></Settings>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Bot Profile</DialogTitle>
                    <DialogDescription>
                      Change the bot data or feed with documents
                    </DialogDescription>
                  </DialogHeader>
                  <UpdateBotForm @success="updateBotFormOpen = false" />
                </DialogContent>
              </Dialog>
            </div>
            <Text type="p">{{ activeBot?.description }}</Text>
          </CardHeader>
        </Card>

        <AlertDialog>
          <AlertDialogTrigger as-child>
            <Button variant="outline-danger" class="w-full mt-5">
              <Trash width="16" class="mr-2" />
              Empty Chat
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                chat from your device
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
