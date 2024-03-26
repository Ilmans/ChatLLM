export interface Bot {
    id: number
    name: string
    description: string
    prompt: string
    botId?: string
    document: {
        filename: string 
        text: string
    }
    params: {
        top_p: number[],
        temperature: number[],
        frequency_penalty: number[]
        max_gen_len: number[]
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