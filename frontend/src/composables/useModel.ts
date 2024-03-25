import type { AppConfig } from "@mlc-ai/web-llm"

const baseUrl = "http://localhost:5174"


export const useModel = () => {
    return {
      "model_list": [
        {
          "model_url": "https://huggingface.co/mlc-ai/Llama-2-7b-chat-hf-q4f32_1-MLC/resolve/main/",
          "local_id": "Llama-2-7b-chat-hf-q4f32_1",
          "model_lib_url": "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/Llama-2-7b-chat-hf/Llama-2-7b-chat-hf-q4f32_1-ctx4k_cs1k-webgpu.wasm",
        },
        {
          "model_url": baseUrl+ "/models/Llama-2-7b-chat-hf-q4f16_1/params/",
          "local_id": "Llama-2-7b-chat-hf-q4f16_1",
          "model_lib_url": baseUrl+ "/models/Llama-2-7b-chat-hf-q4f16_1/Llama-2-7b-chat-hf-q4f16_1-webgpu.wasm",
          "required_features": ["shader-f16"],
        },
        {
          "model_url": baseUrl+ "/models/orca_mini_3b-q4f32_1/",
          "local_id": "orca_mini_3b-q4f16_1",
          "model_lib_url": baseUrl+ "/models/orca_mini_3b-q4f16_1/orca_mini_3b-q4f32_1-webgpu.wasm",
          "required_features": ["shader-f16"],
        },
        // {
        //   "model_url": "https://huggingface.co/mlc-ai/Llama-2-7b-chat-hf-q4f16_1-MLC/resolve/main/",
        //   "local_id": "Llama-2-7b-chat-hf-q4f16_1",
        //   "model_lib_url": "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/Llama-2-7b-chat-hf/Llama-2-7b-chat-hf-q4f16_1-ctx4k_cs1k-webgpu.wasm",
        //   "required_features": ["shader-f16"],
        // },
        {
          "model_url": "https://huggingface.co/mlc-ai/Llama-2-13b-chat-hf-q4f16_1-MLC/resolve/main/",
          "local_id": "Llama-2-13b-chat-hf-q4f16_1",
          "model_lib_url": "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/Llama-2-13b-chat-hf/Llama-2-13b-chat-hf-q4f16_1-ctx4k_cs1k-webgpu.wasm",
          "required_features": ["shader-f16"],
        },
        {
          "model_url": "https://huggingface.co/mlc-ai/Llama-2-70b-chat-hf-q4f16_1-MLC/resolve/main/",
          "local_id": "Llama-2-70b-chat-hf-q4f16_1",
          "model_lib_url": "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/Llama-2-70b-chat-hf/Llama-2-70b-chat-hf-q4f16_1-ctx4k_cs1k-webgpu.wasm",
          "required_features": ["shader-f16"],
        },
        {
          "model_url": "https://huggingface.co/mlc-ai/RedPajama-INCITE-Chat-3B-v1-q4f16_1-MLC/resolve/main/",
          "local_id": "RedPajama-INCITE-Chat-3B-v1-q4f16_1",
          "model_lib_url": "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/RedPajama-INCITE-Chat-3B-v1/RedPajama-INCITE-Chat-3B-v1-q4f16_1-ctx2k-webgpu.wasm",
          "required_features": ["shader-f16"],
        },
        {
          "model_url": "https://huggingface.co/mlc-ai/RedPajama-INCITE-Chat-3B-v1-q4f32_1-MLC/resolve/main/",
          "local_id": "RedPajama-INCITE-Chat-3B-v1-q4f32_1",
          "model_lib_url": "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/RedPajama-INCITE-Chat-3B-v1/RedPajama-INCITE-Chat-3B-v1-q4f32_1-ctx2k-webgpu.wasm",
        },
        {
          "model_url": "https://huggingface.co/mlc-ai/WizardMath-7B-V1.1-q4f16_1-MLC/resolve/main/",
          "local_id": "WizardMath-7B-V1.1-q4f16_1",
          "model_lib_url": "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/Mistral-7B-Instruct-v0.2/Mistral-7B-Instruct-v0.2-q4f16_1-sw4k_cs1k-webgpu.wasm",
          "required_features": ["shader-f16"],
        },
        {
          "model_url": "https://huggingface.co/mlc-ai/Mistral-7B-Instruct-v0.2-q4f16_1-MLC/resolve/main/",
          "local_id": "Mistral-7B-Instruct-v0.2-q4f16_1",
          "model_lib_url": "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/Mistral-7B-Instruct-v0.2/Mistral-7B-Instruct-v0.2-q4f16_1-sw4k_cs1k-webgpu.wasm",
          "required_features": ["shader-f16"],
        },
        {
          "model_url": "https://huggingface.co/mlc-ai/OpenHermes-2.5-Mistral-7B-q4f16_1-MLC/resolve/main/",
          "local_id": "OpenHermes-2.5-Mistral-7B-q4f16_1",
          "model_lib_url": "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/Mistral-7B-Instruct-v0.2/Mistral-7B-Instruct-v0.2-q4f16_1-sw4k_cs1k-webgpu.wasm",
          "required_features": ["shader-f16"],
        },
        {
          "model_url": "https://huggingface.co/mlc-ai/NeuralHermes-2.5-Mistral-7B-q4f16_1-MLC/resolve/main/",
          "local_id": "NeuralHermes-2.5-Mistral-7B-q4f16_1",
          "model_lib_url": "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/Mistral-7B-Instruct-v0.2/Mistral-7B-Instruct-v0.2-q4f16_1-sw4k_cs1k-webgpu.wasm",
          "required_features": ["shader-f16"],
        },
        // Models below fit for 128MB buffer limit (e.g. webgpu on Android)
        {
          "model_url": "https://huggingface.co/mlc-ai/Llama-2-7b-chat-hf-q4f16_1-MLC/resolve/main/",
          "local_id": "Llama-2-7b-chat-hf-q4f16_1-1k",
          "model_lib_url": "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/Llama-2-7b-chat-hf/Llama-2-7b-chat-hf-q4f16_1-ctx1k-webgpu.wasm",
          "required_features": ["shader-f16"],
        },
        {
          "model_url": "https://huggingface.co/mlc-ai/RedPajama-INCITE-Chat-3B-v1-q4f16_1-MLC/resolve/main/",
          "local_id": "RedPajama-INCITE-Chat-3B-v1-q4f16_1-1k",
          "model_lib_url": "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/RedPajama-INCITE-Chat-3B-v1/RedPajama-INCITE-Chat-3B-v1-q4f16_1-ctx1k-webgpu.wasm",
          "required_features": ["shader-f16"],
        },
        {
          "model_url": "https://huggingface.co/mlc-ai/RedPajama-INCITE-Chat-3B-v1-q4f32_1-MLC/resolve/main/",
          "local_id": "RedPajama-INCITE-Chat-3B-v1-q4f32_1-1k",
          "model_lib_url": "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/RedPajama-INCITE-Chat-3B-v1/RedPajama-INCITE-Chat-3B-v1-q4f32_1-ctx1k-webgpu.wasm",
        },
      ],
      "model_lib_map": {
        "Llama-2-7b-chat-hf-q4f32_1": "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/Llama-2-7b-chat-hf-q4f32_1-webgpu.wasm",
        "Llama-2-13b-chat-hf-q4f32_1": "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/Llama-2-13b-chat-hf-q4f32_1-webgpu.wasm",
        "Llama-2-7b-chat-hf-q4f16_1": "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/Llama-2-7b-chat-hf-q4f16_1-webgpu.wasm",
        "Llama-2-13b-chat-hf-q4f16_1": "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/Llama-2-13b-chat-hf-q4f16_1-webgpu.wasm",
        "Llama-2-70b-chat-hf-q4f16_1": "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/Llama-2-70b-chat-hf-q4f16_1-webgpu.wasm",
        "vicuna-v1-7b-q4f32_0": "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/vicuna-v1-7b-q4f32_0-webgpu-v1.wasm",
        "RedPajama-INCITE-Chat-3B-v1-q4f32_1": "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/RedPajama-INCITE-Chat-3B-v1-q4f32_1-webgpu.wasm",
        "RedPajama-INCITE-Chat-3B-v1-q4f16_1": "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/RedPajama-INCITE-Chat-3B-v1-q4f16_1-webgpu.wasm",
        "WizardCoder-15B-V1.0-q4f16_1": "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/WizardCoder-15B-V1.0-q4f16_1-webgpu.wasm",
        "WizardCoder-15B-V1.0-q4f32_1": "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/WizardCoder-15B-V1.0-q4f32_1-webgpu.wasm",
        "WizardMath-7B-V1.0-q4f16_1": "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/Llama-2-7b-chat-hf-q4f16_1-webgpu.wasm",
        "WizardMath-7B-V1.0-q4f32_1": "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/Llama-2-7b-chat-hf-q4f32_1-webgpu.wasm",
        "WizardMath-13B-V1.0-q4f16_1": "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/Llama-2-13b-chat-hf-q4f16_1-webgpu.wasm",
        "WizardMath-70B-V1.0-q4f16_1": "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/Llama-2-70b-chat-hf-q4f16_1-webgpu.wasm",
        "Mistral-7B-Instruct-v0.1-q4f16_1": "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/Mistral-7B-Instruct-v0.1-q4f16_1-sw4096_cs1024-webgpu.wasm",
        "Mistral-7B-Instruct-v0.1-q4f32_1": "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/Mistral-7B-Instruct-v0.1-q4f32_1-sw4096_cs1024-webgpu.wasm",
        // Models below fit for 128MB buffer limit (e.g. webgpu on Android)
        "Llama-2-7b-chat-hf-q4f16_1-1k": "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/Llama-2-7b-chat-hf-q4f16_1-1k-webgpu.wasm",
        "RedPajama-INCITE-Chat-3B-v1-q4f16_1-1k": "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/RedPajama-INCITE-Chat-3B-v1-q4f16_1-1k-webgpu.wasm",
        "RedPajama-INCITE-Chat-3B-v1-q4f32_1-1k": "https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/RedPajama-INCITE-Chat-3B-v1-q4f32_1-1k-webgpu.wasm",
      },
      "use_web_worker": true
    }
}