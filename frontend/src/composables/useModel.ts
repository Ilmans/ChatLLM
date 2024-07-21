import type { AppConfig, ModelRecord } from '@mlc-ai/web-llm';

const baseUrl = 'http://localhost:5174';

export const useModel = (): (ModelRecord & {
  name: string;
  size: string;
  conv_template: string;
  info: {
    author: string;
    link: string;
    releaseDate: string;
    usedFor: string[];
    languageSupport?: string[];
    notes?: string;
  };
})[] => {
  return [
    {
      name: 'Llama 3 8B',
      model: 'https://huggingface.co/mlc-ai/Llama-3-8B-Instruct-q4f32_1-MLC',
      model_id: 'Llama-3-8B-Instruct-q4f32_1-MLC-1k',
      size: '7709.09',
      model_lib:
        'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/Llama-2-13b-chat-hf/Llama-2-13b-chat-hf-q4f16_1-ctx4k_cs1k-webgpu.wasm',
      vram_required_MB: 5295.7,
      conv_template: 'llama-2',
      low_resource_required: false,
      required_features: ['shader-f16'],
      info: {
        author: 'Meta',
        link: 'https://huggingface.co/meta-llama/Meta-Llama-3-8B',
        releaseDate: '2024',
        usedFor: ['General'],
        languageSupport: ['English', 'other'],
        notes: '',
      },
    },
    {
      name: 'SmolLM 1.7B',
      model:
        'https://huggingface.co/mlc-ai/https://huggingface.co/mlc-ai/SmolLM-360M-Instruct-q4f32_1-MLC',
      model_id: 'SmolLM-360M-Instruct-q4f32_1-MLC',
      model_lib:
        'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/Llama-2-70b-chat-hf/Llama-2-70b-chat-hf-q4f16_1-ctx4k_cs1k-webgpu.wasm',
      size: '1924.38',
      vram_required_MB: 1924.38,
      low_resource_required: true,
      conv_template: 'llama-2',
      required_features: ['shader-f16'],
      info: {
        author: 'Huggingface',
        link: 'https://huggingface.co/HuggingFaceTB/SmolLM-1.7B-Instruct',
        releaseDate: 'Jul 2024',
        usedFor: ['General'],
        languageSupport: ['English'],
        notes: 'The models primarily understand and generate content in English. They can produce text on a variety of topics, but the generated content may not always be factually accurate, logically consistent, or free from biases present in the training data. These models should be used as assistive tools rather than definitive sources of information.',
      },
    },
    {
      name: 'RedPajama 3B',
      model:
        "https://huggingface.co/mlc-ai/RedPajama-INCITE-Chat-3B-v1-q4f32_1-MLC",
      model_id: "RedPajama-INCITE-Chat-3B-v1-q4f32_1-MLC-1k",
      model_lib:
        modelLibURLPrefix +
        modelVersion +
        "/RedPajama-INCITE-Chat-3B-v1-q4f32_1-ctx2k_cs1k-webgpu.wasm",
      vram_required_MB: 2558.09,
      size: "2558.09",
      low_resource_required: true,
      conv_template: 'redpajama_chat',
      info: {
        author: 'Together Computer',
        link: 'https://huggingface.co/togethercomputer/RedPajama-INCITE-Chat-3B-v1',
        releaseDate: 'May 2023',
        usedFor: ['General'],
        languageSupport: ['English'],
        notes: '',
      },
    },
    {
      name: 'WizardMath 7B',
      model: 'https://huggingface.co/mlc-ai/WizardMath-7B-V1.1-q4f16_1-MLC',
      model_id: 'WizardMath-7B-V1.1-q4f16_1-MLC',
      size: '6119.02',
      model_lib:
        'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/Mistral-7B-Instruct-v0.2/Mistral-7B-Instruct-v0.2-q4f16_1-sw4k_cs1k-webgpu.wasm',
      vram_required_MB: 6079.02,
      conv_template: 'wizard_coder_or_math',
      low_resource_required: false,
      required_features: ['shader-f16'],
      info: {
        author: 'WizardLM',
        link: 'https://huggingface.co/WizardLMTeam/WizardMath-7B-V1.1',
        releaseDate: 'December 2023',
        usedFor: ['General', 'Math'],
        languageSupport: ['English'],
        notes: 'a model that not only understands the complex language of mathematics but also resolves it with an almost artisanal finesse.',
      },
    },
    {
      name: 'Qwen2 1.5B',
      model:
        'https://huggingface.co/mlc-ai/Qwen1.5-1.8B-Chat-q4f16_1-MLC/resolve/main/',
      model_id: 'Qwen2-1.5B-Instruct-q4f16_1-MLC',
      model_lib:
        'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/Qwen-1_8B-Chat/Qwen1.5-1.8B-Chat-q4f16_1-webgpu.wasm',
      vram_required_MB: 1629.75,
      size: "1629.75",
      conv_template: 'qwen',
      low_resource_required: false,
      required_features: ['shader-f16'],
      info: {
        author: 'Qwen Org',
        link: 'https://qwenlm.github.io/blog/qwen2/',
        releaseDate: 'June 2024',
        usedFor: ['General', "Math"],
        languageSupport: ['English', 'German', 'French', 'Spanish', 'Portuguese', 'Italian', 'Dutch', 'Vietnamese', 'Thai', 'Indonesian', 'Malay', 'Lao', 'Burmese', 'etc'],
        notes: 'Qwen 2 is an advanced AI model that surpasses its predecessor, Qwen 1.5, with five size options and training in 27 languages. It excels in natural language understanding, coding, and mathematics, rivalling top models like GPT-4 and LLaMA 32. Key capabilities include language versatility, code generation, and solving complex mathematical problems',
      },
    },
    {
      name: 'Phi1.5',
      model: 'https://huggingface.co/mlc-ai/phi-1_5-q4f32_1-MLC',
      model_id: 'phi-1_5-q4f32_1-MLC-1k',
      size: '1682.09',
      model_lib:
        'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/web-llm-models/v0_2_43/phi-1_5-q4f32_1-ctx2k_cs1k-webgpu.wasm',
      vram_required_MB: 1682.09,
      conv_template: 'llama-2',
      low_resource_required: true,
      info: {
        author: 'Microsoft',
        link: 'https://huggingface.co/microsoft/phi-1_5',
        releaseDate: '',
        usedFor: ['General'],
        languageSupport: ['English'],
        notes: "Given the nature of the training data, Phi-1.5 is best suited for prompts using the QA format, the chat format, and the code format. Note that Phi-1.5, being a base model, often produces irrelevant text following the main answer. In the following example, we've truncated the answer for illustrative purposes only.",
      },
    },
    {
      name: 'Phi 3',
      conv_template: '',
      size: '',
      model: "https://huggingface.co/mlc-ai/Phi-3-mini-4k-instruct-q4f32_1-MLC",
      model_id: "Phi-3-mini-4k-instruct-q4f32_1-MLC-1k",
      model_lib:
        modelLibURLPrefix +
        modelVersion +
        "/Phi-3-mini-4k-instruct-q4f32_1-ctx4k_cs1k-webgpu.wasm",
      vram_required_MB: 3179.12,
      low_resource_required: true,
      overrides: {
        context_window_size: 1024,
      },
      info: {
        author: 'Microsoft',
        link: 'https://huggingface.co/microsoft/Phi-3-mini-4k-instruct',
        releaseDate: 'June 2024',
        usedFor: ['General','Research'],
        languageSupport: ['English'],
        notes: `The model is intended for broad commercial and research use in English. The model provides uses for general purpose AI systems and applications which require
          memory/compute constrained environments;
          latency bound scenarios;
          strong reasoning (especially math and logic).
          Our model is designed to accelerate research on language and multimodal models, for use as a building block for generative AI powered features.`,
      },
    },
    // TinyLlama
    {
      name: 'TinyLlama 1.1B',
      model:
        'https://huggingface.co/mlc-ai/TinyLlama-1.1B-Chat-v1.0-q4f32_1-MLC',
      model_id: 'TinyLlama-1.1B-Chat-v1.0-q4f32_1-MLC',
      model_lib:
        'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/web-llm-models/v0_2_43/TinyLlama-1.1B-Chat-v1.0-q4f32_1-ctx2k_cs1k-webgpu.wasm',
      vram_required_MB: 992.11,
      size: '992.11',
      conv_template: 'llama-2',
      low_resource_required: true,
      info: {
        author: 'Peiyuan Zhang',
        link: 'https://github.com/jzhang38/TinyLlama',
        releaseDate: 'October 2023',
        usedFor: ['General'],
        languageSupport: ['English'],
        notes: 'Small but strong model',
      },
    },
  ];
};
const modelLibURLPrefix =
  'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/web-llm-models/';
const modelVersion = 'v0_2_48';

export const additionalModels: ModelRecord[] = [
  {
    model: 'https://huggingface.co/mlc-ai/SmolLM-360M-Instruct-q4f32_1-MLC',
    model_id: 'SmolLM-360M-Instruct-q4f32_1-MLC',
    model_lib:
      modelLibURLPrefix +
      modelVersion +
      '/SmolLM-360M-Instruct-q4f32_1-ctx2k_cs1k-webgpu.wasm',
    vram_required_MB: 419.61,
    low_resource_required: true,

    overrides: {
      context_window_size: 2048,
    },
  },
];

export const allModels = [...useModel(), ...additionalModels];
