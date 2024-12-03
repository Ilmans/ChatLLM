import { ref } from "vue"
import { useDb } from "./useDb"
import { CreateMLCEngine, type ChatCompletionRequest, type ChatOptions, type ChatCompletionChunk, type ChatCompletionMessageParam, MLCEngine, prebuiltAppConfig, WebWorkerMLCEngine } from "@mlc-ai/web-llm"
import type { Bot, ChatRole, IChatMessage } from "@/types"
import { additionalModels, useModel } from "./useModel"
import { useChatStore } from "@/store/chat"


export const useLLM = () => {
    const db = useDb()
    const activeBot = ref<Bot|null>()
    const chatStore = useChatStore()
    
    let chat = new WebWorkerMLCEngine(
      new Worker(new URL("../web-worker.ts", import.meta.url), {
        type: "module",
      }),
      {
        appConfig: {
          model_list: [...prebuiltAppConfig.model_list, ...additionalModels],
          useIndexedDBCache: false, 
        },
      }
    )
    let isFirstLoad = true

    const unloadModel = async () => {
      console.log('unload model')
      await chat.unload()
    }
    
    const models = useModel()

    // Load a model 
    const loadModel = async (model_id: string, onModelLoadingCb?: (report) => void) => {
      console.log({onModelLoadingCb})
      if(onModelLoadingCb)
        chat.setInitProgressCallback(onModelLoadingCb);
            
      const chatOptions: ChatOptions = { 
        // conv_config: {},
        // repetition_penalty: activeBot.value.params.repetition_penalty[0],
        // temperature: activeBot.value.params.temperature[0],
        // top_p: activeBot.value.params.top_p[0],
      }
      try {
        console.log('model loading')
        await chat.reload(model_id)
      } catch (err) {
        throw err
      }
    }
    
    const infer = async (text: ChatCompletionMessageParam[], cb: (msg: ChatCompletionChunk, i: number) => void) => {
      console.log(activeBot.value.params)
      const request: ChatCompletionRequest = {
        stream: true,
        top_p: activeBot.value.params.top_p[0],
        max_tokens: activeBot.value.params.max_gen_len[0],
        frequency_penalty: activeBot.value.params.frequency_penalty[0],
        temperature: activeBot.value.params.temperature[0],
        messages: [
          {
            "role": "system",
            "content": activeBot.value.prompt
          },
          ...text
        ],
      };
      const chunks = chat.chat.completions.create(request)
      let i = 0
      for await (const chunk of await chunks) {
        if(i == 0 && chunk.choices[0].delta.content == '\n') continue
        cb(chunk, i)
        i++ 
      }
      console.log(await chat.getMessage());  // the final response
      console.log(await chat.runtimeStatsText());

      isFirstLoad = false
    }
    
    const messages = ref<IChatMessage[]>([])
    
    const insertBot = (bot: Bot) => {
      chatStore.bots.push(bot)
      db.insertBot(bot)
    }



    const insertMessage = (botId: number, role: ChatRole, message: string) => {
      // Insert the message to the very first index
      messages.value.unshift({
        botId: botId,
        date: Date.now(),
        message: message,
        role: role,
      })
    }
    
    return {
      insertBot,
      loadModel,
      unloadModel,
      messages,
      infer,
      activeBot,
      insertMessage
    }
}