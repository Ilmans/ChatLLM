import type { Bot } from "../types";

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
                this.result.createObjectStore("bots", { autoIncrement: true, keyPath:'id' });
                this.result.createObjectStore("messages", { autoIncrement: true, keyPath:'id' });
                db = this.result
                res(this.result)
            }
        })
    }

    const getMessages = async (bot_id: number) => {
        return new Promise(async (resolve, reject) => {
            const conn = await getConnection()
            const read = conn.transaction('messages', 'readonly')
            
            const store = read.objectStore('messages')
            let result = []
            read.oncomplete = () => {
                resolve(result)
            }
            store.openCursor().onsuccess = function(e) {
                let cursor = this.result
                if (cursor) {
                    result.push(cursor.value)
                }
                cursor.continue()
            }

        })
    }

    const insertMessage = (bot_id: number, role: string, message: string) => {
        return new Promise(async (resolve, reject) => {
            const conn = await getConnection()
            const read = conn.transaction('messages', 'readwrite')
            read.oncomplete = () => {
                resolve(true)
            }
            const store = read.objectStore('messages')
            store.put({role, message})
        })
    }

    const getBots = () => {
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
                }
                cursor.continue()
            }

        })
    }

    const insertBot = (bot: Bot) => {
        return new Promise(async (resolve, reject) => {
            const conn = await getConnection()
            const read = conn.transaction('messages', 'readwrite')
            read.oncomplete = () => {
                resolve(true)
            }
            const store = read.objectStore('messages')
            store.put(bot)
        })
    }

    return {
        drop,
        closeConnection,
        getConnection,
        getMessages,
        insertMessage,
        getBots,
        insertBot
    }
}