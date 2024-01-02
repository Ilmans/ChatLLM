export interface Bot {
    id: number
    name: string
    description: string
    prompt: string
    document: {
        filename: string 
        text: string
    }
    params: {
        top_p: number | number[],
        temperature: number | number[],
        repetition_penalty: number | number[]
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