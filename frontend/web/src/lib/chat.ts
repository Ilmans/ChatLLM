export default function chat() {
    const chat = new ChatModule();

    chat.setInitProgressCallback((report: InitProgressReport) => {
      setLabel("init-label", report.text);
    });
    console.log('loading model')
    // await chat.reload("Nous-Hermes-Llama2-13b", {
    //   conv_template: 'llama-2',
    // }, {
    //   model_list: [
    //     {
    //       local_id: "Nous-Hermes-Llama2-13b",
    //       model_url: "http://localhost:3000/Nous-Hermes-Llama2-13b-q4f16_1/params/",
    //       required_features: ['shader-f16']
    //     }
    //   ],
    //   model_lib_map: {
    //     'Nous-Hermes-Llama2-13b-q4f16_1': 'http://localhost:3000/models/Nous-Hermes-Llama2-13b-q4f16_1/Nous-Hermes-Llama2-13b-q4f16_1-webgpu.wasm',
    //   }
    // })
    // console.log('loaded')

    // const generateProgressCallback = (_step: number, message: string) => {
    //   setLabel("generate-label", message);
    // };

    // const prompt0 = "What is the capital of Canada?";
    // setLabel("prompt-label", prompt0);
    // const reply0 = await chat.generate(prompt0, generateProgressCallback);
    // console.log(reply0);

    // const prompt1 = "Can you write a poem about it?";
    // setLabel("prompt-label", prompt1);
    // const reply1 = await chat.generate(prompt1, generateProgressCallback);
    // console.log(reply1);

    // console.log(await chat.runtimeStatsText());
  }
