mlc_llm convert_weight ../models/orca_mini_3b --quantization q4f32_1 -o dist/orca_mini_3b-q4f32_1
mlc_llm compile dist/orca_mini_3b-q4f32_1/mlc-chat-config.json --device webgpu -o dist/orca_mini_3b-q4f32_1/orca_mini_3b-q4f32_1.wasm
mlc_llm gen_config ../models/orca_mini_3b --quantization q4f32_1 -o dist/orca_mini_3b-q4f32_1 --conv-template wizardlm_7b