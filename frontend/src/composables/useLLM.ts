import { computed, ref } from "vue"
import { useDb } from "./useDb"
import { ChatModule } from "../../libs/web-llm"
import { useRoute, useRouter } from "vue-router"
import type { Bot, ChatRole, IChatMessage } from "@/types"
import { useModel } from "./useModel"
import { getPrompt } from "./useDocument"


export const useLLM = () => {
    const db = useDb()
    const activeBot = ref<Bot|null>()
    
    let chat = new ChatModule
    let isFirstLoad = true

    const unloadModel = async () => {
      await chat.unload()
    }
    
    const models = useModel()

    // Load a model 
    const loadModel = async (model_id: string, onModelLoadingCb?: (report) => void) => {
      await chat.unload()
      if(onModelLoadingCb)
        chat.setInitProgressCallback(onModelLoadingCb);
      
      const currentModel = models.model_list.find(m => m.local_id == model_id)
      
      const chatOptions = { 
        conv_template: "redpajama_chat", 
        conv_config: {},
      }

      await chat.reload(model_id,  chatOptions, models)
    }

    const getMessagePrompt = async (input: string) => {
      let msgs = ""

      // Load document if provided to the bot
      let document = activeBot.value.document.text
      if (document !== "") {
        msgs = await getPrompt(document, input)
      }

      // Load initial prompt

      // Load all message history to the first prompt
      if(isFirstLoad) {
        messages.value.slice().reverse().forEach(m => {
          if(m.role == "user")
            msgs += `<human>: ${m.message}\n<bot>:`
          else 
            msgs += `${m.message}\n`
        })
      }


      console.log("msgs",msgs)
      return msgs 
    }
    
    const infer = async (text: string, cb) => {
      const prompt = await getMessagePrompt(text)
      console.log(prompt)
      await chat.generate(prompt, cb)
    }
    
    const messages = ref<IChatMessage[]>([])
    


    const insertMessage = (botId: number, role: ChatRole, message: string) => {
      isFirstLoad = false
      // Insert the message to the very first index
      messages.value.unshift({
        botId: botId,
        date: Date.now(),
        message: message,
        role: role
      })
    }
    
    return {
        loadModel,
        unloadModel,
        messages,
        infer,
        activeBot,
        insertMessage
    }
}