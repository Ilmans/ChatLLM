import { createContext, useContext, useState } from "react"
import { ChatModule, InitProgressCallback, InitProgressReport, ModelRecord } from "@mlc-ai/web-llm";
import { GenerateProgressCallback } from "@mlc-ai/web-llm/lib/types";


interface ChatContextType {
  chat: ChatModule | null 
  loadChat: (model_id: string, onModelLoadingCb?: InitProgressCallback) => Promise<void>
  unloadModel: () => Promise<void>
  availableModels: ModelRecord[]
  sendMessage: (message: string, cb: GenerateProgressCallback) => Promise<string>
  runtimeStatsText: () => Promise<string|undefined>
}

const ChatContext = createContext<ChatContextType>({} as ChatContextType)

export function ChatProvider({children}: {children: any}) {
  const baseUrl = window.location.protocol + '//' + window.location.host

  const [chat, setChat] = useState<ChatModule>(new ChatModule())
  const availableModels = [
    {
      local_id: "Nous-Hermes-Llama2-13b-q4f16_1",
      model_url: baseUrl + "/models/Nous-Hermes-Llama2-13b-q4f16_1/params/",
      required_features: ['shader-f16'],
      conv_template: 'llama-2'
    },
    {
      local_id: "RedPajama-INCITE-Chat-3B-v1-q4f16_1",
      model_url: baseUrl + "/models/RedPajama-INCITE-Chat-3B-v1-q4f16_1/params/",
      required_features: ['shader-f16'],
      conv_template: 'redpajama_chat'
    },
    {
      local_id: "RedPajama-INCITE-Chat-3B-v1-q4f32_0",
      model_url: baseUrl + "/models/RedPajama-INCITE-Chat-3B-v1-q4f32_0/params/",
      conv_template: 'redpajama_chat'
    },
    {
      local_id: "Llama-2-7b-chat-hf-q4f16_1",
      model_url: baseUrl + "/models/Llama-2-7b-chat-hf-q4f16_1/params/",
      required_features: ['shader-f16'],
      conv_template: 'llama-2'
    },
  ]

  let modelWasmMap: Record<string, string> = {}
  availableModels.forEach(model => {
    modelWasmMap[model.local_id] = baseUrl + `/models/${model.local_id}/${model.local_id}-webgpu.wasm`
  })

  // Load a model 
  const loadChat = async (model_id: string, onModelLoadingCb?: (report: InitProgressReport) => void) => {
    await chat.unload()
    if(onModelLoadingCb)
      chat.setInitProgressCallback(onModelLoadingCb);

    const currentModel = availableModels.find(m => m.local_id == model_id)
    console.log('load chat', onModelLoadingCb)
    await chat.reload(model_id, { conv_template: currentModel?.conv_template, }, {
      model_list: availableModels,
      model_lib_map: modelWasmMap,
    })
  }


  const sendMessage = async (message: string, cb: GenerateProgressCallback) => {
    return await chat?.generate(message, cb)!
  }

  const runtimeStatsText = async () => {
    return await chat?.runtimeStatsText()
  }

  const unloadModel = async () => {
    return await chat?.unload()
  }

  return (
      <ChatContext.Provider value={{chat, unloadModel, loadChat, availableModels, sendMessage, runtimeStatsText}}>
          {children}
      </ChatContext.Provider>
  )
}

export const useChatContext = () => useContext(ChatContext)