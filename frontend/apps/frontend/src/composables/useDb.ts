import { useStorage } from "@vueuse/core";
import type { Bot, ChatMessage, ChatRole } from "../types";
import type { Ref } from "vue";

const DB_VERSION = 1
const DB_NAME = "llm"
let db: IDBDatabase;

export const useDb = () => {
    const closeConnection = () => {
        if(!db) return 
        db.close()    
    }
    const drop = () => {
        indexedDB.deleteDatabase(DB_NAME)    
    }
    const getConnection = (): Promise<IDBDatabase> => {
        return new Promise((res, rej) => {
            if (db) return res(db) 
            const request = window.indexedDB.open(DB_NAME, DB_VERSION)
            request.onerror = () => {
                console.log('Error connecting to database')
                return rej(false) 
            }
            request.onsuccess = function (e) {
                console.log('Database connected!')
                db = this.result
                return res(this.result)
            }
            request.onupgradeneeded = function(e) {
                console.log('Upgrade needed')
                this.result.createObjectStore("bots", {autoIncrement: true, keyPath: 'id'});
                const messageStore = this.result.createObjectStore("messages", {autoIncrement: true, keyPath: 'id'});
                messageStore.createIndex('botIdIndex', "bot_id")
                messageStore.createIndex('dateIndex', "date")
                db = this.result
                res(this.result)
            }
        })
    }

    const getMessages = (bot_id: number): Promise<ChatMessage[]> => {
        return new Promise(async (resolve, reject) => {
            const conn = await getConnection()
            const read = conn.transaction('messages', 'readonly')
            
            const store = read.objectStore('messages')
            let result = []
            read.oncomplete = () => {
                resolve(result.reverse())
            }
            store.openCursor().onsuccess = function(e) {
                let cursor = this.result
                if (cursor) {
                    result.push(cursor.value)
                    cursor.continue()
                }
            }

        })
    }

    const insertMessage = (botId: number, role: ChatRole, message: string) => {
        return new Promise(async (resolve, reject) => {
            const conn = await getConnection()
            const read = conn.transaction('messages', 'readwrite')
            read.oncomplete = () => {
                resolve(true)
            }
            const chatMessage: ChatMessage = {
                botId: botId,
                date: Date.now(),
                message,
                role: role
            } 
            const store = read.objectStore('messages')
            store.put(chatMessage)
        })
    }

    const getBots = (): Promise<Bot[]> => {
        return new Promise(async (resolve, reject) => {
            const conn = await getConnection()
            const read = conn.transaction(['bots'], 'readonly')
            
            const store = read.objectStore('bots')
            let result = []
            read.oncomplete = () => {
                resolve(result)
            }
            store.openCursor().onsuccess = function(e) {
                let cursor = this.result
                if (cursor) {
                    result.push(cursor.value)
                    cursor.continue()
                }
            }

        })
    }

    const insertBot = (bot: Bot) => {
        return new Promise(async (resolve, reject) => {
            const conn = await getConnection()
            const read = conn.transaction('bots', 'readwrite')
            read.oncomplete = () => {
                console.log("Insert success")
                resolve(true)
            }
            const store = read.objectStore('bots')
            store.put(bot)
        })
    }
    const activeBot = useStorage("activeBotId", 1);

    const setActiveBot = (id: number) => {
        activeBot.value = id
    }

    const getActiveBotId = (): Ref<number> => {
        return activeBot
    }

    const getActiveBot = async (): Promise<Bot> => {
        const allBots = await getBots()
        const find = allBots.find(bot => bot.id == activeBot.value)

        if (!find) throw new Error("Bot not found"); 
        return find
    }

    return {
        drop,
        closeConnection,
        getConnection,
        getMessages,
        insertMessage,
        getBots,
        insertBot,
        getActiveBot, 
        getActiveBotId,
        setActiveBot
    }
}