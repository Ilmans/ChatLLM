"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react';
import { ChatModule, InitProgressReport } from "@mlc-ai/web-llm";
import { usePathname } from 'next/navigation'
import Card from '@/components/Card';
import { Box, NavLink, Navbar } from '@mantine/core';
import Logo from '@/components/Logo';
import LayoutMain from '@/components/layouts/LayoutMain';

export default function Home() {

  function setLabel(id: string, text: string) {
    const label = document.getElementById(id);
    if (label == null) {
      throw Error("Cannot find label " + id);
    }
    label.innerText = text;
  }

  async function main() {
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

  useEffect(() => {main()}, []);


  return (
    <main className='py-5'>
      <div className="container mx-auto">
        {/* <Card title='Chat App'>
          <label id="init-label"> </label>

          <h3>Prompt</h3>
          <label id="prompt-label"> </label>

          <h3>Response</h3>
          <label id="generate-label"> </label>
          <label id="stats-label"> </label>
        </Card> */}
      </div>
    </main>
  )
}
