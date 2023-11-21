import { computed, ref } from "vue"
import { useDb } from "./useDb"
import { ChatModule } from "@mlc-ai/web-llm"
import { useRoute, useRouter } from "vue-router"
import type { IChatMessage } from "@/types"
import { useModel } from "./useModel"

export const useLLM = () => {
    const db = useDb()
    
    let chat = new ChatModule

    const unloadModel = async () => {
      await chat.unload()
    }

    const { availableModels, modelWasmMap } = useModel()

    // Load a model 
    const loadModel = async (model_id: string, onModelLoadingCb?: (report) => void) => {
      await chat.unload()
      if(onModelLoadingCb)
        chat.setInitProgressCallback(onModelLoadingCb);
      
      const currentModel = availableModels.find(m => m.local_id == model_id)
      console.log('load chat', onModelLoadingCb)
      
      const chatOptions = { 
        conv_template: currentModel?.conv_template, 
        conv_config: {},
      }

      await chat.reload(model_id,  chatOptions, {
        model_list: availableModels,
        model_lib_map: modelWasmMap,
      })
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
    
    return {
        loadModel,
        unloadModel,
        messages,
        infer,
        messagesPrompt
    }
}