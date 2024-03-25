import { useStorage } from "@vueuse/core";
import type { Bot, IChatMessage, ChatRole } from "../types";
import { watch, type Ref, type WatchCallback } from "vue";

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
                messageStore.createIndex('botIdIndex', "botId")
                messageStore.createIndex('dateIndex', "date")
                db = this.result
                res(this.result)
            }
        })
    }

    const getMessages = (botId: number): Promise<IChatMessage[]> => {
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
                if(cursor) {
                    if (cursor.value.botId == botId) {
                        result.push(cursor.value)
                    }
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
            const chatMessage: IChatMessage = {
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
    const activeBotId = useStorage("activeBotId", 1);

    const setActiveBotId = (id: number) => {
        activeBotId.value = id
    }

    const getActiveBotId = (): Ref<number> => {
        return activeBotId
    }

    const getActiveBot = async (): Promise<Bot> => {
        const allBots = await getBots()
        const find = allBots.find(bot => bot.id == activeBotId.value)

        if (!find) throw new Error("Bot not found"); 
        return find
    }

    const updateBot = async (data: Bot) => {
        const conn = await getConnection()
        const tx = conn.transaction('bots', 'readwrite')
        const store = tx.objectStore("bots")
        store.put(data)
    }

    const removeBotDocument = async () => {
        const conn = await getConnection()
        const currentActiveBot = await getActiveBot()
        const tx = conn.transaction('bots', 'readwrite')
        const store = tx.objectStore("bots")
        currentActiveBot.document.filename = currentActiveBot.document.text = ""
        console.log('updated bot', currentActiveBot)
        store.put(currentActiveBot)
    }

    const clearCurrentBotChat = (): Promise<void> => {
        return new Promise(async (resolve, reject) => {
            const conn = await getConnection()
            const read = conn.transaction('messages', 'readwrite')
            
            const store = read.objectStore('messages')
            let result = []
            read.oncomplete = () => {
                resolve()
            }
            store.openCursor().onsuccess = function(e) {
                let cursor = this.result
                if (cursor && cursor.value.botId == activeBotId.value) {
                    cursor.delete()
                    cursor.continue()
                }
            }

        })
    }

    return {
        activeBotId,
        drop,
        closeConnection,
        getConnection,
        getMessages,
        insertMessage,
        getBots,
        insertBot,
        getActiveBot, 
        getActiveBotId,
        setActiveBotId,
        clearCurrentBotChat,
        updateBot,
        removeBotDocument,
    }
}