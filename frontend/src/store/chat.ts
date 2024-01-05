import { defineStore } from "pinia";
import { onMounted, ref } from "vue";
import type { Bot } from "../types";
import { useDb } from "../composables/useDb";

export const useChatStore = defineStore('chat', () => {
    const bots = ref<Bot[]>([])

    const fetchBots = async () => {
        const db = useDb()
        const res = await db.getBots()
        bots.value = res
        console.log(res)
    }

    onMounted(() => {
        const db = useDb()

        // Insert experimental bot
        // bots.value.forEach(b => {
        //     db.insertBot(JSON.parse(JSON.stringify(b)))
        // })
        // db.drop()
    })

    return {
        fetchBots,
        bots
    }
})