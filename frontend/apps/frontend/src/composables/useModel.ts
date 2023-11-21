export const useModel = () => {
    const baseUrl = "http://localhost:4200"
    const availableModels = [
      {
        local_id: "RedPajama-INCITE-Chat-3B-v1-q4f32_0",
        name: 'RedPajama Chat 3B',
        model_url: "https://huggingface.co/mlc-ai/mlc-chat-RedPajama-INCITE-Chat-3B-v1-q4f32_1-1k/resolve/main",
        conv_template: 'redpajama_chat'
      },
      {
        local_id: "Nous-Hermes-llama-2-7b-q4f32_1",
        name: 'Nous Hermes Llama 2 7B',
        model_url: baseUrl + "/models/Nous-Hermes-llama-2-7b-q4f32_1/params/",
        conv_template: 'llama-2'
      },
    ]
  
    let modelWasmMap: Record<string, string> = {}
    availableModels.forEach(model => {
      modelWasmMap[model.local_id] = baseUrl + `/models/${model.local_id}/${model.local_id}-webgpu.wasm`
    })

    return {
      modelWasmMap,
      availableModels
    }
}