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