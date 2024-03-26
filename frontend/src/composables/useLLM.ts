import { computed, ref, type ComputedRef, watch } from "vue"
import { useDb } from "./useDb"
import { ChatModule, type ChatCompletionRequest, type ChatOptions, type ChatCompletionChunk, type ChatCompletionMessageParam } from "@mlc-ai/web-llm"
import { useRoute, useRouter } from "vue-router"
import type { Bot, ChatRole, IChatMessage } from "@/types"
import { useModel } from "./useModel"
import { getDocumentPrompt } from "./useDocument"


export const useLLM = () => {
    const db = useDb()
    const activeBot = ref<Bot|null>()
    
    let chat = new ChatModule
    let isFirstLoad = true
    const conversationTemplateName = ref('llama_default')

    const unloadModel = async () => {
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
        await chat.reload(model_id, chatOptions, models)
      } catch (err) {
        throw err
      }
    }

    /**
     * Feed bot with message history and document
     */
    // const feedBot = async () => {
    //   // Load initial prompt
    //   const userRoleKey = conversationTemplate.value.config.roles[0]
    //   const botRoleKey = conversationTemplate.value.config.roles[1]

    //   // Load all message history to the first prompt
    //   console.log({isFirstLoad})
    //   if(isFirstLoad) {
    //     // Feed the document first before feeding the message history
    //     let document = activeBot.value.document?.text
        
    //     if (document && document !== "") {
          
    //       chat.pipeline.conversation.config.system = `You are an AI assistant providing helpful advice. You are given the following extracted parts of a long document and a question. Provide a conversational answer based on the context provided. You should only provide hyperlinks that reference the context below. If you can't find the answer in the context below, just say "Hmm, I'm not sure." Don't try to make up an answer. If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.`
    //       const documentPrompt = await getDocumentPrompt(document)
    //       console.log('prefilling document..')
    //       if (typeof documentPrompt == 'object') {
    //         for(let i = 0; i < documentPrompt.length; i++) {
    //           console.log('prefill no: ', i)
    //           const prefill = await chat.prefill(documentPrompt[i])
    //           chat.pipeline.triggerStop()
    //         }
    //       }
    //       console.log('finished prefilling document')
    //       // chat.pipeline.conversation.appendMessage(userRoleKey, documentPrompt)
    //     }
    //     // Feed the message history
    //     // messages.value.slice().reverse().forEach(m => {
    //     //   chat.pipeline.conversation.appendMessage(m.role == 'user' ? userRoleKey : botRoleKey, m.message)
    //     // })
    //   }
    // }
    
    const infer = async (text: ChatCompletionMessageParam[], cb: (msg: ChatCompletionChunk, i: number) => void) => {

      const request: ChatCompletionRequest = {
        stream: true,
        top_p: activeBot.value.params.top_p[0],
        max_gen_len: activeBot.value.params.max_gen_len[0],
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
      console.log(request)
      let i = 0
      for await (const chunk of await chat.chatCompletion(request)) {
        if(i == 0 && chunk.choices[0].delta.content == '\n') continue
        cb(chunk, i)
        i++ 
      }
      console.log(await chat.getMessage());  // the final response
      console.log(await chat.runtimeStatsText());

      isFirstLoad = false
    }
    
    const messages = ref<IChatMessage[]>([])
    


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
        loadModel,
        unloadModel,
        messages,
        infer,
        activeBot,
        insertMessage
    }
}