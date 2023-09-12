import { createContext, useContext, useState } from "react"
import { ChatModule, InitProgressCallback, InitProgressReport, ModelRecord } from "@mlc-ai/web-llm";

interface ChatContextType {
  chat: ChatModule | null 
  loadChat: (model_id: string, onModelLoadingCb?: InitProgressCallback) => Promise<void>
  availableModels: ModelRecord[]
}

const ChatContext = createContext<ChatContextType>({} as ChatContextType)

export function ChatProvider({children}: {children: any}) {
    const [chat, setChat] = useState<ChatModule|null>(null)
    const availableModels = [
      {
        local_id: "Nous-Hermes-Llama2-13b",
        model_url: "http://localhost:3001/models/Nous-Hermes-Llama2-13b-q4f16_1/params/",
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
          'Nous-Hermes-Llama2-13b-q4f16_1': 'http://localhost:3001/models/Nous-Hermes-Llama2-13b-q4f16_1/Nous-Hermes-Llama2-13b-q4f16_1-webgpu.wasm',
        }
      })
      console.log('loaded')
  
      const generateProgressCallback = (_step: number, message: string) => {
          console.log('generate label', message)
      };
    }

    return (
        <ChatContext.Provider value={{chat, loadChat, availableModels}}>
            {children}
        </ChatContext.Provider>
    )
}

export const useChatContext = () => useContext(ChatContext)