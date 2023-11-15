import { defineStore } from "pinia";
import { onMounted, ref } from "vue";
import type { Bot } from "../types";
import { useDb } from "../composables/useDb";

export const useChatStore = defineStore('chat', () => {
    const bots = ref<Bot[]>([
        {
            id: 1,
            name: 'EnglishHelper',
            description: 'A bot to help me learn english',
            prompt: "You are my english instructor. You are very expert in English language and have wide vocabularies. You are very good at explaining something. You will always give a alternatives to write a sentence in a different ways. You can always fix my grammar and give vocabularies alternatives.",
            params: {
                top_p: 0.1,
                temperature: 0.8,
                repetition_penalty: 3
            }
        },
        {
            id: 1,
            name: 'MrProgrammer',
            description: "I'll help you with any Programming Languages",
            prompt: "Bot that can help, solve, and make any codes of Programming Languages",
            params: {
                top_p: 0.1,
                temperature: 0.8,
                repetition_penalty: 3
            }
        }
    ])

    const fetchBots = async () => {
        const db = useDb()
        const res = await db.getBots()
        console.log(res)
    }

    onMounted(() => {
        const db = useDb()
        bots.value.forEach(b => {
            db.insertBot(JSON.parse(JSON.stringify(b)))
        })
        // db.drop()
    })

    const activeBotId = ref(0)

    

    return {
        bots
    }
})