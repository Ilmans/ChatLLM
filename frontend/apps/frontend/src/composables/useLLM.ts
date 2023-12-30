import { computed, ref } from "vue"
import { useDb } from "./useDb"
import { ChatModule } from "../../../../libs/web-llm"
import { useRoute, useRouter } from "vue-router"
import type { ChatRole, IChatMessage } from "@/types"
import { useModel } from "./useModel"

export const useLLM = () => {
    const db = useDb()
    
    let chat = new ChatModule

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
    
    const infer = async (text: string, cb) => {
      await chat.generate(text, cb)
    }

    const messages = ref<IChatMessage[]>([])
    const messagesPrompt = computed(() => {
      let msgs = ""
      messages.value.slice().reverse().forEach(m => {
        if(m.role == "user")
          msgs += `<human>: ${m.message}\n<bot>:`
        else 
          msgs += `${m.message}\n`
      })
      console.log("msgs",msgs)
      return msgs 
    })


    const insertMessage = (botId: number, role: ChatRole, message: string) => {
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
        messagesPrompt,
        insertMessage
    }
}