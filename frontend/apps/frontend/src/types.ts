export interface Bot {
    id: number
    name: string
    description: string
    prompt: string
    params: {
        top_p: number,
        temperature: number,
        repetition_penalty: number
    }
}

export type ChatRole = "bot" | "user"
export interface IChatMessage {
    botId: number
    role: ChatRole
    message: string 
    date: number 
}

export type IChat = IChatMessage[]