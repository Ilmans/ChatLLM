import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "TolongAI Docs",
  description: "TolongAI is a software that can run AI models locally",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Chat App Demo', link: '/demo' }
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'What is Tolong AI?', link: '/what-is-tolong-ai' },
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Deploy', link: '/deploy' },
        ]
      },
      {
        text: 'Usage',
        items: [
          { text: 'Client-server Method', link: '/adding-new-modelss' },
          { text: 'Client-only Method (WebAssembly)', link: '/client-only-method' },
        ]
      },
      {
        text: 'Models',
        items: [
          { text: 'Adding New Models', link: '/adding-new-modelss' },
          { text: 'Compiling Models', link: '/compiling-models' },
          { text: 'Compile to WebAssembly', link: '/compile-to-webassembly' },
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
