import { createContext, useContext, useState } from "react"
import { ChatModule, InitProgressReport } from "@mlc-ai/web-llm";

interface ChatContextType {
  chat: ChatModule | null 
  loadChat: () => Promise<void>
}

const ChatContext = createContext<ChatContextType>({} as ChatContextType)

export function ChatProvider({children}: {children: any}) {
    const [chat, setChat] = useState<ChatModule|null>(null)

    const loadChat = async () => {
       console.log('load chat')
        const newChat = new ChatModule()

        newChat.setInitProgressCallback((report: InitProgressReport) => {
          console.log(report.text)
        });

        await newChat.reload("Nous-Hermes-Llama2-13b", {
              conv_template: 'llama-2',
            }, {
              model_list: [
                {
                  local_id: "Nous-Hermes-Llama2-13b",
                  model_url: "http://localhost:3001/models/Nous-Hermes-Llama2-13b-q4f16_1/params/",
                  required_features: ['shader-f16']
                }
              ],
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
        <ChatContext.Provider value={{chat, loadChat}}>
            {children}
        </ChatContext.Provider>
    )
}

export const useChatContext = () => useContext(ChatContext)