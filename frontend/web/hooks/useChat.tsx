import { createContext, useContext, useState } from "react"
import { ChatModule, InitProgressCallback, InitProgressReport, ModelRecord } from "@mlc-ai/web-llm";
import { GenerateProgressCallback } from "@mlc-ai/web-llm/lib/types";

interface ChatContextType {
  chat: ChatModule | null 
  loadChat: (model_id: string, onModelLoadingCb?: InitProgressCallback) => Promise<void>
  availableModels: ModelRecord[],
  sendMessage: (message: string, cb: GenerateProgressCallback) => Promise<string>
  runtimeStatsText: () => Promise<string|undefined>
}

const ChatContext = createContext<ChatContextType>({} as ChatContextType)

export function ChatProvider({children}: {children: any}) {
  const baseUrl = window.location.protocol + '//' + window.location.host

  const [chat, setChat] = useState<ChatModule|null>(null)
  const availableModels = [
    {
      local_id: "Nous-Hermes-Llama2-13b",
      model_url: baseUrl + "/models/Nous-Hermes-Llama2-13b-q4f16_1/params/",
      required_features: ['shader-f16']
    }
  ]

  const loadChat = async (model_id: string, onModelLoadingCb?: (report: InitProgressReport) => void) => {
    const newChat = new ChatModule()
    
    if(onModelLoadingCb)
      newChat.setInitProgressCallback(onModelLoadingCb);
  
    console.log('load chat', onModelLoadingCb)
    await newChat.reload(model_id, { conv_template: 'llama-2' }, {
      model_list: availableModels,
      model_lib_map: {
        'Nous-Hermes-Llama2-13b-q4f16_1': baseUrl + '/models/Nous-Hermes-Llama2-13b-q4f16_1/Nous-Hermes-Llama2-13b-q4f16_1-webgpu.wasm',
      }
    })
    console.log('loaded')

    setChat(newChat)
  }

  const sendMessage = async (message: string, cb: GenerateProgressCallback) => {
    return await chat?.generate(message, cb)!
  }

  const runtimeStatsText = async () => {
    return await chat?.runtimeStatsText()
  }

  return (
      <ChatContext.Provider value={{chat, loadChat, availableModels, sendMessage, runtimeStatsText}}>
          {children}
      </ChatContext.Provider>
  )
}

export const useChatContext = () => useContext(ChatContext)