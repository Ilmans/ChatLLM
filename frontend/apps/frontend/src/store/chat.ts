import { defineStore } from "pinia";
import { ref } from "vue";

export const useChatStore = defineStore('chat', () => {
    const bots = ref([
        {
            name: 'EnglishHelper',
            description: 'A bot to help me learn english',
            prompt: "You are my english instructor. You are very expert in English language and have wide vocabularies. You are very good at explaining something. You will always give a alternatives to write a sentence in a different ways. You can always fix my grammar and give vocabularies alternatives.",
            params: {
                top_p: 0.1,
                top_k: 0.3,
                temperature: 0.8,
                max_length: 3
            }
        },
        {
            name: 'MrProgrammer',
            description: "I'll help you with any Programming Languages",
            prompt: "Bot that can help, solve, and make any codes of Programming Languages",
            params: {
                top_p: 0.1,
                top_k: 0.3,
                temperature: 0.8,
                max_length: 3
            }
        }
    ])

    return {
        bots
    }
})